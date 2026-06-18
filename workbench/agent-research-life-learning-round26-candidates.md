# agent-research-life-learning-round26 候选弹窗

## 调研来源清单与覆盖主题

- V2EX《连续远程工作十一个月，心理已接近崩溃》：远程孤独、线下社交、共享办公、面对面交流。
- V2EX《关于裁员失业、远程居家办公、带娃、AI 编程、WLB》：裁员后远程、家庭照护、降薪落差、遗留项目。
- V2EX《聊聊远程办公的工作效率》：远程自律、家庭干扰、沟通效率、工作量评估。
- V2EX《IT 从业者如何多运动，摆脱亚健康状态》：久坐、运动入门、亚健康。
- V2EX《2023，程序员佛系减肥在路上》：骑行通勤、爬楼、饮食、血压与睡眠。
- V2EX《猿们，你们怎么安排时间？》：通勤学习、碎片时间、做饭、健身、宠物与休息。
- V2EX《新社畜感觉每天下班都好累，什么都干不动》：初入职场、下班疲惫、爱好恢复。
- V2EX《[树洞贴] 季节更替，最近丧的很》：情绪低落、家庭正常但无力感、季节性恢复。
- V2EX《30 岁到底为什么会成为程序员的职业困境？》：年龄焦虑、家庭压力、学习动力。
- V2EX《面临人生的重大抉择，征求一些外部意见》：小城市选择、健康家庭金钱优先级。
- V2EX《对下一份工作没有任何指望，感觉程序员之路走到尽头了》：现金流焦虑、职业不安全感。
- Reddit r/cscareerquestions《9-5 is killing my soul》：工作占据生活、WFH 孤独、恢复时间不足。
- Reddit r/cscareerquestions《The Lack of Social Interaction in this Career is Killing Me》：远程社交缺失、异步等待、需求沟通。
- Reddit r/cscareerquestions《As a SWE, how to stop thinking about your project or task 24/7?》：下班边界、工位隔离、脑内任务停不下。
- Reddit r/cscareerquestions《Work-life balance VS increase of salary》：高薪与过劳取舍、稳定低压岗位。
- Hacker News《Ask HN: How are you getting through and back from burning out?》：倦怠恢复、家庭朋友、爱好运动、自我照护。
- Hacker News《Ask HN: How do you keep your programming motivation up?》：动机与睡眠、饮食、运动、现实目标。
- Hacker News《Programming is mentally overwhelming to me now. What to do?》：家庭边界、少说 yes、管理任务负荷。
- DEV Community《Dark Side of Remote Work》：远程预期落差、独自在家、咖啡馆/图书馆限制、同事连接。
- DEV Community《Full-time, side projects, learning, and staying sane》：减少通勤、每天少量学习、聚焦 1-2 件事、休息与运动。
- DEV Community《How do you handle unproductive days at work?》：低产日、小任务启动、小胜利。
- DEV Community《Developer with New Baby Coming Soon》：新生儿、睡眠不足、远程工作与育儿边界。
- Stack Overflow Blog《New data: Do developers care about wellness?》《What developers with ADHD want you to know》：开发者健康、压力管理、注意力差异、沟通支持。

## JSONL 候选

{"text":"你盯着屏幕八小时，真正累的可能不是眼睛，而是一天没人认真和你说过话。","action":"约一次线下吃饭或散步，把社交当作恢复任务。","tags":["life","remote","social","mood"],"source_hint":"V2EX t/747977; Reddit lack of social interaction","evidence_level":"high"}
{"text":"远程办公最隐形的 bug：工位在家里，家也慢慢变成了办公室。","action":"收工后关电脑、离开书桌，给家恢复成家的权限。","tags":["remote","family","boundary"],"source_hint":"DEV dark side of remote work; V2EX t/772412","evidence_level":"high"}
{"text":"需求没讲清时，视频会议开一小时，不如白板上画三分钟。","action":"把下一次远程沟通改成图、流程或共享文档。","tags":["remote","communication","learning"],"source_hint":"V2EX t/772412","evidence_level":"high"}
{"text":"你不是自律差，你可能只是把休息、家务、育儿和开发都塞进了同一个房间。","action":"给今天划出一块只属于工作的空间或时段。","tags":["remote","family","focus"],"source_hint":"V2EX t/1111383; V2EX t/772412","evidence_level":"high"}
{"text":"下班后还在脑内跑项目，说明任务没有退出，只是 IDE 关了。","action":"写下明早第一步，再允许大脑下线。","tags":["mood","boundary","work"],"source_hint":"Reddit stop thinking about project 24/7; HN mentally overwhelming","evidence_level":"high"}
{"text":"加薪 50% 但买走夜晚和周末，报价单里少写了你的恢复成本。","action":"比较 offer 时把睡眠、家人和运动时间也折成成本。","tags":["career","money","wlb"],"source_hint":"Reddit work-life balance vs salary; V2EX t/1036970","evidence_level":"high"}
{"text":"稳定低压不是躺平免死金牌，技术停更也会在某天弹出兼容性警告。","action":"每周留一小时维护可迁移技能。","tags":["learning","career","risk"],"source_hint":"Reddit stable job stay put; V2EX age career discussions","evidence_level":"medium"}
{"text":"一天只学半小时看起来很少，但比周末幻想学八小时更像真实人生。","action":"今天只做 30 分钟学习，不欠明天的债。","tags":["learning","habit","life"],"source_hint":"DEV staying sane; V2EX t/519626","evidence_level":"high"}
{"text":"低产日不一定要硬刚史诗任务，先修一个错别字也算重新启动。","action":"选一个 5 分钟小任务，拿回控制感。","tags":["mood","productivity","work"],"source_hint":"DEV unproductive days comments","evidence_level":"medium"}
{"text":"程序员的通勤如果只剩刷手机，就是每天把两段生命交给算法推荐。","action":"给通勤放一个播客、单词卡或纯放空模式。","tags":["commute","learning","life"],"source_hint":"V2EX t/519626; DEV staying sane","evidence_level":"medium"}
{"text":"能骑车上班的人，可能是在用通勤偷偷修复血压和心情。","action":"如果距离允许，试一次步行、骑行或提前一站下车。","tags":["commute","health","exercise"],"source_hint":"V2EX t/1003992; DEV staying sane","evidence_level":"medium"}
{"text":"久坐不是慢性配置项，它会在某天以腰、颈、血压的形式报错。","action":"站起来走 3 分钟，别等身体提工单。","tags":["health","exercise","work"],"source_hint":"V2EX t/485183; Stack Overflow wellness","evidence_level":"high"}
{"text":"你以为自己缺动力，社区老哥说可能先缺睡眠、饭和运动。","action":"先修基础状态，再判断是不是职业热情消失。","tags":["health","mood","motivation"],"source_hint":"HN programming motivation; Stack Overflow wellness","evidence_level":"high"}
{"text":"远程不是天然自由，它只是把管理者、同事和家人的边界题都发给了你。","action":"把可打扰时间写清楚，而不是靠大家猜。","tags":["remote","boundary","communication"],"source_hint":"V2EX t/772412; DEV remote work","evidence_level":"high"}
{"text":"带娃远程最难的不是代码，是每个人都觉得你‘反正在家’。","action":"和家人约定工作中断规则，减少临时召唤。","tags":["family","remote","parenting"],"source_hint":"V2EX t/1111383; DEV new baby","evidence_level":"high"}
{"text":"新手下班瘫住，不代表废了，可能只是第一次真正体验持续输出。","action":"别急着加码学习，先建立一个下班恢复仪式。","tags":["life","mood","newgrad"],"source_hint":"V2EX t/995322; Reddit 9-5 killing soul","evidence_level":"medium"}
{"text":"如果一天只剩工作、想工作、从工作里恢复，生活线程已经饿死。","action":"今晚安排一件不产生绩效的事。","tags":["life","burnout","mood"],"source_hint":"Reddit 9-5 killing soul; HN burnout recovery","evidence_level":"high"}
{"text":"面对面交流不是旧时代残留，它是远程人类的补丁包。","action":"本周找一次线下协作、同城工位或共同午饭。","tags":["remote","social","mood"],"source_hint":"V2EX t/747977; DEV remote loneliness","evidence_level":"high"}
{"text":"你不是不喜欢编程，你可能只是太久没写过让自己有成就感的东西。","action":"给自己留一个小而可完成的个人项目切片。","tags":["learning","mood","sideproject"],"source_hint":"DEV staying sane; HN burnout recovery","evidence_level":"medium"}
{"text":"每晚补课到凌晨，短期像努力，长期像把明天的 CPU 超频烧掉。","action":"把学习排到精神较好的时段，睡眠不再垫底。","tags":["learning","health","sleep"],"source_hint":"HN motivation; V2EX t/519626","evidence_level":"high"}
{"text":"远程会议里沉默太久，需求就会在 Jira 里长出第二种解释。","action":"不确定就追问例子、边界和验收标准。","tags":["remote","communication","work"],"source_hint":"Reddit lack of social interaction; V2EX t/772412","evidence_level":"medium"}
{"text":"家庭压力会让人更不敢准点下班，这不是懒，是风险感在推着走。","action":"把真实现金流和风险写下来，别让焦虑代替计算。","tags":["family","money","career"],"source_hint":"V2EX t/961747; V2EX t/1127690","evidence_level":"medium"}
{"text":"小城市没有完美选项时，健康、家庭、现金流往往比‘酷技术’更硬。","action":"先列不可牺牲项，再谈职业选择。","tags":["career","family","health","money"],"source_hint":"V2EX t/1036970","evidence_level":"medium"}
{"text":"裁员后的远程工作能保住收入，也可能偷偷带来身份落差。","action":"把‘降薪’和‘照顾家庭’分开评估，别混成自责。","tags":["career","remote","family","mood"],"source_hint":"V2EX t/1111383","evidence_level":"medium"}
{"text":"旧系统难啃不是你菜，十年历史和自造架构本来就会排斥新人。","action":"给遗留项目画一张最小地图，先活下来再优化。","tags":["learning","work","legacy"],"source_hint":"V2EX t/1111383","evidence_level":"medium"}
{"text":"如果咖啡馆椅子和 Wi-Fi 都不靠谱，远程自由也会变成流浪办公。","action":"为远程准备一个稳定备用工位。","tags":["remote","workspace","life"],"source_hint":"DEV dark side of remote work","evidence_level":"medium"}
{"text":"孤独的远程人最怕把 Slack 消息误认成社交。","action":"今天找一个能听到笑声的真实场景。","tags":["remote","social","mood"],"source_hint":"DEV remote loneliness; V2EX t/747977","evidence_level":"high"}
{"text":"学太多方向会像开太多浏览器标签，最后每个都只剩焦虑。","action":"这个月只保留 1-2 个学习主题。","tags":["learning","focus","mood"],"source_hint":"DEV staying sane","evidence_level":"high"}
{"text":"你不是不够热爱，只是 CRUD 和 Deadline 把新鲜感磨成了噪音。","action":"把工作和兴趣项目分开，别让前者吞掉后者。","tags":["work","learning","mood"],"source_hint":"V2EX t/772412; Reddit burnout threads","evidence_level":"medium"}
{"text":"真正的休息不是刷到凌晨，而是醒来后不需要再为昨晚还债。","action":"今晚给手机设一个睡前离线点。","tags":["sleep","health","mood"],"source_hint":"HN motivation; Stack Overflow wellness","evidence_level":"medium"}
{"text":"运动不用一上来买课，先让身体相信你明天还会出现。","action":"从 10 分钟走路或爬楼开始。","tags":["health","exercise","habit"],"source_hint":"V2EX t/485183; V2EX t/1003992","evidence_level":"high"}
{"text":"午饭后散步半小时，可能比硬坐着等灵感更像生产力。","action":"把午休拆出 15 分钟给身体重启。","tags":["health","work","routine"],"source_hint":"V2EX t/519626","evidence_level":"medium"}
{"text":"有孩子后，学习计划要从理想日历切换到碎片容错模式。","action":"把学习目标缩成可被打断也能完成的小块。","tags":["family","learning","parenting"],"source_hint":"DEV new baby; V2EX t/1111383","evidence_level":"medium"}
{"text":"照顾家人和推进职业不是同一个进程，别让它们互相抢锁。","action":"分别给家庭、工作、学习设最小可接受线。","tags":["family","career","learning"],"source_hint":"DEV new baby; V2EX t/1111383","evidence_level":"medium"}
{"text":"你说自己没时间运动，其实通勤、午休和楼梯都在等被复用。","action":"找一个不用换装备的运动入口。","tags":["commute","health","exercise"],"source_hint":"V2EX t/1003992; DEV staying sane","evidence_level":"high"}
{"text":"远程工作量最难评估，所以成果可见比在线装忙更重要。","action":"每天同步一个可验证进展，而不是只亮绿点。","tags":["remote","work","communication"],"source_hint":"V2EX t/772412","evidence_level":"medium"}
{"text":"当你开始讨厌所有学习资料，可能不是笨，是脑子在申请降载。","action":"停一天输入，做一次整理或复盘。","tags":["learning","burnout","mood"],"source_hint":"V2EX t/969681; HN burnout","evidence_level":"medium"}
{"text":"季节更替时突然丧，不一定有明确原因，但值得被认真对待。","action":"记录睡眠、日照、运动和情绪，必要时求助专业支持。","tags":["mood","health","life"],"source_hint":"V2EX t/969681; Stack Overflow wellness","evidence_level":"medium"}
{"text":"别把‘我很内向’当作远程孤独的长期解决方案。","action":"选择低压力社交：同城工位、运动课或固定饭友。","tags":["social","remote","mood"],"source_hint":"V2EX t/747977; Reddit social interaction","evidence_level":"medium"}
{"text":"技术人也需要聊天，不是为了闲，是为了确认自己还在社会里。","action":"今天发起一个非需求、非工单的问候。","tags":["social","work","mood"],"source_hint":"V2EX t/747977; DEV remote loneliness","evidence_level":"high"}
{"text":"高压工作让人最亏的地方，是连花钱享受的精力都没了。","action":"买东西前先问：我有时间和心情使用它吗？","tags":["money","life","burnout"],"source_hint":"Reddit 9-5; V2EX life discussions","evidence_level":"low"}
{"text":"消费能短暂回血，但不能替代睡眠、朋友和不被打扰的夜晚。","action":"把今晚的恢复预算投给休息而不是购物车。","tags":["money","mood","health"],"source_hint":"V2EX消费与情绪讨论; HN burnout recovery","evidence_level":"low"}
{"text":"现金流焦虑不是存款数字能完全消灭的，它问的是未来还能不能自救。","action":"把技能、收入渠道和支出弹性各列一项。","tags":["money","career","mood"],"source_hint":"V2EX t/1127690","evidence_level":"medium"}
{"text":"如果工作稳定但你每天都怕被替代，焦虑可能在提醒你维护可迁移性。","action":"更新一次简历或作品清单，不一定马上跳槽。","tags":["career","learning","money"],"source_hint":"Reddit stable job; V2EX career anxiety","evidence_level":"medium"}
{"text":"工作日做饭不是浪费时间，有时是在给生活留一个可控变量。","action":"给自己准备一顿简单但像样的饭。","tags":["life","health","routine"],"source_hint":"V2EX t/519626","evidence_level":"medium"}
{"text":"宠物、小说、游戏直播都可以是恢复，前提是它们不是逃避睡觉的借口。","action":"给娱乐设收尾点，保留回血不透支。","tags":["life","mood","sleep"],"source_hint":"V2EX t/519626","evidence_level":"medium"}
{"text":"有些人下班还能学习，不是更强，可能只是白天没被榨干。","action":"别用别人日程羞辱自己的能量账本。","tags":["learning","mood","life"],"source_hint":"V2EX t/995322; V2EX t/519626","evidence_level":"medium"}
{"text":"全员远程和只有你远程，难度不是一个副本。","action":"如果你是唯一远程，主动争取更清晰的同步机制。","tags":["remote","communication","work"],"source_hint":"DEV dark side of remote work","evidence_level":"high"}
{"text":"家庭在旁边，工作在电脑里，远程人每天都在上下文切换。","action":"用门牌、耳机或日程块减少无声中断。","tags":["remote","family","focus"],"source_hint":"V2EX t/772412; V2EX t/1111383","evidence_level":"high"}
{"text":"你以为换城市能解决一切，现实可能只是把问题从房租换成社交。","action":"迁移前同时评估工作、家人、朋友和医疗便利。","tags":["life","career","family"],"source_hint":"V2EX career/life choice threads","evidence_level":"low"}
{"text":"年龄焦虑常把问题说成 30 岁，其实底层是家庭、健康和选择变少。","action":"拆开年龄标签，分别处理钱、技能和身体。","tags":["career","family","health"],"source_hint":"V2EX t/961747; V2EX t/1036970","evidence_level":"medium"}
{"text":"如果你总想转行，但每条路都被年龄和家庭挡住，先别急着否定自己。","action":"做一次低成本试探，而不是一次性赌全部。","tags":["career","family","mood"],"source_hint":"V2EX t/1111383","evidence_level":"medium"}
{"text":"程序员的中年危机有时不是技术危机，是恢复能力不再无限续杯。","action":"把体检、运动和睡眠排进长期维护计划。","tags":["health","career","life"],"source_hint":"V2EX t/969681; V2EX t/1066689","evidence_level":"medium"}
{"text":"不愿学习、不愿游戏、不愿工作同时出现时，别只骂自己懒。","action":"把它当情绪信号，先找人聊聊或寻求专业帮助。","tags":["mood","health","burnout"],"source_hint":"V2EX t/969681; HN burnout","evidence_level":"high"}
{"text":"远程自由最爽的是时间可调，最危险的也是时间可调。","action":"给自己设一个固定收工锚点。","tags":["remote","boundary","routine"],"source_hint":"V2EX t/772412; Reddit stop thinking","evidence_level":"medium"}
{"text":"晚上写代码会上瘾，但第二天的你也会收到扣款通知。","action":"深夜灵感先记下来，不一定立刻开工。","tags":["sleep","learning","work"],"source_hint":"V2EX t/772412; HN motivation","evidence_level":"medium"}
{"text":"技术债会传染情绪：项目越乱，人越容易怀疑自己。","action":"把混乱命名出来，先整理一个可控边界。","tags":["work","legacy","mood"],"source_hint":"V2EX t/1111383","evidence_level":"medium"}
{"text":"当你觉得每个需求都紧急，可能只是没人替你设优先级。","action":"把任务分成今天必须、可以等、需要确认。","tags":["work","mood","productivity"],"source_hint":"HN mentally overwhelming; Reddit burnout","evidence_level":"medium"}
{"text":"少说 yes 不是不合作，是保护后续每一个 yes 的质量。","action":"下一次加活先问截止时间和取舍项。","tags":["work","boundary","burnout"],"source_hint":"HN mentally overwhelming","evidence_level":"high"}
{"text":"有些倦怠不是因为不够努力，而是长期负进度和返工在偷能量。","action":"今天识别一个最常返工的源头。","tags":["work","burnout","quality"],"source_hint":"HN developers lying work discussion","evidence_level":"medium"}
{"text":"线上等回复等到烦躁时，问题可能不是你急，是协作通道太窄。","action":"把阻塞点公开，约一个短同步而不是继续猜。","tags":["remote","communication","work"],"source_hint":"Reddit lack of social interaction; V2EX t/772412","evidence_level":"high"}
{"text":"用钱忍过所有不舒服，最后可能只剩更贵的辞职成本。","action":"记录连续三周的压力源，判断是不是结构性问题。","tags":["money","career","burnout"],"source_hint":"V2EX t/747977; Reddit salary vs WLB","evidence_level":"medium"}
{"text":"想靠激情穿越整个职业生涯不现实，系统维护比热血启动更重要。","action":"给学习、运动、社交各设一个最低保活动作。","tags":["career","health","learning"],"source_hint":"HN motivation; DEV staying sane","evidence_level":"high"}
{"text":"家人看不见你的脑力消耗，就容易以为你只是坐了一天。","action":"用具体边界解释：什么时间能帮忙，什么时间不能打断。","tags":["family","remote","boundary"],"source_hint":"V2EX t/772412; DEV new baby","evidence_level":"medium"}
{"text":"新生儿会重写所有时间表，别用无孩版本的自己做基准。","action":"把目标降级成睡眠优先、任务可暂停、学习可碎片。","tags":["family","parenting","sleep"],"source_hint":"DEV new baby","evidence_level":"medium"}
{"text":"如果你在家办公却每天缺乏工作氛围，不是矫情，是环境提示消失了。","action":"用固定开工动作给大脑一个上班信号。","tags":["remote","focus","routine"],"source_hint":"V2EX t/1111383; V2EX t/772412","evidence_level":"high"}
{"text":"工作和生活分不开时，休息也会被内疚感污染。","action":"把休息写进日程，让它不是偷来的。","tags":["remote","mood","boundary"],"source_hint":"V2EX t/772412; DEV remote work","evidence_level":"medium"}
{"text":"一边陪孩子一边开会，通常两边都觉得你不在场。","action":"给会议和陪伴各留完整小块，减少夹心状态。","tags":["family","remote","focus"],"source_hint":"V2EX t/772412; DEV new baby","evidence_level":"medium"}
{"text":"办公室闲聊有时不是浪费，它在补需求背景和情绪温度。","action":"远程团队也要保留低成本闲聊入口。","tags":["remote","social","communication"],"source_hint":"V2EX t/747977; Reddit social interaction","evidence_level":"medium"}
{"text":"当你几乎不和业务方说话，Jira 就会变成许愿池。","action":"找业务确认一个真实使用场景。","tags":["work","communication","remote"],"source_hint":"Reddit lack of social interaction","evidence_level":"medium"}
{"text":"每次学习都从收藏教程开始，可能只是焦虑在伪装成准备。","action":"别再加收藏，打开一个例子跑起来。","tags":["learning","mood","action"],"source_hint":"DEV staying sane; HN motivation","evidence_level":"low"}
{"text":"技术更新追不完，人生也不是 npm update。","action":"只更新和当前目标有关的依赖。","tags":["learning","mood","career"],"source_hint":"V2EX career learning discussions","evidence_level":"low"}
{"text":"你可以喜欢编程，但不必把所有夜晚都献给编程。","action":"今晚给非技术爱好留 30 分钟。","tags":["life","learning","mood"],"source_hint":"DEV staying sane; HN burnout recovery","evidence_level":"high"}
{"text":"兴趣驱动很珍贵，但兴趣也需要不被工作榨干的土壤。","action":"把兴趣项目安排在精力没见底的时段。","tags":["learning","sideproject","health"],"source_hint":"V2EX t/1169590; DEV staying sane","evidence_level":"low"}
{"text":"如果你只在周末补人生，工作日五天就会像缓存泄漏。","action":"工作日也塞一个 15 分钟的小恢复。","tags":["life","mood","routine"],"source_hint":"DEV staying sane; Reddit 9-5","evidence_level":"high"}
{"text":"远程不等于低沟通，少了走到工位旁边那一步，就更要写清楚。","action":"把口头约定落到文档或 issue。","tags":["remote","communication","work"],"source_hint":"V2EX t/772412","evidence_level":"high"}
{"text":"同屏协作不是形式主义，它能让‘我以为’变成‘我们看到的是同一个’。","action":"复杂问题开一次共享屏幕或画板。","tags":["remote","communication","tool"],"source_hint":"V2EX t/772412","evidence_level":"medium"}
{"text":"如果全天只有站会像真人接触，那站会就承受了太多社交期待。","action":"另外安排轻量 pair 或 coffee chat。","tags":["remote","social","work"],"source_hint":"Reddit lack of social interaction","evidence_level":"medium"}
{"text":"身体开始报警时，‘项目忙完再说’通常是最会延期的需求。","action":"今天预约体检、牙科或一次运动。","tags":["health","work","life"],"source_hint":"V2EX t/485183; Stack Overflow wellness","evidence_level":"medium"}
{"text":"你对健身房的恐惧，可能来自把运动想成了大型项目。","action":"先做不用会员卡的版本：走路、拉伸、爬楼。","tags":["health","exercise","habit"],"source_hint":"V2EX t/485183; V2EX t/1003992","evidence_level":"high"}
{"text":"减肥成功帖背后常见的不是神药，是可重复的通勤、楼梯和饭盒。","action":"选一个能重复十次的小健康动作。","tags":["health","exercise","routine"],"source_hint":"V2EX t/1003992","evidence_level":"high"}
{"text":"午餐随便糊弄，下午 Debug 也会跟着随便糊弄你。","action":"给午饭加一份稳定蛋白或蔬菜。","tags":["health","work","routine"],"source_hint":"V2EX t/1003992; HN motivation","evidence_level":"medium"}
{"text":"血压、体重、睡眠这些指标，比周报更诚实地记录了你的工作方式。","action":"选一个健康指标观察两周。","tags":["health","work","data"],"source_hint":"V2EX t/1003992; Stack Overflow wellness","evidence_level":"medium"}
{"text":"如果你总在休息时自责，说明公司文化已经装进了你的脑内插件。","action":"给休息写一句明确理由：为了明天可持续。","tags":["mood","burnout","boundary"],"source_hint":"HN burnout recovery; Reddit 9-5","evidence_level":"medium"}
{"text":"倦怠恢复不是靠一次旅行满血，更多时候是重新分配注意力。","action":"今天把注意力分一点给朋友、身体或爱好。","tags":["burnout","mood","life"],"source_hint":"HN burnout recovery","evidence_level":"high"}
{"text":"你不需要证明自己永远热爱代码，先证明自己还能好好生活。","action":"把今天的成功标准降到吃饭、睡觉、走动。","tags":["mood","health","life"],"source_hint":"HN burnout; V2EX t/969681","evidence_level":"medium"}
{"text":"当项目让你精神过载，家庭也会收到溢出的异常。","action":"回家前做 5 分钟收尾，把工作情绪放下。","tags":["family","mood","work"],"source_hint":"HN mentally overwhelming; Reddit 9-5","evidence_level":"medium"}
{"text":"家人需要你，不等于你必须无限可用。","action":"说清楚可用时间，比硬扛到爆炸更负责。","tags":["family","boundary","health"],"source_hint":"HN mentally overwhelming; DEV new baby","evidence_level":"high"}
{"text":"远程让你省下通勤，也可能偷走下班路上的心理缓冲区。","action":"收工后散步 10 分钟，模拟一段回家路。","tags":["remote","commute","mood"],"source_hint":"DEV remote work; V2EX remote threads","evidence_level":"medium"}
{"text":"通勤太长不是小问题，它每天稳定吞掉运动、学习和陪伴。","action":"评估一次住所、办公方式或通勤替代方案。","tags":["commute","life","health"],"source_hint":"DEV staying sane","evidence_level":"high"}
{"text":"最好的通勤不一定最短，也可能是能让你走路、骑车或安静听课的那条。","action":"试一次让通勤顺便服务健康或学习。","tags":["commute","learning","health"],"source_hint":"DEV staying sane; V2EX t/519626","evidence_level":"medium"}
{"text":"低压岗位也会有空心感，太少挑战会让人怀疑自己是不是停了。","action":"给工作外设一个温和但可验证的成长目标。","tags":["career","learning","mood"],"source_hint":"V2EX t/1164503; Reddit stable job","evidence_level":"medium"}
{"text":"忙到没时间学习会焦虑，闲到不知道学什么也会焦虑。","action":"用下一份简历倒推一个学习主题。","tags":["learning","career","mood"],"source_hint":"V2EX t/1164503; HN motivation","evidence_level":"medium"}
{"text":"如果你觉得人生只剩工作选择题，先把非工作身份捡回来。","action":"列三个与职位无关的自己：朋友、家人、爱好者。","tags":["life","mood","identity"],"source_hint":"HN burnout recovery; Reddit 9-5","evidence_level":"medium"}
{"text":"社恐程序员也需要关系，只是入口要低噪声。","action":"从一对一聊天或共同运动开始，不必硬闯大局。","tags":["social","mood","life"],"source_hint":"V2EX t/747977; V2EX social/life threads","evidence_level":"medium"}
{"text":"如果一天没有任何小胜利，大脑会把所有任务都标红。","action":"完成一个可见的小动作：提交、整理、回复或散步。","tags":["mood","productivity","habit"],"source_hint":"DEV unproductive days; HN motivation","evidence_level":"medium"}
{"text":"别把低产日解释成人格问题，软件工程本来就有高波动。","action":"记录阻塞原因，而不是只记录自责。","tags":["work","mood","productivity"],"source_hint":"HN developers work discussion; DEV unproductive days","evidence_level":"medium"}
{"text":"你今天写不动代码，也许可以写下问题；写下问题也是推进。","action":"把卡点改写成一句可求助的问题。","tags":["work","communication","mood"],"source_hint":"DEV unproductive days; Reddit lack of interaction","evidence_level":"medium"}
{"text":"注意力差异不是道德失败，有些人需要更明确的外部结构。","action":"用清单、计时器或同伴同步给任务加护栏。","tags":["focus","health","work"],"source_hint":"Stack Overflow ADHD developers","evidence_level":"medium"}
{"text":"超专注很爽，但忘记吃饭睡觉时，它就从技能变成债务。","action":"给深度工作设补给提醒。","tags":["focus","health","sleep"],"source_hint":"Stack Overflow ADHD developers","evidence_level":"medium"}
{"text":"别把 ADHD、焦虑或低落包装成‘程序员特质’，该支持时就支持。","action":"需要时向专业人士或可信同事说明你的工作支持需求。","tags":["health","mood","work"],"source_hint":"Stack Overflow ADHD developers; Stack Overflow wellness","evidence_level":"medium"}
{"text":"项目压力、家庭任务和睡眠不足叠在一起，谁都会像内存吃满。","action":"先释放一个进程：推迟、求助或缩小范围。","tags":["family","sleep","burnout"],"source_hint":"DEV new baby; HN mentally overwhelming","evidence_level":"high"}
{"text":"当你连续几周只靠咖啡上线，真正该扩容的是休息。","action":"今天把咖啡因截止时间提前。","tags":["health","sleep","work"],"source_hint":"HN motivation; Stack Overflow wellness","evidence_level":"low"}
{"text":"你不需要靠痛苦证明自己是认真工作的程序员。","action":"用结果证明价值，用边界保护人。","tags":["work","boundary","mood"],"source_hint":"Reddit burnout; HN burnout recovery","evidence_level":"medium"}
{"text":"线上协作最怕默认别人懂，因为大家其实都在各自的房间里脑补。","action":"关键决策写出背景、结论和下一步。","tags":["remote","communication","work"],"source_hint":"V2EX t/772412; Reddit remote communication","evidence_level":"high"}
{"text":"如果你每次休假回来状态变好，问题可能不是人懒，是日常缺恢复。","action":"把恢复拆成每周固定动作，而不只押注长假。","tags":["burnout","mood","life"],"source_hint":"V2EX t/747977; HN burnout recovery","evidence_level":"medium"}
{"text":"远程人的假期不要只用来补觉，也要补人际连接。","action":"假期安排一次见朋友或家人的真实相处。","tags":["remote","social","family"],"source_hint":"V2EX t/747977; DEV remote loneliness","evidence_level":"medium"}
{"text":"你以为自己需要更强意志力，实际上可能需要更少中断。","action":"关掉一小时非必要通知，给任务完整时间片。","tags":["focus","remote","productivity"],"source_hint":"V2EX t/772412; Stack Overflow ADHD","evidence_level":"medium"}
{"text":"在家办公时，家务会假装成‘顺手’，最后拼成一整天碎片。","action":"把家务集中到两个窗口，不让它随机抢占。","tags":["remote","family","routine"],"source_hint":"DEV remote work; V2EX t/772412","evidence_level":"medium"}
{"text":"如果你觉得代码越写越孤独，可能需要的不是新框架，是共同体。","action":"加入一个技术群、线下活动或固定学习搭子。","tags":["social","learning","mood"],"source_hint":"V2EX t/747977; DEV remote loneliness","evidence_level":"medium"}
{"text":"学习搭子最大的价值不是监督你卷，而是提醒你不是一个人卡住。","action":"找一个能同步进度的人，哪怕每周一次。","tags":["learning","social","mood"],"source_hint":"V2EX t/519626; HN motivation","evidence_level":"low"}
{"text":"把所有空闲都投给技能，会让人生投资组合过于单一。","action":"今天给健康或关系也投一小笔时间。","tags":["life","learning","health"],"source_hint":"HN burnout recovery; DEV staying sane","evidence_level":"high"}
{"text":"你并不欠每个新技术一次通宵体验。","action":"先问它和你的目标有什么关系。","tags":["learning","boundary","career"],"source_hint":"DEV staying sane; V2EX learning discussions","evidence_level":"medium"}
{"text":"如果你连娱乐都提不起兴趣，别继续拿更多任务压自己。","action":"降低输入强度，观察情绪并考虑求助。","tags":["mood","health","burnout"],"source_hint":"V2EX t/969681","evidence_level":"high"}
{"text":"房贷、孩子、父母和职业焦虑会一起开会，你需要做会议纪要。","action":"把压力源逐条写下，给每条配一个最小动作。","tags":["family","money","mood"],"source_hint":"V2EX t/969681; V2EX t/961747","evidence_level":"medium"}
{"text":"人生正常但心情不正常，这种矛盾本身就值得被看见。","action":"别用‘我不该这样’堵住求助入口。","tags":["mood","health","life"],"source_hint":"V2EX t/969681","evidence_level":"medium"}
{"text":"程序员常把可测量的都优化了，却把不可测量的孤独留到最后。","action":"给社交也设一个轻量指标：本周见一个人。","tags":["social","mood","life"],"source_hint":"V2EX t/747977; Reddit social interaction","evidence_level":"high"}
{"text":"需求、家务、学习都在排队时，先别谈效率，先谈容量。","action":"删掉一个非必要承诺，给系统降载。","tags":["life","family","productivity"],"source_hint":"HN mentally overwhelming; DEV new baby","evidence_level":"medium"}
{"text":"长期远程如果没有外部节奏，很容易把一天过成一团雾。","action":"固定起床、开工、午休、收工四个锚点。","tags":["remote","routine","mood"],"source_hint":"DEV remote work; V2EX t/772412","evidence_level":"medium"}
{"text":"你不是机器学习模型，不需要把所有数据都喂进脑子才敢行动。","action":"选一个小实验验证，而不是继续查资料。","tags":["learning","action","mood"],"source_hint":"DEV staying sane; HN motivation","evidence_level":"low"}
