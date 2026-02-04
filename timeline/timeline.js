// Decision Trace — Timeline Logic
// Display and manage decision history

let allDecisions = [];
let filteredDecisions = [];

// Initialize timeline
document.addEventListener('DOMContentLoaded', async () => {
    await loadDecisions();
    setupFilters();
    setupExport();
});

// Load all decisions from storage
async function loadDecisions() {
    allDecisions = await StorageAPI.getAllDecisions();

    // Sort by timestamp (newest first)
    allDecisions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    filteredDecisions = [...allDecisions];

    updateStats();
    renderTimeline();
}

// Update statistics
function updateStats() {
    const totalCount = document.getElementById('totalCount');
    const thisWeekCount = document.getElementById('thisWeekCount');

    totalCount.textContent = allDecisions.length;

    // Calculate this week's count
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weekCount = allDecisions.filter(d =>
        new Date(d.timestamp) >= oneWeekAgo
    ).length;

    thisWeekCount.textContent = weekCount;
}

// Render timeline entries
function renderTimeline() {
    const timeline = document.getElementById('timeline');
    const emptyState = document.getElementById('emptyState');

    if (filteredDecisions.length === 0) {
        timeline.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    timeline.style.display = 'grid';
    emptyState.style.display = 'none';

    timeline.innerHTML = filteredDecisions.map((decision, index) =>
        createDecisionCard(decision, index)
    ).join('');

    // Attach delete handlers
    document.querySelectorAll('.delete-action').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = btn.dataset.id;
            if (confirm('Permanently remove this trace memory?')) {
                await handleDelete(id);
            }
        });
    });
}

// Create decision card HTML
function createDecisionCard(decision, index) {
    const date = new Date(decision.timestamp);
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(date);

    const moodBadge = decision.mood
        ? `<span class="mood-badge">${getMoodIcon(decision.mood)} ${decision.mood}</span>`
        : '';

    // Add staggered animation delay
    const delay = index * 0.05;

    return `
        <div class="trace-card" style="animation-delay: ${delay}s">
            <div class="card-header">
                <div class="trace-meta">
                    <div class="trace-date">${formattedDate} • ${formattedTime}</div>
                    <div class="trace-title">${escapeHtml(decision.pageTitle)}</div>
                    <a href="${escapeHtml(decision.url)}" target="_blank" class="trace-url">
                        ${getDisplayUrl(decision.url)}
                    </a>
                </div>
                <div class="card-top-right">
                    ${moodBadge}
                    <button class="delete-action" data-id="${decision.id}" title="Delete Trace">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="trace-reason">${escapeHtml(decision.reason)}</div>
        </div>
    `;
}

// Format date (e.g., "Feb 3, 2026")
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Format time (e.g., "3:42 PM")
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
}

// Get display URL (truncate if too long)
function getDisplayUrl(urlStr) {
    try {
        const url = new URL(urlStr);
        return url.hostname + (url.pathname.length > 20 ? url.pathname.substring(0, 20) + '...' : url.pathname);
    } catch {
        return urlStr;
    }
}

// Get mood icon
function getMoodIcon(mood) {
    const icons = {
        'Calm': '😌',
        'Rushed': '⚡',
        'Excited': '✨',
        'Anxious': '😰',
        'Unsure': '🤔'
    };
    return icons[mood] || '';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup filter handlers
function setupFilters() {
    const moodFilter = document.getElementById('moodFilter');
    const searchInput = document.getElementById('searchInput');

    moodFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
}

// Apply filters
async function applyFilters() {
    const mood = document.getElementById('moodFilter').value;
    const searchText = document.getElementById('searchInput').value;

    const criteria = {};
    if (mood) criteria.mood = mood;
    if (searchText) criteria.searchText = searchText;

    filteredDecisions = await StorageAPI.filterDecisions(criteria);

    // Sort by timestamp (newest first)
    filteredDecisions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    renderTimeline();
}

// Handle decision deletion
async function handleDelete(id) {
    const success = await StorageAPI.deleteDecision(id);

    if (success) {
        await loadDecisions();
    } else {
        alert('Failed to delete trace. Please try again.');
    }
}

// Setup export functionality
function setupExport() {
    const exportBtn = document.getElementById('exportBtn');

    exportBtn.addEventListener('click', async () => {
        const json = await StorageAPI.exportAsJSON();
        downloadJSON(json, `decision-trace-export-${new Date().toISOString().split('T')[0]}.json`);
    });
}

// Download JSON file
function downloadJSON(content, filename) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}
