# Decision Trace — Explained Yourself Later 🧠

**Decision Trace** is a premium, privacy-first browser extension designed to capture the "Why" behind your online decisions. It creates a mindful pause during impulsive actions, building a searchable history of your intent.

![Decision Trace Preview](https://github.com/0Rapid/Decision-Trace/raw/main/icons/icon-128.png)

## 🌟 Key Features

- **Smart Detection (Opt-in)**: Automatically detects "Decision Moments" (Checkouts, Sign-ups, Downloads) and prompts you for a reason.
- **Evidence Context**: Right-click any text on a webpage to "Add as Decision Context" before taking an action.
- **Timeline Dashboard**: A beautiful, glassmorphic interface to search and filter your decision history by mood, keywords, or date.
- **Professional Exports**: Export your history as **Obsidian-ready Markdown** or **CSV** for data analysis.
- **AI Reflection (Optional)**: Deep analysis of your decision patterns using your own OpenAI/Claude API key.

## 🛡️ Privacy Manifesto

Decision Trace lives by a simple rule: **Your mind is private.**

- **100% Local**: No data ever leaves your machine. We have no servers and no analytics.
- **Zero-Logging Guarantee**: Actions like "Skip" or closing the modal record **absolute zero data**.
- **Shadow DOM**: The extension UI is isolated from the websites you visit for maximum security.

## 🚀 Installation

1.  **Download/Clone** this repository.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** (toggle in the top right).
4.  Click **Load unpacked** and select the folder containing these files.

## 🛠️ Usage

- **Recording a Decision**: The extension will automatically prompt you when it detects a major action. You can also trigger it via `Ctrl+Shift+D`.
- **Adding Evidence**: Highlight text on any site, right-click, and select "Add as Decision Context."
- **Exporting**: Go to Settings (⚙️) inside the extension to export your logs for your knowledge vault.

---

## 🏗️ Technical Details

- **Manifest V3**
- **Vanilla JS & CSS** (No bulky frameworks)
- **Local Storage API**

## 📄 License
This project is licensed under the MIT License.
