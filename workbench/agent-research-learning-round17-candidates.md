# 程序员学习/AI工具/开源/副项目/面试复盘/知识管理/转型焦虑弹窗候选 Round 17

研究子智能体 B 产出。本文件仅作为 `workbench` 候选材料，不进入正式数据池，不修改 HTML、tools、data。候选基于公开社区经验帖、博客和讨论做原创改写，不复制原帖原文。

## 来源列表

- DEV Community：多篇 tutorial hell 逃离经验，重点是从跟教程转向自己构建、拆问题和容忍失败。https://dev.to/ikechukwu/how-to-escape-tutorial-hell-4pi2
- DEV Community：学习者自述“看很多教程但做不出来”，强调自驱项目和文档实验。https://dev.to/swastikyadav/how-to-pull-yourself-out-of-the-tutorial-hell-4nm2
- freeCodeCamp：避免 tutorial hell 的项目化学习方法，先想项目、自己尝试、再看教程。https://www.freecodecamp.org/news/how-to-learn-from-coding-tutorials-and-avoid-tutorial-hell/
- freeCodeCamp：教程会带来虚假掌握感，真正的学习发生在从零构建和排错中。https://www.freecodecamp.org/news/how-to-break-free-from-tutorial-hell/
- Reddit r/learnprogramming：学习者关于 tutorial hell、从教程转项目、拆小范围练习的经验讨论。https://www.reddit.com/r/learnprogramming/comments/1e40e8g/leave_tutorial_hell_heres_how_i_did/
- Reddit r/cscareerquestions：电话面试复盘、紧张、行为题表达和练习不足等真实求职失败经验。https://www.reddit.com/r/cscareerquestions/comments/fmkd61/phone_screen_postmortem/
- Reddit r/cscareerquestions：生产事故后的焦虑、post-mortem、少自责多补流程的讨论。https://www.reddit.com/r/cscareerquestions/comments/13lc6j6/how_to_deal_with_anxiety_of_letting_a_mistake_get/
- Reddit r/ExperiencedDevs：资深开发者关于 AI 工具、学习新技术、倦怠和“自觉过时”的讨论。https://www.reddit.com/r/ExperiencedDevs/comments/1jzpzkm/ai_tools_are_ironically_way_more_useful_for/
- Reddit r/ExperiencedDevs：AI 工具在成熟开源仓库里可能带来额外核验成本的讨论。https://www.reddit.com/r/ExperiencedDevs/comments/1lwk503/study_experienced_devs_think_they_are_24_faster/
- Stack Overflow Blog：开发者使用 AI 增多但信任下降，需要人工核验、测试和上下文判断。https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/
- Stack Overflow Blog：第二大脑和开发者知识管理，强调检索、复用与信息负担。https://stackoverflow.blog/2022/10/03/two-heads-are-better-than-one-what-second-brains-say-about-how-developers-work/
- Addy Osmani Blog：未来两年软件工程与 AI、初级岗位、AI 辅助开发边界和工程判断。https://addyosmani.com/blog/next-two-years/
- Lobsters：开源维护者疲劳、AI 贡献、项目边界与维护成本讨论。https://lobste.rs/s/p9i6g3/open_source_developers_are_exhausted
- Lobsters：AI 贡献策略、质量标准和维护者核验成本讨论。https://lobste.rs/s/240z81/our_ai_policy_vs_code_conduct_vs_reality
- Hacker News：AI 对开源开发速度、维护者倦怠和 review 成本的社区讨论。https://news.ycombinator.com/item?id=44560740
- Hacker News：副项目最后 30% 难完成，范围、计划和防止 scope creep 的讨论。https://news.ycombinator.com/item?id=41010229
- DEV Community：副项目即使未完成也能带来学习、试错和技术栈探索价值。https://dev.to/andyhaskell/what-you-can-get-out-of-doing-a-side-project-even-if-you-don-t-finish-17cf
- Daniel Gregory Blog：副项目燃尽经验，强调节奏、范围和休息。https://danielgregory.dev/the-ultimate-guide-to-avoiding-side-project-burnout/
- Raul Melo Blog：从 npm/yarn 切换到 pnpm 的真实工具链迁移经验和权衡。https://raulmelo.me/en/blog/making-the-switch-to-pnpm
- Reddit r/node：pnpm 迁移的实际用户反馈，速度收益与迁移成本并存。https://www.reddit.com/r/node/comments/144xqd8/is_pnpm_really_leaves_up_to_its_hype_are_yarn_npm/
- Benoit Pasquier Blog：程序员不必人人都有副项目，健康节奏和自我选择同样重要。https://benoitpasquier.com/2019/10/software-engineer-its-okay-to-not-have-a-side-project/
- Reddit r/PKMS：第二大脑、笔记系统和信息过载导致“笔记比脑子还乱”的真实抱怨。https://www.reddit.com/r/PKMS/comments/1g1de00/is_the_whole_second_brain_concept_supposed_to/

## 主题簇总结

- 教程地狱不是“学得不够”，而是长期停留在跟随模式；真实进步来自小项目、失败记录、文档验证和把范围拆小。
- AI 工具的共鸣点从“会不会替代程序员”转向“如何核验它的自信输出”；测试、文档、复现和人工判断仍是责任边界。
- 工具链迁移常常既有收益也有心理成本：锁文件、缓存、CI、团队习惯和迁移文档都会变成隐藏任务。
- 开源维护疲劳来自无偿客服、低质量 issue、AI 生成 PR、兼容压力和不敢说“不”；明确边界比无限热情更能延长项目寿命。
- 副项目不是人格证明，未完成也可能有价值；更关键的是范围、节奏、动机和是否解决自己的真实问题。
- 面试复盘不只统计错题，还要拆解表达、紧张、沟通、题型、岗位匹配和面试流程本身。
- 知识管理从“收藏更多”转向“下次能用”；笔记系统、第二大脑和 AI 摘要若没有输出循环，会变成更高级的资料坟场。
- 转型焦虑与自我怀疑常来自热点变化、AI 新闻、年龄叙事和他人进度；可控动作是缩小目标、积累作品、复盘证据和保留休息。

## JSONL 候选

```jsonl
{"action":"side-project","text":"你把第 48 个收藏教程关掉，决定先做一个只会新增和删除的丑项目。","tone":"自嘲","kind":"learning","category":"教程地狱","source_hint":"DEV tutorial hell 经验帖"}
{"action":"learn-ai","text":"AI 的答案像满分作文，你的测试像阅卷老师，最后只给它及格。","tone":"冷幽默","kind":"learning","category":"AI幻觉验证","source_hint":"Stack Overflow AI trust gap"}
{"action":"interview","text":"你复盘面试才发现，最难的不是算法题，是把脑内弹幕翻译成人话。","tone":"自省","kind":"learning","category":"面试复盘","source_hint":"Reddit cscareerquestions phone screen postmortem"}
{"action":"rest","text":"你今晚没有补新课，只把睡眠补上了；大脑终于从测试环境回到生产。","tone":"温和","kind":"health","category":"节奏管理","source_hint":"Reddit ExperiencedDevs burnout 讨论"}
{"action":"side-project","text":"副项目卡在最后 30%，你删掉三个炫酷功能，它突然像能上线了。","tone":"务实","kind":"event","category":"副项目","source_hint":"Hacker News side project last 30 percent"}
{"action":"learn-ai","text":"你让 AI 解释新框架，再让官方文档验明正身，效率和尊严都保住了。","tone":"谨慎","kind":"learning","category":"AI辅助学习","source_hint":"Reddit ExperiencedDevs AI learning"}
{"action":"overtime","text":"你半夜迁移包管理器，第二天醒来只记得锁文件比需求还会变脸。","tone":"自嘲","kind":"joke","category":"工具链迁移","source_hint":"Raul Melo pnpm migration"}
{"action":"networking","text":"你在开源 issue 里先问最小复现，避免了又一次远程算命。","tone":"务实","kind":"learning","category":"开源维护","source_hint":"Lobsters OSS maintainer fatigue"}
{"action":"learn-ai","text":"你把“以后看”的文件夹改名为“可能永远不会看”，知识管理突然诚实了。","tone":"扎心","kind":"joke","category":"知识管理","source_hint":"Reddit PKMS second brain overload"}
{"action":"interview","text":"你把面试失败分成不会、会但说乱、太紧张、岗位不合四类，锅终于有了标签。","tone":"务实","kind":"learning","category":"面试复盘","source_hint":"Reddit cscareerquestions interview postmortem"}
{"action":"side-project","text":"你给副项目写下“不做用户系统”，这是今晚最有产品感的一行代码。","tone":"克制","kind":"learning","category":"副项目范围","source_hint":"Hacker News scope creep 讨论"}
{"action":"learn-ai","text":"AI 帮你写了迁移步骤，你保留步骤，删掉它编出来的配置项。","tone":"谨慎","kind":"learning","category":"AI幻觉验证","source_hint":"Stack Overflow AI trust gap"}
{"action":"rest","text":"你承认自己不是落后，只是同时追十条路线图会让人像开了十个死循环。","tone":"温和","kind":"health","category":"转型焦虑","source_hint":"Reddit ExperiencedDevs obsolete burnout"}
{"action":"networking","text":"你回复了一个新手问题，写到一半发现自己也靠肌肉记忆活了很久。","tone":"轻松","kind":"learning","category":"学习公开化","source_hint":"DEV Community learning discussion"}
{"action":"learn-ai","text":"你今天只读了一页文档，但跑通了边界条件，比三小时视频更像学习。","tone":"平实","kind":"learning","category":"学习方法","source_hint":"freeCodeCamp avoid tutorial hell"}
{"action":"side-project","text":"副项目没人用，你还是补了 README，因为未来的你也是用户。","tone":"温和","kind":"life","category":"副项目维护","source_hint":"DEV side project value"}
{"action":"interview","text":"你把错题本加了一列“当时为什么慌”，算法突然暴露了心理依赖。","tone":"自省","kind":"learning","category":"面试复盘","source_hint":"Reddit interview anxiety"}
{"action":"learn-ai","text":"AI 说这个库很简单，你看了三层配置后决定把“简单”加入禁用词。","tone":"冷幽默","kind":"joke","category":"AI辅助学习","source_hint":"Reddit ExperiencedDevs AI learning"}
{"action":"overtime","text":"你以为迁移到 pnpm 是换命令，结果 CI、缓存和同事习惯都申请参战。","tone":"自嘲","kind":"event","category":"工具链迁移","source_hint":"Reddit node pnpm migration"}
{"action":"rest","text":"你没在周末做副项目，项目没死，倒是你的肩颈活过来了。","tone":"温和","kind":"health","category":"副项目节奏","source_hint":"Benoit Pasquier no side project"}
{"action":"learn-ai","text":"你让 AI 先列不确定点，它终于不像神谕，更像一个会留 TODO 的同事。","tone":"轻松","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow AI trust gap"}
{"action":"networking","text":"你在社区发学习周报，收获一个纠错评论，比十个赞更值钱。","tone":"务实","kind":"event","category":"学习公开化","source_hint":"DEV tutorial hell discussion"}
{"action":"side-project","text":"你发现副项目最难的不是写功能，是在第三周还愿意打开它。","tone":"扎心","kind":"life","category":"副项目燃尽","source_hint":"Daniel Gregory side project burnout"}
{"action":"interview","text":"你模拟面试时卡住，终于练会一句话：我先从暴力解开始讲。","tone":"务实","kind":"learning","category":"面试表达","source_hint":"Reddit cscareerquestions phone screen postmortem"}
{"action":"learn-ai","text":"AI 生成的测试全绿，你改了断言后，绿灯终于有了含金量。","tone":"谨慎","kind":"learning","category":"AI代码验证","source_hint":"Stack Overflow Blog AI trust"}
{"action":"overtime","text":"你把笔记系统重构到凌晨，第二天发现真正需要的是一个复习提醒。","tone":"自嘲","kind":"joke","category":"知识管理","source_hint":"Stack Overflow second brain"}
{"action":"side-project","text":"你把副项目改成只解决自己每天烦的一件事，完成率突然不像玄学。","tone":"平实","kind":"learning","category":"副项目动机","source_hint":"Hacker News side project discussion"}
{"action":"learn-ai","text":"你让 AI 当导师，不让它当老板；学习速度上来了，责任边界也清楚了。","tone":"克制","kind":"learning","category":"AI辅助学习","source_hint":"Reddit ExperiencedDevs AI tools"}
{"action":"interview","text":"你复盘发现自己不是不会题，是每次一紧张就把变量名也忘成谜语。","tone":"自嘲","kind":"learning","category":"面试焦虑","source_hint":"Reddit interview anxiety"}
{"action":"rest","text":"你把今天的目标改成“只修一个小 bug”，终于没有把成长搞成加班。","tone":"温和","kind":"health","category":"学习节奏","source_hint":"freeCodeCamp project learning"}
{"action":"networking","text":"你给开源项目补了复现说明，维护者没有狂喜，但至少不用读心。","tone":"务实","kind":"event","category":"开源贡献","source_hint":"Lobsters OSS maintainer discussion"}
{"action":"learn-ai","text":"AI 帮你总结旧代码，你先跑测试再点头，成年人不靠气质合并 PR。","tone":"谨慎","kind":"learning","category":"AI代码审查","source_hint":"Hacker News AI open source speed"}
{"action":"side-project","text":"你没有给副项目接支付系统，因为现在连登录页都还在请假。","tone":"冷幽默","kind":"joke","category":"副项目范围","source_hint":"Hacker News scope creep"}
{"action":"learn-ai","text":"你把路线图缩成三件事：会跑、会改、会解释；焦虑明显降噪。","tone":"务实","kind":"learning","category":"学习方法","source_hint":"freeCodeCamp learning plan"}
{"action":"overtime","text":"你迁移工具链时顺手写了回滚步骤，感觉自己突然像个成年人。","tone":"轻松","kind":"learning","category":"工具链迁移","source_hint":"Raul Melo pnpm migration"}
{"action":"interview","text":"你把面试官的沉默当作失败，复盘后才知道自己也全程没说复杂度。","tone":"自省","kind":"learning","category":"面试复盘","source_hint":"Reddit phone screen postmortem"}
{"action":"rest","text":"你今天没学 AI，只把 AI 新闻静音了；心理负载少了一个常驻进程。","tone":"温和","kind":"health","category":"转型焦虑","source_hint":"Addy Osmani future software engineering"}
{"action":"side-project","text":"你给项目加了 issue 模板，主要是为了保护自己不再半夜靠情绪接需求。","tone":"克制","kind":"life","category":"开源维护","source_hint":"Lobsters OSS maintainer fatigue"}
{"action":"learn-ai","text":"AI 写出的代码能跑，你写出的检查清单能睡得着。","tone":"务实","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow AI trust gap"}
{"action":"networking","text":"你把学习笔记发出去，被指出概念混淆；丢脸十分钟，少错半年。","tone":"务实","kind":"learning","category":"学习公开化","source_hint":"DEV tutorial hell discussion"}
{"action":"learn-ai","text":"你停止问“我该学什么”，改问“我卡在哪个真实任务”，答案终于不再像广告。","tone":"平实","kind":"learning","category":"学习方法","source_hint":"freeCodeCamp project-based learning"}
{"action":"side-project","text":"你的副项目只剩三个用户，但他们足够证明你想象的需求有多离谱。","tone":"轻松","kind":"event","category":"副项目反馈","source_hint":"DEV side project value"}
{"action":"interview","text":"你把失败面试写成复盘，不是为了羞辱自己，是为了下次少盲打。","tone":"温和","kind":"learning","category":"面试复盘","source_hint":"Reddit cscareerquestions postmortem"}
{"action":"overtime","text":"你把 npm 换成 pnpm 后，安装快了，解释为什么要换花了一整天。","tone":"自嘲","kind":"joke","category":"工具链迁移","source_hint":"Reddit node pnpm discussion"}
{"action":"learn-ai","text":"你让 AI 列方案，自己选最容易回滚的那个；这叫合作，不叫投降。","tone":"务实","kind":"learning","category":"AI决策辅助","source_hint":"Addy Osmani AI engineering"}
{"action":"rest","text":"你没有因为别人有副项目就内疚，今晚的主项目是把人维护好。","tone":"温和","kind":"health","category":"副项目压力","source_hint":"Benoit Pasquier no side project"}
{"action":"networking","text":"你给维护者发 PR 前先读贡献指南，减少了一个善意但昂贵的惊喜。","tone":"务实","kind":"learning","category":"开源贡献","source_hint":"Lobsters AI policy OSS"}
{"action":"learn-ai","text":"AI 的迁移建议看着很全，你发现它把已废弃插件讲得像公司元老。","tone":"冷幽默","kind":"learning","category":"AI幻觉验证","source_hint":"Stack Overflow AI trust gap"}
{"action":"side-project","text":"副项目未完成，但你学会了部署、日志和用户会点奇怪按钮，也不算白干。","tone":"温和","kind":"learning","category":"副项目价值","source_hint":"DEV side project unfinished"}
{"action":"interview","text":"你复盘行为题才发现，“我参与过”不能自动翻译成“我负责过”。","tone":"扎心","kind":"learning","category":"面试表达","source_hint":"Reddit phone screen postmortem"}
{"action":"learn-ai","text":"你用 AI 查漏补缺，但把“最终答案”留给测试、文档和你的工牌。","tone":"克制","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow AI trust gap"}
{"action":"rest","text":"你给学习计划留了空白日，第一次没有把未来的自己当无限机器。","tone":"温和","kind":"health","category":"学习节奏","source_hint":"Reddit burnout discussion"}
{"action":"overtime","text":"你为了整理笔记装了三个插件，结果最难找的还是上周那条结论。","tone":"自嘲","kind":"joke","category":"知识管理","source_hint":"Reddit PKMS second brain overload"}
{"action":"networking","text":"你在社区问问题前写了环境、尝试和报错，回复速度像突然升级了宽带。","tone":"轻松","kind":"learning","category":"提问能力","source_hint":"Reddit learnprogramming discussions"}
{"action":"side-project","text":"你给开源项目写“不计划支持”，这不是冷漠，是维护者的防火墙。","tone":"克制","kind":"life","category":"开源边界","source_hint":"Lobsters OSS maintainer fatigue"}
{"action":"learn-ai","text":"你让 AI 解释报错，再自己复现最小案例；幻觉一进实验室就没那么神了。","tone":"谨慎","kind":"learning","category":"AI幻觉验证","source_hint":"Reddit ExperiencedDevs AI learning"}
{"action":"interview","text":"你刷了很多题，但复盘显示你从没练过“卡住时怎么说”。","tone":"扎心","kind":"learning","category":"面试沟通","source_hint":"Reddit interview anxiety"}
{"action":"rest","text":"你今天没有追热点，只复习了一个旧概念；知识终于不是一次性餐具。","tone":"温和","kind":"learning","category":"知识复用","source_hint":"Stack Overflow second brain"}
{"action":"learn-ai","text":"AI 给了十种学习路径，你只保留一条，因为人生不支持并发无限。","tone":"自嘲","kind":"learning","category":"转型焦虑","source_hint":"Addy Osmani future software engineering"}
{"action":"side-project","text":"你把副项目从“改变世界”降级成“帮我少点三次鼠标”，它终于有了生命迹象。","tone":"轻松","kind":"event","category":"副项目动机","source_hint":"DEV side project value"}
{"action":"overtime","text":"你迁移工具链时发现，最顽固的依赖不是包，是团队里那句“一直这么用”。","tone":"冷幽默","kind":"event","category":"工具链迁移","source_hint":"Raul Melo pnpm migration"}
{"action":"interview","text":"你复盘发现简历项目讲不深，因为当初只跟教程点了下一步。","tone":"扎心","kind":"learning","category":"教程地狱","source_hint":"freeCodeCamp tutorial hell"}
{"action":"learn-ai","text":"你让 AI 给旧代码画图，图很漂亮，但你还是从入口函数开始核对。","tone":"谨慎","kind":"learning","category":"AI代码理解","source_hint":"Stack Overflow AI trust gap"}
{"action":"networking","text":"你在开源讨论里少说一句“应该很简单”，维护者的血压可能因此下降。","tone":"冷幽默","kind":"life","category":"开源维护","source_hint":"Lobsters maintainer fatigue"}
{"action":"rest","text":"你承认“下班后必须学习四小时”听起来不像成长，像另一个老板。","tone":"温和","kind":"health","category":"转型焦虑","source_hint":"Reddit ExperiencedDevs burnout"}
{"action":"side-project","text":"你把副项目日志打开，才知道用户不是不会用，是按钮真的像装饰品。","tone":"轻松","kind":"learning","category":"副项目反馈","source_hint":"DEV side project learning"}
{"action":"learn-ai","text":"AI 帮你起草 PR 描述，你补上风险和回滚；机器人负责流畅，你负责靠谱。","tone":"务实","kind":"learning","category":"AI协作","source_hint":"Hacker News AI PR review cost"}
{"action":"interview","text":"你把面试复盘写成行动项：一题限时、一题讲解、一题重做，不再只写“太菜”。","tone":"务实","kind":"learning","category":"面试复盘","source_hint":"Reddit cscareerquestions postmortem"}
{"action":"learn-ai","text":"你的第二大脑装满了链接，但今天真正救你的是一条写清楚的错误复盘。","tone":"扎心","kind":"learning","category":"知识管理","source_hint":"Stack Overflow second brain"}
{"action":"overtime","text":"你以为换构建工具能治项目慢，结果诊断报告说慢的是需求摇摆。","tone":"冷幽默","kind":"joke","category":"工具链迁移","source_hint":"Reddit node tooling discussion"}
{"action":"networking","text":"你把问题拆小再发社区，终于从“没人理我”变成“有人能帮”。","tone":"平实","kind":"learning","category":"提问能力","source_hint":"Reddit learnprogramming discussion"}
{"action":"side-project","text":"你没有把副项目开源，因为你还没准备好给陌生人当免费客服。","tone":"克制","kind":"life","category":"开源边界","source_hint":"Lobsters OSS maintainer fatigue"}
{"action":"learn-ai","text":"AI 说升级很安全，你看了 changelog，发现安全的定义不包括你们的插件。","tone":"谨慎","kind":"learning","category":"AI幻觉验证","source_hint":"Stack Overflow AI trust gap"}
{"action":"rest","text":"你关掉技术新闻，终于听见自己其实只是累了，不是被时代淘汰。","tone":"温和","kind":"health","category":"转型焦虑","source_hint":"Reddit ExperiencedDevs obsolete burnout"}
{"action":"interview","text":"你复盘失败时没有再写“运气不好”，而是写下“没有确认题意”。","tone":"务实","kind":"learning","category":"面试复盘","source_hint":"Reddit interview postmortem"}
{"action":"side-project","text":"你给副项目定了停止条件：连续两周不想用，就先归档不自责。","tone":"温和","kind":"life","category":"副项目节奏","source_hint":"Daniel Gregory side project burnout"}
{"action":"learn-ai","text":"你让 AI 扮演面试官，最有用的不是答案，是它逼你把思路说完整。","tone":"务实","kind":"learning","category":"AI辅助面试","source_hint":"Reddit AI learning discussion"}
{"action":"overtime","text":"你把所有资料同步到新笔记软件，知识没有增长，迁移日志倒是很厚。","tone":"自嘲","kind":"joke","category":"知识管理","source_hint":"Reddit PKMS second brain overload"}
{"action":"networking","text":"你在 PR 里解释取舍，而不是只丢代码；review 终于不是猜谜游戏。","tone":"务实","kind":"learning","category":"开源协作","source_hint":"Hacker News AI PR review cost"}
{"action":"learn-ai","text":"你把 AI 生成的学习计划砍到今晚能做的一步，终于从励志海报变成任务。","tone":"平实","kind":"learning","category":"学习计划","source_hint":"freeCodeCamp learning plan"}
{"action":"interview","text":"你复盘发现自己会写解法，却不会解释为什么不用另一个解法。","tone":"自省","kind":"learning","category":"面试表达","source_hint":"Reddit phone screen postmortem"}
{"action":"side-project","text":"你把副项目做成命令行小工具，没有登录、没有头像上传，也没有灵魂债务。","tone":"轻松","kind":"event","category":"副项目范围","source_hint":"Hacker News side project scope"}
{"action":"learn-ai","text":"AI 建议重写模块，你先问“能不能只加测试”，它沉默得像需求评审。","tone":"冷幽默","kind":"learning","category":"AI决策辅助","source_hint":"Stack Overflow AI trust gap"}
{"action":"rest","text":"你今天只整理了错题，不新增题量；复盘也是学习，不是偷懒的别名。","tone":"温和","kind":"learning","category":"面试复盘","source_hint":"Reddit cscareerquestions interview"}
{"action":"networking","text":"你给维护者补了文档 PR，比发一个宏大重构更像真正帮忙。","tone":"平实","kind":"event","category":"开源贡献","source_hint":"Lobsters OSS maintainer fatigue"}
{"action":"learn-ai","text":"你用 AI 解释陌生栈，但坚持自己写第一版 demo；肌肉不能全外包。","tone":"务实","kind":"learning","category":"AI辅助学习","source_hint":"Reddit ExperiencedDevs AI tools"}
{"action":"overtime","text":"你半夜清理收藏夹，发现很多“必读”已经被时代自己删库了。","tone":"自嘲","kind":"joke","category":"知识管理","source_hint":"Stack Overflow second brain"}
{"action":"side-project","text":"副项目被你归档那天，你写了学到什么；失败终于不是静默异常。","tone":"温和","kind":"learning","category":"副项目复盘","source_hint":"Daniel Gregory side project burnout"}
{"action":"interview","text":"你把每次面试当 A/B 测试：开场、澄清、边界、复杂度，终于有数据了。","tone":"务实","kind":"learning","category":"面试复盘","source_hint":"Reddit interview postmortem"}
{"action":"learn-ai","text":"AI 给你的解释太顺，你反而警觉了；真实系统通常没这么会说话。","tone":"谨慎","kind":"learning","category":"AI幻觉验证","source_hint":"Stack Overflow AI trust gap"}
{"action":"rest","text":"你没有参加周末黑客松，因为身体已经连续加班到像遗留系统。","tone":"温和","kind":"health","category":"副项目节奏","source_hint":"Benoit Pasquier no side project"}
{"action":"networking","text":"你在社区承认“不懂这里”，得到的帮助比硬装懂多得多。","tone":"温和","kind":"learning","category":"学习公开化","source_hint":"Reddit learnprogramming discussion"}
{"action":"side-project","text":"你把副项目需求写在一页纸上，超过一页的先丢进幻想 backlog。","tone":"务实","kind":"learning","category":"副项目范围","source_hint":"Hacker News side project last 30 percent"}
{"action":"learn-ai","text":"你让 AI 找 bug，它列了五个可能；你用复现把四个送回玄学区。","tone":"轻松","kind":"learning","category":"AI调试","source_hint":"Reddit ExperiencedDevs AI learning"}
{"action":"interview","text":"你终于练习了“我不知道，但我会这样排查”，比硬编答案更像工程师。","tone":"务实","kind":"learning","category":"面试表达","source_hint":"Reddit phone screen postmortem"}
{"action":"overtime","text":"你迁移工具链后写了团队说明，发现技术变更最难编译的是共识。","tone":"冷幽默","kind":"learning","category":"工具链迁移","source_hint":"Raul Melo pnpm migration"}
{"action":"rest","text":"你停止用“别人半年转码成功”攻击自己，样本偏差终于下线了。","tone":"温和","kind":"health","category":"转型焦虑","source_hint":"Reddit learnprogramming career change"}
{"action":"learn-ai","text":"AI 帮你生成错题解释，你自己补上为什么当时没想到，这才叫复盘。","tone":"务实","kind":"learning","category":"AI辅助面试","source_hint":"Reddit interview postmortem"}
{"action":"networking","text":"你给 issue 加了版本、系统和复现步骤，维护者的谢谢可能藏在少掉的叹气里。","tone":"轻松","kind":"event","category":"开源协作","source_hint":"Lobsters OSS maintainer discussion"}
{"action":"side-project","text":"你没有追求完美架构，只让副项目先能被别人装起来，世界短暂和平。","tone":"轻松","kind":"event","category":"副项目落地","source_hint":"DEV side project value"}
{"action":"learn-ai","text":"AI 写的迁移 PR 看似省时，review 花掉的脑细胞让你重新理解成本。","tone":"扎心","kind":"learning","category":"AI代码审查","source_hint":"Hacker News AI open source speed"}
{"action":"interview","text":"你复盘后发现，不会回答反问环节也是信号：你还没想清自己要什么。","tone":"自省","kind":"learning","category":"面试复盘","source_hint":"Reddit cscareerquestions interview"}
{"action":"overtime","text":"你把知识库标签体系重做三遍，最后发现搜索框才是 MVP。","tone":"自嘲","kind":"joke","category":"知识管理","source_hint":"Reddit PKMS second brain overload"}
{"action":"rest","text":"你把学习连续打卡断了一天，世界没崩，反而第二天能看懂文档了。","tone":"温和","kind":"health","category":"学习节奏","source_hint":"freeCodeCamp tutorial hell"}
{"action":"learn-ai","text":"你让 AI 总结长 issue，再手动核对关键事实；省时间，不省责任。","tone":"克制","kind":"learning","category":"AI协作","source_hint":"Lobsters AI policy OSS"}
{"action":"side-project","text":"你的副项目没有商业模式，但有一个每天真会用的人：你自己。","tone":"温和","kind":"life","category":"副项目动机","source_hint":"DEV side project value"}
{"action":"networking","text":"你在技术群少转一篇焦虑文，多问一个落地案例，信息密度马上提高。","tone":"务实","kind":"learning","category":"转型焦虑","source_hint":"Addy Osmani future software engineering"}
{"action":"interview","text":"你把失败面试里的沉默片段重演了一遍，终于知道下一次该先说假设。","tone":"务实","kind":"learning","category":"面试复盘","source_hint":"Reddit phone screen postmortem"}
{"action":"learn-ai","text":"AI 推荐了热门库，你查了维护状态，发现星星很多不等于有人值班。","tone":"谨慎","kind":"learning","category":"AI选型验证","source_hint":"Lobsters OSS maintainer fatigue"}
{"action":"overtime","text":"你升级依赖后修了一晚测试，最后收获是“最新”不是需求。","tone":"冷幽默","kind":"event","category":"工具链迁移","source_hint":"Reddit node tooling discussion"}
{"action":"rest","text":"你没有开新课程，而是把旧项目跑起来；比起新鲜感，反馈更醒脑。","tone":"平实","kind":"learning","category":"教程地狱","source_hint":"freeCodeCamp project learning"}
{"action":"side-project","text":"你给副项目做了最小发布，不完美，但终于从脑内融资进入现实测试。","tone":"轻松","kind":"event","category":"副项目发布","source_hint":"Hacker News side project last 30 percent"}
{"action":"learn-ai","text":"AI 说“最佳实践”，你问“在我们这个约束下呢”，它终于开始像工具。","tone":"务实","kind":"learning","category":"AI提示策略","source_hint":"Reddit ExperiencedDevs AI tools"}
{"action":"interview","text":"你发现刷题不是为了背答案，是为了面试时还能保留一点工作记忆。","tone":"自省","kind":"learning","category":"面试准备","source_hint":"Reddit cscareerquestions interview anxiety"}
{"action":"networking","text":"你把踩坑写成短文，阅读量一般，但下次搜到的人可能就是你。","tone":"温和","kind":"life","category":"知识管理","source_hint":"Stack Overflow second brain"}
{"action":"learn-ai","text":"你用 AI 生成学习卡片，却坚持自己写例子；理解不能只靠复制粘贴生根。","tone":"务实","kind":"learning","category":"AI辅助学习","source_hint":"Reddit ExperiencedDevs AI learning"}
{"action":"rest","text":"你今天把副项目关掉去散步，灵感没追上来，但焦虑也没跟太久。","tone":"温和","kind":"health","category":"副项目燃尽","source_hint":"Daniel Gregory side project burnout"}
{"action":"side-project","text":"你把开源项目的贡献门槛写清楚，善意终于不用靠猜。","tone":"克制","kind":"learning","category":"开源治理","source_hint":"Lobsters AI policy OSS"}
{"action":"overtime","text":"你迁移到新框架后，终于明白“脚手架”有时也会把人架住。","tone":"自嘲","kind":"joke","category":"工具链迁移","source_hint":"DEV tutorial hell and tooling"}
{"action":"interview","text":"你复盘面试时发现，没问清输入范围，后面每一步都像在雾里加班。","tone":"务实","kind":"learning","category":"面试复盘","source_hint":"Reddit phone screen postmortem"}
{"action":"learn-ai","text":"AI 给你补了概念地图，你用一个小 demo 验证连接线是否真的通电。","tone":"谨慎","kind":"learning","category":"AI辅助学习","source_hint":"Reddit ExperiencedDevs AI tools"}
{"action":"networking","text":"你在社区说清自己已经试过什么，别人终于不用从“你重启了吗”开始。","tone":"轻松","kind":"learning","category":"提问能力","source_hint":"Reddit learnprogramming discussion"}
{"action":"rest","text":"你把“转型必须燃烧”改成“转型必须可持续”，计划突然像能活过月底。","tone":"温和","kind":"health","category":"转型焦虑","source_hint":"Reddit career change anxiety"}
{"action":"side-project","text":"你给副项目加了删除功能，突然比新增功能更像尊重用户。","tone":"务实","kind":"event","category":"副项目体验","source_hint":"DEV side project learning"}
{"action":"learn-ai","text":"AI 说这个 bug 可能在缓存，你查日志发现它只是猜中了程序员通用焦虑。","tone":"冷幽默","kind":"learning","category":"AI调试","source_hint":"Stack Overflow AI trust gap"}
{"action":"interview","text":"你把面试复盘同步到错题本，终于不再让同一个坑每周换皮肤出现。","tone":"务实","kind":"learning","category":"面试复盘","source_hint":"Reddit cscareerquestions interview"}
{"action":"overtime","text":"你整理收藏资料时发现，真正反复用到的只有三篇和一条报错截图。","tone":"自嘲","kind":"joke","category":"知识管理","source_hint":"Stack Overflow second brain"}
{"action":"networking","text":"你帮别人 review 一个小 PR，顺手复习了自己半年没碰的边界条件。","tone":"温和","kind":"learning","category":"开源协作","source_hint":"Lobsters OSS discussion"}
{"action":"learn-ai","text":"你把 AI 当橡皮鸭，它比鸭子会说话，但也更会一本正经地胡说。","tone":"轻松","kind":"joke","category":"AI工具边界","source_hint":"Stack Overflow AI trust gap"}
{"action":"side-project","text":"副项目进度慢，是因为你白天已经写了一天代码；这不是懒，是资源调度。","tone":"温和","kind":"health","category":"副项目节奏","source_hint":"Benoit Pasquier no side project"}
{"action":"rest","text":"你今晚只做了十分钟复盘，却避免明天再踩同一个坑；短任务也能有复利。","tone":"平实","kind":"learning","category":"成长复盘","source_hint":"Reddit production mistake postmortem"}
{"action":"interview","text":"你模拟面试时练习停顿，发现沉默三秒不丢人，胡编三分钟才丢人。","tone":"轻松","kind":"learning","category":"面试表达","source_hint":"Reddit interview anxiety"}
{"action":"learn-ai","text":"AI 生成的方案太大，你让它缩成一小时能验证的实验，终于落地了。","tone":"务实","kind":"learning","category":"AI辅助学习","source_hint":"Addy Osmani AI engineering"}
{"action":"overtime","text":"你换了新笔记软件，旧问题原封不动迁移成功：还是不复习。","tone":"自嘲","kind":"joke","category":"知识管理","source_hint":"Reddit PKMS second brain overload"}
{"action":"side-project","text":"你关掉一个长期没人维护的功能请求，项目没有变坏，只是边界变清楚了。","tone":"克制","kind":"life","category":"开源维护","source_hint":"Lobsters OSS maintainer fatigue"}
{"action":"networking","text":"你把生产事故复盘分享给团队，最有价值的不是道歉，是新增的防线。","tone":"务实","kind":"event","category":"事故复盘","source_hint":"Reddit production anxiety postmortem"}
{"action":"learn-ai","text":"你让 AI 讲概念，再让自己不用术语复述一遍；不会复述的都还没真懂。","tone":"平实","kind":"learning","category":"AI辅助学习","source_hint":"freeCodeCamp learning technique"}
{"action":"interview","text":"你把面试里的“我负责了很多”改成“我做了哪个决策”，故事终于有骨头。","tone":"务实","kind":"learning","category":"面试表达","source_hint":"Reddit cscareerquestions behavioral interview"}
{"action":"rest","text":"你没有因为 AI 新闻换职业方向，只先列了自己还能控制的三件事。","tone":"温和","kind":"health","category":"转型焦虑","source_hint":"Addy Osmani future software engineering"}
{"action":"side-project","text":"你把副项目部署失败写进日志，后来发现这比成功截图更能教人。","tone":"温和","kind":"learning","category":"副项目复盘","source_hint":"DEV side project learning"}
{"action":"learn-ai","text":"AI 建议你学十个工具，你先问当前工作缺哪一个；焦虑营销当场掉线。","tone":"务实","kind":"learning","category":"转型焦虑","source_hint":"Reddit ExperiencedDevs obsolete burnout"}
{"action":"overtime","text":"你给工具链迁移写了 FAQ，第一题就是“为什么昨晚不睡觉”。","tone":"自嘲","kind":"joke","category":"工具链迁移","source_hint":"Raul Melo pnpm migration"}
{"action":"networking","text":"你在开源讨论里先确认维护者是否愿意接方向，再写代码；少了一次热情撞墙。","tone":"务实","kind":"learning","category":"开源协作","source_hint":"Lobsters OSS maintainer fatigue"}
{"action":"interview","text":"你复盘发现自己每次都跳过澄清问题，因为害怕显得不聪明。","tone":"自省","kind":"learning","category":"面试复盘","source_hint":"Reddit phone screen postmortem"}
{"action":"learn-ai","text":"AI 帮你写了学习摘要，你补上“我下一步要做什么”，摘要才没有变摆设。","tone":"平实","kind":"learning","category":"知识管理","source_hint":"Stack Overflow second brain"}
{"action":"rest","text":"你把周末学习计划砍半，完成率翻倍，内疚率下降，像一次性能优化。","tone":"轻松","kind":"health","category":"学习节奏","source_hint":"freeCodeCamp learning plan"}
{"action":"side-project","text":"你给副项目写了卸载说明，用户自由离开时反而更像会回来。","tone":"温和","kind":"life","category":"副项目体验","source_hint":"DEV side project value"}
{"action":"learn-ai","text":"AI 把旧 API 说得很新，你查发布日期后，决定给它上历史课。","tone":"冷幽默","kind":"learning","category":"AI幻觉验证","source_hint":"Stack Overflow AI trust gap"}
{"action":"interview","text":"你把刷题计划改成“做完必须讲给空气听”，空气比面试官便宜。","tone":"轻松","kind":"learning","category":"面试准备","source_hint":"Reddit interview anxiety"}
{"action":"networking","text":"你在社区感谢指出错误的人，顺手把笔记改掉；这比防御性回复更省电。","tone":"温和","kind":"life","category":"学习公开化","source_hint":"DEV Community discussion"}
```
