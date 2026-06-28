import failEndingsCsv from '../data/realworld/fail_endings.csv?raw';
import type { EndingConfig } from '../types/game';
import { parseCsv } from './realworldParser';

interface FailEndingRow {
  ending_id: string;
  title: string;
  category: EndingConfig['category'];
  success_level: string;
  required_conditions: string;
  avoid_conditions: string;
  ending_text: string;
  value_message: string;
  real_world_reference: string;
}

function conditionFor(id: string): EndingConfig['condition'] {
  if (id === 'burnout_collapse') return state => state.stats.burnout >= 85 && state.stats.health <= 25 && state.stats.mental <= 20;
  if (id === 'cash_flow_bankrupt') return state => state.stats.cash <= 0;
  if (id === 'skill_obsolete') return state => state.age >= 38 && state.stats.techXp <= 80 && state.stats.aiXp <= 30;
  if (id === 'relationship_bankrupt') return state => state.age >= 35 && state.stats.relation <= 10;
  if (id === 'startup_failure') return state => state.flags.venture_status === 'closed' || (state.age >= 35 && state.stats.cash <= 50000 && state.career.employmentStatus === 'founder');
  if (id === 'long_term_unemployed') return state => state.career.employmentStatus === 'jobless' && state.career.offerAttempts >= 30 && state.stats.cash <= 100000;
  if (id === 'health_shutdown') return state => state.stats.health <= 15;
  if (id === 'ai_left_behind') return state => state.age >= 40 && state.world.aiReplacement >= 65 && state.stats.aiXp <= 25;
  if (id === 'debt_trap') return state => state.stats.cash <= -100000;
  return state => state.gameOver && false;
}

export const REALWORLD_FAIL_ENDINGS: EndingConfig[] = parseCsv(failEndingsCsv).map(row => {
  const typed = row as unknown as FailEndingRow;
  return {
    id: typed.ending_id,
    title: typed.title,
    category: typed.category,
    condition: conditionFor(typed.ending_id),
    text: `${typed.ending_text} ${typed.value_message}`
  };
});

export const REALWORLD_FAIL_ENDING_COUNT = REALWORLD_FAIL_ENDINGS.length;
