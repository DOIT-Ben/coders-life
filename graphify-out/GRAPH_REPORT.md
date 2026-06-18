# Graph Report - E:\desktop\coders-life  (2026-06-18)

## Corpus Check
- 12 files · ~92,182 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 214 nodes · 337 edges · 15 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]

## God Nodes (most connected - your core abstractions)
1. `createGameContext()` - 30 edges
2. `createHarness()` - 23 edges
3. `createGameContext()` - 11 edges
4. `createGameContext()` - 11 edges
5. `Try-ParseJsonLine()` - 9 edges
6. `createGameContext()` - 8 edges
7. `FakeElement` - 7 edges
8. `createGameContext()` - 7 edges
9. `FakeElement` - 7 edges
10. `parseSave()` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (33): assertDailyGoalCore(), createDocument(), createGameContext(), createLocalStorage(), createSteppedDateClass(), extractInlineScript(), parseSave(), testBackupCanRestoreWhenCorruptMainRemovalFails() (+25 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (14): Commit-AtomicFile(), Decode-Utf8Base64(), Get-LifeExtensionItems(), Get-ResearchExtensionItems(), Get-Round10LearningItems(), Get-Round11LifeItems(), Get-Round7CommunityItems(), Get-Round8CommunityItems() (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (24): createHarness(), createStorage(), extractInlineScript(), readSave(), testCorruptLegacySaveIsBackedUp(), testCorruptV2SaveIsBackedUp(), testFutureSchemaIsNotOverwrittenWhenFutureBackupFails(), testFutureSchemaIsPreservedInFutureSlotBeforeOverwrite() (+16 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (2): copyRecursive(), makeWorkspace()

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (13): createDocument(), createGameContext(), createLocalStorage(), extractInlineScript(), FakeElement, parseSave(), testConsumedResumeSuggestionDoesNotRepeatAfterReload(), testFollowingResumeSuggestionCreatesOneShotFeedback() (+5 more)

### Community 5 - "Community 5"
Cohesion: 0.17
Nodes (12): assertDailyGoalState(), assertUnlocked(), createDocument(), createGameContext(), createLocalStorage(), createStableMath(), extractInlineScript(), FakeElement (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (10): createDocument(), createGameContext(), createLocalStorage(), createStableMath(), extractInlineScript(), FakeElement, parseSave(), testCoreActionSaveAndRestoreFlow() (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.38
Nodes (13): createDocument(), createGameContext(), createLocalStorage(), createStableMath(), extractInlineScript(), hasLog(), parseSave(), testLearningRhythmAddsSmallFeedbackAndPersists() (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.2
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (1): FakeElement

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (1): FakeElement

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (1): ElementStub

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 13`** (1 nodes): `程序员生存模拟器_弹窗库_2026-06-18.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `parse-popup-pool.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `FakeElement` connect `Community 11` to `Community 0`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `ElementStub` connect `Community 12` to `Community 2`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._