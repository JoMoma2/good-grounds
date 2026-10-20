# Good Ground

A personal, offline dog-training companion for iPhone. **95 skills and programs, 230 teaching steps, 67 research and professional reference records.**

**This folder is the complete app source and build kit. It is not an installable IPA yet.** The interface and training logic have been tested on Ubuntu in Chromium and WebKit. The supplied GitHub workflow compiles the native iOS shell, checks it in an iPhone simulator, and produces the unsigned IPA for SideStore or LiveContainer. That macOS workflow and a physical iPhone still need to be run.

Start with **[INSTALL.md](INSTALL.md)**. You do not need your own Mac, an App Store submission, Apple Developer Program membership, or Apple credentials in GitHub for this unsigned build route. Your existing sideloading setup remains responsible for signing and refreshing. LiveContainer compatibility needs confirmation on your phone.

## What the app does

- **Today:** ready lessons, current practice, selected priorities, and an optional fun suggestion.
- **Learn:** searchable teaching guides by topic, exact Step ID search, saved skills, and prerequisite links.
- **Lesson pages:** setup, actual teaching instructions, advancement criteria, easier versions, progress stages, notes, source links, previous/next buttons, and optional horizontal swipes over lesson text. Swipes never change progress.
- **Journal:** dated sessions, exact setup, optional counts, body language, response descriptions, recovery observations, editing and deletion.
- **Trends:** learning completion and separate trigger-specific observations. Unknown observations stay unknown. Charts do not measure an anxiety cure.
- **More:** dog profile, trigger plans, training essentials, evidence and limitations, source library, backups and appearance.

Name recognition stays a two-step acquisition lesson. Practice in new settings is a separate program. Anxiety work does not require obedience before rewards. Numerical advancement criteria are practical planning rules, not validated clinical cutoffs.

The original workbook’s useful sections carry through as phone pages rather than a crowded row of tabs. The library includes foundations, quiet rest, walks, other dogs, visitors and knocking, sound fears, cooperative care, play, the refrigerator chain, practice elsewhere, scent games, body awareness, clever tricks, and useful jobs.

## Local storage and backups

The installed app loads bundled files; it does not connect to a backend or download lesson code. It has no analytics, advertising, accounts, remote fonts, or app-run progress uploads. Original reference websites open only when you tap their external link.

Progress is stored as an atomic JSON file under the app’s local Application Support folder. That progress folder is excluded from automatic device backup. A previous local snapshot is retained for recovery. A successful native save is acknowledged; write failures leave a persistent retry/export warning. Unreadable records are not silently overwritten with a new empty profile.

Use **More → Backup & restore** regularly, especially before replacing the app or its LiveContainer data container. Choose **On My iPhone** in Files if you want an exported copy to stay on the phone. Import is validated, previewed and confirmed before replacing records. A JSON backup contains your personal records, not copies of the original papers.

The Linux/browser preview uses that browser’s local storage instead of the native file store. Its records are separate from the installed iPhone app; export/import a backup to transfer them. Browser private mode or clearing storage can remove preview records.

## Preview on this computer

Open [app/web/index.html](app/web/index.html) in a modern browser. The same bundled interface runs without a server. If your browser blocks local-file storage, use a temporary local preview:

```bash
python3 -m http.server 8765 --bind 127.0.0.1 --directory app/web
```

Then open `http://127.0.0.1:8765`. Stop the command with Ctrl+C. No app data is sent outside this computer.

Open the [visual preview gallery](previews.html), or inspect the [screenshots](previews). Any dog name or session shown in testing screenshots is invented test data; the shipped app starts empty.

## Build and verification

The native shell is SwiftUI/UIKit plus a local WKWebView. This keeps the tested interface identical across the Linux preview and the iPhone package. There are no runtime JavaScript packages, remote resources, or third-party iOS dependencies. Xcode’s command-line compiler builds the small native shell directly; no project generator is needed.

On a Mac with Xcode selected:

```bash
bash scripts/build-ios.sh device
```

The output is `build/GoodGround-unsigned.ipa`. The workflow does this on GitHub’s Mac instead. The separate simulator script checks local-page loading, the prerequisite change, native save acknowledgement and an actual on-disk progress file. It does not sign the device app or use an Apple account.

For development checks:

```bash
node scripts/check.cjs
node tests/core.test.cjs
npm ci --ignore-scripts
npx playwright install chromium webkit
npm run test:ui
GG_BROWSER=webkit npm run test:ui
node tests/native-bridge.cjs
GG_BROWSER=webkit node tests/native-bridge.cjs
```

Playwright may need system dependencies on a development machine. The GitHub interface job installs those on its disposable runner. No development tools are needed to use the installed app.

[VALIDATION.md](VALIDATION.md) distinguishes checks actually run here from the pending macOS and physical-device checks. Raw reports are in `validation/`.

## Research and additions

[research/APP_REVIEW.md](research/APP_REVIEW.md) records the follow-up review, source updates, exclusions and corrections. The initial 20-minute research phase is documented in `research/original-timing.json`; it is not claimed as additional research time during app construction.

Teaching steps are original instructional syntheses. Source records distinguish trials, reviews, professional advice and access limits. The app does not prescribe drugs, guarantee anxiety resolution, or offer high-impact exercise prescriptions. Severe panic, bites/redirection, pain or sudden changes need an individual veterinary/behavior plan.

To regenerate the current data bundle after editing the additional lessons, run `python3 scripts/extend-content.py`. This reads `research/base-data.json` and `research/additional-sources.json`. It changes curriculum files, not a user’s saved progress.

Original app code, icon and original instructional writing are provided under [LICENSE](LICENSE). Linked papers, websites and their authors’ materials retain their own rights; full third-party papers are not bundled.
