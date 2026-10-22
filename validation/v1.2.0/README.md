# Version 1.2.0 verification

62 unit tests pass. Five suites pass against the IPA-extracted bundle in Chromium and WebKit (79 checks per engine), plus 16 focused Firefox local-file checks: 174 browser acceptance checks total. Reports and final-run logs are alongside this file. The route sweep covers all 266 teaching steps, 14 categories and 71 reference records per main engine.

The focused suite measures nonzero real Web Audio output after the marker gain (peak approximately 0.251 at test volume), as well as activation counts. This tests digital rendering, not a physical speaker. All three desktop engines report the audio-session policy API as unsupported; a separate unit harness verifies policy selection before context construction and unsupported/rejected-policy fallback. None can exercise an iPhone Silent switch.

ZIP integrity, all 11 bundled web files and preservation of the native executable are checked by repackage-ios.py. The 62 unit tests and content check also run from an independently extracted source ZIP. The source archive excludes Git, dependencies, build outputs and user records. See artifact.manifest.json and source-archive-check.json.

Still unverified: physical iPhone sound with Silent mode on/off; media-volume/Bluetooth routing; actual keyboard/focus zoom; VoiceOver; installation/LiveContainer; native Swift and Files behavior. No macOS build or simulator was run. The iOS 17+ web playback policy is implemented; iOS 16 Silent output is not guaranteed.

All test data is invented in isolated browser stores. The shipped app has no prefilled progress history. Earlier 1.1.x validation files remain historical, unchanged evidence.
