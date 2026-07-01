import type { ShopItemConfig } from '../types/game';
import { withShopEvidence } from './evidence';

const SHOP_ITEM_DEFINITIONS = [
  { id: 'dual_monitor', category: 'equipment', name: '双显示器', price: 1500, maxCount: 1, description: '认真上班/项目实战效率提升。', effect: {} },
  { id: 'noise_cancel', category: 'equipment', name: '降噪耳机', price: 1200, maxCount: 1, description: '降低精神摩擦，并满足音频类行动条件。', effect: {} },
  { id: 'ergonomic_chair', category: 'health', name: '人体工学椅', price: 2000, maxCount: 1, description: '降低久坐负荷和长期健康损耗。', effect: {} },
  { id: 'system_course', category: 'learning', name: '系统课套餐', price: 3000, maxCount: 3, description: '提高课程学习效率，不直接灌入技术点。', effect: {} },
  { id: 'ai_pro', category: 'subscription', name: 'AI Pro 订阅', price: 200, monthlyCost: 200, maxCount: 1, description: '提高 AI 工具练习效率，但每月有订阅成本。', effect: {} },
  { id: 'gym_card', category: 'health', name: '健身房年卡', price: 2500, maxCount: 1, description: '让健身训练更容易形成长期进度。', effect: {} },
  { id: 'medical_insurance', category: 'risk', name: '商业医疗险', price: 800, maxCount: 1, description: '降低医疗黑天鹅冲击，增加少量固定支出。', effect: {} },
  { id: 'private_room', category: 'housing', name: '合租升级单间', price: 5000, maxCount: 1, description: '改善恢复条件和居住稳定性，但租金增加。', effect: {} },
  { id: 'developer_accounts', category: 'equipment', name: 'GitHub/LinkedIn 账号配置', price: 0, maxCount: 1, description: '建立公开开发者账号，后续可做开源、简历和职业可见度行动。', effect: {} },
  { id: 'basic_kitchen', category: 'housing', name: '基础厨具', price: 800, maxCount: 1, description: '补齐做饭和饮食管理的基础条件。', effect: {} },
  { id: 'credit_card', category: 'risk', name: '信用卡', price: 0, maxCount: 1, description: '获得短期支付工具，也增加消费纪律要求。', effect: {} },
  { id: 'recording_tool', category: 'equipment', name: '录屏工具', price: 300, maxCount: 1, description: '可录制技术 demo 和作品说明。', effect: {} },
  { id: 'quiet_space', category: 'housing', name: '安静工作角', price: 1200, maxCount: 1, description: '提供无打扰环境，降低深度工作和公开创作摩擦。', effect: {} },
  { id: 'window_light', category: 'housing', name: '窗边自然光位', price: 300, maxCount: 1, description: '整理出有窗和自然光的位置，支持日照恢复类行动。', effect: {} },
  { id: 'screen_time_app', category: 'subscription', name: '屏幕时间工具', price: 120, maxCount: 1, description: '帮助限制短视频和娱乐应用使用。', effect: {} },
  { id: 'password_manager', category: 'subscription', name: '密码管理器', price: 120, maxCount: 1, description: '改善账号安全和数字文件整理效率。', effect: {} }
] satisfies ShopItemConfig[];

export const SHOP_ITEMS: ShopItemConfig[] = SHOP_ITEM_DEFINITIONS.map(item => withShopEvidence(item));
