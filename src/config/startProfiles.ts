import type { CareerTrack, CityTier, PlayerValueProfile } from '../types/game';

export type StartValueProfile = {
  id: string;
  label: string;
  summary: string;
  values: PlayerValueProfile;
};

export const START_CITY_OPTIONS: Array<{ id: CityTier; label: string }> = [
  { id: 'tier1', label: '一线：高收入高成本' },
  { id: 'tier2', label: '二线：平衡发展' },
  { id: 'tier3', label: '三线：低成本低上限' }
];

export const VALUE_PROFILES: StartValueProfile[] = [
  {
    id: 'wealth_buffer',
    label: '财富缓冲',
    summary: '现金安全、职业稳定和选择空间优先',
    values: { wealth: 1, craft: 0.45, stability: 0.85, freedom: 0.7, relationships: 0.35, health: 0.5, impact: 0.35, exploration: 0.35 }
  },
  {
    id: 'health_relation',
    label: '健康关系',
    summary: '恢复质量、亲密关系和长期生活感优先',
    values: { wealth: 0.35, craft: 0.45, stability: 0.65, freedom: 0.55, relationships: 1, health: 1, impact: 0.45, exploration: 0.45 }
  },
  {
    id: 'creative_explore',
    label: '创造探索',
    summary: '作品、影响力、自由和新路线优先',
    values: { wealth: 0.45, craft: 0.85, stability: 0.35, freedom: 0.85, relationships: 0.45, health: 0.55, impact: 1, exploration: 1 }
  }
];

export const CAREER_HIGHLIGHTS: Record<CareerTrack, string[]> = {
  frontend: ['AI 学习快，反馈周期短', '框架更新快，易焦虑'],
  backend: ['收入稳定，技能贬值慢', '转型窗口更早出现'],
  fullstack: ['综合能力强，副业友好', '边界模糊，燃尽风险高'],
  ai_product: ['起薪高，行业前景好', '内卷严重，不确定性高']
};
