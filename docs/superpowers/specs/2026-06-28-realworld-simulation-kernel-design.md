# Realworld Simulation Kernel Design

## Summary

CodersLife V2 already imports the curated real-world datasets, but the runtime still behaves mostly like a direct stat modifier game. This design upgrades the core into a realistic programmer-life simulation kernel: actions change hidden real-world pressures, monthly settlement propagates those pressures through finance, health, career, relationship, labor market, and life-stage systems, and events/endings emerge from those states.

The project remains a client-only Vite/React/TypeScript game. The V1-style frontend is preserved. This work changes the simulation engine first, then exposes a small set of real-world pressure summaries in the existing UI.

## Goals

- Make the world feel causal: outcomes should be explainable from accumulated choices and external conditions, not random stat swings.
- Use the real-world datasets as rule sources for career, city, company, health, life-stage, actions, events, and endings.
- Preserve existing saves through migration defaults.
- Keep the current single public deployment model: `https://doitbenai.cloud/`.
- Keep tests and deterministic simulation as release gates.

## Non-Goals

- No backend, account system, cloud save, leaderboard, or multiplayer.
- No real-time AI-generated content.
- No complete frontend redesign.
- No detailed stock, mortgage, or tax simulator beyond the level needed for programmer-life realism.
- No direct reproduction of real tragedy cases or personal names in generated events.

## Design Principles

- Health, relationship, and meaning are hard constraints, not flavor stats.
- Money increases options but is not the only success axis.
- AI is neither monster nor savior; it changes the value of judgment, learning, and work shape.
- Failure states must have dignity. The game can be tragic without humiliating the player.
- Short-term optimization should often create long-term debt.

## State Model

Existing `GameState.stats`, `career`, `world`, and `hidden` stay for compatibility and UI continuity. Add typed nested state:

```ts
interface FinanceState {
  monthlySalary: number;
  monthlyFixedCost: number;
  monthlyRent: number;
  monthlyDebtPayment: number;
  debt: number;
  emergencyFundMonths: number;
  cashflowStress: number; // 0-100
}

interface HealthProfile {
  sleepDebt: number; // 0-100
  sedentaryLoad: number; // 0-100
  exerciseHabit: number; // 0-100
  nutritionQuality: number; // 0-100
  chronicRisk: number; // 0-100
  recoveryQuality: number; // 0-100
}

interface CareerProfile {
  roleKey: string;
  companyArchetype: string;
  performance: number; // 0-100
  promotionReadiness: number; // 0-100
  skillFreshness: number; // 0-100
  employability: number; // 0-100
  monthsUnemployed: number;
  interviewMomentum: number; // 0-100
}

interface SocialProfile {
  familyResponsibility: number; // 0-100
  partnerSupport: number; // 0-100
  friendSupport: number; // 0-100
  loneliness: number; // 0-100
  relationshipDebt: number; // 0-100
}

interface LaborMarketState {
  jobOpenings: number; // 0-100
  salaryPressure: number; // 0-100
  layoffPressure: number; // 0-100
  ageFriction: number; // 0-100
  aiDisruption: number; // 0-100
}

interface LifePressureState {
  stagePressure: number; // 0-100
  housingPressure: number; // 0-100
  parentCarePressure: number; // 0-100
  childCarePressure: number; // 0-100
  commutePressure: number; // 0-100
}
```

`saveManager` must hydrate missing fields for old saves. No old save may crash or overwrite V1 save keys.

## Data Configuration

Use the current real-world assets as source data:

- `01_career_roles.csv` / generated JSON: salary bands, tracks, levels, required skills, risk tags.
- `02_city_costs.csv`: living cost, rent, commute, pressure/opportunity score.
- `03_company_types.csv`: salary, learning, stability, overtime, layoff, politics, AI pressure coefficients.
- `04_actions.csv` plus supplementary nutrition/addiction actions: player action inputs.
- `05_events.jsonl`: state-driven event content.
- `06_health_rules.csv`: rule references for sleep, sedentary behavior, exercise, nutrition, addiction, stress.
- `07_life_milestones.csv`: age-stage pressure modifiers.
- `08_endings.csv` plus `fail_endings.csv`: ending pool.
- `09_worldview.md`: tone and value constraints.

The engine should consume generated JSON modules, not raw CSV imports, so tests, browser runtime, and Node simulations share the same path.

## Monthly Pipeline

Replace the shallow settlement with a staged causal pipeline:

```text
advanceWorld
-> settleLaborMarket
-> settleFixedFinance
-> settleActionConsequences
-> settleHealthDebt
-> settleRelationshipDebt
-> settleCareerProgress
-> triggerStateDrivenEvents
-> settleLifeStagePressure
-> addPeriodicReviews
-> checkAchievements
-> checkEndings
```

Each stage is a focused system module. The public `settleMonth(state)` remains the single entry point.

## Action Semantics

Actions produce three kinds of effects:

- `immediateEffect`: visible current-month impact.
- `latentEffect`: hidden debt or capital such as sleep debt, relationship debt, skill freshness, recovery quality.
- `opportunityEffect`: changes future probabilities such as internal referral, promotion, layoff avoidance, health warning, side-income upside.

Existing `ActionConfig.visibleEffect` stays as compatibility output. Add optional `realworldEffect`:

```ts
interface RealworldActionEffect {
  finance?: Partial<FinanceState>;
  health?: Partial<HealthProfile>;
  career?: Partial<CareerProfile>;
  social?: Partial<SocialProfile>;
  laborMarket?: Partial<LaborMarketState>;
  lifePressure?: Partial<LifePressureState>;
  opportunityTags?: string[];
}
```

Examples:

- Overtime increases short-term performance and cash but raises sleep debt, sedentary load, relationship debt, and chronic risk.
- Exercise raises fatigue immediately but improves exercise habit, recovery quality, and chronic risk over time.
- Short videos briefly buffer mental strain but reduce focus and recovery quality; repeats raise addiction recovery pressure.
- Technical writing increases fatigue now but grows reputation, employability, and opportunity tags.

## Finance System

Finance calculates:

- salary from role, level, city, company type, economy cycle, AI pressure, and employability;
- fixed costs from city, rent profile, subscriptions, family pressure, and age stage;
- debt payments and cashflow stress;
- emergency fund months.

Cashflow stress rises when emergency fund months are low, fixed costs exceed income, debt grows, or unemployment persists. It affects mental state, relationship pressure, and event weights.

## Health System

Health becomes debt-based:

- sleep debt accumulates from overtime, high-stress actions, digital entertainment repeats, and poor recovery;
- sedentary load accumulates from work and screen-heavy recovery;
- exercise habit and nutrition quality decay slowly unless maintained;
- chronic risk grows from long-term sleep debt, sedentary load, stress, smoking/alcohol/sugar actions, and low medical prevention;
- recovery quality determines whether rest actually restores mental/health or only numbs burnout.

Visible `health`, `mental`, and `burnout` are outputs of these underlying pressures.

## Career System

Career progression uses:

- role and company archetype;
- performance and promotion readiness;
- skill freshness, AI skill, portfolio, reputation, and interview momentum;
- labor market job openings, salary pressure, age friction, and layoffs.

Job hunting should be probabilistic but explainable. A player with strong skills, portfolio, reputation, referrals, and market heat should see higher interview and offer odds. Long unemployment should damage confidence and cashflow, not instantly end the game.

## Labor Market And World System

World state evolves independently:

- economy cycle changes market heat, salary pressure, layoff pressure, and freelance demand;
- AI disruption increases over time but affects roles differently;
- age friction rises by life stage and is softened by skill freshness, reputation, AI competence, and network support;
- company type modifies overtime, learning, stability, politics, and layoff risks.

The world should not feel fair. It should still be legible.

## Relationship And Life Pressure

Relationships are not a single `relation` number. Social state tracks support and debt:

- friend/family/partner support can protect mental state and job opportunities;
- relationship debt grows when high-stress work repeatedly displaces social/family actions;
- loneliness grows when social support is low and screen-based recovery dominates;
- family responsibility and life-stage pressure increase medical, parent-care, housing, and childcare events.

The game must not treat single, married, divorced, childfree, or family-focused choices as moral ranks.

## Events

Events become state-driven:

- `pressure events`: health warning, family conflict, rent pressure, deadline crisis.
- `opportunity events`: referral, open-source exposure, side-income order, mentor.
- `shock events`: layoffs, AI reorg, medical expense, market downturn.

Event weight is a function of state, not just rarity. Rare events still use `seenEvents` to avoid repeat spam.

Examples:

- High sleep debt + chronic risk raises health warning events.
- Low market heat + high company layoff risk raises layoff events.
- High reputation + social support raises referral and opportunity events.
- High age friction + low skill freshness raises skill-obsolescence events.

## Endings

Endings evaluate long-term state combinations:

- Tech endings require skill depth, AI competence, freshness, and health above collapse thresholds.
- Balance endings require cashflow stability, health, relationship support, and boundary.
- Capital/indie endings require runway, reputation, portfolio, and debt control.
- Fail endings use dignified tragic/mixed framing and trigger from persistent risk combinations.

Ordering matters: early catastrophic endings can trigger before age 45, but most reflective endings trigger at age milestones.

## UI Changes

Preserve V1-style frontend. Add one compact “现实压力” section:

- cashflow stress / emergency fund months;
- health debt / recovery quality;
- career risk / employability;
- relationship support / relationship debt;
- labor market pressure.

Action cards should eventually show real-world tradeoffs: immediate gain, hidden debt, future opportunity/risk. This is secondary to engine correctness.

## Testing

Required tests:

- old saves hydrate all new nested states;
- every real-world config file has expected counts and key samples;
- overtime for multiple months raises sleep debt, relationship debt, and chronic risk;
- exercise/nutrition improves long-term health profile without pure positive immediate effect;
- low emergency fund and unemployment raise cashflow stress;
- recession + risky company raises layoff event weight;
- high reputation/social support raises opportunity event weight;
- high AI disruption + low AI skill raises skill-obsolescence risk;
- 22-to-45 deterministic simulation does not crash;
- build passes with JSON data modules.

Release verification remains:

```bash
npm test
npm run simulate
npm run build
nginx -t
```

## Rollout Plan

Implement as five reviewable phases:

1. State model and save migration.
2. Real-world config loaders for career, city, company, health, and life stage.
3. Monthly causal pipeline and finance/health/career/social/labor systems.
4. State-driven events and expanded ending conditions.
5. Compact UI exposure and action-card tradeoff copy.

Each phase must have tests and a Git commit. Deploy only after all verification commands pass.

## Acceptance Criteria

- The game can explain why a bad thing happened from accumulated choices and world state.
- Repeated high-pressure play produces realistic delayed costs.
- Recovery actions differ meaningfully: numbing, body repair, mind repair, nutrition, addiction recovery.
- Career outcomes depend on skills, market, company, city, age friction, AI, reputation, and network.
- Money matters through runway and optionality, not as the only win state.
- The single production URL remains `https://doitbenai.cloud/`.
