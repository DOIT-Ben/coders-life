# V6 Post-Audit Remaining Work Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining post-audit gaps after PR #4 by removing residual legacy AI runtime paths, moving executable real-world requirements into structured data, tightening event memory migration, and making release evidence deterministic and reviewable.

**Architecture:** Keep the existing React/Vite/Vitest TypeScript architecture and V1-style UI shell. Treat the merged `fix/v6-followup-remediation` branch as the functional baseline: do not rebuild already closed FOLLOWUP-001 through FOLLOWUP-014 features; instead harden the residual paths that can still undermine audit claims. Each task follows TDD, changes one behavioral boundary, and ends with a focused commit.

**Tech Stack:** TypeScript, React, Vite, Vitest, Node scripts, JSON data under `src/data/realworld`, current game systems under `src/core`, `src/systems`, `src/config`, and `src/storage`.

## Global Constraints

- Base branch is `fix/v6-followup-remediation`; implementation branch is `fix/v6-post-audit-remaining-work`.
- Do not merge PRs or rewrite Git history.
- Preserve old save migration compatibility, including legacy `world.aiReplacement`, `eventMemory`, and old financial fields.
- Preserve existing V1-style interface and mobile layout.
- Do not add features unrelated to the remaining audit gaps.
- Do not satisfy the audit by changing only tests, docs, type declarations, or copy.
- Use TDD: write the failing test, run it and confirm the failure, implement, then rerun.
- Final verification commands: `npm test`, `npm run build`, `npm run simulate`, `npm run simulate:batch`, `git diff --check`.

---

## Audit Closure Matrix

| Audit / Residual ID | Current evidence | Code area | Fix strategy | Test | Acceptance |
|---|---|---|---|---|---|
| POST-001 residual from FOLLOWUP-008 | `world.aiReplacement` still gates core events, state-driven events, real-world event triggers, review tool habits, debug UI, and world status UI | `src/config/events.ts`, `src/config/stateDrivenEvents.ts`, `src/config/realworldEvents.ts`, `src/systems/reviewSystem.ts`, `src/components/WorldStatusBar.tsx`, `src/components/DebugPanel.tsx`, `src/systems/laborMarketSystem.ts`, `src/systems/worldSystem.ts` | Keep `world.aiReplacement` as save-compatible legacy telemetry only; route runtime conditions and UI labels through `laborMarket.aiDisruption` or `deriveRoleAiPressure` | Tests assert events/review/UI source do not depend on high legacy replacement alone, and role pressure still differs by role/company | Raising only `world.aiReplacement` no longer creates AI event pressure, tool-habit warning, or UI-facing AI pressure |
| POST-002 residual from FOLLOWUP-005 | Executable requirements are still hardcoded in `STRUCTURED_REQUIREMENTS` keyed by Chinese display text; source JSON only has free-text `requirement` | `src/data/realworld/realworld_actions.json`, `src/config/realworldActions.ts`, `src/tests/realworldData.test.ts`, `src/tests/realworldConfig.test.ts` | Add explicit `requirements` objects to JSON data and make loader consume them; keep display `requirement` as copy only | Tests load sample JSON rows and assert executable requirements come from `row.requirements`, not text-key map | Runtime rules can be audited directly from data; changing display copy does not change gameplay predicates |
| POST-003 residual from FOLLOWUP-006 | `eventMemory` is still written on new event choices and used as cooldown fallback without targeted migration | `src/systems/eventSystem.ts`, `src/storage/saveManager.ts`, `src/types/game.ts`, `src/tests/realworldEventsEndings.test.ts`, `src/tests/decisionSupport.test.ts` | Stop writing new `eventMemory`; migrate legacy keys into `eventChoiceMemory` and `eventLastTriggeredMonth` only when the key matches known choice memory or cooldown keys | Tests cover old saves with choice memory and cooldown memory, plus new event choice write path | New states keep `eventMemory` stable; old saves still unlock cooldown and choice-count behavior |
| POST-004 residual from FOLLOWUP-005 | Real-world event evidence drops URL/date/type/scope and uses a flat `industry_report` fallback | `src/config/realworldEvents.ts`, `src/config/evidence.ts`, `src/tests/realworldData.test.ts` | Reuse the action evidence classifier for events or extract a shared `createEvidenceMetadata` helper; include URL, date, source type, scope, rationale | Tests assert imported real-world events include sourceType, url/date when present, applicable scope, and rationale | Event evidence is as inspectable as action evidence |
| POST-005 residual from TEST-002 / release gate | Deterministic replay compares final projected state for one sample but does not expose the checked scenario or complete deterministic fields in output | `scripts/simulateBatch.ts`, `src/tests/batchSimulation.test.ts`, `scripts/releaseThresholds.json` | Add release-gate evidence object with deterministic sample metadata, final hash, legal ending families, and scenario coverage counts | Tests assert `releaseGate.evidence` exists and excludes `none` from ending-family counts | Batch output gives reviewers enough data to reproduce the gate without reading script internals |

---

## File Structure

- Modify `src/systems/laborMarketSystem.ts`: expose a safe role-pressure helper that does not fall back to global legacy replacement for configured tracks.
- Modify `src/systems/worldSystem.ts`: keep legacy AI telemetry updated only for old saves/debug compatibility, and update task automation / model fields as the gameplay sources.
- Modify `src/config/events.ts`, `src/config/stateDrivenEvents.ts`, `src/config/realworldEvents.ts`, `src/systems/reviewSystem.ts`: replace runtime conditions using `state.world.aiReplacement`.
- Modify `src/components/WorldStatusBar.tsx` and `src/components/DebugPanel.tsx`: show role AI pressure / market disruption instead of legacy replacement.
- Modify `src/data/realworld/realworld_actions.json`: add `requirements` objects for every row whose display `requirement` is not empty or `无`.
- Modify `src/config/realworldActions.ts`: delete text-key requirement mapping and consume `row.requirements`.
- Modify `src/config/evidence.ts` and `src/config/realworldEvents.ts`: centralize source-type classification and complete event evidence metadata.
- Modify `src/systems/eventSystem.ts` and `src/storage/saveManager.ts`: remove new `eventMemory` writes and migrate legacy memory to split fields.
- Modify `scripts/simulateBatch.ts`: add structured release evidence.
- Modify tests under `src/tests`: focused red/green coverage for each task.

---

### Task 1: Remove Legacy AI Replacement From Runtime Decisions

**Files:**
- Modify: `src/systems/laborMarketSystem.ts`
- Modify: `src/config/events.ts`
- Modify: `src/config/stateDrivenEvents.ts`
- Modify: `src/config/realworldEvents.ts`
- Modify: `src/systems/reviewSystem.ts`
- Modify: `src/components/WorldStatusBar.tsx`
- Modify: `src/components/DebugPanel.tsx`
- Test: `src/tests/realworldKernel.test.ts`
- Test: `src/tests/realworldEventsEndings.test.ts`
- Test: `src/tests/v1FrontendContract.test.ts`

**Interfaces:**
- Produces: `deriveRoleAiPressure(state: GameState): number` remains the authority for AI pressure.
- Produces: `hasAiPressure(state: GameState, threshold: number): boolean` in `src/systems/laborMarketSystem.ts`.
- Consumes: `state.laborMarket.aiDisruption`, `state.world.modelCapability`, `state.world.toolAdoption`, `state.world.organizationReadiness`, `state.world.taskAutomationByRole`, and company profile.

- [ ] **Step 1: Write failing kernel test for legacy-only AI pressure**

```ts
it('does not trigger AI pressure from legacy aiReplacement alone', () => {
  const state = createInitialState('frontend', 'tier2', 20260630);
  state.world.aiReplacement = 95;
  state.world.modelCapability = 10;
  state.world.toolAdoption = 10;
  state.world.organizationReadiness = 10;
  state.laborMarket.aiDisruption = 12;
  state.careerProfile.aiLeverage = 70;

  expect(hasAiPressure(state, 35)).toBe(false);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/tests/realworldKernel.test.ts -t "legacy aiReplacement alone"`

Expected: FAIL because `hasAiPressure` is not exported or still treats legacy replacement as pressure.

- [ ] **Step 3: Implement pressure helper and replace config conditions**

```ts
export function hasAiPressure(state: GameState, threshold: number): boolean {
  return deriveRoleAiPressure(state) >= threshold || state.laborMarket.aiDisruption >= threshold;
}
```

Use `hasAiPressure(state, 35)` in real-world event trigger logic, core AI events, and event-choice conditions. Use `deriveRoleAiPressure(state)` in state-driven AI obsolescence weights and conditions. Use the same helper in `reviewSystem.ts`.

- [ ] **Step 4: Update UI contract test**

Add an assertion to `src/tests/v1FrontendContract.test.ts` that `WorldStatusBar.tsx` does not render or source `state.world.aiReplacement`, and that it references `laborMarket.aiDisruption` or `deriveRoleAiPressure`.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```bash
npm test -- src/tests/realworldKernel.test.ts src/tests/realworldEventsEndings.test.ts src/tests/v1FrontendContract.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/systems/laborMarketSystem.ts src/config/events.ts src/config/stateDrivenEvents.ts src/config/realworldEvents.ts src/systems/reviewSystem.ts src/components/WorldStatusBar.tsx src/components/DebugPanel.tsx src/tests/realworldKernel.test.ts src/tests/realworldEventsEndings.test.ts src/tests/v1FrontendContract.test.ts
git commit -m "fix: route AI pressure through role disruption"
```

---

### Task 2: Move Real-World Action Requirements Into Source Data

**Files:**
- Modify: `src/data/realworld/realworld_actions.json`
- Modify: `src/config/realworldActions.ts`
- Modify: `src/tests/realworldData.test.ts`
- Modify: `src/tests/realworldConfig.test.ts`

**Interfaces:**
- Consumes: `requirements?: ActionRequirements` on each JSON action row.
- Produces: `structuredRequirementsFor(row: RealworldActionRow): ActionRequirements | undefined` that returns `row.requirements`.

- [ ] **Step 1: Write failing data-governance test**

```ts
it('loads executable requirements from source data rather than display text', () => {
  const source = realworldActionsSource;

  expect(source).not.toContain('const STRUCTURED_REQUIREMENTS');
  expect(source).not.toMatch(/Record<string,\s*ActionRequirements>/);

  const githubAction = REALWORLD_ACTIONS.find(action => action.requirements?.inventory === 'github_account');
  expect(githubAction?.requirements).toEqual({ inventory: 'github_account' });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/tests/realworldData.test.ts -t "source data rather than display text"`

Expected: FAIL because `STRUCTURED_REQUIREMENTS` and text trimming still exist.

- [ ] **Step 3: Add JSON requirements fields mechanically**

For every row in `src/data/realworld/realworld_actions.json` where `requirement` is not `""` and not `"无"`, add a `requirements` object equivalent to the current mapping. Examples:

```json
{
  "requirement": "GitHub 账号",
  "requirements": { "inventory": "github_account" }
}
```

```json
{
  "requirement": "有竞争 offer",
  "requirements": { "minOffers": 2 }
}
```

```json
{
  "requirement": "在职或可面试",
  "requirements": { "employmentOrInterview": true }
}
```

- [ ] **Step 4: Replace loader mapping**

Change `RealworldActionRow` to include:

```ts
requirements?: ActionRequirements;
```

Change `structuredRequirementsFor` to:

```ts
export function structuredRequirementsFor(row: RealworldActionRow): ActionRequirements | undefined {
  const displayRequirement = row.requirement.trim();
  if (!displayRequirement || displayRequirement === '无') return undefined;
  return row.requirements;
}
```

Keep `UNMAPPED_REALWORLD_ACTION_REQUIREMENTS` as the build-time guard for rows with display text but no structured object.

- [ ] **Step 5: Tighten config test**

Replace assertions that look for Chinese keys in `realworldActions.ts` with assertions that parse `src/data/realworld/realworld_actions.json` and verify representative rows contain `requirements`.

- [ ] **Step 6: Run focused tests**

Run:

```bash
npm test -- src/tests/realworldData.test.ts src/tests/realworldConfig.test.ts src/tests/realworldKernel.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/data/realworld/realworld_actions.json src/config/realworldActions.ts src/tests/realworldData.test.ts src/tests/realworldConfig.test.ts src/tests/realworldKernel.test.ts
git commit -m "fix: store action requirements as structured data"
```

---

### Task 3: Split Event Memory Migration From New Runtime State

**Files:**
- Modify: `src/systems/eventSystem.ts`
- Modify: `src/storage/saveManager.ts`
- Modify: `src/tests/realworldEventsEndings.test.ts`
- Modify: `src/tests/decisionSupport.test.ts`

**Interfaces:**
- Produces: new states write `eventChoiceMemory`, `eventChainProgress`, and `eventLastTriggeredMonth`.
- Consumes: legacy `eventMemory` only inside save migration and cooldown compatibility.

- [ ] **Step 1: Write failing event-choice test**

```ts
it('records new event choices only in split event choice memory', () => {
  let state = createInitialState('frontend', 'tier2', 20260630);
  state = triggerMonthlyEvent(state, { forceChoice: 'layoff_response' });

  const next = applyEventChoice(state, 'quiet_job_search');

  expect(next.eventChoiceMemory.layoff_response_quiet_job_search).toBe(1);
  expect(next.eventMemory.layoff_response_quiet_job_search).toBeUndefined();
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/tests/decisionSupport.test.ts -t "split event choice memory"`

Expected: FAIL because `applyEventChoice` still writes `eventMemory`.

- [ ] **Step 3: Remove new `eventMemory` writes**

Delete this write from `applyEventChoice`:

```ts
next.eventMemory[choice.memoryKey] = (next.eventMemory[choice.memoryKey] ?? 0) + 1;
```

- [ ] **Step 4: Add migration test for legacy memory**

In `src/tests/realworldEventsEndings.test.ts`, save a legacy state with:

```ts
legacy.eventMemory = {
  health_warning: legacy.month - 2,
  layoff_response_quiet_job_search: 3
};
```

Then load it and assert:

```ts
expect(loaded?.eventLastTriggeredMonth.health_warning).toBe(legacy.month - 2);
expect(loaded?.eventChoiceMemory.layoff_response_quiet_job_search).toBe(3);
```

- [ ] **Step 5: Implement targeted migration**

In `saveManager.ts`, define known cooldown keys from `EVENTS` and known choice memory keys from `EVENT_CHOICES`. During `withDefaults`, merge legacy `eventMemory` keys into the corresponding split field only if the split field does not already contain that key.

- [ ] **Step 6: Run focused tests**

Run:

```bash
npm test -- src/tests/realworldEventsEndings.test.ts src/tests/decisionSupport.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/systems/eventSystem.ts src/storage/saveManager.ts src/tests/realworldEventsEndings.test.ts src/tests/decisionSupport.test.ts
git commit -m "fix: migrate legacy event memory into split fields"
```

---

### Task 4: Complete Real-World Event Evidence Metadata

**Files:**
- Modify: `src/config/evidence.ts`
- Modify: `src/config/realworldActions.ts`
- Modify: `src/config/realworldEvents.ts`
- Modify: `src/tests/realworldData.test.ts`

**Interfaces:**
- Produces: `createEvidenceMetadata(input: EvidenceInput): EvidenceMetadata` in `src/config/evidence.ts`.
- Consumes: action and event source name, URL, date, category, subcategory, confidence, and rationale subject.

- [ ] **Step 1: Write failing metadata test**

```ts
it('attaches structured source metadata to imported real-world events', () => {
  const event = REALWORLD_EVENTS.find(item => item.id === 'realworld_event_0001')!;

  expect(event.evidence?.sourceType).toBeDefined();
  expect(event.evidence?.url).toMatch(/^https?:\/\//);
  expect(event.evidence?.applicableScope?.length).toBeGreaterThan(0);
  expect(event.evidence?.parameterRationale).toContain(event.category ?? 'event');
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/tests/realworldData.test.ts -t "real-world events"`

Expected: FAIL because imported events currently pass only `sourceLevel`, `confidence`, and `source`.

- [ ] **Step 3: Extract shared evidence helper**

Add to `src/config/evidence.ts`:

```ts
export interface EvidenceInput {
  sourceName: string;
  sourceUrl?: string;
  sourceDate?: string;
  category?: string;
  subcategory?: string;
  confidence?: string;
  rationaleSubject: string;
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
```

Move source classification from `realworldActions.ts` into `classifyEvidenceSource`.

- [ ] **Step 4: Use helper for actions and events**

Use `createEvidenceMetadata` in both `realworldActions.ts` and `realworldEvents.ts`, preserving existing action behavior and enriching event behavior.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- src/tests/realworldData.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/config/evidence.ts src/config/realworldActions.ts src/config/realworldEvents.ts src/tests/realworldData.test.ts
git commit -m "fix: enrich realworld event evidence metadata"
```

---

### Task 5: Add Reviewable Release Gate Evidence

**Files:**
- Modify: `scripts/simulateBatch.ts`
- Modify: `src/tests/batchSimulation.test.ts`
- Modify: `scripts/releaseThresholds.json`

**Interfaces:**
- Produces: `releaseGate.evidence` with deterministic sample metadata, ending families, scenario count, and replay hash.

- [ ] **Step 1: Write failing batch test**

```ts
it('reports structured release gate evidence for audit review', () => {
  const result = runBatchSimulation({
    seedsPerScenario: 1,
    strategies: ['stable_cashflow', 'health_first', 'ai_transition'],
    careers: ['frontend'],
    cityTiers: ['tier2'],
    maxMonths: 280
  });

  expect(result.releaseGate.evidence.scenarioCount).toBe(result.scenarioCount);
  expect(result.releaseGate.evidence.endingFamilies.success).toBeGreaterThanOrEqual(1);
  expect(result.releaseGate.evidence.endingFamilies.balanced).toBeGreaterThanOrEqual(1);
  expect(result.releaseGate.evidence.endingFamilies.failure).toBeGreaterThanOrEqual(1);
  expect(result.releaseGate.evidence.endingFamilies.none).toBe(0);
  expect(result.releaseGate.evidence.deterministicReplay.sample.maxMonths).toBeGreaterThan(0);
  expect(result.releaseGate.evidence.deterministicReplay.finalStateHash).toMatch(/^[a-f0-9]{64}$/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/tests/batchSimulation.test.ts -t "release gate evidence"`

Expected: FAIL because `releaseGate.evidence` does not exist.

- [ ] **Step 3: Implement evidence object and deterministic hash**

Use Node `crypto` in `scripts/simulateBatch.ts`:

```ts
import { createHash } from 'node:crypto';
```

Return:

```ts
releaseGate: {
  thresholds,
  passed: releasePassed,
  evidence: {
    scenarioCount,
    endingFamilies: {
      success: successEndingCount,
      balanced: balancedEndingCount,
      failure: failureEndingCount,
      none: endingFrequencies.none ?? 0
    },
    coveredEndings,
    deterministicReplay
  }
}
```

Change `validateDeterministicReplay` to return `{ passed, sample, finalStateHash }` and update the release boolean to use `.passed`.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- src/tests/batchSimulation.test.ts`

Expected: PASS.

- [ ] **Step 5: Run batch smoke command**

Run: `npm run simulate:batch`

Expected: exit code 0 and `releaseGate.passed: true`.

- [ ] **Step 6: Commit**

```bash
git add scripts/simulateBatch.ts src/tests/batchSimulation.test.ts scripts/releaseThresholds.json
git commit -m "test: expose structured release gate evidence"
```

---

### Task 6: Final Verification And Branch Delivery

**Files:**
- No production files unless previous tasks expose a defect.

**Interfaces:**
- Consumes: all previous task commits.
- Produces: pushed branch `fix/v6-post-audit-remaining-work`.

- [ ] **Step 1: Run full test suite**

Run: `npm test`

Expected: all test files pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: exit code 0. Vite chunk-size warning is acceptable if no error is emitted.

- [ ] **Step 3: Run single simulation**

Run: `npm run simulate`

Expected: exit code 0.

- [ ] **Step 4: Run batch simulation gate**

Run: `npm run simulate:batch`

Expected: exit code 0 and `releaseGate.passed: true`.

- [ ] **Step 5: Check whitespace**

Run: `git diff --check`

Expected: no output and exit code 0.

- [ ] **Step 6: Push branch**

Run:

```bash
git push -u origin fix/v6-post-audit-remaining-work
```

Expected: branch pushed. If `gh` authentication is unavailable, report the push result and exact PR base/head instead of claiming PR creation.

---

## Self-Review

- Spec coverage: POST-001 covers remaining old AI runtime paths; POST-002 covers source-data structured requirements; POST-003 covers event memory split and migration; POST-004 covers evidence metadata parity; POST-005 covers release gate reviewability.
- Placeholder scan: This plan intentionally contains no placeholder markers or unspecified test steps.
- Type consistency: All new helper names are declared in task interfaces before later use.
- Risk: Task 2 changes a large JSON file. The implementer should use a scripted mechanical transform for the JSON edit, then inspect representative rows and rely on config tests to catch unmapped requirements.
