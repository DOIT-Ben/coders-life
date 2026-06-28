import type { CityTier, EconomyCycle } from '../types/game';

export const GAME_VERSION = 'v6.0.0-mvp';

export const AGE = {
  start: 22,
  softEnd: 45,
  hardEnd: 60,
  monthsPerYear: 12
};

export const STAT_CAPS = {
  mental: 100,
  health: 100,
  burnout: 100,
  relation: 100,
  identity: 100
};

export const MONEY_TARGETS = [100000, 150000, 300000, 500000, 1000000, 3000000, 6000000, 10000000];

export const CITY_CONFIG: Record<CityTier, { name: string; livingCost: number; rent: number; socialRate: number; salaryCoef: number; pressure: number }> = {
  tier1: { name: '一线城市', livingCost: 9500, rent: 4200, socialRate: 0.17, salaryCoef: 1.28, pressure: 1.20 },
  tier2: { name: '二线城市', livingCost: 6500, rent: 2600, socialRate: 0.15, salaryCoef: 1.00, pressure: 1.00 },
  tier3: { name: '三线城市', livingCost: 4500, rent: 1600, socialRate: 0.12, salaryCoef: 0.76, pressure: 0.82 }
};

export const ECONOMY_CONFIG: Record<EconomyCycle, { label: string; salaryCoef: number; freelanceCoef: number; layoffRisk: number; eventRisk: number }> = {
  boom: { label: '牛市扩张', salaryCoef: 1.12, freelanceCoef: 1.18, layoffRisk: 0.01, eventRisk: 0.90 },
  neutral: { label: '平稳周期', salaryCoef: 1.00, freelanceCoef: 1.00, layoffRisk: 0.03, eventRisk: 1.00 },
  recession: { label: '行业降温', salaryCoef: 0.90, freelanceCoef: 0.78, layoffRisk: 0.08, eventRisk: 1.15 },
  crisis: { label: '寒冬收缩', salaryCoef: 0.80, freelanceCoef: 0.60, layoffRisk: 0.16, eventRisk: 1.35 }
};

export const JOB_LEVELS = [
  { level: 0, name: '未入行', baseSalary: 0 },
  { level: 1, name: '初级工程师', baseSalary: 11000 },
  { level: 2, name: '中级工程师', baseSalary: 18000 },
  { level: 3, name: '高级工程师', baseSalary: 30000 },
  { level: 4, name: '专家/负责人', baseSalary: 52000 },
  { level: 5, name: '自由/创业成功', baseSalary: 85000 }
];
