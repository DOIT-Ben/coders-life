import { buildEndingPostmortem } from '../../systems/endingPostmortemSystem';
import type { GameState } from '../../types/game';
import ModalShell from './ModalShell';

export default function EndingDialog({ state, close, restart }: { state: GameState; close: () => void; restart: () => void }) {
  const postmortem = buildEndingPostmortem(state);

  return (
    <ModalShell
      actions={<div className="modal-actions"><button className="btn-mp" onClick={restart}>重新开始</button><button className="btn-ms" onClick={close}>查看结果</button></div>}
      className="ending-postmortem-modal"
      close={close}
      title={postmortem.title}
      wide
    >
      <div className="modal-scroll ending-postmortem">
        <div className="postmortem-hero">
          <span className={`postmortem-badge ${postmortem.category}`}>{postmortem.categoryLabel}</span>
          <p>{postmortem.summary}</p>
          <span className="postmortem-hash">#{postmortem.shareHash}</span>
        </div>

        <section className="postmortem-section">
          <h3>事故时间线</h3>
          <div className="postmortem-timeline">
            {postmortem.timeline.map(item => (
              <div className="postmortem-timeline-row" key={item.id}>
                <span className="postmortem-month">M{item.month}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                  {item.value ? <small>压力值 {item.value}</small> : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="postmortem-section">
          <h3>根因分析</h3>
          <ul className="postmortem-list">
            {postmortem.rootCauses.map(item => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="postmortem-section">
          <h3>影响面</h3>
          <div className="postmortem-impact-grid">
            {postmortem.impact.map(item => (
              <div className={`postmortem-impact ${item.tone}`} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                {item.note ? <small>{item.note}</small> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="postmortem-section">
          <h3>下一局改进项</h3>
          <ol className="postmortem-action-list">
            {postmortem.actionItems.map(item => <li key={item}>{item}</li>)}
          </ol>
        </section>
      </div>
    </ModalShell>
  );
}
