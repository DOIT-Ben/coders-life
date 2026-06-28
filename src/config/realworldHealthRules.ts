import rows from '../data/realworld/realworld_health_rules.json';
import { listFrom } from './realworldShared';

export interface HealthRuleConfig {
  factor: string;
  condition: string;
  shortTermEffect: string;
  longTermEffect: string;
  gameRuleSuggestion: string;
  affectedStats: string[];
  sourceName: string;
  sourceUrl: string;
  confidence: string;
}

interface HealthRuleRow {
  factor: string;
  condition: string;
  short_term_effect: string;
  long_term_effect: string;
  game_rule_suggestion: string;
  affected_stats: string;
  source_name: string;
  source_url: string;
  confidence: string;
}

function mapHealthRule(row: HealthRuleRow): HealthRuleConfig {
  return {
    factor: row.factor,
    condition: row.condition,
    shortTermEffect: row.short_term_effect,
    longTermEffect: row.long_term_effect,
    gameRuleSuggestion: row.game_rule_suggestion,
    affectedStats: listFrom(row.affected_stats),
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    confidence: row.confidence
  };
}

export const HEALTH_RULES: HealthRuleConfig[] = (rows as HealthRuleRow[]).map(mapHealthRule);

export function findHealthRulesByFactor(factor: string): HealthRuleConfig[] {
  return HEALTH_RULES.filter(item => item.factor === factor);
}
