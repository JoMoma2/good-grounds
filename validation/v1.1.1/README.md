# 1.1.1 preview validation

49 unit tests and 150 browser acceptance checks passed. The five browser suites ran against web files extracted from `build/GoodGround-1.1.1-unsigned.ipa`, in Chromium and WebKit. The native bridge was simulated.

| Suite | Chromium | WebKit |
| --- | ---: | ---: |
| Main UI, routes, accessibility and layout | 17 | 17 |
| Training, profiles and household updates | 23 | 23 |
| Audio/input, lifecycle and storage edges | 15 | 15 |
| Native bridge contract simulation | 8 | 8 |
| Handoff-specific behavior and accessibility | 12 | 12 |

Reports contain no recorded runtime errors, failed assertions or external web requests. Automated accessibility scans passed on the checked surfaces; they do not replace VoiceOver testing.

The content checker verifies all 95 skills, 230 steps, 71 source records, prerequisite graph and matching generated bundles. Skill and step IDs match the original source. IPA ZIP integrity, version 1.1.1/build 3, all ten bundled web files and unchanged native executable were verified. The manifest includes the checksums.

Physical iPhone audio output, Silent-switch behavior, Bluetooth latency, VoiceOver, installation and the Swift runtime still need device checks. No release was published. All test records were invented; personal dog records were not read or packaged.
