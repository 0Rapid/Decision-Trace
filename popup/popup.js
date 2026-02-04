// Decision Trace — Popup Logic
// Handle user input and save decisions

let selectedMood = null;
let currentTab = null;
let pendingAction = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    // Check if this was triggered by action detection
    const result = await chrome.storage.local.get(['pendingAction']);
    if (result.pendingAction) {
        pendingAction = result.pendingAction;
        updateUIForDetectedAction(pendingAction);

        // Clear the pending action
        chrome.storage.local.remove(['pendingAction']);
    }

    // Get current tab information (if not from action detection)
    if (!pendingAction) {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            currentTab = tab;
        } catch (error) {
            console.error('Error getting tab info:', error);
        }
    } else {
        // Use info from the pending action
        currentTab = {
            url: pendingAction.url,
            title: pendingAction.title
        };
    }

    // Setup mood selector
    setupMoodSelector();

    // Setup form handlers
    setupFormHandlers();

    // Focus on textarea
    document.getElementById('reasonInput').focus();
});

// Update UI when action was detected
function updateUIForDetectedAction(action) {
    const badgeEl = document.getElementById('actionBadge');
    if (badgeEl && action.actionType) {
        badgeEl.textContent = `${getActionIcon(action.actionType)} ${capitalizeFirst(action.actionType)} detected`;
        badgeEl.style.display = 'inline-block';
    }

    // Pre-fill placeholder if available
    const reasonInput = document.getElementById('reasonInput');
    if (action.actionText) {
        reasonInput.placeholder = `You clicked "${action.actionText.substring(0, 40)}${action.actionText.length > 40 ? '...' : ''}" - why?`;
    }
}

function getActionIcon(type) {
    const icons = {
        purchase: '🛒',
        signup: '✨',
        download: '⬇️',
        important: '⭐'
    };
    return icons[type] || '📝';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Setup mood selector buttons
function setupMoodSelector() {
    const moodButtons = document.querySelectorAll('.mood-card');

    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle selection
            const mood = btn.dataset.mood;

            if (btn.classList.contains('selected')) {
                // Deselect
                btn.classList.remove('selected');
                selectedMood = null;
            } else {
                // Deselect all others
                moodButtons.forEach(b => b.classList.remove('selected'));
                // Select this one
                btn.classList.add('selected');
                selectedMood = mood;
            }
        });
    });
}

// Setup form submission and skip handlers
function setupFormHandlers() {
    const form = document.getElementById('decisionForm');
    const skipBtn = document.getElementById('skipBtn');
    const reasonInput = document.getElementById('reasonInput');

    // Handle form submission (Save)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const reason = reasonInput.value.trim();

        if (!reason) {
            reasonInput.focus();
            return;
        }

        await saveDecision(reason);
    });

    // Handle skip button
    skipBtn.addEventListener('click', () => {
        window.close();
    });

    // Handle Escape key to skip
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.close();
        }
    });

    // Floating label logic (for older browsers compatibility if needed, though CSS handles it mostly)
    reasonInput.addEventListener('input', () => {
        if (reasonInput.value.length > 0) {
            reasonInput.classList.add('has-value');
        } else {
            reasonInput.classList.remove('has-value');
        }
    });
}

// Save decision entry
async function saveDecision(reason) {
    const entry = {
        id: StorageAPI.generateId(),
        timestamp: new Date().toISOString(),
        url: currentTab?.url || 'unknown',
        pageTitle: currentTab?.title || 'Unknown Page',
        reason: reason,
        mood: selectedMood
    };

    const saved = await StorageAPI.saveDecision(entry);

    if (saved) {
        // Show brief success feedback
        showSuccessFeedback();

        // Close popup after short delay
        setTimeout(() => {
            window.close();
        }, 800);
    } else {
        alert('Failed to save decision. Please try again.');
    }
}

// Show success feedback
function showSuccessFeedback() {
    const saveBtn = document.getElementById('saveBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;

    btnText.textContent = 'Decision Saved';
    saveBtn.style.background = 'var(--secondary-500)';
    saveBtn.style.boxShadow = '0 4px 12px rgba(52, 168, 83, 0.3)';

    setTimeout(() => {
        btnText.textContent = originalText;
    }, 700);
}
