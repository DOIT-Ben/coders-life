import type {
  CareerProfile,
  FinanceState,
  HealthProfile,
  LaborMarketState,
  LifePressureState,
  SocialProfile
} from '../types/game';

export const DEFAULT_FINANCE_STATE: FinanceState = {
  monthlyIncome: 0,
  monthlyFixedCost: 5200,
  emergencyFundMonths: 19.2,
  debt: 0,
  cashflowStress: 18
};

export const DEFAULT_HEALTH_PROFILE: HealthProfile = {
  sleepDebt: 12,
  nutritionQuality: 58,
  exerciseHabit: 32,
  chronicStress: 26,
  recoveryQuality: 62,
  healthDebt: 16
};

export const DEFAULT_CAREER_PROFILE: CareerProfile = {
  employability: 34,
  aiLeverage: 8,
  deliveryReliability: 45,
  promotionReadiness: 18,
  layoffRisk: 20,
  careerCapital: 12
};

export const DEFAULT_SOCIAL_PROFILE: SocialProfile = {
  familySupport: 48,
  friendSupport: 42,
  networkStrength: 22,
  relationshipDebt: 18,
  safetyNet: 34
};

export const DEFAULT_LABOR_MARKET: LaborMarketState = {
  demandIndex: 56,
  aiDisruption: 8,
  hiringStrictness: 45,
  layoffPressure: 20,
  freelanceDemand: 40
};

export const DEFAULT_LIFE_PRESSURE: LifePressureState = {
  agePressure: 8,
  familyResponsibility: 12,
  housingPressure: 35,
  comparisonPressure: 36,
  timeScarcity: 24
};
