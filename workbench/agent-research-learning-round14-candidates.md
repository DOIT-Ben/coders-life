# agent-research-learning-round14-candidates

来源：调研子智能体 B 基于公开报告、社区讨论与经验帖整理。候选内容为原创改写，只作为弹窗候选，不进入正式数据池，不修改 HTML。

## 来源列表

- Stack Overflow Developer Survey 2025：AI 工具采用率上升、信任下降、学习 AI 工具成为职业学习主题。https://survey.stackoverflow.co/2025
- Stack Overflow 2025 AI 分页：开发者对 AI 输出准确性的信任分化，资深开发者更谨慎。https://survey.stackoverflow.co/2025/ai
- JetBrains State of Developer Ecosystem 2025：AI 已进入日常开发工具链，开发者同时关注生产力与自我定义。https://devecosystem-2025.jetbrains.com/
- DORA State of AI-assisted Software Development 2025：AI 更像放大器，会放大组织系统的优点与缺陷。https://dora.dev/dora-report-2025/
- GitHub Octoverse 2025：开源贡献规模继续增长，AI、代理与类型化语言改变协作结构。https://octoverse.github.com/
- GitHub Blog Octoverse 2025：公开仓库贡献增长，2025 年 3 月新开源贡献者创高。https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/
- Tidelift Maintainer Impact Report 2024：大量维护者无偿维护项目，付费维护者更可能落实安全与维护实践。https://www.sonarsource.com/the-2024-tidelift-maintainer-impact-report.pdf
- Atlassian State of Developer Experience 2025：AI 节省时间，但组织低效、信息查找和沟通成本抵消收益。https://www.atlassian.com/teams/software-development/state-of-developer-experience-2025
- METR 2025 AI productivity study：在成熟开源项目中，早期 2025 AI 工具让经验开发者任务耗时增加，且主观感知与实测存在偏差。https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- Hacker News：LeetCode 面试疲劳、AI 编码陷阱、开源维护负担与用户期待边界讨论。https://news.ycombinator.com/item?id=47761785
- Reddit r/ExperiencedDevs / r/opensource：资深开发者使用 AI 的审慎态度、维护者倦怠和候选人疲劳经验。https://www.reddit.com/r/ExperiencedDevs/comments/1lwk503/study_experienced_devs_think_they_are_24_faster/
- V2EX：AI 学习焦虑、35 岁职业阶段、学习技术是否还有必要、找工作经历和新手困惑讨论。https://www.v2ex.com/t/1195690
- DEV Community：AI 编码工具边界、基础能力仍重要、开源退出与维护者孤独讨论。https://dev.to/aspittel/teaching-code-in-the-ai-era-why-fundamentals-still-matter-1k1g
- GitHub Community：维护者希望限制 AI 生成 issue/PR、减少低质量贡献和社区负担。https://github.com/orgs/community/discussions/159749
- Lobsters：AI 对编程热情、软件可替换性与长期理解的讨论。https://lobste.rs/s/qmjejh/ai_is_slowly_munching_away_my_passion

## 主题簇

- 学习节奏：从“追热点”转向“解决当前问题”，强调可复盘、可迁移、可验证的学习。
- AI 工具边界：AI 适合解释、草拟、探索和重复工作，但需要人负责上下文、测试、审查和后果。
- 开源维护：贡献增长不等于维护可持续，维护者需要边界、资金、可筛选的贡献和低噪声互动。
- 面试疲劳：刷题、系统设计、行为面试与多轮流程造成候选人消耗，需要把经历转为复盘资产。
- 职业阶段：30+、35+、资深期焦虑背后是角色变化，从写代码转向定义问题、业务判断和协作影响。
- 长期能力：文档、沟通、测试、架构判断、领域理解、信息筛选和学习方法，比单一工具更能穿越周期。

## JSONL 候选

```jsonl
{"action":"learn-ai","text":"你把学习清单从十二个热门框架删到一个线上问题。焦虑没全消失，但今晚终于知道为什么学。","tone":"resonant","kind":"learning","category":"学习节奏","source_hint":"Stack Overflow 2025 学习 AI 工具"}
{"action":"learn-ai","text":"你没有再收藏新教程，而是把旧项目的失败原因写成三条复盘。收藏夹少一页，经验多一格。","tone":"gentle","kind":"learning","category":"学习节奏","source_hint":"V2EX 学习焦虑讨论"}
{"action":"side-project","text":"你用周末做了一个只解决自己小痛点的工具。它不酷，但比第七门课程更接近能力。","tone":"gentle","kind":"learning","category":"学习节奏","source_hint":"DEV 学习与实践帖"}
{"action":"learn-ai","text":"你把“掌握 AI”改成“知道哪些任务能交给 AI”。目标变窄后，学习突然像工作而不是祈祷。","tone":"sharp","kind":"learning","category":"学习节奏","source_hint":"JetBrains Developer Ecosystem 2025"}
{"action":"rest","text":"你今晚没有补课，只把睡眠补上。明天的大脑，可能比今晚的播放列表更值钱。","tone":"gentle","kind":"health","category":"学习节奏","source_hint":"Atlassian DevEx 2025 非编码消耗"}
{"action":"learn-ai","text":"你发现自己不是不会学，而是每次都想一次性完成转行、升职、抗裁员和修仙。","tone":"wry","kind":"learning","category":"学习节奏","source_hint":"V2EX 新手困惑讨论"}
{"action":"networking","text":"你问同事最近真正用上的新技术，答案只有两个。热榜很吵，生产环境很节俭。","tone":"resonant","kind":"learning","category":"学习节奏","source_hint":"Stack Overflow 2025 工具使用"}
{"action":"learn-ai","text":"你把学习笔记改成“问题、尝试、证据、结论”。格式朴素，但终于能复用。","tone":"gentle","kind":"learning","category":"学习节奏","source_hint":"DORA 2025 系统能力"}
{"action":"side-project","text":"你把教程里的 todo app 换成自己的报销小工具。功能少了，真实度上来了。","tone":"wry","kind":"learning","category":"学习节奏","source_hint":"DEV AI 学习实践"}
{"action":"learn-ai","text":"你今天只读了一页官方文档，却跑通了一个边界条件。进度条慢，但不是幻觉。","tone":"resonant","kind":"learning","category":"学习节奏","source_hint":"Stack Overflow 社区知识"}
{"action":"learn-ai","text":"你停止用“别人都在学”安排晚上。今晚的标准变成：这东西能不能减少下次排障时间。","tone":"sharp","kind":"learning","category":"学习节奏","source_hint":"V2EX 学技术必要性讨论"}
{"action":"rest","text":"你关掉技术播客散步二十分钟，回来后发现报错不是人生评价，只是少了一个参数。","tone":"wry","kind":"health","category":"学习节奏","source_hint":"Atlassian DevEx 2025 开发者体验"}
{"action":"learn-ai","text":"你给每个学习目标加了过期时间。三个月没用上的热词，先从精神内存里卸载。","tone":"sharp","kind":"learning","category":"学习节奏","source_hint":"JetBrains 2025 工具趋势"}
{"action":"networking","text":"你在群里问了一个具体复现，而不是求完整路线。回答少了，但有一个真的能用。","tone":"gentle","kind":"learning","category":"学习节奏","source_hint":"V2EX 新手求助讨论"}
{"action":"learn-ai","text":"你承认自己需要的是学习系统，不是更多入口。于是把浏览器标签页关到个位数。","tone":"resonant","kind":"learning","category":"学习节奏","source_hint":"Atlassian DevEx 信息查找成本"}
{"action":"side-project","text":"你把学到的新库只用在一个隔离脚本里。没有全项目重构，团队暂时平安。","tone":"wry","kind":"event","category":"学习节奏","source_hint":"DORA 2025 组织放大器"}
{"action":"learn-ai","text":"你不再问“这技术有没有前途”，改问“它解决哪类问题，我现在有没有这类问题”。","tone":"sharp","kind":"learning","category":"学习节奏","source_hint":"V2EX 职业阶段讨论"}
{"action":"rest","text":"你决定今天不把焦虑换成课程订单。钱包和大脑同时松了一口气。","tone":"wry","kind":"health","category":"学习节奏","source_hint":"V2EX AI 焦虑讨论"}
{"action":"learn-ai","text":"你把碎片文章整理成一张能力地图。知识终于从弹幕变成了坐标。","tone":"resonant","kind":"learning","category":"学习节奏","source_hint":"Stack Overflow 2025 教育经验"}
{"action":"networking","text":"你请资深同事讲一次踩坑史，比看十篇最佳实践更快知道哪里会死人。","tone":"gentle","kind":"learning","category":"学习节奏","source_hint":"Hacker News 经验开发者讨论"}
{"action":"learn-ai","text":"你让 AI 先列不确定点，再让它写代码。它少了一点神性，多了一点可审查性。","tone":"resonant","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow 2025 AI 信任"}
{"action":"learn-ai","text":"AI 给了你一个漂亮方案，你第一反应不是复制，而是问测试怎么证明它没撒谎。","tone":"sharp","kind":"learning","category":"AI工具边界","source_hint":"METR 2025 AI productivity study"}
{"action":"side-project","text":"你用 AI 做了原型，又亲手删掉三层没必要的抽象。机器会加速，未必会克制。","tone":"wry","kind":"event","category":"AI工具边界","source_hint":"DEV AI coding assistants"}
{"action":"learn-ai","text":"你发现 AI 最适合当第二大脑，不适合当最终责任人。上线按钮还是长在你这边。","tone":"sharp","kind":"learning","category":"AI工具边界","source_hint":"DORA 2025 AI 放大器"}
{"action":"learn-ai","text":"你要求 AI 解释每个改动的代价。它开始变慢，你开始放心。","tone":"gentle","kind":"learning","category":"AI工具边界","source_hint":"DEV fundamentals still matter"}
{"action":"overtime","text":"老板说 AI 能省一半时间，排期却多了一倍。你怀疑被优化的是缓冲区，不是工作量。","tone":"sharp","kind":"event","category":"AI工具边界","source_hint":"Atlassian DevEx 2025 AI 悖论"}
{"action":"learn-ai","text":"你把 AI 输出和文档对了一遍。效率账面少赚五分钟，事故账面少亏一整晚。","tone":"resonant","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow AI trust gap"}
{"action":"learn-ai","text":"你没有让 AI 直接改迁移脚本。它不会被叫去凌晨回滚，而你会。","tone":"sharp","kind":"event","category":"AI工具边界","source_hint":"GitHub Community AI 贡献边界"}
{"action":"learn-ai","text":"你把提示词从“帮我实现”改成“先复述需求和风险”。工具突然像同事，而不是许愿池。","tone":"gentle","kind":"learning","category":"AI工具边界","source_hint":"DORA 2025 工作流清晰度"}
{"action":"side-project","text":"你用 AI 一小时搭了页面，花三小时理解它为什么能跑。速度很快，账单在后面。","tone":"wry","kind":"learning","category":"AI工具边界","source_hint":"Lobsters AI passion discussion"}
{"action":"learn-ai","text":"你把 AI 当橡皮鸭，只是这只鸭子偶尔会自信地递给你炸弹。","tone":"wry","kind":"learning","category":"AI工具边界","source_hint":"Hacker News AI coding trap"}
{"action":"learn-ai","text":"你记录了 AI 擅长的三类任务和不该碰的三类任务。边界一清楚，恐惧少了一半。","tone":"resonant","kind":"learning","category":"AI工具边界","source_hint":"JetBrains 2025 AI 使用"}
{"action":"networking","text":"团队约定 AI 代码必须能被作者讲清楚。沉默复制的时代，在评审门口暂停。","tone":"sharp","kind":"event","category":"AI工具边界","source_hint":"DEV fundamentals still matter"}
{"action":"learn-ai","text":"AI 帮你写了测试名，你自己补了断言。名字像承诺，断言才像证据。","tone":"gentle","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow AI accuracy"}
{"action":"overtime","text":"AI 生成了更多代码，也生成了更多 review。你的工作从搬砖变成验砖，腰还是疼。","tone":"wry","kind":"event","category":"AI工具边界","source_hint":"METR 2025 review overhead"}
{"action":"learn-ai","text":"你拒绝把“模型说可以”写进技术方案。架构决策需要理由，不需要神谕。","tone":"sharp","kind":"learning","category":"AI工具边界","source_hint":"DORA 2025 组织系统"}
{"action":"side-project","text":"你让 AI 帮你读陌生代码，却只接受它指出入口和调用链。方向盘还在你手里。","tone":"resonant","kind":"learning","category":"AI工具边界","source_hint":"Hacker News AI assistant discussion"}
{"action":"learn-ai","text":"你开始把 AI 输出看成候选草稿，而不是答案。心态一变，返工少了。","tone":"gentle","kind":"learning","category":"AI工具边界","source_hint":"Stack Overflow 2025 AI sentiment"}
{"action":"networking","text":"你和团队同步了哪些代码不能喂给外部模型。安全感不是口号，是配置和边界。","tone":"sharp","kind":"event","category":"AI工具边界","source_hint":"GitHub Community AI PR 讨论"}
{"action":"rest","text":"你今天没有刷“程序员会不会消失”的帖子。少喂一次焦虑，明天多一点判断力。","tone":"gentle","kind":"health","category":"AI工具边界","source_hint":"V2EX AI 焦虑讨论"}
{"action":"side-project","text":"你给开源项目提了一个文档 PR，说明复现步骤和环境。维护者没有夸你，但少猜了十分钟。","tone":"gentle","kind":"event","category":"开源维护","source_hint":"GitHub Octoverse 2025"}
{"action":"networking","text":"你提交 issue 前先搜了重复项。少制造一个噪声，也算对公共基础设施做贡献。","tone":"resonant","kind":"event","category":"开源维护","source_hint":"GitHub Community issue 管理"}
{"action":"side-project","text":"你的开源小工具第一次被陌生人催更。成就感来了，客服感也来了。","tone":"wry","kind":"event","category":"开源维护","source_hint":"DEV 维护者倦怠"}
{"action":"rest","text":"你关闭了周末的项目通知。免费维护不是无限待命，热爱也需要下班。","tone":"sharp","kind":"health","category":"开源维护","source_hint":"Tidelift Maintainer Impact Report 2024"}
{"action":"networking","text":"你没有催维护者合并，只补了测试截图和失败日志。尊重别人时间，是最便宜的协作礼仪。","tone":"gentle","kind":"event","category":"开源维护","source_hint":"DEV open source maintainer loneliness"}
{"action":"side-project","text":"你删掉了 README 里过度承诺的路线图。少画一个饼，未来的自己少背一口锅。","tone":"sharp","kind":"event","category":"开源维护","source_hint":"Hacker News maintainer burden"}
{"action":"networking","text":"维护者拒了你的 PR，但给了完整理由。被拒不舒服，却比沉默排队更有营养。","tone":"resonant","kind":"learning","category":"开源维护","source_hint":"GitHub Community PR 管理"}
{"action":"rest","text":"你没有回复那个理直气壮的需求。开源不是外包合同，沉默也是边界。","tone":"sharp","kind":"health","category":"开源维护","source_hint":"Reddit r/opensource burnout"}
{"action":"side-project","text":"你把公司里反复踩的坑沉淀成小库。star 还没有，但经验已经有了外部接口。","tone":"gentle","kind":"learning","category":"开源维护","source_hint":"GitHub Octoverse 2025 贡献增长"}
{"action":"networking","text":"你在 issue 模板里写清楚最小复现。不是不欢迎用户，是不欢迎谜语。","tone":"wry","kind":"event","category":"开源维护","source_hint":"GitHub Community maintainer shield"}
{"action":"side-project","text":"你第一次发现开源履历不是链接数量，而是你能讲清楚协作、取舍和后果。","tone":"resonant","kind":"learning","category":"开源维护","source_hint":"Tidelift 2024 maintainer report"}
{"action":"rest","text":"你把“每个 PR 都当天处理”改成“每周两次集中处理”。项目慢一点，人活久一点。","tone":"gentle","kind":"health","category":"开源维护","source_hint":"Hacker News open source burnout"}
{"action":"networking","text":"你遇到 AI 生成的低质量 issue，先贴贡献规范，再关掉。礼貌不是无底洞。","tone":"sharp","kind":"event","category":"开源维护","source_hint":"GitHub Community block Copilot issues"}
{"action":"side-project","text":"你给项目加了“暂不接受新功能”的标签。维护边界写出来，内疚就少一点。","tone":"resonant","kind":"event","category":"开源维护","source_hint":"GitHub Community disable PR settings"}
{"action":"networking","text":"你从“我要贡献核心代码”退到“先修一个能验证的 bug”。入口小，阻力也小。","tone":"gentle","kind":"learning","category":"开源维护","source_hint":"DEV open source contributor advice"}
{"action":"rest","text":"你承认维护开源也会孤独。仓库很公开，压力却经常只有一个人看见。","tone":"resonant","kind":"health","category":"开源维护","source_hint":"DEV maintainer loneliness"}
{"action":"side-project","text":"你把无人维护的依赖替换掉。不是背叛开源，是承认软件也会老。","tone":"sharp","kind":"event","category":"开源维护","source_hint":"GitHub Community npm security discussion"}
{"action":"networking","text":"你建议公司为关键开源依赖付费支持。感谢可以写在评论里，预算要写进采购里。","tone":"sharp","kind":"event","category":"开源维护","source_hint":"Tidelift paid maintainers report"}
{"action":"side-project","text":"你没有再追求项目被所有人喜欢。能被正确的人稳定使用，已经是维护者的奢侈。","tone":"resonant","kind":"life","category":"开源维护","source_hint":"Hacker News open-source dreams discussion"}
{"action":"rest","text":"你把开源通知静音到明早。基础设施很重要，你的基础生命体征也很重要。","tone":"wry","kind":"health","category":"开源维护","source_hint":"Reddit maintainer burnout"}
{"action":"interview","text":"你刷了三天题，面试官问的是一个业务事故。题库没白刷，但人生没押中。","tone":"wry","kind":"event","category":"面试疲劳","source_hint":"Hacker News LeetCode discussion"}
{"action":"interview","text":"你把八年经验塞进四十五分钟，像把 monorepo 打成二维码。讲不完，不等于你不值钱。","tone":"resonant","kind":"event","category":"面试疲劳","source_hint":"Reddit ExperiencedDevs 面试讨论"}
{"action":"rest","text":"你今天暂停投简历。不是认输，是防止自己把每个未读都翻译成人生否定。","tone":"gentle","kind":"health","category":"面试疲劳","source_hint":"V2EX 找工作经历"}
{"action":"interview","text":"你把简历里的“精通”改成“负责过”。少一点气势，多一点被追问时活下来的概率。","tone":"wry","kind":"learning","category":"面试疲劳","source_hint":"V2EX 入职复盘"}
{"action":"networking","text":"你约老同事喝咖啡，没有开口就要内推。关系先恢复，机会才不像群发消息。","tone":"gentle","kind":"life","category":"面试疲劳","source_hint":"Hacker News job search advice"}
{"action":"interview","text":"你面完后记录被问倒的问题。失败如果不入库，只会在凌晨循环播放。","tone":"resonant","kind":"learning","category":"面试疲劳","source_hint":"Reddit cscareerquestions interview fatigue"}
{"action":"interview","text":"你发现刷题能进门，项目复盘决定能不能坐下。今晚少刷一题，多写一次取舍。","tone":"sharp","kind":"learning","category":"面试疲劳","source_hint":"Hacker News LeetCode ROI"}
{"action":"rest","text":"你关掉招聘软件，先吃一顿正常晚饭。候选人也是人，不是等待状态的对象。","tone":"gentle","kind":"health","category":"面试疲劳","source_hint":"V2EX 求职心路"}
{"action":"interview","text":"远程面试前你关掉 AI 助手。不是不会用，而是想让对方看见你的真实调试路径。","tone":"resonant","kind":"event","category":"面试疲劳","source_hint":"Stack Overflow AI trust"}
{"action":"interview","text":"你被一道脑筋急转弯式算法题送走。电梯门合上时，你决定不把一家公司的筛法当行业真理。","tone":"sharp","kind":"life","category":"面试疲劳","source_hint":"HN ridiculous job interview"}
{"action":"networking","text":"朋友 mock 面试时提醒你：你总解释技术细节，却忘了讲影响。痛，但比拒信有用。","tone":"resonant","kind":"learning","category":"面试疲劳","source_hint":"Reddit ExperiencedDevs career advice"}
{"action":"interview","text":"你在求职表里加了一列：是否尊重候选人时间。找工作也是双向筛选，不只是被审。","tone":"sharp","kind":"life","category":"面试疲劳","source_hint":"Hacker News interview fatigue"}
{"action":"interview","text":"你准备了系统设计，结果对方追问框架冷门参数。你礼貌回答，也默默更新风险评分。","tone":"wry","kind":"event","category":"面试疲劳","source_hint":"V2EX 面试经历"}
{"action":"rest","text":"你没有在半夜重写简历。疲惫状态下的自我包装，常常像线上热修一样危险。","tone":"gentle","kind":"health","category":"面试疲劳","source_hint":"Atlassian DevEx 过载"}
{"action":"interview","text":"你把离职原因讲成寻找匹配，而不是逃离废墟。成熟有时是不给愤怒递话筒。","tone":"resonant","kind":"event","category":"面试疲劳","source_hint":"Reddit career transition discussion"}
{"action":"interview","text":"面试排了五轮，你开始怀疑他们不是招人，是在训练自己的流程耐力。","tone":"wry","kind":"event","category":"面试疲劳","source_hint":"Hacker News interview process"}
{"action":"networking","text":"你请前同事看简历，对方只圈出一句：这个成果能量化吗？比模板课更直接。","tone":"gentle","kind":"learning","category":"面试疲劳","source_hint":"V2EX 入职经验"}
{"action":"interview","text":"你没有再背完美答案，而是准备三个真实事故。面试可以随机，经历不能伪造。","tone":"sharp","kind":"learning","category":"面试疲劳","source_hint":"Hacker News job preparation"}
{"action":"rest","text":"你给自己设了每日投递上限。不是不努力，是不把自尊心交给批量表单。","tone":"resonant","kind":"health","category":"面试疲劳","source_hint":"Reddit cscareerquestions burnout"}
{"action":"interview","text":"你追问团队如何使用 AI 和 code review。面试官愣了一下，你也在面试他们。","tone":"sharp","kind":"event","category":"面试疲劳","source_hint":"DORA 2025 AI assisted development"}
{"action":"learn-ai","text":"35 岁之后，你发现真正过时的不是语言版本，而是只等别人分配问题的工作方式。","tone":"sharp","kind":"learning","category":"职业阶段","source_hint":"V2EX 35 岁职业讨论"}
{"action":"networking","text":"你和同龄程序员聊房贷、孩子和 AI，发现大家都在装镇定。共鸣不能还债，但能续命。","tone":"resonant","kind":"life","category":"职业阶段","source_hint":"V2EX 中年危机讨论"}
{"action":"learn-ai","text":"你把职业目标从“写更多代码”改成“定义更清楚的问题”。职位没变，重心变了。","tone":"resonant","kind":"learning","category":"职业阶段","source_hint":"V2EX 35 岁之后讨论"}
{"action":"side-project","text":"你开始做一个能被外部市场理解的小作品。不是立刻赚钱，是让能力有出口。","tone":"gentle","kind":"life","category":"职业阶段","source_hint":"GitHub Octoverse 开源贡献"}
{"action":"rest","text":"你没有再把每个年龄贴都读到心跳加速。行业会变，恐慌不该当日程管理器。","tone":"gentle","kind":"health","category":"职业阶段","source_hint":"V2EX AI 焦虑讨论"}
{"action":"learn-ai","text":"你承认资深不是免学金牌，而是更会判断学什么、为什么学、学到哪里停。","tone":"sharp","kind":"learning","category":"职业阶段","source_hint":"JetBrains Developer Ecosystem 2025"}
{"action":"networking","text":"你向业务同事请教指标含义。技术栈没有更新，但你的问题终于接近了钱。","tone":"resonant","kind":"learning","category":"职业阶段","source_hint":"DORA 2025 组织系统"}
{"action":"learn-ai","text":"你发现 AI 降低了写代码门槛，也抬高了判断代码好坏的门槛。老经验突然有了新岗位。","tone":"sharp","kind":"learning","category":"职业阶段","source_hint":"Stack Overflow 2025 AI trust"}
{"action":"side-project","text":"你把多年排障经验写成公开文章。不是鸡汤，是给未来合作方看的证据。","tone":"gentle","kind":"learning","category":"职业阶段","source_hint":"V2EX 外部可识别能力"}
{"action":"rest","text":"你今天没有证明自己还能熬夜。中年程序员的性能优化，从不把硬盘跑满开始。","tone":"wry","kind":"health","category":"职业阶段","source_hint":"Atlassian DevEx 2025 过载"}
{"action":"learn-ai","text":"你不再把管理当唯一出口，也不把写代码当唯一尊严。角色可以换，问题意识不能丢。","tone":"resonant","kind":"learning","category":"职业阶段","source_hint":"V2EX 职业路线讨论"}
{"action":"networking","text":"你开始维护行业联系人，而不是只维护依赖版本。前者也会在关键时刻解决冲突。","tone":"gentle","kind":"life","category":"职业阶段","source_hint":"Hacker News career advice"}
{"action":"learn-ai","text":"你发现自己害怕的不是 AI，而是过去几年没有留下可迁移的资产。今天开始补账。","tone":"sharp","kind":"learning","category":"职业阶段","source_hint":"V2EX 技术是否还有必要"}
{"action":"side-project","text":"你把公司内部经验抽象成不含敏感信息的方法论。能带走的能力，才不完全属于公司。","tone":"resonant","kind":"learning","category":"职业阶段","source_hint":"Atlassian DevEx 文档协作"}
{"action":"rest","text":"你接受职业阶段会变慢。不是退化，是开始把速度换成命中率。","tone":"gentle","kind":"health","category":"职业阶段","source_hint":"METR 经验开发者研究"}
{"action":"learn-ai","text":"你开始补业务、产品和沟通，而不是只补语法。AI 会写函数，但不会替你判断需求值不值。","tone":"sharp","kind":"learning","category":"职业阶段","source_hint":"DORA 2025 AI 放大器"}
{"action":"networking","text":"你和年轻同事互换技能：他教你新工具，你教他事故复盘。年龄差没有消失，但变成了接口。","tone":"resonant","kind":"learning","category":"职业阶段","source_hint":"JetBrains 2025 开发者生态"}
{"action":"learn-ai","text":"你把“还能不能干到退休”改成“未来三年我能沉淀什么”。问题小了，手能动了。","tone":"gentle","kind":"learning","category":"职业阶段","source_hint":"V2EX 一辈子程序员讨论"}
{"action":"side-project","text":"你试着把副业做成服务，而不是又一个技术玩具。职业第二曲线，先从有人愿意用开始。","tone":"resonant","kind":"life","category":"职业阶段","source_hint":"V2EX AI 时代经验价值"}
{"action":"rest","text":"你没有和二十岁的精力比拼。你改比判断、复盘和少踩坑，终于像在自己的赛道上跑。","tone":"gentle","kind":"health","category":"职业阶段","source_hint":"V2EX 35+ 程序员讨论"}
{"action":"learn-ai","text":"你把文档写清楚后，AI 和同事都少问了两轮。长期能力有时就是减少别人猜测。","tone":"resonant","kind":"learning","category":"长期能力","source_hint":"Atlassian DevEx 信息查找成本"}
{"action":"learn-ai","text":"你先写测试，再让 AI 改实现。工具很快，但红绿灯必须由你装。","tone":"sharp","kind":"learning","category":"长期能力","source_hint":"DEV AI accelerates not thinking"}
{"action":"networking","text":"你在评审里少说“这样更优雅”，多说“这个约束来自哪里”。沟通从审美回到证据。","tone":"gentle","kind":"learning","category":"长期能力","source_hint":"DORA 2025 团队对齐"}
{"action":"side-project","text":"你给小项目补了 README、测试和发布说明。它还是小，但终于不像一次性脚本。","tone":"resonant","kind":"event","category":"长期能力","source_hint":"GitHub Octoverse 开源实践"}
{"action":"learn-ai","text":"你开始练习把复杂问题拆给人听。能解释清楚，才有资格让模型和团队一起动。","tone":"sharp","kind":"learning","category":"长期能力","source_hint":"Stack Overflow 2025 社区知识"}
{"action":"rest","text":"你给深度工作留了无会议块。长期能力不是靠意志力，是靠日历保护。","tone":"gentle","kind":"health","category":"长期能力","source_hint":"Atlassian DevEx 组织低效"}
{"action":"learn-ai","text":"你把“会用工具”升级成“能验证工具输出”。从按钮熟练工，变成责任边界管理员。","tone":"resonant","kind":"learning","category":"长期能力","source_hint":"Stack Overflow AI trust gap"}
{"action":"networking","text":"你主动同步风险，而不是等事故证明你早就知道。沟通提前，英雄主义就少一点。","tone":"sharp","kind":"event","category":"长期能力","source_hint":"DORA 2025 组织能力"}
{"action":"learn-ai","text":"你维护了一份排障手册。它不性感，但比凌晨临场发挥更像工程。","tone":"gentle","kind":"learning","category":"长期能力","source_hint":"Atlassian DevEx 文档"}
{"action":"side-project","text":"你把一次失败上线写成案例。长期能力不是从不摔倒，而是摔倒后能留下路标。","tone":"resonant","kind":"learning","category":"长期能力","source_hint":"Hacker News 经验复盘"}
{"action":"learn-ai","text":"你学会区分问题、方案和偏好。会议少吵十五分钟，代码少绕两层弯。","tone":"sharp","kind":"learning","category":"长期能力","source_hint":"DORA 2025 工作流清晰度"}
{"action":"networking","text":"你把 PR 描述写到新人能看懂。可维护性不是给机器看的，是给下一个疲惫的人看的。","tone":"gentle","kind":"event","category":"长期能力","source_hint":"DEV fundamentals still matter"}
{"action":"learn-ai","text":"你开始关注数据和业务结果，而不是只关注用了什么框架。长期价值终于有了计量单位。","tone":"resonant","kind":"learning","category":"长期能力","source_hint":"V2EX 外部可识别能力"}
{"action":"rest","text":"你没有把每晚都献给成长。可持续的学习曲线，不能靠透支画出来。","tone":"gentle","kind":"health","category":"长期能力","source_hint":"Atlassian DevEx 长期成功"}
{"action":"learn-ai","text":"你练习先画边界再写代码。边界清楚后，AI、同事和未来的你都少迷路。","tone":"resonant","kind":"learning","category":"长期能力","source_hint":"DORA 2025 AI capabilities"}
{"action":"side-project","text":"你把项目里的隐性知识搬进文档。没有立刻涨薪，但 bus factor 悄悄下降了。","tone":"wry","kind":"event","category":"长期能力","source_hint":"Atlassian DevEx 2025"}
{"action":"learn-ai","text":"你不再把“快”当唯一指标。返工、审查、理解和交接，也开始进入你的速度公式。","tone":"sharp","kind":"learning","category":"长期能力","source_hint":"METR 2025 生产力偏差"}
{"action":"networking","text":"你在设计评审里先问失败模式。大家沉默了一会儿，然后方案变得更像工程。","tone":"resonant","kind":"event","category":"长期能力","source_hint":"DORA 2025 质量与系统"}
{"action":"learn-ai","text":"你把知识从脑子里搬到可搜索的地方。长期能力不是记住一切，是让团队少重复找。","tone":"gentle","kind":"learning","category":"长期能力","source_hint":"Atlassian DevEx 信息发现"}
{"action":"rest","text":"你给职业生涯留了恢复时间。马拉松选手不会每天都按冲刺训练。","tone":"resonant","kind":"health","category":"长期能力","source_hint":"JetBrains 2025 开发者自我认知"}
```
