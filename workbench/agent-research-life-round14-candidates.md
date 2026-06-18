# agent-research-life-round14-candidates

调研子智能体 A 产出。目标是为“程序员生存模拟器”补充生活、家庭、健康、通勤、远程孤独与普通稳定生活方向的弹窗候选。候选均为原创改写，不复制原帖原文；本文件仅作为 `workbench` 候选材料，不进入正式数据池，不修改 HTML。

## 来源列表

- V2EX：程序员通勤、租房、家庭时间、远程办公边界、稳定工作的社区经验帖。
- Reddit / r/cscareerquestions：软件工程师通勤、下班恢复、远程孤独、稳定岗位、家庭与职业选择讨论。
- Hacker News / Ask HN：开发者倦怠、业余项目、远程协作、边界感与普通生活讨论。
- TeamBlind：WFH 是否改善 WLB、家庭分工、通勤与职业选择的匿名职场帖。
- DEV Community：不在下班后写代码、开发者恢复、心理健康和爱好恢复文章。
- Indie Hackers：全职工作、家庭、跑步、side project 和可持续节奏讨论。
- Stack Overflow Blog：开发者 wellness、健康习惯、工作满意度与远程工作相关数据文章。
- Buffer State of Remote Work：远程工作孤独、边界、沟通与居家办公体验报告。
- GitLab Remote Work Report / Remote Playbook：异步协作、远程团队边界、文档化与心理安全经验。
- Microsoft Work Trend Index：混合办公、会议疲劳、数字负荷与工作生活边界报告。
- Gallup workplace / wellbeing research：混合办公、员工参与度、幸福感、通勤与倦怠相关研究。
- arXiv / 软件工程 well-being 研究：开发者居家办公、夜间工作、vlog 生活与职业幸福感论文线索。

## 主题簇

- 通勤与居住：通勤时间、地铁车厢、搬近公司、租房成本、买车和城市生活。
- 远程孤独与边界：省掉通勤但失去下班缓冲，客厅变办公室，异步沟通和消息压力。
- 家庭与亲密关系：家务、带娃、伴侣沟通、父母距离、陪伴被工作挤压。
- 健康与恢复：睡眠、久坐、体检、运动、饮食、眼睛和腰背维护。
- 普通稳定生活：不跳槽、普通岗位、稳定现金流、慢一点的职业节奏。
- 朋友与社区：朋友变少、午饭搭子、运动搭子、非工作社交和孤独缓冲。
- 副业与爱好：side project、开源、跑步、游戏、摄影、吉他和“不把爱好 KPI 化”。
- 钱与生活成本：房租、外卖、医疗、储蓄、城市选择、家庭预算。
- 心理负荷：会议疲劳、通知焦虑、周日晚上焦虑、行业变化下的安全感。
- 日常维护：做饭、打扫、洗衣、买菜、修家电、整理书桌等普通生活动作。

## 120 条 JSONL 候选

```jsonl
{"action":"rest","text":"你把单程通勤从一小时砍到二十分钟，工资没涨，但早晨终于不像事故现场。","tone":"resonant","kind":"life","category":"commute-housing","source_hint":"V2EX / Reddit / 36Kr"}
{"action":"rest","text":"地铁门一开，你和一群没睡醒的进程一起被调度进城市。","tone":"wry","kind":"life","category":"commute","source_hint":"V2EX / 知乎 / Reddit"}
{"action":"interview","text":"新 offer 多给五千，但每天多堵一小时，你第一次认真计算精神税。","tone":"sharp","kind":"event","category":"job-choice-commute","source_hint":"TeamBlind / V2EX / Reddit"}
{"action":"rest","text":"下班路上你没有听技术播客，只看窗外发呆，脑子终于停止接单。","tone":"gentle","kind":"life","category":"commute-decompression","source_hint":"Hacker News / Reddit / Buffer"}
{"action":"overtime","text":"晚上十点的末班车很安静，安静到你能听见生活被压缩的声音。","tone":"sharp","kind":"life","category":"late-commute","source_hint":"V2EX / TeamBlind / Zhihu"}
{"action":"rest","text":"你搬到离公司近的老小区，电梯慢，心跳倒是慢下来了。","tone":"resonant","kind":"life","category":"housing","source_hint":"V2EX / 豆瓣 / 36Kr"}
{"action":"interview","text":"面试最后你没问技术栈，先问班车和混合办公，成熟得有点心酸。","tone":"wry","kind":"event","category":"commute-boundary","source_hint":"TeamBlind / Reddit / Microsoft Work Trend Index"}
{"action":"rest","text":"雨天你打车回家，账单很贵，但比在公交站崩掉便宜。","tone":"resonant","kind":"life","category":"commute-stress","source_hint":"V2EX / 豆瓣 / Gallup"}
{"action":"overtime","text":"导航说还有十二分钟到家，你知道真正到家还要先从工作里出来。","tone":"resonant","kind":"life","category":"commute-boundary","source_hint":"V2EX / Buffer / Hacker News"}
{"action":"rest","text":"你把通勤当作关机流程，过了小区门口才允许自己想晚饭。","tone":"gentle","kind":"life","category":"commute-ritual","source_hint":"Buffer / GitLab / Reddit"}
{"action":"rest","text":"远程办公省掉了地铁，也省掉了那个让你切回生活的缓冲区。","tone":"resonant","kind":"life","category":"remote-boundary","source_hint":"Buffer State of Remote Work / Microsoft Work Trend Index"}
{"action":"overtime","text":"工位挪到卧室后，你连做梦都像还挂在会议里。","tone":"wry","kind":"life","category":"remote-home-office","source_hint":"Buffer / GitLab / arXiv"}
{"action":"networking","text":"你和远程同事每周约一次闲聊，不汇报进度，只证明大家不是头像。","tone":"gentle","kind":"life","category":"remote-loneliness","source_hint":"GitLab / Buffer / Hacker News"}
{"action":"rest","text":"居家第三天，你开始怀念公司楼下那家难吃但稳定的午饭。","tone":"wry","kind":"life","category":"remote-routine","source_hint":"Reddit / V2EX / DEV Community"}
{"action":"overtime","text":"消息软件绿灯亮着，像在客厅里挂了一块永不下班的招牌。","tone":"sharp","kind":"life","category":"remote-notification","source_hint":"Microsoft Work Trend Index / Buffer / TeamBlind"}
{"action":"rest","text":"你给书桌旁边放了盏小灯，试图用物理开关区分上班和活着。","tone":"gentle","kind":"life","category":"remote-boundary","source_hint":"GitLab / DEV Community / Buffer"}
{"action":"networking","text":"异步沟通让你少开了三场会，也少了三次假装没事的机会。","tone":"resonant","kind":"life","category":"remote-social","source_hint":"GitLab Remote Playbook / Microsoft Work Trend Index"}
{"action":"rest","text":"你中午出门晒了十分钟太阳，像给远程人生补了一次依赖。","tone":"gentle","kind":"health","category":"remote-health","source_hint":"Buffer / Stack Overflow Blog / Gallup"}
{"action":"overtime","text":"家里人以为你在家就有空，团队以为你在线就能回。","tone":"sharp","kind":"life","category":"remote-family-boundary","source_hint":"TeamBlind / Buffer / Reddit"}
{"action":"rest","text":"你把电脑合上后盖了一块布，仪式幼稚，但边界有效。","tone":"wry","kind":"life","category":"remote-ritual","source_hint":"DEV Community / Hacker News / Buffer"}
{"action":"networking","text":"孩子问你今天能不能不加班，你第一次把这个问题当需求优先级最高。","tone":"resonant","kind":"life","category":"parenting","source_hint":"TeamBlind / V2EX / Reddit"}
{"action":"rest","text":"你陪伴侣散步半小时，没有给任何人讲架构，关系反而更稳。","tone":"gentle","kind":"life","category":"relationship","source_hint":"Reddit / 豆瓣 / Hacker News"}
{"action":"overtime","text":"你说马上忙完，家里人已经学会把这句话按延期项目处理。","tone":"wry","kind":"life","category":"family-boundary","source_hint":"V2EX / TeamBlind / Zhihu"}
{"action":"networking","text":"家务分工表写出来后，你才发现最重的是没人承认的隐形任务。","tone":"resonant","kind":"life","category":"household-work","source_hint":"TeamBlind / Reddit / Gallup"}
{"action":"rest","text":"周末带娃比上线累，但这个小用户会突然抱住你。","tone":"wry","kind":"life","category":"parenting","source_hint":"TeamBlind / V2EX / Reddit"}
{"action":"interview","text":"你拒了加班更狠的高薪岗位，因为家里的晚饭也需要长期维护。","tone":"resonant","kind":"event","category":"family-job-choice","source_hint":"Reddit / TeamBlind / Hacker News"}
{"action":"rest","text":"父母视频问你累不累，你笑着说还好，省下了解释互联网的力气。","tone":"wry","kind":"life","category":"parents","source_hint":"知乎 / V2EX / 豆瓣"}
{"action":"overtime","text":"你把坏情绪带回家，客厅马上变成了第二个战场。","tone":"sharp","kind":"life","category":"family-emotion","source_hint":"TeamBlind / 豆瓣 / Reddit"}
{"action":"networking","text":"你和伴侣约定饭桌上不看工单，晚饭终于不像站会。","tone":"gentle","kind":"life","category":"relationship-boundary","source_hint":"Hacker News / Reddit / DEV Community"}
{"action":"rest","text":"家不是后台服务，它也会因为长期无人维护而变慢。","tone":"sharp","kind":"life","category":"family-maintenance","source_hint":"TeamBlind / V2EX / Gallup"}
{"action":"rest","text":"你提前睡了一晚，第二天的 bug 还是 bug，但你不再像 bug。","tone":"gentle","kind":"health","category":"sleep","source_hint":"Stack Overflow Blog / Reddit / Hacker News"}
{"action":"overtime","text":"凌晨两点的提交很顺利，第二天的你开始全面回滚。","tone":"sharp","kind":"health","category":"sleep-debt","source_hint":"Hacker News / DEV Community / arXiv"}
{"action":"rest","text":"你把手机放到客厅充电，卧室第一次像休息区，不像监控室。","tone":"resonant","kind":"health","category":"sleep-boundary","source_hint":"Buffer / Microsoft Work Trend Index / Reddit"}
{"action":"rest","text":"午休二十分钟后，下午的需求看起来不再像私人恩怨。","tone":"wry","kind":"health","category":"nap","source_hint":"Stack Overflow Blog / V2EX / DEV Community"}
{"action":"overtime","text":"你的黑眼圈已经会自动同步项目进度，不需要日报。","tone":"wry","kind":"health","category":"sleep-debt","source_hint":"V2EX / Reddit / Hacker News"}
{"action":"rest","text":"今晚你没刷技术新闻，焦虑少了一条自动更新源。","tone":"gentle","kind":"health","category":"digital-detox","source_hint":"DEV Community / Hacker News / Buffer"}
{"action":"rest","text":"你发现早睡不是自律展示，而是给明天留一点可用内存。","tone":"resonant","kind":"health","category":"sleep","source_hint":"Stack Overflow Blog / Gallup / Reddit"}
{"action":"overtime","text":"你靠咖啡续到下班，胃替你记下了这笔技术债。","tone":"sharp","kind":"health","category":"diet-sleep","source_hint":"V2EX / CSDN / Stack Overflow Blog"}
{"action":"rest","text":"睡前你只洗澡不复盘，人生难得没有继续打日志。","tone":"gentle","kind":"health","category":"sleep-routine","source_hint":"Hacker News / DEV Community / Reddit"}
{"action":"rest","text":"你把周日晚上留给发呆，周一焦虑没有赢得全票。","tone":"resonant","kind":"health","category":"sunday-scaries","source_hint":"Reddit / Gallup / Hacker News"}
{"action":"rest","text":"你站起来拉伸三分钟，腰椎像终于收到一次补丁。","tone":"wry","kind":"health","category":"sedentary","source_hint":"Stack Overflow Blog / V2EX / Reddit"}
{"action":"rest","text":"体检报告出来后，你第一次认真看懂了身体的错误日志。","tone":"resonant","kind":"health","category":"medical-check","source_hint":"知乎 / SegmentFault / Stack Overflow Blog"}
{"action":"overtime","text":"你说忙完再运动，身体已经听过太多版本的路线图。","tone":"sharp","kind":"health","category":"exercise-delay","source_hint":"Reddit / DEV Community / Stack Overflow Blog"}
{"action":"rest","text":"你下楼走了两圈，没有燃烧梦想，只把肩颈从红线拉回来。","tone":"gentle","kind":"health","category":"walking","source_hint":"Stack Overflow Blog / Gallup / DEV Community"}
{"action":"rest","text":"健身房只练了二十五分钟，但你终于不是一整天的坐姿附件。","tone":"resonant","kind":"health","category":"exercise","source_hint":"Reddit / DEV Community / V2EX"}
{"action":"overtime","text":"你把晚饭压到十点，胃比老板更早提出异议。","tone":"sharp","kind":"health","category":"diet","source_hint":"V2EX / 知乎 / Stack Overflow Blog"}
{"action":"rest","text":"今天你自己煮了面，味道普通，掌控感很香。","tone":"gentle","kind":"life","category":"cooking","source_hint":"豆瓣 / V2EX / Reddit"}
{"action":"rest","text":"眼药水不能解决所有屏幕疲劳，但能提醒你眼睛不是外设。","tone":"wry","kind":"health","category":"screen-fatigue","source_hint":"Stack Overflow Blog / CSDN / DEV Community"}
{"action":"rest","text":"你把周末上午交给睡眠和洗衣机，生活终于有了维护窗口。","tone":"gentle","kind":"life","category":"weekend-recovery","source_hint":"Hacker News / Reddit / 豆瓣"}
{"action":"overtime","text":"加班餐吃完，你发现真正油腻的不是盒饭，是节奏。","tone":"sharp","kind":"health","category":"overtime-diet","source_hint":"V2EX / TeamBlind / CSDN"}
{"action":"interview","text":"你没有跳槽，只是把当前稳定当成一个能喘气的版本。","tone":"resonant","kind":"event","category":"stable-life","source_hint":"Reddit / Hacker News / V2EX"}
{"action":"rest","text":"普通工作不刺激，但它让你能按时吃饭、看病、交房租。","tone":"resonant","kind":"life","category":"stable-life","source_hint":"Reddit / Gallup / Stack Overflow Blog"}
{"action":"interview","text":"市场冷的时候，不乱动也可能是一种主动策略。","tone":"gentle","kind":"event","category":"career-stability","source_hint":"TeamBlind / Reddit / Hacker News"}
{"action":"overtime","text":"你总觉得再拼一阵就自由，可这一阵已经续订了很多年。","tone":"sharp","kind":"life","category":"career-grind","source_hint":"Hacker News / V2EX / Reddit"}
{"action":"rest","text":"你开始珍惜不传奇的日子：代码普通，晚饭准时，睡眠完整。","tone":"resonant","kind":"life","category":"ordinary-life","source_hint":"Hacker News / DEV Community / Gallup"}
{"action":"interview","text":"你问团队流失率，不是八卦，是在评估自己未来的生活波动。","tone":"wry","kind":"event","category":"interview-boundary","source_hint":"TeamBlind / Reddit / V2EX"}
{"action":"rest","text":"稳定不是躺平，有时只是拒绝把人生永远设成冲刺模式。","tone":"sharp","kind":"life","category":"stable-life","source_hint":"Hacker News / Gallup / Reddit"}
{"action":"interview","text":"你没有被大厂名字冲昏头，先算了通勤、房租和胃药。","tone":"wry","kind":"event","category":"job-choice","source_hint":"V2EX / TeamBlind / 36Kr"}
{"action":"rest","text":"你把人生目标从出人头地改成持续在线，压力少了一半。","tone":"resonant","kind":"life","category":"ordinary-life","source_hint":"Hacker News / Reddit / DEV Community"}
{"action":"overtime","text":"项目会延期，版本会回滚，只有你的年龄不会等排期。","tone":"sharp","kind":"life","category":"life-clock","source_hint":"V2EX / Hacker News / arXiv"}
{"action":"networking","text":"午饭固定和一个同事搭伙，孤独没有消失，但有了缓存。","tone":"gentle","kind":"life","category":"work-friendship","source_hint":"V2EX / Reddit / Buffer"}
{"action":"networking","text":"你约朋友吃饭，整晚没人提绩效，空气都变轻了。","tone":"resonant","kind":"life","category":"friendship","source_hint":"豆瓣 / Reddit / Hacker News"}
{"action":"rest","text":"群聊热闹了一晚上，你却更确定自己需要线下见个人。","tone":"resonant","kind":"life","category":"social-loneliness","source_hint":"Buffer / Reddit / 豆瓣"}
{"action":"networking","text":"你没有参加每个饭局，社交电量也需要限流。","tone":"wry","kind":"life","category":"social-energy","source_hint":"Reddit / DEV Community / Hacker News"}
{"action":"networking","text":"远程团队的闲聊频道救不了全部孤独，但能救下一点沉默。","tone":"gentle","kind":"life","category":"remote-social","source_hint":"GitLab / Buffer / Microsoft Work Trend Index"}
{"action":"rest","text":"你周末去书店坐了半小时，没有输入知识，只输入人味。","tone":"gentle","kind":"life","category":"third-place","source_hint":"豆瓣 / Hacker News / Reddit"}
{"action":"networking","text":"同事可以是午饭搭子，不一定要升级成情绪客服。","tone":"wry","kind":"life","category":"work-friendship-boundary","source_hint":"V2EX / TeamBlind / Reddit"}
{"action":"rest","text":"你主动给老朋友发了条消息，关系没有立即恢复，但线路还通。","tone":"resonant","kind":"life","category":"friendship-maintenance","source_hint":"豆瓣 / Reddit / Gallup"}
{"action":"networking","text":"运动搭子把你从椅子上拉走，比自律鸡汤可靠得多。","tone":"gentle","kind":"health","category":"exercise-social","source_hint":"Reddit / DEV Community / Stack Overflow Blog"}
{"action":"rest","text":"你承认自己有点孤独，这不是失败，只是连接数太低。","tone":"resonant","kind":"life","category":"loneliness","source_hint":"Buffer / Gallup / Reddit"}
{"action":"side-project","text":"你给副项目设了每周两晚，野心小一点，寿命长一点。","tone":"gentle","kind":"learning","category":"side-project-sustainable","source_hint":"Indie Hackers / Hacker News / DEV Community"}
{"action":"side-project","text":"副业需求越写越像主业，你决定先砍掉那个虚构的产品经理。","tone":"wry","kind":"learning","category":"side-project-scope","source_hint":"Indie Hackers / Hacker News / Reddit"}
{"action":"rest","text":"今晚你打游戏没有内疚，娱乐终于不用伪装成效率工具。","tone":"wry","kind":"life","category":"hobby","source_hint":"Reddit / DEV Community / 豆瓣"}
{"action":"side-project","text":"你做了一个没人用的小工具，但它完整接住了你的创造欲。","tone":"resonant","kind":"learning","category":"creative-hobby","source_hint":"Indie Hackers / DEV Community / Hacker News"}
{"action":"rest","text":"你把吉他从墙角拿出来，手生得明显，心情倒是上线很快。","tone":"gentle","kind":"life","category":"hobby-recovery","source_hint":"DEV Community / Reddit / 豆瓣"}
{"action":"overtime","text":"主业写需求，副业也写需求，你开始怀疑自由只是换了工牌。","tone":"wry","kind":"learning","category":"side-project-burnout","source_hint":"Indie Hackers / Hacker News / TeamBlind"}
{"action":"side-project","text":"你暂停了开源维护，没人怪你，除了那个过度负责的自己。","tone":"resonant","kind":"learning","category":"open-source-boundary","source_hint":"Hacker News / DEV Community / Reddit"}
{"action":"rest","text":"你周末拍了几张街景，世界没有编译，但光线通过了测试。","tone":"gentle","kind":"life","category":"hobby-photography","source_hint":"豆瓣 / DEV Community / Reddit"}
{"action":"side-project","text":"你把副业目标从暴富改成做完一个小版本，终于能开始了。","tone":"gentle","kind":"learning","category":"side-project-scope","source_hint":"Indie Hackers / DEV Community / Hacker News"}
{"action":"rest","text":"今天你没有学习新框架，只把书桌收拾干净，生活先发布了小版本。","tone":"resonant","kind":"life","category":"home-maintenance","source_hint":"豆瓣 / DEV Community / Buffer"}
{"action":"rest","text":"房租自动扣款那天，你比平时更清楚自己为什么要稳定现金流。","tone":"resonant","kind":"life","category":"finance-rent","source_hint":"36Kr / V2EX / Gallup"}
{"action":"interview","text":"你考虑回二线城市，不是退场，是把生活成本纳入架构图。","tone":"resonant","kind":"event","category":"city-choice","source_hint":"V2EX / 36Kr / Zhihu"}
{"action":"rest","text":"你没买新设备，把钱留作缓冲，安全感比跑分更耐用。","tone":"gentle","kind":"life","category":"finance-buffer","source_hint":"V2EX / Hacker News / Gallup"}
{"action":"overtime","text":"房贷、父母、孩子和自己一起排队，你的时间片被抢占到发烫。","tone":"sharp","kind":"life","category":"family-finance","source_hint":"TeamBlind / V2EX / Gallup"}
{"action":"side-project","text":"你接小单前先写清范围，缺钱也不能把自己变成无限服务。","tone":"sharp","kind":"event","category":"side-income-boundary","source_hint":"Indie Hackers / V2EX / TeamBlind"}
{"action":"rest","text":"月底账单没有骂你，但每一项都像在做代码审查。","tone":"wry","kind":"life","category":"finance","source_hint":"36Kr / V2EX / 豆瓣"}
{"action":"interview","text":"你没有只看年包，也看城市、医院、学校和能不能回家吃饭。","tone":"resonant","kind":"event","category":"life-cost","source_hint":"V2EX / TeamBlind / Gallup"}
{"action":"rest","text":"你把预算表做完，发现休息也需要提前预留资源。","tone":"wry","kind":"life","category":"career-break-budget","source_hint":"Hacker News / Reddit / 36Kr"}
{"action":"overtime","text":"你想靠再努力一点解决所有账单，但人不是弹性云主机。","tone":"sharp","kind":"health","category":"finance-stress","source_hint":"Gallup / V2EX / TeamBlind"}
{"action":"rest","text":"你少点了一次外卖，多买了几天菜，生活成本终于可见。","tone":"gentle","kind":"life","category":"daily-budget","source_hint":"豆瓣 / V2EX / 36Kr"}
{"action":"overtime","text":"会议开完一整天，你真正完成的是把自己开空。","tone":"sharp","kind":"health","category":"meeting-fatigue","source_hint":"Microsoft Work Trend Index / GitLab / TeamBlind"}
{"action":"rest","text":"你把通知静音两小时，世界没有崩，心跳先恢复了。","tone":"gentle","kind":"health","category":"notification-boundary","source_hint":"Microsoft Work Trend Index / Buffer / DEV Community"}
{"action":"overtime","text":"群里一句“在吗”，比线上告警更像恐怖片开头。","tone":"wry","kind":"event","category":"notification-anxiety","source_hint":"V2EX / TeamBlind / Microsoft Work Trend Index"}
{"action":"rest","text":"你把待办清单缩到三项，焦虑终于没有全屏显示。","tone":"gentle","kind":"health","category":"mental-load","source_hint":"Hacker News / DEV Community / Gallup"}
{"action":"overtime","text":"你不是没效率，是一天被切换上下文切成了薄片。","tone":"sharp","kind":"event","category":"context-switching","source_hint":"GitLab / Microsoft Work Trend Index / Hacker News"}
{"action":"rest","text":"周日晚上你没有提前打开电脑，至少焦虑少了一次预加载。","tone":"resonant","kind":"health","category":"sunday-scaries","source_hint":"Reddit / Gallup / Hacker News"}
{"action":"networking","text":"你和朋友约定吐槽十分钟就停，不让压力把晚饭也占领。","tone":"gentle","kind":"life","category":"emotional-boundary","source_hint":"Reddit / 豆瓣 / Gallup"}
{"action":"rest","text":"你今天没有证明自己很强，只证明自己需要休息。","tone":"resonant","kind":"health","category":"burnout","source_hint":"Hacker News / Stack Overflow Blog / arXiv"}
{"action":"overtime","text":"你的日历被会议塞满，真正的工作只能在夜里偷渡。","tone":"sharp","kind":"event","category":"meeting-overload","source_hint":"Microsoft Work Trend Index / GitLab / TeamBlind"}
{"action":"rest","text":"你承认最近心情不好，比把所有异常吞掉更像工程实践。","tone":"resonant","kind":"health","category":"mental-health","source_hint":"Gallup / Reddit / DEV Community"}
{"action":"rest","text":"你把脏衣服洗完晾好，成就感朴素得不像互联网。","tone":"gentle","kind":"life","category":"home-routine","source_hint":"豆瓣 / DEV Community / Reddit"}
{"action":"rest","text":"冰箱补满后，你的生活像终于有了本地缓存。","tone":"wry","kind":"life","category":"cooking-grocery","source_hint":"豆瓣 / V2EX / Reddit"}
{"action":"rest","text":"你修好了漏水的水龙头，第一次觉得 debug 不只属于代码。","tone":"resonant","kind":"life","category":"home-maintenance","source_hint":"豆瓣 / Hacker News / DEV Community"}
{"action":"overtime","text":"出租屋乱到找不到充电器，你才发现生活也会积累技术债。","tone":"wry","kind":"life","category":"home-clutter","source_hint":"豆瓣 / V2EX / Buffer"}
{"action":"rest","text":"你周末把地拖了，房间没变大，但人能站稳一点。","tone":"gentle","kind":"life","category":"cleaning","source_hint":"豆瓣 / Reddit / DEV Community"}
{"action":"rest","text":"你买菜时没有看手机，番茄和土豆暂时接管了需求池。","tone":"gentle","kind":"life","category":"grocery","source_hint":"豆瓣 / V2EX / Reddit"}
{"action":"rest","text":"你给家里换了暖光灯，夜晚终于不像还在办公室。","tone":"resonant","kind":"life","category":"home-comfort","source_hint":"Buffer / 豆瓣 / DEV Community"}
{"action":"rest","text":"你把床边的电脑挪走，睡眠区终于不再兼任战情室。","tone":"sharp","kind":"health","category":"sleep-space","source_hint":"Buffer / GitLab / Reddit"}
{"action":"rest","text":"你认真吃完一顿早餐，今天的开局比大多数站会靠谱。","tone":"wry","kind":"health","category":"breakfast","source_hint":"Stack Overflow Blog / V2EX / DEV Community"}
{"action":"rest","text":"普通家务没有成就墙，但它会让明天少一点混乱。","tone":"resonant","kind":"life","category":"daily-maintenance","source_hint":"豆瓣 / Gallup / Reddit"}
{"action":"learn-ai","text":"你学 AI 不是为了变成神，只是想让重复琐事少吃一点人生。","tone":"resonant","kind":"learning","category":"ai-life","source_hint":"Hacker News / Stack Overflow Blog / Microsoft Work Trend Index"}
{"action":"learn-ai","text":"你让 AI 整理购物清单，第一次觉得工具也能服务晚饭。","tone":"gentle","kind":"learning","category":"ai-daily-life","source_hint":"DEV Community / Microsoft Work Trend Index / Reddit"}
{"action":"overtime","text":"公司说 AI 提效，需求也跟着提速，你只想问省下的时间去哪了。","tone":"sharp","kind":"event","category":"ai-workload","source_hint":"Hacker News / TeamBlind / Microsoft Work Trend Index"}
{"action":"learn-ai","text":"你没有收藏第九十九个工具清单，只把一个家务脚本跑通了。","tone":"wry","kind":"learning","category":"ai-practical","source_hint":"DEV Community / Hacker News / Reddit"}
{"action":"rest","text":"学 AI 学到头痛时你去睡觉，模型不会因为你休息就消失。","tone":"gentle","kind":"health","category":"ai-anxiety","source_hint":"Hacker News / Stack Overflow Blog / Reddit"}
{"action":"learn-ai","text":"你把 AI 当副驾驶，不当算命先生，焦虑终于降了点噪。","tone":"resonant","kind":"learning","category":"ai-mindset","source_hint":"Stack Overflow Blog / Hacker News / DEV Community"}
{"action":"side-project","text":"AI 帮你做出原型，你负责判断它是不是又一本正经地胡说。","tone":"wry","kind":"learning","category":"ai-side-project","source_hint":"Indie Hackers / Hacker News / DEV Community"}
{"action":"learn-ai","text":"你用 AI 写周末菜单，比用它幻想改变职业生涯更实在。","tone":"gentle","kind":"learning","category":"ai-daily-life","source_hint":"DEV Community / Reddit / Microsoft Work Trend Index"}
{"action":"interview","text":"面试官问 AI 经验，你讲真实用法，没有把自己包装成研究院。","tone":"resonant","kind":"event","category":"ai-interview","source_hint":"Stack Overflow Blog / Reddit / TeamBlind"}
{"action":"learn-ai","text":"你发现最难的不是提示词，而是知道自己到底想省哪种累。","tone":"sharp","kind":"learning","category":"ai-life-clarity","source_hint":"Hacker News / Microsoft Work Trend Index / GitLab"}
```
