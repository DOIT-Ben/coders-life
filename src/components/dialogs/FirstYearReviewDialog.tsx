import type { GameState } from '../../types/game';
import { buildFirstYearReview } from '../../systems/firstYearExperienceSystem';
import ModalShell from './ModalShell';

export type FirstYearReviewDialogProps = {
  state: GameState;
  close: () => void;
  restart: () => void;
};

export default function FirstYearReviewDialog({ state, close, restart }: FirstYearReviewDialogProps) {
  const review = buildFirstYearReview(state);

  return (
    <ModalShell
      actions={(
        <div className="modal-actions">
          <button className="btn-start" onClick={close} type="button">继续职业生涯</button>
          <button className="btn-secondary" onClick={restart} type="button">换路线重开</button>
        </div>
      )}
      className="first-year-review-modal"
      close={close}
      title={review.title}
      wide
    >
      <div className="modal-scroll first-year-review">
        <p className="first-year-review-summary">{review.summary}</p>

        <section>
          <h3>这一年的结果</h3>
          <div className="first-year-review-metrics">
            {review.metrics.map(metric => (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                {metric.delta ? <small>{metric.delta}</small> : null}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>关键选择</h3>
          <div className="first-year-review-decisions">
            {review.decisions.map(decision => (
              <div key={decision.id}>
                <strong>{decision.title}</strong>
                <p>{decision.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="first-year-review-signal strength">
          <strong>这一年做对了什么</strong>
          <p>{review.strength}</p>
        </div>
        <div className="first-year-review-signal risk">
          <strong>最需要处理的风险</strong>
          <p>{review.risk}</p>
        </div>
        <div className="first-year-review-signal next">
          <strong>下一阶段</strong>
          <p>{review.nextStep}</p>
        </div>
      </div>
    </ModalShell>
  );
}
