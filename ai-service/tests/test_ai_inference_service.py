import unittest
from unittest.mock import patch

from app.services.inference.ai_inference_service import AIInferenceService
from app.services.inference.contracts import InferenceInput
from app.services.inference.errors import InferenceInputError


class AIInferenceServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.service = AIInferenceService()

    def test_given_confidence_at_high_boundary_when_predict_then_sets_high_risk(self) -> None:
        inference_input = InferenceInput(
            image_base64="dummy",
            mime_type="image/png",
            model_type="cnn",
        )

        with (
            patch.object(self.service, "_process_input", return_value=b"valid-bytes"),
            patch.object(
                self.service,
                "_load_model",
                return_value={"cnn_artifact": {"weights": [1.0]}, "model_version": "cnn:cnn-0.1.0"},
            ),
            patch(
                "app.services.inference.ai_inference_service.run_cnn_prediction",
                return_value={"finding": "lesion_probable", "confidence": 0.8},
            ),
            patch(
                "app.services.inference.ai_inference_service.build_recommendations",
                return_value=["Priorizar evaluacion clinica"],
            ),
        ):
            prediction = self.service.predict(inference_input)

        self.assertEqual(prediction.risk_level, "high")
        self.assertEqual(prediction.finding, "lesion_probable")
        self.assertGreaterEqual(prediction.confidence, 0.8)
        self.assertIsNone(prediction.segmentation)
        self.assertGreaterEqual(prediction.processing_ms, 1)

    def test_given_confidence_boundaries_when_predict_then_maps_expected_risk_level(self) -> None:
        inference_input = InferenceInput(
            image_base64="dummy",
            mime_type="image/png",
            model_type="cnn",
        )
        confidence_cases = [
            (0.49, "low"),
            (0.50, "medium"),
            (0.79, "medium"),
            (0.80, "high"),
        ]

        for confidence_value, expected_risk_level in confidence_cases:
            with self.subTest(confidence=confidence_value, expected=expected_risk_level):
                with (
                    patch.object(self.service, "_process_input", return_value=b"valid-bytes"),
                    patch.object(
                        self.service,
                        "_load_model",
                        return_value={
                            "cnn_artifact": {"weights": [1.0]},
                            "model_version": "cnn:cnn-0.1.0",
                        },
                    ),
                    patch(
                        "app.services.inference.ai_inference_service.run_cnn_prediction",
                        return_value={
                            "finding": "lesion_probable",
                            "confidence": confidence_value,
                        },
                    ),
                    patch(
                        "app.services.inference.ai_inference_service.build_recommendations",
                        return_value=["Seguimiento clinico"],
                    ),
                ):
                    prediction = self.service.predict(inference_input)

                self.assertEqual(prediction.risk_level, expected_risk_level)
                self.assertEqual(prediction.confidence, confidence_value)

    def test_given_unet_model_when_predict_then_includes_segmentation(self) -> None:
        inference_input = InferenceInput(
            image_base64="dummy",
            mime_type="image/png",
            model_type="unet",
        )
        expected_segmentation = {"segmentationRatio": 0.42, "maskGenerated": True}

        with (
            patch.object(self.service, "_process_input", return_value=b"valid-bytes"),
            patch.object(
                self.service,
                "_load_model",
                return_value={
                    "cnn_artifact": {"weights": [1.0]},
                    "model_version": "cnn:cnn-0.1.0,unet:unet-0.1.0",
                },
            ),
            patch(
                "app.services.inference.ai_inference_service.run_cnn_prediction",
                return_value={"finding": "sin_hallazgo_relevante", "confidence": 0.49},
            ),
            patch(
                "app.services.inference.ai_inference_service.run_unet_segmentation",
                return_value=expected_segmentation,
            ) as run_unet_segmentation_mock,
            patch(
                "app.services.inference.ai_inference_service.build_recommendations",
                return_value=["Continuar seguimiento"],
            ),
        ):
            prediction = self.service.predict(inference_input)

        run_unet_segmentation_mock.assert_called_once()
        self.assertEqual(prediction.risk_level, "low")
        self.assertEqual(prediction.segmentation, expected_segmentation)

    def test_given_invalid_base64_when_process_input_then_raises_invalid_payload(self) -> None:
        inference_input = InferenceInput(
            image_base64="invalid-base64",
            mime_type="image/png",
            model_type="cnn",
        )

        with patch("app.services.inference.ai_inference_service.decode_base64_image", return_value=b""):
            with self.assertRaises(InferenceInputError) as context:
                self.service._process_input(inference_input)

        self.assertEqual(context.exception.error_type, "invalid_image_payload")
        self.assertEqual(context.exception.detail, "Contenido de imagen invalido")

    def test_given_large_image_when_process_input_then_raises_size_limit(self) -> None:
        inference_input = InferenceInput(
            image_base64="any",
            mime_type="image/png",
            model_type="cnn",
        )
        oversized_image = b"\x89PNG\r\n\x1a\n" + (b"\x00" * 32)

        with (
            patch("app.services.inference.ai_inference_service.decode_base64_image", return_value=oversized_image),
            patch("app.services.inference.ai_inference_service.validate_image_payload"),
            patch(
                "app.services.inference.ai_inference_service.get_settings",
                return_value=type("Settings", (), {"max_image_size_bytes": 16})(),
            ),
            patch(
                "app.services.inference.ai_inference_service.normalize_image_bytes",
                return_value=oversized_image,
            ),
        ):
            with self.assertRaises(InferenceInputError) as context:
                self.service._process_input(inference_input)

        self.assertEqual(context.exception.error_type, "image_size_limit_exceeded")

    def test_given_mime_mismatch_when_process_input_then_raises_specific_error_type(self) -> None:
        inference_input = InferenceInput(
            image_base64="any",
            mime_type="image/jpeg",
            model_type="cnn",
        )

        with (
            patch(
                "app.services.inference.ai_inference_service.decode_base64_image",
                return_value=b"\x89PNG\r\n\x1a\n" + (b"\x00" * 32),
            ),
            patch(
                "app.services.inference.ai_inference_service.validate_image_payload",
                side_effect=ValueError("El mimeType no coincide con el contenido de la imagen"),
            ),
        ):
            with self.assertRaises(InferenceInputError) as context:
                self.service._process_input(inference_input)

        self.assertEqual(context.exception.error_type, "mime_type_mismatch")
        self.assertIn("mimeType no coincide", context.exception.detail)


if __name__ == "__main__":
    unittest.main()
