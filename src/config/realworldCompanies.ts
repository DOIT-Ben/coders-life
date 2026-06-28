import rows from '../data/realworld/realworld_company_types.json';
import type { CompanyType } from '../types/game';
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

export interface CompanyProfile {
  salaryCoef: number;
  overtimeRisk: number;
  layoffRisk: number;
  promotionSpeed: number;
  learningTime: number;
  psychologicalSafety: number;
  aiAdoption: number;
}

export const COMPANY_PROFILES: Record<Exclude<CompanyType, 'none'>, CompanyProfile> = {
  startup: {
    salaryCoef: 0.7,
    overtimeRisk: 95,
    layoffRisk: 80,
    promotionSpeed: 75,
    learningTime: 1.5,
    psychologicalSafety: 35,
    aiAdoption: 55
  },
  private: {
    salaryCoef: 0.8,
    overtimeRisk: 75,
    layoffRisk: 65,
    promotionSpeed: 50,
    learningTime: 1.3,
    psychologicalSafety: 45,
    aiAdoption: 55
  },
  bigtech: {
    salaryCoef: 1.45,
    overtimeRisk: 90,
    layoffRisk: 70,
    promotionSpeed: 30,
    learningTime: 1.4,
    psychologicalSafety: 38,
    aiAdoption: 85
  },
  foreign: {
    salaryCoef: 1.3,
    overtimeRisk: 15,
    layoffRisk: 10,
    promotionSpeed: 55,
    learningTime: 1.15,
    psychologicalSafety: 82,
    aiAdoption: 35
  },
  traditional_enterprise: {
    salaryCoef: 0.85,
    overtimeRisk: 45,
    layoffRisk: 25,
    promotionSpeed: 25,
    learningTime: 0.85,
    psychologicalSafety: 58,
    aiAdoption: 32
  },
  outsourcing: {
    salaryCoef: 0.65,
    overtimeRisk: 85,
    layoffRisk: 75,
    promotionSpeed: 15,
    learningTime: 0.5,
    psychologicalSafety: 30,
    aiAdoption: 80
  },
  public_sector: {
    salaryCoef: 0.85,
    overtimeRisk: 30,
    layoffRisk: 5,
    promotionSpeed: 15,
    learningTime: 0.75,
    psychologicalSafety: 70,
    aiAdoption: 25
  }
};

export function getCompanyProfile(companyType: CompanyType): CompanyProfile {
  if (companyType === 'none') return COMPANY_PROFILES.private;
  return COMPANY_PROFILES[companyType];
}

export function findCompanyArchetype(companyType: string): CompanyArchetypeConfig | undefined {
  return COMPANY_ARCHETYPES.find(item => item.companyType === companyType);
}
