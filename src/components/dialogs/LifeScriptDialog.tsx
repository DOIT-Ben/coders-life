import { useMemo, useState } from 'react';
import type { GameState } from '../../types/game';
import { parseLifeScript } from '../../systems/lifeScriptDsl';
import { runLifeScript, type LifeScriptRunSnapshot } from '../../systems/lifeScriptRunner';
import ModalShell from './ModalShell';

const DEFAULT_SCRIPT = [
  '当 精神 < 45 或者 健康 < 55 则 睡眠修复',
  '当 当前offer 可用 则 在职跳槽',
  '当 现金 < 50000 则 理财整理',
  '否则 系统学习'
].join('\n');

export default function LifeScriptDialog({
  state,
  setState,
  close
}: {
  state: GameState;
  setState: (state: GameState) => void;
  close: () => void;
}) {
  const [source, setSource] = useState(DEFAULT_SCRIPT);
  const [runMessage, setRunMessage] = useState('');
  const [runErrors, setRunErrors] = useState<string[]>([]);
  const [snapshots, setSnapshots] = useState<LifeScriptRunSnapshot[]>([]);
  const parsed = useMemo(() => parseLifeScript(source), [source]);
  const parseErrors = parsed.ok ? [] : parsed.errors;

  function run(months: number) {
    const result = runLifeScript(state, source, { maxMonths: months });
    setSnapshots(result.snapshots);
    setRunErrors(result.errors);
    if (!result.ok) {
      setRunMessage(result.stoppedReason ?? '脚本没有执行，请先修正规则。');
      return;
    }
    setState(result.finalState);
    setRunMessage(result.finalState.gameOver ? '脚本已经跑到人生结局。' : `已按脚本跑完 ${result.snapshots.length} 个月。`);
  }

  const previewRows = parsed.ok
    ? parsed.program.rules.map(rule => rule.kind === 'fallback'
      ? `否则：${rule.actionIds.join('、')}`
      : `当条件命中：${rule.actionIds.join('、')}`)
    : [];
  const latest = snapshots[snapshots.length - 1];

  return (
    <ModalShell
      actions={
        <div className="modal-actions life-script-actions">
          <button className="btn-mp" disabled={parseErrors.length > 0} type="button" onClick={() => run(12)}>跑 12 个月</button>
          <button className="btn-ms" disabled={parseErrors.length > 0} type="button" onClick={() => run(280)}>跑到结局</button>
        </div>
      }
      className="life-script-modal"
      close={close}
      title="人生脚本"
      wide
    >
      <div className="modal-scroll life-script-scroll">
        <div className="life-script-status">
          <span>当前进度 第 {state.month * 30} 天</span>
          <span>{state.age} 岁</span>
        </div>
        <label className="life-script-label" htmlFor="life-script-source">策略规则</label>
        <textarea
          className="life-script-input"
          id="life-script-source"
          spellCheck={false}
          value={source}
          onChange={event => {
            setSource(event.target.value);
            setRunMessage('');
            setRunErrors([]);
          }}
        />
        {parseErrors.length > 0 ? (
          <div className="life-script-errors" role="alert">
            {parseErrors.map(error => <div key={error}>{error}</div>)}
          </div>
        ) : (
          <div className="life-script-preview">
            {previewRows.map((row, index) => <div key={`${row}-${index}`}>{row}</div>)}
          </div>
        )}
        {runErrors.length > 0 ? (
          <div className="life-script-errors" role="alert">
            {runErrors.map(error => <div key={error}>{error}</div>)}
          </div>
        ) : null}
        {runMessage ? <div className="life-script-run-message">{runMessage}</div> : null}
        {latest ? (
          <div className="life-script-replay">
            <div>最近回放：第 {latest.month * 30} 天</div>
            <div>行动：{latest.actionIds.join('、') || '无可执行行动'}</div>
            <div>现金 {Math.round(latest.cash / 1000) / 10} 万 · 精神 {Math.round(latest.mental)} · 健康 {Math.round(latest.health)}</div>
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
