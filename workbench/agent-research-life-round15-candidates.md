# agent-research-life-round15-candidates

调研子智能体 A 产出。目标是为“程序员生存模拟器”补充程序员生活方式、家庭关系、健康底线、城市选择、经济压力、远程边界和普通稳定生活方向的弹窗候选。本文件仅作为 `workbench` 候选材料，不进入正式数据池，不修改 HTML；候选均为原创改写，不复制原帖原文。

## 来源列表

- V2EX：远程办公接受度与孤独感讨论，https://www.v2ex.com/t/568093
- V2EX：程序员通勤与生活质量经验帖，https://staging.v2ex.com/t/660141
- V2EX：二线城市定居发展讨论，https://www.v2ex.com/t/1161661
- V2EX：程序员职业病、体检、久坐和运动讨论，https://www.v2ex.com/t/887533
- V2EX：远程工作者的一天，https://www.v2ex.com/t/572394
- V2EX：一线回二线与成都生活经验，https://www.v2ex.com/t/905294
- Reddit / r/ExperiencedDevs：家庭、边界、通勤、远程、稳定岗位与倦怠经验帖，https://www.reddit.com/r/ExperiencedDevs/
- Reddit / r/cscareerquestions：远程薪资、城市成本、搬迁和职业选择讨论，https://www.reddit.com/r/cscareerquestions/
- Hacker News / Ask HN：developer burnout、work-life balance、remote loneliness、family and city cost 讨论，https://news.ycombinator.com/
- Buffer State of Remote Work：远程办公孤独、无法断开、边界与居家频率报告，https://buffer.com/state-of-remote-work/2023
- Stack Overflow Developer Survey 2025：开发者远程比例、工作满意度和职业状态数据，https://survey.stackoverflow.co/2025
- Stanford SIEPR / G-SWA：2025 居家办公、家庭、地区差异与 WFH 稳定化研究，https://siepr.stanford.edu/publications/essay/working-home-2025-five-key-facts
- Microsoft Work Trend Index：数字负荷、会议疲劳、混合办公和工作边界报告，https://www.microsoft.com/en-us/worklab/work-trend-index
- GitLab Remote Work Handbook / Report：异步协作、文档化、远程团队边界和连接方式，https://handbook.gitlab.com/handbook/company/culture/all-remote/
- Gallup Workplace / Wellbeing：混合办公、倦怠、员工幸福感和工作连接研究，https://www.gallup.com/workplace/
- Owl Labs State of Remote Work：远程/混合办公偏好、通勤、协作与办公形态趋势，https://resources.owllabs.com/state-of-remote-work

## 主题簇

- 通勤与居住：通勤长度、租房位置、城市成本、搬家选择和下班缓冲。
- 远程边界：家变办公室、通知压力、异步沟通、离线仪式和孤独感。
- 家庭关系：伴侣、孩子、父母、异地、家务和情绪回家问题。
- 健康底线：睡眠、体检、久坐、运动、饮食和心理恢复。
- 普通稳定生活：不神化大厂、不把人生设成冲刺、稳定岗位和慢变量。
- 城市选择：一线/二线、房租、医院、学校、产业机会和生活半径。
- 经济压力：房贷、房租、储蓄、父母孩子、休息预算和副业边界。
- 远程社交：午饭搭子、线上头像、线下连接、弱关系维护和第三空间。
- 工作边界：会议、即时消息、夜间响应、绩效焦虑和可拒绝性。
- 爱好与副业：副项目、开源、运动、音乐、游戏和不 KPI 化的恢复。
- 中年与长期主义：年龄、照护、职业身份、技能焦虑和生活维护。
- 小日常：买菜、做饭、洗衣、打扫、修东西、晒太阳和生活掌控感。

## 120 条 JSONL 候选

```jsonl
{"action":"rest","text":"你把租房半径缩小到骑车十五分钟，钱包疼了一点，早晨终于不用开局打团。","tone":"resonant","kind":"life","category":"commute-housing","source_hint":"V2EX 通勤帖 / Reddit ExperiencedDevs"}
{"action":"interview","text":"新公司年包更高，但地图显示每天多消失九十分钟，你开始把时间也算进报价单。","tone":"sharp","kind":"event","category":"job-choice-commute","source_hint":"V2EX / Reddit cscareerquestions"}
{"action":"rest","text":"地铁上的你没有学习算法，只扶着栏杆放空，像给脑子做一次冷启动。","tone":"gentle","kind":"life","category":"commute-decompression","source_hint":"V2EX 通勤帖 / Hacker News work-life balance"}
{"action":"overtime","text":"末班公交把你送到小区门口，真正的下班还卡在心里的闸机里。","tone":"resonant","kind":"life","category":"late-commute","source_hint":"V2EX / HN burnout"}
{"action":"rest","text":"你发现短通勤不是福利，是每天给生活多留一小段可写空间。","tone":"resonant","kind":"life","category":"commute","source_hint":"V2EX 通勤帖 / Buffer Remote Work"}
{"action":"interview","text":"面试官介绍免费晚餐，你追问离家多远，成熟得像个生活架构师。","tone":"wry","kind":"event","category":"commute-boundary","source_hint":"TeamBlind 线索 / Reddit / V2EX"}
{"action":"rest","text":"雨天打车很贵，但你没有把湿鞋、堵车和怨气一起带回家。","tone":"gentle","kind":"life","category":"commute-stress","source_hint":"V2EX / Gallup wellbeing"}
{"action":"overtime","text":"你把通勤播客调成白噪音，今天不想继续把自己优化成工具。","tone":"sharp","kind":"life","category":"commute-recovery","source_hint":"HN work-life balance / DEV 线索"}
{"action":"rest","text":"搬近公司后，你第一次在天亮时买早餐，而不是在路上吞下焦虑。","tone":"resonant","kind":"life","category":"housing","source_hint":"V2EX 通勤帖 / Reddit"}
{"action":"interview","text":"你拒绝了跨城混合岗，因为酒店、机票和空掉的周末不会写进 offer。","tone":"sharp","kind":"event","category":"super-commute","source_hint":"Reddit ExperiencedDevs super commuting"}
{"action":"rest","text":"远程办公省了通勤，也把工位偷偷塞进了你的卧室。","tone":"resonant","kind":"life","category":"remote-boundary","source_hint":"Buffer State of Remote Work / V2EX 远程"}
{"action":"overtime","text":"消息软件常亮的时候，客厅像被公司临时征用。","tone":"sharp","kind":"life","category":"remote-notification","source_hint":"Microsoft Work Trend Index / Buffer"}
{"action":"rest","text":"你给下班设置了关灯动作，幼稚但有用，至少身体知道今天结束了。","tone":"gentle","kind":"life","category":"remote-ritual","source_hint":"GitLab All-Remote / Buffer"}
{"action":"networking","text":"远程周会里大家都在点头，你突然怀念办公室里无意义但真实的闲聊。","tone":"resonant","kind":"life","category":"remote-loneliness","source_hint":"Buffer / HN remote loneliness / V2EX"}
{"action":"rest","text":"你午休下楼晒太阳十分钟，像给居家办公补了一条网线之外的连接。","tone":"gentle","kind":"health","category":"remote-health","source_hint":"Buffer / Gallup / PMC loneliness"}
{"action":"overtime","text":"家人以为你在家很好叫，团队以为你在线很好用。","tone":"sharp","kind":"life","category":"remote-family-boundary","source_hint":"Reddit ExperiencedDevs / Buffer"}
{"action":"networking","text":"你和同事约了非工作咖啡，不同步需求，只确认彼此还像人。","tone":"gentle","kind":"life","category":"remote-social","source_hint":"GitLab All-Remote / Buffer"}
{"action":"rest","text":"远程第三周，你开始给自己安排出门理由，免得一天只在椅子和冰箱之间迁移。","tone":"wry","kind":"life","category":"remote-routine","source_hint":"Buffer State of Remote Work"}
{"action":"overtime","text":"异步消息本该减少打扰，结果你把全天都活成了待回复状态。","tone":"sharp","kind":"event","category":"async-pressure","source_hint":"GitLab / Microsoft Work Trend Index"}
{"action":"rest","text":"你把办公桌移出卧室，睡眠没有立刻变好，但战场终于撤了一半。","tone":"resonant","kind":"health","category":"remote-space","source_hint":"Buffer / Reddit remote boundaries"}
{"action":"networking","text":"孩子把积木递给你时，你第一次把这件事排在紧急且重要。","tone":"resonant","kind":"life","category":"parenting","source_hint":"Reddit family WLB / HN parenthood"}
{"action":"rest","text":"你陪伴侣散步二十分钟，没有解决房贷，但修复了一点连接。","tone":"gentle","kind":"life","category":"relationship","source_hint":"Reddit / HN work-life balance"}
{"action":"overtime","text":"你说再等五分钟，家里人已经听出这是一个没有 SLA 的接口。","tone":"wry","kind":"life","category":"family-boundary","source_hint":"V2EX / Reddit boundaries"}
{"action":"rest","text":"父母问你是不是很忙，你说还好，省下了解释行业周期的力气。","tone":"wry","kind":"life","category":"parents","source_hint":"V2EX 中年困境 / HN burnout"}
{"action":"networking","text":"你们把家务写成清单后，才发现谁都不是自动运行的后台服务。","tone":"resonant","kind":"life","category":"household-work","source_hint":"Reddit family WLB / Gallup wellbeing"}
{"action":"interview","text":"你没有接高压岗位，因为伴侣的晚饭和孩子的睡前故事也需要排期。","tone":"resonant","kind":"event","category":"family-job-choice","source_hint":"HN parenthood / Reddit ExperiencedDevs"}
{"action":"overtime","text":"坏情绪没有留在公司，它跟着你进门，把沙发也变成事故现场。","tone":"sharp","kind":"life","category":"family-emotion","source_hint":"Reddit boundaries / HN burnout"}
{"action":"rest","text":"异地周末见一次，车票不贵，贵的是每次离开都要重新编译心情。","tone":"resonant","kind":"life","category":"long-distance-relationship","source_hint":"V2EX 异地关系帖"}
{"action":"networking","text":"你和家人约定饭桌不看工单，晚饭终于不像线上事故复盘。","tone":"gentle","kind":"life","category":"family-boundary","source_hint":"Reddit / HN work-life balance"}
{"action":"rest","text":"家不是缓冲区，不能长期接收你从工作溢出的所有异常。","tone":"sharp","kind":"life","category":"family-maintenance","source_hint":"Reddit ExperiencedDevs / Gallup"}
{"action":"rest","text":"体检报告像一份没人想看的运行日志，但它比绩效更诚实。","tone":"resonant","kind":"health","category":"medical-check","source_hint":"V2EX 职业病 / V2EX 健康帖"}
{"action":"overtime","text":"凌晨提交很有成就感，第二天你的身体用低电量模式收费。","tone":"sharp","kind":"health","category":"sleep-debt","source_hint":"HN burnout / Stack Overflow Survey"}
{"action":"rest","text":"你站起来拉伸两分钟，腰椎没有鼓掌，但至少停止了抗议。","tone":"wry","kind":"health","category":"sedentary","source_hint":"V2EX 职业病 / V2EX 手环提醒"}
{"action":"rest","text":"今晚早睡不是自律表演，是给明天保留一点可用算力。","tone":"gentle","kind":"health","category":"sleep","source_hint":"HN burnout / Gallup wellbeing"}
{"action":"overtime","text":"你把晚饭推迟到十点，胃比项目经理更早提出变更请求。","tone":"sharp","kind":"health","category":"diet","source_hint":"V2EX 健康 / Stack Overflow Blog 线索"}
{"action":"rest","text":"下楼走路半小时没有改变人生，但把肩颈从红色告警拉回黄色。","tone":"gentle","kind":"health","category":"walking","source_hint":"V2EX 骑行反馈 / Gallup"}
{"action":"rest","text":"你开始记录睡眠，不是为了打卡，是为了别把命交给咖啡兜底。","tone":"resonant","kind":"health","category":"sleep-routine","source_hint":"HN burnout / Microsoft digital overload"}
{"action":"overtime","text":"久坐提醒响了三次你都忽略，身体把这段代码记成技术债。","tone":"wry","kind":"health","category":"sedentary","source_hint":"V2EX 智能穿戴 / V2EX 职业病"}
{"action":"rest","text":"你骑了十公里，没燃烧梦想，只燃烧了一点长期堆积的班味。","tone":"wry","kind":"health","category":"cycling","source_hint":"V2EX 轻骑行反馈"}
{"action":"rest","text":"你承认最近需要休息，比继续假装高可用更专业。","tone":"resonant","kind":"health","category":"burnout","source_hint":"HN burnout / Gallup wellbeing"}
{"action":"interview","text":"你没有追那个头衔，因为当前岗位能按时下班，也是一种稀缺资源。","tone":"resonant","kind":"event","category":"stable-life","source_hint":"Reddit stable careers / Stack Overflow Survey"}
{"action":"rest","text":"普通稳定的工作不发光，但它让房租、体检和晚饭都不掉线。","tone":"resonant","kind":"life","category":"ordinary-stability","source_hint":"HN working day / Gallup"}
{"action":"overtime","text":"你以为再冲一年就自由，可冲刺模式已经自动续费了很多次。","tone":"sharp","kind":"life","category":"career-grind","source_hint":"HN burnout / Reddit boundaries"}
{"action":"rest","text":"你把人生 KPI 改成持续可维护，突然少了很多假想敌。","tone":"gentle","kind":"life","category":"ordinary-life","source_hint":"HN work-life balance / Reddit"}
{"action":"interview","text":"你问团队晚上几点还在线，不是矫情，是在看未来自己会不会消失。","tone":"sharp","kind":"event","category":"interview-boundary","source_hint":"Reddit boundaries / TeamBlind 线索"}
{"action":"rest","text":"稳定不是不进步，有时只是拒绝把每个季度都活成淘汰赛。","tone":"resonant","kind":"life","category":"stable-life","source_hint":"Reddit stable alternate jobs / HN"}
{"action":"overtime","text":"公司把愿景讲得很大，你只想确认周末是不是还属于自己。","tone":"wry","kind":"event","category":"work-boundary","source_hint":"HN / Reddit WLB"}
{"action":"rest","text":"你没有成为传奇工程师，但今天按时吃饭、散步、睡觉，版本很稳。","tone":"gentle","kind":"life","category":"ordinary-life","source_hint":"Stack Overflow Survey / Gallup"}
{"action":"interview","text":"你开始重视老板是否靠谱，超过重视技术栈是否时髦。","tone":"resonant","kind":"event","category":"career-stability","source_hint":"Reddit ExperiencedDevs / HN"}
{"action":"rest","text":"你承认自己想要普通生活，这个需求终于从 backlog 里被拖出来。","tone":"resonant","kind":"life","category":"stable-life","source_hint":"HN life work / Reddit"}
{"action":"interview","text":"你比较城市时，不只看薪资，也看医院、学校、通勤和下班后有没有人味。","tone":"resonant","kind":"event","category":"city-choice","source_hint":"V2EX 二线城市 / Reddit city COL"}
{"action":"rest","text":"回二线不是降级，是把房租和睡眠重新纳入系统设计。","tone":"sharp","kind":"life","category":"city-choice","source_hint":"V2EX 成都经验 / V2EX 二线城市"}
{"action":"interview","text":"远程岗位让你能住便宜城市，但你也开始担心下一份工作还给不给这张牌。","tone":"resonant","kind":"event","category":"remote-city-risk","source_hint":"Reddit Midwest / Stanford WFH"}
{"action":"rest","text":"你在候选城市看菜市场和公园，比看网红榜更接近真实生活。","tone":"gentle","kind":"life","category":"city-daily-life","source_hint":"V2EX 二线城市 / HN family city"}
{"action":"overtime","text":"一线城市机会多，代价也多，连喘气都像按商圈计费。","tone":"sharp","kind":"life","category":"city-pressure","source_hint":"V2EX 北上广 / HN SF family"}
{"action":"interview","text":"你没有被高薪城市冲昏头，先算儿童托管、租金和两边父母的距离。","tone":"resonant","kind":"event","category":"family-city-choice","source_hint":"HN SF family / Reddit city COL"}
{"action":"rest","text":"城市选择不是地图题，是你愿意把哪种生活问题每天重复一次。","tone":"sharp","kind":"life","category":"city-choice","source_hint":"V2EX / Reddit"}
{"action":"interview","text":"你问二线岗位密度，不是悲观，是知道生活节奏慢不等于机会自动多。","tone":"wry","kind":"event","category":"city-career-risk","source_hint":"V2EX 二线城市讨论"}
{"action":"rest","text":"你住得离父母近了，周末多了饭菜，也多了需要认真处理的关系。","tone":"resonant","kind":"life","category":"family-city","source_hint":"V2EX 回乡 / Reddit family"}
{"action":"interview","text":"你决定先试住半年，不把城市想象直接合并到人生主分支。","tone":"gentle","kind":"event","category":"city-trial","source_hint":"V2EX 城市选择 / Reddit"}
{"action":"rest","text":"房租扣款那天，你理解了为什么稳定现金流会让人心情平稳。","tone":"resonant","kind":"life","category":"finance-rent","source_hint":"V2EX 城市成本 / Gallup"}
{"action":"overtime","text":"房贷、父母体检、孩子学费一起排队，你的工资条像被多线程抢占。","tone":"sharp","kind":"life","category":"family-finance","source_hint":"HN SF family / Reddit"}
{"action":"side-project","text":"你接私活前先写边界，缺钱也不能把晚上卖成无限包月。","tone":"sharp","kind":"event","category":"side-income-boundary","source_hint":"V2EX 自由职业 / Indie Hackers 线索"}
{"action":"rest","text":"你把应急金存够三个月，焦虑没有消失，但终于不敢随便吓你。","tone":"gentle","kind":"life","category":"finance-buffer","source_hint":"HN surviving job / Reddit stability"}
{"action":"interview","text":"涨薪机会很诱人，可你开始计算它会不会顺手买走睡眠和家庭时间。","tone":"resonant","kind":"event","category":"money-vs-life","source_hint":"Reddit floor to move / HN WLB"}
{"action":"overtime","text":"你想用再努力一点解决所有账单，但人不是可以横向扩容的云资源。","tone":"sharp","kind":"health","category":"finance-stress","source_hint":"Gallup wellbeing / Reddit"}
{"action":"rest","text":"你少买一个电子设备，把钱留给体检和休假，安全感跑分更高。","tone":"gentle","kind":"life","category":"finance-priority","source_hint":"HN / V2EX"}
{"action":"interview","text":"你拒绝只看年包，因为账单用现金结算，生活用时间结算。","tone":"sharp","kind":"event","category":"compensation-tradeoff","source_hint":"Reddit cscareerquestions / HN"}
{"action":"rest","text":"预算表告诉你，休息不是奢侈品，也需要提前占坑。","tone":"wry","kind":"life","category":"rest-budget","source_hint":"HN surviving job / Gallup"}
{"action":"side-project","text":"副业没让你暴富，但让你明白自由职业也有客服、催款和边界。","tone":"resonant","kind":"learning","category":"freelance-reality","source_hint":"V2EX 自由职业 B 计划"}
{"action":"networking","text":"远程团队的闲聊频道很小，但比一整天只和工单说话好。","tone":"gentle","kind":"life","category":"remote-social","source_hint":"GitLab All-Remote / Buffer"}
{"action":"rest","text":"你固定每周见一次朋友，不谈绩效，像给生活补一个外部依赖。","tone":"resonant","kind":"life","category":"friendship","source_hint":"HN loneliness / Gallup"}
{"action":"networking","text":"午饭搭子不负责拯救你，但能让工作日不完全像单机模式。","tone":"wry","kind":"life","category":"work-friendship","source_hint":"Reddit / Buffer"}
{"action":"rest","text":"你去咖啡馆坐了一小时，效率一般，但终于听见了除通知以外的声音。","tone":"gentle","kind":"life","category":"third-place","source_hint":"Buffer / HN remote loneliness"}
{"action":"networking","text":"线上头像再熟，也替代不了有人把水杯放在你旁边的真实感。","tone":"resonant","kind":"life","category":"remote-connection","source_hint":"HN remote loneliness / V2EX 远程"}
{"action":"rest","text":"你承认自己孤独，不是失败，只是连接池长期太小。","tone":"resonant","kind":"life","category":"loneliness","source_hint":"Buffer / PMC loneliness / HN"}
{"action":"networking","text":"你没有参加所有团建，社交电量也需要熔断保护。","tone":"wry","kind":"life","category":"social-energy","source_hint":"Reddit / Gallup"}
{"action":"rest","text":"你给老朋友发消息，对方隔天才回，但线路还通就够了。","tone":"gentle","kind":"life","category":"friendship-maintenance","source_hint":"HN loneliness / Reddit"}
{"action":"networking","text":"运动搭子把你从书桌前叫走，比再收藏一个健康教程有效。","tone":"gentle","kind":"health","category":"exercise-social","source_hint":"V2EX 健康 / Reddit"}
{"action":"rest","text":"办公室的小废话有时很烦，有时也是防止人变成接口的缓冲层。","tone":"resonant","kind":"life","category":"office-small-talk","source_hint":"HN remote / WSJ remote happiness 线索"}
{"action":"overtime","text":"一天七个会后，你没有产出文档，只产出一副空壳。","tone":"sharp","kind":"event","category":"meeting-fatigue","source_hint":"Microsoft Work Trend Index / GitLab"}
{"action":"rest","text":"你把通知静音两小时，世界没有崩，倒是心跳先恢复服务。","tone":"gentle","kind":"health","category":"notification-boundary","source_hint":"Microsoft Work Trend Index / Buffer"}
{"action":"overtime","text":"群里一句在吗，让你的晚饭瞬间变成待处理事务。","tone":"wry","kind":"event","category":"notification-anxiety","source_hint":"V2EX / Microsoft digital overload"}
{"action":"interview","text":"你问值班频率，不是怕苦，是怕生活长期被随机中断。","tone":"sharp","kind":"event","category":"oncall-boundary","source_hint":"Reddit boundaries / HN"}
{"action":"rest","text":"你把待办缩成三件事，焦虑终于不能再冒充项目经理。","tone":"gentle","kind":"health","category":"mental-load","source_hint":"HN burnout / Gallup"}
{"action":"overtime","text":"你不是不专注，是一整天被消息切成了太多小碎片。","tone":"sharp","kind":"event","category":"context-switching","source_hint":"Microsoft Work Trend Index / GitLab"}
{"action":"rest","text":"周日晚上你没有提前开电脑，至少不给焦虑预热。","tone":"resonant","kind":"health","category":"sunday-scaries","source_hint":"HN burnout / Gallup"}
{"action":"interview","text":"你在 offer 里找不到边界条款，只能从面试官的眼神里猜晚上几点下班。","tone":"wry","kind":"event","category":"work-boundary","source_hint":"Reddit / TeamBlind 线索"}
{"action":"overtime","text":"老板说大家灵活一点，最后灵活的总是你的休息时间。","tone":"sharp","kind":"event","category":"boundary-abuse","source_hint":"Reddit boundaries / HN"}
{"action":"rest","text":"你学会说今天不行，职业没有立刻坍塌，边界倒是站稳了。","tone":"resonant","kind":"life","category":"saying-no","source_hint":"Reddit boundaries"}
{"action":"side-project","text":"你把副项目限定成每周两晚，野心被削小后，生命值反而更高。","tone":"gentle","kind":"learning","category":"side-project-sustainable","source_hint":"Indie Hackers / HN side projects"}
{"action":"rest","text":"今晚打游戏没有内疚，娱乐终于不用伪装成技能提升。","tone":"wry","kind":"life","category":"hobby","source_hint":"Reddit WLB / HN hobbies"}
{"action":"side-project","text":"开源 issue 堆着没有清零，但你先把自己从维护者幻觉里放出来。","tone":"resonant","kind":"learning","category":"open-source-boundary","source_hint":"HN burnout / DEV 线索"}
{"action":"rest","text":"你重新弹了十分钟吉他，手指很生，心情倒是很快上线。","tone":"gentle","kind":"life","category":"hobby-recovery","source_hint":"HN hobbies / Reddit"}
{"action":"overtime","text":"主业冲刺，副业也冲刺，你终于发现自由不能靠两个老板实现。","tone":"sharp","kind":"learning","category":"side-project-burnout","source_hint":"Indie Hackers / HN"}
{"action":"side-project","text":"你把副业目标从改变世界改成跑通收款，项目突然诚实了很多。","tone":"wry","kind":"learning","category":"side-project-scope","source_hint":"V2EX 自由职业 / Indie Hackers"}
{"action":"rest","text":"周末拍了几张街景，没有产出内容，只把自己从屏幕里领出来。","tone":"gentle","kind":"life","category":"hobby-photography","source_hint":"HN hobbies / Reddit"}
{"action":"side-project","text":"你没有学习第十个框架，只修好了家里的小脚本，快乐更具体。","tone":"resonant","kind":"learning","category":"practical-automation","source_hint":"DEV 线索 / HN"}
{"action":"rest","text":"你把爱好从任务列表里移除，它终于重新像爱好。","tone":"sharp","kind":"life","category":"hobby-boundary","source_hint":"HN burnout / Reddit"}
{"action":"side-project","text":"你决定暂停一个月副项目，不是失败，是给主进程留内存。","tone":"resonant","kind":"learning","category":"side-project-rest","source_hint":"HN burnout / Indie Hackers"}
{"action":"rest","text":"三十五岁焦虑又来敲门，你先去体检，而不是先改简历。","tone":"resonant","kind":"health","category":"midlife-health","source_hint":"V2EX 中年困境 / HN 40"}
{"action":"interview","text":"你发现职级不是唯一进度条，父母健康、睡眠质量和伴侣关系也在计数。","tone":"sharp","kind":"event","category":"life-metrics","source_hint":"HN family / Gallup"}
{"action":"overtime","text":"行业新闻每天都像告警，你终于给信息流设置了维护窗口。","tone":"wry","kind":"health","category":"industry-anxiety","source_hint":"HN programmer identity / Stack Overflow Survey"}
{"action":"rest","text":"你不再把程序员当全部身份，生活里终于多了几个备用域名。","tone":"resonant","kind":"life","category":"identity","source_hint":"HN programmer identity"}
{"action":"interview","text":"你没有为了证明还能卷而换岗，年龄让你更清楚什么代价不能外包。","tone":"sharp","kind":"event","category":"midlife-career","source_hint":"V2EX 中年 / Reddit stability"}
{"action":"rest","text":"照顾父母那周，你发现最难排期的需求都不在 Jira 里。","tone":"resonant","kind":"life","category":"caregiving","source_hint":"HN layoff caregiving / Reddit family"}
{"action":"overtime","text":"你把健康押给未来，未来没有签过这份延期协议。","tone":"sharp","kind":"health","category":"health-debt","source_hint":"HN burnout / V2EX 健康"}
{"action":"rest","text":"你接受自己只是普通工程师后，反而能认真过普通日子。","tone":"gentle","kind":"life","category":"ordinary-identity","source_hint":"HN life work / Reddit"}
{"action":"interview","text":"你问公司是否尊重假期，因为中年人的恢复时间越来越不能靠意志硬扛。","tone":"resonant","kind":"event","category":"vacation-boundary","source_hint":"HN burnout / Gallup"}
{"action":"rest","text":"你给人生留了冗余，不把每个晚上都卖给不确定的明天。","tone":"resonant","kind":"life","category":"long-termism","source_hint":"HN work-life balance / Reddit"}
{"action":"rest","text":"你把冰箱补满，生活像终于有了几天本地缓存。","tone":"wry","kind":"life","category":"grocery","source_hint":"V2EX 生活 / Reddit"}
{"action":"rest","text":"今天自己做饭，味道一般，但你终于不是由外卖平台驱动。","tone":"gentle","kind":"life","category":"cooking","source_hint":"V2EX / Gallup wellbeing"}
{"action":"rest","text":"洗衣机转起来的时候，你感觉生活也在跑一个安静的后台任务。","tone":"gentle","kind":"life","category":"home-routine","source_hint":"Reddit / HN life admin"}
{"action":"overtime","text":"出租屋乱到找不到鼠标，生活技术债已经影响生产环境。","tone":"wry","kind":"life","category":"home-clutter","source_hint":"V2EX / Buffer"}
{"action":"rest","text":"你拖完地，房间没有变大，但心里少了一点噪声。","tone":"gentle","kind":"life","category":"cleaning","source_hint":"Gallup wellbeing / Reddit"}
{"action":"rest","text":"你修好一盏灯，发现 debug 生活比 debug 代码更有即时反馈。","tone":"resonant","kind":"life","category":"home-maintenance","source_hint":"HN hobbies / Reddit"}
{"action":"rest","text":"早餐按时吃完，今天的启动流程比大多数站会可靠。","tone":"wry","kind":"health","category":"breakfast","source_hint":"V2EX 健康 / Stack Overflow Blog 线索"}
{"action":"rest","text":"你买菜时没有看手机，番茄和青菜短暂接管了需求池。","tone":"gentle","kind":"life","category":"grocery","source_hint":"V2EX / Reddit"}
{"action":"rest","text":"你把暖光灯打开，夜晚终于不像公司会议室的分支。","tone":"resonant","kind":"life","category":"home-comfort","source_hint":"Buffer remote space / GitLab"}
{"action":"rest","text":"普通家务没有里程碑，但它让明天少一点崩溃现场。","tone":"resonant","kind":"life","category":"daily-maintenance","source_hint":"HN life admin / Gallup"}
```
