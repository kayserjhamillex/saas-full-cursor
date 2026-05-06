import json
import os
import tempfile
import unittest
from pathlib import Path

from app.services.inference.model_publish_service import publish_cnn_model_artifact
from app.services.inference.model_registry_store import get_active_cnn_model_version


class ModelPublishServiceTests(unittest.TestCase):
    def test_should_publish_and_promote_model_when_checksum_is_valid(self) -> None:
        previous_output_dir = os.environ.get("AI_MODEL_OUTPUT_DIR")
        previous_manifest_path = os.environ.get("AI_ACTIVE_MODEL_MANIFEST_PATH")
        with tempfile.TemporaryDirectory() as temp_dir:
            source_model_path = Path(temp_dir) / "incoming_model.json"
            source_model_payload = {
                "weights": [0.8, 0.1, 0.1],
                "bias": 0.1,
                "threshold": 0.6,
                "feature_version": "v2",
            }
            source_model_path.write_text(json.dumps(source_model_payload), encoding="utf-8")

            try:
                os.environ["AI_MODEL_OUTPUT_DIR"] = temp_dir
                os.environ["AI_ACTIVE_MODEL_MANIFEST_PATH"] = str(Path(temp_dir) / "active_model.json")
                published = publish_cnn_model_artifact(
                    source_model_path=str(source_model_path),
                    version="cnn-1.0.0",
                    expected_sha256="",
                    promote=True,
                    promote_reason="release_candidate",
                )

                published_path = Path(published["publishedModelPath"])
                self.assertTrue(published_path.exists())
                self.assertEqual(published["publishedModelVersion"], "cnn-1.0.0")
                self.assertTrue(published["manifestPath"])
                self.assertEqual(published["dryRun"], "false")
                self.assertEqual(get_active_cnn_model_version("cnn-default"), "cnn-1.0.0")
            finally:
                if previous_output_dir is None:
                    os.environ.pop("AI_MODEL_OUTPUT_DIR", None)
                else:
                    os.environ["AI_MODEL_OUTPUT_DIR"] = previous_output_dir
                if previous_manifest_path is None:
                    os.environ.pop("AI_ACTIVE_MODEL_MANIFEST_PATH", None)
                else:
                    os.environ["AI_ACTIVE_MODEL_MANIFEST_PATH"] = previous_manifest_path

    def test_should_fail_when_checksum_does_not_match(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            source_model_path = Path(temp_dir) / "incoming_model.json"
            source_model_path.write_text('{"weights":[1,0,0],"bias":0.0,"threshold":0.5}', encoding="utf-8")
            with self.assertRaises(ValueError):
                publish_cnn_model_artifact(
                    source_model_path=str(source_model_path),
                    version="cnn-1.0.1",
                    expected_sha256="invalid-checksum",
                    promote=False,
                )

    def test_should_fail_when_target_version_already_exists(self) -> None:
        previous_output_dir = os.environ.get("AI_MODEL_OUTPUT_DIR")
        with tempfile.TemporaryDirectory() as temp_dir:
            source_model_path = Path(temp_dir) / "incoming_model.json"
            source_model_path.write_text('{"weights":[1,0,0],"bias":0.0,"threshold":0.5}', encoding="utf-8")
            existing_target_path = Path(temp_dir) / "cnn_cnn-1.0.2.json"
            existing_target_path.write_text("{}", encoding="utf-8")
            try:
                os.environ["AI_MODEL_OUTPUT_DIR"] = temp_dir
                with self.assertRaises(FileExistsError):
                    publish_cnn_model_artifact(
                        source_model_path=str(source_model_path),
                        version="cnn-1.0.2",
                        promote=False,
                    )
            finally:
                if previous_output_dir is None:
                    os.environ.pop("AI_MODEL_OUTPUT_DIR", None)
                else:
                    os.environ["AI_MODEL_OUTPUT_DIR"] = previous_output_dir

    def test_should_validate_without_writing_when_dry_run_enabled(self) -> None:
        previous_output_dir = os.environ.get("AI_MODEL_OUTPUT_DIR")
        with tempfile.TemporaryDirectory() as temp_dir:
            source_model_path = Path(temp_dir) / "incoming_model.json"
            source_model_path.write_text(
                '{"weights":[0.1,0.2,0.3],"bias":0.1,"threshold":0.6,"feature_version":"v1"}',
                encoding="utf-8",
            )
            try:
                os.environ["AI_MODEL_OUTPUT_DIR"] = temp_dir
                publish_result = publish_cnn_model_artifact(
                    source_model_path=str(source_model_path),
                    version="cnn-2.0.0",
                    promote=False,
                    dry_run=True,
                    strict_json_schema=True,
                )
                target_model_path = Path(temp_dir) / "cnn_cnn-2.0.0.json"
                self.assertFalse(target_model_path.exists())
                self.assertEqual(publish_result["dryRun"], "true")
            finally:
                if previous_output_dir is None:
                    os.environ.pop("AI_MODEL_OUTPUT_DIR", None)
                else:
                    os.environ["AI_MODEL_OUTPUT_DIR"] = previous_output_dir

    def test_should_fail_when_strict_schema_is_enabled_and_model_is_invalid(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            source_model_path = Path(temp_dir) / "incoming_model.json"
            source_model_path.write_text('{"weights":[1,2,3],"bias":0.0}', encoding="utf-8")

            with self.assertRaises(ValueError):
                publish_cnn_model_artifact(
                    source_model_path=str(source_model_path),
                    version="cnn-2.0.1",
                    promote=False,
                    strict_json_schema=True,
                )


if __name__ == "__main__":
    unittest.main()
