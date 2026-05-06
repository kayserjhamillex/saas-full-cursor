import unittest

from training.schemas import TrainingSample
from training.trainer import train_threshold_model


class TrainingModelArtifactTests(unittest.TestCase):
    def test_train_threshold_model_should_generate_linear_artifact(self) -> None:
        samples = [
            TrainingSample(image_base64="aGVsbG8=", label=0),
            TrainingSample(image_base64="d29ybGQ=", label=1),
            TrainingSample(image_base64="c2Fhcw==", label=1),
            TrainingSample(image_base64="b2RvbnRv", label=0),
        ]

        artifact, metrics = train_threshold_model(samples, "cnn-0.2.0")

        self.assertEqual(artifact.version, "cnn-0.2.0")
        self.assertEqual(artifact.feature_version, "v1")
        self.assertEqual(len(artifact.weights), 3)
        self.assertGreaterEqual(artifact.threshold, 0.1)
        self.assertLessEqual(artifact.threshold, 0.9)
        self.assertGreaterEqual(metrics.accuracy, 0.0)
        self.assertLessEqual(metrics.accuracy, 1.0)


if __name__ == "__main__":
    unittest.main()
