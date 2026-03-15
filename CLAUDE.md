# Blackjack Project — Claude Code Guide

## Project Overview

A browser-based Blackjack game originally built for COMP-166. The project uses vanilla JavaScript with jQuery and Bootstrap. The goal is to modernize the UI/UX, fix gameplay display issues, and prepare it for deployment on GitHub Pages.

## Current Stack

- **HTML/CSS/JS** — no build system, no bundler
- **Bootstrap 4.5** via CDN (open to removing or replacing)
- **jQuery 3.5** via CDN (open to removing)
- **Card assets** — SVG files organized by suit under `src/images/`
- **Entry point** — `index.html` loads `src/css/style.css` and `src/js/main.js`

## Deployment Target

**GitHub Pages** — static files only. No server-side code. All assets must use relative paths. No `../` references that would break at the repo root.

## Priority Improvements

### 1. Show Card Counts (Most Important)
Both the player count and dealer count should be visible at all times during a hand.
- **Dealer count**: show a `?` (or hide the second card's value) while the hole card is face-down. Reveal the true count when the dealer flips the card.
- **Player count**: always visible after cards are dealt. Update live after every hit.
- **Split hand count**: show a separate count for the split hand when active.
- The `player-count` and `dealer-count` DOM elements already exist in the CSS but are toggled hidden in several places — fix those hiding calls so counts are consistently shown.

### 2. Card Display
- Cards are currently crammed with no breathing room on small screens.
- Improve layout so cards fan out or stack neatly in a row with consistent spacing.
- On mobile, cards should scale down gracefully (the `.playing-card` font-size approach is good — lean into it with responsive `em`/`rem` values).
- Dealer's face-down card should visually indicate it's hidden (the `.back-blue` class is already used — make sure it looks intentional, not broken).

### 3. Button Layout
- The current button group mixes game-action buttons (Hit, Stand, Double, Split) with bet/setup buttons (Bet input, Deal, Clear) in one flat row — this gets messy.
- Reorganize into two logical groups:
  - **Bet phase**: bet input + Bet button + Clear + Deal
  - **Play phase**: Hit, Stand, Double, Split
- Buttons should never overflow or wrap awkwardly on mobile.
- Use `display: none` / `display: flex` toggling (already in use) — just clean up the grouping.

### 4. Responsive / Mobile Layout
- The two-column `.row` layout (dealer left, player right) breaks on small screens.
- Switch to a single-column stacked layout on mobile: dealer on top, player below.
- Use CSS media queries or a modern CSS approach (Grid/Flexbox) instead of Bootstrap columns if Bootstrap is removed.
- Minimum target: works cleanly at 375px width (iPhone SE).

### 5. Modernization (if refactoring)
If Bootstrap and/or jQuery are removed:
- Replace Bootstrap grid with CSS Grid or Flexbox.
- Replace jQuery DOM manipulation (`$('.playerCards').append(...)`) with `document.createElement` / `element.classList`.
- Replace jQuery `.toggle()` with direct `style.display` or CSS class toggling.
- Keep all game logic in `src/js/main.js` — do not split into modules unless a bundler is added (GitHub Pages serves static files, no Node).

## Known Bugs / Logic Issues

- **Dealer hits only once**: `dealerTakeCard()` is recursive and looks correct, but verify the dealer keeps hitting until reaching 17+ after all player actions resolve.
- **Bet validation**: no user-facing error when bet is invalid (only a `console.log('error')`). Add a visible message.
- **`toggleSplit()` card comparison**: compares the last character of the card string (e.g. `'dA'` → `'A'`). Works for single-character ranks but breaks for `'10'` — the last char is `'0'`. Fix the rank extraction logic.
- **`getHandValue()` ace logic**: the condition `count < 11` vs `count > 11` has an off-by-one gap at exactly 11 — review edge case where two aces are dealt.
- **`var` / undeclared variables**: `nextCard`, `i`, `j` are used without `let`/`const` in several loops — fix to avoid accidental globals.

## File Structure

```
/
├── index.html
├── CLAUDE.md
├── src/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
│       ├── diamonds/
│       ├── hearts/
│       ├── spades/
│       ├── clubs/
│       └── backs/
└── README.md
```

## Style Notes

- The green felt background (`#006330`) is a keeper — it's the visual identity of the game.
- Card elements use a class-based SVG background-image system (e.g. `.playing-card.hA` = hearts ace). Do not break these class names.
- The `.blockquote` element is used for game messages — keep it but style it more clearly (players often miss results).
- Prefer CSS custom properties (`--var`) for colors and spacing to make theming easier going forward.

## What Not to Change

- The card SVG asset filenames and folder structure under `src/images/` — CSS background-image rules depend on them.
- The core game logic functions: `getHandValue()`, `shuffleDeck()`, `scoreGame()`, `blackjack()`, etc. — only fix confirmed bugs, don't rewrite game logic unnecessarily.
- The overall flow: Bet → Deal → Play (Hit/Stand/Double/Split) → Score → Play Again.
