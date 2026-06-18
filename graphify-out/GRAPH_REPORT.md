# Graph Report - E:\desktop\coders-life  (2026-06-18)

## Corpus Check
- 13 files · ~108,161 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1330 nodes · 4383 edges · 16 communities detected
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 105 edges (avg confidence: 0.8)
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
- `ct()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 13_
- `so()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 8_
- `Uo()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 1_
- `A()` --calls--> `x()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 2_
- `zl()` --calls--> `A()`  [EXTRACTED]
  E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js → E:\desktop\coders-life\graphify-out\vendor\vis-network.min.js  _Bridges community 0 → community 6_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (255): A(), Ab(), AC(), ap(), Ar(), As(), Aw(), B() (+247 more)

### Community 1 - "Community 1"
Cohesion: 0.03
Nodes (18): at(), Bo(), hO, iC(), jO(), Ko(), Ml(), mo() (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.02
Nodes (21): injectIntoFirstJsonLine(), AE, BE, dE, FE, gx, he(), Hx (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.03
Nodes (48): assertBuildScriptUsesAtomicWrites(), countBy(), createHarness(), createStorage(), ElementStub, extractInlineScript(), readSave(), testCorruptLegacySaveIsBackedUp() (+40 more)

### Community 4 - "Community 4"
Cohesion: 0.03
Nodes (24): ao(), Bl(), cl(), dl(), et(), Fd(), fl(), gl() (+16 more)

### Community 5 - "Community 5"
Cohesion: 0.03
Nodes (78): parseCandidateLines(), readRows(), writeCandidateFile(), assertDailyGoalState(), assertUnlocked(), createDocument(), createGameContext(), createLocalStorage() (+70 more)

### Community 6 - "Community 6"
Cohesion: 0.04
Nodes (12): CO, dO, eb(), ib(), kl(), qv(), Qx, Rl() (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.04
Nodes (30): normalizeText(), assertBuildFailedWith(), assertBuildSucceeded(), copyRecursive(), makeWorkspace(), countGoalEvents(), createDocument(), createGameContext() (+22 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (8): CE, el(), LC(), nl(), Ol(), Ql(), so(), Tl()

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (14): Commit-AtomicFile(), Decode-Utf8Base64(), Get-LifeExtensionItems(), Get-ResearchExtensionItems(), Get-Round10LearningItems(), Get-Round11LifeItems(), Get-Round7CommunityItems(), Get-Round8CommunityItems() (+6 more)

### Community 10 - "Community 10"
Cohesion: 0.16
Nodes (12): bc(), CC(), Dc(), eC(), mc(), nC(), oC(), pc() (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (16): ah(), Ch(), dh(), fh(), hh(), Il(), kh(), lh() (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (5): Kf(), Qf(), uE, uf(), Wf()

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

- **Why does `Ix` connect `Community 3` to `Community 0`, `Community 1`, `Community 10`, `Community 5`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `g()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 10`, `Community 11`, `Community 13`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `tT` connect `Community 1` to `Community 0`, `Community 4`, `Community 6`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `A()` (e.g. with `.insertBefore()` and `.appendChild()`) actually correct?**
  _`A()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._