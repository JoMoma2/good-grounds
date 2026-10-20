import Foundation
import SwiftUI
import UIKit
import WebKit
import UniformTypeIdentifiers

@main
struct GoodGroundApp: App {
    var body: some Scene {
        WindowGroup { LocalInterface().ignoresSafeArea() }
    }
}

struct LocalInterface: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> LocalController { LocalController() }
    func updateUIViewController(_ controller: LocalController, context: Context) {}
}

final class LocalController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate, UIDocumentPickerDelegate {
    private var web: WKWebView!
    private var saveDirectory: URL!
    private var saveURL: URL!
    private var previousURL: URL!
    private var isImporting = false
    private var lastRevision = -1
    private var backgroundObserver: NSObjectProtocol?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.97, green: 0.96, blue: 0.93, alpha: 1)
        var initial: Any = NSNull()
        var loadError: String? = nil
        do {
            let files = FileManager.default
            saveDirectory = try files.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
                .appendingPathComponent("GoodGround", isDirectory: true)
            try files.createDirectory(at: saveDirectory, withIntermediateDirectories: true)
            var values = URLResourceValues()
            values.isExcludedFromBackup = true
            try saveDirectory.setResourceValues(values)
            saveURL = saveDirectory.appendingPathComponent("progress.json")
            previousURL = saveDirectory.appendingPathComponent("previous-progress.json")
            if files.fileExists(atPath: saveURL.path) {
                let bytes = try Data(contentsOf: saveURL)
                initial = try JSONSerialization.jsonObject(with: bytes)
                if let state = initial as? [String: Any], let revision = state["revision"] as? Int, revision >= 0, revision <= 1_000_000_000_000 { lastRevision = revision }
            }
        } catch {
            loadError = "The saved file could not be read. Import a backup before making new changes. Your original file has been kept."
        }
        let config = WKWebViewConfiguration()
        config.websiteDataStore = .nonPersistent()
        config.userContentController.add(self, name: "ground")
        let boot: [String: Any] = ["state": initial, "error": (loadError as Any?) ?? NSNull(), "native": true,
                                  "smoke": ProcessInfo.processInfo.arguments.contains("--ui-smoke-test"), "lastRevision": max(0, lastRevision)]
        let json = (try? JSONSerialization.data(withJSONObject: boot)).flatMap { String(data: $0, encoding: .utf8) } ?? "{}"
        let script = WKUserScript(source: "window.GOOD_GROUND_BOOT = \(json);", injectionTime: .atDocumentStart, forMainFrameOnly: true)
        config.userContentController.addUserScript(script)
        web = WKWebView(frame: .zero, configuration: config)
        web.navigationDelegate = self
        web.isOpaque = false
        web.backgroundColor = view.backgroundColor
        web.scrollView.backgroundColor = view.backgroundColor
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.allowsBackForwardNavigationGestures = false
        view.addSubview(web)
        web.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            web.leadingAnchor.constraint(equalTo: view.leadingAnchor), web.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            web.topAnchor.constraint(equalTo: view.topAnchor), web.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        if let content = Bundle.main.resourceURL?.appendingPathComponent("web", isDirectory: true) {
            web.loadFileURL(content.appendingPathComponent("index.html"), allowingReadAccessTo: content)
        }
        backgroundObserver = NotificationCenter.default.addObserver(forName: UIApplication.didEnterBackgroundNotification, object: nil, queue: .main) { [weak self] _ in
            self?.web.evaluateJavaScript("window.GoodGround?.flush();", completionHandler: nil)
        }
    }

    deinit {
        if let observer = backgroundObserver { NotificationCenter.default.removeObserver(observer) }
    }

    private func reply(_ object: [String: Any]) {
        guard let data = try? JSONSerialization.data(withJSONObject: object), let json = String(data: data, encoding: .utf8) else { return }
        web.evaluateJavaScript("window.GoodGround?.nativeMessage(\(json));", completionHandler: nil)
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame, message.frameInfo.request.url?.isFileURL == true,
              let body = message.body as? [String: Any], let action = body["action"] as? String else { return }
        switch action {
        case "save":
            guard let state = body["state"] as? [String: Any], let revision = state["revision"] as? Int else { return }
            do {
                guard let saveURL = saveURL, let previousURL = previousURL, state["schema"] as? Int == 1 else {
                    throw NSError(domain: "GoodGround", code: 1)
                }
                guard revision > lastRevision else { reply(["type":"saved", "revision":lastRevision]); return }
                let bytes = try JSONSerialization.data(withJSONObject: state, options: [.sortedKeys])
                guard bytes.count <= 5 * 1024 * 1024 else { throw NSError(domain: "GoodGround", code: 2) }
                // Keep the last valid file as recovery protection before atomic replacement.
                if let old = try? Data(contentsOf: saveURL), (try? JSONSerialization.jsonObject(with: old)) != nil {
                    try old.write(to: previousURL, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
                }
                try bytes.write(to: saveURL, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
                lastRevision = revision
                reply(["type":"saved", "revision":revision])
            } catch { reply(["type":"saveError", "message":"The phone could not save this change. Keep the app open and export a backup, then retry."] ) }
        case "export":
            guard let json = body["json"] as? String else { return }
            guard json.utf8.count <= 5 * 1024 * 1024 else { reply(["type":"error", "message":"This backup is too large to prepare. Keep a copy of the original imported file and reduce oversized notes before trying again."]); return }
            do {
                let stamp = ISO8601DateFormatter().string(from: Date()).replacingOccurrences(of: ":", with: "-")
                let url = FileManager.default.temporaryDirectory.appendingPathComponent("Good-Ground-backup-\(stamp).json")
                try Data(json.utf8).write(to: url, options: .atomic)
                isImporting = false
                let picker = UIDocumentPickerViewController(forExporting: [url], asCopy: true)
                picker.delegate = self
                present(picker, animated: true)
            } catch { reply(["type":"error", "message":"The backup could not be prepared. Please try again."]) }
        case "recoverPrevious":
            do {
                guard let previousURL = previousURL else { throw NSError(domain: "GoodGround", code: 4) }
                let previous = try JSONSerialization.jsonObject(with: Data(contentsOf: previousURL))
                let backup: [String: Any] = ["format":"good-ground-backup", "version":1, "state":previous]
                let data = try JSONSerialization.data(withJSONObject: backup)
                guard let text = String(data: data, encoding: .utf8) else { return }
                reply(["type":"import", "json":text])
            } catch { reply(["type":"error", "message":"No readable previous local save is available. You can still import an exported backup."]) }
        case "import":
            isImporting = true
            let picker = UIDocumentPickerViewController(forOpeningContentTypes: [.json, .data], asCopy: true)
            picker.allowsMultipleSelection = false
            picker.delegate = self
            present(picker, animated: true)
        case "theme":
            switch body["theme"] as? String {
            case "dark": overrideUserInterfaceStyle = .dark
            case "light": overrideUserInterfaceStyle = .light
            default: overrideUserInterfaceStyle = .unspecified
            }
            setNeedsStatusBarAppearanceUpdate()
        case "smokeResult":
            if ProcessInfo.processInfo.arguments.contains("--ui-smoke-test"), let result = body["result"] {
                let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("smoke-result.json")
                if let bytes = try? JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys]) {
                    try? bytes.write(to: url, options: .atomic)
                }
            }
        default: break
        }
    }

    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        // Export pickers do not feed the exported document back into the restore flow.
        guard isImporting, let url = urls.first else { return }
        isImporting = false
        let scoped = url.startAccessingSecurityScopedResource()
        defer { if scoped { url.stopAccessingSecurityScopedResource() } }
        do {
            let bytes = try Data(contentsOf: url, options: .mappedIfSafe)
            guard bytes.count <= 5 * 1024 * 1024, let text = String(data: bytes, encoding: .utf8) else { throw NSError(domain: "GoodGround", code: 3) }
            reply(["type":"import", "json":text])
        } catch { reply(["type":"error", "message":"Choose a readable Good Ground JSON backup smaller than 5 MB."]) }
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else { decisionHandler(.cancel); return }
        if url.isFileURL, let folder = Bundle.main.resourceURL?.appendingPathComponent("web").resolvingSymlinksInPath().standardizedFileURL.path,
           url.resolvingSymlinksInPath().standardizedFileURL.path.hasPrefix(folder + "/") {
            decisionHandler(.allow)
        } else if url.absoluteString == "about:blank" {
            decisionHandler(.allow)
        } else {
            // Sources open only after an explicit user tap and never replace the local app.
            if navigationAction.navigationType == .linkActivated, ["https", "http"].contains(url.scheme?.lowercased() ?? "") {
                UIApplication.shared.open(url)
            }
            decisionHandler(.cancel)
        }
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        // Recreate the page using the latest atomically saved data instead of a stale boot script.
        webView.configuration.userContentController.removeAllUserScripts()
        var state: Any = NSNull()
        var recoveryError: Any = NSNull()
        if let saveURL = saveURL, FileManager.default.fileExists(atPath: saveURL.path) {
            do { state = try JSONSerialization.jsonObject(with: Data(contentsOf: saveURL)) }
            catch { recoveryError = "The saved file could not be read after reopening the page. Preview the previous save or import a backup; the original file has been kept." }
        } else if saveURL == nil {
            recoveryError = "The local progress folder is unavailable. Keep the app open and recover from a backup."
        }
        let boot: [String: Any] = ["state":state,"error":recoveryError,"native":true,"smoke":false,"lastRevision":max(0, lastRevision)]
        if let bytes = try? JSONSerialization.data(withJSONObject: boot), let json = String(data: bytes, encoding: .utf8) {
            webView.configuration.userContentController.addUserScript(WKUserScript(source: "window.GOOD_GROUND_BOOT=\(json);", injectionTime: .atDocumentStart, forMainFrameOnly: true))
        }
        webView.reload()
    }
}
