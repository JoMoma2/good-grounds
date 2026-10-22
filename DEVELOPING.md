# Editing Good Ground

The app remains plain bundled HTML, CSS and JavaScript, inside the existing iPhone shell. Runtime dependencies, accounts and network services are unnecessary.

## Tour copy

Edit [app/web/guide.js](app/web/guide.js). Each page has a stable `id`, `icon`, `eyebrow`, `title`, `body` and `detail`. Optional `singleBody` / `singleDetail` variants explain the single-dog experience. Add, remove or reorder entries in `pages`; navigation and the page indicators follow the array automatically. Use plain text, not HTML. Icons come from the existing icon names near the top of `app.js`.

Bump `GROUND_GUIDE.version` when changing the guide. A first-time user sees dog setup first, then the tour. An existing user's completed tour is not forcibly reopened after a version bump. More → About Good Ground → A quick tour always replays the current content. The test reads the page count dynamically.

## Dog records and progress

[app/web/core.js](app/web/core.js) owns validation, migration and pure training logic. Its native storage envelope remains `schema: 1`. The first dog's profile, progress, journal, plans, cues and tailoring remain at the root. `household.others` holds complete records for additional dogs; `household.selectedIds` identifies the current training group.

- Use `dogs`, `dogState`, `updateDog` and `setDogProgress` to read or modify specific dogs. Session IDs are globally unique across the household.
- `trainingView` is a temporary display projection. **Never save or export that projection.** It combines selected dogs for display and follows the least advanced recorded stage. A paused dog keeps a group stage paused.
- Group recommendations use the earliest available training gap. Already-consistent dogs are named quietly. Progress controls default to unfinished, unpaused dogs; the owner can explicitly choose another subset.
- Notes and cues always belong to an explicit dog. Journal edits/deletes and trigger plans must retain their owner. Trends intentionally show one dog at a time.
- First-run setup saves each completed profile so interruption can resume. A single dog's profile can be skipped; multiple dogs require distinct names or nicknames.

Backups now use format `version: 3`. The current parser accepts versions 1, 2 and 3, and migrates old single-dog saves without erasing their records or forcing setup. Older apps reject version 3; this prevents them from silently discarding extra dogs or progress history. Keep an old backup before updating, and use the new app to restore new exports.

`storageState` adds a reserved wire-only progress entry when saving to the native file or browser storage. The current validator removes it from the canonical model. The original validator refuses that entry safely, preventing an older app from rewriting a new household as only its first dog. The native schema remains 1 because the unchanged Swift shell requires it. Keep this compatibility guard when extending storage; do not count it as a lesson.

## Sounds, practice and support

[app/web/marker.js](app/web/marker.js) creates four original, bounded sound buffers with Web Audio. Playback starts from a user gesture, resumes suspended audio when possible and reports failures. Touch presses, held presses, keyboard activation and assistive clicks must each produce one marker. A sound press never logs practice or changes progress. Physical iPhone output, Silent-switch behavior and Bluetooth latency require device checks.

Practice recency uses dated linked **Skill practice** journal records. Note edits, marker presses, trigger-event entries and future dates do not establish practice. A consistency timestamp can start the initial reminder clock, but is labeled separately. Calendar-day calculations avoid daylight-saving offsets. The weekly default is a changeable product preference, not a forgetting deadline. Automatic maintenance excludes fear-exposure programs. Today/practice dates refresh after returning from the background; a household chooser returns after a break of 30 minutes or more, while unsaved forms are protected.

[app/web/tailoring.js](app/web/tailoring.js) contains breed names, aliases, the four deliberately limited survey associations and the three optional support preferences. Mixes and unknown/unlisted names remain valid. Breed alone must never set traits or change criteria. Only confirmed observations can affect suggestions and the step-specific actions in `practicePieces`. Keep full teaching guides available and preserve advancement criteria. Profile breed changes clear the last reviewed breed; ordinary edits do not repeat rejected questions. Do not invent nutrition prescriptions, temperament ratings or extra required repetitions from breed. Research decisions and limits are in [research/IPHONE_UPDATE_RESEARCH.md](research/IPHONE_UPDATE_RESEARCH.md).

## Curriculum and checks

Edit curriculum inputs in `research/base-data.json`, `research/additional-sources.json`, `scripts/advanced-content.py`, or `scripts/extend-content.py`, then run `python3 scripts/extend-content.py`. It regenerates the JSON and JavaScript bundles; do not edit only one output. Keep existing skill and step IDs stable, including prerequisite edges. The reverse links are derived from those edges and need no separate list.

```bash
node scripts/check.cjs
node tests/core.test.cjs
node tests/updates.test.cjs
npm ci --ignore-scripts
npx playwright install chromium webkit
node tests/ui.cjs
node tests/updates-ui.cjs
node tests/edge-ui.cjs
node tests/handoff-ui.cjs
node tests/native-bridge.cjs
```

Repeat the five browser scripts with `GG_BROWSER=webkit`. These tests use invented records in isolated browser/native-bridge simulations. `GG_WEB_ROOT` can target an extracted app's bundled web folder for artifact checks. Desktop engines do not substitute for a physical iPhone or Swift runtime test. The macOS build and simulator workflow remains available.

Lesson controls use CSS sticky positioning and the measured navigation height. Keep visible feedback available in both the large clicker and the lesson marker. Never schedule a late marker after a failed or timed-out audio unlock. Text sizes use rem units so the root text-size preference affects labels and controls as well as teaching copy.

## Completion history and component projects

`observeProgress` records actual per-dog daily category skill counts, including a first-observed baseline. It must run on canonical state, never `trainingView`. Same-day observations replace that date; unchanged counts and note edits do not create history. Counts and denominators are frozen with a curriculum version. `history.js` renders calendar-spaced step lines and an accessible values table. Do not reconstruct prior percentages from current progress timestamps. Backups keep all valid observations.

Fridge component metadata retains OPEN/CLOSE/SHELF/DRINK cue keys inside one DRINK skill. A step's component determines setup and cue fields. Preserve all old step IDs and consult `HANDOFF_1_2.md` before changing compatibility. The 1.2 wire guard rejects writes from 1.1.x code that would drop history.

Run `npm test` for all unit suites, including immutable 1.1.1 compatibility fixtures. Keep those fixtures portable; do not depend on a local Git checkout for source-archive tests. The focused handoff suite measures real desktop audio graph output; this is not physical speaker verification. It also supports `GG_BROWSER=firefox` for local-file checks.
