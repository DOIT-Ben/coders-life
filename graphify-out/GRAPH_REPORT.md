# Graph Report - E:\desktop\coders-life  (2026-06-18)

## Corpus Check
- 14 files · ~112,916 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1342 nodes · 4419 edges · 17 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 115 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `g()` - 163 edges
2. `A()` - 133 edges
3. `T()` - 106 edges
4. `E()` - 85 edges
5. `C()` - 75 edges
6. `st()` - 68 edges
7. `re()` - 57 edges
8. `O()` - 46 edges
9. `xT` - 46 edges
10. `iC()` - 41 edges

## Surprising Connections (you probably didn't know these)
- `ct()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 14_
- `so()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 12_
- `Uo()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 5_
- `A()` --calls--> `x()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 2_
- `zl()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 3_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (255): A(), Ab(), AC(), ap(), Ar(), As(), Aw(), B() (+247 more)

### Community 1 - "Community 1"
Cohesion: 0.03
Nodes (25): countBy(), bc(), Bo(), CC(), Cx, Dc(), eC(), eO (+17 more)

### Community 2 - "Community 2"
Cohesion: 0.03
Nodes (23): injectIntoFirstJsonLine(), AE, BE, dE, FE, gx, Hx, jE (+15 more)

### Community 3 - "Community 3"
Cohesion: 0.03
Nodes (23): ao(), Bl(), et(), Fd(), fl(), gl(), hl(), IO (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.03
Nodes (82): normalizeText(), parseCandidateLines(), readRows(), writeCandidateFile(), assertDailyGoalState(), assertUnlocked(), createDocument(), createGameContext() (+74 more)

### Community 5 - "Community 5"
Cohesion: 0.04
Nodes (11): at(), jO(), Ko(), Ml(), oO, QO(), rt(), Sx() (+3 more)

### Community 6 - "Community 6"
Cohesion: 0.04
Nodes (37): assertBuildFailedWith(), assertBuildSucceeded(), copyRecursive(), makeWorkspace(), countJsonlCandidates(), readJson(), countGoalEvents(), createDocument() (+29 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (8): CO, dO, eb(), he(), ib(), qv(), tO, tx

### Community 8 - "Community 8"
Cohesion: 0.04
Nodes (11): CE, el(), Jx, kl(), LC(), nl(), Ol(), Ql() (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (40): assertBuildScriptUsesAtomicWrites(), createHarness(), createStorage(), ElementStub, extractInlineScript(), readSave(), testCorruptLegacySaveIsBackedUp(), testCorruptV2SaveIsBackedUp() (+32 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (6): cl(), dl(), hO, mo(), VO(), yo()

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (14): Commit-AtomicFile(), Decode-Utf8Base64(), Get-LifeExtensionItems(), Get-ResearchExtensionItems(), Get-Round10LearningItems(), Get-Round11LifeItems(), Get-Round7CommunityItems(), Get-Round8CommunityItems() (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (1): so()

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (16): ah(), Ch(), dh(), fh(), hh(), Il(), kh(), lh() (+8 more)

### Community 14 - "Community 14"
Cohesion: 0.49
Nodes (1): ct()

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 15`** (1 nodes): `程序员生存模拟器_弹窗库_2026-06-18.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `parse-popup-pool.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `g()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 9`, `Community 12`, `Community 13`, `Community 14`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `Ix` connect `Community 1` to `Community 0`, `Community 9`, `Community 4`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `oO` connect `Community 5` to `Community 0`, `Community 1`, `Community 3`, `Community 8`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `A()` (e.g. with `.insertBefore()` and `.appendChild()`) actually correct?**
  _`A()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._