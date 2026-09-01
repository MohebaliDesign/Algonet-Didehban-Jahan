# Responsive system

## Scope

This document defines the responsive behavior of the Didehban Jahan dashboard across large external monitors, desktop/laptop, tablet, phone, browser zoom, RTL/LTR, and touch input. It complements the existing design-system and page-specific CSS; it does not replace product hierarchy or approved content.

The implementation contract lives in `src/styles/responsive-system.css`, loaded last from `src/styles/index.css`. The shared compact-state hook uses a 1200px threshold so the shadcn Sidebar becomes an off-canvas Sheet before dense analytical cards, charts, and long text begin competing for horizontal space.

## Evidence used

### Project source

The Product Design Operating System requires responsive adaptation to change layout, grouping, stacking, interaction patterns, disclosure, wrapping, ordering, and component behavior before changing approved content. It also requires content-driven dimensions, touch-friendly controls, RTL/LTR validation, no unnecessary fixed heights on mobile, and preservation of comparison capability when adapting tables. New padding follows the approved scale and mobile text must not be shrunk to solve density.

### Nielsen Norman Group

- **Scaling User Interfaces**: screen size changes the information capacity of the user-device channel. Small screens increase interaction and memory cost; large screens should use their capacity rather than simply magnifying the same small-screen composition.
- **Small Pictures on Big Screens**: scaling an element indefinitely on large screens can waste information density and force unnecessary scrolling. Large-screen layouts should show useful information rather than only bigger information, and media should have sensible maximum dimensions.
- **Responsive Design and Intranets**: mobile layouts should prioritize important tasks and information while keeping navigation and key capabilities readily accessible. Consistency should not force every device into the same presentation.
- **Breakpoints in Responsive Design**: practical systems usually use a small number of meaningful layout breakpoints. Breakpoints should be chosen around layout needs and audience/device evidence rather than specific device models.

### Additional implementation and accessibility sources

- **MDN Container Queries**: reusable components can respond to their own available inline size rather than only the viewport. Didehban modules therefore establish an `inline-size` query container.
- **web.dev Responsive Web Design Basics**: the product already includes the required viewport meta tag; layouts continue to use fluid widths and bounded media instead of fixed page widths.
- **WCAG 2.2 — Reflow (1.4.10)**: ordinary page content should work without two-dimensional page scrolling down to the equivalent of 320 CSS px. Maps and data tables are recognized exceptions when two-dimensional layout is necessary; their scrolling/panning is isolated inside the component instead of leaking to the page.
- **WCAG 2.2 — Target Size (2.5.8)**: interactive targets must meet the AA minimum or its exceptions. Didehban already uses 40px controls; coarse-pointer environments raise important controls to a 44px minimum for a more forgiving touch surface.

## Breakpoint model

Didehban uses a small number of layout transformations chosen around content failure, not device branding.

| Range | Role | Primary behavior |
| --- | --- | --- |
| `>= 1600px` | Large-monitor density guardrail | Keep typography/control scale stable; use 20px analytical gaps and cap chart height rather than enlarging every element. |
| `1200–1599px` | Desktop / laptop | Persistent sidebar; multi-column analytical layouts remain where they preserve readability. |
| `900–1199px` | Tablet landscape / compact laptop | Sidebar becomes a shadcn Sheet drawer; dense analytical modules stack to one column; tabs become shadcn Select controls. |
| `640–899px` | Tablet / small landscape | Same stacked analytical structure; context filters use progressive disclosure; fixed card heights remain removed. |
| `< 640px` | Phone | One-column KPI/cards, full-width search row, stacked actions, content-driven card height, full-width map detail Sheet, and isolated table horizontal scrolling. |
| `< 360px` | Reflow guardrail | Preserve one-dimensional page flow with 16px emergency gutters and stacked page actions. |

## Component behavior

### Application shell and primary navigation

- Desktop navigation remains persistent at 1200px and above.
- Below 1200px the existing shadcn Sidebar switches to its Sheet behavior so navigation no longer consumes analytical width.
- The compact trigger uses a clear hamburger glyph. Opening the drawer changes the glyph state to a close icon with a small CSS transition; the drawer header also exposes the close state directly.
- Selecting a navigation item closes the drawer and returns focus/context to the chosen page.
- The top bar becomes a grid instead of compressing search and actions into one line.
- On phones, actions remain available and the global search moves to its own full-width row.
- Keyboard-only hints such as `Ctrl K` are hidden in the compact layout while the search label and action remain available.

### Context filters

- Desktop keeps filters visible for scanning and fast comparison.
- Below 900px the existing `Filters` trigger becomes the entry point.
- Opening it reveals the same approved filters in a two-column tablet layout or one-column phone layout.
- The filter area becomes content-driven and internally scrollable only when it exceeds a safe viewport height.
- No filter labels or options are removed to make the layout fit.

### Dashboard modules

- Module cards are `inline-size` query containers.
- Narrow cards wrap module controls and title metadata even when the viewport itself is wide.
- Below 1200px the main analytical module grids linearize to one column. This specifically prevents chart modules, long summaries, ranked event lists, and other data-heavy cards from being squeezed side by side.
- Fixed maximum heights are removed from these compact analytical layouts so content is not clipped and text does not become fragmented into narrow columns.
- KPI strips remain allowed to use multiple columns where each KPI still scans cleanly; this is intentionally different from dense analytical modules.
- Intentional two-dimensional surfaces such as maps and data tables retain local interaction behavior.

### Tabs and section switching

- Desktop and large laptop layouts keep the shadcn Tabs pattern because the labels have enough horizontal space and simultaneous visibility supports scanning.
- Below 1200px tab navigation transforms into a shadcn Select while the underlying `TabsContent` and selected state remain unchanged.
- The same information architecture, labels, URL state, and content are preserved; only the compact interaction control changes.
- This pattern is used in the country map detail Sheet and the dedicated intelligence detail page and should be reused for future tabbed compact surfaces.

### KPIs

- KPI strips use available width rather than a device-specific hard-coded count.
- Tablet uses two columns where possible; phone uses one column so values, labels, deltas, and icons remain readable without shrinking typography.

### Charts

- Charts use a fluid but bounded analytical height (`280–440px`) instead of a permanent 16:9 expansion.
- This prevents 4K monitors from turning charts into oversized low-density surfaces.
- Narrow module containers use a 300px chart height to preserve axes and labels.
- Recharts remains responsive inside the shadcn Chart container; no chart receives a fixed page width.
- Because analytical modules stack below 1200px, chart axes and legends are no longer compressed into half-width tablet cards.

### Tables

- Data tables remain tables when cross-column comparison is the user task.
- Horizontal overflow is confined to the shadcn table container and never to the page body.
- This intentionally follows the WCAG reflow exception for data tables while preserving comparison capability from the project source.
- Search, filters, selection actions, and table wrappers stack above the table on smaller screens.

### Maps

- Maps remain fill-width inside their modules and keep local pan/zoom behavior.
- Map viewport sizing is bounded by its module; page-level scrollbars are not introduced.
- Existing mobile map heights and overlays continue to use the shared compact hook, now aligned to the 1200px navigation/tab transformation.

### Dialogs and Sheets

- Dialogs are constrained to the dynamic viewport and keep internal scrolling where needed.
- The country-detail Sheet becomes full-width on phones so the map is not squeezed into an unusable sliver behind it.
- Other shadcn Sheets retain their own component widths; the responsive system does not globally force every Sheet to full width.
- Safe-area padding is preserved on compact full-height surfaces where relevant.

### Touch, keyboard, and motion

- Coarse-pointer controls use a 44px minimum block size.
- Hover remains enhancement only; actions remain keyboard/focus/touch reachable.
- Reduced-motion preferences remove the authored hamburger transition and smooth-scrolling behavior.
- RTL and LTR use logical properties (`inline`, `block`, `start`, `end`) so layout transformations mirror without duplicated trees.

## QA matrix

At minimum, verify each primary route in Persian RTL and English LTR at these viewport widths:

- 320px — WCAG reflow guardrail
- 375px — common phone design width
- 640px — phone/tablet transition
- 768px — tablet portrait
- 900px — filter transformation boundary
- 1024px — tablet landscape / compact laptop, with drawer navigation and stacked modules
- 1199px — upper compact boundary
- 1200px — persistent-sidebar boundary
- 1280px — laptop
- 1440px — desktop
- 1920px — large monitor
- 2560px+ — high-resolution external monitor

For each width verify: no page-level horizontal overflow; all navigation destinations remain reachable; approved copy remains present; filters remain usable; dense modules do not share a row when readability suffers; tabs become Select controls below 1200px; the hamburger/close states are understandable; cards do not clip content; charts keep readable axes; tables scroll only inside their own region; map controls stay inside the map; dialogs/sheets stay inside the dynamic viewport; focus order is logical; and touch targets remain usable.

Also test browser zoom at 200% and 400% where practical, long Persian/English labels, missing/empty data, dark/light theme, and coarse-pointer simulation.

## Open validation

The breakpoints are evidence-informed implementation hypotheses. The repository does not currently include production device analytics or responsive usability-test findings. If real device/viewport distribution or task analytics become available, refine the thresholds around observed layout failures and user tasks rather than preserving the numbers for their own sake.
