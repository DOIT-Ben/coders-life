# 程序员生活共鸣弹窗候选 round16

研究子智能体：A  
生成时间：2026-06-18  
写入范围：仅本文件，未修改正式数据池、HTML、tools、data。

## 来源列表

1. Reddit / r/cscareerquestions：下班后仍想着项目、职业倦怠、软件工程师为什么容易 burnout 等讨论。
2. Reddit / r/ExperiencedDevs：资深工程师接近倦怠后的恢复、转岗、运动和边界感经验。
3. Reddit / r/datascience：如何停止把工作任务带回家、用纸笔清空脑内任务队列。
4. Reddit / r/SoftwareEngineering：下班后仍忍不住想代码、冥想和工作边界讨论。
5. Hacker News：Ask HN / Tell HN 中关于 burnout、离开科技行业、工作生活平衡、下班后停止想工作的讨论。
6. Stack Overflow Blog：开发者幸福感中薪资、工作生活平衡、灵活性、成长机会等因素。
7. Workplace StackExchange：早期职业压力、长工时、假期工作与 work-life-balance 建议。
8. dev.to：开发者即使热爱工作也会出现隐性 burnout 的个人化复盘。
9. V2EX：程序员加班伴侣相处、长期远程心理压力、远程效率、下班疲惫、双城通勤、消费复杂化、30 岁焦虑等讨论。
10. 知乎：程序员生活状态、副业、长期加班健康、失业与中年危机等问答。
11. 掘金：程序员在家庭、工作、健康之间找平衡，周末恢复和程序员高强度工作话题。
12. 博客园：程序员加班原因、职业倦怠恢复、睡眠饮食、不要用加班证明自己等文章。
13. 少数派：远程办公、数字游民、睡眠习惯、回二线城市和远程协作经验。
14. Lobsters：找回软件热情、个人时间与公司时间边界、程序员身份认同讨论。
15. Indie Hackers：全职工作后做副业、孩子与 side project、开发者为什么做个人产品等讨论。

## 主题簇总结

- 情绪与边界：很多程序员不是只被工时压垮，而是被“脑子一直在线”消耗；可共鸣点包括睡前想 bug、周末被需求影子追着跑、用纸笔或运动强制切换上下文。
- 健康与恢复：睡眠、眼睛、颈椎、饮食、久坐、运动和体检是高频生活底层主题；适合做成轻微自嘲但不鼓励透支的弹窗。
- 家庭与社交：伴侣、孩子、父母、异地、远程孤独、朋友饭局错过，都是程序员生活中比“写代码”更强的真实压力源。
- 通勤与居住：双城往返、地铁脑内复盘、远程办公、租房工位、居家边界，能扩展游戏中非办公室场景。
- 消费与生活复杂度：程序员常用“提高效率”合理化设备、课程、会员、人体工学椅、NAS、键盘等消费；也会突然消费降级。
- 副业与学习：side project、AI 工具、面试准备、开源热情和家庭时间冲突，适合连接行动按钮 `learn-ai`、`side-project`、`interview`。

## JSONL 候选

```jsonl
{"action":"rest","text":"你把电脑合上了，脑内的服务却还在自动重启。","tone":"苦笑","kind":"life","category":"emotion","source_hint":"Reddit:cscareerquestions"}
{"action":"rest","text":"洗澡时突然想通一个 bug，但你决定先把洗发水冲干净。","tone":"轻松","kind":"life","category":"home","source_hint":"Reddit:SoftwareEngineering"}
{"action":"rest","text":"今天的下班仪式是把工位灯关掉，也把大脑的 debug 模式关小一点。","tone":"温和","kind":"health","category":"emotion","source_hint":"Reddit:datascience"}
{"action":"rest","text":"你写下明天再处理的三件事，焦虑终于从内存落盘。","tone":"治愈","kind":"health","category":"emotion","source_hint":"Reddit:datascience"}
{"action":"rest","text":"你决定不在床上看告警群，至少让枕头保持中立。","tone":"干幽默","kind":"health","category":"home","source_hint":"HackerNews:work-after-hours"}
{"action":"overtime","text":"需求像远程会议一样，结束按钮总在最不起眼的角落。","tone":"讽刺","kind":"joke","category":"life","source_hint":"V2EX:remote-work"}
{"action":"overtime","text":"你说只是改个文案，结果顺手查了半个调用链。","tone":"自嘲","kind":"joke","category":"life","source_hint":"博客园:加班原因"}
{"action":"rest","text":"今天没有打开 IDE 的夜晚，看起来有点陌生，但很健康。","tone":"平静","kind":"health","category":"health","source_hint":"博客园:burnout-recovery"}
{"action":"networking","text":"你和朋友吃饭时没有聊框架，友情版本号稳定上升。","tone":"温暖","kind":"life","category":"social","source_hint":"V2EX:远程孤独"}
{"action":"networking","text":"远程办公第 N 天，你发现人类的语音包不能只靠 Slack 更新。","tone":"苦笑","kind":"life","category":"social","source_hint":"V2EX:远程心理压力"}
{"action":"networking","text":"你约同城程序员线下喝咖啡，大家第一句话都是：你也真人存在啊。","tone":"幽默","kind":"event","category":"social","source_hint":"V2EX:远程孤独"}
{"action":"rest","text":"你把手机放到客厅充电，卧室终于不像二级值班室。","tone":"温和","kind":"health","category":"home","source_hint":"少数派:睡眠习惯"}
{"action":"rest","text":"今晚 11 点前睡觉，比修掉一个低优先级 bug 更稀有。","tone":"自嘲","kind":"health","category":"health","source_hint":"少数派:睡眠习惯"}
{"action":"rest","text":"你用散步替代刷短视频，缓存清理效果意外不错。","tone":"轻松","kind":"health","category":"health","source_hint":"HackerNews:burnout"}
{"action":"overtime","text":"项目延期不是你的锅，但锅盖又放在你键盘旁边。","tone":"讽刺","kind":"event","category":"emotion","source_hint":"博客园:项目管理混乱"}
{"action":"overtime","text":"老板说大家再坚持一下，你听见颈椎先叹了口气。","tone":"黑色幽默","kind":"health","category":"health","source_hint":"掘金:高强度工时"}
{"action":"rest","text":"你准点下班，电梯里的自己像刚通过了单元测试。","tone":"轻快","kind":"life","category":"life","source_hint":"WorkplaceSE:work-life-balance"}
{"action":"rest","text":"你拒绝了临睡前的“顺手看一眼”，保住了八小时睡眠 SLA。","tone":"克制","kind":"health","category":"health","source_hint":"博客园:职业倦怠恢复"}
{"action":"learn-ai","text":"你学 AI 工具不是为了卷死自己，而是为了把重复活外包给硅基同事。","tone":"务实","kind":"learning","category":"life","source_hint":"StackOverflowBlog:developer-happiness"}
{"action":"learn-ai","text":"你让 AI 总结会议纪要，第一次觉得会后脑子没有冒烟。","tone":"轻松","kind":"learning","category":"life","source_hint":"少数派:远程协作"}
{"action":"learn-ai","text":"教程收藏夹又涨了，但你今天只学一个能明天用上的功能。","tone":"克制","kind":"learning","category":"consumption","source_hint":"V2EX:生活复杂化"}
{"action":"learn-ai","text":"你把 prompt 写得像需求文档，AI 终于不像实习生乱猜。","tone":"幽默","kind":"learning","category":"life","source_hint":"dev.to:developer-burnout"}
{"action":"learn-ai","text":"你没有追完所有新模型，只给自己留了一个可维护的学习分支。","tone":"平静","kind":"learning","category":"emotion","source_hint":"Lobsters:identity"}
{"action":"side-project","text":"副业计划从今晚重构世界，降级为先做一个能登录的页面。","tone":"自嘲","kind":"learning","category":"life","source_hint":"IndieHackers:side-project-time"}
{"action":"side-project","text":"孩子睡着后你打开编辑器，十分钟后发现自己也进入休眠。","tone":"苦笑","kind":"life","category":"family","source_hint":"IndieHackers:children-side-project"}
{"action":"side-project","text":"你给个人项目砍掉三十个功能，MVP 终于像个能出生的东西。","tone":"务实","kind":"learning","category":"life","source_hint":"IndieHackers:side-project-time"}
{"action":"side-project","text":"你的 side project 不是辞职宣言，只是给好奇心留的后门。","tone":"温和","kind":"learning","category":"emotion","source_hint":"Lobsters:software-mojo"}
{"action":"side-project","text":"你决定每晚只写二十分钟，长期主义终于不再像营销词。","tone":"坚定","kind":"learning","category":"life","source_hint":"IndieHackers:time-management"}
{"action":"interview","text":"你更新简历不是马上跑路，是给焦虑买一份保险。","tone":"冷静","kind":"event","category":"emotion","source_hint":"Reddit:job-boundaries"}
{"action":"interview","text":"面试题刷到一半，你突然意识到睡眠也是一种核心竞争力。","tone":"自嘲","kind":"health","category":"health","source_hint":"知乎:加班健康"}
{"action":"interview","text":"你把“能否准点下班”写进反问清单，成熟度加一。","tone":"务实","kind":"event","category":"life","source_hint":"HackerNews:burnout-interview"}
{"action":"interview","text":"候选人问 work-life balance 时，会议室空气短暂进入只读模式。","tone":"讽刺","kind":"joke","category":"life","source_hint":"WorkplaceSE:work-life-balance"}
{"action":"interview","text":"你练习系统设计，也练习判断一家公司是不是系统性透支人。","tone":"清醒","kind":"learning","category":"emotion","source_hint":"HackerNews:burnout"}
{"action":"overtime","text":"线上故障发生在晚饭前，筷子被迫进入待机状态。","tone":"苦笑","kind":"event","category":"family","source_hint":"V2EX:伴侣与加班"}
{"action":"overtime","text":"你给家人说马上好，服务器也这么对你说。","tone":"黑色幽默","kind":"joke","category":"family","source_hint":"V2EX:伴侣与加班"}
{"action":"overtime","text":"周末需求冒泡，家庭群和工作群开始争抢你的注意力锁。","tone":"焦虑","kind":"event","category":"family","source_hint":"HackerNews:work-life-balance"}
{"action":"rest","text":"你陪家人散步，没有带电脑，只有手环记录你还活着。","tone":"温暖","kind":"health","category":"family","source_hint":"掘金:家庭工作健康平衡"}
{"action":"rest","text":"今天的亲子时间没有后台任务，孩子对你的可用性表示满意。","tone":"温和","kind":"life","category":"family","source_hint":"IndieHackers:children-side-project"}
{"action":"networking","text":"你认真回复伴侣的消息，而不是像处理工单一样标记已读。","tone":"温暖","kind":"life","category":"family","source_hint":"V2EX:伴侣与加班"}
{"action":"rest","text":"你告诉伴侣今晚只想安静半小时，这次需求说明写得很清楚。","tone":"诚恳","kind":"life","category":"family","source_hint":"V2EX:伴侣与加班"}
{"action":"networking","text":"朋友约你打球，你本想拒绝，膝盖却抢先点击了接受。","tone":"轻快","kind":"health","category":"social","source_hint":"Reddit:burnout-recovery"}
{"action":"rest","text":"你发现健身房的跑步机不会问你这个接口为什么慢。","tone":"幽默","kind":"health","category":"health","source_hint":"Reddit:ExperiencedDevs"}
{"action":"rest","text":"二十分钟力量训练后，焦虑从 P0 降到 P2。","tone":"轻松","kind":"health","category":"health","source_hint":"Reddit:ExperiencedDevs"}
{"action":"rest","text":"你站起来倒水，顺便让腰椎从阻塞队列里出来。","tone":"干幽默","kind":"health","category":"health","source_hint":"博客园:职业倦怠恢复"}
{"action":"rest","text":"眼药水滴下去那刻，你和显示器达成临时停火协议。","tone":"自嘲","kind":"health","category":"health","source_hint":"知乎:加班健康"}
{"action":"rest","text":"你把午饭从键盘旁边挪到餐桌，生活分层终于合理。","tone":"温和","kind":"health","category":"home","source_hint":"博客园:健康饮食"}
{"action":"rest","text":"今天早餐有蛋白质，不再只靠咖啡冒充初始化脚本。","tone":"轻松","kind":"health","category":"health","source_hint":"博客园:burnout-recovery"}
{"action":"overtime","text":"咖啡续杯成功，但灵魂提示余额不足。","tone":"黑色幽默","kind":"joke","category":"health","source_hint":"dev.to:hidden-burnout"}
{"action":"rest","text":"你关掉夜间外卖页面，胃部服务发来感谢日志。","tone":"温和","kind":"health","category":"consumption","source_hint":"少数派:睡眠习惯"}
{"action":"rest","text":"你的智能手表提醒久坐，像一个不懂人情世故的 PM。","tone":"幽默","kind":"joke","category":"health","source_hint":"StackOverflowBlog:developer-happiness"}
{"action":"rest","text":"你决定今天不补觉到中午，生物钟合并冲突减少。","tone":"克制","kind":"health","category":"health","source_hint":"少数派:睡眠习惯"}
{"action":"rest","text":"你把周末第一小时留给阳光，而不是未读消息。","tone":"治愈","kind":"health","category":"life","source_hint":"少数派:睡眠习惯"}
{"action":"networking","text":"你参加线下技术沙龙，收获最大的是发现大家都在掉头发。","tone":"自嘲","kind":"joke","category":"social","source_hint":"Lobsters:community"}
{"action":"networking","text":"你在同事茶水间聊猫，团队协作突然比站会更顺。","tone":"轻松","kind":"life","category":"social","source_hint":"V2EX:远程效率"}
{"action":"networking","text":"你给前同事发消息，不是内推，只是确认彼此还没被 Jira 吞掉。","tone":"温和","kind":"life","category":"social","source_hint":"Reddit:ExperiencedDevs"}
{"action":"networking","text":"远程会议开太久，你开始怀念办公室里不用预约的闲聊。","tone":"苦笑","kind":"life","category":"social","source_hint":"V2EX:远程效率"}
{"action":"networking","text":"你给自己安排一次面对面聊天，像给孤独打了个热补丁。","tone":"温暖","kind":"health","category":"social","source_hint":"V2EX:远程心理压力"}
{"action":"networking","text":"社交恢复不是去人群里表演，而是找一个不用解释上下文的人。","tone":"平静","kind":"health","category":"social","source_hint":"HackerNews:burnout"}
{"action":"rest","text":"地铁门关上，你的脑子还在跑昨天没跑完的测试。","tone":"苦笑","kind":"life","category":"commute","source_hint":"知乎:程序员生活状态"}
{"action":"rest","text":"通勤路上你没有刷工作群，窗外风景短暂获得渲染资源。","tone":"轻松","kind":"life","category":"commute","source_hint":"知乎:程序员生活状态"}
{"action":"rest","text":"早高峰像压力测试，区别是没人给你扩容。","tone":"讽刺","kind":"joke","category":"commute","source_hint":"V2EX:双城通勤"}
{"action":"rest","text":"你在高铁上合上电脑，决定这趟车只运送人，不运送需求。","tone":"清醒","kind":"life","category":"commute","source_hint":"V2EX:北京郑州通勤"}
{"action":"rest","text":"周五抢票失败，你突然理解什么叫生活层面的资源竞争。","tone":"苦笑","kind":"event","category":"commute","source_hint":"V2EX:双城通勤"}
{"action":"rest","text":"双城生活让你掌握了火车时刻表，也消耗了周末血条。","tone":"疲惫","kind":"life","category":"commute","source_hint":"V2EX:北京郑州通勤"}
{"action":"rest","text":"你算了一下通勤成本，发现时间才是最贵的云服务。","tone":"清醒","kind":"life","category":"commute","source_hint":"少数派:回二线城市"}
{"action":"rest","text":"远程办公省下的通勤，被你的一日三餐和自律重新分配。","tone":"务实","kind":"life","category":"home","source_hint":"少数派:远程办公"}
{"action":"rest","text":"你把书桌从卧室挪出去，睡眠环境终于不再像测试环境。","tone":"温和","kind":"health","category":"home","source_hint":"Reddit:cscareerquestions"}
{"action":"rest","text":"居家办公最难的不是开会，是让家人相信你真的在上班。","tone":"幽默","kind":"life","category":"home","source_hint":"少数派:远程办公指南"}
{"action":"networking","text":"家里有人喊你吃水果，你从代码世界被温柔地中断。","tone":"温暖","kind":"life","category":"family","source_hint":"V2EX:伴侣与加班"}
{"action":"rest","text":"你给门上贴了专注时间，家猫选择无视权限系统。","tone":"轻松","kind":"joke","category":"home","source_hint":"少数派:远程办公指南"}
{"action":"rest","text":"居家办公一天后，你发现关电脑不等于下班，还要关心态。","tone":"苦笑","kind":"health","category":"home","source_hint":"Lobsters:personal-time"}
{"action":"rest","text":"你给工作电脑单独建账号，像给生活加了一层防火墙。","tone":"务实","kind":"health","category":"home","source_hint":"Reddit:programming-after-work"}
{"action":"rest","text":"厨房没有 Sprint，只有锅里的番茄汤按自己的节奏冒泡。","tone":"治愈","kind":"life","category":"home","source_hint":"少数派:睡眠与生活"}
{"action":"rest","text":"你收拾桌面时发现三根数据线和一个失踪已久的周末。","tone":"自嘲","kind":"joke","category":"home","source_hint":"V2EX:生活复杂化"}
{"action":"side-project","text":"你想买新键盘提高效率，最后发现真正缺的是早点睡。","tone":"自嘲","kind":"joke","category":"consumption","source_hint":"V2EX:消费复杂化"}
{"action":"learn-ai","text":"你取消了五门课的订单，决定先学完已经打开的那一节。","tone":"克制","kind":"learning","category":"consumption","source_hint":"V2EX:生活复杂化"}
{"action":"rest","text":"人体工学椅救不了所有疲惫，但至少提醒你别坐成问号。","tone":"轻松","kind":"health","category":"consumption","source_hint":"少数派:健康生活"}
{"action":"side-project","text":"你买了域名三年，项目仍停留在 README 的愿景部分。","tone":"自嘲","kind":"joke","category":"consumption","source_hint":"IndieHackers:side-projects"}
{"action":"learn-ai","text":"订阅太多工具后，你终于把“取消续费”加入生产力系统。","tone":"干幽默","kind":"life","category":"consumption","source_hint":"V2EX:消费复杂化"}
{"action":"rest","text":"你把购物车清空，TODO 列表却露出了被遮住的真实愿望。","tone":"清醒","kind":"life","category":"consumption","source_hint":"V2EX:生活复杂化"}
{"action":"rest","text":"消费降级第一天，你发现普通水杯也能装咖啡。","tone":"轻松","kind":"joke","category":"consumption","source_hint":"V2EX:生活复杂化"}
{"action":"rest","text":"你没买新显示器，但给自己买了半天不看屏幕的时间。","tone":"温和","kind":"health","category":"consumption","source_hint":"博客园:burnout-recovery"}
{"action":"side-project","text":"你的 NAS 还没配好，家人已经学会把它叫做那台很贵的盒子。","tone":"幽默","kind":"joke","category":"family","source_hint":"V2EX:消费复杂化"}
{"action":"learn-ai","text":"你意识到效率工具的尽头不是更多工具，而是少一点打断。","tone":"清醒","kind":"learning","category":"consumption","source_hint":"少数派:远程协作"}
{"action":"rest","text":"你把周末从补觉和补需求中切出一块，命名为真的周末。","tone":"坚定","kind":"health","category":"life","source_hint":"掘金:延长周末体验"}
{"action":"rest","text":"周六早上没有闹钟，你的灵魂终于不是被 cron 拉起。","tone":"轻松","kind":"life","category":"life","source_hint":"少数派:睡眠习惯"}
{"action":"rest","text":"你决定今天不学习新框架，旧身体也需要维护版本。","tone":"温和","kind":"health","category":"health","source_hint":"dev.to:hidden-burnout"}
{"action":"learn-ai","text":"你给学习计划加了休息日，避免把自己训练成崩溃模型。","tone":"务实","kind":"learning","category":"health","source_hint":"Reddit:ExperiencedDevs"}
{"action":"overtime","text":"凌晨合并代码时，你怀疑月亮也是值班同事。","tone":"黑色幽默","kind":"joke","category":"emotion","source_hint":"知乎:加班健康"}
{"action":"overtime","text":"你说再改最后一个 bug，生活在旁边默默新建了 issue。","tone":"苦笑","kind":"life","category":"emotion","source_hint":"HackerNews:burnout"}
{"action":"rest","text":"你承认自己累了，这不是异常退出，是健康检查通过。","tone":"温和","kind":"health","category":"emotion","source_hint":"dev.to:hidden-burnout"}
{"action":"rest","text":"你没有用热爱抵消疲惫，因为热爱也需要充电器。","tone":"清醒","kind":"health","category":"emotion","source_hint":"Lobsters:software-mojo"}
{"action":"rest","text":"今天不证明自己能扛，只证明自己会停。","tone":"坚定","kind":"health","category":"emotion","source_hint":"博客园:不要加班"}
{"action":"networking","text":"你在群里求助睡眠问题，收到的不是方案，是一排同病相怜。","tone":"苦笑","kind":"life","category":"social","source_hint":"V2EX:下班疲惫"}
{"action":"networking","text":"和朋友聊天十分钟，比看三篇职业规划文章更有效。","tone":"温暖","kind":"health","category":"social","source_hint":"V2EX:远程孤独"}
{"action":"networking","text":"你发现同事也在焦虑 30 岁，年龄危机突然变成多人副本。","tone":"苦笑","kind":"event","category":"social","source_hint":"V2EX:30岁焦虑"}
{"action":"networking","text":"你向前辈请教转岗，得到的第一条建议是先睡够。","tone":"温和","kind":"health","category":"social","source_hint":"Reddit:ExperiencedDevs"}
{"action":"interview","text":"你问面试官团队如何处理线上值班，对方沉默得像无响应接口。","tone":"讽刺","kind":"event","category":"life","source_hint":"HackerNews:interview-culture"}
{"action":"interview","text":"你把简历里的全栈改成会照顾边界的后端，顿时真实很多。","tone":"自嘲","kind":"joke","category":"emotion","source_hint":"WorkplaceSE:stress"}
{"action":"interview","text":"刷题到深夜时，你发现最难的题叫如何长期工作而不坏掉。","tone":"清醒","kind":"health","category":"health","source_hint":"知乎:程序员健康"}
{"action":"interview","text":"你开始关注医保、年假和通勤，而不是只看技术栈多炫。","tone":"成熟","kind":"life","category":"life","source_hint":"StackOverflowBlog:developer-happiness"}
{"action":"interview","text":"HR 说公司像家，你默默确认这家有没有凌晨叫人起床修水管。","tone":"干幽默","kind":"joke","category":"family","source_hint":"HackerNews:work-life-balance"}
{"action":"side-project","text":"你给副业设置不侵占家庭时间的限制，项目进度慢了，人没碎。","tone":"务实","kind":"life","category":"family","source_hint":"IndieHackers:children-side-project"}
{"action":"side-project","text":"周末你没有写代码，只带孩子去公园，项目没有死，关系活了。","tone":"温暖","kind":"life","category":"family","source_hint":"IndieHackers:children-side-project"}
{"action":"side-project","text":"你把个人项目从伟大产品改成小工具，快乐反而回来了。","tone":"轻松","kind":"learning","category":"emotion","source_hint":"IndieHackers:scratch-own-itch"}
{"action":"side-project","text":"下班后还想写代码时，你先问自己是热爱还是逃避。","tone":"清醒","kind":"health","category":"emotion","source_hint":"Lobsters:identity"}
{"action":"side-project","text":"你把开源 issue 留到周日早上，不让周六晚上再变成工作日。","tone":"克制","kind":"learning","category":"life","source_hint":"Lobsters:personal-time"}
{"action":"learn-ai","text":"你让 AI 帮你列晚餐菜单，终于把算法用在生活上。","tone":"轻松","kind":"life","category":"home","source_hint":"少数派:生活效率"}
{"action":"learn-ai","text":"你用 AI 写运动计划，第一条建议是离开椅子，准确得冒犯。","tone":"幽默","kind":"health","category":"health","source_hint":"少数派:健康生活"}
{"action":"learn-ai","text":"AI 推荐你休息，你第一次觉得机器比排期表有人性。","tone":"苦笑","kind":"health","category":"emotion","source_hint":"dev.to:hidden-burnout"}
{"action":"learn-ai","text":"你用 AI 整理家庭预算，发现最大的 bug 是冲动下单。","tone":"自嘲","kind":"life","category":"consumption","source_hint":"V2EX:消费复杂化"}
{"action":"learn-ai","text":"你让 AI 解释体检报告，但还是决定去问真正的医生。","tone":"谨慎","kind":"health","category":"health","source_hint":"知乎:健康讨论"}
{"action":"overtime","text":"晚饭热了三次，需求评审还在讨论按钮文案。","tone":"讽刺","kind":"event","category":"family","source_hint":"V2EX:伴侣与加班"}
{"action":"overtime","text":"你在工位吃夜宵，胃和代码一起进入技术债状态。","tone":"黑色幽默","kind":"health","category":"health","source_hint":"知乎:加班健康"}
{"action":"overtime","text":"加班餐很香，但自由时间被悄悄扣费。","tone":"苦笑","kind":"life","category":"consumption","source_hint":"博客园:加班原因"}
{"action":"overtime","text":"你以为今天能准点走，日历却弹出一个临时会议伏击。","tone":"无奈","kind":"event","category":"life","source_hint":"Lobsters:busy-at-work"}
{"action":"overtime","text":"会议从同步进度变成同步疲惫，大家都在线但没人满电。","tone":"苦笑","kind":"health","category":"emotion","source_hint":"dev.to:hidden-burnout"}
{"action":"rest","text":"你关掉电脑后去洗碗，真实世界的 bug 至少能用水冲掉。","tone":"轻松","kind":"life","category":"home","source_hint":"少数派:居家生活"}
{"action":"rest","text":"阳台上的衣服干了，提醒你除了构建流水线还有生活流水线。","tone":"温和","kind":"life","category":"home","source_hint":"V2EX:生活复杂化"}
{"action":"rest","text":"你拖完地后发现，干净房间比干净架构更快见效。","tone":"轻松","kind":"life","category":"home","source_hint":"少数派:居家整理"}
{"action":"rest","text":"冰箱里终于有菜，你的晚餐不再依赖第三方 API。","tone":"幽默","kind":"health","category":"home","source_hint":"博客园:健康饮食"}
{"action":"rest","text":"你给家里路由器重启，也顺手给自己重启了一杯热茶。","tone":"温和","kind":"life","category":"home","source_hint":"少数派:远程办公"}
{"action":"rest","text":"你在公交上背单词，结果最熟的是下一站请下车。","tone":"轻松","kind":"learning","category":"commute","source_hint":"知乎:程序员生活状态"}
{"action":"rest","text":"通勤时听技术播客，耳朵学会了，手还在扶栏杆。","tone":"幽默","kind":"learning","category":"commute","source_hint":"知乎:程序员生活状态"}
{"action":"rest","text":"你把通勤当缓冲区，到家时尽量不把工作脏数据带进去。","tone":"务实","kind":"health","category":"commute","source_hint":"Reddit:work-boundaries"}
{"action":"rest","text":"地铁信号断了，工作消息终于被物理隔离。","tone":"轻松","kind":"life","category":"commute","source_hint":"V2EX:通勤生活"}
{"action":"rest","text":"你骑车回家，风把 standup 里没说完的话吹散了一点。","tone":"治愈","kind":"health","category":"commute","source_hint":"HackerNews:step-away-screen"}
{"action":"networking","text":"你主动约老同学吃饭，发现大家都在自己的系统里打补丁。","tone":"温和","kind":"life","category":"social","source_hint":"V2EX:30岁焦虑"}
{"action":"networking","text":"你参加婚礼被问工资，回答比处理线上事故更需要降噪。","tone":"苦笑","kind":"event","category":"family","source_hint":"知乎:程序员生活"}
{"action":"networking","text":"家里人问你是不是每天修电脑，你决定今天不解释微服务。","tone":"幽默","kind":"joke","category":"family","source_hint":"知乎:程序员生活状态"}
{"action":"networking","text":"父母说少熬夜，你这次没有反驳，因为监控曲线也这么说。","tone":"温和","kind":"health","category":"family","source_hint":"知乎:加班健康"}
{"action":"networking","text":"你给父母装好视频通话，远程支持终于服务到真正重要的人。","tone":"温暖","kind":"life","category":"family","source_hint":"少数派:远程协作"}
{"action":"rest","text":"你拒绝把年假用来补项目坑，年假终于回归人类用途。","tone":"坚定","kind":"life","category":"life","source_hint":"HackerNews:work-life-balance"}
{"action":"rest","text":"年假第一天你没有打开邮箱，邮箱也没有因此停止自转。","tone":"轻松","kind":"life","category":"life","source_hint":"WorkplaceSE:work-life-balance"}
{"action":"rest","text":"你发现无所事事十分钟不会让技术栈退化，只会让肩膀放松。","tone":"治愈","kind":"health","category":"health","source_hint":"dev.to:hidden-burnout"}
{"action":"rest","text":"休息不是低效，是给下一次专注预热缓存。","tone":"务实","kind":"health","category":"health","source_hint":"StackOverflowBlog:developer-happiness"}
{"action":"rest","text":"你今天没有追热点技术，热点也没有来追你。","tone":"平静","kind":"learning","category":"emotion","source_hint":"Lobsters:identity"}
{"action":"learn-ai","text":"你把 AI 新闻从无限流改成每周汇总，焦虑流量明显下降。","tone":"克制","kind":"learning","category":"emotion","source_hint":"V2EX:职业焦虑"}
{"action":"learn-ai","text":"你不再把每个新工具都当救命稻草，先看它能否少开一个会。","tone":"清醒","kind":"learning","category":"consumption","source_hint":"少数派:远程协作"}
{"action":"learn-ai","text":"你让 AI 帮忙生成面试复盘，最刺眼的一条是别熬夜准备。","tone":"自嘲","kind":"learning","category":"health","source_hint":"Reddit:job-prep"}
{"action":"learn-ai","text":"你用 AI 做家庭清单，发现生活需求也需要需求澄清。","tone":"幽默","kind":"life","category":"family","source_hint":"少数派:远程协作"}
{"action":"learn-ai","text":"AI 没法替你休息，但能提醒你别把休息排到永远的 backlog。","tone":"温和","kind":"health","category":"emotion","source_hint":"dev.to:hidden-burnout"}
{"action":"interview","text":"你在面试前查通勤路线，发现 Offer 的隐藏参数是每天两小时。","tone":"清醒","kind":"event","category":"commute","source_hint":"V2EX:通勤成本"}
{"action":"interview","text":"你拒绝一个高薪远通勤岗位，钱包沉默，腰椎鼓掌。","tone":"苦笑","kind":"health","category":"commute","source_hint":"V2EX:双城通勤"}
{"action":"interview","text":"远程岗位听起来很美，你也记得问团队如何处理孤独和沟通。","tone":"务实","kind":"event","category":"social","source_hint":"少数派:远程工作"}
{"action":"interview","text":"你问值班补偿，不是计较，是把健康成本写进报价单。","tone":"清醒","kind":"health","category":"consumption","source_hint":"博客园:加班定价"}
{"action":"interview","text":"你终于明白，职业发展不只看 title，也看能不能好好吃晚饭。","tone":"成熟","kind":"life","category":"health","source_hint":"StackOverflowBlog:developer-happiness"}
{"action":"side-project","text":"你把副业收入幻想写进表格，税前快乐先行到账。","tone":"自嘲","kind":"joke","category":"consumption","source_hint":"知乎:程序员副业"}
{"action":"side-project","text":"个人产品没人用的夜晚，你至少学会了自己不是客服机器人。","tone":"苦笑","kind":"learning","category":"emotion","source_hint":"IndieHackers:own-product"}
{"action":"side-project","text":"你把副业目标从暴富改成每月支付服务器费，心态稳定许多。","tone":"务实","kind":"learning","category":"consumption","source_hint":"IndieHackers:side-projects"}
```


