import os
import tempfile
import unittest
from pathlib import Path

from app.services.inference.model_loader_service import get_cnn_model_artifact, reset_model_artifact_cache


class ModelLoaderServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        reset_model_artifact_cache()

    def test_should_load_artifact_from_active_model_version(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            previous_output_dir = os.environ.get("AI_MODEL_OUTPUT_DIR")
            previous_model_version = os.environ.get("AI_CNN_MODEL_VERSION")
            try:
                os.environ["AI_MODEL_OUTPUT_DIR"] = temp_dir
                os.environ["AI_CNN_MODEL_VERSION"] = "cnn-0.2.0"
                model_file = Path(temp_dir) / "cnn_cnn-0.2.0.json"
                model_file.write_text(
                    '{"weights":[0.7,0.1,0.2],"bias":-0.1,"threshold":0.62,"feature_version":"v2"}',
                    encoding="utf-8",
                )

                artifact = get_cnn_model_artifact()

                self.assertEqual(artifact["modelVersion"], "cnn-0.2.0")
                self.assertEqual(artifact["featureVersion"], "v2")
                self.assertEqual(artifact["threshold"], 0.62)
            finally:
                if previous_output_dir is None:
                    os.environ.pop("AI_MODEL_OUTPUT_DIR", None)
                else:
                    os.environ["AI_MODEL_OUTPUT_DIR"] = previous_output_dir
                if previous_model_version is None:
                    os.environ.pop("AI_CNN_MODEL_VERSION", None)
                else:
                    os.environ["AI_CNN_MODEL_VERSION"] = previous_model_version

    def test_should_fallback_to_last_successful_artifact_when_new_model_is_invalid(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            previous_output_dir = os.environ.get("AI_MODEL_OUTPUT_DIR")
            previous_model_version = os.environ.get("AI_CNN_MODEL_VERSION")
            try:
                os.environ["AI_MODEL_OUTPUT_DIR"] = temp_dir
                os.environ["AI_CNN_MODEL_VERSION"] = "cnn-0.2.0"

                valid_model = Path(temp_dir) / "cnn_cnn-0.2.0.json"
                valid_model.write_text(
                    '{"weights":[1.0,0.0,0.0],"bias":0.2,"threshold":0.55,"feature_version":"v1"}',
                    encoding="utf-8",
                )
                first_artifact = get_cnn_model_artifact()

                os.environ["AI_CNN_MODEL_VERSION"] = "cnn-0.3.0"
                invalid_model = Path(temp_dir) / "cnn_cnn-0.3.0.json"
                invalid_model.write_text('{"weights":[1.0,0.0,0.0],"bias":"invalid-number"', encoding="utf-8")

                fallback_artifact = get_cnn_model_artifact()

                self.assertEqual(first_artifact, fallback_artifact)
                self.assertEqual(fallback_artifact["modelVersion"], "cnn-0.2.0")
            finally:
                if previous_output_dir is None:
                    os.environ.pop("AI_MODEL_OUTPUT_DIR", None)
                else:
                    os.environ["AI_MODEL_OUTPUT_DIR"] = previous_output_dir
                if previous_model_version is None:
                    os.environ.pop("AI_CNN_MODEL_VERSION", None)
                else:
                    os.environ["AI_CNN_MODEL_VERSION"] = previous_model_version


if __name__ == "__main__":
    unittest.main()
