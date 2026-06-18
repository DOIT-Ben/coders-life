# 程序员生存模拟器 round18 生活共鸣弹窗候选

研究子智能体：A
生成时间：2026-06-18
写入范围：仅本文件；未修改正式数据池、HTML、tools、data、graphify。
生成原则：基于公开社区、博客、问答与报告线索做原创中文改写，不复制原文；聚焦生活、关系、健康、家庭、消费、通勤和中年压力，作为 round18 life 候选素材。

## 来源列表

1. Reddit / r/cscareerquestions：9-5、远程孤独、下班后恢复和生活意义讨论，https://www.reddit.com/r/cscareerquestions/comments/s29jtl/95_is_killing_my_soul_how_am_i_supposed_to/
2. Reddit / r/ExperiencedDevs：资深工程师 burnout、父母身份、换岗、运动和边界经验，https://www.reddit.com/r/ExperiencedDevs/
3. Hacker News：开发者 burnout、讨厌工作时如何撑住、储蓄和退出选项讨论，https://news.ycombinator.com/item?id=39809061
4. V2EX：加班伴侣相处、双城通勤、远程孤独、35 岁焦虑和生活成本讨论，https://www.v2ex.com/
5. 知乎：程序员中年危机、家庭支出、房贷、健康和职业路径问答，https://www.zhihu.com/question/264237428
6. 掘金：程序员健康管理、家庭工作平衡、加班与长期恢复经验，https://juejin.cn/
7. 博客园：程序员加班原因、职业倦怠恢复、工期预估和项目管理反思，https://www.cnblogs.com/
8. 少数派：远程工作、数字游民、睡眠、注意力、设备消费和家庭电子设备边界，https://sspai.com/
9. Stack Overflow Developer Survey 2025：就业状态、工作环境、薪资、技术购买和工作满意度，https://survey.stackoverflow.co/2025/work/
10. Buffer State of Remote Work 2023：远程工作的孤独、断开困难、跨时区协作和居家边界，https://buffer.com/state-of-remote-work/2023
11. GitLab All-Remote Handbook：异步沟通、文档化、远程边界、居家办公和团队连接，https://handbook.gitlab.com/handbook/company/culture/all-remote/
12. Microsoft Work Trend Index：无限工作日、通知打断、夜间会议、数字债务和 AI 协作，https://www.microsoft.com/en-us/worklab/work-trend-index/breaking-down-infinite-workday
13. Workplace StackExchange：长工时、假期工作、边界沟通和职场压力求助，https://workplace.stackexchange.com/
14. dev.to：开发者 burnout、热爱工作也会耗竭、远程生活和恢复复盘，https://dev.to/
15. Indie Hackers：全职之外做副业、家庭时间、个人产品和变现焦虑，https://www.indiehackers.com/
16. Lobsters：找回软件热情、下班后不再写代码、身份认同和长期职业节奏，https://lobste.rs/

## 主题簇总结

- 生活和边界：高频线索不是单纯工时，而是工作侵入吃饭、睡觉、买菜、家务、亲密关系和周末恢复。
- 关系和家庭：伴侣、孩子、父母、异地和双职工家务在社区讨论中反复出现，适合做成温和、酸涩、苦笑型弹窗。
- 健康和恢复：睡眠、久坐、眼睛、颈椎、体检、运动和情绪恢复是跨中英文社区的共同主题。
- 消费和焦虑：人体工学椅、显示器、键盘、AI 订阅、课程、咖啡、NAS、儿童教育和房贷常被包装成效率或安全感投资。
- 通勤和居住：短通勤、末班车、跨城高铁、远程卧室办公、搬家靠近公司，都直接影响生活质量。
- 中年压力：35 岁焦虑背后常是职业弹性、体力下降、家庭现金流、父母照护和孩子教育叠加，而不只是技术更新。

## JSONL 候选

```jsonl
{"action":"rest","text":"你把电脑合上后没有立刻刷手机，客厅终于从临时战情室恢复成客厅。","tone":"温和","kind":"life","category":"home","source_hint":"Buffer / GitLab remote"}
{"action":"rest","text":"今天的恢复计划很低配：热饭、洗澡、早睡，不给生产力软件打卡。","tone":"清醒","kind":"health","category":"health","source_hint":"掘金 / 少数派"}
{"action":"rest","text":"你在地铁上什么也没学，只看黑窗里的自己慢慢停止转圈。","tone":"平静","kind":"life","category":"commute","source_hint":"V2EX 通勤"}
{"action":"rest","text":"关掉工作通知的那一秒，卧室的空气像刚从值班表里解绑。","tone":"治愈","kind":"health","category":"home","source_hint":"Microsoft Work Trend Index"}
{"action":"rest","text":"你把明天要做的事写在纸上，让大脑退出临时数据库岗位。","tone":"务实","kind":"health","category":"emotion","source_hint":"Reddit cscareerquestions"}
{"action":"rest","text":"散步二十分钟后，焦虑没有消失，但终于不再用红色告警闪烁。","tone":"克制","kind":"health","category":"emotion","source_hint":"Hacker News burnout"}
{"action":"rest","text":"你给自己做了一顿普通晚饭，至少盐比项目排期更可控。","tone":"轻松","kind":"life","category":"home","source_hint":"掘金 健康"}
{"action":"rest","text":"今天没有把枕头当代码评审现场，睡眠质量短暂升版。","tone":"干幽默","kind":"health","category":"health","source_hint":"少数派 睡眠"}
{"action":"rest","text":"你把椅背调回正确角度，腰椎像收到了迟到的热修复。","tone":"幽默","kind":"health","category":"health","source_hint":"掘金 程序员健康"}
{"action":"rest","text":"周末上午你去买菜，发现番茄不会追问这个需求什么时候上线。","tone":"松弛","kind":"life","category":"home","source_hint":"Reddit work life"}
{"action":"rest","text":"你把午休从顺手看文档改成闭眼二十分钟，下午少了三次误报。","tone":"务实","kind":"health","category":"health","source_hint":"Microsoft infinite workday"}
{"action":"rest","text":"你给卧室立规矩：代码不能上床，焦虑也要在门口换鞋。","tone":"温和","kind":"health","category":"home","source_hint":"GitLab all remote"}
{"action":"rest","text":"你在阳台晒了十分钟太阳，像给低电量的自己接上慢充。","tone":"治愈","kind":"health","category":"home","source_hint":"少数派 注意力"}
{"action":"rest","text":"没有参加深夜直播课的夜晚，你参加了自己的睡眠发布会。","tone":"自嘲","kind":"health","category":"health","source_hint":"Stack Overflow Survey"}
{"action":"rest","text":"跑步机不会问接口为什么慢，但会提醒你心率为什么快。","tone":"轻松","kind":"health","category":"health","source_hint":"Reddit ExperiencedDevs"}
{"action":"rest","text":"你把周日晚上留给收拾房间，让下周不是从脏乱差分支启动。","tone":"朴素","kind":"life","category":"home","source_hint":"掘金 家庭平衡"}
{"action":"rest","text":"你把坏情绪和垃圾袋一起带下楼，至少其中一个已经清空。","tone":"治愈","kind":"life","category":"emotion","source_hint":"Hacker News surviving job"}
{"action":"rest","text":"你承认累不是能力问题，而是电量真的只剩百分之三。","tone":"清醒","kind":"health","category":"emotion","source_hint":"dev.to burnout"}
{"action":"rest","text":"你没有用休息证明自己懒，只把它当成系统维护窗口。","tone":"坚定","kind":"health","category":"emotion","source_hint":"博客园 职业倦怠"}
{"action":"rest","text":"晚饭后你陪家人散步，步数没有上热搜，但关系悄悄回了一点血。","tone":"温暖","kind":"life","category":"family","source_hint":"V2EX 家庭"}
{"action":"rest","text":"你把手机放到客厅充电，床终于不再像二级值班室。","tone":"温和","kind":"health","category":"home","source_hint":"Buffer unplug"}
{"action":"rest","text":"今天你没有解释为什么累，只安静喝完一碗汤。","tone":"酸涩","kind":"life","category":"family","source_hint":"V2EX 伴侣加班"}
{"action":"rest","text":"体检报告像静态分析报告，读起来刺眼，但比线上事故来得早。","tone":"克制","kind":"health","category":"health","source_hint":"知乎 中年危机"}
{"action":"rest","text":"你把晚上的学习计划删到一项，给生活留了一个可用线程。","tone":"务实","kind":"learning","category":"learning","source_hint":"Lobsters 热情"}
{"action":"rest","text":"你终于没在周末补工时，周一的自己表示依赖项减少。","tone":"轻快","kind":"life","category":"life","source_hint":"Workplace StackExchange"}
{"action":"rest","text":"你在高铁上睡着了，梦里没有 standup，也没有未读红点。","tone":"平静","kind":"health","category":"commute","source_hint":"V2EX 双城通勤"}
{"action":"rest","text":"孩子把积木递给你，你这次没有把它想成微服务架构。","tone":"温暖","kind":"life","category":"family","source_hint":"Reddit parenting developer"}
{"action":"rest","text":"你给自己留了一个不被量化的晚上，像从仪表盘里逃出来。","tone":"治愈","kind":"life","category":"emotion","source_hint":"Hacker News burnout"}
{"action":"rest","text":"咖啡没有续杯，水杯终于在桌上拥有了主角光环。","tone":"轻松","kind":"health","category":"health","source_hint":"掘金 饮食健康"}
{"action":"rest","text":"你把键盘灯关掉，房间里第一次没有任何东西催你上线。","tone":"平静","kind":"life","category":"home","source_hint":"GitLab remote boundaries"}
{"action":"overtime","text":"你说只改一行配置，结果晚饭被纳入延期范围。","tone":"苦笑","kind":"event","category":"family","source_hint":"V2EX 伴侣加班"}
{"action":"overtime","text":"会议结束时天已经黑了，窗外饭点比项目计划更准时。","tone":"讽刺","kind":"life","category":"life","source_hint":"Microsoft Work Trend Index"}
{"action":"overtime","text":"需求像临时会议一样弹出，每次都说只占五分钟。","tone":"干幽默","kind":"joke","category":"emotion","source_hint":"Microsoft infinite workday"}
{"action":"overtime","text":"你给家人说马上好，这句话最近的可信度低于测试环境。","tone":"苦笑","kind":"event","category":"family","source_hint":"V2EX 家庭"}
{"action":"overtime","text":"末班地铁载着你和几个低电量灵魂，大家都没力气卷了。","tone":"低沉","kind":"life","category":"commute","source_hint":"V2EX 通勤"}
{"action":"overtime","text":"你在电梯里补回家消息，像给家庭关系做迟到的心跳包。","tone":"愧疚","kind":"life","category":"family","source_hint":"V2EX 伴侣加班"}
{"action":"overtime","text":"夜里十点的办公室很安静，安静到能听见颈椎提交辞职信。","tone":"黑色幽默","kind":"health","category":"health","source_hint":"掘金 加班健康"}
{"action":"overtime","text":"项目排期拍得很轻，落到你身上却像一块没估重的砖。","tone":"讽刺","kind":"event","category":"emotion","source_hint":"博客园 项目管理"}
{"action":"overtime","text":"你以为今天只是加班，其实生活也被顺手合并到工作分支。","tone":"尖锐","kind":"life","category":"life","source_hint":"Hacker News burnout"}
{"action":"overtime","text":"晚高峰错过后路上更空了，但你并没有因此更轻松。","tone":"平静","kind":"life","category":"commute","source_hint":"V2EX 通勤"}
{"action":"overtime","text":"周末的电脑开机声，让家里的空气短暂进入冻结状态。","tone":"苦笑","kind":"event","category":"family","source_hint":"Reddit parenting"}
{"action":"overtime","text":"你把孩子的故事书放在旁边，却先给线上问题讲完结局。","tone":"酸涩","kind":"life","category":"family","source_hint":"Reddit ExperiencedDevs"}
{"action":"overtime","text":"又一个临时需求插队，今天的晚餐计划被迫重排优先级。","tone":"无奈","kind":"event","category":"family","source_hint":"博客园 加班原因"}
{"action":"overtime","text":"你打开电脑前说半小时，电脑和家人都知道这是理想估算。","tone":"自嘲","kind":"joke","category":"home","source_hint":"Buffer remote work"}
{"action":"overtime","text":"跨时区消息在凌晨抵达，仿佛地球自转也在参与压测。","tone":"冷幽默","kind":"event","category":"home","source_hint":"Buffer State of Remote Work"}
{"action":"overtime","text":"你坐在餐桌前修 bug，筷子被迫等待资源锁释放。","tone":"干幽默","kind":"joke","category":"home","source_hint":"V2EX 伴侣加班"}
{"action":"overtime","text":"老板说大家辛苦一下，你听见腰椎先叹了口气。","tone":"黑色幽默","kind":"health","category":"health","source_hint":"掘金 高强度工时"}
{"action":"overtime","text":"你本来想陪父母视频，结果先陪日志滚了半小时。","tone":"酸涩","kind":"life","category":"family","source_hint":"知乎 中年压力"}
{"action":"overtime","text":"夜宵送到时，你发现自己已经把饥饿感静默处理了。","tone":"苦笑","kind":"health","category":"health","source_hint":"博客园 加班"}
{"action":"overtime","text":"上线窗口卡在睡前，连梦都要等发布完成再排队。","tone":"疲惫","kind":"event","category":"health","source_hint":"Workplace StackExchange"}
{"action":"overtime","text":"你的工位灯亮到最后，像公司给家庭生活打的一盏远光灯。","tone":"尖锐","kind":"life","category":"family","source_hint":"Reddit work life"}
{"action":"overtime","text":"需求评审越开越晚，家里的菜从热菜变成了回滚菜。","tone":"无奈","kind":"event","category":"home","source_hint":"V2EX 家庭"}
{"action":"overtime","text":"你错过孩子睡前的那句晚安，只赶上了监控里的晚高峰。","tone":"酸涩","kind":"life","category":"family","source_hint":"Reddit parenting developer"}
{"action":"overtime","text":"通勤软件显示还有四十分钟到家，生活软件显示今天已超时。","tone":"苦笑","kind":"life","category":"commute","source_hint":"V2EX 双城通勤"}
{"action":"overtime","text":"凌晨的群消息像连续弹窗，点掉一个又刷新一个。","tone":"疲惫","kind":"event","category":"emotion","source_hint":"Microsoft digital debt"}
{"action":"learn-ai","text":"你学 AI 工具不是为了把自己卷成插件，而是为了少做重复机械活。","tone":"务实","kind":"learning","category":"learning","source_hint":"Stack Overflow Survey"}
{"action":"learn-ai","text":"你让 AI 整理会议纪要，第一次觉得会后脑子没有冒烟。","tone":"轻松","kind":"learning","category":"life","source_hint":"Microsoft Work Trend Index"}
{"action":"learn-ai","text":"教程收藏夹又涨了，但你今天只学一个明天能用上的功能。","tone":"克制","kind":"learning","category":"consumption","source_hint":"V2EX 消费复杂化"}
{"action":"learn-ai","text":"你把 prompt 写得像需求文档，AI 终于不再像临时外包乱猜。","tone":"幽默","kind":"learning","category":"learning","source_hint":"dev.to AI workflow"}
{"action":"learn-ai","text":"你没有追完所有新模型，只给自己留了一个可维护的学习分支。","tone":"平静","kind":"learning","category":"emotion","source_hint":"Lobsters 身份认同"}
{"action":"learn-ai","text":"你给父母解释 AI，不小心把智能体讲成了会加班的电子亲戚。","tone":"轻松","kind":"joke","category":"family","source_hint":"知乎 AI 焦虑"}
{"action":"learn-ai","text":"你决定先用 AI 自动生成购物清单，别一上来就改造全公司。","tone":"务实","kind":"learning","category":"home","source_hint":"GitLab async work"}
{"action":"learn-ai","text":"AI 订阅又扣费了，你把它从焦虑消费改成每周一次的真实使用。","tone":"克制","kind":"learning","category":"consumption","source_hint":"Stack Overflow tech purchases"}
{"action":"learn-ai","text":"你用 AI 总结体检注意事项，结果它提醒你先别熬夜。","tone":"黑色幽默","kind":"health","category":"health","source_hint":"掘金 健康"}
{"action":"learn-ai","text":"你让 AI 写周报初稿，省下的十分钟拿去认真吃饭。","tone":"轻快","kind":"learning","category":"life","source_hint":"Microsoft AI work"}
{"action":"learn-ai","text":"你没有把每个新工具都装一遍，钱包和大脑同时松了口气。","tone":"清醒","kind":"learning","category":"consumption","source_hint":"少数派 数字工具"}
{"action":"learn-ai","text":"你把学习 AI 的目标从改变命运降级成少复制三遍表格。","tone":"自嘲","kind":"learning","category":"learning","source_hint":"Reddit work exhaustion"}
{"action":"learn-ai","text":"你让 AI 先解释报错，再决定要不要继续怀疑人生。","tone":"轻松","kind":"learning","category":"emotion","source_hint":"Stack Overflow Survey"}
{"action":"learn-ai","text":"你用 AI 给孩子编睡前故事，主角终于不是生产事故。","tone":"温暖","kind":"life","category":"family","source_hint":"Reddit parenting"}
{"action":"learn-ai","text":"你把 AI 当副驾驶，不再指望它替你处理所有人生合并冲突。","tone":"清醒","kind":"learning","category":"emotion","source_hint":"Hacker News AI work"}
{"action":"learn-ai","text":"你把通勤路上的碎片时间拿来听 AI 课，没学完也没有惩罚自己。","tone":"温和","kind":"learning","category":"commute","source_hint":"V2EX 通勤"}
{"action":"learn-ai","text":"你把模型更新看成天气预报，关注但不追着云跑。","tone":"平静","kind":"learning","category":"learning","source_hint":"Lobsters software passion"}
{"action":"learn-ai","text":"AI 帮你改了简历措辞，你决定先把睡眠也优化一下。","tone":"务实","kind":"learning","category":"health","source_hint":"Stack Overflow career"}
{"action":"learn-ai","text":"你给家用预算做了自动分类，发现最大的 bug 叫冲动消费。","tone":"干幽默","kind":"learning","category":"consumption","source_hint":"少数派 消费"}
{"action":"learn-ai","text":"你用 AI 复盘一天，结论简单得刺眼：少开会，多睡觉。","tone":"清醒","kind":"health","category":"emotion","source_hint":"Microsoft workday"}
{"action":"learn-ai","text":"你没有把 AI 学习排到凌晨，技术栈可以更新，肝不用热更新。","tone":"黑色幽默","kind":"health","category":"health","source_hint":"掘金 程序员健康"}
{"action":"learn-ai","text":"你让 AI 帮父母看手机设置，家庭工单第一次没有升级到你这里。","tone":"轻松","kind":"life","category":"family","source_hint":"知乎 家庭"}
{"action":"learn-ai","text":"你把所有 AI 新闻折叠成周报，终于不用每天被未来追尾。","tone":"克制","kind":"learning","category":"emotion","source_hint":"Hacker News AI"}
{"action":"learn-ai","text":"你试着用 AI 做菜谱，结果最难自动化的还是下楼买菜。","tone":"幽默","kind":"life","category":"home","source_hint":"少数派 生活"}
{"action":"learn-ai","text":"你把新工具写进家庭共享清单，伴侣只关心它能不能少忘倒垃圾。","tone":"生活化","kind":"joke","category":"family","source_hint":"V2EX 伴侣相处"}
{"action":"interview","text":"你刷题到深夜，房贷没有变少，只是焦虑多了一个测试集。","tone":"苦笑","kind":"learning","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"interview","text":"面试准备表排满了，体检预约却被你拖到下个版本。","tone":"清醒","kind":"health","category":"health","source_hint":"掘金 健康"}
{"action":"interview","text":"你背系统设计时突然想到，家庭现金流也需要高可用架构。","tone":"务实","kind":"learning","category":"family","source_hint":"知乎 家庭支出"}
{"action":"interview","text":"简历上的成长曲线很好看，镜子里的黑眼圈也很有说服力。","tone":"自嘲","kind":"health","category":"health","source_hint":"Reddit career burnout"}
{"action":"interview","text":"你把跳槽当逃生舱，但也开始认真计算舱外氧气够不够。","tone":"克制","kind":"event","category":"midlife","source_hint":"Hacker News surviving job"}
{"action":"interview","text":"模拟面试结束后，你先给家里回消息，关系也需要及时反馈。","tone":"温和","kind":"life","category":"family","source_hint":"V2EX 伴侣"}
{"action":"interview","text":"你发现最难回答的不是分布式锁，而是你到底想过什么样的生活。","tone":"沉静","kind":"life","category":"emotion","source_hint":"Reddit 9-5 meaning"}
{"action":"interview","text":"猎头说机会很好，你看了看通勤时间，机会顿时有了阴影。","tone":"务实","kind":"event","category":"commute","source_hint":"V2EX 通勤"}
{"action":"interview","text":"你准备跳槽涨薪，儿童兴趣班和父母体检在旁边一起旁听。","tone":"现实","kind":"life","category":"family","source_hint":"知乎 中年压力"}
{"action":"interview","text":"面试官问抗压能力，你想起最近一周的睡眠，差点反问压多久。","tone":"黑色幽默","kind":"joke","category":"health","source_hint":"Workplace StackExchange"}
{"action":"interview","text":"你把 offer 对比表做得很细，终于把食堂和晚下班也算进成本。","tone":"清醒","kind":"event","category":"consumption","source_hint":"Stack Overflow work"}
{"action":"interview","text":"你练英文自我介绍，孩子在旁边学会了 Kubernetes 这个怪词。","tone":"轻松","kind":"life","category":"family","source_hint":"Reddit parenting"}
{"action":"interview","text":"你投简历前先查公司加班口碑，像买二手车前听发动机。","tone":"务实","kind":"event","category":"life","source_hint":"V2EX 求职"}
{"action":"interview","text":"你把面试失败写成复盘，没有把自己写成失败。","tone":"坚定","kind":"learning","category":"emotion","source_hint":"dev.to burnout"}
{"action":"interview","text":"你发现远程岗位最诱人之处，是少两小时通勤和多一顿家常饭。","tone":"温和","kind":"life","category":"commute","source_hint":"Buffer remote work"}
{"action":"interview","text":"你问清楚值班制度，比问免费零食更像成年人。","tone":"清醒","kind":"event","category":"health","source_hint":"GitLab remote boundaries"}
{"action":"interview","text":"准备面试时你突然收拾了书桌，人生有时从清空桌面开始。","tone":"平静","kind":"life","category":"home","source_hint":"少数派 工作台"}
{"action":"interview","text":"你把职业规划从必须赢改成别把身体输掉。","tone":"克制","kind":"health","category":"midlife","source_hint":"知乎 35岁"}
{"action":"interview","text":"面试题越刷越多，你决定给自己留一个不刷题的晚上。","tone":"温和","kind":"learning","category":"health","source_hint":"Reddit work life balance"}
{"action":"interview","text":"你不再只看薪资包，也看能不能准时接孩子放学。","tone":"现实","kind":"life","category":"family","source_hint":"Reddit ExperiencedDevs parenting"}
{"action":"side-project","text":"副业计划从今晚重构世界，降级为先做一个能登录的页面。","tone":"自嘲","kind":"learning","category":"life","source_hint":"Indie Hackers"}
{"action":"side-project","text":"你给个人项目买了域名，像给未来的自己订了一张站票。","tone":"轻松","kind":"event","category":"consumption","source_hint":"Indie Hackers"}
{"action":"side-project","text":"孩子睡着后你打开编辑器，十分钟后你也进入待机模式。","tone":"苦笑","kind":"life","category":"family","source_hint":"Reddit parenting"}
{"action":"side-project","text":"你把副业目标从月入十万改成这个月别烂尾。","tone":"务实","kind":"learning","category":"emotion","source_hint":"Indie Hackers side project"}
{"action":"side-project","text":"个人产品的第一个用户是你自己，第二个用户是被你反复打扰的朋友。","tone":"幽默","kind":"joke","category":"social","source_hint":"Indie Hackers"}
{"action":"side-project","text":"你用周末做项目，却发现洗衣机也有自己的 sprint。","tone":"生活化","kind":"life","category":"home","source_hint":"V2EX 家务"}
{"action":"side-project","text":"副业收入还没出现，云服务账单先表达了存在感。","tone":"干幽默","kind":"event","category":"consumption","source_hint":"Stack Overflow tech purchases"}
{"action":"side-project","text":"你给项目写 README，比给家里解释你在做什么还容易。","tone":"自嘲","kind":"learning","category":"family","source_hint":"Indie Hackers"}
{"action":"side-project","text":"你没有熬夜赶个人项目，因为明天还要当一个有用的大人。","tone":"清醒","kind":"health","category":"health","source_hint":"Lobsters passion"}
{"action":"side-project","text":"你把副业排期写得很满，伴侣提醒你周末也需要排期陪人。","tone":"温和","kind":"life","category":"family","source_hint":"V2EX 伴侣"}
{"action":"side-project","text":"你做了一个记账小工具，最大发现是外卖不是小数点误差。","tone":"幽默","kind":"event","category":"consumption","source_hint":"少数派 消费"}
{"action":"side-project","text":"个人项目还没上线，你已经学会了和自己谈需求取舍。","tone":"务实","kind":"learning","category":"emotion","source_hint":"Indie Hackers"}
{"action":"side-project","text":"你把旧手机改成家庭看板，家人只问它能不能提醒买鸡蛋。","tone":"轻松","kind":"life","category":"home","source_hint":"少数派 设备"}
{"action":"side-project","text":"你给副业开了交流群，结果第一晚大家都在聊颈椎。","tone":"苦笑","kind":"joke","category":"health","source_hint":"V2EX 程序员健康"}
{"action":"side-project","text":"你试着做效率工具，最后先优化了自己乱糟糟的餐桌。","tone":"平静","kind":"life","category":"home","source_hint":"GitLab remote work"}
{"action":"side-project","text":"你开始做一个家庭相册项目，技术债第一次带着一点温度。","tone":"温暖","kind":"life","category":"family","source_hint":"少数派 家庭"}
{"action":"side-project","text":"你给项目买了新键盘，代码没多写几行，手感先通过验收。","tone":"自嘲","kind":"joke","category":"consumption","source_hint":"V2EX 消费"}
{"action":"side-project","text":"副业让你更理解老板：原来自己给自己提需求也会离谱。","tone":"冷幽默","kind":"joke","category":"emotion","source_hint":"Indie Hackers"}
{"action":"side-project","text":"你把上线目标改成可持续更新，不再用三天热情挑战人生。","tone":"克制","kind":"learning","category":"health","source_hint":"Lobsters 热情"}
{"action":"side-project","text":"你在通勤路上记产品灵感，到家后先记得把菜放进冰箱。","tone":"生活化","kind":"life","category":"commute","source_hint":"V2EX 通勤"}
{"action":"side-project","text":"你的个人项目叫自由，当前版本主要功能是占用睡眠。","tone":"黑色幽默","kind":"joke","category":"health","source_hint":"Indie Hackers"}
{"action":"side-project","text":"你终于删掉三个无用功能，感觉像给周末减了负。","tone":"轻快","kind":"learning","category":"emotion","source_hint":"GitLab iteration"}
{"action":"side-project","text":"你把副业会议安排在孩子睡前之后，结果孩子临时加了需求。","tone":"苦笑","kind":"life","category":"family","source_hint":"Reddit parenting"}
{"action":"side-project","text":"你做了一个健康打卡工具，第一条数据是今天又忘了站起来。","tone":"自嘲","kind":"health","category":"health","source_hint":"掘金 久坐"}
{"action":"side-project","text":"个人产品没有爆款，但让你重新记起写代码也可以不是 KPI。","tone":"温和","kind":"learning","category":"emotion","source_hint":"Lobsters software passion"}
{"action":"networking","text":"你和朋友吃饭时没聊框架，友情版本号稳定上升。","tone":"温暖","kind":"life","category":"social","source_hint":"V2EX 远程孤独"}
{"action":"networking","text":"远程办公第 N 天，你发现人类语音包不能只靠 Slack 更新。","tone":"苦笑","kind":"life","category":"social","source_hint":"Buffer loneliness"}
{"action":"networking","text":"你约同城程序员线下喝咖啡，大家第一句都是原来你也真人存在。","tone":"幽默","kind":"event","category":"social","source_hint":"Reddit coworking"}
{"action":"networking","text":"你在技术群里问健康椅推荐，回复比架构讨论更热烈。","tone":"轻松","kind":"joke","category":"health","source_hint":"V2EX 消费"}
{"action":"networking","text":"你参加线下分享会，最大的收获是知道别人也会怕中年。","tone":"平静","kind":"life","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"networking","text":"你和前同事散步聊天，没有 PPT，信息密度反而更高。","tone":"温和","kind":"life","category":"social","source_hint":"Hacker News burnout"}
{"action":"networking","text":"你加入运动群，第一次把群消息和健康绑定而不是和工单绑定。","tone":"轻快","kind":"health","category":"health","source_hint":"Reddit recovery"}
{"action":"networking","text":"你在同事婚礼上发现，大家离开工位后都比头像立体。","tone":"轻松","kind":"life","category":"social","source_hint":"V2EX 社交"}
{"action":"networking","text":"你和伴侣认真开了一次家庭例会，议题没有需求，只有分担。","tone":"温和","kind":"life","category":"family","source_hint":"V2EX 伴侣"}
{"action":"networking","text":"你找老朋友吐槽房贷，对方回了一个懂字，胜过长篇方案。","tone":"现实","kind":"life","category":"midlife","source_hint":"知乎 家庭支出"}
{"action":"networking","text":"你参加读书会，整晚没人问你现在用什么框架。","tone":"治愈","kind":"life","category":"social","source_hint":"少数派 生活"}
{"action":"networking","text":"你在远程团队里开了闲聊频道，孤独感终于有了出口。","tone":"温和","kind":"life","category":"remote","source_hint":"GitLab all remote"}
{"action":"networking","text":"你和邻居拼车上班，通勤从独自缓存变成短暂联机。","tone":"轻松","kind":"life","category":"commute","source_hint":"V2EX 通勤"}
{"action":"networking","text":"你陪父母散步时没有看手机，亲情延迟降到可接受范围。","tone":"温暖","kind":"life","category":"family","source_hint":"知乎 家庭"}
{"action":"networking","text":"你向同事请教育儿时间管理，得到的答案比代码规范更真实。","tone":"务实","kind":"life","category":"family","source_hint":"Reddit parenting developer"}
{"action":"networking","text":"你和朋友讨论消费降级，最后决定少买一个键盘，多吃一顿饭。","tone":"清醒","kind":"life","category":"consumption","source_hint":"少数派 消费"}
{"action":"networking","text":"你在行业活动上交换名片，也交换了几个关于睡眠的求生技巧。","tone":"苦笑","kind":"health","category":"health","source_hint":"Stack Overflow work"}
{"action":"networking","text":"你把求助发给可信朋友，没有把所有压力都交给搜索框。","tone":"治愈","kind":"life","category":"emotion","source_hint":"Workplace StackExchange"}
{"action":"networking","text":"你和同城远程员工约了共享办公，咖啡钱买回一点边界感。","tone":"务实","kind":"life","category":"remote","source_hint":"Reddit coworking"}
{"action":"networking","text":"你第一次在饭局承认自己累，没想到大家都像合并了同一个分支。","tone":"酸涩","kind":"life","category":"emotion","source_hint":"Hacker News burnout"}
{"action":"networking","text":"你给家人解释今天为什么晚回，少了技术细节，多了认真道歉。","tone":"温和","kind":"life","category":"family","source_hint":"V2EX 加班伴侣"}
{"action":"networking","text":"你和 mentor 聊职业下半场，话题从框架升级变成体力管理。","tone":"清醒","kind":"life","category":"midlife","source_hint":"Reddit ExperiencedDevs"}
{"action":"networking","text":"你参加社区志愿活动，发现自己不只是一个会写代码的工号。","tone":"温暖","kind":"life","category":"social","source_hint":"Stack Overflow volunteer"}
{"action":"networking","text":"你在技术群里组织午休散步，响应人数比重构提案多。","tone":"轻松","kind":"health","category":"health","source_hint":"掘金 健康"}
{"action":"networking","text":"你和伴侣把周末日程写下来，终于不再让加班自动抢占全部插槽。","tone":"务实","kind":"life","category":"family","source_hint":"V2EX 家庭边界"}
```
