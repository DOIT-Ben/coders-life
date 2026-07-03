import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../types/game';
import { getVisibleStats } from '../core/formulas';
import { getCareer } from '../config/careers';
import type { AvailableAction, GameModal } from './GameContainer';

type OutputTone = 'plain' | 'good' | 'bad' | 'warn' | 'cmd';
type OutputLine = { id: number; text: string; tone: OutputTone };

const HELP_LINES = [
  'help                查看全部命令',
  'whoami              当前人生摘要',
  'htop                查看核心状态',
  'log [数量]          最近的人生日志',
  'run <行动名>        执行一个行动（支持模糊匹配）',
  'open <商店|成就|收藏> 打开对应面板',
  'save                保存进度',
  'undo                使用后悔药撤销上一步',
  'clear               清空输出',
  'exit                关闭终端'
];

let lineId = 0;
function line(text: string, tone: OutputTone = 'plain'): OutputLine {
  lineId += 1;
  return { id: lineId, text, tone };
}

export default function CommandPalette({
  state,
  actions,
  onRunAction,
  onSave,
  onUndo,
  onOpenModal
}: {
  state: GameState;
  actions: AvailableAction[];
  onRunAction: (action: AvailableAction) => void;
  onSave: () => void;
  onUndo: () => void;
  onOpenModal: (modal: GameModal) => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<OutputLine[]>([
    line('人生终端已就绪。输入 help 查看可用命令。', 'plain')
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(current => !current);
        return;
      }
      if (event.key === '`' && !open) {
        const target = event.target as HTMLElement | null;
        const tag = target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [output, open]);

  function print(lines: Array<{ text: string; tone?: OutputTone }>) {
    setOutput(current => [...current, ...lines.map(item => line(item.text, item.tone ?? 'plain'))].slice(-200));
  }

  function runCommand(raw: string) {
    const command = raw.trim();
    if (!command) return;
    print([{ text: `❯ ${command}`, tone: 'cmd' }]);
    const [head, ...rest] = command.split(/\s+/);
    const arg = rest.join(' ');

    switch (head.toLowerCase()) {
      case 'help':
        print(HELP_LINES.map(text => ({ text })));
        return;
      case 'whoami': {
        const career = getCareer(state.career.track);
        const cashWan = (state.stats.cash / 10000).toFixed(1);
        print([{ text: `${career.name} · 第 ${state.month * 30} 天 · ${state.age} 岁 · 存款 ${cashWan} 万` }]);
        return;
      }
      case 'htop':
      case 'status': {
        const visible = getVisibleStats(state);
        print([
          { text: `技术 ${visible.tech} · AI协作 ${visible.ai} · 声望 ${visible.reputation}` },
          { text: `精神 ${visible.mental} · 健康 ${state.stats.health} · 燃尽 ${state.stats.burnout}`, tone: state.stats.burnout > 60 ? 'warn' : 'plain' },
          { text: `现金 ${(state.stats.cash / 10000).toFixed(1)} 万 · 被动收入 ${state.stats.passiveIncomeMonthly}/月 · 关系 ${state.stats.relation}` }
        ]);
        return;
      }
      case 'log': {
        const count = Math.min(Math.max(Number(arg) || 5, 1), 20);
        const logs = state.logs.slice(-count).reverse();
        if (logs.length === 0) {
          print([{ text: '还没有日志，先执行一个行动。' }]);
          return;
        }
        print(logs.map(item => ({ text: `D·${item.month * 30} [${item.type.toUpperCase()}] ${item.title}：${item.text}` })));
        return;
      }
      case 'run': {
        if (!arg) {
          print([{ text: '用法：run <行动名>，例如 run 健身', tone: 'warn' }]);
          return;
        }
        const matches = actions.filter(action => action.name.toLowerCase().includes(arg.toLowerCase()));
        if (matches.length === 0) {
          print([{ text: `没有找到匹配「${arg}」的行动。`, tone: 'bad' }]);
          return;
        }
        const exact = matches.find(action => action.name === arg);
        const target = exact ?? (matches.length === 1 ? matches[0] : undefined);
        if (!target) {
          print([
            { text: `「${arg}」匹配到 ${matches.length} 个行动，请说得更具体：`, tone: 'warn' },
            ...matches.slice(0, 6).map(action => ({ text: `  - ${action.name}` }))
          ]);
          return;
        }
        if (!target.available) {
          print([{ text: `「${target.name}」当前不可执行：${target.reason ?? '条件不足'}`, tone: 'bad' }]);
          return;
        }
        onRunAction(target);
        print([{ text: `已执行「${target.name}」，一个月过去了。`, tone: 'good' }]);
        return;
      }
      case 'open': {
        const modalByName: Record<string, GameModal> = { 商店: 'shop', 成就: 'ach', 收藏: 'bookmark' };
        const modal = modalByName[arg];
        if (!modal) {
          print([{ text: '用法：open <商店|成就|收藏>', tone: 'warn' }]);
          return;
        }
        setOpen(false);
        onOpenModal(modal);
        return;
      }
      case 'save':
        onSave();
        print([{ text: '进度已保存。', tone: 'good' }]);
        return;
      case 'undo':
        if ((state.inventory.undo_pill ?? 0) <= 0) {
          print([{ text: '需要先在商店购入后悔药，才能撤销上一步。', tone: 'warn' }]);
          return;
        }
        onUndo();
        print([{ text: '已撤销最近一次行动，后悔药 -1。', tone: 'good' }]);
        return;
      case 'sudo':
        print([{ text: 'sudo: 权限不足——人生没有 root。', tone: 'bad' }]);
        return;
      case 'clear':
        setOutput([]);
        return;
      case 'exit':
        setOpen(false);
        return;
      default:
        print([{ text: `命令未找到：${head}。输入 help 查看可用命令。`, tone: 'warn' }]);
    }
  }

  return (
    <>
      <button className="term-fab" type="button" onClick={() => setOpen(true)} aria-label="打开人生终端">&gt;_</button>
      {open ? (
        <div className="term-overlay" onClick={() => setOpen(false)}>
          <div className="term-panel" role="dialog" aria-modal="true" aria-label="人生终端" onClick={event => event.stopPropagation()}>
            <div className="term-panel-head">
              <span>人生终端</span>
              <span className="term-panel-hint">Ctrl+K 或 ` 唤起 · Esc 关闭</span>
            </div>
            <div className="term-output" ref={scrollRef}>
              {output.map(item => (
                <div className={`term-line ${item.tone}`} key={item.id}>{item.text}</div>
              ))}
            </div>
            <div className="term-input-row">
              <span className="t-prompt">❯</span>
              <input
                aria-label="输入命令"
                className="term-input"
                onChange={event => setInput(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    runCommand(input);
                    setInput('');
                  }
                  if (event.key === 'Escape') setOpen(false);
                }}
                placeholder="输入命令，例如 run 健身"
                ref={inputRef}
                type="text"
                value={input}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
