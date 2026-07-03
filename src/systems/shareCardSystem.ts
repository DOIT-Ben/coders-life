import type { EndingPostmortem } from './endingPostmortemSystem';

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;
const PADDING = 72;

export function createEndingShareImage(postmortem: EndingPostmortem): string {
  const canvas = document.createElement('canvas');
  drawEndingShareCard(canvas, postmortem);
  return canvas.toDataURL('image/png');
}

export function drawEndingShareCard(canvas: HTMLCanvasElement, postmortem: EndingPostmortem): void {
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('当前浏览器暂时无法生成战报图片。');

  ctx.fillStyle = '#0E1116';
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.fillStyle = '#161B22';
  ctx.fillRect(PADDING / 2, PADDING / 2, CARD_WIDTH - PADDING, CARD_HEIGHT - PADDING);
  ctx.strokeStyle = '#35435A';
  ctx.lineWidth = 3;
  ctx.strokeRect(PADDING / 2, PADDING / 2, CARD_WIDTH - PADDING, CARD_HEIGHT - PADDING);

  let y = 118;
  drawText(ctx, '程序员人生模拟器', PADDING, y, '30px ui-monospace, SFMono-Regular, Menlo, monospace', '#8B949E');
  y += 70;
  drawText(ctx, postmortem.categoryLabel, PADDING, y, '34px ui-monospace, SFMono-Regular, Menlo, monospace', categoryColor(postmortem.category));
  if (postmortem.challengeLabel) {
    drawText(ctx, postmortem.challengeLabel, CARD_WIDTH - PADDING - 360, y, '26px ui-monospace, SFMono-Regular, Menlo, monospace', '#58A6FF');
  }
  y += 72;
  y = drawWrappedText(ctx, postmortem.title, PADDING, y, CARD_WIDTH - PADDING * 2, 58, '56px ui-monospace, SFMono-Regular, Menlo, monospace', '#F0F6FC');
  y += 28;
  y = drawWrappedText(ctx, postmortem.summary, PADDING, y, CARD_WIDTH - PADDING * 2, 38, '28px ui-monospace, SFMono-Regular, Menlo, monospace', '#C9D1D9', 3);

  y += 56;
  drawText(ctx, '关键指标', PADDING, y, '30px ui-monospace, SFMono-Regular, Menlo, monospace', '#F0F6FC');
  y += 34;
  drawImpactGrid(ctx, postmortem, y);
  y += 282;

  drawText(ctx, '主要根因', PADDING, y, '30px ui-monospace, SFMono-Regular, Menlo, monospace', '#F0F6FC');
  y += 50;
  postmortem.rootCauses.slice(0, 3).forEach((cause, index) => {
    y = drawWrappedText(ctx, `${index + 1}. ${cause}`, PADDING, y, CARD_WIDTH - PADDING * 2, 34, '26px ui-monospace, SFMono-Regular, Menlo, monospace', '#C9D1D9', 2);
    y += 18;
  });

  const footerY = CARD_HEIGHT - 150;
  ctx.strokeStyle = '#35435A';
  ctx.beginPath();
  ctx.moveTo(PADDING, footerY - 46);
  ctx.lineTo(CARD_WIDTH - PADDING, footerY - 46);
  ctx.stroke();
  drawText(ctx, `#${postmortem.shareHash}`, PADDING, footerY, '34px ui-monospace, SFMono-Regular, Menlo, monospace', '#58A6FF');
  drawText(ctx, '终局不是判决，是下一局的输入。', PADDING, footerY + 46, '24px ui-monospace, SFMono-Regular, Menlo, monospace', '#8B949E');
}

function drawImpactGrid(ctx: CanvasRenderingContext2D, postmortem: EndingPostmortem, startY: number) {
  const items = postmortem.impact.slice(0, 4);
  const gap = 20;
  const width = (CARD_WIDTH - PADDING * 2 - gap) / 2;
  const height = 112;

  items.forEach((item, index) => {
    const x = PADDING + (index % 2) * (width + gap);
    const y = startY + Math.floor(index / 2) * (height + gap);
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#35435A';
    ctx.strokeRect(x, y, width, height);
    drawText(ctx, item.label, x + 22, y + 38, '24px ui-monospace, SFMono-Regular, Menlo, monospace', '#8B949E');
    drawText(ctx, item.value, x + 22, y + 82, '34px ui-monospace, SFMono-Regular, Menlo, monospace', toneColor(item.tone));
  });
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: string,
  color: string,
  maxLines = 4
): number {
  ctx.font = font;
  ctx.fillStyle = color;
  const lines = wrapCanvasText(ctx, text, maxWidth).slice(0, maxLines);
  lines.forEach((line, index) => ctx.fillText(index === maxLines - 1 && lines.length === maxLines ? trimLine(line) : line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, color: string) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

export function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const chars = Array.from(text);
  const lines: string[] = [];
  let line = '';

  chars.forEach(char => {
    const next = `${line}${char}`;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = char.trimStart();
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function trimLine(line: string) {
  return line.length > 1 ? `${line.slice(0, -1)}…` : line;
}

function categoryColor(category: EndingPostmortem['category']) {
  if (category === 'failure') return '#FF7B72';
  if (category === 'success') return '#56D364';
  return '#D29922';
}

function toneColor(tone: EndingPostmortem['impact'][number]['tone']) {
  if (tone === 'bad') return '#FF7B72';
  if (tone === 'warn') return '#D29922';
  if (tone === 'good') return '#56D364';
  return '#F0F6FC';
}
