# 程序员生存模拟器 round17 生活共鸣弹窗候选

研究子智能体：A  
生成时间：2026-06-18  
写入范围：仅本文件；未修改正式数据池、HTML、tools、data。  
生成原则：基于公开社区经验帖与公开报告做原创改写，不复制原帖原文；内容覆盖程序员工作之外的生活、情绪、健康、家庭、消费、通勤、居家与中年危机，服务游戏行动循环。

## 来源列表

1. Reddit / r/cscareerquestions：9-5、远程孤独、工作后脑力耗尽、薪资与生活平衡讨论，https://www.reddit.com/r/cscareerquestions/comments/s29jtl/95_is_killing_my_soul_how_am_i_supposed_to/
2. Reddit / r/cscareerquestions：下班后停止想项目、LeetCode 与精神负荷讨论，https://www.reddit.com/r/cscareerquestions/comments/13z661n/as_a_swe_how_to_stop_thinking_about_your_project/
3. Reddit / r/ExperiencedDevs：资深工程师 burnout 恢复、运动、睡眠、换环境经验，https://www.reddit.com/r/ExperiencedDevs/comments/1gtf5ak/software_engineers_how_have_you_recovered_from/
4. Reddit / r/ExperiencedDevs：做父母后的开发者时间、家庭双全职负荷讨论，https://www.reddit.com/r/ExperiencedDevs/comments/1eu91g4/how_to_parent_as_a_developer/
5. Hacker News：开发者 burnout、短通勤、准点下班、同事关系和状态恢复讨论，https://news.ycombinator.com/item?id=39809061
6. Hacker News：讨厌工作时如何撑住、储蓄、生活爱好和退出选项讨论，https://news.ycombinator.com/item?id=8871672
7. V2EX：高压加班下伴侣相处、静处需求、通勤与夜间回家经验，https://www.v2ex.com/t/1127711
8. V2EX：北京-郑州双城通勤、家庭、成本、疲惫和职业选择讨论，https://www.v2ex.com/t/1168528
9. V2EX：双城通勤中的内疚、父亲角色、休息权和家庭拉扯讨论，https://v2ex.com/t/1179985
10. Stack Overflow Developer Survey 2025：开发者工作状态、满意度、AI 工具与职业数据，https://survey.stackoverflow.co/2025/work/
11. Buffer State of Remote Work 2023：远程工作的孤独、无法断开、跨时区与协作压力，https://buffer.com/state-of-remote-work/2023
12. Microsoft Work Trend Index：无限工作日、通知打断、数字债务、会后/夜间工作负荷，https://www.microsoft.com/en-us/worklab/work-trend-index/breaking-down-infinite-workday
13. GitLab All-Remote Guide：远程边界、异步沟通、居家工位与文档化协作，https://handbook.gitlab.com/handbook/company/culture/all-remote/
14. 掘金：程序员家庭、工作、健康之间的动态平衡，https://juejin.cn/post/7520066847707643915
15. 掘金：程序员健康、饮食、眼睛、运动与心态管理，https://juejin.cn/post/7244338765241204797
16. 博客园：程序员加班的项目管理、工期预估与隐性责任问题，https://www.cnblogs.com/yychuyu/articles/18993668
17. 博客园：职业倦怠、休息、work-life balance 与管理者支持，https://www.cnblogs.com/smiecj/p/19292553
18. 少数派：远程工作、边界、固定工资、专注技术与年龄压力，https://sspai.com/post/73284
19. 少数派：睡眠、运动、饮食、注意力与家庭电子设备焦虑，https://sspai.com/post/108977
20. 知乎：程序员中年危机、家庭成本、健康和技术之外的问题，https://www.zhihu.com/question/264237428

## 主题簇总结

- 生活类：许多经验帖强调“工作之外仍有生活系统要维护”，包括买菜、做饭、家务、社交、爱好和城市选择；适合做成恢复、边界和自我掌控感弹窗。
- 情绪类：高频共鸣不是单纯加班，而是脑子持续在线、通知打断、睡前仍在想 bug、休息时内疚；适合关联 `rest`、`overtime`、`interview`。
- 健康类：睡眠、久坐、眼睛、颈椎、饮食、运动和体检在中英文社区都反复出现；弹窗应避免鼓励透支，更多提示“恢复也是生产力”。
- 家庭类：伴侣、孩子、父母、异地、家务分担和陪伴质量比“是否热爱代码”更影响长期状态；适合做温和、苦笑、清醒语气。
- 消费类：键盘、显示器、人体工学椅、NAS、AI 订阅、课程、咖啡和通勤成本常被包装成“效率投资”，也能反映焦虑和消费降级。
- 通勤类：短通勤、地铁放空、跨城往返、末班车、骑车和搬近公司，是生活质量的强变量；适合强化城市与家庭选择。
- 居家类：远程办公让卧室、客厅、餐桌和工作台边界模糊；需要离线仪式、专属工位、关通知和重建社交连接。
- 中年危机类：35 岁焦虑不是纯技术问题，而是体力、家庭支出、父母照护、孩子教育、房贷和职业选择叠加；适合做低戏剧化但强共鸣的事件。

## JSONL 候选

```jsonl
{"action":"rest","text":"你把电脑合上后，屋里终于只剩冰箱的嗡嗡声，不再像一间小型机房。","tone":"温和","kind":"life","category":"home","source_hint":"GitLab All-Remote / Buffer"}
{"action":"rest","text":"今天你没有用睡前十分钟刷告警群，枕头对你的变更表示通过。","tone":"轻松","kind":"health","category":"health","source_hint":"Microsoft Work Trend Index"}
{"action":"rest","text":"你在地铁上什么也没学，只看窗外黑屏反光，脑子难得没有继续编译。","tone":"平静","kind":"life","category":"commute","source_hint":"V2EX 双城通勤"}
{"action":"rest","text":"晚饭后散步二十分钟，焦虑从红色告警降成了黄色提示。","tone":"治愈","kind":"health","category":"health","source_hint":"Reddit ExperiencedDevs"}
{"action":"rest","text":"你把明天要处理的三件事写在纸上，终于不用让大脑当临时数据库。","tone":"克制","kind":"health","category":"emotion","source_hint":"Reddit cscareerquestions"}
{"action":"rest","text":"今天的恢复计划很朴素：热饭、洗澡、早睡，不向任何生产力博主汇报。","tone":"清醒","kind":"health","category":"life","source_hint":"掘金 健康平衡"}
{"action":"rest","text":"你关掉手机工作通知，客厅从临时作战室恢复成了客厅。","tone":"温和","kind":"life","category":"home","source_hint":"Buffer State of Remote Work"}
{"action":"rest","text":"你第一次把周末上午留给买菜，发现番茄比需求文档更讲道理。","tone":"幽默","kind":"life","category":"home","source_hint":"掘金 家庭健康平衡"}
{"action":"rest","text":"你把椅子调高两厘米，腰椎像收到了迟来的补丁。","tone":"干幽默","kind":"health","category":"health","source_hint":"掘金 程序员健康"}
{"action":"rest","text":"你没有把休息叫作摆烂，而是叫一次必要的系统维护。","tone":"坚定","kind":"health","category":"emotion","source_hint":"博客园 burnout"}
{"action":"rest","text":"今天你按点下线，像给生活抢回了一小块未被占用的内存。","tone":"轻快","kind":"life","category":"life","source_hint":"Hacker News burnout"}
{"action":"rest","text":"你把午休从“顺便看文档”改成闭眼二十分钟，下午少报了三个假故障。","tone":"务实","kind":"health","category":"health","source_hint":"Microsoft Work Trend Index"}
{"action":"rest","text":"你给卧室立了规矩：代码不能上床，问题可以明天再长大。","tone":"温和","kind":"health","category":"home","source_hint":"GitLab Remote Guide"}
{"action":"rest","text":"你在阳台晒了十分钟太阳，像给自己接上了一个低功耗充电器。","tone":"治愈","kind":"health","category":"home","source_hint":"少数派 注意力"}
{"action":"rest","text":"你没有参加深夜技术直播，选择参加自己的睡眠发布会。","tone":"自嘲","kind":"health","category":"health","source_hint":"Stack Overflow Survey"}
{"action":"rest","text":"跑步机不会问接口为什么慢，但它会提醒你心率为什么快。","tone":"轻松","kind":"health","category":"health","source_hint":"Reddit ExperiencedDevs"}
{"action":"rest","text":"你把周日晚上留给收拾房间，至少让下周的开局不是脏乱差。","tone":"朴素","kind":"life","category":"home","source_hint":"掘金 周末生活"}
{"action":"rest","text":"你给自己做了一顿热饭，味道一般，但比外卖和告警一起到达好多了。","tone":"温和","kind":"health","category":"life","source_hint":"掘金 健康"}
{"action":"rest","text":"你把今天的失败先放下，垃圾袋和坏情绪一起被带下楼。","tone":"治愈","kind":"life","category":"emotion","source_hint":"Hacker News surviving job"}
{"action":"rest","text":"你终于承认累不是能力问题，而是电量真的只剩百分之三。","tone":"清醒","kind":"health","category":"emotion","source_hint":"Reddit work exhaustion"}
{"action":"overtime","text":"你说只改一行配置，结果连晚饭都被纳入延期范围。","tone":"苦笑","kind":"event","category":"family","source_hint":"V2EX 伴侣加班"}
{"action":"overtime","text":"会议结束时天已经黑了，窗外的饭点比项目计划更准时。","tone":"讽刺","kind":"life","category":"life","source_hint":"Microsoft infinite workday"}
{"action":"overtime","text":"需求像临时会议一样弹出，每次都说只占用五分钟。","tone":"干幽默","kind":"joke","category":"emotion","source_hint":"Microsoft Work Trend Index"}
{"action":"overtime","text":"你给家人说马上好，这句话最近的可信度低于测试环境。","tone":"苦笑","kind":"event","category":"family","source_hint":"V2EX 伴侣加班"}
{"action":"overtime","text":"末班地铁载着你和几个低电量灵魂，大家都没力气卷了。","tone":"低沉","kind":"life","category":"commute","source_hint":"V2EX 通勤"}
{"action":"overtime","text":"你在电梯里补回家消息，像给家庭关系做迟到的心跳包。","tone":"愧疚","kind":"life","category":"family","source_hint":"V2EX 伴侣加班"}
{"action":"overtime","text":"夜里十点的办公室很安静，安静到能听见颈椎在提交辞职信。","tone":"黑色幽默","kind":"health","category":"health","source_hint":"掘金 加班案例"}
{"action":"overtime","text":"项目排期拍得很轻，落到你身上却像一块没有估重的砖。","tone":"讽刺","kind":"event","category":"emotion","source_hint":"博客园 加班原因"}
{"action":"overtime","text":"你以为今天只是加班，其实生活也被顺手合并到了工作分支。","tone":"尖锐","kind":"life","category":"life","source_hint":"Hacker News burnout"}
{"action":"overtime","text":"晚高峰错过后路上更空了，但你并没有因此更轻松。","tone":"平静","kind":"life","category":"commute","source_hint":"V2EX 通勤"}
{"action":"overtime","text":"周末的电脑开机声，让家里的空气短暂进入冻结状态。","tone":"苦笑","kind":"event","category":"family","source_hint":"Reddit parenting developer"}
{"action":"overtime","text":"你把孩子的故事书放在旁边，却先给线上问题讲完了结局。","tone":"酸涩","kind":"life","category":"family","source_hint":"Reddit ExperiencedDevs parenting"}
{"action":"overtime","text":"又一个临时需求插队，今天的晚餐计划被迫重排优先级。","tone":"无奈","kind":"event","category":"family","source_hint":"博客园 项目管理"}
{"action":"overtime","text":"你打开电脑前说半小时，电脑和家人都知道这是假设条件。","tone":"自嘲","kind":"joke","category":"home","source_hint":"Buffer unplug"}
{"action":"overtime","text":"跨时区消息在凌晨抵达，仿佛地球自转也在参与压测。","tone":"冷幽默","kind":"event","category":"home","source_hint":"Buffer Remote Work"}
{"action":"overtime","text":"你坐在餐桌前修 bug，筷子被迫等待资源锁释放。","tone":"干幽默","kind":"joke","category":"home","source_hint":"V2EX 伴侣加班"}
{"action":"overtime","text":"领导说大家辛苦一下，你听见身体自动把这句话归档为高风险。","tone":"清醒","kind":"health","category":"health","source_hint":"掘金 加班健康"}
{"action":"overtime","text":"你把“今天早点睡”改成了 TODO，优先级又被线上故障覆盖。","tone":"苦笑","kind":"health","category":"health","source_hint":"博客园 burnout"}
{"action":"overtime","text":"代码跑通了，最后一班公交却没有等你一起发布。","tone":"无奈","kind":"event","category":"commute","source_hint":"V2EX 双城通勤"}
{"action":"overtime","text":"你回到家只想静音，伴侣却以为你在冷启动感情。","tone":"酸涩","kind":"life","category":"family","source_hint":"V2EX 伴侣加班"}
{"action":"learn-ai","text":"你学 AI 不是为了把夜晚也卷进去，而是想把重复劳动请出生活。","tone":"务实","kind":"learning","category":"life","source_hint":"Stack Overflow Survey 2025"}
{"action":"learn-ai","text":"你给 AI 写清楚上下文后，忽然理解了为什么家人也需要完整说明。","tone":"轻松","kind":"learning","category":"family","source_hint":"Microsoft AI work trend"}
{"action":"learn-ai","text":"你没有追每个新模型，只保留一个真正能减少加班的工具。","tone":"克制","kind":"learning","category":"consumption","source_hint":"Stack Overflow Survey 2025"}
{"action":"learn-ai","text":"教程收藏夹很满，但今晚你只学一个明天能用上的小技巧。","tone":"清醒","kind":"learning","category":"consumption","source_hint":"Reddit learning outside work"}
{"action":"learn-ai","text":"你让 AI 整理会议纪要，第一次会后没有像被通知轰炸过。","tone":"轻快","kind":"learning","category":"emotion","source_hint":"Microsoft digital debt"}
{"action":"learn-ai","text":"你把 AI 订阅写进预算表，发现焦虑也会按月自动扣款。","tone":"自嘲","kind":"learning","category":"consumption","source_hint":"Stack Overflow AI tools"}
{"action":"learn-ai","text":"你练 prompt 时顺手整理了家里的采购清单，工具终于服务了生活。","tone":"温和","kind":"learning","category":"home","source_hint":"GitLab async guide"}
{"action":"learn-ai","text":"你用 AI 帮父母解释体检报告，但重要结论仍决定去问医生。","tone":"谨慎","kind":"learning","category":"family","source_hint":"少数派 健康注意力"}
{"action":"learn-ai","text":"你把学习计划从“全栈精通”改成“别把自己学没电”。","tone":"清醒","kind":"learning","category":"health","source_hint":"Reddit burnout recovery"}
{"action":"learn-ai","text":"你发现 AI 工具最适合处理杂活，不适合替你陪家人吃饭。","tone":"温和","kind":"learning","category":"family","source_hint":"掘金 家庭平衡"}
{"action":"learn-ai","text":"你用 AI 生成菜单，今晚终于不是在外卖软件里做系统设计。","tone":"幽默","kind":"learning","category":"home","source_hint":"掘金 健康饮食"}
{"action":"learn-ai","text":"你把新技术学习安排到白天，拒绝让凌晨成为第二家公司。","tone":"坚定","kind":"learning","category":"health","source_hint":"Reddit learning outside work"}
{"action":"learn-ai","text":"你没有用 AI 证明自己永远在线，而是用它把下线变得更可能。","tone":"务实","kind":"learning","category":"emotion","source_hint":"Microsoft Work Trend Index"}
{"action":"learn-ai","text":"你把英文文档交给 AI 初筛，省下的时间用来给眼睛放假。","tone":"轻松","kind":"learning","category":"health","source_hint":"Stack Overflow Survey"}
{"action":"learn-ai","text":"你学会了一个自动化脚本，家务清单却提醒你现实世界还没接 API。","tone":"干幽默","kind":"learning","category":"home","source_hint":"GitLab handbook"}
{"action":"learn-ai","text":"你给自己设定学习截止时间，技术热情终于不再压榨睡眠。","tone":"克制","kind":"learning","category":"health","source_hint":"博客园 burnout"}
{"action":"learn-ai","text":"你研究 AI 简历优化，也顺手优化了面试时问生活边界的问题。","tone":"清醒","kind":"learning","category":"midlife","source_hint":"Stack Overflow Work"}
{"action":"learn-ai","text":"你把新工具分享给同事，却没有把它包装成下班后继续卷的理由。","tone":"温和","kind":"learning","category":"emotion","source_hint":"Reddit ExperiencedDevs"}
{"action":"learn-ai","text":"你用 AI 做周计划，第一项竟然是不要把周末排满。","tone":"轻快","kind":"learning","category":"life","source_hint":"Hacker News being boring"}
{"action":"learn-ai","text":"你终于承认，能少开一个会的工具比炫酷 demo 更救命。","tone":"务实","kind":"learning","category":"life","source_hint":"Microsoft infinite workday"}
{"action":"interview","text":"你在反问环节问通勤时间，面试官沉默两秒后开始讲弹性。","tone":"冷幽默","kind":"event","category":"commute","source_hint":"Reddit work-life salary"}
{"action":"interview","text":"新 offer 多给二十万，但每天少两个小时生活，你开始认真算总价。","tone":"清醒","kind":"event","category":"consumption","source_hint":"Reddit work-life balance salary"}
{"action":"interview","text":"你把“是否经常临时加班”写进清单，像给未来的自己加防火墙。","tone":"务实","kind":"event","category":"life","source_hint":"Hacker News burnout"}
{"action":"interview","text":"面试官说团队像家，你礼貌地追问这个家几点关灯。","tone":"讽刺","kind":"joke","category":"family","source_hint":"Buffer unplug"}
{"action":"interview","text":"你练系统设计，也练如何识别一家公司的透支设计。","tone":"清醒","kind":"learning","category":"midlife","source_hint":"HN developer burnout"}
{"action":"interview","text":"你更新简历不是冲动跳槽，是给中年焦虑留一个出口。","tone":"平静","kind":"event","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"interview","text":"你发现福利表里有健身房，却没有写清楚项目延期时谁保护睡眠。","tone":"尖锐","kind":"event","category":"health","source_hint":"博客园 加班原因"}
{"action":"interview","text":"对方夸免费晚餐，你想起家里的热饭其实也不收费。","tone":"苦笑","kind":"life","category":"family","source_hint":"V2EX 伴侣加班"}
{"action":"interview","text":"你问远程办公规则，不是想偷懒，是想知道家会不会变成办公室。","tone":"务实","kind":"event","category":"home","source_hint":"GitLab remote guide"}
{"action":"interview","text":"你把父母体检、孩子接送、通勤距离一起放进职业选择模型。","tone":"成熟","kind":"event","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"interview","text":"面试前你刷了两题算法，睡够八小时后竟然多想出一个边界条件。","tone":"轻松","kind":"health","category":"health","source_hint":"Reddit burnout recovery"}
{"action":"interview","text":"你没有只问涨薪，还问下班后消息是否默认明天再回。","tone":"清醒","kind":"event","category":"emotion","source_hint":"Buffer unable to unplug"}
{"action":"interview","text":"你开始挑公司像挑合租室友：作息、边界、噪音，一个都不能只听口头承诺。","tone":"务实","kind":"event","category":"home","source_hint":"GitLab All-Remote"}
{"action":"interview","text":"猎头说机会很热，你先打开地图看通勤是不是也很热。","tone":"干幽默","kind":"event","category":"commute","source_hint":"V2EX 通勤"}
{"action":"interview","text":"你把“稳定”从贬义词改回配置项，因为生活不是每天都能灰度发布。","tone":"平静","kind":"life","category":"midlife","source_hint":"少数派 海外远程"}
{"action":"interview","text":"你面试时问团队年龄结构，不是怕老，是怕只有燃烧年轻人的制度。","tone":"尖锐","kind":"event","category":"midlife","source_hint":"知乎 35岁危机"}
{"action":"interview","text":"你准备跳槽，也准备好解释为什么准点下班不是缺乏激情。","tone":"坚定","kind":"event","category":"life","source_hint":"Reddit ExperiencedDevs"}
{"action":"interview","text":"你把房贷、父母、睡眠和成长空间写在同一页，职业规划突然很现实。","tone":"沉稳","kind":"life","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"interview","text":"对方说节奏快，你追问快到什么程度，别让身体替你做压力测试。","tone":"清醒","kind":"health","category":"health","source_hint":"掘金 健康"}
{"action":"interview","text":"你拒绝了一个高薪高耗岗位，银行卡沉默，颈椎鼓掌。","tone":"黑色幽默","kind":"event","category":"health","source_hint":"Hacker News short commute"}
{"action":"side-project","text":"孩子睡着后你打开个人项目，十分钟后你也进入省电模式。","tone":"苦笑","kind":"life","category":"family","source_hint":"Reddit parenting developer"}
{"action":"side-project","text":"你的副业计划从改变世界降级为先别改变作息。","tone":"自嘲","kind":"learning","category":"health","source_hint":"Hacker News surviving job"}
{"action":"side-project","text":"你给个人项目删掉一半功能，终于给周末留了一半生活。","tone":"务实","kind":"learning","category":"life","source_hint":"Indie-style HN side projects"}
{"action":"side-project","text":"你不是不想做副业，只是家务也有自己的产品路线图。","tone":"幽默","kind":"life","category":"home","source_hint":"Reddit parenting developer"}
{"action":"side-project","text":"你把副项目安排在午后两小时，而不是凌晨两点的自我感动里。","tone":"清醒","kind":"learning","category":"health","source_hint":"Reddit burnout recovery"}
{"action":"side-project","text":"你想做一个赚钱工具，第一版先解决自己记账老忘的问题。","tone":"务实","kind":"learning","category":"consumption","source_hint":"Hacker News surviving job"}
{"action":"side-project","text":"个人项目没上线，但你学会了给兴趣设置边界，也算发布了自己。","tone":"温和","kind":"learning","category":"emotion","source_hint":"HN being boring"}
{"action":"side-project","text":"你没有把副业 KPI 化，保住了它作为爱好的最后一口气。","tone":"克制","kind":"life","category":"emotion","source_hint":"Hacker News being boring"}
{"action":"side-project","text":"你把开源 issue 留到明天，因为今晚家里的水龙头也在报 bug。","tone":"生活化","kind":"event","category":"home","source_hint":"掘金 周末家务"}
{"action":"side-project","text":"你给副项目买了域名，随后给自己买了菜，现金流短暂恢复理智。","tone":"自嘲","kind":"life","category":"consumption","source_hint":"Hacker News savings"}
{"action":"side-project","text":"你决定不再为每个灵感开仓库，硬盘和人生都需要归档策略。","tone":"干幽默","kind":"learning","category":"consumption","source_hint":"HN surviving job"}
{"action":"side-project","text":"你把副业宣传语写完，突然发现真正缺的是连续三晚好觉。","tone":"清醒","kind":"health","category":"health","source_hint":"博客园 burnout"}
{"action":"side-project","text":"你给 side project 设置每周上限，防止它从避风港变成第二个老板。","tone":"务实","kind":"learning","category":"emotion","source_hint":"Reddit work boundaries"}
{"action":"side-project","text":"你做了一个家庭待办小工具，伴侣说如果你先倒垃圾会更 MVP。","tone":"幽默","kind":"joke","category":"family","source_hint":"掘金 家庭平衡"}
{"action":"side-project","text":"你把个人产品定价表改了三次，最后决定先免费给自己的生活减负。","tone":"轻松","kind":"learning","category":"consumption","source_hint":"Hacker News savings"}
{"action":"side-project","text":"你想靠副业抵抗 35 岁焦虑，但今天先抵抗了熬夜冲动。","tone":"清醒","kind":"health","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"side-project","text":"你周末写了两小时代码，也陪家人看完一部电影，版本号不大但稳定。","tone":"温暖","kind":"life","category":"family","source_hint":"Reddit parenting developer"}
{"action":"side-project","text":"副项目又卡住了，但你没有迁怒生活，今天只是关机去散步。","tone":"平静","kind":"life","category":"emotion","source_hint":"HN developer burnout"}
{"action":"side-project","text":"你把梦想拆成小任务，第一项是别让梦想挤掉晚饭。","tone":"温和","kind":"learning","category":"life","source_hint":"Hacker News surviving job"}
{"action":"side-project","text":"你没有把每个周末都献给增长曲线，身体不是无限试用版。","tone":"坚定","kind":"health","category":"health","source_hint":"博客园 burnout"}
{"action":"networking","text":"你约老同学吃饭，整晚没有聊裁员，友情缓存命中率很高。","tone":"温暖","kind":"life","category":"emotion","source_hint":"Hacker News Are you ok"}
{"action":"networking","text":"远程办公久了，你发现真人寒暄比头像绿点更能回血。","tone":"轻松","kind":"life","category":"home","source_hint":"Buffer loneliness"}
{"action":"networking","text":"你参加线下技术小聚，最大的收获是确认大家也会累。","tone":"共鸣","kind":"event","category":"emotion","source_hint":"Reddit burnout"}
{"action":"networking","text":"朋友问你最近怎么样，你没有说忙，而是认真回答了三分钟。","tone":"温和","kind":"life","category":"emotion","source_hint":"HN Are you ok"}
{"action":"networking","text":"你和伴侣约定下班后先静处半小时，沟通终于不是抢占式调度。","tone":"成熟","kind":"life","category":"family","source_hint":"V2EX 伴侣加班"}
{"action":"networking","text":"你给父母打电话时没有边看日志，亲情连接质量明显上升。","tone":"温暖","kind":"life","category":"family","source_hint":"知乎 中年危机"}
{"action":"networking","text":"你参加羽毛球局，大家的共同语言从框架变成了膝盖。","tone":"幽默","kind":"health","category":"health","source_hint":"Reddit burnout recovery"}
{"action":"networking","text":"你请同事喝咖啡，不聊绩效，只确认彼此还像个人。","tone":"温和","kind":"life","category":"emotion","source_hint":"Microsoft digital debt"}
{"action":"networking","text":"你把朋友圈从招聘广告里救出来，发了一张晚霞。","tone":"轻松","kind":"life","category":"life","source_hint":"HN being boring"}
{"action":"networking","text":"你约了同城远程工友午饭，发现大家的厨房都快变成办公室了。","tone":"共鸣","kind":"event","category":"home","source_hint":"GitLab remote guide"}
{"action":"networking","text":"你和伴侣复盘本周家务，不用 Jira，但也有负责人和截止日。","tone":"幽默","kind":"life","category":"family","source_hint":"Reddit parenting developer"}
{"action":"networking","text":"你没有在饭桌上解释微服务，家人对此表示这顿饭很成功。","tone":"轻快","kind":"life","category":"family","source_hint":"掘金 家庭平衡"}
{"action":"networking","text":"你和朋友散步一小时，步数上涨，精神负债下降。","tone":"治愈","kind":"health","category":"health","source_hint":"Reddit ExperiencedDevs"}
{"action":"networking","text":"你请教前辈如何过中年，对方先问你睡眠和体检。","tone":"清醒","kind":"event","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"networking","text":"你和老同事聊跳槽，最后结论是短通勤也算核心福利。","tone":"务实","kind":"event","category":"commute","source_hint":"Hacker News short commute"}
{"action":"networking","text":"你给孩子讲故事时没有接电话，今晚的主线程留给了家庭。","tone":"温暖","kind":"life","category":"family","source_hint":"Reddit parenting developer"}
{"action":"networking","text":"你把社交从线上表情包升级成线下吃面，延迟显著降低。","tone":"轻松","kind":"life","category":"life","source_hint":"Buffer loneliness"}
{"action":"networking","text":"你和伴侣讨论预算，键盘、椅子、体检和旅行终于同桌谈判。","tone":"生活化","kind":"life","category":"consumption","source_hint":"V2EX 家庭压力"}
{"action":"networking","text":"你没有把坏情绪带回家，而是在楼下多走了一圈再进门。","tone":"克制","kind":"health","category":"family","source_hint":"V2EX 伴侣加班"}
{"action":"networking","text":"你和朋友约定每月见一次，不靠算法推荐维持关系。","tone":"温和","kind":"life","category":"emotion","source_hint":"HN Are you ok"}
{"action":"rest","text":"你把机械键盘声音调小，邻居和伴侣都从噪音告警中恢复。","tone":"幽默","kind":"life","category":"home","source_hint":"V2EX 居家办公"}
{"action":"rest","text":"你没有再买第三把人体工学椅，而是站起来走了十分钟。","tone":"自嘲","kind":"health","category":"consumption","source_hint":"掘金 程序员健康"}
{"action":"rest","text":"咖啡续杯前你先喝水，身体终于收到一个不是咖啡因的请求。","tone":"轻松","kind":"health","category":"health","source_hint":"掘金 健康饮食"}
{"action":"rest","text":"你把 NAS 购物车清空，今天的备份目标改成备份体力。","tone":"干幽默","kind":"life","category":"consumption","source_hint":"HN savings"}
{"action":"rest","text":"你给显示器贴了护眼模式，却发现真正护眼的是准点关机。","tone":"清醒","kind":"health","category":"consumption","source_hint":"掘金 程序员健康"}
{"action":"rest","text":"你把外卖会员取消了，决定每周至少做两顿像样的饭。","tone":"朴素","kind":"health","category":"consumption","source_hint":"掘金 健康饮食"}
{"action":"rest","text":"你没有用买设备解决所有问题，毕竟焦虑不支持七天无理由退货。","tone":"讽刺","kind":"life","category":"consumption","source_hint":"Hacker News savings"}
{"action":"rest","text":"你给自己买了体检套餐，第一次感觉消费不是为了提升战斗力。","tone":"务实","kind":"health","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"rest","text":"你把键盘灯关成单色，家里终于不像电竞版监控中心。","tone":"轻松","kind":"life","category":"home","source_hint":"GitLab home office"}
{"action":"rest","text":"你清理桌面线缆，顺便清理了几个拖了太久的坏心情。","tone":"治愈","kind":"life","category":"home","source_hint":"GitLab remote guide"}
{"action":"overtime","text":"你在家加班时猫路过键盘，成功提交了一段更诚实的乱码。","tone":"幽默","kind":"joke","category":"home","source_hint":"Buffer remote work"}
{"action":"rest","text":"你把书桌搬离床边，睡眠和工作终于不再共用一个端口。","tone":"务实","kind":"health","category":"home","source_hint":"GitLab All-Remote"}
{"action":"rest","text":"今天你没有研究新桌搭，只研究怎么把周末留白。","tone":"克制","kind":"life","category":"consumption","source_hint":"HN being boring"}
{"action":"rest","text":"你把通勤包减重，像给每天的自己少背一个隐藏需求。","tone":"轻松","kind":"life","category":"commute","source_hint":"V2EX 双城通勤"}
{"action":"rest","text":"雨天你选择早点出门，少一点狼狈，多一点可控。","tone":"平静","kind":"life","category":"commute","source_hint":"V2EX 通勤"}
{"action":"rest","text":"你把骑车回家当作下班缓冲，风把会议残留吹掉了一些。","tone":"治愈","kind":"health","category":"commute","source_hint":"Hacker News short commute"}
{"action":"rest","text":"你没有在公交上刷题，给眼睛看了一路真实世界。","tone":"温和","kind":"health","category":"commute","source_hint":"Reddit learning outside work"}
{"action":"rest","text":"搬近公司后房租涨了，但每天多出的半小时像隐形年终奖。","tone":"务实","kind":"life","category":"commute","source_hint":"HN short commute"}
{"action":"rest","text":"你终于不再把两小时通勤叫作适应能力，而叫成本。","tone":"清醒","kind":"life","category":"commute","source_hint":"V2EX 通勤"}
{"action":"overtime","text":"错过高铁后，你发现双城生活的容错率比线上系统还低。","tone":"苦笑","kind":"event","category":"commute","source_hint":"V2EX 北京郑州"}
{"action":"rest","text":"你这个周末没有跨城奔波，内疚还在，但身体先松了一口气。","tone":"酸涩","kind":"health","category":"family","source_hint":"V2EX 通勤内疚"}
{"action":"rest","text":"你把回家的票提前买好，至少让陪伴不再依赖抢票脚本。","tone":"温和","kind":"life","category":"family","source_hint":"V2EX 双城通勤"}
{"action":"interview","text":"你比较两个城市的机会，发现医院、学校和父母距离也在参与面试。","tone":"成熟","kind":"event","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"rest","text":"你没有把降薪回老家简单叫失败，因为通勤时间也会吃人生。","tone":"清醒","kind":"life","category":"midlife","source_hint":"V2EX 回二线"}
{"action":"interview","text":"你开始在 offer 表旁边加一列：是否还能陪孩子吃晚饭。","tone":"温暖","kind":"event","category":"family","source_hint":"Reddit parenting developer"}
{"action":"rest","text":"你把父母的复诊时间写进日历，人生待办不只有上线日期。","tone":"沉稳","kind":"life","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"rest","text":"35 岁没有突然爆炸，但体检报告会很诚实地提醒版本老化。","tone":"黑色幽默","kind":"health","category":"midlife","source_hint":"知乎 35岁危机"}
{"action":"learn-ai","text":"你学新东西时不再幻想一招翻盘，只求让未来少一点被动。","tone":"沉稳","kind":"learning","category":"midlife","source_hint":"知乎 中年危机"}
{"action":"interview","text":"你开始接受普通稳定的岗位，毕竟家里的系统不需要天天重构。","tone":"平静","kind":"life","category":"midlife","source_hint":"少数派 海外远程"}
{"action":"rest","text":"你给自己留了应急金，焦虑没有消失，但声音小了一档。","tone":"务实","kind":"life","category":"consumption","source_hint":"Hacker News surviving job"}
```
