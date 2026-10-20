#!/bin/bash
# Builds locally with Xcode, or on a GitHub macOS runner. No signing secrets.
set -euo pipefail
cd "$(dirname "$0")/.."
BUILD_ROOT="${GOOD_GROUND_BUILD_DIR:-$PWD/build}"
BUILD_PLATFORM="${1:-device}"
if [[ "$BUILD_PLATFORM" == "simulator" ]]; then
  SDK_NAME=iphonesimulator
  TARGET_TRIPLE="$(uname -m)-apple-ios16.0-simulator"
  OUTPUT_FOLDER="$BUILD_ROOT/simulator"
else
  SDK_NAME=iphoneos
  TARGET_TRIPLE=arm64-apple-ios16.0
  OUTPUT_FOLDER="$BUILD_ROOT/device"
fi
SDK_PATH="$(xcrun --sdk "$SDK_NAME" --show-sdk-path)"
APP_PATH="$OUTPUT_FOLDER/GoodGround.app"
mkdir -p "$APP_PATH"
cp ios/Info.plist "$APP_PATH/Info.plist"
/usr/libexec/PlistBuddy -c "Add :CFBundleSupportedPlatforms array" "$APP_PATH/Info.plist"
if [[ "$BUILD_PLATFORM" == "simulator" ]]; then
  /usr/libexec/PlistBuddy -c "Add :CFBundleSupportedPlatforms:0 string iPhoneSimulator" "$APP_PATH/Info.plist"
else
  /usr/libexec/PlistBuddy -c "Add :CFBundleSupportedPlatforms:0 string iPhoneOS" "$APP_PATH/Info.plist"
fi
mkdir -p "$APP_PATH/web"
cp -R app/web/. "$APP_PATH/web/"
if [[ -d ios/Icons ]]; then cp ios/Icons/*.png "$APP_PATH/"; fi
cp ios/PrivacyInfo.xcprivacy "$APP_PATH/PrivacyInfo.xcprivacy"
xcrun --sdk "$SDK_NAME" swiftc -parse-as-library -swift-version 5 -O \
  -target "$TARGET_TRIPLE" -sdk "$SDK_PATH" \
  -framework SwiftUI -framework UIKit -framework WebKit -framework UniformTypeIdentifiers \
  -Xlinker -rpath -Xlinker /usr/lib/swift -Xlinker -rpath -Xlinker @executable_path/Frameworks \
  ios/GoodGroundApp.swift -o "$APP_PATH/GoodGround"
if [[ "$BUILD_PLATFORM" == "simulator" ]]; then
  codesign --force --sign - "$APP_PATH"
  echo "Simulator app: $APP_PATH"
else
  /usr/bin/file "$APP_PATH/GoodGround"
  mkdir -p "$OUTPUT_FOLDER/Payload"
  mkdir -p "$OUTPUT_FOLDER/Payload/GoodGround.app"
  cp -R "$APP_PATH/." "$OUTPUT_FOLDER/Payload/GoodGround.app/"
  (cd "$OUTPUT_FOLDER" && /usr/bin/zip -q -r ../GoodGround-unsigned.ipa Payload)
  (cd "$BUILD_ROOT" && shasum -a 256 GoodGround-unsigned.ipa > GoodGround-unsigned.ipa.sha256)
  echo "IPA ready: $BUILD_ROOT/GoodGround-unsigned.ipa"
fi
