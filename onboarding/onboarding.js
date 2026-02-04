// Decision Trace — Onboarding Logic

function nextStep(step) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));

    // Show target step
    const next = document.getElementById(`step${step}`);
    if (next) {
        next.classList.add('active');
    }
}

// Setup Event Listeners (Manifest V3 does not allow inline onclick)
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const btnNext1 = document.getElementById('btnNext1');
    if (btnNext1) btnNext1.addEventListener('click', () => nextStep(2));

    const btnBack2 = document.getElementById('btnBack2');
    if (btnBack2) btnBack2.addEventListener('click', () => nextStep(1));

    const btnNext2 = document.getElementById('btnNext2');
    if (btnNext2) btnNext2.addEventListener('click', () => nextStep(3));

    // Finish Setup
    const finishBtn = document.getElementById('finishBtn');
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            // Collection settings from Step 2
            const config = {
                detectPurchase: document.getElementById('detectPurchase').checked,
                detectSignup: document.getElementById('detectSignup').checked,
                detectDownload: document.getElementById('detectDownload').checked,
                detectImportant: document.getElementById('detectImportant').checked,
            };

            const enabledCategories = [];
            if (config.detectPurchase) enabledCategories.push('purchase');
            if (config.detectSignup) enabledCategories.push('signup');
            if (config.detectDownload) enabledCategories.push('download');
            if (config.detectImportant) enabledCategories.push('important');

            // Save settings
            await chrome.storage.local.set({
                autoDetectionEnabled: enabledCategories.length > 0,
                detectionConfig: {
                    enabledCategories: enabledCategories
                }
            });

            // Close onboarding
            chrome.tabs.getCurrent((tab) => {
                if (tab) chrome.tabs.remove(tab.id);
            });
        });
    }
});
