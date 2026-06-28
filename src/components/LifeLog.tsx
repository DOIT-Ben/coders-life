import type { GameState } from '../types/game';

export function LifeLog({ state }: { state: GameState }) {
  return (
    <main className="panel life-log">
      <div className="panel-title">
        <h2>人生日志</h2>
        <span>{state.logs.length}/120</span>
      </div>
      <div className="log-list">
        {[...state.logs].reverse().map(log => (
          <article className={`log log-${log.type}`} key={log.id}>
            <time>M·{log.month} · {log.age}岁</time>
            <div className="log-bubble">
              <span className="log-tag">{labelFor(log.type)}</span>
              <strong>{log.title}</strong>
              <p>{log.text}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function labelFor(type: string) {
  const labels: Record<string, string> = {
    info: 'INFO',
    good: 'GOOD',
    warn: 'WARN',
    bad: 'BAD',
    event: 'EVENT',
    unlock: 'ACH',
    ending: 'END'
  };
  return labels[type] ?? 'LOG';
}
