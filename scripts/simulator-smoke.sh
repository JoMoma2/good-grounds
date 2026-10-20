#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
BUILD_ROOT="${GOOD_GROUND_BUILD_DIR:-$PWD/build}"
mkdir -p "$BUILD_ROOT/validation"
SIMULATOR_ID="$(xcrun simctl list devices available -j | python3 -c 'import json,sys; d=json.load(sys.stdin); a=[x for k,v in d["devices"].items() if "iOS" in k for x in v if x.get("isAvailable") and "iPhone" in x["name"]]; assert a,"No iPhone simulator available"; print(a[0]["udid"])')"
xcrun simctl boot "$SIMULATOR_ID" || true
xcrun simctl bootstatus "$SIMULATOR_ID" -b
xcrun simctl install "$SIMULATOR_ID" "$BUILD_ROOT/simulator/GoodGround.app"
xcrun simctl launch "$SIMULATOR_ID" local.goodground.training --ui-smoke-test
APP_CONTAINER="$(xcrun simctl get_app_container "$SIMULATOR_ID" local.goodground.training data)"
for _ in {1..30}; do
  if [[ -f "$APP_CONTAINER/Documents/smoke-result.json" ]]; then break; fi
  sleep 1
done
cp "$APP_CONTAINER/Documents/smoke-result.json" "$BUILD_ROOT/validation/simulator-smoke.json"
python3 - "$BUILD_ROOT/validation/simulator-smoke.json" <<'PY'
import json,sys
r=json.load(open(sys.argv[1]))
assert r['loaded'] and r['bridge'] and r['lesson'] and r['restored'] and not r['errors'],r
print('Native local page, prerequisite navigation, save acknowledgement and backup validation passed:',r)
PY
xcrun simctl io "$SIMULATOR_ID" screenshot "$BUILD_ROOT/validation/simulator.png"
xcrun simctl terminate "$SIMULATOR_ID" local.goodground.training
xcrun simctl launch "$SIMULATOR_ID" local.goodground.training
python3 - "$APP_CONTAINER/Library/Application Support/GoodGround/progress.json" <<'PY'
import json,sys
s=json.load(open(sys.argv[1]))
assert s['progress']['NAME-1']['status']=='Consistent - move on',s
print('Native atomic progress file contains the recorded stage.')
PY
