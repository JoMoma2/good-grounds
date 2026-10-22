"""Update bundled web assets inside the existing unsigned iPhone shell.

This does not compile Swift or sign an app. Use build-ios.sh on macOS when the
native shell changes. The release reuses the original, unchanged native binary.
"""
from pathlib import Path, PurePosixPath
import argparse
import hashlib
import json
import plistlib
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PREFIX = "Payload/GoodGround.app/"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("base_ipa", type=Path)
parser.add_argument("output_ipa", type=Path)
args = parser.parse_args()
base = args.base_ipa.resolve()
output = args.output_ipa.resolve()
if base == output:
    raise SystemExit("Choose a separate output file; keep the original IPA.")

web = ROOT / "app/web"
web_files = sorted(p for p in web.rglob("*") if p.is_file())
if any(p.is_symlink() for p in web_files):
    raise SystemExit("The web bundle must contain ordinary local files.")
for required in ["index.html", "app.js", "core.js", "data.js", "data.json", "styles.css", "marker.js", "guide.js", "tailoring.js", "history.js"]:
    if not (web / required).is_file():
        raise SystemExit("Missing bundled file: " + required)

source_info = plistlib.loads((ROOT / "ios/Info.plist").read_bytes())
with zipfile.ZipFile(base) as original:
    if original.testzip():
        raise SystemExit("The original IPA failed its ZIP integrity check.")
    for item in original.infolist():
        path = PurePosixPath(item.filename)
        if path.is_absolute() or ".." in path.parts:
            raise SystemExit("Unexpected path in IPA.")
    info = plistlib.loads(original.read(PREFIX + "Info.plist"))
    if info["CFBundleIdentifier"] != source_info["CFBundleIdentifier"]:
        raise SystemExit("The source and IPA have different app identities.")
    executable = PREFIX + info["CFBundleExecutable"]
    native_hash = hashlib.sha256(original.read(executable)).hexdigest()
    info["CFBundleShortVersionString"] = source_info["CFBundleShortVersionString"]
    info["CFBundleVersion"] = source_info["CFBundleVersion"]
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as updated:
        for item in original.infolist():
            if item.filename.startswith(PREFIX + "web/") or item.filename.startswith(PREFIX + "_CodeSignature/") or item.filename in {PREFIX + "Info.plist", PREFIX + "CodeResources"}:
                continue
            updated.writestr(item, original.read(item.filename))
        updated.writestr(original.getinfo(PREFIX + "Info.plist"), plistlib.dumps(info, sort_keys=False))
        for path in web_files:
            updated.write(path, PREFIX + "web/" + path.relative_to(web).as_posix())

with zipfile.ZipFile(output) as updated:
    assert updated.testzip() is None
    assert hashlib.sha256(updated.read(executable)).hexdigest() == native_hash
    for path in web_files:
        assert updated.read(PREFIX + "web/" + path.relative_to(web).as_posix()) == path.read_bytes()

digest = hashlib.sha256(output.read_bytes()).hexdigest()
output.with_suffix(".ipa.sha256").write_text(digest + "  " + output.name + "\n")
manifest = {
    "version": source_info["CFBundleShortVersionString"],
    "build": source_info["CFBundleVersion"],
    "method": "Bundled interface update; existing native executable unchanged; unsigned",
    "nativeExecutableSHA256": native_hash,
    "ipaSHA256": digest,
    "webFiles": {p.relative_to(web).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in web_files},
}
output.with_suffix(".manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
print("Updated unsigned IPA:", output)
print("Unchanged native executable SHA256:", native_hash)
print("Verified web files:", len(web_files))
