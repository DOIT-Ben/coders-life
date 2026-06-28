import type { GameState } from '../types/game';
import { clamp } from '../core/formulas';
import { getCompanyProfile } from '../config/realworldCompanies';

export function deriveRoleAiPressure(state: GameState): number {
  const company = getCompanyProfile(state.career.companyType);
  const roleAutomation = state.world.taskAutomationByRole[state.career.track] ?? state.world.aiReplacement;
  const capability = state.world.modelCapability * 0.35;
  const adoption = state.world.toolAdoption * 0.22;
  const readiness = state.world.organizationReadiness * 0.2;
  const companyAdoption = company.aiAdoption * 0.18;
  const regulationDrag = (100 - state.world.regulationTrust) * 0.05;
  return clamp(roleAutomation * 0.35 + capability + adoption + readiness + companyAdoption + regulationDrag - state.careerProfile.aiLeverage * 0.18, 0, 100);
}

export function settleLaborMarket(state: GameState): GameState {
  const next = structuredClone(state);
  const company = getCompanyProfile(state.career.companyType);
  const economyPressure = state.world.economyCycle === 'boom' ? -10 : state.world.economyCycle === 'neutral' ? 0 : state.world.economyCycle === 'recession' ? 18 : 32;
  const roleAiPressure = deriveRoleAiPressure(state);
  const skillGap = Math.max(0, roleAiPressure - state.careerProfile.aiLeverage);
  const weakEmployability = Math.max(0, 50 - state.careerProfile.employability) * 0.35;
  const demand = state.world.marketHeat - economyPressure * 0.5 - skillGap * 0.12;
  const hiringBias = Math.max(0, state.age - 35) * 1.8;
  const marketBias = economyPressure * 0.3 + company.layoffRisk * 0.08;
  const capitalOffset = state.careerProfile.careerCapital * 0.22 + state.socialProfile.networkStrength * 0.12 + state.careerProfile.skillFreshness * 0.12;
  const ageFriction = clamp(hiringBias + marketBias - capitalOffset, 0, 100);
  const jobOpenings = clamp(demand - ageFriction * 0.18, 0, 100);

  next.laborMarket = {
    jobOpenings,
    demandIndex: clamp(demand, 0, 100),
    aiDisruption: roleAiPressure,
    salaryPressure: clamp(50 - economyPressure * 0.7 + state.careerProfile.employability * 0.18 - ageFriction * 0.12, 0, 100),
    ageFriction,
    hiringStrictness: clamp(42 + economyPressure + skillGap * 0.18 + company.layoffRisk * 0.08 - company.psychologicalSafety * 0.04, 0, 100),
    layoffPressure: clamp(state.laborMarket.layoffPressure * 0.55 + economyPressure + weakEmployability + skillGap * 0.16 + company.layoffRisk * 0.18, 0, 100),
    freelanceDemand: clamp(state.world.marketHeat - economyPressure * 0.25 + state.careerProfile.careerCapital * 0.12, 0, 100)
  };

  next.careerProfile.layoffRisk = clamp(
    state.careerProfile.layoffRisk * 0.62 + next.laborMarket.layoffPressure * 0.32 + weakEmployability + company.layoffRisk * 0.08,
    0,
    100
  );
  next.careerProfile.skillFreshness = clamp(state.careerProfile.skillFreshness + (company.learningTime - 1) * 1.2, 0, 100);
  next.lifePressure.timeScarcity = clamp(state.lifePressure.timeScarcity + company.overtimeRisk * 0.04 - company.psychologicalSafety * 0.025, 0, 100);
  return next;
}
