# Good Ground 1.2.0 — development decisions

Version 1.2.0/build 4 is an unsigned local installer update, with curriculum 5. The existing native executable and Swift source remain unchanged. The active project stays inside the user's Good Ground directory.

## Clicker first

The existing sound is generated in `app/web/marker.js`; there are no downloaded recordings. Before constructing or resuming Web Audio, the marker now requests `navigator.audioSession.type = 'playback'`. A WebKit engineer documents this as the iOS 17+ route for Web Audio with Silent mode enabled: [WebKit issue 237322, comment 6](https://bugs.webkit.org/show_bug.cgi?id=237322#c6). It needs no new user permission or per-use setup beyond pressing the marker. The request is repeated for each activation in case the session policy changes.

Unsupported/rejected audio-session policies preserve ordinary audio playback. iOS 16 is still supported by the app, but this web API cannot promise Silent-mode output there. The native alternative is an AVAudioSession playback category and a freshly compiled native shell; that is not silently claimed as part of this asset-only package. No silent-audio loop, lock-screen media controls, or unreliable silent-switch inference was introduced. The browser cannot reliably detect whether sound reached a speaker, so success feedback does not claim that it has measured audibility.

Hiding the clicker removes lesson controls, Open clicker links, the Lessons shortcut and the Settings sound link. A direct saved clicker route explains that it is hidden and links to Settings. Set progress gets the full action row. The setting label now describes its full scope. Sound preferences are retained.

Verification distinguishes synthesized waveforms, real desktop audio-graph output and physical speaker output. The focused browser suite measures a nonzero signal downstream of the marker gain, alongside exact activation counts, readable feedback, keyboard/held keys, unsupported audio, hidden controls and full-width progress. No physical iPhone or Silent-switch test was available in this Linux workspace.

## Existing UX and recommendations

The breed search inherited a 13px input rule. It now uses 1rem (16px at normal size and 19px with larger text), addressing the usual iPhone focus-zoom trigger while preserving pinch zoom. A desktop phone viewport cannot verify the actual iPhone keyboard and viewport behavior; a remaining device-specific issue needs a phone check.

The Practice Reminders link opens `#/basics/practice-rhythms`, scrolls to the corresponding section and focuses it. It no longer opens only the top of Training Essentials.

Today uses the ordinary foundational recommendation order without anxiety/trait ranking boosts. Continued practice and saved lessons still count. A separate collapsed “For your dog’s trouble spots” section contains relevant, available next steps; it disappears when nothing relevant remains. Profile edits still update it and step-specific practice pieces immediately. There is no new obedience prerequisite on anxiety work: the separation concerns recommendation presentation, not withholding support.

## Advanced curriculum

Brainiacs is last in the catalog. It contains:

| Project | Steps | Component foundation |
| --- | ---: | --- |
| Getting a drink from the fridge | 13 | Rope handle, object targeting, retrieve, give |
| Find and deliver a named toy | 12 | Two-toy choices, partly hidden toy, give |
| Two-toy tidy-up | 12 | Pickup, carry and basket deposit |
| A two-person delivery round | 12 | Messenger, pouch carrying and mat station |

The three new projects develop different problems: finding a requested object, choosing its destination, and connecting a social delivery route with collection and return. They use short reward-based component work, not long unrewarded chains. Label learning and sorting are optional experiments without intelligence claims. Floor-level movement, safe props and voluntary participation remain central.

The fridge is now one skill, retaining all 13 original step IDs and all component cue keys. Legacy lesson URLs, notes and progress remain valid; old OPEN/CLOSE/SHELF favorites map to the project. Setup and cue controls follow the current component, so the opening cue is not replaced by the final chain cue. Old Fridge task topic links open Brainiacs. Comfort with appliance movement can be practiced before rope pulling; pulling is still required before asking the dog to open the door. Retrieval from a human-opened fridge can be learned alongside opening. Dog closure retains its own targeting prerequisites; human closure remains a valid simpler routine.

Inputs are `scripts/advanced-content.py` and `scripts/extend-content.py`; generated data bundles agree. The catalog still has 95 skills because three former fridge component cards were combined while three new projects were added. There are 266 teaching steps and 71 sources. No old step record is deleted.

These are original teaching adaptations, not validated research protocols. Existing references support components and principles. Rechecked primary guides include [Dogs Trust toy tidying](https://www.dogstrust.org.uk/dog-advice/training/tips-tricks/tidying-up), [AKC fetching](https://www.akc.org/expert-advice/training/teach-your-dog-to-fetch/) and [the object-label study](https://www.nature.com/articles/s41598-023-30201-1). Their limits still apply; success is not guaranteed for every dog.

## Historical progress

The old model retained only the latest status and timestamp per step. It was insufficient for an honest historical curve. The new per-dog `progressHistory` stores observed date, curriculum version, and completed-skill/total-skill counts for each category. First launch of this version records the actual current baseline; old timestamps are not transformed into invented history. Later completion changes produce new observations. Within one date the last observed state is retained. Notes, partial steps and clicker presses do not create completion gains.

Trends keeps current step-based bars and adds a calendar-spaced 0–100% completed-skill line chart. Categories share colors between bars and lines, with dash patterns, selectable legend and a recorded-values table. Flat segments preserve the last observed value through today, including 100%; reducing actual completion lowers the line. A new category starts at its first observation, and a removed category stops at its final observation. Old numerator/denominator pairs are frozen; catalog changes affect only later observations. The table shows the latest 30 observation dates; backups retain all observations. Device calendar dates are the time basis; future-dated records are preserved but not plotted before their date.

Backup format is now 3. Versions 1 and 2 still import with an empty history that starts at observation. Validation covers every dog's history. The wire-format guard now requires Good Ground 1.2, so older app code refuses new records rather than silently stripping history. Native schema remains 1. Restoring replaces history as well as other records, as the confirmation explains.

## Shared training

Genuine household sync is deferred. The app has no account, backend, concurrent-write model or network access, and backup import replaces rather than merges records. A shared JSON file would risk lost progress. [The synchronization assessment](research/SYNC_ASSESSMENT.md) describes a maintainable direction and the two-device conflict/reliability checks needed before shipping it. No uploads or accounts were added.

## Delivery and limits

See `VALIDATION.md` and `validation/v1.2.0` for checks actually completed. The unsigned IPA reuses the existing native executable. Installation, the iPhone Silent switch, physical audio, VoiceOver and native Files behavior need a device. Old installers/source archives remain under the Good Ground previous-versions folder. No release was published or remote repository changed.
