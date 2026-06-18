# agent-research-learning-round13-candidates

来源：从当前 Codex 会话子智能体 completed 通知抽取，候选内容为原创改写，不直接进入正式运行时池。

## 调研来源摘要

- V2EX：中大龄焦虑、AI 时代活路、34 岁失业、开源参与、远程工作、中年危机讨论。([v2ex.com](https://www.v2ex.com/t/926772?utm_source=openai)) ([v2ex.com](https://v2ex.com/t/1104479?utm_source=openai)) ([v2ex.com](https://www.v2ex.com/t/1194277?utm_source=openai)) ([v2ex.com](https://v2ex.com/t/1023966?utm_source=openai)) ([v2ex.com](https://www.v2ex.com/t/1185543?utm_source=openai))
- Reddit r/ExperiencedDevs / r/cscareerquestions / r/opensource：面试疲劳、AI 编程、远程协作、焦虑、开源维护者倦怠。([reddit.com](https://www.reddit.com/r/ExperiencedDevs/comments/1qkvyh1/senior_dev_interview_burnout_how_do_you_deal_with/?utm_source=openai)) ([reddit.com](https://www.reddit.com/r/ExperiencedDevs/comments/1l8ryy1/is_anyone_successfully_using_ai_assisted_coding/?utm_source=openai)) ([reddit.com](https://www.reddit.com/r/ExperiencedDevs/comments/18bdmka/engineering_manager_burning_out_on_remote_work/?utm_source=openai)) ([reddit.com](https://www.reddit.com/r/opensource/comments/1q76f90/the_maintainer_burnout_is_real_and_it_is_getting/?utm_source=openai))
- Hacker News：职业倦怠、转行、AI 生产力、技术债、远程沟通。([news.ycombinator.com](https://news.ycombinator.com/item?id=46695821&utm_source=openai)) ([news.ycombinator.com](https://news.ycombinator.com/item?id=42137527&utm_source=openai)) ([news.ycombinator.com](https://news.ycombinator.com/item?id=37000981&utm_source=openai))
- Stack Overflow 2025 Developer Survey：AI 使用率上升但信任下降。([survey.stackoverflow.co](https://survey.stackoverflow.co/2025/ai?utm_source=openai)) ([stackoverflow.blog](https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/?utm_source=openai))
- GitHub / Octoverse / GitHub Community：AI、开源参与、开发者生态变化。([octoverse.github.com](https://octoverse.github.com/?utm_source=openai)) ([github.com](https://github.com/orgs/community/discussions/153056?utm_source=openai))
- DEV Community：程序员倦怠、AI 辅助学习、远程工作感受、开源退出。([dev.to](https://dev.to/pancy/dealing-with-programmers-burnout-40b?utm_source=openai)) ([dev.to](https://dev.to/bekahhw/which-code-assistant-actually-helps-developers-grow-1ki8?utm_source=openai)) ([dev.to](https://dev.to/theaccordance/does-anyone-else-have-mixed-feelings-with-remote-work-22k4?utm_source=openai)) ([dev.to](https://dev.to/sapegin/why-i-quit-open-source-1n2e?utm_source=openai))
- 博客园：35 岁求职、中年危机、技术焦虑。([cnblogs.com](https://www.cnblogs.com/minily/p/18803259?utm_source=openai)) ([cnblogs.com](https://www.cnblogs.com/yychuyu/articles/18999597?utm_source=openai))
- 掘金：AI 失业焦虑、AI 学习路线和程序员自救。([juejin.cn](https://juejin.cn/post/7621604278671851526?utm_source=openai)) ([juejin.cn](https://juejin.cn/post/7644805910989864975?utm_source=openai))
- 知乎专栏：40 岁程序员 AI 项目自救、招聘市场与 AI 焦虑。([zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/1904996309972285377?utm_source=openai)) ([zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/81783413074?utm_source=openai))
- OSCHINA：AI 写代码、简历能力锚点、成长焦虑。([my.oschina.net](https://my.oschina.net/u/9756515/blog/19664823?utm_source=openai)) ([my.oschina.net](https://my.oschina.net/u/9749145/blog/19665066?utm_source=openai))

## JSONL 候选

```jsonl
{"action":"learn-ai","text":"你把今晚要学的新框架删掉了两个，只留一个能解决当前项目问题的。焦虑没有消失，但待办清单终于像人类写的。","tone":"gentle","kind":"learning","category":"学习成长"}
{"action":"learn-ai","text":"你发现自己不是学得慢，而是每次都想从底层原理学到商业闭环。今天只跑通一个例子，已经算前进。","tone":"resonant","kind":"learning","category":"学习成长"}
{"action":"side-project","text":"你把教程项目改成了自己的小工具。它很粗糙，但第一次不是为了收藏夹好看而学习。","tone":"gentle","kind":"learning","category":"学习成长"}
{"action":"rest","text":"你关掉了半小时技术播客，去洗了个澡。大脑缓存清空后，那个报错突然不再像人生判决书。","tone":"wry","kind":"health","category":"学习成长"}
{"action":"learn-ai","text":"你给自己定了个规矩：不再为每个热门词建文件夹。能写进项目复盘的，才配进入学习计划。","tone":"sharp","kind":"learning","category":"学习成长"}
{"action":"networking","text":"你问了同事最近真正用上的技术，答案比热榜短很多。原来成长路线也可以从旁边工位开始。","tone":"gentle","kind":"learning","category":"学习成长"}
{"action":"side-project","text":"你把废弃三个月的小项目 README 补完了。它还没赚钱，但终于能向未来的自己解释为什么存在。","tone":"resonant","kind":"event","category":"学习成长"}
{"action":"learn-ai","text":"你今天没有打开十个课程，只把一个旧 bug 从复现写到修复。经验值涨得不响，但很实。","tone":"resonant","kind":"learning","category":"学习成长"}
{"action":"rest","text":"你承认自己不是永动机，也不是技术雷达站。今晚不追热点，明天也不会立刻被淘汰。","tone":"gentle","kind":"health","category":"学习成长"}
{"action":"learn-ai","text":"你把学习目标从掌握全部生态改成能独立排查线上问题。听起来不酷，但更像饭碗。","tone":"sharp","kind":"learning","category":"学习成长"}
{"action":"networking","text":"你向前辈请教路线，对方只回了四个字：做出东西。比三千字规划扎心，也更省电。","tone":"wry","kind":"learning","category":"学习成长"}
{"action":"side-project","text":"你把今天学到的知识写进项目注释，而不是朋友圈。点赞少了，明天接手代码的人轻松了。","tone":"gentle","kind":"learning","category":"学习成长"}
{"action":"learn-ai","text":"你让 AI 先解释旧代码，再让它写新代码。速度慢了一点，但你终于知道自己在批准什么。","tone":"resonant","kind":"learning","category":"AI工具学习"}
{"action":"learn-ai","text":"AI 给了三个方案，你没有立刻复制。你先问它各自会留下什么坑，像审一个过于自信的实习生。","tone":"wry","kind":"learning","category":"AI工具学习"}
{"action":"learn-ai","text":"你发现 AI 最会生成的是信心，不一定是正确答案。今天的收获是多跑了一遍测试。","tone":"sharp","kind":"learning","category":"AI工具学习"}
{"action":"learn-ai","text":"你把提示词从帮我写改成先问我缺什么上下文。工具突然不神了，但更像能合作了。","tone":"gentle","kind":"learning","category":"AI工具学习"}
{"action":"side-project","text":"你用 AI 搭了个原型，又花两小时删掉一半浮夸代码。机器负责加速，你负责刹车。","tone":"resonant","kind":"event","category":"AI工具学习"}
{"action":"learn-ai","text":"你没有把 AI 当老师，也没有当敌人。今天它像橡皮鸭，只是这只鸭子偶尔会胡说八道。","tone":"wry","kind":"learning","category":"AI工具学习"}
{"action":"learn-ai","text":"你要求 AI 给出处和边界，它开始犹豫。你松了口气，至少这次不是你一个人在不确定。","tone":"gentle","kind":"learning","category":"AI工具学习"}
{"action":"overtime","text":"老板说 AI 能省掉一半时间，排期却加倍了。你看着燃尽图，怀疑省下的是谁的命。","tone":"sharp","kind":"event","category":"AI工具学习"}
{"action":"learn-ai","text":"你把 AI 生成的代码逐行讲给自己听。讲不通的地方，就是今天真正的学习材料。","tone":"resonant","kind":"learning","category":"AI工具学习"}
{"action":"learn-ai","text":"你拒绝让 AI 直接改生产脚本。它不会背锅，而你会。","tone":"sharp","kind":"event","category":"AI工具学习"}
{"action":"learn-ai","text":"你发现会问 AI 不等于会做需求。用户那句不好用，模型也没法替你理解。","tone":"resonant","kind":"learning","category":"AI工具学习"}
{"action":"side-project","text":"你用 AI 做了个周末小工具，最后最难的不是代码，是决定它到底服务谁。","tone":"gentle","kind":"life","category":"AI工具学习"}
{"action":"learn-ai","text":"你把 AI 的回答和官方文档对照了一遍。效率下降五分钟，事故概率下降一整天。","tone":"sharp","kind":"learning","category":"AI工具学习"}
{"action":"learn-ai","text":"你开始记录哪些任务适合交给 AI，哪些必须自己想。清单越长，你越不怕它。","tone":"resonant","kind":"learning","category":"AI工具学习"}
{"action":"networking","text":"你和同事交换 AI 使用习惯，发现大家都在偷偷验证。原来谨慎不是落后，是职业本能。","tone":"gentle","kind":"learning","category":"AI工具学习"}
{"action":"learn-ai","text":"你让 AI 写测试先于写实现。它的自信被测试框架教育了一遍，你也一样。","tone":"wry","kind":"learning","category":"AI工具学习"}
{"action":"learn-ai","text":"你没有追最新模型榜单，而是整理了自己的上下文模板。工具会换，工作流能留下。","tone":"resonant","kind":"learning","category":"AI工具学习"}
{"action":"rest","text":"你今天没有再刷 AI 淘汰程序员的帖子。焦虑少喂一次，晚上就多睡半小时。","tone":"gentle","kind":"health","category":"AI工具学习"}
{"action":"side-project","text":"你给开源项目提了第一个文档 PR。没有惊天动地，但维护者少解释了一次安装步骤。","tone":"gentle","kind":"event","category":"开源参与"}
{"action":"networking","text":"你在 issue 里先复现问题，再描述环境。对方回复很快，因为你不是把麻烦空投过去。","tone":"resonant","kind":"event","category":"开源参与"}
{"action":"side-project","text":"你想做核心功能，结果先修了拼写错误。开源教你的第一课是入口通常很小。","tone":"wry","kind":"learning","category":"开源参与"}
{"action":"networking","text":"你没有催维护者合并 PR，只补了测试和截图。尊重别人的夜晚，也是在保护自己的未来。","tone":"gentle","kind":"life","category":"开源参与"}
{"action":"side-project","text":"你把自己的工具开源后，第一条反馈是不能运行。成名没来，客服先来了。","tone":"wry","kind":"event","category":"开源参与"}
{"action":"rest","text":"你决定本周不看开源项目通知。免费劳动也需要边界，不然热爱会被工单磨成灰。","tone":"sharp","kind":"health","category":"开源参与"}
{"action":"networking","text":"你在社区里认识了一个同样修冷门库的人。没有猎头，没有内推，但你们互相看懂了坚持。","tone":"resonant","kind":"life","category":"开源参与"}
{"action":"side-project","text":"你把公司里反复踩的坑做成小库。它不一定有 star，但已经开始替你沉淀经验。","tone":"gentle","kind":"learning","category":"开源参与"}
{"action":"networking","text":"你第一次被维护者拒绝 PR，理由很完整。被拒不是失败，免费代码也要服从项目方向。","tone":"resonant","kind":"learning","category":"开源参与"}
{"action":"side-project","text":"你删掉了开源项目里过度承诺的路线图。少画饼之后，维护它突然没那么窒息。","tone":"sharp","kind":"event","category":"开源参与"}
{"action":"networking","text":"你发现开源履历最有用的不是链接，而是你能讲清楚为什么改、怎么协作、留下什么权衡。","tone":"resonant","kind":"learning","category":"开源参与"}
{"action":"rest","text":"你没有回复那个理直气壮的需求。开源不是无限售后，沉默有时也是维护策略。","tone":"sharp","kind":"health","category":"开源参与"}
{"action":"interview","text":"你准备了三天系统设计，面试官却追问一个冷门 API。你微笑解释边界，心里给随机性扣了分。","tone":"wry","kind":"event","category":"面试求职"}
{"action":"interview","text":"你把八年经验压进三十分钟，像把仓库打包进二维码。讲不完不是你不够好，是格式太窄。","tone":"resonant","kind":"event","category":"面试求职"}
{"action":"interview","text":"你没有再背标准答案，而是准备了三个真实事故复盘。面试可以随机，经历不能伪造。","tone":"sharp","kind":"learning","category":"面试求职"}
{"action":"interview","text":"你收到外包岗位的降薪邀约，手指悬在拒绝按钮上。市场在报价，你在重新估值自己。","tone":"resonant","kind":"life","category":"面试求职"}
{"action":"interview","text":"你把简历上的精通改成负责过。少了气势，多了被追问时活下来的概率。","tone":"wry","kind":"learning","category":"面试求职"}
{"action":"networking","text":"你约老同事喝咖啡，没有开口就要内推。先恢复连接，机会才不会像群发消息。","tone":"gentle","kind":"life","category":"面试求职"}
{"action":"interview","text":"你面完后记录了被问倒的问题。失败如果不入库，就只会变成夜里的反刍。","tone":"resonant","kind":"learning","category":"面试求职"}
{"action":"rest","text":"你今天暂停投简历。不是放弃，是防止自己把每个已读不回都理解成人生否定。","tone":"gentle","kind":"health","category":"面试求职"}
{"action":"interview","text":"你发现刷题能进门，但项目复盘决定能不能坐下。于是今晚少刷一题，多写一段取舍。","tone":"sharp","kind":"learning","category":"面试求职"}
{"action":"interview","text":"面试官问你为什么离职，你没有抱怨前公司。你把故事讲成寻找匹配，而不是逃离废墟。","tone":"gentle","kind":"event","category":"面试求职"}
{"action":"interview","text":"你在远程面试前关掉了所有 AI 助手。不是因为不会用，而是想让对方看见真正的你。","tone":"resonant","kind":"event","category":"面试求职"}
{"action":"interview","text":"你被一道脑筋急转弯式算法题送走。电梯门合上时，你决定不把一家公司的筛法当行业真理。","tone":"sharp","kind":"life","category":"面试求职"}
{"action":"networking","text":"你请朋友帮忙 mock 面试，结果对方指出你总在解释技术，不解释影响。痛，但有用。","tone":"resonant","kind":"learning","category":"面试求职"}
{"action":"interview","text":"你把求职表格加了一列：是否尊重候选人。找工作也是互相筛选，不只是被审判。","tone":"sharp","kind":"life","category":"面试求职"}
{"action":"rest","text":"你半夜醒来刷招聘软件，看到薪资区间像心电图。你关掉屏幕，先保住明天的清醒。","tone":"gentle","kind":"health","category":"职业焦虑"}
{"action":"learn-ai","text":"你把焦虑拆成三类：不会的、暂时不用会的、营销号希望你立刻买课的。世界清净了一点。","tone":"wry","kind":"learning","category":"职业焦虑"}
{"action":"networking","text":"你和同龄程序员聊到房贷、孩子和技术栈，发现大家都在装镇定。共鸣不能还债，但能续命。","tone":"resonant","kind":"life","category":"职业焦虑"}
{"action":"side-project","text":"你开始做一个能每月带来小收入的工具。金额不大，但它把恐惧从抽象变成了表格。","tone":"gentle","kind":"life","category":"职业焦虑"}
{"action":"rest","text":"你承认今天状态很差，于是只做低风险维护。不是每一天都适合证明自己。","tone":"gentle","kind":"health","category":"职业焦虑"}
{"action":"overtime","text":"你听见又要提效，第一反应不是兴奋，而是想知道谁来定义正常速度。","tone":"sharp","kind":"event","category":"职业焦虑"}
{"action":"learn-ai","text":"你没有再问程序员会不会消失，而是问自己能不能解决更具体的问题。恐惧被缩小成任务。","tone":"resonant","kind":"learning","category":"职业焦虑"}
{"action":"networking","text":"你加入了一个小型技术群，没人发财富自由截图，只交流真实项目坑。空气质量明显改善。","tone":"gentle","kind":"life","category":"职业焦虑"}
{"action":"rest","text":"你今天没看裁员名单。坏消息不会因为你提前焦虑就变得温柔。","tone":"sharp","kind":"health","category":"职业焦虑"}
{"action":"side-project","text":"你把职业规划写成三条可执行路线，而不是一句我要变强。地图简陋，也比雾里狂奔好。","tone":"resonant","kind":"learning","category":"职业焦虑"}
{"action":"learn-ai","text":"你发现越焦虑越想买课，越买课越没时间实践。今晚的学习计划是先退订两个信息源。","tone":"wry","kind":"learning","category":"职业焦虑"}
{"action":"networking","text":"你问了一位转岗成功的人真正做了什么。答案没有传奇，只有持续投递、复盘和降预期。","tone":"resonant","kind":"learning","category":"职业焦虑"}
{"action":"rest","text":"你把体检预约放进日历。职业生涯再长，也不能建立在一副长期报错的身体上。","tone":"gentle","kind":"health","category":"职业焦虑"}
{"action":"overtime","text":"你又一次用加班换安全感。工时上涨，安全感却像内存泄漏一样不见了。","tone":"sharp","kind":"health","category":"职业焦虑"}
{"action":"rest","text":"你三十五岁后第一次没有为年龄道歉。你只是更清楚哪些会做，哪些不想再硬扛。","tone":"resonant","kind":"life","category":"中年危机"}
{"action":"networking","text":"你和年轻同事结对排查问题，发现自己慢在手速，快在判断哪里不该改。","tone":"gentle","kind":"learning","category":"中年危机"}
{"action":"interview","text":"面试表没有问你养不养孩子，但你能感觉到对方在计算加班弹性。你决定也计算公司边界。","tone":"sharp","kind":"event","category":"中年危机"}
{"action":"side-project","text":"你开始把经验产品化，不再只把所有安全感押在一份雇佣合同上。","tone":"resonant","kind":"life","category":"中年危机"}
{"action":"rest","text":"你发现中年危机最吵的时候，通常是睡眠最少的时候。先睡，再谈人生战略。","tone":"gentle","kind":"health","category":"中年危机"}
{"action":"learn-ai","text":"你学 AI 不是为了装年轻，而是为了让旧经验接上新工具。桥可以新，河还是那条河。","tone":"resonant","kind":"learning","category":"中年危机"}
{"action":"networking","text":"你不再只和同龄人抱团取暖，也开始向年轻人请教工具链。尊严没有掉，信息差少了。","tone":"gentle","kind":"learning","category":"中年危机"}
{"action":"overtime","text":"你拒绝了一个靠连续通宵维持的项目。年轻时叫拼，长期看叫透支资产。","tone":"sharp","kind":"health","category":"中年危机"}
{"action":"interview","text":"你把管理、沟通、架构判断写进简历，而不是假装自己还只靠手速竞争。","tone":"resonant","kind":"learning","category":"中年危机"}
{"action":"rest","text":"你给家庭时间留了不可覆盖的日历块。不是不敬业，是你终于承认人生有多个生产环境。","tone":"gentle","kind":"life","category":"中年危机"}
{"action":"side-project","text":"你把十年踩坑整理成课程大纲，但没有立刻卖课。先验证需求，别把焦虑包装成产品。","tone":"wry","kind":"learning","category":"中年危机"}
{"action":"networking","text":"你发现所谓不被替代，更多时候是别人愿意在复杂问题上先找你商量。","tone":"resonant","kind":"life","category":"中年危机"}
{"action":"overtime","text":"你又在屎山里加了一层 if。功能上线了，债主也记下了你的名字。","tone":"wry","kind":"event","category":"技术债"}
{"action":"overtime","text":"AI 一口气生成了五百行代码，你一口气新增了五百行未来会议议题。","tone":"sharp","kind":"event","category":"技术债"}
{"action":"learn-ai","text":"你让 AI 解释遗留模块，它总结得很流畅，漏掉了最关键的历史事故。文档缺席时，幻觉会补位。","tone":"sharp","kind":"learning","category":"技术债"}
{"action":"overtime","text":"你想重构，排期说下个季度。下个季度来了，技术债已经学会了繁殖。","tone":"wry","kind":"event","category":"技术债"}
{"action":"networking","text":"你把技术债写成业务风险，而不是工程师情绪。会议室里终于有人抬头了。","tone":"resonant","kind":"event","category":"技术债"}
{"action":"side-project","text":"你给旧系统补了一套最小测试。它不华丽，但像给危楼装了几根承重柱。","tone":"gentle","kind":"learning","category":"技术债"}
{"action":"overtime","text":"你发现最快的方案常常只是把成本递延给下一个人。今天下一个人就是你。","tone":"resonant","kind":"life","category":"技术债"}
{"action":"learn-ai","text":"你要求 AI 先读项目约束再改代码。没有上下文的聪明，是技术债的自动售货机。","tone":"sharp","kind":"learning","category":"技术债"}
{"action":"overtime","text":"你删除了一段没人敢碰的兼容逻辑，测试全绿。办公室安静得像拆弹成功。","tone":"wry","kind":"event","category":"技术债"}
{"action":"networking","text":"你和产品解释为什么慢一点能少返工。对方没完全同意，但至少知道慢不是偷懒。","tone":"gentle","kind":"event","category":"技术债"}
{"action":"rest","text":"你没有在凌晨重构核心模块。疲惫的大脑最擅长把技术债变成事故。","tone":"sharp","kind":"health","category":"技术债"}
{"action":"side-project","text":"你把旧项目的部署步骤自动化了。没有新功能，但每个后来者都会少骂一句。","tone":"resonant","kind":"learning","category":"技术债"}
{"action":"networking","text":"远程会议里没人说话，你把问题写成文档。沉默没有消失，但讨论终于有了落点。","tone":"gentle","kind":"event","category":"远程协作"}
{"action":"rest","text":"你把 Slack 静音一小时，完成了两天没推进的核心逻辑。在线不等于可用。","tone":"sharp","kind":"health","category":"远程协作"}
{"action":"networking","text":"你发现远程最难的不是距离，而是别人看不见你卡在哪里。于是你开始主动同步阻塞点。","tone":"resonant","kind":"learning","category":"远程协作"}
{"action":"networking","text":"你把一句有空看下改成背景、目标、选项和截止时间。异步沟通突然像工程了。","tone":"wry","kind":"learning","category":"远程协作"}
{"action":"rest","text":"你下班后关掉工作通知。家里的餐桌不该变成第二个站会现场。","tone":"gentle","kind":"health","category":"远程协作"}
{"action":"networking","text":"你约了十五分钟语音，把一周文字误会清掉。不是所有问题都适合在评论区打拉锯战。","tone":"resonant","kind":"event","category":"远程协作"}
{"action":"networking","text":"新人入职远程团队，你补了一页导航文档。少一次迷路，团队就少一点隐形损耗。","tone":"gentle","kind":"learning","category":"远程协作"}
{"action":"overtime","text":"跨时区会议又落在晚上十点。你开始怀疑全球化的主要产物是困。","tone":"wry","kind":"health","category":"远程协作"}
{"action":"networking","text":"你在 PR 里解释为什么这样改，而不只是贴代码。远程协作里，上下文就是同事的氧气。","tone":"resonant","kind":"learning","category":"远程协作"}
{"action":"rest","text":"你今天去了共享办公室。不是背叛远程，而是承认人类偶尔需要真实的键盘声。","tone":"gentle","kind":"life","category":"远程协作"}
{"action":"networking","text":"你把团队约定从默认秒回改成固定响应窗口。焦虑少了，深度工作终于有了领地。","tone":"sharp","kind":"event","category":"远程协作"}
{"action":"networking","text":"你发现远程管理不是盯在线状态，而是让目标、责任和风险都能被看见。","tone":"resonant","kind":"learning","category":"远程协作"}
{"action":"rest","text":"你午休没有刷短视频，而是闭眼十分钟。大脑没有升级，但风扇声小了。","tone":"gentle","kind":"health","category":"健康边界"}
{"action":"rest","text":"你把今天的最后一个需求移到明早。线上不会因为你少熬一小时就失去互联网精神。","tone":"wry","kind":"health","category":"健康边界"}
{"action":"overtime","text":"你连续第三天加班后，终于把头痛记进风险清单。身体也是生产依赖，不是免费资源。","tone":"sharp","kind":"health","category":"健康边界"}
{"action":"rest","text":"你去散步时没有听技术课。脚步声很普通，但它比焦虑更接近现实。","tone":"gentle","kind":"health","category":"健康边界"}
{"action":"rest","text":"你拒绝了周末临时会。边界说出口的那一刻，心跳比发版还快。","tone":"resonant","kind":"event","category":"健康边界"}
{"action":"rest","text":"你把睡眠当作工程质量的一部分。清醒的人写不出完美代码，但熬坏的人会写出事故。","tone":"sharp","kind":"health","category":"健康边界"}
{"action":"networking","text":"你告诉负责人自己本周已经满载。没有道歉三遍，只给了可交付的替代方案。","tone":"resonant","kind":"life","category":"健康边界"}
{"action":"rest","text":"你今晚没有打开电脑验证那个想法。能等到明天的灵感，才配进入长期项目。","tone":"gentle","kind":"health","category":"健康边界"}
{"action":"side-project","text":"你的小副业第一个月只赚了咖啡钱，却让你第一次看见工资以外的进度条。","tone":"resonant","kind":"life","category":"副业项目"}
{"action":"side-project","text":"你删掉了副业里三个炫技功能，只保留用户愿意点第二次的按钮。","tone":"sharp","kind":"learning","category":"副业项目"}
{"action":"networking","text":"你没有闭门造车，先找五个人试用。现实反馈比自我感动便宜，也更疼。","tone":"wry","kind":"event","category":"副业项目"}
{"action":"side-project","text":"你把副业当实验，不当救命绳。它可以增长，但不能每天勒住你的脖子。","tone":"gentle","kind":"health","category":"副业项目"}
{"action":"learn-ai","text":"你用 AI 做营销页，用自己判断定价。工具能生成文案，不能替你承担市场沉默。","tone":"resonant","kind":"learning","category":"副业项目"}
{"action":"side-project","text":"你决定先服务一个具体人群，而不是改变世界。生存模拟器提示：宏大愿景不能直接支付服务器账单。","tone":"wry","kind":"life","category":"副业项目"}
```
