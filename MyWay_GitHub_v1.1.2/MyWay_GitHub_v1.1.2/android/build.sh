#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ -x ./gradlew ]; then ./gradlew assembleRelease; else gradle assembleRelease; fi
cp build/outputs/apk/release/MyWay-release.apk MyWay_Android_v62.apk
