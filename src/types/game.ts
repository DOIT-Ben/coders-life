export type ID = string;

export type CityTier = 'tier1' | 'tier2' | 'tier3';
export type EconomyCycle = 'boom' | 'neutral' | 'recession' | 'crisis';
export type EmploymentStatus = 'student' | 'jobless' | 'employed' | 'freelance' | 'founder' | 'retired';
export type CompanyType = 'none' | 'startup' | 'private' | 'bigtech' | 'foreign';
export type CareerTrack = 'frontend' | 'backend' | 'fullstack' | 'ai_product';
export type LifePhaseId = 'seed' | 'growth' | 'crisis' | 'choice' | 'after45';
export type LogType = 'info' | 'good' | 'warn' | 'bad' | 'event' | 'unlock' | 'ending';
export type PopupRarity = 'common' | 'uncommon' | 'rare';
export type PopupKind = 'event' | 'health' | 'joke' | 'learning' | 'life';
export type ActionPrimaryCategory = 'growth' | 'career' | 'income' | 'recovery' | 'relationship_safety';
export type ActionSubcategory =
  | 'foundations'
  | 'ai_tools'
  | 'portfolio'
  | 'visibility'
  | 'job_search'
  | 'daily_work'
  | 'deep_work'
  | 'job_change'
  | 'side_income'
  | 'second_curve'
  | 'venture'
  | 'cash_management'
  | 'digital_entertainment'
  | 'media_reading'
  | 'body_repair'
  | 'mind_repair'
  | 'nutrition'
  | 'addiction_recovery'
  | 'life_ritual'
  | 'outdoor_nature'
  | 'maker_hobby'
  | 'friendship'
  | 'family'
  | 'network'
  | 'safety_net'
  | 'life_admin';
export type ActionStressLevel = 0 | 1 | 2 | 3;

export interface WorldState {
  aiReplacement: number;
  economyCycle: EconomyCycle;
  cycleMonth: number;
  marketHeat: number;
}

export interface PlayerStats {
  techXp: number;
  aiXp: number;
  reputationXp: number;
  mental: number;
  health: number;
  burnout: number;
  relation: number;
  identity: number;
  cash: number;
  portfolio: number;
  passiveIncomeMonthly: number;
}

export interface CareerState {
  track: CareerTrack;
  jobLevel: number;
  companyType: CompanyType;
  employmentStatus: EmploymentStatus;
  monthsInJob: number;
  cityTier: CityTier;
  portfolioCount: number;
  offerAttempts: number;
  promotionScore: number;
}

export interface FinanceState {
  monthlyIncome: number;
  monthlySalary: number;
  monthlyFixedCost: number;
  monthlyRent: number;
  monthlyDebtPayment: number;
  emergencyFundMonths: number;
  debt: number;
  cashflowStress: number;
}

export interface HealthProfile {
  sleepDebt: number;
  sedentaryLoad: number;
  nutritionQuality: number;
  exerciseHabit: number;
  chronicStress: number;
  chronicRisk: number;
  recoveryQuality: number;
  healthDebt: number;
}

export interface CareerProfile {
  roleKey: CareerTrack;
  companyArchetype: string;
  performance: number;
  employability: number;
  aiLeverage: number;
  deliveryReliability: number;
  promotionReadiness: number;
  skillFreshness: number;
  monthsUnemployed: number;
  interviewMomentum: number;
  layoffRisk: number;
  careerCapital: number;
}

export interface SocialProfile {
  familySupport: number;
  partnerSupport: number;
  friendSupport: number;
  networkStrength: number;
  loneliness: number;
  relationshipDebt: number;
  safetyNet: number;
}

export interface LaborMarketState {
  jobOpenings: number;
  demandIndex: number;
  aiDisruption: number;
  salaryPressure: number;
  ageFriction: number;
  hiringStrictness: number;
  layoffPressure: number;
  freelanceDemand: number;
}

export interface LifePressureState {
  stagePressure: number;
  agePressure: number;
  familyResponsibility: number;
  housingPressure: number;
  parentCarePressure: number;
  childCarePressure: number;
  commutePressure: number;
  comparisonPressure: number;
  timeScarcity: number;
}

export interface GameLog {
  id: string;
  month: number;
  age: number;
  type: LogType;
  title: string;
  text: string;
}

export interface PendingEffect {
  id: string;
  dueMonth: number;
  text: string;
  effect: EffectDelta;
}

export interface HiddenState {
  focus: number;
  fatigue: number;
  boundaryScore: number;
  buildProjectState: number;
  toolHabitState: number;
  lastWeeklyReviewMonth: number;
  lastPhaseReview?: LifePhaseId;
}

export interface ActionHistoryEntry {
  id: ID;
  repeatKey: string;
  primaryCategory: ActionPrimaryCategory;
  subcategory: ActionSubcategory;
  stressLevel: ActionStressLevel;
  month: number;
}

export interface GameState {
  version: string;
  seed: number;
  month: number;
  age: number;
  phase: LifePhaseId;
  world: WorldState;
  stats: PlayerStats;
  career: CareerState;
  finance: FinanceState;
  healthProfile: HealthProfile;
  careerProfile: CareerProfile;
  socialProfile: SocialProfile;
  laborMarket: LaborMarketState;
  lifePressure: LifePressureState;
  flags: Record<string, boolean | number | string>;
  cooldowns: Record<string, number>;
  inventory: Record<string, number>;
  unlockedAchievements: string[];
  seenEvents: string[];
  eventMemory: Record<string, number>;
  pendingEffects: PendingEffect[];
  actionHistory: ActionHistoryEntry[];
  hidden: HiddenState;
  logs: GameLog[];
  gameOver: boolean;
  endingId?: string;
}

export interface EffectDelta {
  techXp?: number;
  aiXp?: number;
  reputationXp?: number;
  mental?: number;
  health?: number;
  burnout?: number;
  relation?: number;
  identity?: number;
  cash?: number;
  portfolio?: number;
  passiveIncomeMonthly?: number;
  portfolioCount?: number;
  offerAttempts?: number;
  promotionScore?: number;
  monthsInJob?: number;
  focus?: number;
  fatigue?: number;
  boundaryScore?: number;
  buildProjectState?: number;
  toolHabitState?: number;
  setEmploymentStatus?: EmploymentStatus;
  setCompanyType?: CompanyType;
  setJobLevel?: number;
  setFlag?: Record<string, boolean | number | string>;
}

export interface RealworldEffectDelta {
  finance?: Partial<FinanceState>;
  healthProfile?: Partial<HealthProfile>;
  careerProfile?: Partial<CareerProfile>;
  socialProfile?: Partial<SocialProfile>;
  laborMarket?: Partial<LaborMarketState>;
  lifePressure?: Partial<LifePressureState>;
}

export interface ActionConfig {
  id: ID;
  name: string;
  icon: string;
  group: 'learn' | 'work' | 'recover' | 'career' | 'money' | 'relationship';
  primaryCategory: ActionPrimaryCategory;
  subcategory: ActionSubcategory;
  tags: string[];
  stressLevel: ActionStressLevel;
  repeatKey: string;
  benefitLabel: string;
  riskLabel: string;
  durationMonths: number;
  description: string;
  visibleEffect: EffectDelta;
  hiddenEffect?: EffectDelta;
  realworldEffect?: RealworldEffectDelta;
  cooldownMonths?: number;
  require?: (state: GameState) => boolean;
  disabledReason?: (state: GameState) => string | undefined;
}

export interface EventConfig {
  id: ID;
  title: string;
  chain?: string;
  type: 'daily' | 'triggered' | 'random' | 'major';
  category?: string;
  source?: 'core' | 'popup_pool' | 'realworld_data';
  rarity?: PopupRarity;
  kind?: PopupKind;
  weight: number | ((state: GameState) => number);
  condition?: (state: GameState) => boolean;
  effect: EffectDelta | ((state: GameState) => EffectDelta);
  text: string | ((state: GameState) => string);
  once?: boolean;
}

export interface PopupPoolItem {
  id: number;
  text: string;
  category: string;
  kind: PopupKind;
  tone: string;
  rarity: PopupRarity;
  effect: {
    skill?: number;
    mental?: number;
    money?: number;
    ai?: number;
  };
  trigger?: {
    minDay?: number;
  };
  source_version?: string;
  source_scope?: string;
}

export interface ShopItemConfig {
  id: ID;
  category: 'equipment' | 'learning' | 'health' | 'risk' | 'housing' | 'relationship' | 'subscription';
  name: string;
  price: number;
  description: string;
  maxCount?: number;
  monthlyCost?: number;
  effect: EffectDelta;
  require?: (state: GameState) => boolean;
}

export interface AchievementConfig {
  id: ID;
  icon: string;
  name: string;
  description: string;
  condition: (state: GameState) => boolean;
  reward?: EffectDelta;
}

export interface EndingConfig {
  id: ID;
  title: string;
  category: 'fail' | 'normal' | 'tech' | 'capital' | 'balance' | 'hidden';
  condition: (state: GameState) => boolean;
  text: string;
}
