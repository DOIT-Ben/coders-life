import type { CareerTrack } from '../types/game';
import frontendAvatar from '../assets/avatars/frontend-fox.svg';
import backendAvatar from '../assets/avatars/backend-capybara.svg';
import fullstackAvatar from '../assets/avatars/fullstack-octopus.svg';
import aiAvatar from '../assets/avatars/ai-duck.svg';

export interface CareerConfig {
  id: CareerTrack;
  name: string;
  subtitle: string;
  description: string;
  avatar: string;
  growth: {
    tech: number;
    ai: number;
    reputation: number;
    burnout: number;
    freelance: number;
  };
  risk: {
    aiReplacement: number;
    agePressure: number;
    marketVolatility: number;
  };
}

export const CAREERS: CareerConfig[] = [
  {
    id: 'frontend',
    name: '产品界面工程师',
    subtitle: '连接用户、产品和体验',
    description: '学习反馈快，AI提效明显，但技术栈变化快，容易被工具链重构。',
    avatar: frontendAvatar,
    growth: { tech: 1.05, ai: 1.12, reputation: 1.06, burnout: 1.00, freelance: 1.08 },
    risk: { aiReplacement: 1.18, agePressure: 1.00, marketVolatility: 1.05 }
  },
  {
    id: 'backend',
    name: '后端工程师',
    subtitle: '系统稳定性的守门人',
    description: '成长慢但护城河较稳，事故压力和责任边界更重。',
    avatar: backendAvatar,
    growth: { tech: 1.10, ai: 0.95, reputation: 1.00, burnout: 1.06, freelance: 0.92 },
    risk: { aiReplacement: 0.92, agePressure: 1.08, marketVolatility: 0.95 }
  },
  {
    id: 'fullstack',
    name: '全栈工程师',
    subtitle: '用一个人顶半个团队',
    description: '适合副业和独立产品，但边界模糊，长期燃尽风险高。',
    avatar: fullstackAvatar,
    growth: { tech: 1.04, ai: 1.08, reputation: 1.08, burnout: 1.12, freelance: 1.18 },
    risk: { aiReplacement: 1.00, agePressure: 1.03, marketVolatility: 1.10 }
  },
  {
    id: 'ai_product',
    name: 'AI应用工程师',
    subtitle: '把模型变成可用产品',
    description: 'AI成长快，机会窗口大，但行业噪音和周期波动更明显。',
    avatar: aiAvatar,
    growth: { tech: 0.96, ai: 1.24, reputation: 1.10, burnout: 1.08, freelance: 1.12 },
    risk: { aiReplacement: 0.86, agePressure: 0.94, marketVolatility: 1.20 }
  }
];

export function getCareer(id: CareerTrack): CareerConfig {
  const career = CAREERS.find(item => item.id === id);
  if (!career) throw new Error(`Unknown career: ${id}`);
  return career;
}
