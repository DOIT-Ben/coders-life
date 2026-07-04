export type LifeScriptPresetId =
  | 'cashflow_first'
  | 'health_first'
  | 'ai_transition'
  | 'relationship_first';

export interface LifeScriptPreset {
  id: LifeScriptPresetId;
  label: string;
  source: string;
}

export const LIFE_SCRIPT_PRESETS: LifeScriptPreset[] = [
  {
    id: 'cashflow_first',
    label: '现金流优先',
    source: [
      '当 当前offer 可用 则 在职跳槽',
      '当 当前面试 可用 则 参加面试',
      '当 待业 并且 作品 < 1 则 项目实战',
      '当 待业 并且 作品 >= 1 则 求职投递',
      '当 在职 并且 现金 < 80000 则 认真上班、理财整理、系统学习',
      '当 精神 < 45 或者 健康 < 55 则 睡眠修复',
      '否则 认真上班、系统学习'
    ].join('\n')
  },
  {
    id: 'health_first',
    label: '健康优先',
    source: [
      '当 当前offer 可用 则 在职跳槽',
      '当 当前面试 可用 则 参加面试',
      '当 待业 并且 作品 < 1 则 项目实战',
      '当 待业 并且 作品 >= 1 则 求职投递',
      '当 精神 < 55 或者 健康 < 70 则 睡眠修复、散步晒太阳',
      '当 在职 并且 现金 < 60000 则 认真上班、理财整理',
      '否则 散步晒太阳、认真上班'
    ].join('\n')
  },
  {
    id: 'ai_transition',
    label: 'AI转型',
    source: [
      '当 当前offer 可用 则 在职跳槽',
      '当 当前面试 可用 则 参加面试',
      '当 待业 并且 作品 < 1 则 项目实战',
      '当 待业 并且 作品 >= 1 则 求职投递',
      '当 AI协作 < 55 并且 现金 > 25000 则 AI工具训练、系统学习',
      '当 精神 < 45 或者 健康 < 55 则 睡眠修复',
      '否则 项目实战、认真上班'
    ].join('\n')
  },
  {
    id: 'relationship_first',
    label: '关系优先',
    source: [
      '当 当前offer 可用 则 在职跳槽',
      '当 当前面试 可用 则 参加面试',
      '当 待业 并且 作品 < 1 则 项目实战',
      '当 待业 并且 作品 >= 1 则 求职投递',
      '当 精神 < 50 或者 健康 < 60 则 睡眠修复',
      '当 在职 并且 现金 < 50000 则 认真上班',
      '当 关系 < 65 则 联系家人、朋友吃饭',
      '否则 人脉经营、认真上班'
    ].join('\n')
  }
];

export function getLifeScriptPreset(id: LifeScriptPresetId): LifeScriptPreset {
  const preset = LIFE_SCRIPT_PRESETS.find(candidate => candidate.id === id);
  if (!preset) throw new Error(`Unknown life script preset: ${id}`);
  return preset;
}
