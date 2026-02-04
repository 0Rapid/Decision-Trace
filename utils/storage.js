// Decision Trace — Storage Utilities
// Local-first data management and professional exports

const StorageAPI = {
    // Generate UUID v4
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // Save a new decision entry
    async saveDecision(entry) {
        try {
            const decisions = await this.getAllDecisions();
            decisions.push(entry);
            await chrome.storage.local.set({ decisions });
            return true;
        } catch (error) {
            console.error('Error saving decision:', error);
            return false;
        }
    },

    // Get all decision entries
    async getAllDecisions() {
        try {
            const result = await chrome.storage.local.get('decisions');
            return result.decisions || [];
        } catch (error) {
            console.error('Error retrieving decisions:', error);
            return [];
        }
    },

    // Export decisions as JSON
    async exportAsJSON() {
        const decisions = await this.getAllDecisions();
        const data = {
            exported_at: new Date().toISOString(),
            extension_version: "4.0.0",
            total_entries: decisions.length,
            decisions: decisions
        };
        return JSON.stringify(data, null, 2);
    },

    // Export decisions as Markdown (Obsidian/Notion ready)
    async exportAsMarkdown() {
        const decisions = await this.getAllDecisions();
        let markdown = "# Decision Trace Log\n\n";
        markdown += `Generated on: ${new Date().toLocaleString()}\n\n---\n\n`;

        decisions.forEach(d => {
            markdown += `## Decision: ${new Date(d.timestamp).toLocaleString()}\n`;
            markdown += `**URL**: [${d.pageTitle || 'Link'}](${d.url})\n`;
            markdown += `**Mood**: ${d.mood || 'Neutral'}\n`;
            if (d.evidence) {
                markdown += `**Evidence Context**: _"${d.evidence}"_\n`;
            }
            markdown += `\n### Reason\n${d.reason}\n\n---\n\n`;
        });

        return markdown;
    },

    // Export decisions as CSV
    async exportAsCSV() {
        const decisions = await this.getAllDecisions();
        const headers = ["ID", "Timestamp", "URL", "Page Title", "Action Type", "Mood", "Reason", "Evidence"];

        let csv = headers.join(",") + "\n";

        decisions.forEach(d => {
            const row = [
                d.id,
                d.timestamp,
                `"${d.url}"`,
                `"${(d.pageTitle || '').replace(/"/g, '""')}"`,
                `"${d.actionType || 'Manual'}"`,
                `"${d.mood || 'Neutral'}"`,
                `"${(d.reason || '').replace(/"/g, '""')}"`,
                `"${(d.evidence || '').replace(/"/g, '""')}"`
            ];
            csv += row.join(",") + "\n";
        });

        return csv;
    },

    // Delete a specific decision by ID
    async deleteDecision(id) {
        try {
            const decisions = await this.getAllDecisions();
            const filtered = decisions.filter(d => d.id !== id);
            await chrome.storage.local.set({ decisions: filtered });
            return true;
        } catch (error) {
            console.error('Error deleting decision:', error);
            return false;
        }
    },

    // Clear everything
    async clearAllData() {
        try {
            await chrome.storage.local.clear();
            return true;
        } catch (error) {
            console.error('Error clearing all data:', error);
            return false;
        }
    },

    // Filter decisions based on mood or search text
    async filterDecisions(criteria) {
        let decisions = await this.getAllDecisions();

        if (criteria.mood) {
            decisions = decisions.filter(d => d.mood === criteria.mood);
        }

        if (criteria.searchText) {
            const search = criteria.searchText.toLowerCase();
            decisions = decisions.filter(d =>
                (d.reason && d.reason.toLowerCase().includes(search)) ||
                (d.pageTitle && d.pageTitle.toLowerCase().includes(search)) ||
                (d.url && d.url.toLowerCase().includes(search)) ||
                (d.evidence && d.evidence.toLowerCase().includes(search))
            );
        }

        return decisions;
    }
};

// Make it available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageAPI;
}
