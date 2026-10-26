# iPhone 1.5.1 — WebKit lesson-control correction

GitHub Actions run 40264293111 failed in the WebKit handoff interface test; the macOS IPA build was skipped, not reported as a compiler failure. The failure reproduced locally at 390 × 844 with large text. Controls were already computed as static because a later rule overrode an old sticky declaration, but WebKit could scroll them behind the fixed bottom navigation.

## Correction

- Root scroll padding now reserves the measured navigation height plus a small gap. Page-end padding uses that same measurement. The existing ResizeObserver includes font changes and bottom safe-area padding; the fallback also includes the safe area.
- One explicit static-positioning rule keeps lesson controls in normal document flow. Obsolete sticky, bottom and z-index declarations were removed. Marker/progress behavior, stored records, curriculum and native source are unchanged.
- The strict handoff geometry assertion is retained and extended to 390 × 844, 320 × 568 and 844 × 390, normal/large text, Simple/Detailed modes, and 0/34 px bottom safe areas: 24 cases per engine. All interactive targets must also be unobscured.
- The workflow now runs the existing redesign suite alongside its eight other interface suites.
- The accidentally tracked `.~lock.FEEDBACK_SETUP.md#` file is deleted. Git ignores `.~lock.*#` at any depth, and portable source packaging excludes these files even when present on disk.

## Validation

All nine interface suites passed in both WebKit and Chromium: 112 grouped checks per engine, including real Web Audio marker behavior, progress, backup compatibility, mobile/large-text accessibility and the expanded geometry cases. Minimum measured control-to-navigation clearance was 12.56 px in WebKit and 11.86 px in Chromium. `npm test` passed all 95 unit tests; `npm run check` and the complete curriculum audit passed; `git diff --check`, build-script syntax and lock-ignore checks passed. Logs and geometry/screenshot reports are in the ignored `build/ci-fix-v1.5.1` folder; prior validation records were preserved.

The 61 required runtime/native/content/test inputs are present at expected paths and tracked. Seven pre-existing historical documents in `docs/archive` remain untracked; they are present locally and included in the portable source handoff, although Actions does not need them. Include that docs folder when publishing a complete source handoff. Upload the active project contents as the repository root, including the hidden `.github` folder. Do not upload `build`, `node_modules`, `.git`, private records, office locks, Android files or external Archives.

The current iPhone portable source ZIP and unsigned 1.5.1 IPA are refreshed to include this correction; each has a new checksum, and the IPA manifest describes its exact bundled assets. Pre-correction installer/source files are preserved with hashes under `build/ci-fix-v1.5.1/pre-fix-release`, leaving external Archives unchanged. The unchanged native executable is reused, not recompiled on this Linux host. Install into the same app/container to retain records.

No Android project, external archive or personal saved testing records were changed. Nothing was committed or pushed, and the GitHub workflow has not been rerun remotely. Xcode compilation and Apple simulator execution remain for the next macOS Actions run; the original run did not reach those steps.
