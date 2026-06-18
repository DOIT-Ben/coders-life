# Graph Report - E:\desktop\coders-life  (2026-06-18)

## Corpus Check
- 13 files · ~111,749 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1339 nodes · 4415 edges · 16 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 113 edges (avg confidence: 0.8)
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
- `it()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 5_
- `ct()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 13_
- `so()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 11_
- `Uo()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 6_
- `A()` --calls--> `x()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 2_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (253): A(), Ab(), AC(), ap(), Ar(), As(), Aw(), B() (+245 more)

### Community 1 - "Community 1"
Cohesion: 0.02
Nodes (38): Bl(), CE, cl(), dl(), dO, eb(), el(), fl() (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.03
Nodes (18): AE, BE, dE, FE, gx, he(), Hx, jE (+10 more)

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (23): bc(), Bo(), CC(), Cx, Dc(), eC(), eO, iC() (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.03
Nodes (87): normalizeText(), parseCandidateLines(), readRows(), writeCandidateFile(), assertDailyGoalState(), assertUnlocked(), createDocument(), createGameContext() (+79 more)

### Community 5 - "Community 5"
Cohesion: 0.03
Nodes (14): ao(), CO, et(), Fd(), gl(), IO, it(), Jx (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (10): at(), jO(), Ko(), Ml(), oO, QO(), rt(), tp (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.04
Nodes (41): assertBuildScriptUsesAtomicWrites(), createHarness(), createStorage(), ElementStub, extractInlineScript(), readSave(), testCorruptLegacySaveIsBackedUp(), testCorruptV2SaveIsBackedUp() (+33 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (31): assertBuildFailedWith(), assertBuildSucceeded(), copyRecursive(), injectIntoFirstJsonLine(), makeWorkspace(), countGoalEvents(), createDocument(), createGameContext() (+23 more)

### Community 9 - "Community 9"
Cohesion: 0.1
Nodes (4): hO, mo(), VO(), yo()

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (14): Commit-AtomicFile(), Decode-Utf8Base64(), Get-LifeExtensionItems(), Get-ResearchExtensionItems(), Get-Round10LearningItems(), Get-Round11LifeItems(), Get-Round7CommunityItems(), Get-Round8CommunityItems() (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (1): so()

### Community 12 - "Community 12"
Cohesion: 0.16
Nodes (16): ah(), Ch(), dh(), fh(), hh(), Il(), kh(), lh() (+8 more)

### Community 13 - "Community 13"
Cohesion: 0.49
Nodes (1): ct()

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 14`** (1 nodes): `程序员生存模拟器_弹窗库_2026-06-18.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `parse-popup-pool.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `g()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 11`, `Community 12`, `Community 13`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `Ix` connect `Community 7` to `Community 0`, `Community 1`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `dO` connect `Community 1` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `A()` (e.g. with `.insertBefore()` and `.appendChild()`) actually correct?**
  _`A()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._