# Brainiacs rework — Good Ground 1.3.0, curriculum 6

The curriculum structure and software validation are complete. Real-world training outcomes have not been tested with dogs. The existing native iPhone executable is reused unchanged; this is an unsigned local update, not a published release.

## What now qualifies

Brainiacs contains four complete, multi-behavior projects at the bottom of Lessons. The counts below include their component teaching steps, not repeated copies of general foundations. Each project's final assembly has four steps; the independent components supply the rest. There is no rule that a project must be padded to a particular length.

| Project | Component groups | Teaching steps | Finished behavior |
| --- | --- | ---: | --- |
| Getting a drink from the fridge | Opening, shelf retrieve, optional closing, assembly | 13 (10 required, 3 optional closing) | Open an approved easy door, collect a protected drink carrier, give it to the handler and finish with human or dog closure. |
| Sort the toys | Two-toy destinations, third destination and additional examples, assembly | 11 | Pick up a mixed set of individually taught balls, stuffed toys and rope props and deposit each in its matching basket, then finish. |
| Courier to a named person | Familiar-person names, delivery round, assembly | 12 | Collect a safe pouch, choose the requested familiar adult, hand it over and return to the sender. Choices are checked with both recipients present, swapped positions and unequal distances. |
| Ready for a walk | Walk-kit retrieval, harness participation, doorway wait, assembly | 12 | Retrieve and give the protected equipment carrier, participate in fitting, approach a controlled door and wait for the human's safe release. |

Sorting does not promise abstract category understanding. Each new object is deliberately taught its destination before mixed sorting, including second examples. Courier teaches two familiar named adults, not arbitrary faces, strangers or crowd searches. Walk equipment travels in a protected carrier; the human handles clips, fit and exits. The fridge uses a suitable drink carrier rather than a bare metal can in the mouth.

The three previous 12-step guides were shortened to four active steps each. Named-toy searching now lives in Scent adventures; two-toy tidying and the single-recipient delivery round live in Useful little jobs. The latter two are useful reusable components of the new projects, rather than being presented as finished Brainiacs accomplishments themselves.

## Independent skills and dropdowns

OPEN, SHELF and CLOSE are restored as independent skills, alongside PULL, FETCH, GIVE and OTARGET. Brainiacs cards open project overviews with native expandable component groups. Each dropdown exposes all its steps and their actual availability/progress; the reusable foundations have their own expandable step lists too. Ordinary lessons retain the short step strip, and a collapsed project map links supporting lessons back to the full activity.

This restores the useful dropdown experience without recreating one long mandatory sequence. Appliance comfort does not wait for rope pulling. Actual door pulling does. A human-opened shelf retrieve can be learned while opening is still being taught. Dog closure is optional; a human-closed routine can complete without grading dog-closing steps. Components are counted once as ordinary skills; opening a project never duplicates their progress.

Sorting's first, second and third toy/basket pairings can be learned separately. Two person/name associations can be learned separately. Equipment retrieval, comfortable fitting and doorway waiting can be learned separately. Assembly steps retain the prerequisite links that actually connect those behaviors.

After a consistent grade, navigation chooses a ready next step, including an earlier unfinished parallel branch. It does not jump into a blocked or paused branch. A completion celebration requires every active step in that skill to be consistent, not merely the last displayed step.

## The prerequisite audit

The entire catalog was compared with 1.1.0 (`739a5ce`), 1.1.1 (`014e777`) and 1.2.0 (`ba0d69a`). See [every skill and reviewed historical edge](research/PREREQUISITE_AUDIT.md) and the [machine-readable audit](research/prerequisite-audit.json). `npm run check` reruns the audit from bundled baselines, including in a portable source ZIP without Git.

The reported rope prerequisite was obscured, rather than wholly deleted: 1.2.0 moved PULL-3 from appliance-comfort introduction to actual door pulling. The merged project's initial comfort page looked available and hid that relationship. Independent skills are restored, and DRINK-2 now lists PULL-3 directly as well as OPEN-3 and its retrieval ending. The separate project overview shows rope pulling among the reusable foundations.

Additional findings and corrections:

- Floor pickup in the old delivery round assumed a retrieve without requiring one. The new collection step explicitly requires FETCH-2.
- Leashed turn-away and floor leave-it practice now require comfortable equipment at the step using it; their introductory actions remain independent.
- Brush appearance no longer waits for a chin rest. Actual lip-touch preparation requires the voluntary start/exit signal from CHIN-2.
- The two weave loops and two picture/action pairings can be practiced independently; their combinations require both pieces.
- The first picture pairing no longer waits for hand targeting that is used only by the second picture.
- Toy-label play no longer waits for retrieval. The second toy's association can be taught separately; mixed choices require both associations.
- Empty pouch and second-person handovers no longer wait for a carry. Moving with the prop still requires the carrying component.
- Introducing the shelf carrier at the hand and a cloth deposit over a basket no longer wait for an outward retrieve. Their later pickups explicitly retain that requirement.

Sound earlier decisions were retained: release can start from any comfortable known posture; basket release precedes floor retrieval; door-pad work builds on the independent object target. Fear/exposure comfort criteria and genuine sequential dependencies remain in place. Manual grading still trusts the user's actual knowledge of their dog; navigation does not infer that reading a prerequisite teaches it.

## Preserving existing records

All 266 previous step IDs resolve. The original 230 earlier steps remain active. The 36 superseded 1.2.0 guide steps remain available as clearly labeled earlier guides, with their original instructions, stages, editable notes and journal links. Exact-ID searches find them. Old journal edits retain their original step IDs. Backups retain every original record and custom cue.

Replacement steps use new letter-suffixed IDs. A replacement receives consistency credit only when every mapped earlier criterion is already consistent. Pauses carry forward. Partial records do not become completion, and an explicit grade on a replacement is never overwritten. The original records and timestamps are kept; their notes are not merged destructively into a new field. Broader named-toy choice criteria require the old choice step as well as early delivery work. New three-destination sorting and named-recipient Courier are never inferred from the easier old routines.

Migration operates separately for each dog and is idempotent. Historical percentages keep their original counts and curriculum version. The new catalog can change current percentages and captures a new observed snapshot; it does not rewrite older dates. Same-day history continues to retain the last observed state for that day. The native schema and backup format remain unchanged from 1.2.0 because no new personal-record fields are required.

## Suggestions deliberately not included

Make Your Bed, Find the Family and The Artist were evaluated but are not added in this release. The category now has the requested fridge project plus three substantial alternatives, with distinct destination choice, person recognition and practical sequencing.

- **Make Your Bed:** blanket retrieval is straightforward to build from existing skills, but voluntarily getting under or pulling a blanket over the body needs its own comfort and prop design. Replacing that central behavior with a blanket drop would miss the requested trick; it was deferred instead of filling the category with that substitute.
- **Find the Family:** existing hide-and-seek plus the new named-person skill provide components, but finding an absent named person and returning to guide someone is a separate project. Courier intentionally keeps recipients visible. Crowd searches are outside this curriculum, and no search-and-rescue reliability is claimed.
- **The Artist:** a useful art routine would need a specific safe tool and material setup. A single target press would undershoot the requested project; generic mouth-held markers/paintbrushes and ordinary art-product “non-toxic” labels are not sufficient material specifications. No improvised art protocol was added.

These choices keep four developed projects rather than expanding the category with underspecified extras.

## Careful cleanup

No personal-state or backup JSON files were found in the Good Ground project tree. The shipped HTML does not contain a test boot profile, and fresh state has no saved progress or sessions. Browser localStorage and iPhone Application Support records are outside these source files and were not erased or reset.

Removed 174 generated files only after verifying they matched retained installers/source ZIPs byte for byte: an old source extraction and two old app previews. Four generated Python bytecode files were also removed. One extracted copy differed in two documentation files, so it was preserved. Intentional fixtures, validation reports, current source, configurations, Android files and historical installers/archives were retained. See [the exact cleanup record](research/CLEANUP_1_3.json).

## Validation and delivery

[VALIDATION.md](VALIDATION.md) and `validation/v1.3.0` distinguish completed checks from device limitations. Tests cover parallel readiness, the rope gate, paused prerequisites, component-to-project navigation, mixed-recipient lesson criteria, conservative credit, old-note editing, old journal links, per-dog isolation, backups, exact-ID routes and narrow/large-text project accessibility. Every active lesson and every preserved earlier page is exercised. The installer web bundle matches source, and the native binary is unchanged.

Training sequences are original educational adaptations, not experimentally validated protocols. Primary guides used for component principles include [Dogs Trust toy tidying](https://www.dogstrust.org.uk/dog-advice/training/tips-tricks/tidying-up) and [AKC fetching](https://www.akc.org/expert-advice/training/teach-your-dog-to-fetch/); [the object-label study](https://www.nature.com/articles/s41598-023-30201-1) supports caution about inference from toy-label games. No physical dog-training trial, iPhone installation, VoiceOver session or native runtime test was performed here.
