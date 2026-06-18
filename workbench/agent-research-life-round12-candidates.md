# agent-research-life-round12-candidates

来源：从当前 Codex 会话子智能体 completed 通知抽取，候选内容为原创改写，不直接进入正式运行时池。

## 调研来源摘要

- V2EX：下班疲惫、通勤买车、40+家庭状态、企业微信边界、远程边界等讨论。([fast.v2ex.com](https://fast.v2ex.com/t/995322)) ([v2ex.com](https://www.v2ex.com/t/1179133?p=2)) ([v2ex.com](https://www.v2ex.com/t/1054938)) ([fast.v2ex.com](https://fast.v2ex.com/t/1219370))
- Reddit / r/cscareerquestions：爱好运动、通勤、下班仍想项目、稳定工作与倦怠。([reddit.com](https://www.reddit.com/r/cscareerquestions/comments/nan3e1/software_engineers_do_you_get_time_for_pursuing/)) ([reddit.com](https://www.reddit.com/r/cscareerquestions/comments/1kat1oj/whats_it_like_to_work_fully_inperson_as_a/)) ([reddit.com](https://www.reddit.com/r/cscareerquestions/comments/13z661n/as_a_swe_how_to_stop_thinking_about_your_project/)) ([reddit.com](https://www.reddit.com/r/cscareerquestions/comments/1k41ad2/reminder_if_youre_in_a_stable_software/))
- Hacker News：副业是否算休息、倦怠、下班时间分配。([news.ycombinator.com](https://news.ycombinator.com/item?id=21191102))
- Blind：WFH 边界、家庭分工、通勤与家庭时间。([teamblind.com](https://www.teamblind.com/post/has-the-current-wfh-situation-improved-or-worsened-your-wlb-c6kjvnsz)) ([teamblind.com](https://www.teamblind.com/post/household-work-split-for-couples-with-kids-5-yr-old-and-newborn-updated-scroll-to-bottom-for-husbands-perspective-bexgmcqu))
- DEV Community：下班不再写代码、避免周末继续消耗。([dev.to](https://dev.to/codetips/i-don-t-code-outside-of-work-1lk3))
- Indie Hackers：全职工作、家庭、跑步、副业之间的优先级。([indiehackers.com](https://www.indiehackers.com/post/how-do-you-manage-to-work-on-side-projects-and-learn-new-stuff-while-working-full-time-3c9053055c))
- Stack Overflow Blog：开发者 wellness、运动、社交、健康习惯数据。([stackoverflow.blog](https://stackoverflow.blog/2022/05/09/new-data-developers-and-prioritizing-wellness-at-work/))
- arXiv 软件工程生活研究：开发者 vlog、居家办公、夜间/周末工作、well-being 因素。([arxiv.org](https://arxiv.org/abs/2107.07023)) ([arxiv.org](https://arxiv.org/abs/2101.04363)) ([arxiv.org](https://arxiv.org/abs/1802.05084)) ([arxiv.org](https://arxiv.org/html/2504.01787v1))
- 精力不是时间管理问题，而是脑力消耗、睡眠、运动、通勤、会议、屏幕时长叠加后的“电量条”问题。
- 下班边界很高频：关企业微信、固定工位/房间、通勤作为模式切换、WFH 小户型边界崩塌。
- 家庭关系从“陪伴”变成资源调度：带娃、家务、老人、伴侣工作量、周末无法恢复。
- 租房通勤是生活主线变量：离公司近贵，远一点便宜但吞掉精力；买车不一定提升生活质量。
- 副业和 side project 有两种叙事：找回创造欲，或把最后一点休息也变成 KPI。
- 社交边界很真实：同事可以是午饭搭子，也可能是下班消息压力源；孤独和不想社交并存。
- AI/市场变化带来新焦虑：不是单纯“学不学”，而是学完后能否换来安全感。
- “稳定、普通、无聊”在真实社区里经常被重新评价为一种稀缺资产。

## JSONL 候选

```jsonl
{"action":"rest","text":"你把今晚的学习计划删掉了，身体终于像合并通过一样安静下来。","tone":"gentle","kind":"health","category":"health-rest"}
{"action":"rest","text":"连续三天凌晨睡，你的脑子开始把牙刷也识别成待修复 bug。","tone":"wry","kind":"health","category":"sleep"}
{"action":"rest","text":"你准点关电脑，没有成长，但也没有继续透支明天的自己。","tone":"resonant","kind":"health","category":"sleep"}
{"action":"rest","text":"今天没刷题，去楼下走了二十分钟，心率比周报更诚实。","tone":"gentle","kind":"health","category":"exercise"}
{"action":"overtime","text":"加班餐吃完后，你发现真正难消化的不是油，是这个节奏。","tone":"sharp","kind":"health","category":"diet"}
{"action":"rest","text":"你把午休补上了，下午的报错看起来终于不像人身攻击。","tone":"gentle","kind":"health","category":"nap"}
{"action":"rest","text":"健身房只去了半小时，但你的腰椎给了一个无声的好评。","tone":"resonant","kind":"health","category":"exercise"}
{"action":"overtime","text":"你又在工位坐到天黑，椅子比主管更懂你的工伤风险。","tone":"wry","kind":"health","category":"sedentary"}
{"action":"rest","text":"今晚你没有打开新框架教程，眼睛第一次觉得自己被当成人。","tone":"resonant","kind":"health","category":"screen-fatigue"}
{"action":"rest","text":"你喝水、拉伸、早睡，像给老项目加了三行朴素但有用的补丁。","tone":"gentle","kind":"health","category":"routine"}
{"action":"overtime","text":"凌晨的代码能跑，但第二天的你不一定能跑。","tone":"sharp","kind":"health","category":"sleep"}
{"action":"rest","text":"你把周末上午留给睡懒觉，虽然没有产出，却恢复了一点人形。","tone":"wry","kind":"health","category":"weekend"}
{"action":"rest","text":"散步时没听技术播客，只听风声，脑内 CPU 占用终于降下来了。","tone":"gentle","kind":"health","category":"decompression"}
{"action":"rest","text":"你承认自己累了，这比硬撑到崩盘更像一次高级优化。","tone":"resonant","kind":"health","category":"burnout"}
{"action":"overtime","text":"你的黑眼圈已经不需要日报，它自己会同步工作进度。","tone":"wry","kind":"health","category":"sleep-debt"}
{"action":"rest","text":"孩子睡着后你也睡了，没有偷偷开电脑，家庭系统少了一次隐性崩溃。","tone":"gentle","kind":"life","category":"family"}
{"action":"overtime","text":"你错过了晚饭，伴侣没有生气，只是把失望缓存到了下一次争吵。","tone":"sharp","kind":"life","category":"family"}
{"action":"rest","text":"周末带娃比上线还累，但至少这个需求会抱着你笑。","tone":"wry","kind":"life","category":"parenting"}
{"action":"networking","text":"你和伴侣认真分了家务，发现生活里最难维护的是隐形任务列表。","tone":"resonant","kind":"life","category":"family-workload"}
{"action":"rest","text":"今天你没有给家人讲架构，只是一起买菜，关系反而更稳定。","tone":"gentle","kind":"life","category":"family"}
{"action":"overtime","text":"你说只加一小时，家里人已经学会把这句话当预估不准处理。","tone":"wry","kind":"life","category":"family-boundary"}
{"action":"networking","text":"你把工作烦恼倒给伴侣五分钟，然后及时停止，没有把家变成会议室。","tone":"gentle","kind":"life","category":"family-communication"}
{"action":"rest","text":"你陪孩子写作业时没看手机，虽然效率低，但亲密度涨了。","tone":"resonant","kind":"life","category":"parenting"}
{"action":"overtime","text":"父母问你累不累，你说还好，因为解释互联网比加班还费劲。","tone":"wry","kind":"life","category":"family"}
{"action":"rest","text":"你把周日晚上留给家人，没有提前焦虑周一，系统暂时健康。","tone":"gentle","kind":"life","category":"family"}
{"action":"interview","text":"你拒了更高薪但大小周的 offer，家里的晚饭保住了一个座位。","tone":"resonant","kind":"event","category":"family-choice"}
{"action":"overtime","text":"你以为只是在拼事业，家人看到的是你每天都晚一点消失。","tone":"sharp","kind":"life","category":"family-cost"}
{"action":"rest","text":"你没有用副业填满夜晚，伴侣第一次不用预约你的注意力。","tone":"gentle","kind":"life","category":"relationship"}
{"action":"networking","text":"你约老朋友吃饭，聊到最后没人提技术栈，气氛意外地安全。","tone":"resonant","kind":"life","category":"friendship"}
{"action":"rest","text":"家庭不是后台任务，它不会永远安静运行。","tone":"sharp","kind":"life","category":"family"}
{"action":"rest","text":"你搬近了公司，房租涨了，但早上不再像远程调用一样超时。","tone":"resonant","kind":"life","category":"housing"}
{"action":"overtime","text":"通勤一小时后再加班，你感觉自己是在给城市做免费压测。","tone":"wry","kind":"life","category":"commute"}
{"action":"rest","text":"今天坐地铁回家，你终于有二十分钟只属于耳机和自己。","tone":"gentle","kind":"life","category":"commute"}
{"action":"interview","text":"你面试时追问通勤和混合办公，比追问技术栈还认真。","tone":"resonant","kind":"event","category":"commute"}
{"action":"rest","text":"房间小到工位挨着床，梦里都像还没下班。","tone":"wry","kind":"life","category":"housing"}
{"action":"overtime","text":"车位没找到，晚饭凉了，你发现买车也能制造线上事故。","tone":"wry","kind":"life","category":"commute-car"}
{"action":"rest","text":"你把通勤当作关机流程，进家门前先把工作线程停掉。","tone":"gentle","kind":"life","category":"commute-boundary"}
{"action":"interview","text":"新公司工资多三千，但单程多四十分钟，你开始计算人生净利润。","tone":"sharp","kind":"event","category":"commute"}
{"action":"rest","text":"搬家后第一次睡到自然醒，你觉得押一付三也买到了一点命。","tone":"resonant","kind":"life","category":"housing"}
{"action":"overtime","text":"你住得远、睡得晚、吃得急，每天像一条被城市调度的任务队列。","tone":"sharp","kind":"life","category":"city-life"}
{"action":"rest","text":"你没有为了省房租继续硬扛通勤，钱包痛，精神回血。","tone":"gentle","kind":"life","category":"housing"}
{"action":"interview","text":"你问 HR 有没有班车，其实是在问公司知不知道人会累。","tone":"wry","kind":"event","category":"commute"}
{"action":"rest","text":"下雨天打车回家很贵，但比在路上崩溃便宜。","tone":"resonant","kind":"life","category":"commute"}
{"action":"overtime","text":"你在车里堵到怀疑人生，导航只会重算路线，不会重算职业。","tone":"wry","kind":"life","category":"commute-car"}
{"action":"rest","text":"今天你没打开电脑，整理了一下出租屋，像给生活做了一次格式化。","tone":"gentle","kind":"life","category":"housing"}
{"action":"side-project","text":"你给副业定了每周两晚，少一点野心，多一点可持续。","tone":"gentle","kind":"learning","category":"side-project"}
{"action":"side-project","text":"副业需求写到一半，你突然发现甲方竟然是更苛刻的自己。","tone":"wry","kind":"learning","category":"side-project"}
{"action":"rest","text":"你暂停了副项目，没有失败，只是把生活优先级调回正常。","tone":"resonant","kind":"life","category":"side-project"}
{"action":"side-project","text":"今晚只修一个小功能，副业没有起飞，但也没有把你榨干。","tone":"gentle","kind":"learning","category":"side-project"}
{"action":"side-project","text":"你做了一个没人用的小工具，至少它完整听完了你的想法。","tone":"resonant","kind":"learning","category":"creative-hobby"}
{"action":"overtime","text":"主业写 CRUD，副业也写 CRUD，你开始怀疑自由是不是换了个 repo。","tone":"wry","kind":"learning","category":"side-project"}
{"action":"side-project","text":"你把副业从赚钱目标改成作品目标，压力立刻少了一个产品经理。","tone":"gentle","kind":"learning","category":"side-project"}
{"action":"rest","text":"今晚你弹了半小时吉他，虽然没变强，但终于不像一台设备。","tone":"resonant","kind":"life","category":"hobby"}
{"action":"side-project","text":"你没有追热点，只做了自己会用的功能，心里反而踏实。","tone":"gentle","kind":"learning","category":"side-project"}
{"action":"learn-ai","text":"你用 AI 做副业原型，省下的不是时间，是继续试错的勇气。","tone":"resonant","kind":"learning","category":"ai-side-project"}
{"action":"rest","text":"你承认今晚只想打游戏，不把娱乐包装成放松方法论。","tone":"wry","kind":"life","category":"hobby"}
{"action":"side-project","text":"你删掉了副业群里的打卡表，兴趣终于不用装成公司制度。","tone":"sharp","kind":"learning","category":"side-project"}
{"action":"side-project","text":"周末做开源像露营，有人回血，有人被蚊子咬一身包。","tone":"wry","kind":"learning","category":"open-source"}
{"action":"rest","text":"你把电脑合上去拍照，世界没有编译，但光线很好。","tone":"gentle","kind":"life","category":"hobby"}
{"action":"side-project","text":"副业没收入，但你重新记起自己为什么喜欢造东西。","tone":"resonant","kind":"learning","category":"side-project"}
{"action":"networking","text":"你下班关掉企业微信，同事慢慢学会真正急事会打电话。","tone":"resonant","kind":"life","category":"social-boundary"}
{"action":"rest","text":"你把工作 App 移出首页，焦虑少了一次自动刷新入口。","tone":"gentle","kind":"life","category":"phone-boundary"}
{"action":"overtime","text":"老板半夜发消息不一定要回，但你的心跳已经先回了。","tone":"sharp","kind":"health","category":"notification"}
{"action":"networking","text":"午饭固定和一个同事搭伙，孤独没有消失，但有了缓冲区。","tone":"gentle","kind":"life","category":"work-friendship"}
{"action":"rest","text":"远程办公的门关上了，工作还在客厅里阴魂不散。","tone":"wry","kind":"life","category":"remote-boundary"}
{"action":"networking","text":"你拒绝了下班后的临时会，语气礼貌，边界清楚。","tone":"resonant","kind":"event","category":"social-boundary"}
{"action":"rest","text":"你给书桌换了位置，试图让卧室重新像卧室。","tone":"gentle","kind":"life","category":"remote-boundary"}
{"action":"networking","text":"你没有参加每个饭局，社交电量也需要限流。","tone":"wry","kind":"life","category":"social-energy"}
{"action":"overtime","text":"群里一句在吗，比异常告警更像恐怖片开头。","tone":"wry","kind":"event","category":"notification"}
{"action":"networking","text":"你和同事只聊猫、电影和午饭，关系因此更健康。","tone":"gentle","kind":"life","category":"work-friendship"}
{"action":"rest","text":"居家办公省了通勤，也偷走了下班路上那段心理缓冲。","tone":"resonant","kind":"life","category":"remote-work"}
{"action":"networking","text":"你把可联系时间写进状态栏，像给自己加了一层防火墙。","tone":"wry","kind":"life","category":"social-boundary"}
{"action":"rest","text":"你没有在家人面前继续回 Slack，客厅终于不是分公司。","tone":"sharp","kind":"life","category":"remote-boundary"}
{"action":"networking","text":"你主动约人散步，不聊跳槽，只确认彼此还活着。","tone":"resonant","kind":"life","category":"friendship"}
{"action":"rest","text":"今天的勿扰模式救下了一个普通夜晚。","tone":"gentle","kind":"life","category":"notification"}
{"action":"interview","text":"你没有裸辞，先更新简历，成年人连崩溃都要灰度发布。","tone":"wry","kind":"event","category":"career-market"}
{"action":"interview","text":"稳定工作不闪光，但它让你还能睡觉、还房租、看医生。","tone":"resonant","kind":"life","category":"career-stability"}
{"action":"overtime","text":"再拼一个周六不一定升职，但一定会少一个周六。","tone":"sharp","kind":"event","category":"overtime"}
{"action":"interview","text":"你拒绝了画饼，开始问试用期、加班费和团队流失率。","tone":"resonant","kind":"event","category":"interview-boundary"}
{"action":"rest","text":"你请了一天假，没有旅行，只是把自己从工位上解压出来。","tone":"gentle","kind":"health","category":"mental-health"}
{"action":"interview","text":"市场冷的时候，你学会把不跳槽也当成一种主动选择。","tone":"resonant","kind":"event","category":"career-market"}
{"action":"overtime","text":"你把周报写得很燃，身体却在旁边提交了反对意见。","tone":"wry","kind":"health","category":"burnout"}
{"action":"interview","text":"你面完五轮后发现，公司筛的是人，你筛的是余生作息。","tone":"sharp","kind":"event","category":"interview"}
{"action":"rest","text":"你从倦怠里退了一步，没有换行业，只先换回正常作息。","tone":"gentle","kind":"health","category":"burnout"}
{"action":"interview","text":"高薪 offer 像新框架，文档漂亮，坑要上线后才知道。","tone":"wry","kind":"event","category":"job-choice"}
{"action":"overtime","text":"项目延期了，只有你的疲惫按期交付。","tone":"sharp","kind":"event","category":"overtime"}
{"action":"interview","text":"你开始珍惜那个普通岗位：不传奇，但不每天消耗你。","tone":"resonant","kind":"life","category":"career-stability"}
{"action":"rest","text":"离职念头最强的时候，你先去睡了一觉，醒来再做决定。","tone":"gentle","kind":"health","category":"burnout"}
{"action":"interview","text":"你没被大厂光环冲昏头，先算了通勤、加班和胃药钱。","tone":"wry","kind":"event","category":"job-choice"}
{"action":"overtime","text":"你说年轻能扛，身体没有签过这份协议。","tone":"sharp","kind":"health","category":"overtime"}
{"action":"learn-ai","text":"你学 AI 不是为了变神，只是希望下次别被浪潮直接拍倒。","tone":"resonant","kind":"learning","category":"ai-learning"}
{"action":"learn-ai","text":"今晚你只让 AI 帮你整理笔记，没有追求一夜重构人生。","tone":"gentle","kind":"learning","category":"ai-learning"}
{"action":"learn-ai","text":"群里都在喊替代，你先把提示词写清楚，焦虑减半。","tone":"wry","kind":"learning","category":"ai-anxiety"}
{"action":"side-project","text":"你用 AI 做了个小插件，第一次觉得副业门槛没那么高。","tone":"resonant","kind":"learning","category":"ai-side-project"}
{"action":"learn-ai","text":"你没有收藏第八十篇 AI 清单，而是真正跑通了一个例子。","tone":"sharp","kind":"learning","category":"ai-learning"}
{"action":"rest","text":"学 AI 学到头痛时，你关机睡觉，模型不会因为你休息而消失。","tone":"gentle","kind":"health","category":"ai-learning"}
{"action":"learn-ai","text":"你把 AI 当工具，不当神谕，心态稳定了很多。","tone":"resonant","kind":"learning","category":"ai-learning"}
{"action":"interview","text":"面试官问 AI 经验，你讲了真实用法，没有假装自己是研究员。","tone":"gentle","kind":"event","category":"ai-interview"}
{"action":"learn-ai","text":"你发现真正难的不是调用模型，是知道自己要解决什么。","tone":"sharp","kind":"learning","category":"ai-learning"}
{"action":"side-project","text":"AI 帮你生成了原型，你负责判断它是不是在胡说。","tone":"wry","kind":"learning","category":"ai-side-project"}
{"action":"learn-ai","text":"你把每天学 AI 控制在四十分钟，长期主义终于不是熬夜主义。","tone":"gentle","kind":"learning","category":"ai-learning"}
{"action":"interview","text":"你没有为了 AI 岗位硬编经历，简历少了水分，多了底气。","tone":"resonant","kind":"event","category":"ai-interview"}
{"action":"learn-ai","text":"你学会让 AI 处理琐碎，省下的精力拿去运动和做饭。","tone":"gentle","kind":"learning","category":"ai-life"}
{"action":"overtime","text":"公司说 AI 提效，最后提出来的是更多需求。","tone":"sharp","kind":"event","category":"ai-workload"}
{"action":"learn-ai","text":"你没有把每次行业变化都当末日，先给自己建一个可迁移技能包。","tone":"resonant","kind":"learning","category":"ai-learning"}
{"action":"rest","text":"你算完房贷和房租，决定今晚不再打开购物软件。","tone":"wry","kind":"life","category":"finance"}
{"action":"side-project","text":"你接了个小单，但先写清范围，穷也不能无限返工。","tone":"sharp","kind":"event","category":"side-income"}
{"action":"interview","text":"你考虑回二线，不是认输，是把生活成本纳入架构设计。","tone":"resonant","kind":"life","category":"relocation"}
{"action":"rest","text":"裸辞预算表做好后，你发现休息也需要需求评审。","tone":"wry","kind":"life","category":"career-break"}
{"action":"side-project","text":"你下班跑单补贴家用，辛苦是真的，羞耻不该属于你。","tone":"resonant","kind":"life","category":"side-income"}
{"action":"interview","text":"你没有只看年包，开始看城市、房租、医疗和家人的距离。","tone":"gentle","kind":"event","category":"relocation"}
{"action":"rest","text":"你把存款目标调低一点，焦虑没有消失，但终于能呼吸。","tone":"gentle","kind":"life","category":"finance"}
{"action":"overtime","text":"副业、房贷、孩子、父母一起排队，你的时间片被抢占到发烫。","tone":"sharp","kind":"life","category":"family-finance"}
{"action":"interview","text":"你问自己要不要继续留一线，答案不在工资里，也在晚饭后。","tone":"resonant","kind":"life","category":"city-choice"}
{"action":"rest","text":"你没买新设备，把钱留作缓冲，安全感比跑分更有用。","tone":"gentle","kind":"life","category":"finance"}
{"action":"side-project","text":"你不再幻想副业一夜翻身，只把它当第二条细细的绳子。","tone":"resonant","kind":"learning","category":"side-income"}
{"action":"interview","text":"你发现小城市机会少，但晚上七点的天还亮着。","tone":"wry","kind":"life","category":"city-choice"}
{"action":"rest","text":"你计划休息半年，却先把社保、房租和找工窗口排清楚。","tone":"gentle","kind":"event","category":"career-break"}
{"action":"overtime","text":"你想靠再努力一点解决所有账单，但人不是无限扩容的服务器。","tone":"sharp","kind":"health","category":"finance-stress"}
{"action":"interview","text":"你没有逃离程序员，只是在给生活寻找一个更低延迟的部署环境。","tone":"resonant","kind":"life","category":"life-reset"}
```
