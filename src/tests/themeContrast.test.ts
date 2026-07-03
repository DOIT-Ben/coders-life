import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// 主题对比度守卫：改配色令牌时自动校验 WCAG 对比度，防止"看不清"回归。
const appCss = readFileSync(new URL('../styles/app.css', import.meta.url), 'utf8');

function token(name: string): string {
  const match = appCss.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!match) throw new Error(`app.css :root 缺少令牌 --${name}`);
  return match[1];
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

describe('theme contrast guard', () => {
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

  it.each(pairs)('--%s on --%s ≥ %s (%s)', (fg, bg, min) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(min);
  });
});
