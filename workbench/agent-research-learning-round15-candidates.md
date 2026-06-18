# agent-research-learning-round15-candidates

调研子智能体 B 产出。目标是为“程序员生存模拟器”补充程序员学习策略、AI 工具边界、开源维护、面试疲劳、职业中年、远程协作与技术债方向的弹窗候选。候选均为公开报告、社区经验帖与讨论的原创改写，不复制原帖原文；本文件仅作为 `workbench` 候选材料，不进入正式数据池，不修改 HTML。

## 来源列表

- Stack Overflow Developer Survey 2025：AI 使用率上升但信任下降，学习资源仍以文档、在线资源和社区知识为核心。https://survey.stackoverflow.co/2025
- Stack Overflow 2025 AI 分页：开发者普遍需要人工核验 AI 输出，资深开发者更谨慎。https://survey.stackoverflow.co/2025/ai
- Atlassian State of Developer Experience 2025：AI 节省时间，但组织低效、信息查找和沟通摩擦会吃掉收益。https://www.atlassian.com/teams/software-development/state-of-developer-experience-2025
- DORA State of AI-assisted Software Development 2025：AI 更像组织系统放大器，会放大强项，也会放大流程混乱与技术债。https://dora.dev/dora-report-2025/
- METR Early-2025 AI on Experienced Open-Source Developers Study：经验开发者在成熟仓库中使用 AI 后可能更慢，主观效率感与实测结果可能不一致。https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- GitHub Octoverse 2025：开源贡献继续增长，AI、代理与类型化语言改变协作结构。https://octoverse.github.com/
- GitHub Blog Octoverse 2025：公开仓库贡献达到新高，新贡献者数量增长明显。https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/
- Tidelift Maintainer Impact Report 2024：维护者报酬、安全实践、维护负担与开源可持续性之间存在明显关联。https://www.sonarsource.com/the-2024-tidelift-maintainer-impact-report.pdf
- GitHub Community / ITK Discourse：维护者讨论低质量 AI 生成 issue、PR 与 review 噪声，呼吁更强过滤和项目边界。https://github.com/orgs/community/discussions/185387
- Hacker News：LeetCode 面试是否过时、40+ 开发者、AI 生产力、认知债和技术债等社区讨论。https://news.ycombinator.com/
- Reddit r/ExperiencedDevs / r/cscareerquestions / r/opensource：资深开发者面试、职业中年、AI 使用边界、开源维护和技术债经验帖。https://www.reddit.com/r/ExperiencedDevs/
- GitLab Remote Handbook：远程团队依赖异步沟通、可检索文档和显性决策记录。https://handbook.gitlab.com/handbook/company/culture/all-remote/asynchronous/
- Microsoft Work Trend Index 2025：跨时区协作、晚间会议、非工作时间消息和数字负债增加。https://www.microsoft.com/en-us/worklab/work-trend-index
- Buffer State of Remote Work：远程工作提供灵活性，也带来孤独、边界模糊和“太少出门”等问题。https://buffer.com/state-of-remote-work/2023
- Gallup Remote Work Paradox：远程工作者可能更投入，但整体幸福感和孤独压力需要单独管理。https://www.gallup.com/workplace/660236/remote-work-paradox-engaged-distressed.aspx
- Sonar / AI technical debt 讨论：AI 生成代码带来验证债、隐藏缺陷和“看起来正确”的维护风险。https://www.sonarsource.com/blog/how-ai-is-redefining-technical-debt/
- Hacker News / Reddit 技术债讨论：社区强调技术债需要和业务影响、未来交付速度、可测试性绑定，而不是泛化为“我不喜欢的代码”。https://news.ycombinator.com/item?id=45423917

## 主题簇

- 学习策略：从追热点、囤教程和刷榜，转向围绕实际问题、文档、复盘、项目和可验证成果学习。
- AI 工具边界：AI 适合探索、解释、草拟和重复劳动，但必须有人负责上下文、测试、审查、安全和上线后果。
- 开源维护：贡献增长不等于维护可持续，维护者需要报酬、边界、低噪声流程和明确的贡献门槛。
- 面试疲劳：候选人被刷题、多轮流程、 ghosting、AI 筛选和完美候选人叙事消耗，需要把求职当作系统工程。
- 职业中年：年龄焦虑背后是角色变化、市场叙事和自我定位，需要把经验转化为判断、沟通和系统影响力。
- 远程协作：远程不只是“不去办公室”，而是文档化、异步决策、时区边界、非正式连接和可检索知识的组合。
- 技术债：技术债不是所有丑代码，而是影响未来变化速度和可靠性的欠账；AI 会提高产出，也会提高验证和理解成本。

## 120 条 JSONL 候选

```jsonl
{"action":"learn-ai","text":"你把学习计划从“跟上所有热词”改成“解决本周一个真实问题”。清单短了，羞愧感也短了。","tone":"resonant","kind":"learning","category":"学习策略","source_hint":"Stack Overflow 2025 / V2EX 学习焦虑"}
{"action":"learn-ai","text":"你今天只读官方文档的一个章节，但把边界条件跑通了。进度慢得像人类，可靠得也像人类。","tone":"gentle","kind":"learning","category":"学习策略","source_hint":"Stack Overflow 2025 学习资源"}
{"action":"side-project","text":"你把教程里的示例项目换成自己的报销脚本。功能少了一半，记忆多了一倍。","tone":"wry","kind":"learning","category":"学习策略","source_hint":"Reddit / DEV 实践学习讨论"}
{"action":"learn-ai","text":"你停止收藏“必学路线图”，开始记录“这次卡住在哪里”。学习终于从采购变成生产。","tone":"sharp","kind":"learning","category":"学习策略","source_hint":"Atlassian DevEx 信息查找成本"}
{"action":"networking","text":"你问同事最近真正落地的新技术，答案只有两个。热榜像夜市，生产环境像便利店。","tone":"wry","kind":"learning","category":"学习策略","source_hint":"Stack Overflow 2025 技术使用"}
{"action":"learn-ai","text":"你给每个学习目标写上“用不上就删除”的日期。精神内存第一次有了垃圾回收。","tone":"sharp","kind":"learning","category":"学习策略","source_hint":"JetBrains / Stack Overflow 工具趋势"}
{"action":"rest","text":"你今晚没有补课，只睡够了七小时。明天的大脑，可能比今晚的课程更贵。","tone":"gentle","kind":"health","category":"学习策略","source_hint":"Atlassian DevEx 过载讨论"}
{"action":"learn-ai","text":"你把学习笔记改成“问题、证据、结论、下次动作”。格式不酷，但能复用。","tone":"resonant","kind":"learning","category":"学习策略","source_hint":"DORA 2025 系统能力"}
{"action":"side-project","text":"你用一个小脚本验证新框架，没有把整个项目献祭。团队暂时不知道自己躲过一劫。","tone":"wry","kind":"event","category":"学习策略","source_hint":"Hacker News 技术选型讨论"}
{"action":"learn-ai","text":"你终于承认自己不是不会学，而是每次都想同时完成升职、转型、抗裁和修仙。","tone":"wry","kind":"learning","category":"学习策略","source_hint":"V2EX / Reddit 学习焦虑"}
{"action":"networking","text":"你请老同事讲一次踩坑史，比看十篇最佳实践更快知道哪里会出血。","tone":"resonant","kind":"learning","category":"学习策略","source_hint":"Hacker News 资深开发者讨论"}
{"action":"learn-ai","text":"你把“我要掌握这门技术”改成“我能解释它解决哪类问题”。目标小了，脑子亮了。","tone":"gentle","kind":"learning","category":"学习策略","source_hint":"Stack Overflow 2025 学习内容"}
{"action":"learn-ai","text":"你把视频课暂停，直接读报错栈。老师没夸你，但程序终于说了真话。","tone":"wry","kind":"learning","category":"学习策略","source_hint":"Reddit learn programming 经验"}
{"action":"side-project","text":"你做了一个只服务自己的小工具，没人点赞，但每天省三分钟。技能点到账很安静。","tone":"gentle","kind":"learning","category":"学习策略","source_hint":"DEV side project 学习"}
{"action":"learn-ai","text":"你把碎片文章整理成能力地图。知识从弹幕变成坐标，焦虑从洪水变成水位线。","tone":"resonant","kind":"learning","category":"学习策略","source_hint":"Stack Overflow 2025 开发者内容"}
{"action":"rest","text":"你没再用睡前时间刷“程序员会不会失业”。少喂一次恐慌，明天多一点判断。","tone":"gentle","kind":"health","category":"学习策略","source_hint":"Reddit / V2EX AI 焦虑"}
{"action":"learn-ai","text":"你把学习结果定义成一次可复现的 demo，而不是一段“感觉懂了”。感觉下线，证据上线。","tone":"sharp","kind":"learning","category":"学习策略","source_hint":"DORA 2025 可验证实践"}
{"action":"networking","text":"你在群里问具体复现步骤，而不是求完整人生路线。回复少了，但终于有人能帮。","tone":"gentle","kind":"learning","category":"学习策略","source_hint":"V2EX 新手求助讨论"}
{"action":"learn-ai","text":"你让 AI 先列不确定点，再开始写代码。它少了一点神性，多了一点可审查性。","tone":"resonant","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow 2025 AI trust"}
{"action":"learn-ai","text":"AI 给了你漂亮方案，你第一反应不是复制，而是问测试怎么证明它没撒谎。","tone":"sharp","kind":"learning","category":"AI工具边界","source_hint":"METR 2025 AI productivity study"}
{"action":"side-project","text":"你用 AI 搭出原型，又亲手删掉三层抽象。机器会加速，未必会克制。","tone":"wry","kind":"event","category":"AI工具边界","source_hint":"DORA 2025 AI amplifier"}
{"action":"learn-ai","text":"你发现 AI 最适合当第二大脑，不适合当最终责任人。上线按钮还是长在你这边。","tone":"sharp","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow 2025 AI"}
{"action":"overtime","text":"老板说 AI 能省时间，排期却多了一倍。你怀疑被优化的是缓冲区，不是工作量。","tone":"sharp","kind":"event","category":"AI工具边界","source_hint":"Atlassian DevEx 2025 AI paradox"}
{"action":"learn-ai","text":"你要求 AI 解释每个改动的代价。它开始变慢，你开始放心。","tone":"gentle","kind":"learning","category":"AI工具边界","source_hint":"DEV fundamentals still matter"}
{"action":"learn-ai","text":"你把 AI 输出和文档对了一遍。效率账面少赚五分钟，事故账面少亏一整晚。","tone":"resonant","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow AI 准确性"}
{"action":"networking","text":"团队约定 AI 代码必须能被作者讲清楚。沉默复制的时代，在评审门口暂停。","tone":"sharp","kind":"event","category":"AI工具边界","source_hint":"GitHub Community AI PR 讨论"}
{"action":"learn-ai","text":"你没有让 AI 直接改迁移脚本。它不会被叫去凌晨回滚，而你会。","tone":"sharp","kind":"event","category":"AI工具边界","source_hint":"Hacker News AI coding risk"}
{"action":"learn-ai","text":"你把提示词从“帮我实现”改成“先复述需求和风险”。工具突然像同事，而不是许愿池。","tone":"gentle","kind":"learning","category":"AI工具边界","source_hint":"DORA 2025 工作流清晰度"}
{"action":"side-project","text":"你用 AI 一小时搭了页面，花三小时理解它为什么能跑。速度很快，账单在后面。","tone":"wry","kind":"learning","category":"AI工具边界","source_hint":"METR / Hacker News AI 讨论"}
{"action":"learn-ai","text":"你把 AI 当橡皮鸭，只是这只鸭子偶尔会自信地递给你炸弹。","tone":"wry","kind":"learning","category":"AI工具边界","source_hint":"Reddit AI coding tools"}
{"action":"learn-ai","text":"你记录 AI 擅长的三类任务和不该碰的三类任务。边界一清楚，恐惧少了一半。","tone":"resonant","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow 2025 AI usage"}
{"action":"learn-ai","text":"AI 帮你写了测试名，你自己补断言。名字像承诺，断言才像证据。","tone":"gentle","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow AI accuracy"}
{"action":"overtime","text":"AI 生成了更多代码，也生成了更多 review。你的工作从搬砖变成验砖，腰还是疼。","tone":"wry","kind":"event","category":"AI工具边界","source_hint":"METR 2025 review overhead"}
{"action":"learn-ai","text":"你拒绝把“模型说可以”写进技术方案。架构决策需要理由，不需要神谕。","tone":"sharp","kind":"learning","category":"AI工具边界","source_hint":"DORA 2025 组织系统"}
{"action":"side-project","text":"你让 AI 帮你读陌生代码，只接受它指出入口和调用链。方向盘还在你手里。","tone":"resonant","kind":"learning","category":"AI工具边界","source_hint":"Hacker News AI assistant"}
{"action":"networking","text":"你和团队同步哪些代码不能喂给外部模型。安全感不是口号，是配置和边界。","tone":"sharp","kind":"event","category":"AI工具边界","source_hint":"GitHub Community AI 边界"}
{"action":"learn-ai","text":"你开始把 AI 输出看成候选草稿，而不是答案。心态一变，返工少了。","tone":"gentle","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow 2025 AI sentiment"}
{"action":"side-project","text":"你给开源项目提了一个文档 PR，写清复现环境。维护者没夸你，但少猜了十分钟。","tone":"gentle","kind":"event","category":"开源维护","source_hint":"GitHub Octoverse 2025"}
{"action":"networking","text":"提交 issue 前你先搜重复项。少制造一个噪声，也算对公共基础设施做贡献。","tone":"resonant","kind":"event","category":"开源维护","source_hint":"GitHub Community issue 管理"}
{"action":"side-project","text":"你的开源小工具第一次被陌生人催更。成就感来了，客服感也来了。","tone":"wry","kind":"event","category":"开源维护","source_hint":"Tidelift Maintainer Report"}
{"action":"rest","text":"你关掉周末项目通知。免费维护不是无限待命，热爱也需要下班。","tone":"sharp","kind":"health","category":"开源维护","source_hint":"Tidelift 维护者倦怠"}
{"action":"networking","text":"你没有催维护者合并，只补了测试截图和失败日志。尊重别人时间，是最低成本的协作。","tone":"gentle","kind":"event","category":"开源维护","source_hint":"GitHub Community PR 讨论"}
{"action":"side-project","text":"你删掉 README 里过度承诺的路线图。少画一个饼，未来的自己少背一口锅。","tone":"sharp","kind":"event","category":"开源维护","source_hint":"Hacker News maintainer burden"}
{"action":"networking","text":"你第一次在 issue 模板里写“请不要提交未经理解的 AI 生成补丁”。门槛提高，睡眠改善。","tone":"wry","kind":"event","category":"开源维护","source_hint":"ITK Discourse AI PR overload"}
{"action":"side-project","text":"你把贡献指南写得更明确，不是为了摆架子，而是为了少做免费客服。","tone":"resonant","kind":"event","category":"开源维护","source_hint":"GitHub Community low-quality PR"}
{"action":"rest","text":"你没有在半夜回复陌生人的“什么时候支持我这个场景”。维护者也是人，不是云函数。","tone":"sharp","kind":"health","category":"开源维护","source_hint":"Reddit r/opensource 维护者压力"}
{"action":"networking","text":"你把一个“能不能支持”的请求改成带方案的讨论。开源协作从许愿变成共担。","tone":"gentle","kind":"event","category":"开源维护","source_hint":"GitHub Discussions 维护经验"}
{"action":"side-project","text":"你给项目加了“不会做什么”章节。边界写出来后，未来的争执少了一层雾。","tone":"resonant","kind":"event","category":"开源维护","source_hint":"Tidelift 可持续维护"}
{"action":"networking","text":"你看到 star 增长没有立刻兴奋，先看 issue 增长。流量不是礼物，常常是工单。","tone":"wry","kind":"event","category":"开源维护","source_hint":"GitHub Octoverse 贡献增长"}
{"action":"side-project","text":"你把“good first issue”改得更真实。新人需要入口，维护者也需要不被入口压垮。","tone":"gentle","kind":"event","category":"开源维护","source_hint":"GitHub 新贡献者增长"}
{"action":"rest","text":"你把开源项目的 SLA 从心里删除。没人付款的服务，不该按企业级事故值班。","tone":"sharp","kind":"health","category":"开源维护","source_hint":"Tidelift unpaid maintainers"}
{"action":"networking","text":"你在 PR 里承认自己用了 AI，并说明自己验证了什么。透明比装作手写更有礼貌。","tone":"resonant","kind":"event","category":"开源维护","source_hint":"GitHub Community AI PR filter"}
{"action":"side-project","text":"你没有给维护者甩一个巨大重构，而是拆成三步可回滚的小 PR。世界和平一点点发生。","tone":"gentle","kind":"event","category":"开源维护","source_hint":"Reddit OSS collaboration"}
{"action":"interview","text":"你刷完第 160 道题，还是不知道这家公司真实工作长什么样。面试像游戏，岗位像盲盒。","tone":"wry","kind":"career","category":"面试疲劳","source_hint":"Reddit cscareerquestions 2025 面经"}
{"action":"interview","text":"面试官问红黑树，你想问他们线上事故是不是也长在树上。你忍住了，成熟加一。","tone":"sharp","kind":"event","category":"面试疲劳","source_hint":"Hacker News LeetCode interviews"}
{"action":"rest","text":"你今天没有刷题，只整理了失败面试的三个模式。题库少刷一页，系统多长一层。","tone":"gentle","kind":"health","category":"面试疲劳","source_hint":"Reddit job hunt experience"}
{"action":"interview","text":"四轮面试后对方 ghost 了你。你第一次明白，异步通信也能异步到人间蒸发。","tone":"wry","kind":"career","category":"面试疲劳","source_hint":"Reddit / Business Insider job search 2025"}
{"action":"interview","text":"你把每家公司面试流程写成表格。情绪还在，但至少不再用大脑当 ATS。","tone":"resonant","kind":"career","category":"面试疲劳","source_hint":"Reddit Mid Level job hunt"}
{"action":"networking","text":"你没有海投第八十份简历，改成约两位前同事聊机会。漏斗变窄，信号变真。","tone":"gentle","kind":"career","category":"面试疲劳","source_hint":"ExperiencedDevs 求职讨论"}
{"action":"interview","text":"你听到“我们在找完美候选人”，心里默默把公司加入完美鸽子列表。","tone":"wry","kind":"career","category":"面试疲劳","source_hint":"Reddit 2025 market discussion"}
{"action":"rest","text":"你把刷题闹钟关掉十分钟，手终于不抖了。求职也是长跑，不是在线判题。","tone":"gentle","kind":"health","category":"面试疲劳","source_hint":"cscareerquestions interview fatigue"}
{"action":"interview","text":"系统设计轮你讲了权衡，对方只等标准答案。你突然怀念会问“为什么”的面试官。","tone":"sharp","kind":"career","category":"面试疲劳","source_hint":"Hacker News technical interviews 2025"}
{"action":"interview","text":"你练习用 AI 模拟面试，发现最难的不是答案，而是被打断后还能像个人说话。","tone":"resonant","kind":"learning","category":"面试疲劳","source_hint":"Stack Overflow coding challenges / AI"}
{"action":"networking","text":"你请朋友 mock 一轮行为面试，结果发现最大 bug 是你把所有功劳讲成事故报告。","tone":"wry","kind":"career","category":"面试疲劳","source_hint":"Reddit interview prep"}
{"action":"interview","text":"你拒绝了一份要做三天 take-home 的流程。免费劳动不叫文化匹配，叫边界测试。","tone":"sharp","kind":"career","category":"面试疲劳","source_hint":"Hacker News coding challenge discussion"}
{"action":"rest","text":"你把拒信统一归档，没有逐封反刍。自尊不是日志，不必无限保留。","tone":"gentle","kind":"health","category":"面试疲劳","source_hint":"Reddit job market demoralizing"}
{"action":"interview","text":"你发现 LeetCode 不是没用，而是不能假装它等于工程能力。尺子有用，别拿来量天气。","tone":"resonant","kind":"learning","category":"面试疲劳","source_hint":"Hacker News LeetCode 仍在吗"}
{"action":"networking","text":"你在内推前先确认岗位是否真的开放。2025 年，连职位描述也需要验真。","tone":"sharp","kind":"career","category":"面试疲劳","source_hint":"Business Insider ghost jobs 2025"}
{"action":"interview","text":"面试结束你问“这个岗位半年内最痛的工程问题是什么”。对方愣住，你也得到答案。","tone":"resonant","kind":"career","category":"面试疲劳","source_hint":"ExperiencedDevs interview quality"}
{"action":"rest","text":"你把求职日的结束时间写进日历。找工作已经像工作了，不能再无薪加班。","tone":"gentle","kind":"health","category":"面试疲劳","source_hint":"Reddit job hunt burnout"}
{"action":"learn-ai","text":"你 35 岁后学新技术不再追求“像新人一样快”，而是追求“不把团队带沟里”。","tone":"resonant","kind":"career","category":"职业中年","source_hint":"Hacker News ageism in tech"}
{"action":"networking","text":"你发现中年程序员最值钱的不是记得多少 API，而是知道哪些需求不该接。","tone":"sharp","kind":"career","category":"职业中年","source_hint":"Reddit ExperiencedDevs ageism"}
{"action":"rest","text":"你开始承认体力有边界。凌晨三点能修 bug 不再是荣誉，像未关闭的安全漏洞。","tone":"gentle","kind":"health","category":"职业中年","source_hint":"HN older developers / burnout"}
{"action":"learn-ai","text":"你把简历从技术堆叠改成解决过的系统问题。年限不再像年龄，开始像证据。","tone":"resonant","kind":"career","category":"职业中年","source_hint":"ExperiencedDevs job market"}
{"action":"networking","text":"年轻同事问你为什么不追最新框架，你说生产环境喜欢稳定，不喜欢烟花。","tone":"wry","kind":"career","category":"职业中年","source_hint":"HN Where to work after 40"}
{"action":"interview","text":"面试官暗示你经验太多，你暗示他们问题太少。双方都很礼貌，空气很诚实。","tone":"sharp","kind":"career","category":"职业中年","source_hint":"Hacker News ageism in tech"}
{"action":"rest","text":"你把周末从学习计划里拿回来一半。职业很长，燃料不能按冲刺赛消耗。","tone":"gentle","kind":"health","category":"职业中年","source_hint":"Reddit developer midlife"}
{"action":"learn-ai","text":"你不再把“转管理”当唯一出口。会写代码、会判断、会沟通，本身也是路线。","tone":"resonant","kind":"career","category":"职业中年","source_hint":"HN resources for older developers"}
{"action":"networking","text":"你给新人讲一次历史包袱，不是显摆资历，是帮他们别重复同一场火灾。","tone":"gentle","kind":"career","category":"职业中年","source_hint":"ExperiencedDevs mentoring"}
{"action":"learn-ai","text":"你把“我是不是老了”改成“我还能在哪些问题上更可靠”。问题换了，答案也能呼吸。","tone":"resonant","kind":"career","category":"职业中年","source_hint":"Reddit 40+ developers"}
{"action":"interview","text":"你不再把所有失败都归因年龄，也不再假装年龄完全不存在。成熟是同时看见两件事。","tone":"gentle","kind":"career","category":"职业中年","source_hint":"HN ageism still a problem"}
{"action":"networking","text":"你开始经营同行小圈子。中年职业安全感，有时不是来自平台，而是来自互相记得。","tone":"resonant","kind":"career","category":"职业中年","source_hint":"Business Insider experienced job search"}
{"action":"learn-ai","text":"你发现经验的副作用是看见代价。别人说“很简单”，你已经听见了迁移脚本的哭声。","tone":"wry","kind":"career","category":"职业中年","source_hint":"ExperiencedDevs technical judgment"}
{"action":"rest","text":"你体检报告提醒你，职业规划不能只写技术栈，也要写血压和睡眠。","tone":"sharp","kind":"health","category":"职业中年","source_hint":"Developer wellbeing discussions"}
{"action":"networking","text":"你开始把拒绝需求讲成风险翻译，而不是资深脾气。说不，也需要产品化。","tone":"resonant","kind":"career","category":"职业中年","source_hint":"Reddit ageism value of saying no"}
{"action":"learn-ai","text":"你接受自己不再靠熬夜赢，改靠提前发现坑赢。竞技方式换了，不代表退场。","tone":"gentle","kind":"career","category":"职业中年","source_hint":"HN 40 is not the new 60"}
{"action":"networking","text":"远程团队少开了一场会，却多写了一页决策记录。沉默不再等于遗忘。","tone":"resonant","kind":"event","category":"远程协作","source_hint":"GitLab Async Handbook"}
{"action":"overtime","text":"晚上八点的跨时区会议开始了。日历没有国界，眼袋也没有。","tone":"wry","kind":"work","category":"远程协作","source_hint":"Microsoft Work Trend Index 2025"}
{"action":"rest","text":"你把 Slack 状态改成“明天回复”。边界很小，但比隐身更诚实。","tone":"gentle","kind":"health","category":"远程协作","source_hint":"Buffer Remote Work / GitLab"}
{"action":"networking","text":"你给异步讨论补上背景、选项和截止时间。远程协作不怕慢，怕猜。","tone":"sharp","kind":"event","category":"远程协作","source_hint":"GitLab asynchronous communication"}
{"action":"rest","text":"你中午出门晒了十分钟太阳。远程办公省了通勤，也需要补一点真实世界。","tone":"gentle","kind":"health","category":"远程协作","source_hint":"Buffer State of Remote Work"}
{"action":"networking","text":"你和远程同事约了非项目闲聊，只聊猫、天气和糟糕咖啡。头像短暂变回人。","tone":"gentle","kind":"life","category":"远程协作","source_hint":"GitLab informal communication / Gallup"}
{"action":"overtime","text":"客厅变办公室后，你连关电脑都像离职交接。边界没有墙，只能自己造。","tone":"resonant","kind":"work","category":"远程协作","source_hint":"Gallup Remote Work Paradox"}
{"action":"networking","text":"你把会议结论写进文档，而不是写进某个人的记忆。远程团队最怕单点大脑。","tone":"sharp","kind":"event","category":"远程协作","source_hint":"GitLab knowledge retrieval"}
{"action":"rest","text":"远程办公第三天，你开始怀念公司楼下那家难吃但稳定的午饭。稳定有时也是福利。","tone":"wry","kind":"life","category":"远程协作","source_hint":"Buffer remote loneliness"}
{"action":"networking","text":"你在 PR 里多写了取舍理由。跨时区同事醒来后，不用先破案。","tone":"resonant","kind":"event","category":"远程协作","source_hint":"GitLab remote collaboration"}
{"action":"overtime","text":"非工作时间消息又多了三条。你怀疑“灵活办公”的弹性都弹到自己身上。","tone":"sharp","kind":"work","category":"远程协作","source_hint":"Microsoft Work Trend Index messages"}
{"action":"rest","text":"你给书桌旁边放了盏小灯，开灯上班，关灯做人。仪式幼稚，但有效。","tone":"gentle","kind":"health","category":"远程协作","source_hint":"Buffer / DEV remote boundary"}
{"action":"networking","text":"团队决定默认异步，紧急同步要说明为什么。会议终于也需要开具病历。","tone":"wry","kind":"event","category":"远程协作","source_hint":"GitLab async rules"}
{"action":"rest","text":"你发现远程孤独不是矫情，是协作结构缺少非正式接口。人也需要心跳包。","tone":"resonant","kind":"health","category":"远程协作","source_hint":"Gallup remote isolation"}
{"action":"networking","text":"你把需求问题写在共享文档里，不再等对方起床后口头转述。时区差第一次没变成锅。","tone":"gentle","kind":"event","category":"远程协作","source_hint":"GitLab all-remote guide"}
{"action":"overtime","text":"你一天被打断十几次，每次都只有两分钟。深度工作死于小额免密支付。","tone":"sharp","kind":"work","category":"远程协作","source_hint":"Microsoft digital debt"}
{"action":"rest","text":"你下午去楼下买菜，回来反而更能工作。远程不是宅到胜利，而是重新设计节奏。","tone":"gentle","kind":"health","category":"远程协作","source_hint":"Buffer State of Remote Work"}
{"action":"learn-ai","text":"你把“这段代码很丑”改写成“它让哪类变更更慢”。技术债终于从情绪变成账单。","tone":"sharp","kind":"learning","category":"技术债","source_hint":"Reddit ExperiencedDevs technical debt"}
{"action":"side-project","text":"你给旧模块补了第一组测试，没重写世界。债务偿还从一张小收据开始。","tone":"gentle","kind":"event","category":"技术债","source_hint":"Reddit legacy code advice"}
{"action":"overtime","text":"AI 帮你多写了五百行代码，也多写了五百行未来需要理解的东西。速度有时是贷款。","tone":"wry","kind":"work","category":"技术债","source_hint":"Sonar AI technical debt"}
{"action":"learn-ai","text":"你不再把所有历史包袱叫技术债。有些是产品债，有些只是你讨厌的风格。","tone":"resonant","kind":"learning","category":"技术债","source_hint":"Hacker News technical debt definitions"}
{"action":"side-project","text":"你在改动碰到的旧代码旁边顺手补了断言。不是大扫除，是童子军规则。","tone":"gentle","kind":"event","category":"技术债","source_hint":"Reddit technical debt refactoring"}
{"action":"overtime","text":"经理说先快点上线，债以后还。你看了看 backlog，像看见信用卡最低还款。","tone":"sharp","kind":"work","category":"技术债","source_hint":"HN / Reddit tech debt paydown"}
{"action":"learn-ai","text":"你要求 AI 输出为什么这样改，而不只是 diff。没有意图记录的代码，明年像考古。","tone":"resonant","kind":"learning","category":"技术债","source_hint":"HN cognitive debt"}
{"action":"side-project","text":"你拒绝一次性重写，先把最常变的路径切出来。还债也要先找利息最高的。","tone":"sharp","kind":"event","category":"技术债","source_hint":"ExperiencedDevs debt prioritization"}
{"action":"overtime","text":"AI 生成的代码看起来都对，直到线上流量像考官一样问边界条件。","tone":"wry","kind":"work","category":"技术债","source_hint":"Sonar plausible AI defects"}
{"action":"learn-ai","text":"你把技术债评审和业务指标绑在一起。老板终于听见“慢”背后的钱声。","tone":"resonant","kind":"learning","category":"技术债","source_hint":"Reddit impact-based tech debt"}
{"action":"side-project","text":"你删除了一段没人敢碰的兼容逻辑，先查日志再动手。勇敢不是裸奔。","tone":"sharp","kind":"event","category":"技术债","source_hint":"HN legacy maintenance"}
{"action":"learn-ai","text":"你发现债不只在代码里，也在没人知道为什么这样做的决策里。注释救不了失忆组织。","tone":"resonant","kind":"learning","category":"技术债","source_hint":"HN technical cognitive intent debt"}
{"action":"overtime","text":"团队把 AI 当吞吐量放大器，review 队列先爆了。水龙头变粗，排水管没变。","tone":"wry","kind":"work","category":"技术债","source_hint":"METR / Sonar AI verification debt"}
{"action":"side-project","text":"你给旧接口写了迁移说明，而不是只在群里喊“大家别再用了”。文档比吼叫持久。","tone":"gentle","kind":"event","category":"技术债","source_hint":"Atlassian DevEx 信息自助"}
{"action":"learn-ai","text":"你把“重构”拆成降低风险、提升速度、减少事故三种目标。词变具体，争论变短。","tone":"sharp","kind":"learning","category":"技术债","source_hint":"DORA 2025 系统能力"}
{"action":"overtime","text":"你们又新增一个临时开关，没人写删除日期。系统里多了一根不会自然脱落的刺。","tone":"wry","kind":"work","category":"技术债","source_hint":"Reddit technical debt source"}
{"action":"side-project","text":"你在 PR 描述里写清楚“不解决什么”。未来的维护者，包括未来的你，都会少骂一句。","tone":"gentle","kind":"event","category":"技术债","source_hint":"GitHub PR review / tech debt discussion"}
```
