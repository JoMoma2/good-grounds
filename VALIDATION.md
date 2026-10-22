# Current verification — 1.3.0/build 5

**77 unit tests and 198 browser acceptance checks passed.** Six suites ran in Chromium and WebKit against the final unsigned IPA's extracted web bundle, plus the focused handoff and curriculum suites in Firefox. The main route sweep covers 264 active lessons, 14 categories and 71 references per main engine; the new suite also opens all 36 preserved earlier pages in each of the three engines. Raw reports and final-run logs are in [validation/v1.3.0](validation/v1.3.0).

The full prerequisite audit compares versions 1.1.0, 1.1.1 and 1.2.0. It permits no undocumented edge change, missing old step or broken current lesson reference; the active graph is acyclic. Behavior tests cover independent components, strict combination gates, pauses, actual floor-pickup/equipment/participation dependencies, ready-next-step navigation and no celebration for partial skills. Earlier grades receive credit only for fully covered replacement criteria; explicit grades, per-dog ownership, old notes/journal links, backups and old historical percentages are preserved.

The project maps and their dropdowns pass scoped automated WCAG A/AA scans at narrow width, larger text and dark theme. All checked interface scenarios record zero JavaScript errors and external requests. The unchanged audio tests verify a nonzero signal in a real desktop graph, not physical iPhone output.

The installer has 11 web assets matching source and the unchanged native executable, with version 1.3.0/build 5 metadata. The generator is reproducible; an independently extracted source ZIP passes the content/prerequisite audit and all 77 unit tests without Git. Cleanup removed 174 verified generated duplicate files and four bytecode caches; uncertain files and personal stores were retained.

**Not verified:** real training outcomes with dogs; physical iPhone sound/Silent mode, keyboard behavior, VoiceOver, native Files, installation/LiveContainer, Swift runtime or simulator. The existing iOS 17+ playback implementation is unchanged; iOS 16 Silent output remains limited. No remote release was published. Earlier release evidence below is historical.

---

# Current verification — 1.2.0/build 4

**62 unit tests and 174 browser acceptance checks passed.** Five suites ran in Chromium and WebKit against the web assets extracted from the final unsigned IPA; the focused local-file suite also ran in Firefox. The route sweep includes every one of the 266 lesson steps, 14 categories and 71 references per main engine. Raw reports and final-run logs are in [validation/v1.2.0](validation/v1.2.0).

Audio checks measured a nonzero ding signal after the real marker gain, verified one activation per press and covered unsupported audio, timeouts, backgrounding and hidden controls. This is digital graph verification, **not physical iPhone speaker or Silent-switch verification**. Desktop engines did not expose the iPhone audio-session API; a separate unit harness checks playback-policy ordering and fallback. iOS 17+ Silent playback still needs a device test, and iOS 16 can still obey Silent mode.

History checks cover actual first-observed baselines, daily replacement, full-skill percentages, calendar spacing, overlapping 100% lines, progress rollback, frozen catalog denominators, new/removed categories, future dates, per-dog isolation, backups and rejection by old app code. Every original step ID is retained. Profile-refresh behavior and the separate foundational/support recommendations passed UI checks. Breed search computes to at least 16px without disabling zoom; actual iPhone keyboard behavior remains untested.

The unsigned IPA has 11 web files matching source and its native executable is unchanged. An independently extracted source ZIP passes content checks and all unit tests. Physical iPhone, VoiceOver, native Swift/Files and installation checks remain pending. No cloud sync, publication or remote repository changes occurred. Earlier reports below are historical.

---

# 1.1.1 development handoff preview

The latest local preview passed **49 unit tests and 150 browser acceptance checks**. All five browser suites ran in Chromium and WebKit against the web bundle extracted from the unsigned IPA. Reports, limitations and artifact hashes are in [validation/v1.1.1](validation/v1.1.1).

The IPA contains version 1.1.1/build 3 with web assets matching source and the original native executable unchanged. Physical iPhone audio, VoiceOver, installation and the Swift runtime remain untested. No release was published.

The sections below describe the earlier 1.1.0 release and are historical.

---

# What has actually been checked — iPhone 1.1

The updated bundled interface is packaged inside the **unchanged existing native iPhone executable**. The Swift source is unchanged. This Ubuntu session does not compile Swift, sign the app, run an iPhone simulator or test a physical iPhone. The release includes an unsigned IPA; a fresh native build can still use the supplied macOS workflow.

## Passed in this update

- **43 behavior tests:** the original 21 plus 22 update tests. These cover all 125 combinations of three dogs’ progress stages, 500 varied group updates across eight dogs, independent records and selection, legacy migration, multi-dog backups, format protection, practice dates, reminder exclusions, original bounded sound waveforms, cues, support preferences and real prerequisite edges.
- **63 browser/bridge scenarios per engine, 126 across Chromium and WebKit:** 17 original interface scenarios, 23 feature scenarios, 15 additional edge scenarios and 8 native-bridge contract scenarios.
- The original route sweep covers **230 lesson pages, 14 topics and 71 reference pages in each engine**. All 95 skills and 230 teaching procedures match the previous source exactly; no extra tricks were added.
- First launch: single-dog skip, sequential multiple-dog names, duplicate/empty names, resumable setup, changing counts, an interrupted breed question, completing the final setup snapshot, adding a companion to an unnamed dog, replaying/skipping the tour and choosing two of five dogs.
- Group training: earliest available gap, competency notes, exact progress subsets, paused dogs excluded by default, separate notes/cues/journals/plans, per-dog charts and backups containing every dog even when only a subset is selected.
- Sound: actual desktop Web Audio scheduling for touch, held presses, rapid presses, keyboard and assistive clicks. Each activation schedules one marker. Suspended audio resumes on a gesture; failures are reported without recording practice. Four original waveform buffers were checked at several sample rates for finite, bounded output and fade to silence.
- Practice: logged dates, one-tap entries, duplicate quick-log prevention, calendar-day/DST handling, note edits not resetting practice, future/unrelated logs excluded, reminder dismissal/off and refresh after backgrounding. A long household break returns to dog selection while protecting records.
- Profiles: 209 searchable breed names, aliases, accent/hyphen tolerance, mixed/unknown/custom labels, opt-in breed questions, no automatic traits from breed, preferences applying only to the right dogs and unchanged lesson criteria.
- Storage/compatibility: invalid imports and corruption protection, native save acknowledgements, older acknowledgements, retry/export failures, cold starts and previous-save recovery. Near the record limit, an oversized note remains on screen until it can be saved. The original app validator rejects the new wire-format protection marker instead of silently discarding household records. New exports use backup version 2; old version 1 backups still import.
- Layouts include **320, 390, 430, 568 and 768 pixel widths**, compact landscape, dark theme, larger text and long dog names. No document horizontal overflow remains on the tested views. Teaching-step strips intentionally scroll horizontally within their own area.
- Automated WCAG A/AA scans found **zero violations on the checked main pages, forms, group lessons, household chooser, progress dialog, breed picker and confirmation screens**. This is not a full accessibility certification or a VoiceOver test.
- The bundled screens made **no external network requests** in the acceptance suites. Source websites are links and were not loaded by those offline interface checks.
- JSON/JavaScript curriculum bundles regenerate byte-for-byte. Source IDs, acyclic prerequisites, forward/reverse links, bundled assets, local documentation links, Python/shell syntax, metadata and the build workflow pass structural checks.

Current raw reports are in [validation/v1.1.0](validation/v1.1.0). Reports directly under `validation/` from the earlier release are historical. Tests and preview images use invented or empty records; none are bundled as a user's initial history.

## Release artifact checks

The release process verifies ZIP integrity, every bundled web file against source, the iPhone identifier/platform/version, original file permissions, and byte-for-byte preservation of the native executable. The original IPA and ZIPs are retained under `GoodGround-iPhone/previous-builds/1.0.0` outside the source folder. A manifest and SHA-256 checksums identify the current files. The final check runs target the web folder extracted from the release IPA, and the source ZIP is independently extracted and checked.

## Still needs an iPhone or macOS

- Sign/install through the existing SideStore or LiveContainer setup and use the same data container; export a backup first.
- Confirm audible output, media volume, Silent-switch behavior and Bluetooth latency. Desktop Web Audio scheduling does not prove what comes from an iPhone speaker.
- Confirm safe areas, VoiceOver, close/reopen persistence, Files export/import and any LiveContainer-specific behavior on the actual device.
- The updated workflow can compile and exercise a fresh iPhone simulator build on macOS. It is configured, not claimed as run in this session.

Research choices and access limits are recorded in [research/IPHONE_UPDATE_RESEARCH.md](research/IPHONE_UPDATE_RESEARCH.md). Weekly reminders are explicitly a product preference, not a measured forgetting deadline. Owner-confirmed support is educational guidance, not a breed diagnosis or clinical treatment algorithm.
