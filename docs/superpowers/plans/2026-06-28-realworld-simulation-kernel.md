# Realworld Simulation Kernel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the real-world simulation kernel described in `docs/superpowers/specs/2026-06-28-realworld-simulation-kernel-design.md`.

**Architecture:** Preserve the existing React/Vite frontend and V2 engine entry points while adding typed nested state, JSON-backed real-world configs, a staged monthly causal pipeline, state-driven events/endings, and a compact UI pressure summary.

**Tech Stack:** TypeScript, React, Vite, Vitest, JSON data modules, localStorage save migration.

## Global Constraints

- Only modify `/root/Codex-Projects/CodersLife-v2.0`.
- Preserve the single production URL: `https://doitbenai.cloud/`.
- Keep old saves loadable through default hydration.
- Keep V1-style frontend; no broad visual redesign.
- Run `npm test`, `npm run simulate`, and `npm run build` before deployment.
- Use Git commits after each completed phase.

---

### Task 1: State Model And Save Migration

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/core/gameEngine.ts`
- Modify: `src/storage/saveManager.ts`
- Test: `src/tests/realworldKernel.test.ts`

**Interfaces:**
- Produces `FinanceState`, `HealthProfile`, `CareerProfile`, `SocialProfile`, `LaborMarketState`, `LifePressureState`.
- Produces `DEFAULT_REALWORLD_STATE` helpers via initial state and save hydration.

- [ ] Write failing tests proving initial state and legacy saves include all nested states.
- [ ] Implement typed nested state interfaces and defaults.
- [ ] Hydrate missing nested states in save loading.
- [ ] Run targeted tests and commit.

### Task 2: Real-World Configuration Loaders

**Files:**
- Create: `src/config/realworldCareer.ts`
- Create: `src/config/realworldCities.ts`
- Create: `src/config/realworldCompanies.ts`
- Create: `src/config/realworldHealthRules.ts`
- Create: `src/config/realworldLifeStages.ts`
- Test: `src/tests/realworldConfig.test.ts`

**Interfaces:**
- Produces typed config arrays and lookup helpers for career roles, city costs, company archetypes, health rules, and life stages.

- [ ] Write failing tests for counts, key samples, and lookup helpers.
- [ ] Generate JSON modules from existing CSV files if needed.
- [ ] Implement loaders and helper functions.
- [ ] Run targeted tests and commit.

### Task 3: Monthly Causal Pipeline

**Files:**
- Modify: `src/core/monthlyLoop.ts`
- Create: `src/systems/laborMarketSystem.ts`
- Create: `src/systems/financeSystem.ts`
- Create: `src/systems/healthDebtSystem.ts`
- Create: `src/systems/relationshipSystem.ts`
- Create: `src/systems/lifePressureSystem.ts`
- Modify: `src/systems/careerSystem.ts`
- Test: `src/tests/realworldKernel.test.ts`

**Interfaces:**
- Keeps `settleMonth(state: GameState): GameState`.
- Adds systems named in the design pipeline.

- [ ] Write failing tests for overtime debt, unemployment cashflow stress, recession layoff pressure, nutrition/health recovery, and age pressure.
- [ ] Implement staged pipeline and system modules.
- [ ] Ensure deterministic simulation reaches age 45 without crashing.
- [ ] Run targeted tests and commit.

### Task 4: Action Consequences

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/systems/actionRuleSystem.ts`
- Modify: `src/config/realworldActions.ts`
- Test: `src/tests/realworldKernel.test.ts`

**Interfaces:**
- Adds optional `realworldEffect` to `ActionConfig`.
- `resolveActionEffect` updates nested states through action consequences.

- [ ] Write failing tests for action immediate, latent, and opportunity effects.
- [ ] Map key real-world action subcategories into nested state changes.
- [ ] Preserve existing visible effects and action history.
- [ ] Run targeted tests and commit.

### Task 5: State-Driven Events And Endings

**Files:**
- Modify: `src/systems/eventSystem.ts`
- Modify: `src/config/realworldEvents.ts`
- Modify: `src/config/realworldEndings.ts`
- Modify: `src/systems/endingSystem.ts`
- Test: `src/tests/realworldEventsEndings.test.ts`

**Interfaces:**
- Produces state-sensitive event weights/conditions.
- Uses long-term state combinations for real-world fail and reflective endings.

- [ ] Write failing tests for health warning, layoff, referral/opportunity, AI skill-obsolescence, and fail endings.
- [ ] Implement state-driven weighting and conditions.
- [ ] Keep rare event repeat suppression.
- [ ] Run targeted tests and commit.

### Task 6: UI Pressure Summary

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`
- Test: `src/tests/v1FrontendContract.test.ts`

**Interfaces:**
- Adds a compact existing-style panel showing cashflow stress, health debt, career risk, relationship support, and labor market pressure.

- [ ] Write failing frontend contract tests for visible pressure labels and no V2 implementation jargon.
- [ ] Add compact panel to existing game shell.
- [ ] Keep mobile-safe layout and no floating tooltips.
- [ ] Run targeted tests and commit.

### Task 7: Final Verification And Deployment

**Files:**
- No source edits unless verification finds a bug.

- [ ] Run `npm test`.
- [ ] Run `npm run simulate`.
- [ ] Run `npm run build`.
- [ ] Backup `/var/www/coderslife/current`.
- [ ] Deploy `dist/` to `/var/www/coderslife/current`.
- [ ] Run `nginx -t` and reload Nginx.
- [ ] Verify `https://doitbenai.cloud/`, asset 200, `/v2/` redirects to `/`, and `8080` remains down.
- [ ] Commit final fixes if any.
