import tempfile
import unittest

from training.artifact_store import persist_artifacts
from training.schemas import EvaluationMetrics, ModelArtifact


class ArtifactStoreTests(unittest.TestCase):
    def test_should_fail_when_artifact_version_already_exists(self) -> None:
        artifact = ModelArtifact(
            version="cnn-0.5.0",
            feature_version="v1",
            weights=[0.1, 0.2, 0.3],
            bias=0.0,
            threshold=0.5,
        )
        metrics = EvaluationMetrics(accuracy=0.9, precision=0.8, recall=0.85)
        promotion_criteria = {"minAccuracy": 0.7, "minPrecision": 0.7, "minRecall": 0.7}

        with tempfile.TemporaryDirectory() as temp_dir:
            persist_artifacts(temp_dir, artifact, metrics, promotion_criteria)

            with self.assertRaises(FileExistsError):
                persist_artifacts(temp_dir, artifact, metrics, promotion_criteria)


if __name__ == "__main__":
    unittest.main()
