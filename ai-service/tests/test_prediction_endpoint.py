import os
import json
import base64
import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app
from app.services.observability.metrics_service import metrics_state, reset_prediction_metrics
from app.services.inference.model_registry_store import set_active_cnn_model_version
from app.services.security.rate_limit_service import reset_rate_limit_state


class PredictionEndpointTests(unittest.TestCase):
    VALID_PNG_BASE64 = (
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8A"
        "An8B9p87sQAAAABJRU5ErkJggg=="
    )

    @staticmethod
    def _write_model_artifact(model_dir: Path, version: str) -> None:
        model_file = model_dir / f"cnn_{version}.json"
        model_file.write_text(
            '{"weights":[1.0,0.0,0.0],"bias":0.0,"threshold":0.5,"feature_version":"v1"}',
            encoding="utf-8",
        )

    def setUp(self) -> None:
        reset_prediction_metrics()
        reset_rate_limit_state()
        os.environ["AI_RATE_LIMIT_REQUESTS"] = "30"
        os.environ["AI_RATE_LIMIT_WINDOW_SECONDS"] = "60"
        os.environ.pop("AI_ACTIVE_MODEL_MANIFEST_PATH", None)
        os.environ["AI_REQUIRE_API_KEY"] = "false"
        os.environ["AI_PROTECT_METRICS_ENDPOINT"] = "false"
        os.environ["AI_METRICS_INTERNAL_ONLY"] = "false"
        os.environ["AI_METRICS_ALLOWED_CIDRS"] = "127.0.0.1/32,::1/128"
        os.environ.pop("AI_API_KEY", None)
        os.environ["AI_MAX_REQUEST_BODY_BYTES"] = str(12 * 1024 * 1024)
        self.client = TestClient(app)

    def test_process_prediction_happy_path(self) -> None:
        response = self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "cnn",
            },
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("result", payload)
        self.assertIn("modelVersion", payload["result"])
        self.assertEqual(metrics_state["prediction_requests_total"], 1)
        self.assertEqual(metrics_state["prediction_requests_error_total"], 0)

    def test_process_prediction_should_accept_data_uri_base64(self) -> None:
        response = self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": f"data:image/png;base64,{self.VALID_PNG_BASE64}",
                "modelType": "cnn",
            },
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("result", payload)
        self.assertGreaterEqual(payload["result"]["confidence"], 0.0)
        self.assertLessEqual(payload["result"]["confidence"], 1.0)

    def test_process_prediction_should_accept_image_jpg_alias(self) -> None:
        jpeg_like_base64 = base64.b64encode(b"\xff\xd8\xff" + (b"\x00" * 32)).decode("ascii")
        response = self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.jpg",
                "mimeType": "image/jpg",
                "imageBase64": jpeg_like_base64,
                "modelType": "cnn",
            },
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn(payload["result"]["riskLevel"], ["low", "medium", "high"])
        self.assertIn(payload["result"]["finding"], ["lesion_probable", "sin_hallazgo_relevante"])

    def test_process_prediction_should_fail_with_invalid_base64(self) -> None:
        response = self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": "invalid--base64",
                "modelType": "cnn",
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "Contenido de imagen invalido")
        self.assertEqual(response.json()["errorType"], "invalid_image_payload")
        self.assertEqual(response.json()["errors"], [])
        self.assertEqual(metrics_state["prediction_requests_total"], 1)
        self.assertEqual(metrics_state["prediction_requests_error_total"], 1)

    def test_process_prediction_should_require_api_key_when_enabled(self) -> None:
        os.environ["AI_REQUIRE_API_KEY"] = "true"
        os.environ["AI_API_KEY"] = "test-api-key"

        unauthorized_response = self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "cnn",
            },
        )
        authorized_response = self.client.post(
            "/ai/predictions/process",
            headers={"x-api-key": "test-api-key"},
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "cnn",
            },
        )

        self.assertEqual(unauthorized_response.status_code, 401)
        self.assertEqual(unauthorized_response.json()["errorType"], "unauthorized")
        self.assertEqual(authorized_response.status_code, 200)

    def test_process_prediction_should_reject_tenant_mismatch_when_auth_enabled(self) -> None:
        os.environ["AI_REQUIRE_API_KEY"] = "true"
        os.environ["AI_API_KEY"] = "test-api-key"

        response = self.client.post(
            "/ai/predictions/process",
            headers={"x-api-key": "test-api-key", "x-tenant-id": "tenant-header"},
            json={
                "tenantId": "tenant-payload",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "cnn",
            },
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["errorType"], "tenant_mismatch")

    def test_metrics_endpoint_should_require_api_key_when_metrics_protection_enabled(self) -> None:
        os.environ["AI_PROTECT_METRICS_ENDPOINT"] = "true"
        os.environ["AI_API_KEY"] = "metrics-key"

        unauthorized_response = self.client.get("/metrics")
        authorized_response = self.client.get("/metrics", headers={"x-api-key": "metrics-key"})

        self.assertEqual(unauthorized_response.status_code, 401)
        self.assertEqual(unauthorized_response.json()["errorType"], "unauthorized")
        self.assertEqual(authorized_response.status_code, 200)

    def test_metrics_endpoint_should_restrict_access_to_internal_network_when_enabled(self) -> None:
        os.environ["AI_METRICS_INTERNAL_ONLY"] = "true"
        os.environ["AI_METRICS_ALLOWED_CIDRS"] = "127.0.0.1/32"

        response = self.client.get("/metrics")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["errorType"], "metrics_access_forbidden")

    def test_process_prediction_should_reject_payload_too_large_by_content_length(self) -> None:
        os.environ["AI_MAX_REQUEST_BODY_BYTES"] = "64"
        response = self.client.post(
            "/ai/predictions/process",
            headers={"content-length": "1024"},
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "cnn",
            },
        )

        self.assertEqual(response.status_code, 413)
        self.assertEqual(response.json()["errorType"], "payload_too_large")

    def test_metrics_endpoint_should_expose_prediction_metrics(self) -> None:
        self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "cnn",
            },
        )

        response = self.client.get("/metrics")

        self.assertEqual(response.status_code, 200)
        self.assertIn("ai_prediction_requests_total 1", response.text)
        self.assertIn("ai_prediction_requests_error_total 0", response.text)
        self.assertIn("ai_prediction_requests_p50_duration_ms", response.text)
        self.assertIn("ai_prediction_requests_p95_duration_ms", response.text)
        self.assertIn('ai_prediction_requests_by_model_version_total{model_version="cnn:cnn-0.1.0"} 1', response.text)

    def test_metrics_should_group_errors_by_type(self) -> None:
        self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": "invalid--base64",
                "modelType": "cnn",
            },
        )

        response = self.client.get("/metrics")

        self.assertEqual(response.status_code, 200)
        self.assertIn('ai_prediction_errors_by_type_total{error_type="invalid_image_payload"} 1', response.text)

    def test_process_prediction_should_fail_when_mime_type_does_not_match_content(self) -> None:
        response = self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/jpeg",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "cnn",
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()["detail"],
            "El mimeType no coincide con el contenido de la imagen",
        )
        self.assertEqual(response.json()["errorType"], "mime_type_mismatch")
        self.assertEqual(response.json()["errors"], [])

    def test_metrics_should_group_mime_mismatch_error_type(self) -> None:
        self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/jpeg",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "cnn",
            },
        )

        response = self.client.get("/metrics")

        self.assertEqual(response.status_code, 200)
        self.assertIn('ai_prediction_errors_by_type_total{error_type="mime_type_mismatch"} 1', response.text)

    def test_process_prediction_should_return_429_when_rate_limit_is_exceeded(self) -> None:
        os.environ["AI_RATE_LIMIT_REQUESTS"] = "1"
        os.environ["AI_RATE_LIMIT_WINDOW_SECONDS"] = "60"
        headers = {"x-tenant-id": "tenant-rate-limit"}

        first_response = self.client.post(
            "/ai/predictions/process",
            headers=headers,
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "cnn",
            },
        )
        second_response = self.client.post(
            "/ai/predictions/process",
            headers=headers,
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "cnn",
            },
        )

        self.assertEqual(first_response.status_code, 200)
        self.assertEqual(second_response.status_code, 429)
        self.assertEqual(
            second_response.json()["detail"],
            "Limite de solicitudes excedido. Intenta nuevamente en breve.",
        )
        self.assertEqual(second_response.json()["errorType"], "rate_limit_exceeded")
        self.assertEqual(second_response.json()["errors"], [])

        metrics_response = self.client.get("/metrics")
        self.assertIn('ai_prediction_errors_by_type_total{error_type="rate_limit_exceeded"} 1', metrics_response.text)

    def test_process_prediction_should_use_active_model_version_from_manifest(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            try:
                manifest_path = temp_path / "active_model.json"
                os.environ["AI_ACTIVE_MODEL_MANIFEST_PATH"] = str(manifest_path)
                os.environ["AI_MODEL_OUTPUT_DIR"] = temp_dir
                self._write_model_artifact(temp_path, "cnn-0.9.0")
                set_active_cnn_model_version("cnn-0.9.0", "test_activation")

                response = self.client.post(
                    "/ai/predictions/process",
                    json={
                        "tenantId": "tenant-1",
                        "patientId": "patient-1",
                        "encounterId": "encounter-1",
                        "imageName": "image.png",
                        "mimeType": "image/png",
                        "imageBase64": self.VALID_PNG_BASE64,
                        "modelType": "cnn",
                    },
                )

                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json()["result"]["modelVersion"], "cnn:cnn-0.9.0")
            finally:
                os.environ.pop("AI_ACTIVE_MODEL_MANIFEST_PATH", None)
                os.environ.pop("AI_MODEL_OUTPUT_DIR", None)

    def test_metrics_should_expose_accuracy_precision_and_recall_for_active_model(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            try:
                os.environ["AI_MODEL_OUTPUT_DIR"] = temp_dir
                os.environ["AI_ACTIVE_MODEL_MANIFEST_PATH"] = str(temp_path / "active_model.json")
                self._write_model_artifact(temp_path, "cnn-0.4.0")
                set_active_cnn_model_version("cnn-0.4.0", "test_quality_metrics")

                report_path = temp_path / "cnn_cnn-0.4.0_metrics.json"
                report_path.write_text(
                    json.dumps(
                        {
                            "modelVersion": "cnn-0.4.0",
                            "generatedAtUtc": "2026-01-01T00:00:00+00:00",
                            "metrics": {"accuracy": 0.91, "precision": 0.88, "recall": 0.86},
                        }
                    ),
                    encoding="utf-8",
                )

                response = self.client.get("/metrics")

                self.assertEqual(response.status_code, 200)
                self.assertIn('ai_model_accuracy{model_version="cnn-0.4.0"} 0.91', response.text)
                self.assertIn('ai_model_precision{model_version="cnn-0.4.0"} 0.88', response.text)
                self.assertIn('ai_model_recall{model_version="cnn-0.4.0"} 0.86', response.text)
            finally:
                os.environ.pop("AI_MODEL_OUTPUT_DIR", None)
                os.environ.pop("AI_ACTIVE_MODEL_MANIFEST_PATH", None)


if __name__ == "__main__":
    unittest.main()
