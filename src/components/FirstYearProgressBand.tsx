import type { FirstYearGuide } from '../systems/firstYearExperienceSystem';

export type FirstYearProgressBandProps = {
  guide: FirstYearGuide;
};

export default function FirstYearProgressBand({ guide }: FirstYearProgressBandProps) {
  return (
    <section className="first-year-progress-band decision-context-bar" aria-label="第一年进度">
      <div className="first-year-stage">
        <span>当前阶段</span>
        <strong>{guide.stageLabel}</strong>
        <p>{guide.primaryGoal}</p>
      </div>
      <div className="first-year-nodes">
        {guide.nodes.slice(0, 3).map(node => (
          <span className={node.complete ? 'first-year-node done' : 'first-year-node'} key={node.id}>
            <span aria-hidden="true">{node.complete ? '✓' : '○'}</span>
            <span>{node.label}</span>
            {node.value ? <small>{node.value}</small> : null}
          </span>
        ))}
      </div>
      {guide.recommendationReason ? (
        <p className="first-year-recommendation">
          <strong>本月建议</strong>
          <span>{guide.recommendationReason}</span>
        </p>
      ) : null}
    </section>
  );
}
