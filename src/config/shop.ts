import type { ShopItemConfig } from '../types/game';
import { withShopEvidence } from './evidence';

const SHOP_ITEM_DEFINITIONS = [
  { id: 'dual_monitor', category: 'equipment', name: '双显示器', price: 1500, maxCount: 1, description: '认真上班/项目实战效率提升，每月+1专注。', effect: { focus: 1 } },
  { id: 'noise_cancel', category: 'equipment', name: '降噪耳机', price: 1200, maxCount: 1, description: '降低精神摩擦，每月+1精神。', effect: { mental: 1 } },
  { id: 'ergonomic_chair', category: 'health', name: '人体工学椅', price: 2000, maxCount: 1, description: '降低久坐负荷和长期健康损耗，每月+1健康。', effect: { health: 1 } },
  { id: 'system_course', category: 'learning', name: '系统课套餐', price: 3000, maxCount: 3, description: '提高课程学习效率，每月+1技术经验（可叠加）。', effect: { techXp: 1 } },
  { id: 'ai_pro', category: 'subscription', name: 'AI Pro 订阅', price: 200, monthlyCost: 200, maxCount: 1, description: '提高 AI 工具练习效率，每月+2AI经验但订阅成本持续。', effect: { aiXp: 2 } },
  { id: 'gym_card', category: 'health', name: '健身房年卡', price: 2500, maxCount: 1, description: '让健身训练更容易形成长期进度，每月+2健康+1精神。', effect: { health: 2, mental: 1 } },
  { id: 'medical_insurance', category: 'risk', name: '商业医疗险', price: 800, maxCount: 1, description: '降低医疗黑天鹅冲击，家庭医疗事件支出大幅减少。', effect: {} },
  { id: 'private_room', category: 'housing', name: '合租升级单间', price: 5000, maxCount: 1, description: '改善恢复条件和居住稳定性，每月+1精神（租金+800/月）。', effect: { mental: 1 } },
  { id: 'developer_accounts', category: 'equipment', name: 'GitHub/LinkedIn 账号配置', price: 0, maxCount: 1, description: '建立公开开发者账号，解锁开源投递和个人品牌行动。', effect: { reputationXp: 1 } },
  { id: 'basic_kitchen', category: 'housing', name: '基础厨具', price: 800, maxCount: 1, description: '补齐做饭和饮食管理的基础条件，每月+1健康。', effect: { health: 1 } },
  { id: 'credit_card', category: 'risk', name: '信用卡', price: 0, maxCount: 1, description: '获得2000信用额度和短期支付工具，也增加消费纪律要求。', effect: { cash: 2000 } },
  { id: 'recording_tool', category: 'equipment', name: '录屏工具', price: 300, maxCount: 1, description: '可录制技术 demo 和作品说明，提升作品集建设效率。', effect: { buildProjectState: 1 } },
  { id: 'quiet_space', category: 'housing', name: '安静工作角', price: 1200, maxCount: 1, description: '提供无打扰环境，每月+1精神+1专注。', effect: { mental: 1, focus: 1 } },
  { id: 'window_light', category: 'housing', name: '窗边自然光位', price: 300, maxCount: 1, description: '整理出有窗和自然光的位置，每月+1精神+1健康。', effect: { mental: 1, health: 1 } },
  { id: 'screen_time_app', category: 'subscription', name: '屏幕时间工具', price: 120, maxCount: 1, description: '帮助限制短视频和娱乐应用使用，每月+1专注。', effect: { focus: 1 } },
  { id: 'password_manager', category: 'subscription', name: '密码管理器', price: 120, maxCount: 1, description: '改善账号安全和数字文件整理效率，每月+1工具习惯。', effect: { toolHabitState: 1 } }
] satisfies ShopItemConfig[];

export const SHOP_ITEMS: ShopItemConfig[] = SHOP_ITEM_DEFINITIONS.map(item => withShopEvidence(item));
