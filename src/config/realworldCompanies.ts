import rows from '../data/realworld/realworld_company_types.json';
import { numberFrom } from './realworldParser';

export interface CompanyArchetypeConfig {
  companyType: string;
  salaryCoef: number;
  learningCoef: number;
  stabilityScore: number;
  overtimeRisk: number;
  layoffRisk: number;
  promotionSpeed: number;
  aiPressure: number;
  politicsPressure: number;
  description: string;
  sourceName: string;
  sourceUrl: string;
  confidence: string;
}

interface CompanyArchetypeRow {
  company_type: string;
  salary_coef: string;
  learning_coef: string;
  stability_score: string;
  overtime_risk: string;
  layoff_risk: string;
  promotion_speed: string;
  ai_pressure: string;
  politics_pressure: string;
  description: string;
  source_name: string;
  source_url: string;
  confidence: string;
}

function mapCompany(row: CompanyArchetypeRow): CompanyArchetypeConfig {
  return {
    companyType: row.company_type,
    salaryCoef: numberFrom(row.salary_coef),
    learningCoef: numberFrom(row.learning_coef),
    stabilityScore: numberFrom(row.stability_score),
    overtimeRisk: numberFrom(row.overtime_risk),
    layoffRisk: numberFrom(row.layoff_risk),
    promotionSpeed: numberFrom(row.promotion_speed),
    aiPressure: numberFrom(row.ai_pressure),
    politicsPressure: numberFrom(row.politics_pressure),
    description: row.description,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    confidence: row.confidence
  };
}

export const COMPANY_ARCHETYPES: CompanyArchetypeConfig[] = (rows as CompanyArchetypeRow[]).map(mapCompany);

export function findCompanyArchetype(companyType: string): CompanyArchetypeConfig | undefined {
  return COMPANY_ARCHETYPES.find(item => item.companyType === companyType);
}
