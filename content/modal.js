// Decision Trace — In-Page Modal UI
// Responsible for injecting and managing the Shadow DOM modal

class DecisionModal {
    constructor(actionInfo, onSave, onSkip) {
        this.actionInfo = actionInfo;
        this.onSave = onSave;
        this.onSkip = onSkip;
        this.selectedMood = null;
        this.host = null;
        this.shadow = null;
    }

    async inject() {
        // Prevent multiple modals
        if (document.getElementById('dt-modal-host')) return;

        this.host = document.createElement('div');
        this.host.id = 'dt-modal-host';
        document.body.appendChild(this.host);

        this.shadow = this.host.attachShadow({ mode: 'open' });

        // Load Styles
        const cssUrl = chrome.runtime.getURL('content/modal.css');
        const response = await fetch(cssUrl);
        const cssText = await response.text();
        const style = document.createElement('style');
        style.textContent = cssText;
        this.shadow.appendChild(style);

        // Create Content
        const container = document.createElement('div');
        container.className = 'modal-container';

        // Check for evidence context
        const evidenceHtml = this.actionInfo.evidence
            ? `
      <div class="evidence-box">
        <label>Selected Evidence:</label>
        <p>"${this.actionInfo.evidence}"</p>
      </div>`
            : '';

        container.innerHTML = `
      <div class="modal-header">
        <div class="header-title">
          <div class="icon-wrapper">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
              <path d="M2 17L12 22L22 17"></path>
              <path d="M2 12L12 17L22 12"></path>
             </svg>
          </div>
          <h2>Explain this decision</h2>
        </div>
        <span class="badge">${this.actionInfo.actionType || 'Decision'}</span>
      </div>

      ${evidenceHtml}

      <div class="input-group">
        <label>Your reasoning</label>
        <textarea id="reasonInput" rows="3" placeholder="Why are you doing this?"></textarea>
      </div>

      <div class="mood-grid">
        <button class="mood-btn" data-mood="Calm"><span class="mood-icon">😌</span><span class="mood-label">Calm</span></button>
        <button class="mood-btn" data-mood="Rushed"><span class="mood-icon">⚡</span><span class="mood-label">Rushed</span></button>
        <button class="mood-btn" data-mood="Excited"><span class="mood-icon">✨</span><span class="mood-label">Excited</span></button>
        <button class="mood-btn" data-mood="Anxious"><span class="mood-icon">😰</span><span class="mood-label">Anxious</span></button>
        <button class="mood-btn" data-mood="Unsure"><span class="mood-icon">🤔</span><span class="mood-label">Unsure</span></button>
      </div>

      <div class="modal-footer">
        <button id="skipBtn" class="btn btn-ghost">Skip</button>
        <button id="saveBtn" class="btn btn-primary">Save Decision</button>
      </div>
      <div class="privacy-footer">Nothing is saved unless you Save.</div>
    `;

        this.shadow.appendChild(container);
        this.setupHandlers(container);

        // Focus the input
        setTimeout(() => {
            const input = this.shadow.getElementById('reasonInput');
            if (input) input.focus();
        }, 150);
    }

    setupHandlers(container) {
        const reasonInput = this.shadow.getElementById('reasonInput');
        const saveBtn = this.shadow.getElementById('saveBtn');
        const skipBtn = this.shadow.getElementById('skipBtn');
        const moodBtns = this.shadow.querySelectorAll('.mood-btn');

        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                moodBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedMood = btn.dataset.mood;
            });
        });

        saveBtn.addEventListener('click', () => {
            const reason = reasonInput.value.trim();
            if (!reason) {
                reasonInput.style.borderColor = '#ea4335';
                reasonInput.placeholder = "Please enter a reason...";
                return;
            }
            this.close();
            this.onSave({ reason, mood: this.selectedMood || 'Neutral' });
        });

        skipBtn.addEventListener('click', () => {
            this.close();
            this.onSkip();
        });

        // Handle shortcuts
        reasonInput.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                saveBtn.click();
            }
            else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveBtn.click();
            }

            if (e.key === 'Escape') {
                skipBtn.click();
            }
        });
    }

    close() {
        const container = this.shadow.querySelector('.modal-container');
        if (container) {
            container.classList.add('closing');
            setTimeout(() => {
                if (this.host) this.host.remove();
            }, 300);
        }
    }
}
