# Version 1.5.1 feedback connection validation — October 25, 2026

This patch configures the owner-provided public form ID `moeeevrq` in both bundled apps, increments the app version/build to 1.5.1/9, and makes feedback browser fixtures independent of the configured ID. No lesson content, training records, storage formats or native networking code changes.

Current checks and package results are recorded in `validation/v1.5.1`. The complete 1.5.0 redesign verification is preserved in [the baseline report](docs/archive/VALIDATION_1_5_0.md) and `validation/v1.5.0`.

No live feedback message has been sent by automated checks. The owner still needs to verify Formspree email notifications, disable interactive CAPTCHA, leave domain restrictions unset, and test inbox/dashboard delivery from both installed apps. Physical-device and assistive-technology checks from the baseline remain pending. The unsigned iPhone build reuses its existing native executable rather than compiling Swift on Linux.

## Completed for this patch

- 95 unit tests per platform; bundled-resource checks and full curriculum audit (154 skills, 384 active steps, 36 preserved earlier steps, 77 references; four historical baselines).
- 11 grouped redesign checks in Chromium and WebKit on both platforms. The shipped endpoint and About version are checked; all form submissions are intercepted. Success, minimal payload, consent, cooldown, quota, malformed replies, offline/network failures, timeout, in-flight navigation and local-file origin remain covered, as do lesson preferences, record/backup compatibility, mobile/large-text layouts and WCAG 2 A/AA automated checks.
- Non-submitting OPTIONS preflight to the actual endpoint accepted both `null` (file origin) and `https://appassets.androidplatform.net`, with POST and content-type permitted. The provider edge rejected Python's default user agent; using an app browser user agent succeeded. This does not prove email delivery or account/CAPTCHA settings.
- Android debug/release builds and lint passed. Original release certificate, package identity, 1.5.1/build 9 and 16 KB alignment verified. No native source or permissions changed in this patch.
- iPhone package retains the native executable byte-for-byte and uses the current interface bundle, 1.5.1/build 9. Both installers and portable source archives are checksum-verified and checked against the current sources.
- All training content, core state/backup code and native networking code are byte-identical to 1.5.0. The runtime changes are the public endpoint and displayed version only. No personal-device records were accessed or reset.

Native emulator checks from 1.5.0 were not repeated for this configuration-only patch. The native feedback assertion was updated for enabled submission. No live feedback POST, email or provider account changes were performed; install and verify the inbox on actual devices before wider distribution.
