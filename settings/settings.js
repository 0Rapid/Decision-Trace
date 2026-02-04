// Decision Trace — Settings Logic
// Manage user preferences and AI configuration

document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupEventListeners();
});

// Load settings from storage
async function loadSettings() {
    const settings = await chrome.storage.local.get([
        'autoDetectionEnabled',
        'detectionSensitivity',
        'aiEnabled',
        'apiProvider',
        'apiKey'
    ]);

    // Auto-detection
    const autoDetectionToggle = document.getElementById('autoDetectionEnabled');
    autoDetectionToggle.checked = settings.autoDetectionEnabled || false;

    // AI Enabled
    const aiToggle = document.getElementById('aiEnabled');
    aiToggle.checked = settings.aiEnabled || false;
    updateAiSettingsVisibility(aiToggle.checked);

    // API Key & Provider
    if (settings.apiProvider) {
        document.getElementById('apiProvider').value = settings.apiProvider;
    }
    if (settings.apiKey) {
        document.getElementById('apiKey').value = settings.apiKey;
    }

    // Sensitivity (Segmented Control)
    const sensitivity = settings.detectionSensitivity || 'balanced';
    document.querySelectorAll('.segment').forEach(btn => {
        if (btn.dataset.level === sensitivity) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Auto-detection Toggle
    document.getElementById('autoDetectionEnabled').addEventListener('change', (e) => {
        chrome.storage.local.set({ autoDetectionEnabled: e.target.checked });

        // If enabling for the first time, show a notification/toast (optional)
        if (e.target.checked) {
            console.log('Auto-detection enabled');
        }
    });

    // Sensitivity Segmented Control
    document.querySelectorAll('.segment').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;

            // Update UI
            document.querySelectorAll('.segment').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Save to storage
            chrome.storage.local.set({ detectionSensitivity: level });
        });
    });

    // AI Toggle
    const aiToggle = document.getElementById('aiEnabled');
    aiToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        chrome.storage.local.set({ aiEnabled: enabled });
        updateAiSettingsVisibility(enabled);
    });

    // API Provider & Key
    document.getElementById('apiProvider').addEventListener('change', (e) => {
        chrome.storage.local.set({ apiProvider: e.target.value });
    });

    document.getElementById('apiKey').addEventListener('input', (e) => {
        chrome.storage.local.set({ apiKey: e.target.value });
    });

    // Test AI Connection
    document.getElementById('testAiBtn').addEventListener('click', async () => {
        const btn = document.getElementById('testAiBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Testing...';
        btn.disabled = true;

        const results = await AIReflection.testConnection();

        if (results.success) {
            btn.textContent = 'Success ✓';
            btn.style.borderColor = 'var(--secondary-500)';
            btn.style.color = 'var(--secondary-500)';
        } else {
            btn.textContent = 'Failed ✗';
            btn.style.borderColor = 'var(--danger-500)';
            btn.style.color = 'var(--danger-500)';
            alert('AI connection failed: ' + results.error);
        }

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.disabled = false;
        }, 3000);
    });

    // Analyze Patterns
    document.getElementById('analyzeBtn').addEventListener('click', async () => {
        const btn = document.getElementById('analyzeBtn');
        const resultsPanel = document.getElementById('aiResults');
        const output = document.getElementById('aiOutput');

        btn.disabled = true;
        btn.querySelector('span').textContent = 'Analyzing...';

        try {
            const decisions = await StorageAPI.getAllDecisions();
            if (decisions.length === 0) {
                alert('No decisions to analyze. Record some first!');
                return;
            }

            const reflection = await AIReflection.generateReflection(decisions);

            output.innerHTML = formatMarkdown(reflection);
            resultsPanel.style.display = 'block';
            resultsPanel.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            alert('Analysis failed: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.querySelector('span').textContent = 'Analyze My Patterns';
        }
    });

    // Close AI Results
    document.getElementById('closeResults').addEventListener('click', () => {
        document.getElementById('aiResults').style.display = 'none';
    });

    // Professional Exports
    document.getElementById('exportMarkdownBtn').addEventListener('click', async () => {
        const md = await StorageAPI.exportAsMarkdown();
        downloadFile(md, `decision-trace-vault-${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
    });

    document.getElementById('exportCsvBtn').addEventListener('click', async () => {
        const csv = await StorageAPI.exportAsCSV();
        downloadFile(csv, `decision-trace-data-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    });

    document.getElementById('exportDataBtn').addEventListener('click', async () => {
        const json = await StorageAPI.exportAsJSON();
        downloadFile(json, `decision-trace-backup-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    });

    document.getElementById('clearDataBtn').addEventListener('click', async () => {
        if (confirm('CRITICAL: This will permanently delete ALL your decision history. This cannot be undone. Are you absolutely sure?')) {
            await StorageAPI.clearAllData();
            alert('All data has been cleared.');
            window.location.reload();
        }
    });

    // Tooltips
    document.getElementById('sensitivityWhy').addEventListener('click', () => {
        alert(
            "Smart Detection Philosophy:\n\n" +
            "1. It is 100% Opt-In: You choose if and when it runs.\n" +
            "2. UI Moments Only: We detect clicks on 'Buy' or 'Sign Up' buttons, not your browsing behavior.\n" +
            "3. Local Processing: The scan happens entirely on your machine.\n" +
            "4. Detection ≠ Recording: Nothing is saved to your history unless you explicitly type a reason and click 'Save'."
        );
    });
}

function updateAiSettingsVisibility(enabled) {
    const aiSettingsPanel = document.getElementById('aiSettings');
    aiSettingsPanel.style.display = enabled ? 'block' : 'none';
}

// Simple markdown formatter for AI output
function formatMarkdown(text) {
    if (!text) return '';

    // Replace newlines with <br>
    let formatted = text.replace(/\n/g, '<br>');

    // Replace bold **text** with <b>text</b>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Replace bullet points
    formatted = formatted.replace(/^- (.*?)<br>/gm, '• $1<br>');

    return formatted;
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
