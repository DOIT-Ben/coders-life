import rows from '../data/realworld/realworld_city_costs.json';
import { numberFrom } from './realworldParser';
import { rangeFrom, type NumericRange } from './realworldShared';

export interface CityCostConfig {
  city: string;
  cityTier: string;
  rentShared: NumericRange;
  rentSingle: NumericRange;
  foodMonth: NumericRange;
  transportMonth: NumericRange;
  medicalMonth: NumericRange;
  socialLifeMonth: NumericRange;
  baseLivingCostMonth: NumericRange;
  avgCommuteMinutes: number;
  pressureScore: number;
  opportunityScore: number;
  notes: string;
  sourceName: string;
  sourceUrl: string;
  sourceDate: string;
  confidence: string;
}

interface CityCostRow {
  city: string;
  city_tier: string;
  rent_shared: string;
  rent_single: string;
  food_month: string;
  transport_month: string;
  medical_month: string;
  social_life_month: string;
  base_living_cost_month: string;
  avg_commute_minutes: string;
  pressure_score: string;
  opportunity_score: string;
  notes: string;
  source_name: string;
  source_url: string;
  source_date: string;
  confidence: string;
}

function mapCityCost(row: CityCostRow): CityCostConfig {
  return {
    city: row.city,
    cityTier: row.city_tier,
    rentShared: rangeFrom(row.rent_shared),
    rentSingle: rangeFrom(row.rent_single),
    foodMonth: rangeFrom(row.food_month),
    transportMonth: rangeFrom(row.transport_month),
    medicalMonth: rangeFrom(row.medical_month),
    socialLifeMonth: rangeFrom(row.social_life_month),
    baseLivingCostMonth: rangeFrom(row.base_living_cost_month),
    avgCommuteMinutes: numberFrom(row.avg_commute_minutes),
    pressureScore: numberFrom(row.pressure_score),
    opportunityScore: numberFrom(row.opportunity_score),
    notes: row.notes,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    sourceDate: row.source_date,
    confidence: row.confidence
  };
}

export const CITY_COSTS: CityCostConfig[] = (rows as CityCostRow[]).map(mapCityCost);

export function findCityCost(city: string): CityCostConfig | undefined {
  return CITY_COSTS.find(item => item.city === city);
}
