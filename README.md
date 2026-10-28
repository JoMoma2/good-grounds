> **1.7.1:** Standard platform help and backup guidance, with container-specific and development-installation instructions removed from the current user documentation. Curriculum 8 remains unchanged.

> **Curriculum review, 1.7.0:** All 154 existing skills and all 384 previous active steps were reviewed for teaching accuracy, progression, welfare and evidence scope. Current curriculum: 386 steps, 45 historical steps and 87 source records. See [the complete review](research/CURRICULUM_REVIEW_2026-10-28.md).

# Good Ground for iPhone

A personal, offline dog-training companion. Version **1.7.1** includes **154 skills, 386 active teaching steps and 87 research/reference records**. Training is for individual dogs of any breed or mix.

The source includes the iPhone app, bundled curriculum and macOS build workflow. Distribution builds require the appropriate signing and release process. See [DEVELOPING.md](DEVELOPING.md) for build details and [INSTALL.md](INSTALL.md) for app use and backups.

Read [UPDATE_NOTES.md](UPDATE_NOTES.md) for this release and [INSTALL.md](INSTALL.md) for installation. Both active platform projects were updated together for 1.7.1.

Current behavior and the complete preparation audit are described in [UPDATE_NOTES.md](UPDATE_NOTES.md) and [SETUP_REVIEW.md](research/SETUP_REVIEW.md). Version 1.7.1 uses standard iPhone help and backup instructions. Local build artifacts do not imply an App Store release.

Lessons now opens with 14 topics, global search and filters. All lessons and Ready / practicing use the same topic cards; opened topics, searches and Saved/Learned results use compact skill rows with at most 12 per page. Search within a topic, by a custom cue, or by an exact Step ID. Read [UPDATE_NOTES.md](UPDATE_NOTES.md) for this release and [the prerequisite audit](research/PREREQUISITE_AUDIT.md) for component relationships.

## In the app

- **Today:** useful next lessons, current practice, optional fun and gentle refresher notes. For a training group, suggestions follow the earliest available gap, with a small note for dogs who already know a step.
- **Lessons:** searchable skills, saved lessons and exact Step IDs. Each lesson has instructions, advancement criteria, easier versions, large prerequisite links and smaller links to the skills it helps build. Cue wording is editable directly, separately for each dog.
- **Lessons → Clicker:** a large sound button, four original offline sounds, volume and the current lesson's instructions. Lessons put Mark & reward and Set progress directly after Move on when, without covering the teaching instructions. Hide all clicker controls and shortcuts in Settings. On iOS 17+, the marker requests playback mode for Silent-mode use; device verification is still required. Mark, then reward; pressing the sound never records practice automatically.
- **Journal:** quick practice entries or fuller dated notes, optional counts, observed response, context and recovery. Group entries can apply to a selected subset; each dog keeps their own record.
- **More:** Settings, Source library, Your dogs and About Good Ground. Find Trends, Clicker, Trigger plans and Practice rhythm under Lessons; essentials and evidence under Source library; backups in Settings; the tour in About Good Ground.

On first use, choose how many dogs you have and meet them one at a time. One dog's profile can be skipped. Multiple dogs need distinct names; other fields are optional. A short tour follows. At later openings, choose any subset to train; a longer background break also returns to that choice. Progress, notes, cues, sessions and plans remain separate for each dog.

Completing a step opens a ready next step, including earlier parallel work. Only completing every active step in a skill offers its milestone and optional next suggestions. When training a group, unfinished or paused dogs keep their own stage until explicitly changed. Reading, navigating and swiping never mark progress.

Profiles can record a searchable breed or a custom mix. A few supported associations invite an optional question about the individual dog. Only confirmed observations select smaller practice actions in relevant lessons and separate trouble-spot suggestions. Foundational starting suggestions remain available. Breed alone does not change criteria, diagnose temperament or prescribe nutrition.

## Practice and research

The usual four-in-five advancement rule is a practical planning aid, not a validated cutoff. Comfort comes before counts. Name acquisition and practice in new settings remain separate programs. Anxiety work does not require obedience before rewards.

Practice timers reflect linked Skill practice journal entries. Reminders for learned foundations/walk skills default to a week, with two weeks, a month or off available in Settings. A missing log is not proof of forgetting. Note edits and clicker presses do not reset practice dates, and fear-exposure programs are excluded from automatic refreshers.

[research/IPHONE_UPDATE_RESEARCH.md](research/IPHONE_UPDATE_RESEARCH.md) records the reminder and tailoring decisions and their limits. [research/APP_REVIEW.md](research/APP_REVIEW.md) retains the earlier content review. Brainiacs combines independent components into eight projects, including the existing fridge retrieval, sorting, Courier and pre-walk routines plus rally, a floor circuit, scent reporting and a short trick routine. Project maps expose expandable step groups and reusable foundations. Earlier overlong guides were shortened, with all 36 old pages and their records preserved. See [the full prerequisite audit](research/PREREQUISITE_AUDIT.md) for the current component structure.

The Trends page adds daily observed category completion history alongside the current progress bars. It starts when this version first observes the dog; earlier history is not invented. Categories share a color key, and their historical totals stay fixed. Shared training between devices is not available; [the assessment](research/SYNC_ASSESSMENT.md) explains what it requires.

## Local records and backups

The installed app loads bundled files, with no accounts, analytics, advertising, remote fonts, backend or automatic uploads. Original reference sites need a connection only when you open them. The clicker synthesizes its own sounds and needs no recordings or network access.

The iPhone shell stores atomic JSON records in Application Support, keeps a previous local save for recovery and reports save failures persistently. The progress directory is excluded from automatic iCloud backup. Export through **More → Settings → Backup & restore**, particularly before removing the app or changing phones. Install updates over the existing app to retain local records.

Version 1 saves/backups migrate to the household format. New exports use backup version 3, which retains every dog even if only one is selected. Older app versions reject that backup format. New local saves also carry a compatibility guard so an older app cannot silently rewrite them and drop extra dogs or progress history; reopen with this app version to continue. Keep your old backup before updating. Imported files are validated and previewed before replacing anything.

The browser preview uses its own local storage, separate from the phone. Export/import a backup to transfer records. Private browsing or clearing storage can remove browser records. Screenshots and tests use invented records; no dog history is prefilled in the shipped app.

## Preview and development

Open [app/web/index.html](app/web/index.html) in a modern browser, or run:

```bash
python3 -m http.server 8765 --bind 127.0.0.1 --directory app/web
```

Then open `http://127.0.0.1:8765`. The local preview does not upload records. Current validation screenshots are in `validation/v1.7.1`. Earlier generated previews are preserved in the central iPhone archive.

[DEVELOPING.md](DEVELOPING.md) explains the editable tour, household ownership rules, sounds, support preferences and curriculum generation. Key checks:

```bash
node scripts/check.cjs
npm test
npm ci --ignore-scripts
npx playwright install chromium webkit
npm run test:ui
npm run test:updates
npm run test:edges
npm run test:bridge
npm run test:handoff
npm run test:curriculum
```

Repeat browser scripts with `GG_BROWSER=webkit`. [VALIDATION.md](VALIDATION.md) distinguishes actual checks from pending native/device checks.

On a Mac with Xcode selected, `bash scripts/build-ios.sh device` builds a fresh unsigned IPA. The GitHub workflow also compiles and exercises the iPhone simulator. For an interface-only update with an unchanged native shell, `scripts/repackage-ios.py BASE_IPA OUTPUT_IPA` replaces bundled web files, retains the native executable and verifies every bundled file. It does not sign or compile Swift.

Original code, icon, synthesized sounds and instructional writing are under [LICENSE](LICENSE). Linked works retain their own rights; full third-party papers and recorded sound libraries are not bundled.

## Portable source release

Run `npm run test:package` to verify packaging, then `python3 scripts/package-source.py /tmp/GoodGround-1.7.1-Source.zip` to make a ZIP and SHA-256 sidecar. The same commands work from a clean checkout with the complete intended source files, or from an extracted source ZIP. The iOS build copies the whole bundled `app/web` directory, including `lesson-controls.js`.

`docs/archive/` is optional local history and is excluded from both publication and the portable ZIP. Generated `validation/`, `build/`, `test-results/`, dependencies, Git internals, local `.signing/` material and office lock files are excluded too. Existing tracked validation artifacts are not deleted by the ignore rules. Other public documentation may be included when present without becoming a required dependency. Keep `research/` baselines and `tests/fixtures/`: they are active generator/test inputs despite their historical names.

## Workspace organization

In the complete Good Ground workspace, shared evidence and independent verification live in `Research/Sources and Verification` at the workspace root; start with its `Research/README.md`. The current shared handoff is under `Documentation/`. Historical releases, earlier validation and old generated files belong under `Archives/`.

This project's `research/` directory contains required local generator inputs and review ledgers. Keep it with the project when building or distributing the portable source ZIP. Current local validation remains in `validation/v1.7.1`; older reports were moved into the platform archive. The active Git repository, platform build files, signing configuration and app records were not relocated.
