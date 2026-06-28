import type { ShopItemConfig } from '../types/game';

export const SHOP_ITEMS: ShopItemConfig[] = [
  { id: 'dual_monitor', category: 'equipment', name: '双显示器', price: 1500, maxCount: 1, description: '认真上班/项目实战效率提升。', effect: {} },
  { id: 'noise_cancel', category: 'equipment', name: '降噪耳机', price: 1200, maxCount: 1, description: '降低精神摩擦，并满足音频类行动条件。', effect: {} },
  { id: 'ergonomic_chair', category: 'health', name: '人体工学椅', price: 2000, maxCount: 1, description: '降低久坐负荷和长期健康损耗。', effect: {} },
  { id: 'system_course', category: 'learning', name: '系统课套餐', price: 3000, maxCount: 3, description: '提高课程学习效率，不直接灌入技术点。', effect: {} },
  { id: 'ai_pro', category: 'subscription', name: 'AI Pro 订阅', price: 200, monthlyCost: 200, maxCount: 1, description: '提高 AI 工具练习效率，但每月有订阅成本。', effect: {} },
  { id: 'gym_card', category: 'health', name: '健身房年卡', price: 2500, maxCount: 1, description: '让健身训练更容易形成长期进度。', effect: {} },
  { id: 'medical_insurance', category: 'risk', name: '商业医疗险', price: 800, maxCount: 1, description: '降低医疗黑天鹅冲击，增加少量固定支出。', effect: {} },
  { id: 'private_room', category: 'housing', name: '合租升级单间', price: 5000, maxCount: 1, description: '改善恢复条件和居住稳定性，但租金增加。', effect: {} }
];
