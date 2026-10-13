#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ -x ./gradlew ]; then ./gradlew assembleRelease; else gradle assembleRelease; fi
python3 verify-release-signature.py build/outputs/apk/release/MyWay-release.apk
cp build/outputs/apk/release/MyWay-release.apk MyWay_Android_v1.4.0.apk
