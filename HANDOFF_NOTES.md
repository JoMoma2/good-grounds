# Current handoff

See [the 1.2.0 handoff](HANDOFF_1_2.md) for the current implementation. The earlier handoff below is historical; its clicker visibility, fridge grouping and backup-format descriptions were superseded in 1.2.0.

---

# Development handoff — 22 October 2026

This is a source update in `good-ground-iphone-github`, based on commit `739a5ce`. Version 1.1.1 (build 3) is packaged as a separate local unsigned preview at `build/GoodGround-1.1.1-unsigned.ipa`. No release was published. The existing Swift executable is reused unchanged; only metadata and bundled web assets are updated. Native storage and backup formats remain unchanged.

## What was found

The app already synthesized four offline marker sounds and handled touch, keyboard and assistive activation. The lesson button had no readable success status; its only confirmation was a subtle 120 ms effect. It was hidden by default and scrolled away. The full clicker combined advancement and easier-version guidance in one disclosure. Personalization repeated the same guidance on unrelated lessons, and its starting-plan cards did not filter completed steps. Most text used fixed pixel sizes, bypassing the text-size preference.

## Decisions and implemented behavior

| Feedback | Result |
| --- | --- |
| 1–3, 17: marker access and feedback | Mark & reward stays beside Set progress while reading, then settles at the ordinary action area. Sound, a visible button label and a live status confirm successful playback. Settings hides the lesson marker. New and migrated settings enable it; explicit existing off choices remain off. Clicker and Trends are under Lessons, with no dedicated clicker tab. |
| 4: current-step controls | Separate Move on when and Make it easier disclosures. The clicker also uses the same personalized teaching copy as the lesson. |
| 5: completion wording | Celebrate the work and offer a break, favorite or new skill. Removed “There’s no need to keep going today.” |
| 6: starting plan | A compact, initially collapsed list with ordinary button links. Completed starting steps are filtered for each selected dog; the section disappears when none remain. |
| 7: training groups | Native expandable topic groups, initially open. Collapsed groups are remembered during the visit; searching reveals matches. |
| 8–9: repetitive guidance and meaningful support | Removed the universal gentler-setup block. Confirmed observations select three smaller concrete actions in 14 relevant early teaching steps. The full guide remains available. Other lessons retain their normal teaching copy. |
| 10: Set progress | Shares the sticky lesson action area, without an overlay that remains detached after reaching its normal position. |
| 11: text sizing | Root-based scaling now includes headings, buttons, form labels, navigation, captions, research text and chart text. Icons and layout dimensions keep their own sizes. |
| 12: name cue | Name Recognition and its transfer lesson default to each dog’s current name. Explicit custom cues are preserved; clearing a cue restores its current default. |
| 13: profile updates | Relevant support and recommendations update on save. Changing breed clears the previous breed review, including when changing through Unknown/unlisted breeds. A familiar rejected question does not reappear on unrelated edits. Traits require owner confirmation. |
| 14: fridge task | Moved to Clever companions and condensed into one expandable four-skill chain in both the library and category view. Kept all teaching steps and record IDs. Rope pulling is an independent Play and jobs skill. |
| 15: curriculum | Reviewed the teaching content, setup and prerequisite relationships of all 95 skills. Changed four component relationships described below; retained compatible existing parallel practice and strict comfort/chain prerequisites. |
| 16, 18–22: navigation | More contains Settings, Source library, Your dogs and About Good Ground. Source library links to essentials and evidence; the practice-rhythm explanation lives within essentials. Lessons holds Trigger plans and Practice rhythm. The reminder setting and Backup & restore live in Settings; the tour lives in About. |

## Intentional limits and alternatives

- The clicker remains an explicit tool even when its lesson button is hidden. Hiding the shortcut does not erase sound preferences.
- The fridge chain is condensed in presentation, rather than deleting gradual steps or combining progress records. This protects existing records and keeps its component actions teachable.
- Breed alone never adds repetitions, changes criteria or infers anxiety. Smaller actions follow observed support needs. The 14 adapted steps are SOUND-1, KNOCK-1, BELL-1, OBJECT-1/2, CAR-1, HARNESS-1/2, HANDLE-1/2, BRUSH-1, TEETH-1, NAIL-1 and TUNNEL-1.
- Kept lesson-specific easier versions, advancement criteria and essential safety instructions. Removed the repeated extra setup block, rather than deleting useful teaching safeguards.
- Did not introduce a second curriculum mode or automatic advancement. Compatible skills already support parallel practice through existing prerequisites; fear/exposure stages retain gradual comfort requirements.
- Group collapse is a browsing preference for the current visit, not a new backup field.

## Curriculum decisions

- MARK explicitly teaches the selected spoken, physical or app marker, with a direct link from the clicker.

- PULL is exposed as **Tug a rope handle** in Play and jobs; its first step uses the already required take/drop components rather than assuming a completed give cue.
- CLOSE starts from **Nose target an object** instead of re-teaching pad targeting inside the door task. Its first step transfers the familiar pad to a stationary door; movement remains separate.
- BOX-1 needs delivery to the hand, not a complete outward retrieve. BOX-2 still requires retrieval before adding pickup and carry to the basket.
- FREE starts from any comfortable offered position instead of requiring a nearly finished sit. No new OR-prerequisite mechanism is necessary.
- All 95 skill IDs and 230 step IDs remain. Existing progress, notes, household ownership and exports are preserved.

## Validation

All 49 unit tests and 150 browser acceptance checks passed. The five browser suites ran against the web bundle extracted from the unsigned IPA in both Chromium and WebKit. Raw reports and the artifact manifest are in [validation/v1.1.1](validation/v1.1.1). The repeatable commands are `npm test`, `npm run check`, `npm run test:ui`, `npm run test:updates`, `npm run test:edges`, `npm run test:bridge` and `npm run test:handoff`. Browser suites support `GG_BROWSER=webkit`.

The focused handoff suite checks readable marker feedback, exact sound counts, muted/unavailable audio, Settings persistence, sticky bounds at 320/390 widths and landscape with both text sizes, separate clicker disclosures, navigation, scaling, name cues, support updates and accessibility. Holding Enter or Space produces one marker on keydown; key repeat and release do not add sounds. A touch release cannot navigate after an error changes the toolbar layout. Audio unit tests verify that a timed-out unlock cannot play a stale marker and that backgrounding prevents unattended playback.

Physical iPhone speaker output, Silent-switch behavior, Bluetooth latency, VoiceOver announcements and the Swift runtime still require device checks. Browser tests verify sound scheduling and state behavior, not the loudness of a real speaker.

## Per-skill curriculum review

Each unchanged row keeps its existing separate component stages and prerequisite rules. The Reward Marker lesson now explicitly includes spoken, physical and app markers. Dependencies below are the first step’s gates; subsequent step IDs and gates are validated by the complete graph checks.

| ID | Skill | First-step prerequisite | Decision |
| --- | --- | --- | --- |
| NAME | Name recognition | None | Keep |
| MARK | Reward marker | None | Keep |
| TOUCH | Hand target | None | Keep |
| SIT | Sit | None | Keep |
| DOWN | Lie down | None | Keep |
| STAND | Stand | None | Keep |
| FREE | Release from a position | None | Accept any comfortable offered position |
| DROP | Drop an item | None | Keep |
| LEAVE | Leave an item alone | None | Keep |
| WAIT | Short wait at an indoor doorway | FREE-2 nearly there | Keep |
| TOILET | Toilet routine | None | Keep |
| RECALL | Come when called, first at home | NAME-2 nearly there | Keep |
| OTARGET | Nose target an object | None | Keep |
| MAT | Go to a mat | None | Keep |
| SETTLE | Relax voluntarily on the mat | MAT-2 nearly there | Keep |
| SAFE | Choose a safe resting area | None | Keep |
| ALONE | Very brief comfortable alone time | None | Keep |
| RESTHEAD | Rest the head on a cushion | CHIN-1 nearly there | Keep |
| CHECK | Voluntary check-in | None | Keep |
| LOOSE | Loose-leash walking | HARNESS-3 nearly there | Keep |
| TURN | Happy turn-away | None | Keep |
| FIND | Find food on the ground | None | Keep |
| SIDE | Move behind you or to the far side | TOUCH-2 nearly there | Keep |
| DOG | Seeing a dog predicts good things | None | Keep |
| DISENGAGE | Choose to look away from another dog | DOG-2 nearly there | Keep |
| PARALLEL | Walk parallel at a comfortable distance | DOG-3 consistent, TURN-2 consistent | Keep |
| PASS | Make a wide planned pass | PARALLEL-2 consistent, TURN-3 consistent | Keep |
| STRANGER | Feel safer with an unfamiliar adult | None | Keep |
| KNOCK | Feel comfortable hearing a knock | None | Keep |
| BELL | Feel comfortable hearing the doorbell | None | Keep |
| DOOR | Knock means go to the mat | KNOCK-3 consistent, MAT-2 consistent, FREE-2 nearly there | Keep |
| VISITOR | Comfortable separated visitor routine | SAFE-2 consistent | Keep |
| GREET | Four paws greeting with familiar people | None | Keep |
| SOUND | Controlled sound practice | None | Keep |
| OUTSIDE | Noises outside and window activity | None | Keep |
| STORM | Prepare for unavoidable noise events | SAFE-1 nearly there | Keep |
| OBJECT | Comfort with an object or appliance | None | Keep |
| MOTION | Bikes, moving vehicles, or joggers at a distance | None | Keep |
| CAR | Comfort around a parked car | None | Keep |
| HARNESS | Comfortable harness routine | None | Keep |
| MUZZLE | Comfortable basket muzzle | None | Keep |
| CHIN | Voluntary chin rest | None | Keep |
| HANDLE | Cooperative gentle handling | CHIN-2 consistent | Keep |
| BRUSH | Comfort with a brush or towel | None | Keep |
| NAIL | Paw-care preparation | None | Keep |
| TEETH | Voluntary toothbrushing preparation | CHIN-1 nearly there | Keep |
| SCALE | Comfort on a floor scale | None | Keep |
| TAKE | Take a safe object | None | Keep |
| HOLD | Hold gently | TAKE-2 consistent, DROP-2 consistent | Keep |
| GIVE | Deliver into your hand | HOLD-1 nearly there, DROP-2 consistent | Keep |
| CARRY | Carry a few steps | HOLD-2 consistent, GIVE-2 consistent | Keep |
| FETCH | Retrieve a placed toy | CARRY-2 consistent | Keep |
| BOX | Put toys in a basket | GIVE-2 consistent | Begin basket release from delivery; gate pickup separately |
| SEARCH | Easy food search | None | Keep |
| TUG | Gentle tug with a release | DROP-2 consistent | Keep |
| SPIN | Small comfortable spin | None | Keep |
| PAW | Offer a paw | None | Keep |
| PULL | Tug a rope handle | TAKE-2 consistent, DROP-2 consistent | Independent rope component; move to Play and jobs |
| OPEN | Open this refrigerator | PULL-3 consistent | Group in Clever companions fridge chain |
| CLOSE | Nose-push a door closed | OTARGET-2 consistent | Use object-target foundation; move into fridge chain |
| SHELF | Retrieve a drink carrier from a shelf | FETCH-2 consistent | Group in Clever companions fridge chain |
| DRINK | Complete the fridge drink chain | OPEN-3 consistent, SHELF-3 consistent | Group in Clever companions fridge chain |
| BOW | Take a little bow | None | Keep |
| MIDDLE | Stand between your legs | TOUCH-2 nearly there | Keep |
| WEAVE | A slow figure eight | MIDDLE-1 consistent | Keep |
| NOSEBALL | Roll a ball with the nose | None | Keep |
| BOWL | Dog bowling | NOSEBALL-3 consistent | Keep |
| GOAL | Score a gentle goal | NOSEBALL-3 consistent | Keep |
| HIGHFIVE | Low high five | PAW-1 consistent | Keep |
| WAVE | A little wave | HIGHFIVE-2 consistent | Keep |
| POSE | A comfortable photo pose | None | Keep |
| TOYNAME | Give one toy a name | FETCH-2 nearly there | Keep |
| TWOOBJECT | An optional two-toy choice | TOYNAME-2 consistent | Keep |
| CARDS | Respond to picture cue cards | TOUCH-2 consistent | Keep |
| NAMECTX | Name response in new settings | NAME-2 consistent | Keep |
| RECALLCTX | Recall in a new safe setting | RECALL-2 consistent, HARNESS-3 consistent | Keep |
| MATCTX | Mat comfort in another place | MAT-2 consistent, SETTLE-2 consistent | Keep |
| WALKCTX | Loose walking in another place | LOOSE-3 consistent, TURN-2 nearly there | Keep |
| KEEP | Maintain skills and review changes | None | Keep |
| BACK | Back up a few steps | None | Keep |
| CONE | Go around a cone | TOUCH-2 nearly there | Keep |
| CONEEIGHT | Figure eight around two markers | CONE-2 consistent | Keep |
| FEET | Front paws on a flat target | None | Keep |
| HOOP | Walk through a floor-level hoop | TOUCH-2 nearly there | Keep |
| TUNNEL | Explore an open tunnel | None | Keep |
| BUTTON | Press a large quiet button | OTARGET-2 nearly there | Keep |
| SLIPPERS | Bring a designated slipper | FETCH-2 consistent, GIVE-1 consistent | Keep |
| POUCH | Carry a little pouch | CARRY-1 consistent, GIVE-1 consistent | Keep |
| MESSENGER | Deliver to a familiar person | CARRY-1 consistent, GIVE-1 consistent | Keep |
| LAUNDRY | Place safe cloths in a basket | BOX-2 consistent | Keep |
| BOXFIND | Search a few open boxes | SEARCH-1 nearly there | Keep |
| TOWEL | Unfold a loose food towel | None | Keep |
| LOSTTOY | Find a partly hidden toy | None | Keep |
| TRAIL | Follow a short food trail | None | Keep |
| HIDESEEK | Find a familiar person | None | Keep |
