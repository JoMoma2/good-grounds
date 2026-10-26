# Get Good Ground onto your iPhone

The local preview includes `GoodGround-1.5.1-unsigned.ipa` (a fresh source build uses `GoodGround-unsigned.ipa`). Use that IPA with your existing SideStore or LiveContainer setup. Export a backup from the old app first and keep the same app/container identity. The update preserves the native shell and replaces its bundled interface.

If you already have the release IPA, go directly to section 3A or 3B. Sections 1–2 are an optional way to compile a fresh shell from source on GitHub’s Mac.

**Import the `.ipa`, not the source ZIP.** A source build produces the same IPA filename after the workflow passes.

## 1. Upload the app source to GitHub

1. Extract `GoodGround-iPhone-Source.zip` on your computer. Open the resulting `GoodGround-iPhone` folder.
2. On GitHub, create a new repository, for example `good-ground`. Use `main` as the default branch. A public repository can use standard GitHub-hosted runners without a build-minute charge. A private repository uses your account’s included Actions allowance and any billing settings. The supplied source contains curriculum and test fixtures, not your phone’s personal records.
3. In the empty repository, choose **uploading an existing file**, or **Add file → Upload files**.
4. Upload the **contents** of `GoodGround-iPhone` into the repository root. The repository should show `app`, `ios`, `scripts`, `tests`, `research`, `package.json`, `package-lock.json`, and `.github` directly—not another `GoodGround-iPhone` directory above them.
5. Include the hidden `.github` folder. In Ubuntu Files, **Ctrl+H** shows hidden files. You can drag the folders and files into the upload area. Commit the upload.

If the hidden folder was omitted, create it using GitHub’s web editor: **Add file → Create new file**, name it `.github/workflows/build-iphone.yml`, and paste the exact contents of the same file from this source folder. Commit it to `main`.

No Apple signing certificate, Team ID, developer portal setup, or secret needs to be entered in GitHub. Do not add your SideStore login or pairing file to this repository.

## 2. Run the build

1. Open the repository’s **Actions** tab.
2. Choose **Build iPhone app**.
3. If no run started automatically, click **Run workflow**, select `main`, and confirm **Run workflow**.
4. Wait for the interface checks and the Mac build/simulator checks to finish. The interface runs in Chromium and WebKit. The Mac compiles the iPhone app and checks local loading and saving in a simulator.
5. After a successful run, open it and scroll to **Artifacts**. Download **GoodGround-iPhone**. GitHub normally downloads an artifact ZIP.
6. Extract that artifact ZIP. Inside is **`GoodGround-unsigned.ipa`** and its SHA-256 checksum file. This IPA is the file you install.

The build is designed to publish no app release and requires no App Store submission. It simply makes a downloadable artifact in your repository. GitHub requires you to be signed in to download workflow artifacts. Artifacts expire after 30 days; rerun the workflow if needed.

## 3A. Install directly with SideStore

1. Put `GoodGround-unsigned.ipa` somewhere accessible in your iPhone’s Files app.
2. Open SideStore and use its add/import IPA control.
3. Choose that IPA and let your existing setup sign and install it.
4. Open **Good Ground**. First use asks how many dogs you have, offers profile setup, then a skippable tour. A single profile can be skipped; multiple dogs require names. Existing saved records migrate without forcing first-use setup.

Use your existing refresh routine. Keep the same app identity for updates. Export a Good Ground backup before changing installation methods or deleting the app.

## 3B. Or import into LiveContainer

1. Put `GoodGround-unsigned.ipa` in Files.
2. Open LiveContainer, tap **+**, and select the IPA.
3. Select Good Ground and launch it using your normal LiveContainer method.
4. Use the **same data container** for subsequent launches and updates so your records stay together.

If the app’s backup/import picker fails to open, check LiveContainer’s per-app **Fix File Picker** option. The app has no extensions, push notifications or special entitlements. Compatibility still needs to be confirmed on your specific iPhone and LiveContainer version; direct SideStore installation is the alternative if the container has a compatibility problem.

## 4. A quick first-use check

- Check the Clicker tab quietly away from your dog: choose a sound, confirm media volume, tap once and verify audible output. A sound press must not add a journal entry. Silent-switch and Bluetooth behavior need confirmation on your phone.
- With multiple dogs, choose a subset and check their names in the Training button. Close/reopen and confirm the household choice and saved records.

1. Open **Learn**, search `NAME-2`, and open **Reward the head turn**. You should see the actual step, even if its prerequisite is unrecorded.
2. Tap its prerequisite to open `NAME-1`. If appropriate after checking your dog’s behavior, set a stage and confirm that the next step’s availability updates.
3. Add a short test note, leave the field, close and reopen the app, and check that it is still there. Remove the test note afterward.
4. Export a backup through **More → Backup & restore** and verify that Files offers a save location. You do not need to restore it merely to test export.

Progress is a planning record. Marking a criterion consistent should reflect the dog’s actual performance and comfort. Completing a step now navigates to its next step automatically. New backups use format version 3; older apps cannot restore them. This update accepts version 1 and 2 backups as well. New progress history begins at the first observation in this version.

## If a build or installation fails

For a red GitHub run, open the failing step and copy its error text. The important distinction is whether **Interface**, **Compile unsigned device app**, or **Compile and exercise simulator app** failed. The simulator diagnostics artifact may include a screenshot and report. Bring those errors back for repair; an uncompiled source folder is not an IPA.

For an installation/runtime failure, record iOS version, SideStore/LiveContainer version, which method you used, and the exact message. Do not delete the old app or container as a first troubleshooting step if it has records you want to keep. Export a backup first if you can open it.

Useful official documentation:

- [GitHub: manually run a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)
- [GitHub: download workflow artifacts](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts)
- [SideStore FAQ](https://docs.sidestore.io/docs/faq)
- [LiveContainer installation and app importing](https://github.com/LiveContainer/LiveContainer#installing-apps)

## A prompt you can give ChatGPT

> I have the Good Ground iPhone app source ZIP and INSTALL.md. I use Ubuntu, SideStore and LiveContainer. Walk me through uploading the source contents to a new GitHub repository, including `.github/workflows/build-iphone.yml`, running “Build iPhone app”, downloading its GoodGround-iPhone artifact, extracting GoodGround-unsigned.ipa, and importing it into my existing sideloading setup. No App Store submission or Apple credentials in GitHub are needed. Start with the GitHub upload and give me one short stage at a time. If there is an error, help me identify the failing step before changing anything.

The clicker requests Silent-mode playback on iOS 17 and later, with no extra permission prompt. Verify the sound on your phone before training. iOS 16 can still require Silent mode off; the asset-only package does not add a native audio-session fallback.

Version 1.5.1 preserves original records while restoring independent project components. The three shortened guides keep their earlier pages, notes and journal links. New replacement steps receive credit only where every mapped earlier criterion was recorded consistent; explicit new grades and pauses are preserved.

Optional in-app feedback requires an internet connection and an configured Formspree inbox. Training still works offline. See FEEDBACK_SETUP.md for setup and privacy.
