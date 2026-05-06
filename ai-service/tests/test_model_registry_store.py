import os
import tempfile
import unittest
from pathlib import Path

from app.services.inference.model_registry_store import (
    get_active_cnn_model_version,
    rollback_active_cnn_model_version,
    set_active_cnn_model_version,
)


class ModelRegistryStoreTests(unittest.TestCase):
    @staticmethod
    def _create_model_artifact(temp_dir: str, version: str) -> None:
        model_file = Path(temp_dir) / f"cnn_{version}.json"
        model_file.write_text(
            '{"weights":[1.0,0.0,0.0],"bias":0.0,"threshold":0.5,"feature_version":"v1"}',
            encoding="utf-8",
        )

    def test_should_read_and_update_active_model_version(self) -> None:
        previous_manifest_env = os.environ.get("AI_ACTIVE_MODEL_MANIFEST_PATH")
        previous_model_output_env = os.environ.get("AI_MODEL_OUTPUT_DIR")
        with tempfile.TemporaryDirectory() as temp_dir:
            manifest_path = Path(temp_dir) / "active_model.json"
            os.environ["AI_ACTIVE_MODEL_MANIFEST_PATH"] = str(manifest_path)
            os.environ["AI_MODEL_OUTPUT_DIR"] = temp_dir
            self._create_model_artifact(temp_dir, "cnn-0.2.0")

            default_version = "cnn-0.1.0"
            self.assertEqual(get_active_cnn_model_version(default_version), default_version)

            set_active_cnn_model_version("cnn-0.2.0", "promote_v2")
            self.assertEqual(get_active_cnn_model_version(default_version), "cnn-0.2.0")
        if previous_manifest_env is None:
            os.environ.pop("AI_ACTIVE_MODEL_MANIFEST_PATH", None)
        else:
            os.environ["AI_ACTIVE_MODEL_MANIFEST_PATH"] = previous_manifest_env
        if previous_model_output_env is None:
            os.environ.pop("AI_MODEL_OUTPUT_DIR", None)
        else:
            os.environ["AI_MODEL_OUTPUT_DIR"] = previous_model_output_env

    def test_should_rollback_to_previous_version(self) -> None:
        previous_manifest_env = os.environ.get("AI_ACTIVE_MODEL_MANIFEST_PATH")
        previous_model_output_env = os.environ.get("AI_MODEL_OUTPUT_DIR")
        with tempfile.TemporaryDirectory() as temp_dir:
            manifest_path = Path(temp_dir) / "active_model.json"
            os.environ["AI_ACTIVE_MODEL_MANIFEST_PATH"] = str(manifest_path)
            os.environ["AI_MODEL_OUTPUT_DIR"] = temp_dir
            self._create_model_artifact(temp_dir, "cnn-0.2.0")
            self._create_model_artifact(temp_dir, "cnn-0.3.0")

            set_active_cnn_model_version("cnn-0.2.0", "promote_v2")
            set_active_cnn_model_version("cnn-0.3.0", "promote_v3")
            rollback_active_cnn_model_version("rollback_after_issue")

            self.assertEqual(get_active_cnn_model_version("cnn-0.1.0"), "cnn-0.2.0")
        if previous_manifest_env is None:
            os.environ.pop("AI_ACTIVE_MODEL_MANIFEST_PATH", None)
        else:
            os.environ["AI_ACTIVE_MODEL_MANIFEST_PATH"] = previous_manifest_env
        if previous_model_output_env is None:
            os.environ.pop("AI_MODEL_OUTPUT_DIR", None)
        else:
            os.environ["AI_MODEL_OUTPUT_DIR"] = previous_model_output_env

    def test_should_fail_promoting_missing_model_artifact(self) -> None:
        previous_manifest_env = os.environ.get("AI_ACTIVE_MODEL_MANIFEST_PATH")
        previous_model_output_env = os.environ.get("AI_MODEL_OUTPUT_DIR")
        with tempfile.TemporaryDirectory() as temp_dir:
            manifest_path = Path(temp_dir) / "active_model.json"
            os.environ["AI_ACTIVE_MODEL_MANIFEST_PATH"] = str(manifest_path)
            os.environ["AI_MODEL_OUTPUT_DIR"] = temp_dir

            with self.assertRaises(ValueError):
                set_active_cnn_model_version("cnn-9.9.9", "promote_missing")

        if previous_manifest_env is None:
            os.environ.pop("AI_ACTIVE_MODEL_MANIFEST_PATH", None)
        else:
            os.environ["AI_ACTIVE_MODEL_MANIFEST_PATH"] = previous_manifest_env
        if previous_model_output_env is None:
            os.environ.pop("AI_MODEL_OUTPUT_DIR", None)
        else:
            os.environ["AI_MODEL_OUTPUT_DIR"] = previous_model_output_env


if __name__ == "__main__":
    unittest.main()
