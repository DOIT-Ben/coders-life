# CodersLife V6 Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair all findings from `CODERS_LIFE_V6_GAME_RULES_AUDIT_2026-06-28.md`, moving V6 from a playable prototype to a rules-credible programmer life simulator.

**Architecture:** Keep the current React/TypeScript V2/V6 architecture and V1-style UI shell. Fix P0 invariants first, then add real-world simulation layers through small tested systems: finance, household, action requirements, monthly planning, projects, world model, events, values, and balancing.

**Tech Stack:** React, TypeScript, Vite, Vitest, localStorage save migration, deterministic simulation scripts.

## Global Constraints

- Only modify `/root/Codex-Projects/CodersLife-v2.0`; do not modify the V1 project.
- Preserve the V1-style frontend and fixed-height internal scrolling action list.
- Use TDD for every behavior change: failing test, minimal implementation, green test.
- Keep old saves loadable through `saveManager` defaults/migrations.
- Do not expand event content before P0 rule credibility is fixed.
- Prefer small PRs by phase; do not mix P0 invariant fixes with large gameplay redesign.

---

## Audit Coverage Matrix

| Audit ID | Priority | Implementation phase |
|---|---:|---|
| RULE-001 amount fields clamped to 0..100 | P0 | Phase 1 |
| RULE-002 investment return double-counting | P0 | Phase 1 |
| RULE-003 long-term unemployment unreachable | P0 | Phase 1 |
| RULE-004 household pressure contradiction | P0 | Phase 1 |
| RULE-005 text requirements not executable | P0 | Phase 1 |
| VALUE-001 mental health as failure | P0 | Phase 5 |
| ARCH-001 unrelated branch history | P0 | Phase 0 |
| RULE-006 one action per month | P1 | Phase 2 |
| RULE-007 single AI replacement meter | P1 | Phase 3 |
| RULE-008 mechanical age friction | P1 | Phase 3 |
| RULE-009 shallow career/company differences | P1 | Phase 2/3 |
| RULE-010 action as attribute potion | P1 | Phase 2 |
| RULE-011 coarse random event pool | P1 | Phase 4 |
| RULE-012 weak evidence governance | P1 | Phase 4 |
| RULE-013 duplicated state semantics | P1 | Phase 4 |
| RULE-014 shop as permanent stat potion | P2 | Phase 2 |
| VALUE-002 35 crisis as destiny | P1 | Phase 3/5 |
| VALUE-003 AI fear narrative | P1 | Phase 3/5 |
| VALUE-004 narrow success standard | P1 | Phase 5 |
| VALUE-005 default family path | P1 | Phase 1/5 |
| VALUE-006 humiliating humor risk | P2 | Phase 5 |
| ARCH-002 latest dependencies | P1 | Phase 0 |
| TEST-001 single simulation strategy | P1 | Phase 6 |
| TEST-002 missing distribution/invariant tests | P1 | Phase 6 |

## Phase 0: Branch, Documentation, And Reproducibility

**Files:**
- Modify: `package.json`
- Verify: `package-lock.json`
- Optional docs: `docs/audits/CODERS_LIFE_V6_GAME_RULES_AUDIT_2026-06-28.md`

**Deliverable:** The audit report is present on the V6 line, dependencies are reproducible, and execution happens on a repair branch from `feature/realworld-data-import`.

- [ ] Create a repair branch from `feature/realworld-data-import`: `fix/v6-audit-remediation-p0`.
- [ ] Merge or cherry-pick audit document commit `64928864ee9f887cd1a69988b543959d59e4a15c` if the document is not already present.
- [ ] Replace every `latest` dependency in `package.json` with the exact version resolved in `package-lock.json`.
- [ ] Run `npm ci`, `npm test`, `npm run build`, and `git diff --check`.
- [ ] Commit with `chore: lock v6 dependencies and audit baseline`.

## Phase 1: P0 Rule Credibility Fixes

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/systems/actionRuleSystem.ts`
- Modify: `src/systems/economySystem.ts`
- Modify: `src/systems/careerSystem.ts`
- Modify: `src/config/realworldEndings.ts`
- Modify: `src/systems/lifePressureSystem.ts`
- Modify: `src/systems/relationshipSystem.ts`
- Modify: `src/config/realworldActions.ts`
- Modify: `src/storage/saveManager.ts`
- Test: `src/tests/realworldKernel.test.ts`
- Test: `src/tests/realworldConfig.test.ts`
- Test: `src/tests/realworldEventsEndings.test.ts`

**Interfaces:**
- Add `HouseholdState` to `GameState`.
- Add `ActionRequirements` to `ActionConfig`.
- Add career counters: `pendingApplications`, `totalApplications`, `totalInterviews`, `totalOffers`.
- Add save defaults for all new fields.

**Deliverable:** P0 bugs are covered by regression tests and fixed without changing major UI.

- [ ] Write failing tests proving finance amount fields are not clamped to 100.
- [ ] Replace generic nested numeric merge with domain-specific normalizers:
  - `mergeFinanceState()` keeps money fields in yuan scale.
  - `mergeScoreState()` clamps only score-like fields to `0..100`.
  - `mergeLifePressureState()` clamps pressure indices to `0..100`.
- [ ] Write failing asset-conservation tests for portfolio return.
- [ ] Change monthly portfolio return so it modifies `portfolio` only; cash receives salary, passive income, and expenses only.
- [ ] Write failing tests for reachable and unreachable long-term unemployment endings.
- [ ] Split job search state into pending and lifetime counters; make long-term unemployment use `monthsUnemployed`, lifetime applications, and low cash.
- [ ] Write failing tests for no-partner/no-child household state.
- [ ] Add minimal `HouseholdState`; stop automatic partner support and child pressure when corresponding household state is absent.
- [ ] Write failing tests for action requirements such as employed-only, min cash, min tech, min AI, inventory requirement, and household requirement.
- [ ] Convert supported real-world requirements into structured `ActionRequirements`; expose `require` and `disabledReason` from mapped actions.
- [ ] Add a config test listing unparsed legacy requirement text so it is visible and not silently treated as executable.
- [ ] Run `npm test`, `npm run simulate`, `npm run build`, and `git diff --check`.
- [ ] Commit with `fix: repair p0 realworld rule invariants`.

## Phase 2: Real Decision Loop And Action Outcomes

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/core/gameEngine.ts`
- Modify: `src/core/monthlyLoop.ts`
- Create: `src/systems/monthlyPlanSystem.ts`
- Create: `src/systems/projectSystem.ts`
- Modify: `src/config/actions.ts`
- Modify: `src/config/realworldActions.ts`
- Modify: `src/config/shop.ts`
- Modify: UI action panel inside `src/App.tsx`
- Test: `src/tests/engine.test.ts`
- Test: `src/tests/decisionSupport.test.ts`
- Test: `src/tests/v1FrontendContract.test.ts`

**Interfaces:**
- Add `MonthlyPlan` with `timeBudget`, `energyBudget`, and selected action IDs.
- Add `planMonth(state, actionIds)` as the new main monthly execution API.
- Keep `applyAction(state, actionId)` as a compatibility wrapper for one-action execution.
- Add `ProjectState` and `ProjectEffect` for staged outcomes.

**Deliverable:** Players can make a monthly plan with multiple realistic actions; durable outcomes come from progress, not one-click stat potions.

- [ ] Add tests for monthly time/energy budget limits and over-budget rejection.
- [ ] Implement `monthlyPlanSystem` to calculate fixed obligations and remaining budget from employment, household, health, commute, and company type.
- [ ] Update UI to show remaining time/energy while preserving fixed-height categorized action lists.
- [ ] Add tests that project, course, writing, open source, fitness, and side business actions advance progress instead of instantly granting final rewards.
- [ ] Implement `projectSystem` with staged progress, completion quality, and outcome conversion.
- [ ] Rework shop items into durable goods, subscriptions, services, education, insurance, and housing.
- [ ] Add tests proving chair, course, insurance, AI Pro, and housing items affect conditions/efficiency/cost rather than permanent raw stat boosts.
- [ ] Run `npm test`, `npm run simulate`, `npm run build`, and `git diff --check`.
- [ ] Commit with `feat: add monthly planning and staged outcomes`.

## Phase 3: World, Career, AI, And Age Model

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/systems/worldSystem.ts`
- Modify: `src/systems/laborMarketSystem.ts`
- Modify: `src/systems/careerSystem.ts`
- Modify: `src/config/careers.ts`
- Modify: `src/config/realworldCareer.ts`
- Modify: `src/config/realworldCompanies.ts`
- Test: `src/tests/realworldKernel.test.ts`

**Interfaces:**
- Expand `WorldState` with `modelCapability`, `toolAdoption`, `organizationReadiness`, `regulationTrust`, and `taskAutomationByRole`.
- Add `CompanyProfile` effects for salary, overtime, layoffs, promotion, learning time, and psychological safety.
- Add career route identifiers for testing, data engineering, security, mobile, embedded, SRE, technical management, industry expert, and indie developer.

**Deliverable:** AI and age become external/systemic forces rather than destiny meters; companies and careers create real strategic differences.

- [ ] Add tests proving AI pressure differs by role, company type, and organization readiness.
- [ ] Replace monotonic `aiReplacement` as the sole source of AI disruption with derived AI pressure by role/task.
- [ ] Add tests proving age does not directly reduce skill or employability without market/company/context factors.
- [ ] Rework `ageFriction` into external hiring bias plus market pressure, offset by career capital, domain expertise, and network.
- [ ] Add tests for company-type effects: startup, big tech, foreign company, traditional enterprise, outsourcing, public-sector tech.
- [ ] Implement company profile modifiers for salary, overtime risk, layoff risk, learning time, promotion, and psychological safety.
- [ ] Add route definitions and transition costs for expanded career ecosystem.
- [ ] Run `npm test`, `npm run simulate`, `npm run build`, and `git diff --check`.
- [ ] Commit with `feat: model ai adoption age bias and company rules`.

## Phase 4: Events, Evidence, And State Semantics

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/systems/eventSystem.ts`
- Modify: `src/config/realworldEvents.ts`
- Modify: `src/config/realworldParser.ts`
- Modify: `src/data/realworld/*`
- Create: `src/systems/derivedStateSystem.ts`
- Test: `src/tests/realworldData.test.ts`
- Test: `src/tests/realworldEventsEndings.test.ts`

**Interfaces:**
- Add `EvidenceMetadata`.
- Add event intensity fields: `baseRate`, `exposure`, `cooldownKey`, `mutuallyExclusiveTags`.
- Add derived-state functions for burnout risk, employability, career stability, health debt, and life satisfaction.

**Deliverable:** Events become state-driven and data-backed; duplicated state becomes traceable and easier to calibrate.

- [ ] Add tests for evidence metadata presence and allowed confidence/source levels.
- [ ] Add schema-style validation for actions, events, endings, achievements, shop items, and source metadata.
- [ ] Convert event triggering to intensity calculation: base rate, world cycle, exposure, history, cooldown, and mutual exclusion.
- [ ] Ensure health events require health exposure, family events require household state, and layoff events require company/market/career risk.
- [ ] Create `derivedStateSystem` and move repeated formulas into derived computations.
- [ ] Update UI summaries to display derived explanations instead of raw duplicate metrics where feasible.
- [ ] Run `npm test`, `npm run simulate`, `npm run build`, and `git diff --check`.
- [ ] Commit with `feat: add evidence metadata and state-driven events`.

## Phase 5: Values, Endings, And Narrative Repair

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/config/endings.ts`
- Modify: `src/config/realworldEndings.ts`
- Modify: `src/config/achievements.ts`
- Modify: `src/systems/endingSystem.ts`
- Modify: `src/systems/achievementSystem.ts`
- Modify: `src/App.tsx`
- Test: `src/tests/realworldEventsEndings.test.ts`
- Test: `src/tests/v1FrontendContract.test.ts`

**Interfaces:**
- Add `PlayerValueProfile` with weighted goals: wealth, craft, stability, freedom, relationships, health, impact, exploration.
- Add `CrisisState` for burnout, mental health, severe illness, and major unemployment chapters.

**Deliverable:** The game no longer treats mental health, age, AI, or family as moral failure/destiny; success is evaluated against player values.

- [ ] Add tests proving burnout/mental-health crisis can enter recovery instead of always ending the game immediately.
- [ ] Rewrite mental health and health shutdown endings into crisis paths unless hard fail conditions are reached.
- [ ] Replace "35 crisis" achievements/copy with career transition, transferable ability, and industry downturn framing.
- [ ] Rewrite AI copy to emphasize task restructuring, organizational adoption, judgment, responsibility, and domain knowledge.
- [ ] Add value-profile selection or gradual value formation.
- [ ] Make endings include value-goal fit, not only money, title, tech, and AI.
- [ ] Review failure and humor copy so jokes target systems/processes rather than unemployment, illness, or family hardship.
- [ ] Run `npm test`, `npm run simulate`, `npm run build`, and `git diff --check`.
- [ ] Commit with `feat: add values-based endings and respectful crisis arcs`.

## Phase 6: Simulation, Balancing, And Release Gate

**Files:**
- Modify: `scripts/simulate.ts`
- Create: `scripts/simulateBatch.ts`
- Create: `src/systems/autoChoiceSystem.ts` extensions
- Test: `src/tests/realworldKernel.test.ts`

**Deliverable:** Rule changes are measurable across strategies, seeds, careers, and cities before release.

- [ ] Add auto strategies: stable cashflow, career sprint, health first, relationship first, AI transition, indie/side-business, random baseline, extreme repeated action.
- [ ] Add batch simulation over all careers, city tiers, and at least 1000 seeds per strategy for release checks.
- [ ] Output distributions for bankruptcy, burnout, health crisis, unemployment duration, first offer time, net worth at 45, value-goal fit, ending frequencies, and repeated-action dominance.
- [ ] Add invariant checks: all percentage fields in `0..100`, no impossible household pressure, no unreachable endings, deterministic replay.
- [ ] Define release thresholds in a JSON config so future balance changes fail loudly.
- [ ] Run full release gate: `npm test`, `npm run simulate`, batch simulation, `npm run build`, `git diff --check`.
- [ ] Commit with `test: add v6 balance simulation gate`.

## Final Acceptance Criteria

- All audit IDs RULE-001 through RULE-014, VALUE-001 through VALUE-006, ARCH-001/002, and TEST-001/002 have direct tests, code changes, or documented branch-governance resolution.
- Existing V1-style UI remains usable and does not regress fixed-height action scrolling.
- Old saves continue to load with sensible defaults.
- P0 invariants pass in unit tests and long simulation.
- Every ending has at least one reachable path and mutually exclusive endings do not trigger together.
- Dependency installation is reproducible with `npm ci`.
- Production deployment only happens after `npm test`, `npm run simulate`, batch simulation, `npm run build`, and HTTP asset verification pass.
