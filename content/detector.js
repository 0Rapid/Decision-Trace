// Decision Trace — Action Detector (Content Script)
// Refined for robustness and in-page modal experience

(function () {
    'use strict';

    let detectionEnabled = false;
    let sensitivity = 'balanced';
    let enabledCategories = ['purchase', 'signup', 'download', 'important'];

    const keywordsByLevel = {
        relaxed: {
            purchase: ['buy now', 'purchase', 'checkout', 'place order', 'complete purchase', 'place your order', 'pay now'],
            signup: ['create account', 'register', 'sign up'],
            important: ['confirm payment', 'subscribe']
        },
        balanced: {
            purchase: ['buy', 'purchase', 'add to cart', 'add to bag', 'checkout', 'pay now', 'place order', 'order now', 'secure checkout'],
            signup: ['sign up', 'register', 'create account', 'get started', 'join', 'subscribe now'],
            download: ['download', 'install', 'get app', 'get it now'],
            important: ['confirm', 'submit payment', 'continue to payment', 'subscribe', 'upgrade']
        },
        strict: {
            purchase: ['buy', 'purchase', 'add', 'cart', 'bag', 'checkout', 'pay', 'order', 'shop', 'pay'],
            signup: ['sign', 'register', 'create', 'start', 'join', 'account', 'signup'],
            download: ['download', 'install', 'get', 'save', 'file'],
            important: ['confirm', 'submit', 'continue', 'next', 'ok', 'yes', 'agree', 'subscribe', 'allow', 'proceed']
        }
    };

    // Check settings on load
    chrome.storage.local.get(['autoDetectionEnabled', 'detectionSensitivity', 'detectionConfig'], (result) => {
        detectionEnabled = result.autoDetectionEnabled || false;
        sensitivity = result.detectionSensitivity || 'balanced';
        if (result.detectionConfig && result.detectionConfig.enabledCategories) {
            enabledCategories = result.detectionConfig.enabledCategories;
        }

        if (detectionEnabled) {
            initDetection();
        }
    });

    // Listen for settings changes
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.autoDetectionEnabled) {
            detectionEnabled = changes.autoDetectionEnabled.newValue;
            if (detectionEnabled) initDetection();
            else cleanupDetection();
        }
        if (changes.detectionSensitivity) {
            sensitivity = changes.detectionSensitivity.newValue;
        }
        if (changes.detectionConfig) {
            enabledCategories = changes.detectionConfig.newValue.enabledCategories || enabledCategories;
        }
    });

    function initDetection() {
        console.log(`[Decision Trace] In-page detection active (Sensitivity: ${sensitivity})`);
        document.addEventListener('click', handleClick, true);
    }

    function cleanupDetection() {
        document.removeEventListener('click', handleClick, true);
    }

    async function handleClick(event) {
        if (!detectionEnabled) return;

        // Don't trigger if user is holding modifier keys
        if (event.ctrlKey || event.metaKey || event.shiftKey) return;

        const target = event.target;
        const element = findRelevantElement(target);

        if (!element) return;

        const actionType = detectActionType(element);
        if (!actionType) return;

        // Check if this category is actually enabled in settings
        if (!enabledCategories.includes(actionType)) return;

        // Prevention of double triggers
        if (shouldThrottle(element)) return;

        // --- CRITICAL: Prevent navigation until user explains ---
        event.preventDefault();
        event.stopPropagation();

        // Fetch pending context (from context menu)
        const storageData = await chrome.storage.local.get(['pendingContext']);
        const contextEvidence = storageData.pendingContext || '';

        const actionText = getElementText(element).trim().substring(0, 60);
        const actionInfo = {
            url: window.location.href,
            title: document.title,
            actionType: actionType,
            actionText: actionText,
            timestamp: new Date().toISOString(),
            evidence: contextEvidence
        };

        console.log(`[Decision Trace] 🎯 Action Detected: "${actionText}" - Preventing navigation`);

        // Resume function to click the element again
        const resumeAction = () => {
            document.removeEventListener('click', handleClick, true);
            element.click();
            setTimeout(() => {
                document.addEventListener('click', handleClick, true);
            }, 500);
        };

        // Show In-Page Modal
        const modal = new DecisionModal(
            actionInfo,
            async (data) => {
                // Handle Save
                const entry = {
                    id: StorageAPI.generateId(),
                    timestamp: actionInfo.timestamp,
                    url: actionInfo.url,
                    pageTitle: actionInfo.title,
                    reason: data.reason,
                    mood: data.mood,
                    evidence: actionInfo.evidence // Include research context
                };
                await StorageAPI.saveDecision(entry);

                // Clear pending context after use
                chrome.storage.local.remove(['pendingContext']);

                console.log('[Decision Trace] Decision saved. Resuming navigation...');
                resumeAction();
            },
            () => {
                // Handle Skip
                // Don't clear context on skip in case they want it for the next click
                console.log('[Decision Trace] Decision skipped. Resuming navigation...');
                resumeAction();
            }
        );

        modal.inject();
    }

    function findRelevantElement(element) {
        let current = element;
        let depth = 0;
        while (current && depth < 6) {
            const tag = current.tagName?.toLowerCase();
            const role = current.getAttribute('role')?.toLowerCase();
            const type = current.getAttribute('type')?.toLowerCase();
            const className = typeof current.className === 'string' ? current.className.toLowerCase() : '';

            if (tag === 'button' ||
                tag === 'a' ||
                role === 'button' ||
                role === 'link' ||
                (tag === 'input' && (type === 'submit' || type === 'button')) ||
                className.includes('btn') ||
                className.includes('button')) {
                return current;
            }
            current = current.parentElement;
            depth++;
        }
        return null;
    }

    function detectActionType(element) {
        const text = getElementText(element).toLowerCase();
        const href = element.getAttribute('href')?.toLowerCase() || '';
        const name = element.getAttribute('name')?.toLowerCase() || '';
        const id = element.id?.toLowerCase() || '';

        const currentKeywords = keywordsByLevel[sensitivity] || keywordsByLevel.balanced;

        for (const [type, keywords] of Object.entries(currentKeywords)) {
            if (keywords.some(kw =>
                text.includes(kw) ||
                href.includes(kw) ||
                name.includes(kw) ||
                id.includes(kw)
            )) {
                return type;
            }
        }
        return null;
    }

    function getElementText(el) {
        return (
            el.innerText ||
            el.textContent ||
            el.getAttribute('aria-label') ||
            el.getAttribute('title') ||
            el.value ||
            ''
        ).substring(0, 100);
    }

    let lastTriggerTime = 0;
    let lastElement = null;

    function shouldThrottle(el) {
        const now = Date.now();
        if (lastElement === el && (now - lastTriggerTime < 10000)) return true;
        if (now - lastTriggerTime < 2500) return true;

        lastTriggerTime = now;
        lastElement = el;
        return false;
    }

})();
