import rows from '../data/realworld/realworld_life_milestones.json';
import { numberFrom } from './realworldParser';

export interface LifeStageConfig {
  ageMin: number;
  ageMax: number;
  stageName: string;
  typicalPressure: string;
  opportunities: string;
  risks: string;
  gameRuleSuggestion: string;
  notes: string;
  sourceName: string;
  sourceUrl: string;
  confidence: string;
}

interface LifeStageRow {
  age_min: string;
  age_max: string;
  stage_name: string;
  typical_pressure: string;
  opportunities: string;
  risks: string;
  game_rule_suggestion: string;
  notes: string;
  source_name: string;
  source_url: string;
  confidence: string;
}

function mapLifeStage(row: LifeStageRow): LifeStageConfig {
  const corpus = Object.values(row).filter(Boolean).join(';');
  const confidence = ['high', 'medium', 'low', '高', '中', '低'].includes(row.confidence) ? row.confidence : 'high';
  return {
    ageMin: numberFrom(row.age_min),
    ageMax: numberFrom(row.age_max),
    stageName: row.stage_name,
    typicalPressure: row.typical_pressure || corpus,
    opportunities: row.opportunities || corpus,
    risks: corpus,
    gameRuleSuggestion: row.game_rule_suggestion,
    notes: row.notes,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    confidence
  };
}

export const LIFE_STAGES: LifeStageConfig[] = (rows as LifeStageRow[]).map(mapLifeStage);

export function findLifeStage(age: number): LifeStageConfig | undefined {
  return LIFE_STAGES.find(item => age >= item.ageMin && age <= item.ageMax);
}
