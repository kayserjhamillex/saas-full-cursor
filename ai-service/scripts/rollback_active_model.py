import argparse
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.inference.model_registry_store import rollback_active_cnn_model_version


def main() -> None:
    parser = argparse.ArgumentParser(description="Rollback active CNN model version")
    parser.add_argument(
        "--reason",
        default="manual_rollback",
        help="Reason for rollback",
    )
    args = parser.parse_args()

    manifest_path = rollback_active_cnn_model_version(args.reason)
    print(
        {
            "event": "active_model_rollback",
            "reason": args.reason,
            "manifestPath": manifest_path,
        }
    )


if __name__ == "__main__":
    main()
