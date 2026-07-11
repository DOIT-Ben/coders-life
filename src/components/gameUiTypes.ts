import type { ActionConfig } from '../types/game';

export type AvailableAction = ActionConfig & {
  available: boolean;
  reason?: string;
};

export type GameModal =
  | 'ach'
  | 'shop'
  | 'ending'
  | 'bookmark'
  | 'feedback'
  | 'actionDetail'
  | 'actionManage'
  | 'script'
  | 'firstYearReview';

export const ACTION_GROUPS: Array<{ id: ActionConfig['group']; label: string }> = [
  { id: 'learn', label: '学习成长' },
  { id: 'work', label: '工作赚钱' },
  { id: 'career', label: '职业机会' },
  { id: 'money', label: '副业收入' },
  { id: 'recover', label: '恢复放松' },
  { id: 'relationship', label: '社交关系' },
];
