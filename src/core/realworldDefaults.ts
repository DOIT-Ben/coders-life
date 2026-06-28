import type {
  CareerProfile,
  CareerTrack,
  FinanceState,
  HealthProfile,
  HouseholdState,
  LaborMarketState,
  LifePressureState,
  MonthlyPlan,
  ProjectPortfolioState,
  ProjectState,
  SocialProfile
} from '../types/game';

export const DEFAULT_FINANCE_STATE: FinanceState = {
  monthlyIncome: 0,
  monthlySalary: 0,
  monthlyFixedCost: 5200,
  monthlyRent: 2200,
  monthlyDebtPayment: 0,
  emergencyFundMonths: 19.2,
  debt: 0,
  cashflowStress: 18
};

export const DEFAULT_HEALTH_PROFILE: HealthProfile = {
  sleepDebt: 12,
  sedentaryLoad: 35,
  nutritionQuality: 58,
  exerciseHabit: 32,
  chronicStress: 26,
  chronicRisk: 18,
  recoveryQuality: 62,
  healthDebt: 16
};

export function createDefaultCareerProfile(track: CareerTrack = 'frontend'): CareerProfile {
  return {
    roleKey: track,
    companyArchetype: 'none',
    performance: 42,
    employability: 34,
    aiLeverage: 8,
    deliveryReliability: 45,
    promotionReadiness: 18,
    skillFreshness: 46,
    monthsUnemployed: 0,
    interviewMomentum: 0,
    layoffRisk: 20,
    careerCapital: 12
  };
}

export const DEFAULT_CAREER_PROFILE: CareerProfile = createDefaultCareerProfile();

export const DEFAULT_SOCIAL_PROFILE: SocialProfile = {
  familySupport: 48,
  partnerSupport: 0,
  friendSupport: 42,
  networkStrength: 22,
  loneliness: 28,
  relationshipDebt: 18,
  safetyNet: 34
};

export const DEFAULT_HOUSEHOLD_STATE: HouseholdState = {
  hasPartner: false,
  children: 0,
  hasParents: true
};

export const DEFAULT_LABOR_MARKET: LaborMarketState = {
  jobOpenings: 56,
  demandIndex: 56,
  aiDisruption: 8,
  salaryPressure: 42,
  ageFriction: 8,
  hiringStrictness: 45,
  layoffPressure: 20,
  freelanceDemand: 40
};

export const DEFAULT_LIFE_PRESSURE: LifePressureState = {
  stagePressure: 10,
  agePressure: 8,
  familyResponsibility: 12,
  housingPressure: 35,
  parentCarePressure: 6,
  childCarePressure: 0,
  commutePressure: 30,
  comparisonPressure: 36,
  timeScarcity: 24
};

export const DEFAULT_MONTHLY_PLAN: MonthlyPlan = {
  timeBudget: { available: 100, used: 0 },
  energyBudget: { available: 100, used: 0 },
  selectedActionIds: []
};

function createDefaultProjectState(): ProjectState {
  return {
    progress: 0,
    quality: 0,
    completed: false,
    efficiency: 1
  };
}

export function createDefaultProjectPortfolio(): ProjectPortfolioState {
  return {
    projectPractice: createDefaultProjectState(),
    courseStudy: createDefaultProjectState(),
    writing: createDefaultProjectState(),
    openSource: createDefaultProjectState(),
    fitness: createDefaultProjectState(),
    sideBusiness: createDefaultProjectState(),
    aiTooling: createDefaultProjectState()
  };
}
