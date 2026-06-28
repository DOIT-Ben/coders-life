import { describe, expect, it } from 'vitest';
import { CAREER_ROLES, findCareerRole } from '../config/realworldCareer';
import { CITY_COSTS, findCityCost } from '../config/realworldCities';
import { COMPANY_ARCHETYPES, findCompanyArchetype } from '../config/realworldCompanies';
import { HEALTH_RULES, findHealthRulesByFactor } from '../config/realworldHealthRules';
import { LIFE_STAGES, findLifeStage } from '../config/realworldLifeStages';

describe('real-world configuration loaders', () => {
  it('loads career role salary bands with lookup helpers', () => {
    expect(CAREER_ROLES.length).toBeGreaterThan(10);

    const role = findCareerRole({ track: '前端开发', cityTier: '一线', companyType: '互联网中厂', levelKeyword: '中级' });

    expect(role).toMatchObject({
      role: '前端工程师',
      track: '前端开发',
      cityTier: '一线',
      companyType: '互联网中厂',
      typicalSalaryMonth: expect.any(Number),
      confidence: 'high'
    });
    expect(role?.typicalSalaryMonth).toBeGreaterThan(15000);
    expect(role?.requiredSkillTags).toContain('TypeScript');
  });

  it('loads city cost profiles with numeric ranges', () => {
    expect(CITY_COSTS.length).toBeGreaterThan(5);

    const beijing = findCityCost('北京');

    expect(beijing).toMatchObject({
      city: '北京',
      cityTier: '一线',
      avgCommuteMinutes: 47,
      pressureScore: 92,
      opportunityScore: 95
    });
    expect(beijing?.baseLivingCostMonth.min).toBeGreaterThan(8000);
    expect(beijing?.rentSingle.max).toBeGreaterThan(6000);
  });

  it('loads company archetypes with risk and reward coefficients', () => {
    expect(COMPANY_ARCHETYPES.length).toBeGreaterThan(5);

    const bigTech = findCompanyArchetype('大厂');
    const foreign = findCompanyArchetype('外企');

    expect(bigTech?.salaryCoef).toBeGreaterThan(1.3);
    expect(bigTech?.overtimeRisk).toBeGreaterThan(80);
    expect(foreign?.stabilityScore).toBeGreaterThan(80);
    expect(foreign?.politicsPressure).toBeLessThan(40);
  });

  it('loads health rules grouped by factor', () => {
    expect(HEALTH_RULES.length).toBeGreaterThan(10);

    const sleepRules = findHealthRulesByFactor('睡眠不足');

    expect(sleepRules.length).toBeGreaterThanOrEqual(2);
    expect(sleepRules[0]).toMatchObject({
      factor: '睡眠不足',
      affectedStats: expect.arrayContaining(['mental', 'focus', 'burnout']),
      confidence: 'high'
    });
  });

  it('loads life stages by age range', () => {
    expect(LIFE_STAGES.length).toBeGreaterThan(4);

    const pressureStage = findLifeStage(33);

    expect(pressureStage).toMatchObject({
      ageMin: 31,
      ageMax: 35,
      stageName: '压力成型期',
      confidence: 'high'
    });
    expect(pressureStage?.risks).toContain('35岁');
  });
});
