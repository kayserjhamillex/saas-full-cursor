import argparse
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.inference.model_publish_service import publish_cnn_model_artifact


def main() -> None:
    parser = argparse.ArgumentParser(description="Publish CNN model artifact safely")
    parser.add_argument("--source-model-path", required=True, help="Path to source model JSON")
    parser.add_argument("--version", required=True, help="Target CNN model version")
    parser.add_argument(
        "--expected-sha256",
        default="",
        help="Optional SHA256 checksum to validate source artifact",
    )
    parser.add_argument(
        "--promote",
        action="store_true",
        help="Promote model version after successful publish",
    )
    parser.add_argument(
        "--reason",
        default="publish_model",
        help="Reason used when --promote is enabled",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate publish operation without writing artifacts",
    )
    parser.add_argument(
        "--no-strict-json-schema",
        action="store_true",
        help="Disable strict schema validation for source artifact",
    )
    args = parser.parse_args()
    if args.no_strict_json_schema:
        print(
            {
                "event": "publish_model_warning",
                "warning": "strict_json_schema_disabled",
                "message": "La validacion estricta del esquema fue desactivada explicitamente.",
            },
            file=sys.stderr,
        )

    result = publish_cnn_model_artifact(
        source_model_path=args.source_model_path,
        version=args.version,
        expected_sha256=args.expected_sha256 or None,
        promote=args.promote,
        promote_reason=args.reason,
        dry_run=args.dry_run,
        strict_json_schema=not args.no_strict_json_schema,
    )
    print(
        {
            "event": "model_published",
            **result,
            "promoted": args.promote,
            "strictJsonSchema": not args.no_strict_json_schema,
        }
    )


if __name__ == "__main__":
    main()
