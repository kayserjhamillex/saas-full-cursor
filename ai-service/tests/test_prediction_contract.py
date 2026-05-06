import os
import unittest

from fastapi.testclient import TestClient

from app.main import app
from app.services.security.rate_limit_service import reset_rate_limit_state


class PredictionContractTests(unittest.TestCase):
    VALID_PNG_BASE64 = (
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8A"
        "An8B9p87sQAAAABJRU5ErkJggg=="
    )

    def setUp(self) -> None:
        reset_rate_limit_state()
        self.client = TestClient(app)

    def test_prediction_success_response_contract(self) -> None:
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

        expected_top_level_keys = {
            "tenantId",
            "patientId",
            "encounterId",
            "imageName",
            "mimeType",
            "modelType",
            "result",
        }
        self.assertEqual(set(payload.keys()), expected_top_level_keys)

        result = payload["result"]
        expected_result_keys = {
            "finding",
            "confidence",
            "riskLevel",
            "recommendations",
            "processingMs",
            "modelVersion",
            "segmentation",
        }
        self.assertEqual(set(result.keys()), expected_result_keys)
        self.assertIsInstance(result["confidence"], float)
        self.assertIsInstance(result["recommendations"], list)
        self.assertIsInstance(result["processingMs"], int)
        self.assertIn(result["riskLevel"], ["low", "medium", "high"])

    def test_prediction_request_contract_should_fail_when_required_field_missing(self) -> None:
        response = self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "modelType": "cnn",
            },
        )

        self.assertEqual(response.status_code, 422)
        payload = response.json()
        self.assertIn("detail", payload)
        self.assertEqual(payload["detail"], "Payload de solicitud invalido")
        self.assertEqual(payload["errorType"], "request_validation_error")
        self.assertIn("errors", payload)
        self.assertIsInstance(payload["errors"], list)
        self.assertTrue(any("imageBase64" in str(item) for item in payload["errors"]))
        self.assertEqual(set(payload.keys()), {"detail", "errorType", "errors"})

    def test_prediction_request_contract_should_fail_for_invalid_model_type(self) -> None:
        response = self.client.post(
            "/ai/predictions/process",
            json={
                "tenantId": "tenant-1",
                "patientId": "patient-1",
                "encounterId": "encounter-1",
                "imageName": "image.png",
                "mimeType": "image/png",
                "imageBase64": self.VALID_PNG_BASE64,
                "modelType": "random-forest",
            },
        )

        self.assertEqual(response.status_code, 422)
        payload = response.json()
        self.assertIn("detail", payload)
        self.assertEqual(payload["detail"], "Payload de solicitud invalido")
        self.assertEqual(payload["errorType"], "request_validation_error")
        self.assertIn("errors", payload)
        self.assertIsInstance(payload["errors"], list)
        self.assertTrue(any("modelType" in str(item) for item in payload["errors"]))

    def test_prediction_request_contract_should_fail_for_unknown_extra_field(self) -> None:
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
                "unexpectedField": "not-allowed",
            },
        )

        self.assertEqual(response.status_code, 422)
        payload = response.json()
        self.assertIn("detail", payload)
        self.assertEqual(payload["detail"], "Payload de solicitud invalido")
        self.assertEqual(payload["errorType"], "request_validation_error")
        self.assertIn("errors", payload)
        self.assertIsInstance(payload["errors"], list)
        self.assertTrue(any("unexpectedField" in str(item) for item in payload["errors"]))

    def test_prediction_error_contract_should_match_exact_keys_for_400(self) -> None:
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
        payload = response.json()
        self.assertEqual(set(payload.keys()), {"detail", "errorType", "errors"})
        self.assertIsInstance(payload["detail"], str)
        self.assertIsInstance(payload["errorType"], str)
        self.assertEqual(payload["errors"], [])

    def test_prediction_error_contract_should_match_exact_keys_for_429(self) -> None:
        os.environ["AI_RATE_LIMIT_REQUESTS"] = "1"
        os.environ["AI_RATE_LIMIT_WINDOW_SECONDS"] = "60"
        headers = {"x-tenant-id": "tenant-contract-rate-limit"}
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
        payload = second_response.json()
        self.assertEqual(set(payload.keys()), {"detail", "errorType", "errors"})
        self.assertIsInstance(payload["detail"], str)
        self.assertEqual(payload["errorType"], "rate_limit_exceeded")
        self.assertEqual(payload["errors"], [])


if __name__ == "__main__":
    unittest.main()
