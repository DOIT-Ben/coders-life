import rows from '../data/realworld/realworld_career_roles.json';
import { numberFrom } from './realworldParser';
import { listFrom } from './realworldShared';

export interface CareerRoleConfig {
  role: string;
  track: string;
  level: string;
  cityTier: string;
  companyType: string;
  minSalaryMonth: number;
  maxSalaryMonth: number;
  typicalSalaryMonth: number;
  bonusMonths: number;
  promotionMonthsMin: number;
  promotionMonthsMax: number;
  requiredSkillTags: string[];
  riskTags: string[];
  notes: string;
  sourceName: string;
  sourceUrl: string;
  sourceDate: string;
  confidence: string;
}

interface CareerRoleRow {
  role: string;
  track: string;
  level: string;
  city_tier: string;
  company_type: string;
  min_salary_month: string;
  max_salary_month: string;
  typical_salary_month: string;
  bonus_months: string;
  promotion_months_min: string;
  promotion_months_max: string;
  required_skill_tags: string;
  risk_tags: string;
  notes: string;
  source_name: string;
  source_url: string;
  source_date: string;
  confidence: string;
}

function mapCareerRole(row: CareerRoleRow): CareerRoleConfig {
  return {
    role: row.role,
    track: row.track,
    level: row.level,
    cityTier: row.city_tier,
    companyType: row.company_type,
    minSalaryMonth: numberFrom(row.min_salary_month),
    maxSalaryMonth: numberFrom(row.max_salary_month),
    typicalSalaryMonth: numberFrom(row.typical_salary_month),
    bonusMonths: numberFrom(row.bonus_months),
    promotionMonthsMin: numberFrom(row.promotion_months_min),
    promotionMonthsMax: numberFrom(row.promotion_months_max),
    requiredSkillTags: listFrom(row.required_skill_tags),
    riskTags: listFrom(row.risk_tags),
    notes: row.notes,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    sourceDate: row.source_date,
    confidence: row.confidence
  };
}

export const CAREER_ROLES: CareerRoleConfig[] = (rows as CareerRoleRow[]).map(mapCareerRole);

export interface CareerRoute {
  id: string;
  label: string;
  transitionCost: number;
  requiredCapital: number;
  aiExposure: number;
}

export const CAREER_ROUTES: CareerRoute[] = [
  { id: 'testing', label: '测试工程', transitionCost: 18, requiredCapital: 12, aiExposure: 55 },
  { id: 'data_engineering', label: '数据工程', transitionCost: 34, requiredCapital: 30, aiExposure: 45 },
  { id: 'security', label: '安全工程', transitionCost: 42, requiredCapital: 38, aiExposure: 28 },
  { id: 'mobile', label: '移动端', transitionCost: 28, requiredCapital: 24, aiExposure: 38 },
  { id: 'embedded', label: '嵌入式', transitionCost: 48, requiredCapital: 42, aiExposure: 22 },
  { id: 'sre', label: 'SRE/平台工程', transitionCost: 36, requiredCapital: 34, aiExposure: 32 },
  { id: 'technical_management', label: '技术管理', transitionCost: 44, requiredCapital: 55, aiExposure: 25 },
  { id: 'industry_expert', label: '行业专家', transitionCost: 40, requiredCapital: 50, aiExposure: 18 },
  { id: 'indie_developer', label: '独立开发者', transitionCost: 52, requiredCapital: 45, aiExposure: 42 }
];

export function findCareerRole(input: {
  track: string;
  cityTier?: string;
  companyType?: string;
  levelKeyword?: string;
}): CareerRoleConfig | undefined {
  return CAREER_ROLES.find(role => {
    if (role.track !== input.track) return false;
    if (input.cityTier && role.cityTier !== input.cityTier) return false;
    if (input.companyType && role.companyType !== input.companyType) return false;
    if (input.levelKeyword && !role.level.includes(input.levelKeyword)) return false;
    return true;
  });
}
