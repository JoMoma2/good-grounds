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
node tests/curriculum-ui.cjs
```

Repeat the six browser scripts with `GG_BROWSER=webkit`. These tests use invented records in isolated browser/native-bridge simulations. `GG_WEB_ROOT` can target an extracted app's bundled web folder for artifact checks. Desktop engines do not substitute for a physical iPhone or Swift runtime test. The macOS build and simulator workflow remains available.

Lesson controls use CSS sticky positioning and the measured navigation height. Keep visible feedback available in both the large clicker and the lesson marker. Never schedule a late marker after a failed or timed-out audio unlock. Text sizes use rem units so the root text-size preference affects labels and controls as well as teaching copy.

## Completion history and component projects

`observeProgress` records actual per-dog daily category skill counts, including a first-observed baseline. It must run on canonical state, never `trainingView`. Same-day observations replace that date; unchanged counts and note edits do not create history. Counts and denominators are frozen with a curriculum version. `history.js` renders calendar-spaced step lines and an accessible values table. Do not reconstruct prior percentages from current progress timestamps. Backups keep all valid observations.

Projects use `skill.project.modules` and `foundations` referencing ordinary skills. There is no second copy of their progress. OPEN/SHELF/CLOSE are independent again; DRINK contains only assembly. `projectPlan` exposes module readiness. `relatedProjects` links foundations and modules back to their projects. `nextTeachingStep` chooses actual ready/continuing steps; never celebrate a partial or paused skill.

`archivedSkills` preserves the original 1.2.0 long guides. `index().archivedSteps` is distinct from active `steps`, so summary and history do not count retired steps. `step.replaces` maps conservative consistency credit to a new ID; `creditReplacements` preserves original records, pauses and explicit replacement grades separately for every dog. `observeProgress` applies that migration before recording current counts. Archived journal links remain selectable when editing their existing sessions. Do not reuse an old step ID for a broader criterion.

`research/prerequisite-baselines.json` holds exact historical graph baselines; `npm run check` runs the full audit. Every changed historical edge needs a written reason, all current references must resolve, and every retired ID must have an original page plus a replacement mapping. `research/previous-project-guides.json` is curriculum content, not disposable test data.

Run `npm test` for all unit suites, including immutable 1.1.1 compatibility fixtures. Keep those fixtures portable; do not depend on a local Git checkout for source-archive tests. The focused handoff suite measures real desktop audio graph output; this is not physical speaker verification. It also supports `GG_BROWSER=firefox` for local-file checks.

The 1.3.0 implementation, deferred trick decisions and safe-cleanup record are in [CURRICULUM_REWORK.md](docs/archive/CURRICULUM_REWORK.md). Keep step-count tests focused on meaningful component relationships; do not enforce a quota that encourages padded projects.

## Curriculum 7 / 1.4.0 additions

`curriculum-expansion.py` authors the 50 additions; `prerequisite-review.py` revises existing gates after the older generator stages. Run `python3 scripts/extend-content.py` for both data bundles. `research/prerequisite-review.json` records each active step’s reviewed dependencies; audit checks all four historical baselines and the exact 104 → 154 expansion. Read `docs/archive/DEVELOPMENT_REPORT_1.4.0.md` for editorial reasons.

`dailyPractice` selects learned maintained skills per selected dog. `logPracticeToday` writes idempotent linked journal records atomically, without changing progress or observed completion history. New maintenance-eligible lessons carry `maintenance: true`; existing eligible codes remain supported. Detailed same-day logs count too. Calendar refresh respects unsaved forms and open dialogs.

Run `npm test`, `npm run check`, and `npm run test:expansion` (also with `GG_BROWSER=webkit`). The expansion browser suite opens all 120 new steps and checks the daily queue, correction, local-date rollover, tables and accessibility. Platform-specific tests remain required for transport and native behavior.

## Lesson browsing and current release layout

The Lessons landing page renders the topic directory, never all 154 skill cards. `librarySelection` applies word-prefix search, exact current/archived Step IDs, selected-dog cues, topic and progress filters. `libraryResults` renders at most 12 compact rows and accessible page controls. Category pages have their own search and remembered page. Browse state is temporary UI state and does not change dog records or backup formats. The original topic routes and Fridge task alias remain valid.

Run `npm run test:library` in Chromium and WebKit. It reaches every skill once through topic pagination and checks search, filtering, dog ownership, keyboard focus, text size and accessibility.

Keep one current installer and one current source ZIP per platform outside the active Git checkouts. Put superseded releases, old generated builds and old validation into the central Archives folder, with versioned subfolders where known. Historical design notes inside a checkout belong in `docs/archive`. Keep generator inputs and compatibility fixtures in place. New verification belongs in `validation/v1.4.1`; current `build` and `test-results` folders are generated and ignored. Never move or reset the active `.git`, `.signing` or personal app records as part of cleanup.
