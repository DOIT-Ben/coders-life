import type { AchievementConfig, ActionConfig, EndingConfig, EventConfig, EvidenceMetadata, GameState, ShopItemConfig } from '../types/game';

export const DEFAULT_EVIDENCE: EvidenceMetadata = {
  sourceLevel: 'synthetic',
  confidence: 'medium'
};

export function withActionEvidence(action: ActionConfig, evidence: EvidenceMetadata = DEFAULT_EVIDENCE): ActionConfig {
  return { ...action, evidence: action.evidence ?? evidence };
}

export function withEventEvidence(event: EventConfig, evidence: EvidenceMetadata = DEFAULT_EVIDENCE): EventConfig {
  const baseRate = event.baseRate ?? (typeof event.weight === 'number' ? Math.max(0.01, event.weight / 10) : 0.18);
  return {
    ...event,
    baseRate,
    exposure: event.exposure ?? defaultExposure(event),
    cooldownKey: event.cooldownKey ?? defaultCooldownKey(event),
    cooldownMonths: event.cooldownMonths ?? (event.rarity === 'rare' ? 36 : event.type === 'major' ? 18 : 6),
    mutuallyExclusiveTags: event.mutuallyExclusiveTags ?? defaultMutualExclusionTags(event),
    evidence: event.evidence ?? evidence
  };
}

export function withEndingEvidence(ending: EndingConfig, evidence: EvidenceMetadata = DEFAULT_EVIDENCE): EndingConfig {
  return { ...ending, evidence: ending.evidence ?? evidence };
}

export function withAchievementEvidence(achievement: AchievementConfig, evidence: EvidenceMetadata = DEFAULT_EVIDENCE): AchievementConfig {
  return { ...achievement, evidence: achievement.evidence ?? evidence };
}

export function withShopEvidence(item: ShopItemConfig, evidence: EvidenceMetadata = DEFAULT_EVIDENCE): ShopItemConfig {
  return { ...item, evidence: item.evidence ?? evidence };
}

function defaultExposure(event: EventConfig): (state: GameState) => number {
  if (event.category === 'health' || event.id.includes('health') || event.id.includes('illness')) {
    return state => Math.max(state.healthProfile.healthDebt, 100 - state.stats.health) / 100;
  }
  if (event.id.includes('family')) {
    return state => (state.household.hasParents || state.household.hasPartner || state.household.children > 0) ? 1 : 0;
  }
  if (event.id.includes('layoff') || event.category === 'career') {
    return state => Math.max(state.laborMarket.layoffPressure, state.careerProfile.layoffRisk) / 100;
  }
  return () => 1;
}

function defaultMutualExclusionTags(event: EventConfig): string[] {
  if (event.category === 'health' || event.id.includes('health') || event.id.includes('illness')) return ['health_alert'];
  if (event.id.includes('layoff')) return ['layoff_alert'];
  if (event.id.includes('family')) return ['family_alert'];
  return [];
}

function defaultCooldownKey(event: EventConfig): string {
  const tags = defaultMutualExclusionTags(event);
  if (tags.includes('health_alert')) return 'health_warning';
  if (tags.includes('layoff_alert')) return 'layoff_pressure';
  if (tags.includes('family_alert')) return 'family_pressure';
  return event.chain ?? event.id;
}
