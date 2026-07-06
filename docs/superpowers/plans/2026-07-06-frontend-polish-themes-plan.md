# Frontend Polish Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real `终端黑 / 极简白 / 纯黑` theme switching, stabilize modal/action scrolling, and close evidence-backed frontend wiring gaps without changing core game formulas.

**Architecture:** Theme state lives in a small React-owned path and writes `document.documentElement.dataset.theme`; CSS continues to use semantic tokens, with `[data-theme="paper"]` and `[data-theme="blackout"]` overriding values. Modal and action-scroll fixes are structural CSS and small shell/component adjustments backed by Vitest contract and wiring tests.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest/jsdom, CSS custom properties. No new runtime dependency.

## Global Constraints

- Keep every user-facing string Chinese and productized.
- Do not statically import `saveManager` or `config/events` into the first screen.
- Theme changes must use semantic CSS tokens; new component code must not introduce naked color literals.
- Do not place the feedback entry inside game action controls.
- Do not rewrite core game formulas or ending rules for this frontend pass.
- Preserve existing V1-style layout and mobile layout while improving theme and scroll stability.
- Run verification: `npm test`, `npm run build`, `npm run simulate`, `npm run simulate:batch`, `git diff --check`.

---

## File Structure

- Modify `src/App.tsx`: own lightweight theme state, set `data-theme`, render theme switch in title chrome, persist `coderslife_theme`.
- Modify `src/styles/app.css`: define complete base tokens, add `paper` and `blackout` token overrides, normalize modal/action scroll layout, remove hardcoded theme-only values where touched.
- Modify `src/components/dialogs/ModalShell.tsx`: keep the semantic shell and make actions/footer easier to style as a fixed footer.
- Modify `src/components/GameContainer.tsx`: only if needed to expose visible disabled-action reasons or stable class hooks; no engine changes.
- Modify `src/components/GameDialogs.tsx`: remove inline visual styles in bookmark rows if they block theme consistency.
- Modify `src/tests/themeContrast.test.ts`: parse token blocks and validate all themes plus missing CSS variables.
- Modify `src/tests/monthlyPlanUi.test.tsx`: add theme switch, modal, shop, action-list wiring checks.
- Modify `src/tests/v1FrontendContract.test.ts`: update structural string checks for the new modal and action scroll contract.
- Optional modify `workbench/readme.md` and `docs/dev-records/2026-07-06-frontend-polish-themes.md` after implementation verification.

---

### Task 1: Theme State And Switcher

**Files:**
- Modify: `src/App.tsx`
- Test: `src/tests/monthlyPlanUi.test.tsx`

**Interfaces:**
- Produces: `type ThemeId = 'terminal' | 'paper' | 'blackout'`
- Produces: `const THEME_OPTIONS: Array<{ id: ThemeId; label: string }>`
- Produces: `localStorage` key `coderslife_theme`
- Produces DOM contract: `<div className="theme-switch" role="group" aria-label="界面主题">`

- [ ] **Step 1: Write failing UI test for theme switching**

Add this test to `src/tests/monthlyPlanUi.test.tsx`:

```tsx
  it('switches between terminal, paper, and blackout themes and persists the choice', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<App />);
    });

    expect(document.documentElement.dataset.theme).toBe('terminal');
    expect(document.body.textContent).toContain('终端黑');
    expect(document.body.textContent).toContain('极简白');
    expect(document.body.textContent).toContain('纯黑');

    await act(async () => {
      click(buttonByText('极简白'));
    });

    expect(document.documentElement.dataset.theme).toBe('paper');
    expect(localStorage.getItem('coderslife_theme')).toBe('paper');

    await act(async () => {
      click(buttonByText('纯黑'));
    });

    expect(document.documentElement.dataset.theme).toBe('blackout');
    expect(localStorage.getItem('coderslife_theme')).toBe('blackout');

    await act(async () => {
      root.unmount();
    });

    const secondContainer = document.createElement('div');
    document.body.appendChild(secondContainer);
    const secondRoot = createRoot(secondContainer);
    await act(async () => {
      secondRoot.render(<App />);
    });

    expect(document.documentElement.dataset.theme).toBe('blackout');

    await act(async () => {
      secondRoot.unmount();
    });
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/tests/monthlyPlanUi.test.tsx
```

Expected: fail because theme buttons/text and `data-theme` are not implemented.

- [ ] **Step 3: Implement theme state in `src/App.tsx`**

Add near the top of `src/App.tsx`:

```tsx
type ThemeId = 'terminal' | 'paper' | 'blackout';

const THEME_STORAGE_KEY = 'coderslife_theme';
const THEME_OPTIONS: Array<{ id: ThemeId; label: string }> = [
  { id: 'terminal', label: '终端黑' },
  { id: 'paper', label: '极简白' },
  { id: 'blackout', label: '纯黑' }
];

function readStoredTheme(): ThemeId {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_OPTIONS.some(option => option.id === value) ? value as ThemeId : 'terminal';
  } catch {
    return 'terminal';
  }
}
```

Inside `App()`, add:

```tsx
  const [theme, setTheme] = useState<ThemeId>(() => readStoredTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'paper' ? 'light' : 'dark';
    const themeColor = window.getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // 本地存储不可用时只影响偏好记忆，不影响游戏。
    }
  }, [theme]);
```

Pass props to `TitleCard`:

```tsx
      <TitleCard hasSave={hasSave} inGame={inGame} onContinue={continueGame} theme={theme} setTheme={setTheme} />
```

Update `TitleCard` signature and render the switch inside `.term-bar`:

```tsx
function TitleCard({
  hasSave,
  inGame,
  onContinue,
  theme,
  setTheme
}: {
  hasSave: boolean;
  inGame: boolean;
  onContinue: () => void;
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}) {
  return (
    <div className={inGame ? 'title-card in-game' : 'title-card'}>
      <div className="term-bar" aria-hidden="false">
        <span className="term-dot red" aria-hidden="true" /><span className="term-dot amber" aria-hidden="true" /><span className="term-dot green" aria-hidden="true" />
        <span className="term-title">coder@life: ~/{inGame ? '本局人生' : '选择出身'}</span>
        <div className="theme-switch" role="group" aria-label="界面主题">
          {THEME_OPTIONS.map(option => (
            <button
              aria-pressed={theme === option.id}
              className={theme === option.id ? 'theme-option active' : 'theme-option'}
              key={option.id}
              onClick={() => setTheme(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {import.meta.env.DEV ? <div className="bugs-tag">{DEV_BADGE_TEXT}</div> : null}
      <h1 className="t-main"><span className="t-prompt">❯</span>程序员生存模拟器<span className="cursor-blink">▌</span></h1>
      <p className="t-sub">在 AI 协作时代，选择你的节奏和边界</p>
      {!inGame && <div className="t-notice">可继续上次生存，也可直接选择职业开始新局</div>}
      {!inGame && hasSave && <><br /><button className="btn-continue" onClick={onContinue} onMouseEnter={preload}>继续上次生存</button></>}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- src/tests/monthlyPlanUi.test.tsx
```

Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/tests/monthlyPlanUi.test.tsx
git commit -m "feat: 接入界面主题切换 | v0.1.0 | 2026-07-06"
```

---

### Task 2: Theme Tokens And CSS Variable Guard

**Files:**
- Modify: `src/styles/app.css`
- Modify: `src/tests/themeContrast.test.ts`

**Interfaces:**
- Consumes: `data-theme="paper"` and `data-theme="blackout"` from Task 1
- Produces: complete token set including `--accent-soft`, `--overlay`, `--focus-ring`

- [ ] **Step 1: Write failing CSS variable guard**

Replace `src/tests/themeContrast.test.ts` with a parser that keeps existing contrast behavior and adds missing-token checks:

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const appCss = readFileSync(new URL('../styles/app.css', import.meta.url), 'utf8');

const themeSelectors = {
  terminal: ':root',
  paper: '[data-theme="paper"]',
  blackout: '[data-theme="blackout"]'
} as const;

type ThemeName = keyof typeof themeSelectors;

function blockFor(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = appCss.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'));
  if (!match) throw new Error(`app.css 缺少主题块 ${selector}`);
  return match[1];
}

function tokenMap(theme: ThemeName): Map<string, string> {
  const base = blockFor(':root');
  const override = theme === 'terminal' ? '' : blockFor(themeSelectors[theme]);
  const map = new Map<string, string>();
  for (const block of [base, override]) {
    for (const match of block.matchAll(/--([a-zA-Z0-9_-]+):\\s*([^;]+);/g)) {
      map.set(match[1], match[2].trim());
    }
  }
  return map;
}

function resolveToken(theme: ThemeName, name: string, seen = new Set<string>()): string {
  const map = tokenMap(theme);
  const value = map.get(name);
  if (!value) throw new Error(`主题 ${theme} 缺少令牌 --${name}`);
  const ref = value.match(/^var\\(--([a-zA-Z0-9_-]+)\\)$/);
  if (!ref) return value;
  if (seen.has(name)) throw new Error(`主题 ${theme} 令牌 --${name} 循环引用`);
  seen.add(name);
  return resolveToken(theme, ref[1], seen);
}

function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4]
    .map(i => parseInt(value.slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

describe('theme token guard', () => {
  it('defines every CSS variable reference in every theme', () => {
    const referenced = Array.from(appCss.matchAll(/var\\(--([a-zA-Z0-9_-]+)\\)/g)).map(match => match[1]);
    for (const theme of Object.keys(themeSelectors) as ThemeName[]) {
      const map = tokenMap(theme);
      for (const name of referenced) {
        expect(map.has(name), `${theme} should define --${name}`).toBe(true);
      }
    }
  });

  const pairs: Array<[fg: string, bg: string, min: number, why: string]> = [
    ['text', 'card', 7, '正文'],
    ['text', 'bg', 7, '正文/页面底'],
    ['text2', 'card', 4.5, '次级文本'],
    ['text2', 'surface2', 4.5, '次级文本/浮起面板'],
    ['text3', 'card', 4.5, '辅助小字'],
    ['text3', 'surface2', 4.5, '辅助小字/浮起面板'],
    ['primary', 'card', 4.5, '链接与主色文本'],
    ['accent-h', 'good-soft', 4.5, '正向标签'],
    ['danger-h', 'danger-soft', 4.5, '负向标签'],
    ['warn-h', 'warn-soft', 4.5, '警示标签'],
    ['on-accent', 'primary', 4.5, '主按钮文字'],
    ['on-accent', 'accent', 4.5, '正向按钮文字'],
    ['on-accent', 'danger', 4.5, '危险按钮文字']
  ];

  it.each(Object.keys(themeSelectors) as ThemeName[])('%s key token contrast meets WCAG guard', theme => {
    for (const [fg, bg, min, why] of pairs) {
      expect(contrast(resolveToken(theme, fg), resolveToken(theme, bg)), `${theme}: ${why}`).toBeGreaterThanOrEqual(min);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/tests/themeContrast.test.ts
```

Expected: fail because `paper`, `blackout`, and `--accent-soft` do not exist.

- [ ] **Step 3: Implement theme token blocks**

In `src/styles/app.css`, add `--surface`, `--accent-soft`, `--overlay`, `--focus-ring`, and theme overrides. The base `:root` remains terminal:

```css
:root {
  color-scheme: dark;
  --bg:       #0E1116;
  --card:     #151B23;
  --surface:  #111720;
  --surface2: #1B232E;
  --track:    #232E3B;
  --border:   #253040;
  --border2:  #35435A;
  --font-mono: "JetBrains Mono", "Cascadia Code", "SF Mono", Consolas, "Liberation Mono", "PingFang SC", "Microsoft YaHei", monospace;
  --primary:       #58A6FF;
  --primary-h:     #79B8FF;
  --primary-soft:  #14283F;
  --accent:        #3FB950;
  --accent-h:      #56D364;
  --accent-soft:   #16281B;
  --good-soft:     var(--accent-soft);
  --warn:          #D29922;
  --warn-h:        #E3B341;
  --warn-soft:     #2A2413;
  --amber:         var(--warn);
  --danger:        #F47067;
  --danger-h:      #FF7B72;
  --danger-soft:   #351B1E;
  --danger-border: #5C3237;
  --red:           var(--danger);
  --gold:          #E3B341;
  --on-accent:     #0B0F14;
  --avatar-bg:     #F6EFE4;
  --teal:     #39D2C0;
  --sky:      #58A6FF;
  --mint:     #56D364;
  --purple:   #B392F0;
  --text:     #D6DEE8;
  --text2:    #93A1B3;
  --text3:    #8593AA;
  --r:        10px;
  --overlay: rgba(0,0,0,.38);
  --focus-ring: rgba(88,166,255,.22);
  --shadow:   0 2px 10px rgba(0,0,0,.35);
  --shadow-md: 0 6px 20px rgba(0,0,0,.5);
}

[data-theme="paper"] {
  color-scheme: light;
  --bg:       #F7F8FA;
  --card:     #FFFFFF;
  --surface:  #FBFCFE;
  --surface2: #EEF2F7;
  --track:    #D8E0EA;
  --border:   #C8D2DE;
  --border2:  #9BAABE;
  --primary:       #075FB8;
  --primary-h:     #044A91;
  --primary-soft:  #E6F0FA;
  --accent:        #167A35;
  --accent-h:      #0B5F28;
  --accent-soft:   #E4F5E9;
  --good-soft:     var(--accent-soft);
  --warn:          #8A5A00;
  --warn-h:        #684300;
  --warn-soft:     #FFF1CC;
  --danger:        #B42318;
  --danger-h:      #8F1D16;
  --danger-soft:   #FDE8E6;
  --danger-border: #E3A19C;
  --gold:          #8A5A00;
  --on-accent:     #FFFFFF;
  --avatar-bg:     #F2E8DA;
  --teal:     #00796B;
  --sky:      #075FB8;
  --mint:     #167A35;
  --purple:   #6741A5;
  --text:     #151A22;
  --text2:    #3C4656;
  --text3:    #566274;
  --overlay: rgba(15,23,42,.28);
  --focus-ring: rgba(7,95,184,.24);
  --shadow:   0 2px 10px rgba(15,23,42,.10);
  --shadow-md: 0 12px 30px rgba(15,23,42,.16);
}

[data-theme="blackout"] {
  color-scheme: dark;
  --bg:       #000000;
  --card:     #050505;
  --surface:  #080808;
  --surface2: #111111;
  --track:    #1E1E1E;
  --border:   #2A2A2A;
  --border2:  #464646;
  --primary:       #7AB7FF;
  --primary-h:     #A8D1FF;
  --primary-soft:  #071A2E;
  --accent:        #52D273;
  --accent-h:      #7AF09A;
  --accent-soft:   #061F0D;
  --good-soft:     var(--accent-soft);
  --warn:          #E0B84C;
  --warn-h:        #F2D06F;
  --warn-soft:     #251C05;
  --danger:        #FF7D75;
  --danger-h:      #FFA39E;
  --danger-soft:   #2A0808;
  --danger-border: #6E2B2B;
  --gold:          #F2D06F;
  --on-accent:     #000000;
  --avatar-bg:     #F6EFE4;
  --teal:     #5EEAD4;
  --sky:      #7AB7FF;
  --mint:     #7AF09A;
  --purple:   #C4B5FD;
  --text:     #F5F7FA;
  --text2:    #C5CCD6;
  --text3:    #A7B0BE;
  --overlay: rgba(0,0,0,.72);
  --focus-ring: rgba(122,183,255,.30);
  --shadow:   0 2px 10px rgba(0,0,0,.72);
  --shadow-md: 0 10px 34px rgba(0,0,0,.82);
}
```

Replace touched raw color usages with tokens:

```css
body {
  background: var(--bg);
}

.modal-overlay {
  background: var(--overlay);
}

.feedback-textarea:focus,
.life-script-input:focus {
  outline: 2px solid var(--focus-ring);
}

.term-close {
  background: var(--surface);
}
```

- [ ] **Step 4: Style the theme switch**

Add CSS:

```css
.theme-switch {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--card);
  padding: 3px;
}

.theme-option {
  min-height: 32px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--text2);
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
}

.theme-option:hover,
.theme-option:focus-visible {
  border-color: var(--primary);
  color: var(--primary);
}

.theme-option.active {
  background: var(--primary);
  color: var(--on-accent);
}

@media (max-width: 660px) {
  .term-bar {
    flex-wrap: wrap;
  }
  .theme-switch {
    order: 2;
    width: 100%;
    justify-content: stretch;
    margin-left: 0;
  }
  .theme-option {
    flex: 1;
    min-height: 44px;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
npm test -- src/tests/themeContrast.test.ts src/tests/monthlyPlanUi.test.tsx
```

Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add src/styles/app.css src/tests/themeContrast.test.ts
git commit -m "feat: 补齐三套主题令牌 | v0.1.0 | 2026-07-06"
```

---

### Task 3: Modal Scroll Contract

**Files:**
- Modify: `src/styles/app.css`
- Modify: `src/components/dialogs/ModalShell.tsx`
- Test: `src/tests/v1FrontendContract.test.ts`
- Test: `src/tests/monthlyPlanUi.test.tsx`

**Interfaces:**
- Consumes: existing `ModalShell({ actions, children, close, title, wide })`
- Produces CSS contract: `.modal-head` fixed, `.modal-scroll` flex scroll, `.modal-actions` fixed

- [ ] **Step 1: Write failing contract assertions**

In `src/tests/v1FrontendContract.test.ts`, update the scroll test to assert these strings:

```ts
  it('keeps modal chrome fixed and modal content scrollable inside the viewport', () => {
    expect(dialogSource).toContain('function ModalShell');
    expect(dialogSource).toContain('className="modal-body-slot"');
    expect(appCss).toContain('.modal {');
    expect(appCss).toContain('max-height: min(720px, calc(100dvh - 32px));');
    expect(appCss).toContain('.modal-head {\n  flex: 0 0 auto;');
    expect(appCss).toContain('.modal-body-slot {\n  flex: 1 1 auto;');
    expect(appCss).toContain('.modal-scroll {\n  min-height: 0;\n  overflow-y: auto;');
    expect(appCss).toContain('.modal-actions {\n  flex: 0 0 auto;');
    expect(appCss).toContain('.shop-list');
    expect(appCss).toContain('overflow-y: auto');
  });
```

- [ ] **Step 2: Write failing UI test for shop modal structure**

Add to `src/tests/monthlyPlanUi.test.tsx`:

```tsx
  it('keeps shop modal close control outside the scroll region while the item list scrolls', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<App />);
    });

    await act(async () => {
      click(buttonByText('开始生存'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('第 0 天');
    }, { timeout: 5000 });

    await act(async () => {
      click(buttonByText('商店'));
    });

    const modal = document.querySelector('.modal');
    const head = document.querySelector('.modal-head');
    const bodySlot = document.querySelector('.modal-body-slot');
    const scroll = document.querySelector('.modal-scroll.shop-list');
    const close = document.querySelector('button[aria-label="关闭补给商店"]');
    expect(modal).not.toBeNull();
    expect(head).not.toBeNull();
    expect(bodySlot).not.toBeNull();
    expect(scroll).not.toBeNull();
    expect(close).not.toBeNull();
    expect(scroll?.contains(close)).toBe(false);

    await act(async () => {
      root.unmount();
    });
  });
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```bash
npm test -- src/tests/v1FrontendContract.test.ts src/tests/monthlyPlanUi.test.tsx
```

Expected: fail because `.modal-body-slot` is not present yet.

- [ ] **Step 4: Update `ModalShell` wrapper**

Change `src/components/dialogs/ModalShell.tsx` render body to:

```tsx
        <div className="modal-head">
          <div className="modal-title" id={titleId}>{title}</div>
          {close ? <button aria-label={`关闭${title}`} onClick={close} type="button">×</button> : null}
        </div>
        <div className="modal-body-slot">
          {children}
        </div>
        {actions ? <div className="modal-actions-slot">{actions}</div> : null}
```

Keep `actions` content itself unchanged so existing dialogs that pass `.modal-actions` still work.

- [ ] **Step 5: Update modal CSS**

In `src/styles/app.css`, update:

```css
.modal {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 14px; padding: 20px;
  max-width: 420px; width: 100%;
  max-height: min(720px, calc(100dvh - 32px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.modal-head {
  flex: 0 0 auto;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 12px;
  margin-bottom:12px;
}

.modal-body-slot {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.modal-scroll {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: var(--track) transparent;
}

.modal-actions-slot {
  flex: 0 0 auto;
  padding-top: 12px;
}

.modal-actions {
  flex: 0 0 auto;
  display: flex;
  gap: 8px;
}
```

Normalize content scroll classes:

```css
.shop-list,
.feedback-scroll,
.life-script-scroll,
.ending-postmortem {
  flex: 1 1 auto;
  min-height: 0;
  max-height: none;
  overflow-y: auto;
}
```

Keep narrow mobile:

```css
@media (max-width: 660px) {
  .modal {
    padding: 14px;
    max-height: calc(100dvh - 20px);
  }
}
```

- [ ] **Step 6: Run tests to verify pass**

Run:

```bash
npm test -- src/tests/v1FrontendContract.test.ts src/tests/monthlyPlanUi.test.tsx
```

Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/dialogs/ModalShell.tsx src/styles/app.css src/tests/v1FrontendContract.test.ts src/tests/monthlyPlanUi.test.tsx
git commit -m "fix: 稳定弹窗滚动边界 | v0.1.0 | 2026-07-06"
```

---

### Task 4: Action Panel Scroll And Frontend Wiring Feedback

**Files:**
- Modify: `src/styles/app.css`
- Modify: `src/components/GameContainer.tsx`
- Test: `src/tests/v1FrontendContract.test.ts`
- Test: `src/tests/monthlyPlanUi.test.tsx`

**Interfaces:**
- Produces CSS contract: `.action-list` remains the primary scroll region; `.action-support-scroll` has a bounded max height.
- Produces user feedback: disabled action cards still show a reason in `.act-reason`.

- [ ] **Step 1: Write failing contract assertions for bounded action support**

In `src/tests/v1FrontendContract.test.ts`, extend the action-list scroll test:

```ts
    expect(appCss).toContain('.action-list');
    expect(appCss).toContain('flex: 1 1 auto;');
    expect(appCss).toContain('overflow-y: auto');
    expect(appCss).toContain('.action-support-scroll');
    expect(appCss).toContain('max-height: min(22dvh, 180px);');
```

- [ ] **Step 2: Write UI test for disabled action reason**

Add to `src/tests/monthlyPlanUi.test.tsx`:

```tsx
  it('shows a Chinese reason on disabled action cards instead of silently blocking them', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<App />);
    });

    await act(async () => {
      click(buttonByText('开始生存'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('第 0 天');
    }, { timeout: 5000 });

    await act(async () => {
      click(buttonByText('职业机会'));
    });

    const disabledReason = document.querySelector('.action-btn.disabled .act-reason');
    expect(disabledReason?.textContent).toMatch(/当前条件不足|作品集|面试|offer|在职|现金|技术|AI|冷却|请先处理当前事件/);

    await act(async () => {
      root.unmount();
    });
  });
```

- [ ] **Step 3: Run tests to verify contract failure**

Run:

```bash
npm test -- src/tests/v1FrontendContract.test.ts src/tests/monthlyPlanUi.test.tsx
```

Expected: contract fails until bounded support CSS is added. UI reason may already pass; if it does, keep it as regression coverage.

- [ ] **Step 4: Update action panel CSS**

In `src/styles/app.css`, ensure:

```css
.right-col {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: min(72dvh, 680px);
  overflow: hidden;
}

.action-card {
  min-height: 0;
  height: 100%;
}

.action-tabs {
  flex: 0 0 auto;
  max-height: min(24dvh, 140px);
}

.action-list {
  min-height: 160px;
  flex: 1 1 auto;
  overflow-y: auto;
}

.action-support-scroll {
  flex: 0 0 auto;
  max-height: min(22dvh, 180px);
  overflow-y: auto;
}
```

For mobile:

```css
@media (max-width: 660px) {
  .right-col {
    height: min(76dvh, 720px);
    min-height: 420px;
  }
  .action-support-scroll {
    max-height: 150px;
  }
}
```

- [ ] **Step 5: Run tests to verify pass**

Run:

```bash
npm test -- src/tests/v1FrontendContract.test.ts src/tests/monthlyPlanUi.test.tsx
```

Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add src/styles/app.css src/tests/v1FrontendContract.test.ts src/tests/monthlyPlanUi.test.tsx
git commit -m "fix: 稳定行动列表滚动区域 | v0.1.0 | 2026-07-06"
```

---

### Task 5: Remove Inline Theme Leaks And Polish Visual Consistency

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/GameDialogs.tsx`
- Modify: `src/components/ErrorBoundary.tsx`
- Modify: `src/styles/app.css`
- Test: `src/tests/v1FrontendContract.test.ts`

**Interfaces:**
- Consumes: existing class hooks
- Produces class hooks: `.loading-screen`, `.loading-copy`, `.loading-hint`, `.bookmark-icon`, `.chip-spacer`

- [ ] **Step 1: Write failing contract against inline style leaks in touched components**

Add to `src/tests/v1FrontendContract.test.ts`:

```ts
  it('keeps common visible UI styling in CSS classes instead of inline theme leaks', () => {
    expect(appSource).not.toContain('style={{ display: \\'flex\\', flexDirection: \\'column\\'');
    expect(gameDialogsSource).not.toContain('style={{ marginRight: 8 }}');
    expect(gameDialogsSource).not.toContain('style={{ marginTop: 4 }}');
    expect(appCss).toContain('.loading-screen');
    expect(appCss).toContain('.bookmark-icon');
    expect(appCss).toContain('.chip-spacer');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/tests/v1FrontendContract.test.ts
```

Expected: fail because inline styles are present.

- [ ] **Step 3: Replace loading inline styles**

In `src/App.tsx`, change `LoadingScreen` to:

```tsx
function LoadingScreen() {
  return (
    <div className="screen active loading-screen">
      <div className="loading-spinner" />
      <div className="loading-copy">加载游戏引擎中</div>
      <div className="loading-hint">首次加载约需 2-5 秒</div>
    </div>
  );
}
```

In `src/components/ErrorBoundary.tsx`, replace inline shell with classes:

```tsx
      <div className="screen active error-screen">
        <div className="error-title">这段人生遇到了意外中断</div>
        <div className="error-copy">
          请刷新页面重新进入；如果反复出现，可以提交反馈并附上最近操作。
        </div>
      </div>
```

- [ ] **Step 4: Replace bookmark inline styles**

In `src/components/GameDialogs.tsx`, replace:

```tsx
<span style={{ marginRight: 8 }}>{action.icon}</span>
<div className="act-chips" style={{ marginTop: 4 }}>{renderEffectChips(action.visibleEffect)}</div>
```

with:

```tsx
<span className="bookmark-icon">{action.icon}</span>
<div className="act-chips chip-spacer">{renderEffectChips(action.visibleEffect)}</div>
```

- [ ] **Step 5: Add CSS classes**

In `src/styles/app.css`:

```css
.loading-screen,
.error-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: 16px;
  text-align: center;
}

.loading-copy,
.error-copy {
  color: var(--text2);
  font-size: 13px;
  font-weight: 650;
  line-height: 1.6;
  max-width: 420px;
}

.loading-copy {
  font-size: 14px;
  font-weight: 700;
}

.loading-hint {
  color: var(--text3);
  font-size: 11px;
}

.error-title {
  color: var(--text);
  font-size: 16px;
  font-weight: 800;
}

.bookmark-icon {
  margin-right: 8px;
}

.chip-spacer {
  margin-top: 4px;
}
```

- [ ] **Step 6: Run test to verify pass**

Run:

```bash
npm test -- src/tests/v1FrontendContract.test.ts
```

Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/components/ErrorBoundary.tsx src/components/GameDialogs.tsx src/styles/app.css src/tests/v1FrontendContract.test.ts
git commit -m "refactor: 收敛前端可见样式到令牌 | v0.1.0 | 2026-07-06"
```

---

### Task 6: Full Verification And Documentation

**Files:**
- Create: `docs/dev-records/2026-07-06-frontend-polish-themes.md`
- Modify: `workbench/readme.md`

**Interfaces:**
- Consumes all previous tasks
- Produces final verification record

- [ ] **Step 1: Run full verification**

Run:

```bash
npm test
npm run build
npm run simulate
npm run simulate:batch
git diff --check
```

Expected:

- `npm test`: all tests pass.
- `npm run build`: Vite build succeeds.
- `npm run simulate`: completes without runtime error.
- `npm run simulate:batch`: release gate passes.
- `git diff --check`: no whitespace errors.

- [ ] **Step 2: If a command fails, stop and debug**

Use `superpowers:systematic-debugging`. Do not delete tests, loosen assertions, or skip simulation. Record the failing command, root cause, and fix in the dev record.

- [ ] **Step 3: Write dev record**

Create `docs/dev-records/2026-07-06-frontend-polish-themes.md`:

```md
# 前端主题润色执行记录

- 日期：2026-07-06
- 分支：feat/v6-frontend-polish-themes
- 规格：docs/superpowers/specs/2026-07-06-frontend-polish-themes-design.md
- 计划：docs/superpowers/plans/2026-07-06-frontend-polish-themes-plan.md

## 完成内容

- 新增终端黑、极简白、纯黑三套主题和持久化切换入口。
- 补齐主题 token 与 CSS 变量守卫，修复缺失的 --accent-soft。
- 统一弹窗固定头部、内容滚动、底部操作布局。
- 稳定右侧行动列表主滚动区域，避免分类和辅助信息挤压列表。
- 增加主题、弹窗、行动区和前端接线回归测试。

## 验证结果

- npm test：记录命令退出码、测试文件数量和通过数量
- npm run build：记录命令退出码和 Vite build 成功摘要
- npm run simulate：记录命令退出码和终局摘要
- npm run simulate:batch：记录命令退出码和 release gate 摘要
- git diff --check：记录命令退出码；通过时写“无空白错误”

## 风险

- 本环境未内置系统浏览器时，390/768/1280 真视口检查需要部署前人工完成。
- 主题切换仅影响前端表现层，不改变存档结构。
```

Create the dev record only after Step 1 has produced real command output, and write the concrete results from that output.

- [ ] **Step 4: Update workbench**

Update `workbench/readme.md` current status with:

```md
- 前端主题：已接入终端黑、极简白、纯黑三套 token 主题，主题偏好写入本地存储。
- 前端可用性：弹窗头部/操作区固定、内容内部滚动；右侧行动列表保持主滚动区域。
```

- [ ] **Step 5: Commit**

```bash
git add docs/dev-records/2026-07-06-frontend-polish-themes.md workbench/readme.md
git commit -m "docs: 记录前端主题润色验证 | v0.1.0 | 2026-07-06"
```

- [ ] **Step 6: Final status**

Run:

```bash
git status --short --branch
git log --oneline --max-count=8
```

Expected: only intentional branch commits, no unstaged changes.

---

## Self-Review

- Spec coverage: Tasks 1-2 cover theme switching, pure white/pure black, token completion, and contrast. Task 3 covers modal scrolling. Task 4 covers action-list scrolling and disabled-reason wiring. Task 5 covers visual consistency. Task 6 covers full verification and records.
- Red-flag scan: no unresolved template text remains in executable tasks; verification documentation is created only after real command output exists.
- Type consistency: `ThemeId`, `THEME_OPTIONS`, and `coderslife_theme` are defined in Task 1 and consumed by CSS/tests. Modal/action CSS class names are defined before later assertions rely on them.
