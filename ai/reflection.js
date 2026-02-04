// Decision Trace — AI Reflection
// Pattern analysis using OpenAI or Claude (user-provided API key)

const AIReflection = {
    // Analyze decision patterns
    async analyzePatterns(decisions, apiKey, provider = 'openai') {
        if (!decisions || decisions.length === 0) {
            throw new Error('No decisions to analyze');
        }

        if (!apiKey) {
            throw new Error('API key is required');
        }

        // Prepare decision data for AI
        const decisionSummary = this.prepareDecisionData(decisions);

        // Create prompt that enforces "observation only" mode
        const prompt = this.createAnalysisPrompt(decisionSummary);

        // Call appropriate API
        if (provider === 'openai') {
            return await this.callOpenAI(prompt, apiKey);
        } else if (provider === 'claude') {
            return await this.callClaude(prompt, apiKey);
        } else {
            throw new Error('Unsupported AI provider');
        }
    },

    // Prepare decision data for analysis
    prepareDecisionData(decisions) {
        return decisions.map(d => ({
            timestamp: d.timestamp,
            mood: d.mood || 'not specified',
            reason: d.reason,
            domain: this.extractDomain(d.url),
            timeOfDay: this.getTimeOfDay(d.timestamp),
            dayOfWeek: this.getDayOfWeek(d.timestamp)
        }));
    },

    // Extract domain from URL
    extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return 'unknown';
        }
    },

    // Get time of day category
    getTimeOfDay(timestamp) {
        const hour = new Date(timestamp).getHours();
        if (hour < 6) return 'night';
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    },

    // Get day of week
    getDayOfWeek(timestamp) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date(timestamp).getDay()];
    },

    // Create analysis prompt
    createAnalysisPrompt(decisions) {
        return `You are analyzing decision-making patterns for a user. Your role is to OBSERVE and MIRROR patterns only—never give advice, suggestions, or judgments.

STRICT RULES:
- Only describe patterns you observe
- Never use phrases like "you should", "consider", "try to", "it might help"
- Never give recommendations or advice
- Focus on factual observations about timing, mood, language, and correlations

Here are the decision entries:
${JSON.stringify(decisions, null, 2)}

Please provide a brief analysis covering:
1. Time-based patterns (when decisions are made)
2. Mood patterns (if mood data is present)
3. Language patterns (common words, tone, decisiveness)
4. Domain patterns (which sites/contexts appear most)

Remember: Only observe and describe. Do not advise.`;
    },

    // Call OpenAI API
    async callOpenAI(prompt, apiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a pattern observer. You only describe patterns, never give advice.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    },

    // Call Claude API
    async callClaude(prompt, apiKey) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Claude API request failed');
        }

        const data = await response.json();
        return data.content[0].text;
    },

    // Test API connection
    async testConnection(apiKey, provider = 'openai') {
        try {
            const testPrompt = 'Respond with "Connection successful" if you receive this message.';

            if (provider === 'openai') {
                await this.callOpenAI(testPrompt, apiKey);
            } else if (provider === 'claude') {
                await this.callClaude(testPrompt, apiKey);
            }

            return { success: true, message: 'API connection successful' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};

// Make it available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIReflection;
}
