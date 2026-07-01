import type { AchievementConfig, ActionConfig, EndingConfig, EventConfig, EvidenceMetadata, GameState, ShopItemConfig } from '../types/game';

export const DEFAULT_EVIDENCE: EvidenceMetadata = {
  sourceLevel: 'synthetic',
  confidence: 'medium'
};

export interface EvidenceInput {
  sourceName: string;
  sourceUrl?: string;
  sourceDate?: string;
  category?: string;
  subcategory?: string;
  confidence?: string;
  rationaleSubject: string;
}

export function classifyEvidenceSource(sourceName: string, sourceUrl?: string): EvidenceMetadata['sourceType'] {
  const text = `${sourceName} ${sourceUrl ?? ''}`.toLowerCase();
  if (sourceName === '经验归纳' || text.includes('v2ex') || text.includes('indiehackers') || text.includes('medium') || text.includes('substack')) return 'community_story';
  if (text.includes('who') || sourceName.includes('国家') || sourceName.includes('卫健委') || sourceName.includes('医保局') || sourceName.includes('cdc') || sourceName.includes('nist')) return 'official_statistics';
  if (text.includes('journal') || text.includes('lancet') || text.includes('jama') || text.includes('nejm') || text.includes('cochrane') || text.includes('nature') || text.includes('psychological') || text.includes('pubmed')) return 'peer_reviewed';
  if (text.includes('hbr') || text.includes('reuters') || text.includes('pew') || text.includes('youtube') || text.includes('linkedin') || text.includes('github') || text.includes('stackoverflow') || text.includes('survey')) return 'industry_survey';
  if (text.includes('blog') || text.includes('news') || text.includes('sina') || text.includes('sohu') || text.includes('toutiao')) return 'media';
  return 'industry_survey';
}

export function createEvidenceMetadata(input: EvidenceInput): EvidenceMetadata {
  const sourceType = classifyEvidenceSource(input.sourceName, input.sourceUrl);
  const confidence = input.confidence === 'high' || input.confidence === 'medium' || input.confidence === 'low' ? input.confidence : 'medium';
  return {
    sourceLevel: sourceType === 'community_story' || sourceType === 'media' ? 'case_study' : sourceType === 'synthetic' ? 'synthetic' : 'industry_report',
    sourceType,
    confidence,
    source: input.sourceName,
    title: input.sourceName,
    url: input.sourceUrl || undefined,
    publicationDate: input.sourceDate || undefined,
    applicableScope: [input.category, input.subcategory].filter((item): item is string => Boolean(item)),
    parameterRationale: `数值由 ${input.sourceName} 对 ${input.rationaleSubject} 的描述映射，并由类别、压力等级和持续时间约束。`,
    verifiedAt: '2026-06-29'
  };
}

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
