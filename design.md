# Ocean Website — Design System `design.md`

> Updated: 2026-05-11  ·  Stack: `Next.js 16.3.5` / `React 19.2.8` / `Tailwind CSS v4` / `Lenis 1.3.26`  ·  Export mode: `next build` → `out/` / `Netlify`
> Source of truth: `src/app/globals.css`, `src/app/layout.tsx`, and `src/components/*`.

---

## 1. Overview & Philosophy

**Ocean Code** is positioned as a full-stack agentic coding platform (Agent Studio, IDE, CLI). The website is intentionally **editorial, warm, and paper-like** — the opposite of a dark neon dev-tool. It borrows from luxury editorial (Tiempos/Newsreader) + developer-tool pragmatism.

**Core principles:**

1.  **Warm canvas, not cold tech.** Primary page background is warm cream ` #faf9f5` (`src/app/globals.css:14` / `src/app/page.tsx:47`), not white or dark gray. Cards float on top of it.
2.  **Ocean Blue is the only saturated hue.** Single accent `#007acc` (`--primary`) carries all interactive meaning — links, CTA hovers, copy states, particle systems. No multi-color chaos.
3.  **Typography does the branding.** Serif display (Newsreader) for headlines, Inter for body, JetBrains Mono for code/technical UI. Weight is never heavier than `600`; headlines are `font-normal (400)`.
4.  **Depth through borders & subtle shadows, not gradients.** `border: #e6dfd8` hairlines + `shadow-[0_12px_36px_rgba(20,20,19,0.08)]` style elevation (`src/app/globals.css:51`). Gradients only as invisible ambient blurs (`blur-[120px]` at `opacity 0.06`).
5.  **Motion is calm, not frantic.** 220–300ms `cubic-bezier(0.16,1,0.3,1)` eases, exponential spring convergence for canvas particles, 5s auto-cycle. Respects `prefers-reduced-motion`.

---

## 2. Tech & Project Structure

```
src/app/layout.tsx          Root layout — font loaders, ThemeProvider, Navbar, SmoothScroll, <main pt-16>
src/app/page.tsx            Home page — 5 bands (Hero → ShowcaseSections → DualAudienceShowcase → Download teaser → FooterWordmark)
src/app/globals.css         Design tokens, @theme inline, base styles, prose, keyframes, scrollbar, selection
src/app/docs/layout.tsx     Docs shell — Sidebar + prose container
src/app/download/page.tsx   Download marketing page
src/app/contact/page.tsx    Contact/enterprise lead form
src/components/Navbar.tsx   Fixed glass header
src/components/SmoothScroll.tsx  Lenis provider
src/components/ThemeProvider.tsx Class-based dark mode with localStorage
src/components/OceanLogo.tsx     Mask-based brand mark
src/components/ShowcaseSections.tsx  3-step code showcase carousel (Ocean 2.0 / CLI / IDE)
src/components/DualAudienceShowcase.tsx Dual CTA cards with canvas particle hover assembly
src/components/QuickInstallBar.tsx  Platform-aware install command dropdown + copy
src/components/FooterWordmark.tsx   Antigravity footer lockup
src/components/Sidebar.tsx    Docs navigation with mobile drawer
src/components/ToolboxIcon.tsx  Briefcase/toolbox SVG (download teaser)
src/components/PixelBraces.tsx  Legacy pixel {ocean code} canvas (ambient variant)
src/components/CodeSyntaxEnhancer.tsx Client-side code token окрашивание + copy button injection
src/components/DocsBreadcrumb.tsx Breadcrumb for docs hierarchy
public/ocean-logo*.png        Logo rasters used as CSS mask source
```

Build: `output: "export"` (`next.config.ts:4`), `images.unoptimized: true`, static hosting on Netlify (`netlify.toml`).

---

## 3. Brand Identity

### 3.1 OceanLogo `src/components/OceanLogo.tsx:12`

- Not an `<img>` — rendered as a **CSS mask** (`maskImage: url(/ocean-logo.png)`) with `backgroundColor: currentColor`. This lets the logo inherit `text-*` color and animate via transforms without raster swap.
- Props: `size` (default 20), `color?`, `animated: hover-spin | float | pulse | breathe | spin-slow | none` (`src/components/OceanLogo.tsx:6`).
- Animation classes map to keyframes in `globals.css:480-534`.

### 3.2 Wordmark

- Navbar: serif `Ocean` + 6px blue dot (`src/components/Navbar.tsx:56-58`).
- FooterWordmark: giant `Oceancod` + floating `e` at `0.62em` lifted `-0.44em` (`src/components/FooterWordmark.tsx:42-49`). Responsive `54px → 210px`. Badge uses floating logo (`animate-ocean-float`).

### 3.3 ToolboxIcon `src/components/ToolboxIcon.tsx:1`

- 64×64 stroke-only briefcase icon with handle, body, seam, and two clasps. Used once on the home download teaser (`src/app/page.tsx:286`). Clasp fill flips `white` ↔ `dark:#141413`.

---

## 4. Color System

All tokens declared as CSS variables in `:root` and `.dark` (`src/app/globals.css:5-80`) and exposed via `@theme inline` for Tailwind `bg-*`/`text-*` utilities.

### 4.1 Light (default warm paper)

| Token | Value | Usage |
|-------|-------|-------|
| `--canvas` | `#faf9f5` | Page background |
| `--surface-soft` | `#f5f0e8` | Hero band, section washes |
| `--surface-card` | `#efe9de` | Code blocks alt, pill backgrounds |
| `--surface-cream-strong` | `#e8e0d2` | Active nav pill, strong card |
| `--hairline` | `#e6dfd8` | Borders, dividers |
| `--hairline-soft` | `#ebe6df` | Table subtle lines |
| `--ink` | `#141413` | Primary text, CTA background |
| `--body` | `#3d3d3a` | Prose body |
| `--body-strong` | `#252523` | Prose strong |
| `--muted` / `--muted-soft` | `#6c6a64` / `#8e8b82` | Secondary / caption |
| `--primary` | `#007acc` | Ocean Blue — links, focus, dots |
| `--primary-active` | `#005a8c` | Hover for primary solid buttons |
| `--accent-teal` / `--accent-amber` | `#5db8a6` / `#e8a55a` | Rare decorative gradients |
| `--success/warning/error` | `#5db872` / `#d4a017` / `#c64545` | Semantic |

### 4.2 Dark (warm charcoal)

| Token | Value |
|-------|-------|
| `--canvas` | `#181715` |
| `--surface-soft` | `#1f1e1b` |
| `--surface-card` | `#252320` |
| `--surface-cream-strong` | `#2d2b27` |
| `--hairline` | `#33312c` / `#282622` |
| `--ink` | `#faf9f5` |
| `--body` | `#c9c6bd` |
| `--muted` | `#9e9a91` |

Dark is **warm**, not pure black — borders shift to `#2a2926`/`#262420` to keep cream-era depth logic.

### 4.3 Particle Blue Palette

Dual cards and PixelBraces use a dedicated **Ocean Blue ramp** (never orange despite legacy var name `ORANGE_PALETTE`):

`#007acc` (signature), `#0086d6`, `#0094e6`, `#339ad4`, `#66b3e0`, `#99ccee` (`src/components/DualAudienceShowcase.tsx:7-14`, `src/components/PixelBraces.tsx:242-250`). Dust uses subset `DUST_LIGHT / DUST_DARK`. Glow/shadow: `rgba(0,122,204,0.65)`.

---

## 5. Typography

Loaded via `next/font/google` (`src/app/layout.tsx:8-25`):

| Role | Font | Variable | Weights | Usage |
|------|------|----------|---------|-------|
| **Display / Serif** | `Newsreader` | `--font-serif` | 400, 500 + italic | All `h1`/`h2` hero & section titles |
| **Sans / Body** | `Inter` | `--font-sans` | 400, 500, 600, 700 | Body, nav, buttons, cards |
| **Mono / Code** | `JetBrains_Mono` | `--font-mono` | 400, 500 | Code blocks, pills, kbd, terminal |

**Scale (actual rendered):**

- Home hero headline: `54px → 64 → 72px`, `leading-[1.04]`, `tracking-[-1.5px]`, `font-serif font-normal` (`src/app/page.tsx:58`).
- Showcase step headlines: `36 → 44 → 48px`, `tracking-[-1.2px]` (`src/components/ShowcaseSections.tsx:455`).
- Dual card headlines: `28 → 44px` / subheadline `22 → 36px`, `tracking-[-1px]` (`src/components/DualAudienceShowcase.tsx:520`).
- Download headline: `44 → 60 → 72px` (`src/app/download/page.tsx:74`).
- Prose (`src/app/globals.css:239-477`): `h1 28px/-0.6`, `h2 16.5px/600 + hairline border`, `h3 14px/600`, `p 14px/1.68 12px mb`, `li 13-14px`.
- Mono: `code 12px`, `pre code 12.5px/1.6`, install bar `13-14px`.

**Utilities:** `.font-display`, `.tracking-display-xl (-1.5)`, `lg (-1)`, `md (-0.5)`, `sm (-0.3)` (`src/app/globals.css:165-185`).

---

## 6. Layout, Spacing & Elevation

- **Max widths:** Home hero `1440px` (`src/app/page.tsx:51`), Navbar + Download/Contact/Dual cards `1240px` (`src/components/Navbar.tsx:49`), Showcase unified card `1340px` (`src/components/ShowcaseSections.tsx:410`), Footer `1360px`.
- **Navbar offset:** Fixed `h-16` header (`src/components/Navbar.tsx:48`) with `main pt-16` (`src/app/layout.tsx:62`). Docs `Sidebar` is `fixed top-16 bottom-0 w-[248px]` (`src/components/Sidebar.tsx:169`).
- **Containers:** `px-4 sm:px-6` (navbar), `px-6 sm:px-8` (hero), `px-6` (showcases). Vertical rhythm: `pt-12 pb-20 sm:pt-16 sm:pb-24` hero, `py-20 lg:py-28` dual, `pt-24 pb-32 sm:pb-36` teaser.
- **Cards rounding:** Hero mock `18-20px`, Showcase unified `20→32px`, Dual audience `28px`, Download platform `16px`, Contact form `24→28px`, Docs cards `9px`.
- **Borders:** `hairline` `#e6dfd8` @ 40% opacity on glass header, `1px` on cards. Hover: `hover:border-[#007acc]/50`.
- **Shadows:** Subtle system (`src/app/globals.css:49-51`): `--shadow-subtle 0 1px 2px rgba(20,20,19,0.04)`, `--shadow-card 0 2px 6px rgba(20,20,19,0.05)`, `--shadow-floating 0 12px 36px rgba(20,20,19,0.08)`. Card specifics e.g. `shadow-[0_16px_60px_rgba(20,20,19,0.07)]` showcase.
- **Grid:** Hero `lg:grid-cols-12` (`5 + 7`), Showcase `lg:grid-cols-12` (`5 + 7` with mirrored order for CLI step), Dual `grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10`, Contact `lg:grid-cols-12 (7 + 5)`.
- **Responsive hiding:** Hero mock + `ShowcaseSections` are `hidden lg:block` — the phone view intentionally collapses to editorial hero only (no mock). Dual cards remain single-column stack on mobile.
- **Scroll:** `html,body overflow-x:hidden max-w-100vw`, `-webkit-overflow-scrolling:touch` on `pre/table`.

---

## 7. Routing & Information Architecture

```
/                  Home (page.tsx)
/download          Download matrix + install bar
/contact           Enterprise form (client state, no backend — shows success inline)
/docs/installation  Getting Started
/docs/quickstart    Getting Started
/docs/configuration Getting Started
/docs/studio        Ocean Studio overview
/docs/ide           Ocean IDE overview
/docs/cli           Ocean CLI overview
/docs/cli/commands  CLI
/docs/cli/config    CLI
External: https://ocean-ai-studio.netlify.app/ (Chat link in navbar)
GitHub:  https://github.com/oceancodecli/oceancode
Releases (hardcoded): .../releases/latest/download/Ocean-Setup-x64.exe etc. (download/page.tsx:123-184)
```

Docs use a custom shell `src/app/docs/layout.tsx` with `Sidebar` + `<CodeSyntaxEnhancer />` + `DocsBreadcrumb`.

---

## 8. Component Catalog

### 8.1 `Navbar.tsx:40`

- Fixed glass: `bg-[#faf9f5]/45 dark:bg-[#141413]/45 backdrop-blur-2xl`, border `e6dfd8/40 dark:2a2926/40`, `shadow 0 1px 16px rgba(20,20,19,0.04)`.
- Left: mask logo (hover-spin 500ms rotate-90 + scale-110).
- Right: `Docs` (active if `pathname.startsWith("/docs")`, fills `bg-ede6d8`), `Chat` (external), `Download` (solid `bg-[#141413]` ↔ inverted in dark), `GitHub`, theme toggle `w-8 h-8 sm:w-9` circle with Sun/Moon icons.

### 8.2 `ThemeProvider.tsx:19` + `layout.tsx:40-55`

- Inline `<script>` in `<head>` reads `localStorage["ocean-theme"]` or `prefers-color-scheme`, toggles `html.dark` **before paint** (no flash). `ThemeProvider` syncs state, exposes `toggle()` that writes back and toggles class.

### 8.3 `SmoothScroll.tsx` + `globals.css:130-142`

- `Lenis` smooth scroll (`lenis` lib). CSS guards: `html.lenis {height:auto}`, `lenis-smooth {scroll-behavior:auto}`, `lenis-stopped {overflow:hidden}`.

### 8.4 Home Hero — `page.tsx:50-263`

- **Band 1** editorial band with left copy (headline, 17-18px muted body, stacked CTAs) and right desktop mock (hidden `lg`).
- CTAs: Primary `bg-[#141413]` (dark flips to `bg-white`) + `WindowsIcon`; Secondary `bg-[#ede8df]` with `ExternalIcon`. Capsule radius `8px`.
- **Desktop Mock** `rounded 18-20px`, `bg-f0ebe1/dark-0b0b0b`, shadow `0 24px 70px`. Two-pane layout: Left sidebar `w-[245→260px]` with traffic dots, `Home/Code` tabs, nav (`+ New session`, `Routines`…), `Pinned/Scheduled/Recents` sections, user footer `Susan Sample`; Right workspace with breadcrumb, blue `bg-e2ecf9/dark-0f2137` user bubble, assistant `POST /charges` trace, input placeholder bar. Includes custom macOS scrollbar cue and floating `OceanLogo spin-slow`.

### 8.5 `ShowcaseSections.tsx:352`

Unified pinned card (`rounded 20→32px`, `bg-fbf9f4/dark-191816`, `min-h 540→580px`) with **3 slides cross-fading** via `opacity + absolute inset-0 pointer-events-none` (clean, no transform jank).

- **Control bar:** pill switcher `bg-ede6d8/dark-201f1c` with numbered tabs `01/02/03`. Active morphs to `bg-[#141413]/white` with scale + `shadow-xs`. Auto-cycle `setInterval 5000ms` (`useEffect 388-393`) loops `2→0`. Manual `handleSelectStep` overrides.
- **Slide 1 — Ocean 2.0:** Left editorial (copy), right aura mock (`from-dbeafe/50 via-fef3c7/30 to-dcfce7/40`). Aura uses `blur-[80px]` 300px blobs. Inner card with folder nav + `useTypewriter` input displaying 3 rotating asks (`Refactor auth flow…` etc., `typing 38 / delete 18 / pause 3400`).
- **Slide 2 — Ocean CLI:** Mirrored (`lg:order-2/1`). OpenCode-style terminal (`bg-fbf8f2/dark-161616`) with traffic lights, `oceancode` digital block logo (`OceanCodeLogo 186-250`), command card with `Build · Default` meta, and `tab agents / ctrl+p commands` footer + `Tip Run /connect`. Uses `useTypewriter` at `42/18/3400`.
- **Slide 3 — Ocean IDE:** Editorial left, pure code editor window right with `index.html` tab and `HighlightedHtml` streaming full `HTML_BOILERPLATE` via `useHtmlBoilerplateTypewriter` (`28 / pause 4200`). Line numbers + syntax highlight (see §11). Footer `Ocean Agent Writing` pulsing green dot + `UTF-8 Spaces:2 HTML`.

Shared atoms: `ArrowRight` icon, `CliInstallModal` (copies `irm https://ocean.ai/install.ps1 | iex`, shows `Esc` dismiss, `Win+X → Terminal → Ctrl+V` instructions).

### 8.6 `DualAudienceShowcase.tsx:490`

Two equal cards `rounded-[28px]` `bg-white/dark-181715` `min-h 460→520px` `group hover:border-[#007acc]/50`.

Each wraps a **full-bleed `<canvas>`** behind centered editorial content (badge, `For developers / Achieve new heights` etc., CTA). Canvas particles assemble **only on hover/touch**.

- `HoverBracesCanvas:48` — samples 2 SVG brace paths (`leftBraceSvg` / `rightBraceSvg` `src/app/DualAudienceShowcase.tsx:71-74`) with normal offset ribbon `14px` thickness, `~160*2.6 ≈ 800` particles + `45` ambient dust dots. Positions via `path.getTotalLength()/getPointAtLength` with jitter. Uses float-sine drift when scattered, `x += dx*0.058` exponential convergence on hover (`alpha → 0.95`, `shadowBlur 4` blue).
- `HoverRingsCanvas:282` — 6 orbital clusters (60 points each = 360 particles) placed on radius `0.36*minDim` around center, global orbit `time*0.08`, local angle `+ time*0.25`. Same spring/physics separation of hovered vs. drift.
- Common: DPR-aware resize + `ResizeObserver`, `requestAnimationFrame`, light/dark `DUST_LIGHT/DARK`. Cards use `onMouseEnter/Leave` and `onTouchStart` to set `isHovered` (`useState` + `useRef` mirror for RAF closure).

CTAs: `Download` solid `bg-141413` + blue-glow `shadow-[0_0_20px_rgba(0,122,204,0.35)]` on group hover; `Contact Us` `bg-f4eee4/dark-252320` bordered.

### 8.7 `QuickInstallBar.tsx:55`

Platform-aware install pill: `rounded-[14px]` `bg-ede6d8/dark-1a1917` `shadow 0 12px 32px`.

- Left: **Get Ocean** dropdown (`useState selectedIdx`, `dropdownRef` outside-click close). Lists 5 platforms (`platforms[] 15-53`): `Windows PowerShell`, `macOS & Linux (Bash)` (`curl -fsSL`), `npm`, `Homebrew`, `Winget`. Each has colored token parts `prefix/url/pipe/suffix`.
- Right: command string inline with tokens colored `007acc / 141413 / 8a857b / 0284c7` + copy button. Copy uses `navigator.clipboard.writeText`, toggles `Copied ✓` in `emerald-600` for 2200ms.
- Subtext: `Or read the documentation →` linking to `docsHref`.

Used on Home teaser (`docsHref="/download"`) and Download hero (`/docs/installation`).

### 8.8 `FooterWordmark.tsx:11`

Full-width `py-20→36` footer with optional `capitalize` prop. Top floating logo badge (`p-3.5→4`, `rounded-2xl→3xl`, `bg-f0ebe1/dark-1c1b18` with blurred `bg-007acc/15`, floats via `animate-ocean-float`). Giant lockup `54→210px` serif-like sans `font-semibold tracking-[-0.04em]`; ghost `e` at relative `-top-0.44em 0.62em`.

### 8.9 `Sidebar.tsx:38`

- Desktop: `hidden lg:block fixed top-16 left-0 bottom-0 w-[248px]` with groups `Getting Started`, `Ocean Studio`, `Ocean IDE`, `Ocean CLI` (navGroups `7-36`). Items get `bg-ede6d8/dark-23221f` + blue dot when `pathname === href`.
- Mobile: sticky `Menu` bar `lg:hidden` showing `Menu / ActiveItem`, drawer `fixed inset-0 top-16` with `bg-black/50 backdrop-blur-xs` backdrop and `w-[280px]` panel with header, nav, and bottom `Download Ocean` CTA. `useEffect` locks body `overflow:hidden` when open.

### 8.10 `PixelBraces.tsx:153`

Varianted canvas for `{ocean code}` pixel text: `hero-ambient` (fills parent, pitch `2.8→3.4`, `OCEAN_CODE_POINTS ~ 9× grid`) vs. `pill` (`124×38`) vs. `canvas-only`. Includes 32 ambient sparkle dots with sine wave drift, hover snaps `dx*0.16` (~200ms). Preserved for potential use but superseded by `DualAudienceShowcase` on home.

### 8.11 `CodeSyntaxEnhancer.tsx:6` + `DocsBreadcrumb.tsx`

- Enhancer mounts on every `pathname` change, selects `.prose pre > code`, guards with `dataset.enhanced`, injects `Copy/Copied!` button (`absolute top-2.5 right-2.5`), then regex-highlights to `token-*` spans (strings green, env amber, cmd orange, subcmd blue, flags purple, numbers amber, comments gray italic, URLs teal).
- Breadcrumb renders docs hierarchy; styled via prose links.

### 8.12 Tooling extras

- `DocsBreadcrumb`, `CodeSyntaxEnhancer`, `ThemeProvider` are all client islands; the rest of the shell remains server components for static export.

---

## 9. Motion & Animation

### 9.1 Keyframes `globals.css:214-534`

| Name | Properties | Duration / Usage |
|------|------------|------------------|
| `fade-in` | `opacity 0→1` | `220ms` `.animate-fade-in` |
| `slide-up` | `opacity + translateY 8→0` | `260ms` `.animate-slide-up` |
| `slide-down` | `opacity + translateY -4→0` | `180ms` `.animate-slide-down` (dropdowns) |
| `ocean-spin-slow` | `rotate 0→360` | `20s linear infinite` (hero logo) |
| `ocean-float` | `translateY 0→-5 + rotate 3deg` | `4s ease-in-out infinite` (footer badge) |
| `ocean-pulse-glow` | `drop-shadow 4→16px + scale 1→1.05` | `3s ease-in-out infinite` |
| `ocean-breathe` | `scale 1→1.08 + opacity 0.9→1` | `2.5s ease-in-out infinite` |

All default transitions use `duration-150/200`, `cubic-bezier(0.16,1,0.3,1)`. Particles use **exponential spring** `dx*0.058` + `alpha 0.065/0.035` for buttery assembly without bounce.

### 9.2 Typewriter hooks `ShowcaseSections.tsx:7-117`

- Generic `useTypewriter(phrases, 42,22,3200)` cycles phrases with typing/deleting/pausing.
- `useHtmlBoilerplateTypewriter(30,4000)` streams 74-line HTML, newline delay `*3`, fast delete `-4 chars / 15ms`. Cursor is `2px w-1.15em bg-[#007acc]` pulsing.

### 9.3 Lenis `SmoothScroll.tsx`

- Imported as a client-only `Lenis` instance (SSR-guarded). Target is `window`, smoothing default. See (§8.3).

### 9.4 Reduced Motion `globals.css:232-237`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 10. Pages in Detail

### 10.1 Home — `src/app/page.tsx`

Sequence (all bands use `border-b hairline` + `transition-colors`):

1. **Hero** (`section pt-12 pb-20 sm:pt-16 sm:pb-24`) — described §8.4.
2. **Showcase** (`hidden lg:block`) — `ShowcaseSections` carousel §8.5.
3. **DualAudienceShowcase** — side-by-side CTA cards §8.6.
4. **Download Teaser** (`section pt-24 pb-32 sm:pb-36 bg-f5f0e8/dark-141413`) — centered `ToolboxIcon 52px` badge, `What could you do with Ocean Code?` 38→58px serif, `QuickInstallBar`.
5. **FooterWordmark** §8.8.

Metadata not set at root; title resolves from `layout.tsx:28` → `Ocean`.

### 10.2 Download — `src/app/download/page.tsx:53`

1. **Hero teaser** cloned from Home teaser (radial `bg-007acc/0.06 blur-[140px]` 700×500, floating 56px logo badge, 44→72px headline, `QuickInstallBar`).
2. **Platform Matrix** (`py-20 border-b`): intro eyebrow `12px mono 007acc tracking-[2px]`, 3-column `gap-8` cards (`rounded 16px bg-white/dark-1f1e1b shadow-sm hover:shadow-md`): Windows (`WindowsIcon`, `v3.2.0`, exe link, solid `bg-007acc`), macOS (Apple icon, Universal DMG, `bg-141413/white`), Linux (generic terminal icon, AppImage `bg-141413/white`).
3. **FooterWordmark**.

### 10.3 Contact — `src/app/contact/page.tsx:8` (client)

- Hero: badge `OceanLogo breathe` + `Get in touch…` 42→64px, warm copy, ambient radial 600×400.
- Main: `lg:grid-cols-12` form (7) + enterprise highlights (5) `py-16 sm:py-24`. Form card `rounded 24→28px bg-white/dark-1f1e1b shadow 16-20px` with controlled state (`name/email/company/teamSize/message`). On submit sets `submitted=true` → success state (`✓ emerald-500/15`, dynamic `Thank you… will contact at {email}` + `Send another message`). Inputs: `bg-faf9f5/dark-161513 border dcd4c6/33322d focus:border-007acc ring-1`. Features: 3 feature cards `rounded 16px bg-ede6d8/60/dark-201f1c` (Private Cloud, Custom Model, SOC-2) + mailto `oceancodecli@gmail.com`. Footer wordmark.

### 10.4 Docs — `src/app/docs/*`

Shell: `layout.tsx` wraps `Sidebar` + content container `ml-[248px] lg`. Content uses `.prose` styling §11. Inline `<pre><code>` gets copy & syntax via `CodeSyntaxEnhancer`. Docs pages are static MDX-like JSX (not yet sourced from filesystem).

---

## 11. Code & Prose Styling — `globals.css:239-477`

- `.prose` — `color: var(--body)`, `14px/1.68`. Headings all `color: ink` with hairline border on `h2`. Links `color: primary underline-offset-3 hover:opacity-0.8`. Inline `code`: `#efe7d9/c2410c` light → `#25221d/fb923c` dark, `12px 1.5px×5.5px border ded0bd/3d372f`.
- `<pre>` — `bg-f6f0e6/ #141311`, `border ded3c1/2b2823`, `radius 9px`, `pad 14×18`, `mono 12.5px/1.6`, `shadow 0 2px 10px`.
- **Token colors:**

| Token | Light | Dark |
|-------|-------|------|
| `cmd` | `#c2410c` bold | `#fb923c` |
| `subcmd` | `#0284c7` semibold | `#38bdf8` |
| `flag` | `#7c3aed` | `#c084fc` |
| `str` | `#15803d` | `#4ade80` |
| `env` | `#b45309` | `#fbbf24` |
| `comment` | `#8a8579` italic | `#827e74` |
| `url` | `#0d9488` underline | `#2dd4bf` |
| `num` | `#d97706` | `#f59e0b` |

- Tables `12.5px width 100% collapse`, `th bg-surface-soft border hairline`, `td border hairline-soft`; `blockquote` `2.5px left border primary` + `surface-card bg` italic; `hr hairline 28px my`.
- `HighlightedHtml` (`ShowcaseSections.tsx:129`) mirrors same scheme inline via Tailwind classes for the streaming HTML demo (doctype purple, tags `007acc/38bdf8`, attr names `b45309/fbbf24`, values `0f766e/5eead4`).

---

## 12. Theming & States

- **Activator:** `html.dark` class (set by blocking script `layout.tsx:40-55` and `ThemeProvider.tsx:29-42`). All tokens flip via `.dark` block; Tailwind uses `@custom-variant dark (&:where(.dark,.dark*))` (`globals.css:3`).
- **Toggle:** Circle button `w-8→9 h-9 rounded-full border e6dfd8/2e2d29` with Sun/Moon (`Navbar.tsx:109-115`). Persists to `localStorage "ocean-theme"`.
- **Focus:** `*:focus-visible {outline 2px solid var(--primary) offset 2px radius 8px}` (`globals.css:208`).
- **Selection:** `::selection bg-primary white` (`globals.css:155`), consistent across modes.
- **Scrollbars:** `thin 6px`, thumb `var(--hairline)` rounded-full, transparent track (`globals.css:188-205`).

---

## 13. Responsive & Accessibility

- **Breakpoints:** Tailwind defaults — `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Warm editorial → the mock & showcase **hide entirely at `< lg`** to keep the hero crisp; they are progressive enhancement, not required for conversion.
- **Motion safety:** Particles and typewriters run via `rAF`/`setTimeout` and auto-respect `prefers-reduced-motion` via global duration collapse.
- **Touch:** Dual cards use `onTouchStart` to trigger assembly; drawers use backdrop tap to close.
- **Keyboard:** `Esc` closes `CliInstallModal` (`ShowcaseSections.tsx:267-269`), focus rings on all controls, `aria-label/expanded/haspopup` on dropdown and mobile toggle.
- **Color contrast:** Ink on cream passes AA for 14-18px body; blue `#007acc` on cream passes for 12-14px bold labels; CTA `141413→faf9f5` passes AAA.
- **Copy fallback:** All clipboard writes guard with `navigator.clipboard` and degrade gracefully.

---

## 14. Assets & Icons

- `public/ocean-logo.png` — mask source (monochrome silhouette). Variants `ocean-logo-{light,dark,accent}.png` exist but only the base is referenced as mask.
- Inline SVGs (no icon library): `WindowsIcon` (4-palette tile), `AppleIcon`, `LinuxIcon`, `ExternalIcon`, `CheckIcon`, `ArrowRight`, `Sun/Moon`, `GitHubIcon` (`fillRule evenodd` full Octocat), `DownloadIcon`. Stroke widths are `1.8–2.4` for consistency.
- No web images beyond rasters; all illustrations are canvas/code.

---

## 15. Dependencies & Configuration

- `package.json:11-16`: `next 16.3.5`, `react 19.2.8`, `lenis 1.3.26`; dev: `tailwindcss 4`, `@tailwindcss/postcss 4`, `typescript 5`, `eslint 9` + `eslint-config-next`.
- `tsconfig.json`: path alias `@/* → src/*`.
- `postcss.config.mjs`: `@tailwindcss/postcss`.
- `eslint.config.mjs`: next/core-web-vitals.
- `next.config.ts`: `output export` + `images.unoptimized`.
- `globals.css:1-3`: `@import tailwindcss`, custom dark variant.
- Declared fonts in `next/font/google` with CSS variables `(--font-serif / sans / mono)` mapped to Tailwind via `@theme inline`.

---

## 16. Design QA & Next Steps

**Verified current behaviors:**
- Dark mode persists and avoids FOUC via blocking script (`layout.tsx:40-55`).
- Clipboard copies for both `QuickInstallBar` and `ShowcaseSections CliInstallModal` use identical `irm https://ocean.ai/install.ps1 | iex`.
- Particle canvases are DPR-clamped to `min(dpr,2)` and observed with `ResizeObserver`.
- Download links are hardcoded GitHub release URLs — update when release tag changes.

**Suggested future refinements (not yet implemented):**
- Replace hardcoded release URLs with environment variable / fetch from GitHub API at build.
- Wire Contact form to an actual endpoint (currently in-memory `submitted` state only, `contact/page.tsx:18-21`).
- Extract the repeated `ORANGE_PALETTE` (really Ocean blue) into a shared `tokens.ts`.
- Add `Skip to content` link for a11y, and `prefers-reduced-motion` guard inside canvas `requestAnimationFrame` loops.
- Consider `next/content-collections` for docs so MDX can be authored without duplicating prose in JSX.

---

*This document is derived from live source on disk. Cross-check token values against `src/app/globals.css:5-122` before changing any color, type, or elevation decision.*
