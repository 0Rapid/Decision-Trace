# Contributing to Decision Trace

Thank you for considering contributing to Decision Trace! This document provides guidelines for contributing to this privacy-first, open-source browser extension.

## Philosophy

Before contributing, please understand the core principles of this project:

1. **Privacy First**: No tracking, no telemetry, no data collection
2. **Local Only**: All data stays on the user's device
3. **User Control**: The user explicitly triggers all actions
4. **No Advice**: AI features observe patterns only, never give advice
5. **Minimal & Calm**: Simple design, no gamification, no productivity scoring
6. **Transparent**: Open source, readable code, clear documentation

## How to Contribute

### Reporting Bugs

1. Check if the issue already exists in GitHub Issues
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected behavior vs. actual behavior
   - Browser version and OS
   - Screenshots if applicable

### Suggesting Features

1. Open a GitHub Discussion (not an Issue) to propose new features
2. Explain:
   - What problem the feature solves
   - How it aligns with the privacy-first philosophy
   - Why it's valuable to users

**Note**: Features that violate the privacy principles will not be accepted, even if well-implemented.

### Submitting Code

#### Before You Start

1. **Discuss first**: For significant changes, open a Discussion or Issue first
2. **Check existing PRs**: Someone might already be working on it
3. **Read the code**: Familiarize yourself with the codebase structure

#### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/decision-trace.git
cd decision-trace

# Load the extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the project folder
```

#### Code Standards

**JavaScript**:
- Use vanilla JavaScript (no frameworks)
- Use modern ES6+ syntax
- Use descriptive variable names
- Add comments for complex logic
- Keep functions small and focused

**HTML**:
- Semantic HTML5
- Accessibility attributes (ARIA labels, alt text, etc.)
- Clean, well-indented markup

**CSS**:
- Use CSS variables for colors and spacing
- Mobile-first responsive design
- Consistent naming conventions
- Dark mode by default

**File Organization**:
- Keep related files together (HTML, CSS, JS for each view)
- Utilities in `utils/` folder
- Follow existing file structure

#### Making Changes

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**:
   - Write clean, readable code
   - Test thoroughly in Chrome
   - Ensure no console errors
4. **Test your changes**:
   - Manually test all affected features
   - Test edge cases
   - Verify privacy principles are maintained
5. **Commit your changes**:
   ```bash
   git commit -m "Add: brief description of changes"
   ```
   Use conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for improvements
   - `Docs:` for documentation
   - `Refactor:` for code refactoring

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

#### Pull Request Guidelines

Your PR should:
- Have a clear title and description
- Reference any related issues
- Explain what changed and why
- Include screenshots for UI changes
- Pass manual testing
- Maintain or improve code quality
- Not introduce new dependencies (unless absolutely necessary)
- Not violate privacy principles

**Privacy Checklist**:
- [ ] No automatic tracking added
- [ ] No external requests (except optional AI with user permission)
- [ ] All data remains local
- [ ] User has full control over new features
- [ ] No telemetry or analytics

## Code Review Process

1. A maintainer will review your PR
2. They may request changes or ask questions
3. Update your PR based on feedback
4. Once approved, a maintainer will merge it

## What We're Looking For

**Welcome contributions**:
- Bug fixes
- Performance improvements
- Accessibility improvements
- Documentation improvements
- UI/UX refinements (within the minimal aesthetic)
- Firefox compatibility
- Internationalization (i18n)
- Better error handling
- Code refactoring for clarity

**Contributions we'll carefully review**:
- New features (must align with philosophy)
- Changes to data storage
- Changes to permissions
- New dependencies

**Contributions we won't accept**:
- Automatic tracking or surveillance features
- Cloud backup or sync
- Account systems or authentication
- Productivity scoring or gamification
- AI advice features (AI must observe only)
- Telemetry or analytics
- Monetization features
- Features that compromise privacy

## Testing

Since this is a browser extension, testing is primarily manual:

### Manual Testing Checklist

- [ ] **Popup**:
  - [ ] Opens via keyboard shortcut
  - [ ] Opens via icon click
  - [ ] Captures correct URL and title
  - [ ] Saves decision successfully
  - [ ] Skip button works
  - [ ] Mood selector works
  - [ ] Form validation works

- [ ] **Timeline**:
  - [ ] Displays all entries
  - [ ] Sorting works (newest first)
  - [ ] Filtering by mood works
  - [ ] Search works
  - [ ] Delete works
  - [ ] Export JSON works

- [ ] **Settings**:
  - [ ] AI toggle works
  - [ ] API key saves correctly
  - [ ] Test connection works
  - [ ] Pattern analysis works (with valid API key)
  - [ ] Clear all data works

- [ ] **Privacy**:
  - [ ] No network requests when AI is disabled
  - [ ] Chrome DevTools → Network tab shows no unexpected requests
  - [ ] Data is stored locally (check Application → Storage)

## Firefox Compatibility

We welcome contributions to make the extension Firefox-compatible:

1. Replace `chrome.*` API calls with `browser.*` or use a polyfill
2. Update `manifest.json` with Firefox-specific fields
3. Test in Firefox Developer Edition
4. Document Firefox-specific setup in README

## Questions?

Feel free to:
- Open a Discussion on GitHub
- Comment on existing Issues or PRs
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for helping make Decision Trace better while preserving its privacy-first values!
