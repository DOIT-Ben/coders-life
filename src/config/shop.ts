import type { ShopItemConfig } from '../types/game';

export const SHOP_ITEMS: ShopItemConfig[] = [
  { id: 'dual_monitor', category: 'equipment', name: '双显示器', price: 1500, maxCount: 1, description: '认真上班/项目实战效率提升。', effect: { techXp: 6 } },
  { id: 'noise_cancel', category: 'equipment', name: '降噪耳机', price: 1200, maxCount: 1, description: '降低精神摩擦。', effect: { mental: 4 } },
  { id: 'ergonomic_chair', category: 'health', name: '人体工学椅', price: 2000, maxCount: 1, description: '降低长期健康损耗。', effect: { health: 6 } },
  { id: 'system_course', category: 'learning', name: '系统课套餐', price: 3000, maxCount: 3, description: '短期提升技术学习效率。', effect: { techXp: 18, mental: -2 } },
  { id: 'ai_pro', category: 'subscription', name: 'AI Pro 订阅', price: 200, monthlyCost: 200, maxCount: 1, description: 'AI训练收益更高，但每月有订阅成本。', effect: { aiXp: 18 } },
  { id: 'gym_card', category: 'health', name: '健身房年卡', price: 2500, maxCount: 1, description: '让健身训练更有效。', effect: { health: 10, burnout: -4 } },
  { id: 'medical_insurance', category: 'risk', name: '商业医疗险', price: 800, maxCount: 1, description: '降低医疗类大事件损失。', effect: { mental: 2 } },
  { id: 'private_room', category: 'housing', name: '合租升级单间', price: 5000, maxCount: 1, description: '提升精神稳定性，但月支出增加。', effect: { mental: 8, relation: -1 } }
];
