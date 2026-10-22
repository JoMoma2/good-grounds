# 1.2.0 — clicker, advanced projects and history

- Request the iOS 17+ playback session for Silent-mode marking; retain ordinary playback on unsupported engines. Physical iPhone verification is still required.
- Hide all clicker entry points when disabled and expand Set progress to the full row.
- Correct the breed-search input size and Practice Reminders section link.
- Preserve foundational starting suggestions and put live profile-based recommendations in a separate optional section.
- Add Brainiacs at the bottom: one 13-step fridge project preserving old records, plus three 12-step projects.
- Keep current progress bars and add real dated category completion lines. History begins at the first observation with this update, not an invented past curve.
- Export backup version 3, accepting versions 1 and 2; protect new history from older app code.
- Defer true shared training pending a backend, access model and conflict-safe offline synchronization.

See [implementation decisions and limits](HANDOFF_1_2.md), [validation](VALIDATION.md), and [installation](INSTALL.md). Earlier notes below are historical.

---

# 1.1.1 development handoff preview — 22 October 2026

- Marker feedback and persistent lesson controls, with touch and keyboard fixes and a Settings toggle.
- Four-tab navigation; training tools under Lessons, reference material under Source library, backups and reminders in Settings.
- Consistent larger text, collapsible groups, quieter starting suggestions and dog-name cues.
- Step-specific gradual practice based on confirmed observations; profile updates refresh relevant support.
- Reviewed all 95 skills; grouped the fridge chain under Clever companions and corrected selected component prerequisites without changing record IDs.

See [HANDOFF_NOTES.md](HANDOFF_NOTES.md) for decisions, intentional limits and validation. The local unsigned preview preserves the native binary. No release was published; physical-device checks remain outstanding.

---

# Good Ground for iPhone 1.1

Updated 21 October 2026. Android files were left untouched.

1. **Training for any dog.** Breed-specific advice was replaced with individual guidance. Research titles retain their original wording.
2. **A pocket clicker.** The Clicker tab has a large button, four original offline sounds, volume control and the current lesson's instructions. The small in-lesson button is optional. Sound presses never log practice automatically.
3. **Move naturally through steps.** Marking a step Consistent opens its next step. At the end, optional suggestions offer up to three practical choices, a fun activity and a clear option to stop.
4. **A practice rhythm.** Lessons show the last logged practice; a quick entry can record today's work. Learned basics and walk skills can receive gentle reminders after a week, two weeks or a month. Reminders can be dismissed or disabled. They are not claims that a dog has forgotten.
5. **A first-use guide.** Dog setup comes first, followed by a short tour that can be skipped or reopened from More. Tour content lives in one editable file.
6. **A space for every dog.** Setup asks how many dogs you have and introduces them one at a time. One dog can skip a profile; multiple dogs need distinct names. Choose any subset when opening the app or after a longer break. Each dog keeps separate progress, notes, cues, plans and practice. Group suggestions follow the earliest available training gap and name dogs who already know a step. Progress and journal controls can apply to only the dogs you choose; charts show one dog at a time.
7. **Your own cues.** The existing cue text can be edited directly without a setup prompt. Suggestions stay prefilled, custom cues are searchable, and each dog can use different wording.
8. **See what a foundation unlocks.** Small, collapsed links at the bottom of a lesson lead to the skills that use it. The larger prerequisite links remain.
9. **Breed search and individual support.** Search 209 names or enter a mix, unknown or unlisted dog. A few documented associations can invite an optional question about sound sensitivity or fear. Confirmed observations add gentler setups and relevant starting suggestions; any dog can use the same support preferences. Breed alone changes nothing. Nutrition prescriptions, temperament ratings and arbitrary extra repetition requirements were not added.

The existing **95 skills and 230 teaching steps are unchanged**. No additional tricks were added. The research shelf now has 71 records.

## Records and installation

Old single-dog saves and version 1 backups migrate without losing records. New exports use version 2 so an older app cannot silently discard household records. Export a backup before updating and keep the same iPhone/LiveContainer data container.

This release updates the bundled interface inside the existing unsigned iPhone shell. The Swift shell source and native executable are unchanged. The supplied build workflow can also compile a fresh shell on macOS. Browser/WebKit and bridge-contract results are documented in [VALIDATION.md](VALIDATION.md); a physical iPhone still needs to confirm installation, audible output and device-specific behavior.

See [DEVELOPING.md](DEVELOPING.md) for the tour, household format, sounds, research decisions and future editing instructions.
