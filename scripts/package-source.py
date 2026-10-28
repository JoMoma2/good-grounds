"""Create a portable source handoff, never including dependencies or user records."""
from pathlib import Path
import hashlib,json,sys,zipfile
ROOT=Path(__file__).resolve().parents[1]
VERSION=json.loads((ROOT/'package.json').read_text())['version']
OUT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else ROOT.parent/f'GoodGround-{VERSION}-Source.zip'
EXCLUDE={'node_modules','build','test-results','validation','.git','.signing','__pycache__'}
required=['package.json','scripts/package-source.py','tests/source-package.test.py','app/web/lesson-controls.js','scripts/review-setups.py','research/step-setups.json','research/SETUP_REVIEW.md','tests/setup-review.test.cjs','FEEDBACK_SETUP.md','tests/redesign-ui.cjs','tests/lesson-display.test.cjs','scripts/curriculum-expansion.py','scripts/prerequisite-review.py','research/prerequisite-review.json','tests/expansion-practice.test.cjs','tests/expansion-ui.cjs','tests/fixtures/1.3.0-catalog.json','tests/library-ui.cjs','scripts/advanced-content.py','scripts/audit-curriculum.cjs','research/previous-project-guides.json','research/prerequisite-baselines.json','tests/curriculum-ui.cjs','tests/curriculum-rework.test.cjs','tests/fixtures/1.2.0-catalog.json','.github/workflows/build-iphone.yml','app/web/index.html','app/web/app.js','app/web/core.js','app/web/marker.js','app/web/guide.js','app/web/tailoring.js','app/web/history.js','app/web/data.js','app/web/data.json','app/web/styles.css','ios/GoodGroundApp.swift','ios/Info.plist','ios/PrivacyInfo.xcprivacy','scripts/build-ios.sh','scripts/simulator-smoke.sh','INSTALL.md','DEVELOPING.md','UPDATE_NOTES.md','package-lock.json','tests/updates.test.cjs','tests/updates-ui.cjs','tests/edge-ui.cjs']
required += ['scripts/curriculum-review.py','scripts/audit-content-review.cjs','research/curriculum-corrections-8.json','research/curriculum-review-8.json','research/CURRICULUM_REVIEW_2026-10-28.md','tests/content-review.test.cjs','tests/fixtures/1.6.0-catalog.json']
for f in required:assert (ROOT/f).is_file(),f
files=[p for p in sorted(ROOT.rglob('*')) if p.is_file() and not EXCLUDE.intersection(p.relative_to(ROOT).parts) and p.suffix not in {'.zip','.ipa','.pyc'} and not p.is_symlink() and not (p.name.startswith('.~lock.') and p.name.endswith('#')) and p.relative_to(ROOT).parts[:2] != ('docs','archive') and p.relative_to(ROOT).parts[0] not in {'previews','previews.html'}]
included={p.relative_to(ROOT).as_posix() for p in files}
assert set(required)<=included,'Required files excluded from source package: '+', '.join(sorted(set(required)-included))
assert all(p.stat().st_size<25*1024*1024 for p in files)
with zipfile.ZipFile(OUT,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in files:z.write(p,Path('GoodGround-iPhone')/p.relative_to(ROOT))
 assert 'GoodGround-iPhone/.github/workflows/build-iphone.yml' in z.namelist()
print('Source files:',len(files),'ZIP bytes:',OUT.stat().st_size)
sha=hashlib.sha256(OUT.read_bytes()).hexdigest()
OUT.with_suffix('.zip.sha256').write_text(sha+'  '+OUT.name+'\n')
print('SHA256:',sha)
