# Privacy Policy — Decision Trace

**Last Updated**: February 3, 2026

## TL;DR

We don't collect anything. Everything stays on your device. You have full control.

## What We Collect

**Nothing.**

Decision Trace does not collect, transmit, or store any data on external servers. All data remains on your device.

## What Data Is Stored Locally

The extension stores the following data **locally on your device** using Chrome's `storage.local` API:

### Decision Entries

Each time you document a decision, the following information is saved:

- **Timestamp**: When you documented the decision (ISO 8601 format)
- **URL**: The web page you were on
- **Page Title**: The title of that web page
- **Your Reason**: The text you entered explaining your decision
- **Mood** (optional): The mood you selected, if any

**Example**:
```json
{
  "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "timestamp": "2026-02-03T15:02:55.000Z",
  "url": "https://example.com/article",
  "pageTitle": "Interesting Article",
  "reason": "I want to read this later because it relates to my project",
  "mood": "Calm"
}
```

### Settings

The extension stores these optional settings locally:

- **AI Enabled**: Whether you've enabled AI features (true/false)
- **API Provider**: Your chosen AI provider (openai or claude)
- **API Key**: Your AI API key (if you've entered one)

**Important**: API keys are stored using Chrome's `storage.local`, which is encrypted by Chrome when synced (if you have Chrome sync enabled). However, the extension itself does not encrypt the API key beyond what Chrome provides.

## Where Your Data Is Stored

All data is stored **locally** on your device using the [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/).

- Your data never leaves your computer unless you choose to export it
- There is no server, no database, no cloud backup
- We don't have access to your data because we don't have a backend

## Who Has Access to Your Data

**Only you.**

- We (the extension developers) cannot see your data
- No third parties have access to your data
- Your data is not shared, sold, or transmitted

## AI Features (Optional)

If you choose to enable AI features:

1. **You must provide your own API key** from OpenAI or Anthropic
2. **You control when the AI is used** by clicking "Analyze My Patterns"
3. When you request analysis:
   - Your decision entries are sent to the AI provider you selected (OpenAI or Anthropic)
   - The AI provider processes your data according to **their** privacy policy
   - The extension receives the analysis and displays it to you
   - The extension does not store the AI's response

### Important Notes About AI

- AI features are **completely optional** and **disabled by default**
- You can disable AI features at any time in Settings
- When disabled, no data is ever sent to any external service
- When enabled, data is only sent when you explicitly click "Analyze My Patterns"

**AI Provider Privacy Policies**:
- OpenAI: https://openai.com/privacy
- Anthropic: https://www.anthropic.com/privacy

## Permissions Explained

The extension requests these permissions:

### `storage`

**Why**: To save your decision entries and settings locally on your device.

**What it does**: Allows the extension to use Chrome's local storage API.

**What it doesn't do**: Does not access data from other extensions or websites.

### `activeTab`

**Why**: To capture the current page's URL and title when you document a decision.

**What it does**: When you open the popup, the extension reads the URL and title of the active tab.

**What it doesn't do**: 
- Does not track your browsing history
- Does not monitor which sites you visit
- Does not inject code into web pages
- Only accesses the active tab's URL/title when you explicitly trigger the popup

## Data Retention

Your data is stored **indefinitely** on your device until you:

1. Manually delete individual entries in the Timeline view
2. Clear all data in Settings
3. Uninstall the extension (this removes all local data)

## Data Export

You can export all your data as a JSON file at any time:

1. Go to Settings
2. Click "Export All Data (JSON)"
3. Save the file to your computer

The exported file contains all your decision entries and can be opened in any text editor.

## Data Deletion

You can delete your data at any time:

### Delete Individual Entries

1. Go to Timeline
2. Click "Delete" on any entry
3. Confirm the deletion

### Delete All Data

1. Go to Settings
2. Click "Clear All Data"
3. Confirm the deletion (twice)

### Uninstall the Extension

Uninstalling the extension will delete all locally stored data.

## Third-Party Services

The extension does **not** use any third-party services except:

- **OpenAI API** (optional, only if you enable AI features and provide an API key)
- **Anthropic Claude API** (optional, only if you enable AI features and provide an API key)

## Changes to This Privacy Policy

If we update this privacy policy, we will:

1. Update the "Last Updated" date at the top
2. Notify users via the extension's update notes
3. Publish the changes in the GitHub repository

## Contact

If you have questions about privacy:

- Open an issue on GitHub
- Review the source code (it's open source!)

## Your Rights

You have the right to:

- ✓ Access all your data (it's on your device)
- ✓ Export your data (Settings → Export)
- ✓ Delete your data (Settings → Clear All Data)
- ✓ Stop using the extension at any time (uninstall it)

## Compliance

This extension is designed with privacy as a core principle:

- **GDPR Compliant**: No personal data is collected or processed by us
- **CCPA Compliant**: No personal data is sold or shared
- **Local-First**: All data remains on your device

## Transparency

The entire source code is available on GitHub. You can:

- Review how data is stored and used
- Verify that no tracking or external requests occur (except optional AI features)
- Build the extension yourself from source
- Contribute improvements

---

**Bottom line**: We built this extension to be as private as possible. Your decisions are yours alone.
