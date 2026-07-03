import { useMemo, useState } from 'react';
import type { GameState } from '../../types/game';
import { getCareer } from '../../config/careers';
import ModalShell from './ModalShell';

const FEEDBACK_TYPES = [
  '界面显示/滚动问题',
  '行动效果不符合预期',
  '数值平衡问题',
  '事件/结局不合理',
  '存档/加载问题',
  '移动端体验问题',
  '想新增行动或内容'
];

const FEEDBACK_SEVERITIES = [
  '阻塞游玩',
  '明显影响体验',
  '轻微问题',
  '建议优化'
];

export default function FeedbackDialog({ state, close }: { state: GameState; close: () => void }) {
  const [feedbackType, setFeedbackType] = useState(FEEDBACK_TYPES[0]);
  const [severity, setSeverity] = useState(FEEDBACK_SEVERITIES[1]);
  const [details, setDetails] = useState('');
  const careerConfig = getCareer(state.career.track);
  const day = state.month * 30;
  const context = [
    `第 ${day} 天`,
    `${state.age} 岁`,
    careerConfig.name,
    state.career.employmentStatus,
    `现金 ${Math.round(state.stats.cash / 1000) / 10} 万`,
    `精神 ${Math.round(state.stats.mental)}`,
    `健康 ${Math.round(state.stats.health)}`
  ].join(' / ');
  const issueUrl = useMemo(() => {
    const body = [
      '## 反馈类型',
      feedbackType,
      '',
      '## 影响程度',
      severity,
      '',
      '## 具体描述',
      details.trim() || '请描述你遇到的问题或建议。',
      '',
      '## 当前游戏上下文',
      context
    ].join('\n');
    const params = new URLSearchParams({
      title: `[反馈] ${feedbackType} - ${severity}`,
      body
    });
    return `https://github.com/DOIT-Ben/coders-life/issues/new?${params.toString()}`;
  }, [context, details, feedbackType, severity]);

  return (
    <ModalShell
      actions={
        <div className="modal-actions">
          <a className="feedback-submit" href={issueUrl} target="_blank" rel="noreferrer">提交反馈</a>
          <button className="btn-ms" type="button" onClick={close}>稍后再说</button>
        </div>
      }
      className="feedback-modal"
      close={close}
      title="提交反馈"
    >
      <div className="modal-scroll feedback-scroll">
        <div className="feedback-section">
          <div className="feedback-label">反馈类型</div>
          <div className="feedback-grid">
            {FEEDBACK_TYPES.map(type => (
              <button className={type === feedbackType ? 'feedback-option active' : 'feedback-option'} key={type} type="button" onClick={() => setFeedbackType(type)}>
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="feedback-section">
          <div className="feedback-label">影响程度</div>
          <div className="feedback-grid compact">
            {FEEDBACK_SEVERITIES.map(item => (
              <button className={item === severity ? 'feedback-option active' : 'feedback-option'} key={item} type="button" onClick={() => setSeverity(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="feedback-section">
          <label className="feedback-label" htmlFor="feedback-details">补充说明</label>
          <textarea
            className="feedback-textarea"
            id="feedback-details"
            value={details}
            onChange={event => setDetails(event.target.value)}
            placeholder="描述你看到的现象、期待的结果，或希望新增的内容。"
          />
        </div>
        <div className="feedback-context">{context}</div>
      </div>
    </ModalShell>
  );
}
