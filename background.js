// Decision Trace — Background Service Worker
// Integrated logic for onboarding, navigation, shortcuts, context menus, and cloud sync

importScripts('utils/storage.js');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Decision Trace] Extension installed/updated');

  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'onboarding/onboarding.html' });
  }

  // Create Context Menu
  chrome.contextMenus.create({
    id: "add_decision_context",
    title: "Add as Decision Context (Evidence)",
    contexts: ["selection"]
  });

  // Set initial default settings if not exists
  chrome.storage.local.get(['autoDetectionEnabled'], (result) => {
    if (result.autoDetectionEnabled === undefined) {
      chrome.storage.local.set({
        autoDetectionEnabled: false,
        detectionSensitivity: 'balanced',
        detectionConfig: {
          enabledCategories: ['purchase', 'signup', 'download', 'important']
        }
      });
    }
  });
});

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add_decision_context") {
    const selectedText = info.selectionText;
    console.log('[Decision Trace] Adding text as context:', selectedText);

    // Save to pending context in storage
    chrome.storage.local.set({ pendingContext: selectedText });

    // Provide visual feedback via badge
    chrome.action.setBadgeText({ text: '!', tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#4285f4' });

    setTimeout(() => {
      chrome.action.setBadgeText({ text: '', tabId: tab.id });
    }, 2000);
  }
});

// Handle extension icon click - Open Timeline
chrome.action.onClicked.addListener((tab) => {
  console.log('[Decision Trace] Icon clicked, opening timeline');
  chrome.tabs.create({ url: 'timeline/timeline.html' });
});

// Listen for keyboard shortcut commands
chrome.commands.onCommand.addListener((command) => {
  if (command === '_execute_action') {
    console.log('[Decision Trace] Shortcut triggered, opening timeline');
    chrome.tabs.create({ url: 'timeline/timeline.html' });
  }
});

// Background Sync Pulse (Alarm handler is in sync_manager.js)
// This service worker will stay alive or re-awaken for the alarm
