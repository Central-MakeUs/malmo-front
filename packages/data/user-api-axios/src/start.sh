#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

CONFIG_FILE="$SCRIPT_DIR/../config.json"
SWAGGER_JSON="$SCRIPT_DIR/../swagger.json"
TARGET_PATH="$SCRIPT_DIR/../api"


function errorCheck() {
    if [[ $? -ne 0 ]]; then
    exit 1
fi
}

set -e

rm -f "$SWAGGER_JSON"

node "$SCRIPT_DIR/downloader.js"
errorCheck

rm -rf "$TARGET_PATH"
mkdir -p "$TARGET_PATH"

npx @openapitools/openapi-generator-cli generate \
  --skip-validate-spec \
  -c "$CONFIG_FILE" \
  -i "$SWAGGER_JSON" \
  -o "$TARGET_PATH"
errorCheck

prettier --write "$TARGET_PATH" -r --log-level=error > /dev/null 2>&1
