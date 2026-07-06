import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// 主题守卫：改配色令牌时自动校验变量完整性与 WCAG 对比度，防止"看不清"和未定义 token 回归。
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
    for (const match of block.matchAll(/--([a-zA-Z0-9_-]+):\s*([^;]+);/g)) {
      map.set(match[1], match[2].trim());
    }
  }
  return map;
}

function resolveToken(theme: ThemeName, name: string, seen = new Set<string>()): string {
  const map = tokenMap(theme);
  const value = map.get(name);
  if (!value) throw new Error(`主题 ${theme} 缺少令牌 --${name}`);
  const ref = value.match(/^var\(--([a-zA-Z0-9_-]+)\)$/);
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
  it('defines every CSS variable reference somewhere in app.css', () => {
    const referenced = Array.from(appCss.matchAll(/var\(--([a-zA-Z0-9_-]+)\)/g)).map(match => match[1]);
    const defined = new Set(Array.from(appCss.matchAll(/--([a-zA-Z0-9_-]+):/g)).map(match => match[1]));
    for (const name of referenced) {
      expect(defined.has(name), `app.css should define --${name}`).toBe(true);
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
