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
