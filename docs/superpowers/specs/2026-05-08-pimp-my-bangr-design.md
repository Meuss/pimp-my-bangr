# Pimp my BANGR — Design Spec

## Context

Marvelous Digital uses Aubep (BANGR) as their internal timesheet tool at `marvelous.aubeperp.ch:8443`. The interface is functional but visually outdated — a classic enterprise Java webapp with default styling. This project creates a Chrome extension that injects a dark mode theme over the existing UI, making the daily time-entry experience more pleasant without modifying any server-side code or breaking functionality.

A companion landing page on GitHub Pages will explain how to install and use the extension, with a fun and playful tone matching the "Pimp my BANGR" branding.

## Deliverables

1. **Chrome Extension** — "Pimp my BANGR"
2. **Landing Page** — GitHub Pages site with install/usage instructions

---

## 1. Chrome Extension

### Architecture

Manifest V3 extension with CSS injection and a simple toggle.

```
pimp-my-bangr/
├── manifest.json
├── content.css          # Dark mode styles
├── background.js        # Service worker — handles toggle state
├── popup.html           # Toolbar popup with on/off switch
├── popup.css            # Popup styling
├── popup.js             # Toggle logic
└── icons/
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

### manifest.json

- **Manifest version:** 3
- **Permissions:** `storage`, `activeTab`, `scripting`
- **Host permissions:** `*://marvelous.aubeperp.ch:8443/*`
- **Content scripts:** Conditionally injected via `chrome.scripting.insertCSS` / `chrome.scripting.removeCSS` (not declaratively, so the toggle works)
- **Action:** Popup with toggle switch
- **Icons:** 16, 48, 128px

### Toggle Mechanism

- `background.js` listens for extension install and tab updates
- On matching tabs (`marvelous.aubeperp.ch:8443`), it checks `chrome.storage.local` for the enabled state (default: `true`)
- When enabled: injects `content.css` via `chrome.scripting.insertCSS`
- When disabled: removes it via `chrome.scripting.removeCSS`
- `popup.js` reads/writes the toggle state and sends a message to `background.js` to apply/remove CSS on the current tab

### Target Page

- **URL pattern:** `*://marvelous.aubeperp.ch:8443/marvelous/*`
- **Primary page:** SAISIR (time entry) — `body.cockpitRessourceTimeRecord`
- Other pages get basic dark mode treatment (body/header) but no detailed styling

### CSS Strategy

Override existing styles using the page's class/ID selectors. Use `!important` sparingly — only where the existing stylesheets use inline styles or high-specificity selectors.

**Key DOM selectors identified:**

| Element | Selector |
|---------|----------|
| Body | `body.cockpitRessourceTimeRecord` |
| Header | `.header.is-fixed` |
| Header inner | `.header__inner` |
| Header title | `.header__title` |
| Nav tabs (active) | `.liens_menu_selected` |
| Nav tabs (inactive) | `.liens_menu` |
| Main content | `.main-content` |
| Left menu | `#menuLeft` / `.menu` |
| Form inputs | `input[type="text"]`, `select`, `textarea` |
| Primary buttons | `.button--primary` |
| Secondary buttons | `.button--secondary` |
| Tables | `.border_table`, `.center_table` |
| Sidebar | `#sidebar` |
| Footer | `#bottomDiv` |
| Loading overlay | `#loading` |

### Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| BG Base | `#0f172a` | Page background, main content area |
| BG Raised | `#1e293b` | Header, cards, input backgrounds, table headers |
| BG Alt Row | `#0c1322` | Alternating table rows |
| Borders | `#334155` | Input borders, table borders, dividers |
| Accent | `#38bdf8` | Active tab, links, project IDs, primary actions |
| Text Primary | `#e2e8f0` | Main text, filled input values |
| Text Secondary | `#94a3b8` | Labels, inactive tabs, muted text |
| Text Muted | `#64748b` | Placeholder text, subtle labels |
| Positive | `#4ade80` | Surplus hours, positive differences (with glow) |
| Negative | `#f87171` | Deficit hours, negative differences (with glow) |
| Warning | `#fb923c` | Non-productive hours, attention items |
| Button Primary | `#0ea5e9` | Primary action buttons (Charger, Enregistrer) |

### CSS Sections

1. **Base reset** — `body` background, text color, font smoothing
2. **Header** — dark background (`#1e293b`), lighter title text, muted icons
3. **Navigation tabs** — dark pills, cyan highlight on selected, hover states
4. **Form area** — dark inputs/selects with slate borders, labels in secondary color
5. **Schedule grid (Horaire indicatif)** — dark cells, subtle grid lines, time values in primary text
6. **Timesheet table** — dark rows with alternating `#0c1322`, filled inputs visible, project IDs in cyan, status badges restyled
7. **Hour inputs** — dark background, visible border only when filled, clear typography
8. **Summary/totals row** — dark background, green/red with text-shadow glow for differences
9. **Buttons** — primary gets accent blue, secondary gets dark with border
10. **Sidebar & menu** — dark overlay, matching color scheme
11. **Footer** — blend into dark theme
12. **Scrollbars** — dark thin scrollbars
13. **Dropdowns/selects** — dark background, light text
14. **Loading overlay** — dark semi-transparent

---

## 2. Landing Page

### Hosting

- GitHub Pages from the same repo (or a dedicated `gh-pages` branch)
- Static HTML + CSS, no build tools or frameworks

### Tone

Fun and playful — matches the "Pimp my BANGR" energy. A bit cheeky, dark-themed to match the extension itself.

### Structure

Single page with these sections:

1. **Hero** — Extension name in bold, tagline ("Make your BANGR timesheet not ugly"), before/after screenshot comparison
2. **Features** — Short list: dark mode, toggle on/off, zero performance impact
3. **Installation** — Step-by-step with screenshots:
   - Download the latest release (zip)
   - Go to `chrome://extensions`
   - Enable Developer Mode
   - Click "Load unpacked"
   - Select the extracted folder
4. **Usage** — Click the toolbar icon to toggle on/off
5. **Footer** — Credits, link to repo

### Design

- Dark background matching the extension's palette
- Playful typography (can use a Google Font like Inter or Space Grotesk)
- Before/after screenshot slider or side-by-side comparison
- Accent color highlights matching the cyan theme

---

## Verification

### Extension Testing

1. Load the unpacked extension in Chrome
2. Navigate to `marvelous.aubeperp.ch:8443/marvelous/login_screen.do`
3. Verify dark mode is applied to all identified elements
4. Toggle off via popup — verify original styling returns
5. Toggle on — verify dark mode re-applies
6. Reload the page — verify state persists
7. Check that all form interactions still work (inputs, selects, buttons, links)
8. Verify no console errors from the extension

### Landing Page Testing

1. Open `index.html` locally or via GitHub Pages
2. Verify all sections render correctly
3. Test on mobile viewport — should be responsive
4. Verify all links work
