import type { GameState, LogType } from '../types/game';

// 确定性短哈希（FNV-1a），让每条人生记录像一个 commit
function logHash(id: string): string {
  let hash = 0x811c9dc5;
  for (const ch of id) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

export function logClass(type: LogType) {
  if (type === 'good' || type === 'unlock') return 'lucky';
  if (type === 'bad' || type === 'ending') return 'bad';
  if (type === 'warn' || type === 'event') return 'warn';
  return 'info';
}

export function logLabel(type: LogType) {
  if (type === 'good') return 'GOOD';
  if (type === 'unlock') return 'ACH';
  if (type === 'bad') return 'BAD';
  if (type === 'ending') return 'END';
  if (type === 'warn') return 'WARN';
  if (type === 'event') return 'EVENT';
  return 'INFO';
}

export default function LifeLog({ state }: { state: GameState }) {
  return (
    <div className="log-card">
      <div className="log-hdr">
        <span>人生日志</span>
        <span className="log-hdr-cmd">tail -f life.log</span>
      </div>
      <div className="log-body">
        {[...state.logs].reverse().map((log, index) => (
          <div className="commit-row" key={log.id}>
            <span className="commit-hash">{logHash(log.id)}</span>
            <span className="commit-day">D·{log.month * 30}</span>
            <span className={`commit-tag ${logClass(log.type)}`}>{logLabel(log.type)}</span>
            <span className="commit-msg">
              <strong>{log.title}</strong> {log.text}
              {index === 0 ? <span className="cursor-blink">▌</span> : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
