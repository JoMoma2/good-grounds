"""Create a portable source handoff, never including dependencies or user records."""
from pathlib import Path
import hashlib,json,sys,zipfile
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else ROOT.parent/'GoodGround-iPhone-Source.zip'
EXCLUDE={'node_modules','build','test-results','.git','__pycache__'}
required=['.github/workflows/build-iphone.yml','app/web/index.html','app/web/app.js','app/web/core.js','app/web/marker.js','app/web/guide.js','app/web/tailoring.js','app/web/history.js','app/web/data.js','app/web/data.json','app/web/styles.css','ios/GoodGroundApp.swift','ios/Info.plist','ios/PrivacyInfo.xcprivacy','scripts/build-ios.sh','scripts/simulator-smoke.sh','INSTALL.md','DEVELOPING.md','UPDATE_NOTES.md','package-lock.json','tests/updates.test.cjs','tests/updates-ui.cjs','tests/edge-ui.cjs']
for f in required:assert (ROOT/f).is_file(),f
files=[p for p in sorted(ROOT.rglob('*')) if p.is_file() and not EXCLUDE.intersection(p.relative_to(ROOT).parts) and p.suffix not in {'.zip','.ipa','.pyc'} and not p.is_symlink()]
assert all(p.stat().st_size<25*1024*1024 for p in files)
with zipfile.ZipFile(OUT,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in files:z.write(p,Path('GoodGround-iPhone')/p.relative_to(ROOT))
 assert 'GoodGround-iPhone/.github/workflows/build-iphone.yml' in z.namelist()
print('Source files:',len(files),'ZIP bytes:',OUT.stat().st_size)
sha=hashlib.sha256(OUT.read_bytes()).hexdigest()
OUT.with_suffix('.zip.sha256').write_text(sha+'  '+OUT.name+'\n')
print('SHA256:',sha)
