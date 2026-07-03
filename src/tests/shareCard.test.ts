// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { drawEndingShareCard, createEndingShareImage } from '../systems/shareCardSystem';
import type { EndingPostmortem } from '../systems/endingPostmortemSystem';

function postmortem(): EndingPostmortem {
  return {
    title: '技术路结局：AI协作架构师',
    summary: '你把 AI 当作协作层，设计人与模型共同承担交付。',
    category: 'success',
    categoryLabel: '成功复盘',
    shareHash: 'a1b2c3',
    timeline: [
      { id: '1', month: 36, title: '现金流压力', text: '关键压力曾经越过警戒线。' }
    ],
    rootCauses: [
      '本局的关键不是单点爆发，而是把能力、现金流和恢复节奏维持到了可复制状态。',
      '能力成长形成了足够护城河。'
    ],
    impact: [
      { label: '生存时长', value: '276月', tone: 'good' },
      { label: '最终现金', value: '360万', tone: 'good' },
      { label: '技术/AI', value: '90/82', tone: 'good' },
      { label: '健康/精神', value: '76/73', tone: 'neutral' }
    ],
    actionItems: ['把本局可复制路径记下来。']
  };
}

function fakeCanvas() {
  const calls: string[] = [];
  const context = {
    fillStyle: '',
    font: '',
    globalAlpha: 1,
    lineWidth: 1,
    strokeStyle: '',
    textBaseline: '',
    beginPath: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn((text: string) => calls.push(text)),
    lineTo: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 14 })),
    moveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    rect: vi.fn(),
    stroke: vi.fn(),
    strokeRect: vi.fn()
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => context),
    toDataURL: vi.fn(() => 'data:image/png;base64,card')
  };
  return { calls, canvas: canvas as unknown as HTMLCanvasElement };
}

describe('share card system', () => {
  it('draws a terminal-style ending card with core postmortem text', () => {
    const { calls, canvas } = fakeCanvas();

    drawEndingShareCard(canvas, postmortem());

    expect(canvas.width).toBe(1080);
    expect(canvas.height).toBe(1440);
    expect(calls.join('\n')).toContain('程序员人生模拟器');
    expect(calls.join('\n')).toContain('技术路结局：AI协作架构师');
    expect(calls.join('\n')).toContain('成功复盘');
    expect(calls.join('\n')).toContain('#a1b2c3');
    expect(calls.join('\n')).toContain('最终现金');
  });

  it('creates a png data url without external dependencies', () => {
    const { canvas } = fakeCanvas();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') return canvas;
      return originalCreateElement(tagName);
    });

    expect(createEndingShareImage(postmortem())).toBe('data:image/png;base64,card');
  });
});
