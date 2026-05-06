import argparse
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.inference.model_registry_store import set_active_cnn_model_version


def main() -> None:
    parser = argparse.ArgumentParser(description="Set active CNN model version")
    parser.add_argument("--version", required=True, help="Target CNN model version")
    parser.add_argument(
        "--reason",
        default="manual_activation",
        help="Reason for changing active model version",
    )
    args = parser.parse_args()

    manifest_path = set_active_cnn_model_version(args.version, args.reason)
    print(
        {
            "event": "active_model_updated",
            "activeCnnModelVersion": args.version,
            "reason": args.reason,
            "manifestPath": manifest_path,
        }
    )


if __name__ == "__main__":
    main()
