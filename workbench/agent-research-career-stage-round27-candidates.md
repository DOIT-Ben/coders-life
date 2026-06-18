# Round27 职业阶段与开发共鸣候选调研

## 调研来源清单与覆盖主题

- Reddit r/ExperiencedDevs: AI 编码工具评估、职业阶段错位、代码 review 摩擦、技术债、资深工程师职责边界。
- Reddit r/webdev: 自由职业 scope creep、客户沟通、维护费、AI 辅助后遗症、技术债管理。
- Reddit r/opensource: 维护者倦怠、AI 生成 PR/issue、低质量贡献、社区反馈与信任。
- Reddit r/indiehackers / r/buildinpublic: 独立开发、公开构建、弱连接反馈、目标用户与同行围观的错位。
- Hacker News Ask HN / Show HN: 自由职业合同与维护、用户沟通和开发时间分配、Side project 范围控制、独立产品反馈。
- DEV Community: AI-native intent debt、AI 时代技术债、独立开发如何选择技术债、开源维护者角色差异。
- GitHub Blog / GitHub Community 相关讨论: 维护者月、AI 时代围绕代码的人类工作变得更隐形、PR 控制与维护者负担。
- CNCF Blog: 生成式 AI 时代开源维护，强调任何 PR 都需要人类验证、责任和上下文理解。
- The New Stack / InfoQ / Ars Technica / The Register / ITPro: AI 生成代码、开源维护者负担、review 瓶颈、AI slop 安全报告等行业观察。
- 研究论文线索: open-source technical debt、self-admitted technical debt、vibe coding 对维护者 review overhead 的影响。

覆盖主题：职业阶段焦虑、从 junior 到 senior 的能力断层、staff/lead 的隐形工作、技术债利息、代码 review 的沟通成本、AI 辅助开发的理解债、开源维护者疲劳、独立开发孤独感、自由职业边界、弱连接反馈的价值与噪音。

## JSONL 候选

{"text":"新手最怕写不出来，老手更怕写出来以后没人知道为什么。","action":"记录这次实现背后的取舍，而不是只提交能跑的代码。","tags":["career-stage","technical-debt","documentation"],"source_hint":"Reddit ExperiencedDevs + DEV intent debt 讨论归纳","evidence_level":"high"}
{"text":"升到 senior 后，待办列表少了语法问题，多了谁来背锅的问题。","action":"把风险、owner 和回退条件写进 PR 描述。","tags":["senior","ownership","code-review"],"source_hint":"r/ExperiencedDevs senior/lead 角色讨论","evidence_level":"high"}
{"text":"技术债不是脏代码本身，是团队默认以后会有一个更闲的自己。","action":"给债务加到期日，不要只加 TODO。","tags":["technical-debt","planning"],"source_hint":"HN/Reddit 技术债经验帖归纳","evidence_level":"high"}
{"text":"AI 让代码看起来更像答案，也让作者更容易忘记题目。","action":"合并前先能口头解释核心分支和失败场景。","tags":["ai-assisted","understanding","review"],"source_hint":"r/ExperiencedDevs AI 工具评估讨论","evidence_level":"high"}
{"text":"最难 review 的不是烂代码，而是看起来很熟练却没有上下文的代码。","action":"要求 PR 写明意图、约束和没选的方案。","tags":["code-review","ai-assisted","intent-debt"],"source_hint":"ResearchGate/Reddit AI review overhead 讨论","evidence_level":"medium"}
{"text":"自由职业的第一个 bug 往往不在代码里，在没写清楚的范围里。","action":"把新增需求先放进 change log，再谈工期和费用。","tags":["freelance","scope-creep","client-work"],"source_hint":"r/webdev scope creep 讨论","evidence_level":"high"}
{"text":"开源维护者收到的不是贡献队列，而是一条永远不会清空的客服工单。","action":"给 issue 模板加复现要求和最低上下文门槛。","tags":["open-source","maintainer","burnout"],"source_hint":"r/opensource maintainer burnout 讨论","evidence_level":"high"}
{"text":"build in public 不是获客魔法，更多时候只是给孤独开发者一个回声。","action":"区分给同行看的进展和给用户看的价值。","tags":["indie-dev","build-in-public","feedback"],"source_hint":"r/buildinpublic / Indie Hackers 讨论","evidence_level":"high"}
{"text":"代码 review 卡住时，常常不是意见太多，而是没人标注哪条真会阻塞。","action":"把评论分成 blocking、suggestion 和 note。","tags":["code-review","team-communication"],"source_hint":"r/ExperiencedDevs PR nightmare 讨论","evidence_level":"high"}
{"text":"中级工程师的焦虑，是既要交付，又开始看见交付留下的坑。","action":"每个 sprint 留一个小债务偿还名额。","tags":["career-stage","technical-debt","mid-level"],"source_hint":"Reddit career plateau 与技术债帖归纳","evidence_level":"medium"}
{"text":"AI 可以补全样板，但补不全团队没说出口的架构偏好。","action":"先给 AI 明确项目约定，再让它动手。","tags":["ai-assisted","architecture","team-norms"],"source_hint":"DEV AI-native intent debt 讨论","evidence_level":"high"}
{"text":"资深不是少犯错，而是知道哪种错会在三个月后收利息。","action":"review 时优先看扩散面、回滚面和维护面。","tags":["senior","technical-debt","risk"],"source_hint":"r/ExperiencedDevs senior 能力讨论","evidence_level":"high"}
{"text":"维护老系统时，真正的文档常常藏在那些不敢删的 if 里。","action":"改旧逻辑前先写 characterization test。","tags":["legacy-code","maintenance","testing"],"source_hint":"Ars Technica legacy/AI technical debt 讨论","evidence_level":"medium"}
{"text":"一个小需求如果没有边界，就会长成一个没人承认的项目。","action":"新增功能先问替代掉什么，而不是直接加进去。","tags":["freelance","scope-creep","product"],"source_hint":"r/webdev scope creep 经验帖","evidence_level":"high"}
{"text":"PR 里最贵的字不是 diff，是 reviewer 脑内重建的上下文。","action":"在 PR 开头写三行：为什么、怎么验证、哪里最危险。","tags":["code-review","context","team"],"source_hint":"r/ExperiencedDevs code review 讨论","evidence_level":"high"}
{"text":"独立开发最容易误判的信号，是同行点赞像用户需求。","action":"把反馈按真实用户、潜在买家、同行围观三类记录。","tags":["indie-dev","feedback","weak-ties"],"source_hint":"Indie Hackers/build in public 讨论","evidence_level":"high"}
{"text":"AI 生成的代码跑通一次，不代表它理解第二次会发生什么。","action":"为生成代码补失败路径和边界测试。","tags":["ai-assisted","testing","quality"],"source_hint":"r/ExperiencedDevs / The Register AI code 讨论","evidence_level":"high"}
{"text":"开源项目出名以后，下载量是荣誉，issue 数是账单。","action":"提前写贡献规则，不要等爆红后再补防线。","tags":["open-source","maintainer","governance"],"source_hint":"r/opensource solo maintainer 讨论","evidence_level":"high"}
{"text":"junior 问怎么做，senior 问为什么现在必须这样做。","action":"把方案和业务时机一起评审。","tags":["career-stage","senior","product-thinking"],"source_hint":"r/ExperiencedDevs senior determination 讨论","evidence_level":"medium"}
{"text":"技术债最会伪装成速度，因为它总是在今天帮你省时间。","action":"把省下的时间和未来偿还成本一起估算。","tags":["technical-debt","delivery"],"source_hint":"Reddit/HN 技术债讨论归纳","evidence_level":"high"}
{"text":"review 不是给别人判分，是让团队共享一次系统理解。","action":"用问题解释风险，不用谜语逼对方猜答案。","tags":["code-review","learning","team"],"source_hint":"r/ExperiencedDevs teach in code reviews 讨论","evidence_level":"high"}
{"text":"弱连接的好处是能看见盲点，坏处是它不负责帮你收尾。","action":"把外部建议转成可验证假设，不直接转成 roadmap。","tags":["weak-ties","indie-dev","feedback"],"source_hint":"build in public feedback 讨论","evidence_level":"high"}
{"text":"用 AI 写得越快，越要慢下来确认自己仍然是 owner。","action":"对每段关键生成代码写一句自己的解释。","tags":["ai-assisted","ownership","career-stage"],"source_hint":"r/ExperiencedDevs AI reliance 讨论","evidence_level":"high"}
{"text":"客户说小改动时，通常省略了小到谁来付钱。","action":"先确认影响范围，再承诺交付时间。","tags":["freelance","client-work","scope-creep"],"source_hint":"r/webdev small changes loop 讨论","evidence_level":"high"}
{"text":"维护者疲劳不是不喜欢社区，是社区把免费支持当成默认 SLA。","action":"公开响应边界和支持渠道。","tags":["open-source","burnout","boundaries"],"source_hint":"r/opensource maintainer burnout 讨论","evidence_level":"high"}
{"text":"职业早期追求多写代码，职业中后期开始追求少制造必须读的代码。","action":"删除一个不必要的抽象，比新增一个 helper 更有价值。","tags":["career-stage","simplicity","technical-debt"],"source_hint":"ExperiencedDevs 过度泛化与 review 讨论","evidence_level":"medium"}
{"text":"AI 不是实习生，它不会因为被 review 而成长；成长的是使用它的人。","action":"把 AI 输出当草稿，不当能力证明。","tags":["ai-assisted","learning","review"],"source_hint":"r/ExperiencedDevs AI engineer evaluation 讨论","evidence_level":"high"}
{"text":"PR 评论如果需要开会才能懂，可能该先补设计图而不是继续留言。","action":"复杂结构改动用图或短设计说明同步。","tags":["code-review","architecture","communication"],"source_hint":"r/ExperiencedDevs PR comments unclear 讨论","evidence_level":"high"}
{"text":"独立开发的中段最危险：新鲜感没了，用户还没来。","action":"给项目设一个小而可见的第一个使用场景。","tags":["indie-dev","motivation","product"],"source_hint":"Indie Hackers failure/build in public 讨论","evidence_level":"medium"}
{"text":"资深工程师的产出有时是一行没写，因为他阻止了一条坏路。","action":"把被否决方案和原因记下来，避免下周重演。","tags":["senior","architecture","decision-log"],"source_hint":"r/ExperiencedDevs staff/decision power 讨论","evidence_level":"medium"}
{"text":"所谓技术债爆炸，往往是每个人都只借了一点点。","action":"把债务按模块聚合看，不只按单个 ticket 看。","tags":["technical-debt","team","planning"],"source_hint":"Reddit company crumbling tech debt 讨论","evidence_level":"high"}
{"text":"自由职业不是没有老板，而是每个客户都可能临时客串老板。","action":"用合同、节奏会和变更单把关系拉回合作。","tags":["freelance","boundaries","client-work"],"source_hint":"HN freelance consultant mistakes 讨论","evidence_level":"high"}
{"text":"开源贡献的门槛降低后，维护者的验证门槛必须升高。","action":"要求复现、测试和人工确认说明。","tags":["open-source","ai-assisted","review"],"source_hint":"CNCF/The New Stack AI PR 讨论","evidence_level":"high"}
{"text":"代码能合并，不等于团队能维护。","action":"review 通过前检查是否符合已有模式。","tags":["code-review","maintainability","team-norms"],"source_hint":"r/ExperiencedDevs code review 讨论","evidence_level":"high"}
{"text":"AI 让 junior 更快交作业，也让 senior 更像阅卷机器。","action":"限制 PR 大小，把低级检查交给自动化。","tags":["ai-assisted","senior","review-load"],"source_hint":"CIO/The New Stack senior bottleneck 讨论","evidence_level":"medium"}
{"text":"弱连接反馈最有价值的地方，是它不受你团队内部共识污染。","action":"每周找一个陌生使用者验证一个关键假设。","tags":["weak-ties","feedback","indie-dev"],"source_hint":"build in public/Indie Hackers 讨论","evidence_level":"high"}
{"text":"如果每个小修都绕过设计，最后系统会变成历史聊天记录的形状。","action":"对临时修复标注设计偏离点。","tags":["technical-debt","architecture","maintenance"],"source_hint":"r/webdev technical debt management 讨论","evidence_level":"medium"}
{"text":"review 里的 nit 太多，会稀释真正的危险信号。","action":"把风格问题自动化，人工只挡风险。","tags":["code-review","automation","team"],"source_hint":"r/ExperiencedDevs PR nightmare 讨论","evidence_level":"high"}
{"text":"开源维护最怕的不是没人来，而是来的人只带来更多未完成。","action":"把 first issue 设计成可独立关闭的小任务。","tags":["open-source","maintainer","contribution"],"source_hint":"r/opensource PR/issues overload 讨论","evidence_level":"high"}
{"text":"独立产品的第一个敌人不是竞品，是自己不断加的下一版。","action":"冻结 MVP 边界，新增想法进 parking lot。","tags":["indie-dev","scope","shipping"],"source_hint":"HN feature creep side projects 讨论","evidence_level":"high"}
{"text":"职业阶段变化最明显的信号，是你开始为没写的代码负责。","action":"把技术决策也当交付物维护。","tags":["career-stage","senior","architecture"],"source_hint":"r/ExperiencedDevs senior/lead 讨论","evidence_level":"medium"}
{"text":"AI 写出的漂亮分层，可能只是把错误拆成了更多文件。","action":"检查抽象是否对应真实变化点。","tags":["ai-assisted","architecture","technical-debt"],"source_hint":"Reddit AI slop/technical debt 讨论","evidence_level":"high"}
{"text":"自由职业的维护期如果没报价，后续每个小 bug 都像人情债。","action":"项目交付时同时给维护包选项。","tags":["freelance","maintenance","pricing"],"source_hint":"HN consultants maintenance 讨论","evidence_level":"high"}
{"text":"代码 review 最好的语气，是让对方愿意下一次更早找你。","action":"评论里同时写风险和可接受替代方案。","tags":["code-review","mentoring","communication"],"source_hint":"r/ExperiencedDevs teach and humble reviews 讨论","evidence_level":"high"}
{"text":"维护者拒绝 AI PR 时，拒绝的通常不是 AI，而是没人承担责任。","action":"贡献说明中要求提交者声明已理解并验证。","tags":["open-source","ai-assisted","accountability"],"source_hint":"GitHub/CNCF/InfoQ AI PR 讨论","evidence_level":"high"}
{"text":"技术债的利息会优先从新人学习速度里扣。","action":"把最绕的模块整理成 onboarding note。","tags":["technical-debt","onboarding","team"],"source_hint":"r/ExperiencedDevs shared repo review 讨论","evidence_level":"medium"}
{"text":"build in public 的点赞能续命，但不能替你找到愿意付费的人。","action":"每条公开进展后追一个真实用户访谈。","tags":["indie-dev","feedback","go-to-market"],"source_hint":"r/buildinpublic 讨论","evidence_level":"high"}
{"text":"资深工程师如果只做协调，会担心手感生锈；如果只写代码，又会被说影响力不够。","action":"给自己保留一个可动手的高杠杆技术问题。","tags":["career-stage","senior","identity"],"source_hint":"r/ExperiencedDevs career plateau 讨论","evidence_level":"high"}
{"text":"AI 代码的危险不在它胡说，而在它胡说得很像项目风格。","action":"对生成代码做跨模块一致性检查。","tags":["ai-assisted","quality","review"],"source_hint":"Ars/Reddit AI technical debt 讨论","evidence_level":"high"}
{"text":"客户反馈散在十几个渠道时，开发时间会被切成碎片。","action":"把反馈收敛到一个共享板，批量处理。","tags":["freelance","client-work","feedback"],"source_hint":"r/webdev client time waste 讨论","evidence_level":"high"}
{"text":"开源项目里的好 issue，应该让陌生人也能安全进入上下文。","action":"模板要求版本、复现步骤、期望行为和最小样例。","tags":["open-source","issue-triage","maintainer"],"source_hint":"r/opensource + GitHub maintainer 讨论","evidence_level":"high"}
{"text":"职业成长不是从不会到会，而是从能做完到能解释代价。","action":"估算时单列维护成本和沟通成本。","tags":["career-stage","planning","senior"],"source_hint":"HN freelance/user communication 讨论","evidence_level":"medium"}
{"text":"一个团队越依赖英雄 review，越说明自动化和约定欠账。","action":"把重复 review 意见转成 lint、测试或文档。","tags":["code-review","automation","technical-debt"],"source_hint":"r/ExperiencedDevs only senior in team 讨论","evidence_level":"high"}
{"text":"独立开发的孤独会把任何反馈都放大，包括无关紧要的建议。","action":"先标注反馈来源身份，再决定权重。","tags":["indie-dev","weak-ties","mental-load"],"source_hint":"r/indiehackers private/build public 讨论","evidence_level":"medium"}
{"text":"AI 辅助开发的关键不是少写，而是少把不理解的东西交给未来。","action":"不理解的生成逻辑禁止进入核心路径。","tags":["ai-assisted","understanding","technical-debt"],"source_hint":"r/ExperiencedDevs AI evaluation 讨论","evidence_level":"high"}
{"text":"PR 变成千轮往返时，通常该从代码退回到设计共识。","action":"暂停 review，先对齐接口、边界和验收标准。","tags":["code-review","architecture","communication"],"source_hint":"r/ExperiencedDevs PR nightmare 讨论","evidence_level":"high"}
{"text":"技术债不是道德失败，是没有预算的现实选择。","action":"把债务分为可接受、需监控、必须偿还三档。","tags":["technical-debt","prioritization"],"source_hint":"DEV indie technical debt 讨论","evidence_level":"medium"}
{"text":"维护者最需要的贡献，有时不是代码，而是复现、文档和替别人关掉噪音。","action":"给非代码贡献也设置明确入口。","tags":["open-source","community","maintenance"],"source_hint":"HN open source help 讨论","evidence_level":"medium"}
{"text":"自由职业里，能说清不做什么，和能做什么一样值钱。","action":"报价单显式列出不包含项。","tags":["freelance","boundaries","pricing"],"source_hint":"HN consultant mistakes / r/webdev scope 讨论","evidence_level":"high"}
{"text":"初级工程师看 ticket，中级看模块，资深看组织会不会反复踩同一个坑。","action":"把事故和返工归因到流程，不只归因到个人。","tags":["career-stage","senior","process"],"source_hint":"r/ExperiencedDevs senior/quality 讨论","evidence_level":"medium"}
{"text":"AI 生成的测试如果只证明它自己的假设，就不算安全网。","action":"由人补业务反例和历史 bug 回归用例。","tags":["ai-assisted","testing","quality"],"source_hint":"DEV AI testing/code quality 讨论","evidence_level":"medium"}
{"text":"公开构建能带来同行支持，也会制造进度表演压力。","action":"分享学到的东西，少分享虚荣里程碑。","tags":["build-in-public","indie-dev","mental-load"],"source_hint":"r/buildinpublic 讨论","evidence_level":"high"}
{"text":"review 里最该问的是这段代码会让谁以后更难工作。","action":"把可维护性问题绑定到具体未来场景。","tags":["code-review","maintainability","technical-debt"],"source_hint":"r/ExperiencedDevs code smell/review 讨论","evidence_level":"high"}
{"text":"技术债真正爆雷前，通常已经在 QA、onboarding 和估时里泄露了很久。","action":"把返工、延期和新人卡点纳入债务信号。","tags":["technical-debt","quality","metrics"],"source_hint":"r/webdev technical debt management 讨论","evidence_level":"medium"}
{"text":"AI 让个人速度变快，但团队吞吐可能被 review 队列吃掉。","action":"用小 PR 和自动验证限制 review 批量。","tags":["ai-assisted","review-load","team"],"source_hint":"CIO/The New Stack review bottleneck 讨论","evidence_level":"medium"}
{"text":"开源维护者的善意不是无限资源，礼貌也需要制度保护。","action":"为低质量 issue 设置自动关闭规则。","tags":["open-source","maintainer","boundaries"],"source_hint":"GitHub Community / r/opensource 讨论","evidence_level":"high"}
{"text":"自由职业的沟通不是开发之外的杂事，而是项目的一半工作量。","action":"估算时单独预留沟通和变更缓冲。","tags":["freelance","communication","planning"],"source_hint":"HN user engagement vs development 讨论","evidence_level":"high"}
{"text":"职业瓶颈有时不是技术不够，而是影响力开始用会议计量。","action":"把协调工作转成明确技术结果。","tags":["career-stage","senior","coordination"],"source_hint":"r/ExperiencedDevs career plateau 讨论","evidence_level":"high"}
{"text":"弱连接反馈像陌生日志：噪音多，但关键一条能救命。","action":"保留反馈原文，只提取可验证模式。","tags":["weak-ties","feedback","indie-dev"],"source_hint":"HN/Indie Hackers feedback 讨论","evidence_level":"medium"}
{"text":"当团队说以后用 AI 还债时，可能只是又借了一笔更难审的债。","action":"先建立可验证债务清单，再谈自动化修复。","tags":["ai-assisted","technical-debt","planning"],"source_hint":"Reddit AI technical debt 讨论","evidence_level":"high"}
{"text":"代码 review 的权力感越强，学习效果越弱。","action":"用提问打开讨论，用阻塞保护边界。","tags":["code-review","mentoring","team-culture"],"source_hint":"r/ExperiencedDevs teach reviews 讨论","evidence_level":"high"}
{"text":"开源的成功会把个人项目变成公共基础设施，但不自动带来公共预算。","action":"在 README 写清维护状态和赞助/支持方式。","tags":["open-source","maintainer","sustainability"],"source_hint":"GitHub Maintainer Month / r/opensource 讨论","evidence_level":"high"}
{"text":"独立开发时，没人催你也没人拦你，所以范围会悄悄膨胀。","action":"给自己设 release cut，而不是永远等完整。","tags":["indie-dev","scope","shipping"],"source_hint":"HN side project feature creep 讨论","evidence_level":"high"}
{"text":"资深工程师的手感不是每天写多少行，而是能不能迅速判断哪行危险。","action":"定期读事故 diff，训练风险嗅觉。","tags":["senior","quality","career-stage"],"source_hint":"r/ExperiencedDevs sloppy senior/quality 讨论","evidence_level":"medium"}
{"text":"AI 提高了提交速度，也提高了低质量贡献抵达维护者面前的速度。","action":"对外部贡献设置 CI、模板和人工责任声明三道门。","tags":["open-source","ai-assisted","governance"],"source_hint":"CNCF/The Register/GitHub 讨论","evidence_level":"high"}
{"text":"客户眼里的小改动，可能穿过缓存、权限、布局和上线流程。","action":"回复前先列影响面，不直接答应。","tags":["freelance","client-work","scope-creep"],"source_hint":"r/webdev client small changes 讨论","evidence_level":"high"}
{"text":"技术债不是看代码丑不丑，而是看它让正确修改变得多贵。","action":"用修改成本而不是审美描述债务。","tags":["technical-debt","maintainability","communication"],"source_hint":"r/ExperiencedDevs articulating bad code 讨论","evidence_level":"high"}
{"text":"公开构建面向错人群时，只会得到很热闹的无效掌声。","action":"把内容写给 ICP 的问题，不只写给 builder 的情绪。","tags":["build-in-public","go-to-market","feedback"],"source_hint":"r/buildinpublic target audience 讨论","evidence_level":"high"}
{"text":"如果 reviewer 总是猜谜，作者会学会只修表面。","action":"评论直接给原则、例子和验收条件。","tags":["code-review","communication","team"],"source_hint":"r/ExperiencedDevs PR nightmare 讨论","evidence_level":"high"}
{"text":"中级到资深的跃迁，是从完成需求变成保护系统不被需求撕裂。","action":"需求评审时主动指出系统边界。","tags":["career-stage","senior","architecture"],"source_hint":"r/ExperiencedDevs senior/staff 讨论","evidence_level":"medium"}
{"text":"AI 不会替你承担 pager，它只会把代码交给会被叫醒的人。","action":"核心路径生成代码必须由值班 owner 认可。","tags":["ai-assisted","ownership","operations"],"source_hint":"Ars/Reddit AI production concerns 讨论","evidence_level":"medium"}
{"text":"维护者最怕的 PR 是作者比机器人还不愿意解释。","action":"要求每个外部 PR 附验证记录和设计理由。","tags":["open-source","code-review","accountability"],"source_hint":"CNCF AI PR validation 讨论","evidence_level":"high"}
{"text":"自由职业的报价太低，最后会用夜晚、周末和技术债补差价。","action":"报价里包含风险缓冲和验收轮次。","tags":["freelance","pricing","burnout"],"source_hint":"HN freelance mistakes / r/webdev struggles 讨论","evidence_level":"high"}
{"text":"弱连接反馈不是投票系统，它更像早期雷达。","action":"看反馈是否重复出现，而不是看单条声音多大。","tags":["weak-ties","feedback","product"],"source_hint":"Indie Hackers/HN feedback 讨论","evidence_level":"medium"}
{"text":"技术债管理失败时，团队会把架构讨论降级成谁今天能救火。","action":"每次救火后补一个结构性修复 ticket。","tags":["technical-debt","incidents","team"],"source_hint":"Reddit technical debt company crisis 讨论","evidence_level":"high"}
{"text":"AI 代码越像人写的，越需要人类责任链。","action":"在 PR 中标注 AI 参与范围和人工检查点。","tags":["ai-assisted","code-review","accountability"],"source_hint":"GitHub/CNCF AI contribution policy 讨论","evidence_level":"medium"}
{"text":"职业后期的疲惫，常来自不断解释同一类 trade-off。","action":"把重复解释沉淀成 team playbook。","tags":["senior","team-communication","knowledge-base"],"source_hint":"r/ExperiencedDevs review/lead 讨论","evidence_level":"medium"}
{"text":"开源不是把代码扔出去，而是把未来的问题也邀请进来。","action":"发布前准备最小维护流程。","tags":["open-source","maintenance","sustainability"],"source_hint":"DEV open source maintainer role 讨论","evidence_level":"medium"}
{"text":"独立开发者最容易把忙碌误认为验证。","action":"用真实用户行为替代构建时长作为进度指标。","tags":["indie-dev","validation","feedback"],"source_hint":"Indie Hackers failure discussions","evidence_level":"medium"}
{"text":"review 评论被忽略时，可能不是对方不尊重，而是上下文没有送达。","action":"先确认问题被理解，再要求修改。","tags":["code-review","communication","mentoring"],"source_hint":"r/ExperiencedDevs comments ignored 讨论","evidence_level":"high"}
{"text":"技术债不是一次大爆炸，而是无数个没人想开会的小妥协。","action":"让小妥协可见，至少在债务日志里出现。","tags":["technical-debt","team","visibility"],"source_hint":"Reddit/HN tech debt 讨论归纳","evidence_level":"high"}
{"text":"AI 辅助后，资深的价值更像验钞机：识别看起来很真的假币。","action":"review 优先找隐藏假设和集成风险。","tags":["ai-assisted","senior","review"],"source_hint":"r/ExperiencedDevs AI PR harder to review 讨论","evidence_level":"high"}
{"text":"客户维护需求如果没有 retainer，就会在你最忙时变成新项目。","action":"把维护响应时间和可用性写进合同。","tags":["freelance","maintenance","contract"],"source_hint":"HN software consultants maintenance 讨论","evidence_level":"high"}
{"text":"公开构建最真实的价值，是让别人看见你如何学习，而不只是看见你发布。","action":"分享失败假设和下一步实验。","tags":["build-in-public","learning","indie-dev"],"source_hint":"r/buildinpublic document what you learn 讨论","evidence_level":"high"}
{"text":"开源维护者拒绝无复现报告，不是冷漠，是保护有限注意力。","action":"不给复现路径的报告先标记 needs-repro。","tags":["open-source","issue-triage","burnout"],"source_hint":"curl/ITPro AI slop reports 讨论","evidence_level":"high"}
{"text":"从 junior 到 senior，最大的变化是开始为别人看不见的风险焦虑。","action":"把隐形风险翻译成业务后果。","tags":["career-stage","senior","risk"],"source_hint":"r/ExperiencedDevs senior responsibility 讨论","evidence_level":"medium"}
{"text":"如果 AI 帮你跳过了理解，它也帮你跳过了成长。","action":"用 AI 后做一次无工具复述。","tags":["ai-assisted","learning","career-stage"],"source_hint":"r/ExperiencedDevs AI overreliance 讨论","evidence_level":"high"}
{"text":"技术债偿还最难卖，因为它的收益通常是未来少出事。","action":"把债务和历史事故、延期、返工关联起来。","tags":["technical-debt","stakeholder","communication"],"source_hint":"r/webdev communicating technical debt 讨论","evidence_level":"medium"}
{"text":"review 里的好问题，会让作者下次提交前自己先问一遍。","action":"把标准写成可复用 checklist。","tags":["code-review","mentoring","process"],"source_hint":"r/ExperiencedDevs review learning 讨论","evidence_level":"high"}
{"text":"自由职业者的边界不是强硬，而是让变更有路径。","action":"把临时需求导向变更单而不是口头争论。","tags":["freelance","scope-creep","communication"],"source_hint":"r/webdev change request log 讨论","evidence_level":"high"}
{"text":"独立开发的弱连接网络，能给你方向感，但给不了产品纪律。","action":"每次采纳外部建议前写成功指标。","tags":["indie-dev","weak-ties","product"],"source_hint":"Indie Hackers/build in public 讨论","evidence_level":"medium"}
{"text":"AI 生成 PR 的低成本，会把 review 变成系统瓶颈。","action":"设置 PR 大小上限和自动预检。","tags":["ai-assisted","code-review","process"],"source_hint":"The New Stack/CIO review bottleneck 讨论","evidence_level":"medium"}
{"text":"开源项目需要的不只是更多贡献者，还需要更少低上下文打扰。","action":"把贡献指南写成过滤器，而不是欢迎辞。","tags":["open-source","maintainer","governance"],"source_hint":"r/opensource AI-generated PR 讨论","evidence_level":"high"}
{"text":"职业阶段越往后，越要学会把复杂问题说得不吓人。","action":"用具体用户影响解释技术选择。","tags":["career-stage","senior","communication"],"source_hint":"HN nontechnical founders/software dev 讨论","evidence_level":"medium"}
{"text":"技术债如果只在工程师心里存在，排期时就等于不存在。","action":"把债务写成可估算、可验收的工作项。","tags":["technical-debt","planning","visibility"],"source_hint":"arXiv SATD issue tracker + Reddit 讨论","evidence_level":"medium"}
{"text":"AI 可以让 demo 更快出现，也会让 demo 更像产品，直到上线前露馅。","action":"把 demo 代码和产品代码分仓或明确标记。","tags":["ai-assisted","indie-dev","quality"],"source_hint":"r/indiehackers vibecoder/demo 讨论","evidence_level":"medium"}
{"text":"客户说先上线再优化时，最好问清谁为优化前的问题买单。","action":"把上线后的已知风险写进验收记录。","tags":["freelance","technical-debt","client-work"],"source_hint":"r/webdev rushed launch/scope 讨论","evidence_level":"high"}
{"text":"维护者需要的不是更多热情，而是更高质量的上下文。","action":"把好 issue 示例放进贡献文档。","tags":["open-source","maintainer","documentation"],"source_hint":"GitHub Maintainer Month / r/opensource 讨论","evidence_level":"high"}
{"text":"review 里争变量名争到半夜，通常是团队缺少共同风格工具。","action":"把可机械判断的偏好交给 formatter。","tags":["code-review","automation","team-culture"],"source_hint":"r/ExperiencedDevs nitpick review 讨论","evidence_level":"high"}
{"text":"独立开发者如果只听同行，容易做出给开发者看的开发者工具。","action":"每月安排一次非开发者视角测试。","tags":["indie-dev","feedback","market"],"source_hint":"r/indiehackers bad products 讨论","evidence_level":"medium"}
{"text":"AI 时代的 senior 更像编辑：不是逐字重写，而是保证整体意图不跑偏。","action":"review 时先看叙事线，再看实现细节。","tags":["ai-assisted","senior","code-review"],"source_hint":"DEV intent debt / Reddit AI review 讨论","evidence_level":"high"}
{"text":"技术债会把团队文化变成小心翼翼：能不碰就不碰。","action":"挑一个高频痛点做小步安全重构。","tags":["technical-debt","team-culture","refactor"],"source_hint":"legacy/technical debt discussions","evidence_level":"medium"}
{"text":"自由职业中最贵的误会，是双方都以为对方懂了。","action":"每次关键沟通后发一段书面确认。","tags":["freelance","communication","client-work"],"source_hint":"HN freelance mistakes 讨论","evidence_level":"high"}
{"text":"开源维护者的信任是慢慢攒的，AI 生成的陌生 PR 没法跳过这一步。","action":"新贡献者先从小修、复现和文档开始。","tags":["open-source","trust","contribution"],"source_hint":"r/opensource/GitHub AI PR 讨论","evidence_level":"high"}
{"text":"职业焦虑有时来自比较对象太会展示，没人展示他们没合并的 PR。","action":"用自己的长期技能栈和项目影响衡量成长。","tags":["career-stage","mental-load","comparison"],"source_hint":"r/ExperiencedDevs overachievers 讨论","evidence_level":"medium"}
{"text":"AI 让写代码更像指挥，但指挥也要懂乐谱。","action":"先写计划和验收，再让工具生成。","tags":["ai-assisted","planning","quality"],"source_hint":"r/webdev AI-assisted maintenance burden 讨论","evidence_level":"high"}
{"text":"弱连接反馈越多，越需要一个不会被情绪带跑的筛选表。","action":"按频率、用户类型、付费可能性给反馈打标签。","tags":["weak-ties","feedback","indie-dev"],"source_hint":"build in public feedback 讨论","evidence_level":"high"}
{"text":"技术债的坏处不只是慢，还会让好工程师不想再碰。","action":"优先偿还影响士气和关键交付的债。","tags":["technical-debt","morale","team"],"source_hint":"r/ExperiencedDevs/company tech debt 讨论","evidence_level":"medium"}
{"text":"review 文化成熟的团队，会允许建议存在但不绑架合并。","action":"非阻塞意见默认不挡合并。","tags":["code-review","team-culture","process"],"source_hint":"r/ExperiencedDevs blocking vs non-blocking 讨论","evidence_level":"high"}
{"text":"独立开发不是一个人做所有事，而是一个人决定哪些事暂时不做。","action":"给项目列一个明确的 not-now 清单。","tags":["indie-dev","prioritization","scope"],"source_hint":"HN feature creep / Indie Hackers 讨论","evidence_level":"medium"}
