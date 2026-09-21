"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Reading = {
  han: string;
  kind: "白读" | "文读" | "常用";
  category: "饮食" | "人物" | "日常动作" | "描述" | "时间" | "天气" | "居家" | "购物" | "交通" | "旅行" | "健康" | "学习" | "心情";
  tl: string;
  meaning: string;
  note: string;
  audio: string;
};

type QuizQuestion = {
  eyebrow: string;
  prompt: string;
  sub: string;
  options: string[];
  answer: string;
  explain: string;
  audio: string;
};

type LessonSentence = {
  han: string;
  tl: string;
  meaning: string;
  audio: string;
};

type TopicWord = {
  han: string;
  tl: string;
  meaning: string;
  audio: string;
  exampleHan: string;
  exampleTl: string;
  exampleMeaning: string;
};

type TopicUnit = {
  num: number;
  title: string;
  goal: string;
  note: string;
  words: TopicWord[];
};

type TopicTrack = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: "number" | "shopping";
  units: TopicUnit[];
};

const readings: Reading[] = [
  { han: "啉水", kind: "常用", category: "饮食", tl: "lim tsuí", meaning: "喝水", note: "日常口语中表示喝水的完整词组。", audio: "/audio/lim-tsui-word.mp3" },
  { han: "食茶", kind: "白读", category: "饮食", tl: "tsia̍h-tê", meaning: "喝茶", note: "生活口语中的固定搭配，食在这里使用白读。", audio: "/audio/tsiah-te-word.mp3" },
  { han: "食物", kind: "文读", category: "饮食", tl: "si̍t-bu̍t", meaning: "食物", note: "书面汉字词，食在这个词组中使用文读。", audio: "/audio/sit-but-word.mp3" },
  { han: "好人", kind: "白读", category: "人物", tl: "hó-lâng", meaning: "好人", note: "日常口语里称赞一个人的常用词组。", audio: "/audio/ho-lang-word.mp3" },
  { han: "人类", kind: "文读", category: "人物", tl: "jîn-luī", meaning: "人类", note: "较书面的汉字词，人使用文读。", audio: "/audio/jin-lui-word.mp3" },
  { han: "流汗", kind: "白读", category: "日常动作", tl: "lâu-kuānn", meaning: "出汗、流汗", note: "固定搭配，流在这里使用白读。", audio: "/audio/lau-kuann-word.mp3" },
  { han: "流浪", kind: "文读", category: "日常动作", tl: "liû-lōng", meaning: "流浪", note: "书面汉字词，流在这里使用文读。", audio: "/audio/liu-long-word.mp3" },
  { han: "无路用", kind: "白读", category: "描述", tl: "bô-lōo-īng", meaning: "没有用、不中用", note: "生活中常见的评价词组；用也可读作 iōng。", audio: "/audio/bo-loo-ing-word.mp3" },
  { han: "大箍", kind: "白读", category: "描述", tl: "tuā-khoo", meaning: "胖、体格粗壮", note: "生活口语词组，大在这里使用白读。", audio: "/audio/tua-khoo-word.mp3" },
  { han: "大学", kind: "文读", category: "学习", tl: "tāi-ha̍k", meaning: "大学", note: "学校名称中的汉字词，大使用文读。", audio: "/audio/tai-hak-word.mp3" },
  { han: "早起", kind: "常用", category: "时间", tl: "tsá-khí", meaning: "早上、早晨", note: "谈一天时间时常用的生活词组。", audio: "/audio/tsa-khi-word.mp3" },
  { han: "暗时", kind: "常用", category: "时间", tl: "àm-sî", meaning: "晚上、夜间", note: "表示天黑以后的时间。", audio: "/audio/am-si-word.mp3" },
  { han: "好天", kind: "白读", category: "天气", tl: "hó-thinn", meaning: "好天气、晴天", note: "形容天气晴朗的常用说法。", audio: "/audio/ho-thinn-word.mp3" },
  { han: "落雨", kind: "常用", category: "天气", tl: "lo̍h-hōo", meaning: "下雨", note: "描述正在下雨的常用词组。", audio: "/audio/loh-hoo-word.mp3" },
  { han: "厝内", kind: "常用", category: "居家", tl: "tshù-lāi", meaning: "家里、屋内", note: "表示家中或房子里面。", audio: "/audio/tshu-lai-word.mp3" },
  { han: "行路", kind: "白读", category: "日常动作", tl: "kiânn-lōo", meaning: "走路、步行", note: "日常口语表示步行的完整词组。", audio: "/audio/kiann-loo-word.mp3" },
  { han: "一百箍", kind: "常用", category: "购物", tl: "tsi̍t-pah khoo", meaning: "一百元、一百块钱", note: "询价、付款时会用到的金额说法。", audio: "/audio/lesson-7-sentence.mp3" },
  { han: "菜市仔", kind: "常用", category: "购物", tl: "tshài-tshī-á", meaning: "菜市场", note: "买菜、买肉时常去的地方。", audio: "/audio/tshai-tshi-a-word.mp3" },
  { han: "青菜", kind: "常用", category: "购物", tl: "tshenn-tshài", meaning: "蔬菜、青菜", note: "市场购物和日常饮食中的常用词组。", audio: "/audio/tshenn-tshai-word.mp3" },
  { han: "火车", kind: "常用", category: "交通", tl: "hué-tshia", meaning: "火车", note: "搭乘铁路交通工具时使用。", audio: "/audio/hue-tshia-word.mp3" },
  { han: "公车", kind: "常用", category: "交通", tl: "kong-tshia", meaning: "公交车、公共汽车", note: "城市日常出行的常用词组。", audio: "/audio/kong-tshia-word.mp3" },
  { han: "车头", kind: "常用", category: "交通", tl: "tshia-thâu", meaning: "车站", note: "在许多语境里用来指车站。", audio: "/audio/tshia-thau-word.mp3" },
  { han: "车票", kind: "常用", category: "交通", tl: "tshia-phiò", meaning: "车票", note: "买票、乘车时会用到。", audio: "/audio/tshia-phio-word.mp3" },
  { han: "头疼", kind: "常用", category: "健康", tl: "thâu-thiànn", meaning: "头痛", note: "描述身体不舒服的常用说法。", audio: "/audio/thau-thiann-word.mp3" },
  { han: "腹肚", kind: "常用", category: "健康", tl: "pak-tóo", meaning: "肚子、腹部", note: "身体部位的常用生活词。", audio: "/audio/pak-too-word.mp3" },
  { han: "看医生", kind: "常用", category: "健康", tl: "khuànn-i-sing", meaning: "看医生、就医", note: "身体不舒服时使用的完整动作词组。", audio: "/audio/khuann-i-sing-word.mp3" },
  { han: "读册", kind: "常用", category: "学习", tl: "tha̍k-tsheh", meaning: "读书、学习", note: "表示读书或学习的日常词组。", audio: "/audio/thak-tsheh-word.mp3" },
  { han: "写字", kind: "常用", category: "学习", tl: "siá-jī", meaning: "写字", note: "课堂与日常学习中的动作词组。", audio: "/audio/sia-ji-word.mp3" },
  { han: "老师", kind: "常用", category: "学习", tl: "lāu-su", meaning: "老师", note: "学校里称呼教师的常用词。", audio: "/audio/lau-su-word.mp3" },
  { han: "学校", kind: "常用", category: "学习", tl: "ha̍k-hāu", meaning: "学校", note: "学习场所的常用词组。", audio: "/audio/hak-hau-word.mp3" },
  { han: "欢喜", kind: "常用", category: "心情", tl: "huann-hí", meaning: "高兴、开心", note: "表达愉快心情的常用词组。", audio: "/audio/huann-hi-word.mp3" },
  { han: "艰苦", kind: "常用", category: "心情", tl: "kan-khóo", meaning: "难受、不好过", note: "可以描述身心难受或生活艰难。", audio: "/audio/kan-khoo-word.mp3" },
  { han: "受气", kind: "常用", category: "心情", tl: "siū-khì", meaning: "受委屈、受气", note: "描述受到委屈或心里生气。", audio: "/audio/siu-khi-word.mp3" },
  { han: "伤心", kind: "常用", category: "心情", tl: "siong-sim", meaning: "伤心、难过", note: "表达悲伤情绪的常用词组。", audio: "/audio/siong-sim-word.mp3" },
  { han: "借问", kind: "常用", category: "旅行", tl: "tsioh-mn̄g", meaning: "请问、劳驾", note: "向陌生人问路或请教事情时，放在句首更有礼貌。", audio: "/audio/travel/tsioh-mng.wav" },
  { han: "佗位", kind: "常用", category: "旅行", tl: "tó-uī", meaning: "哪里、什么位置", note: "询问地点和方向时最常用的疑问词。", audio: "/audio/travel/to-ui.wav" },
  { han: "倒手爿", kind: "常用", category: "旅行", tl: "tò-tshiú-pîng", meaning: "左边", note: "听路线说明时用来辨认左侧方向。", audio: "/audio/travel/to-tshiu-ping.wav" },
  { han: "正手爿", kind: "常用", category: "旅行", tl: "tsiànn-tshiú-pîng", meaning: "右边", note: "听路线说明时用来辨认右侧方向。", audio: "/audio/travel/tsiann-tshiu-ping.wav" },
  { han: "捷运", kind: "常用", category: "旅行", tl: "tsia̍t-ūn", meaning: "地铁、捷运", note: "在城市里询问或搭乘轨道交通时使用。", audio: "/audio/travel/tsiat-un.wav" },
  { han: "月台", kind: "常用", category: "旅行", tl: "gua̍t-tâi", meaning: "站台、月台", note: "搭火车或捷运时确认候车位置。", audio: "/audio/travel/guat-tai.wav" },
  { han: "落车", kind: "常用", category: "旅行", tl: "lo̍h-tshia", meaning: "下车", note: "询问下车地点或提醒同伴准备下车。", audio: "/audio/travel/loh-tshia.wav" },
  { han: "换车", kind: "常用", category: "旅行", tl: "uānn-tshia", meaning: "换乘、转车", note: "需要换乘另一班车或交通工具时使用。", audio: "/audio/travel/uann-tshia.wav" },
  { han: "旅馆", kind: "常用", category: "旅行", tl: "lí-kuán", meaning: "旅馆、酒店", note: "寻找住宿地点或向司机说明目的地时使用。", audio: "/audio/travel/li-kuan.wav" },
  { han: "订房", kind: "常用", category: "旅行", tl: "tīng-pâng", meaning: "预订房间", note: "抵达住宿地点后说明已经预订。", audio: "/audio/travel/ting-pang.wav" },
  { han: "房间", kind: "常用", category: "旅行", tl: "pâng-king", meaning: "客房、房间", note: "办理入住或提出住宿需求时使用。", audio: "/audio/travel/pang-king.wav" },
  { han: "护照", kind: "常用", category: "旅行", tl: "hōo-tsiàu", meaning: "护照", note: "办理入住、出境或身份确认时使用。", audio: "/audio/travel/hoo-tsiau.wav" },
  { han: "门票", kind: "常用", category: "旅行", tl: "mn̂g-phiò", meaning: "门票", note: "在景点询问票价和购票地点时使用。", audio: "/audio/travel/mng-phio.wav" },
  { han: "翕相", kind: "常用", category: "旅行", tl: "hip-siòng", meaning: "拍照", note: "请别人帮忙拍照或询问能否拍照时使用。", audio: "/audio/travel/hip-siong.wav" },
  { han: "毋见去", kind: "常用", category: "旅行", tl: "m̄-kìnn-khì", meaning: "不见了、遗失了", note: "发现随身物品遗失时用来说明情况。", audio: "/audio/travel/m-kinn-khi.wav" },
  { han: "派出所", kind: "常用", category: "旅行", tl: "phài-tshut-sóo", meaning: "派出所、警察局", note: "遗失物品或需要警方协助时询问地点。", audio: "/audio/travel/phai-tshut-soo.wav" },
];

const lessons = [
  { num: 1, unit: 1, title: "开口第一句", detail: "歹势 · 多谢 · 再会", xp: 30 },
  { num: 2, unit: 1, title: "文白读入门", detail: "大 · 人 · 食 · 用", xp: 40 },
  { num: 3, unit: 1, title: "厝内的人", detail: "阿爸 · 阿母 · 囡仔", xp: 45 },
  { num: 4, unit: 1, title: "街仔路", detail: "买 · 问路 · 行路", xp: 50 },
  { num: 5, unit: 2, title: "一工的时间", detail: "早起 · 下晡 · 暗时 · 明仔载", xp: 55 },
  { num: 6, unit: 2, title: "看天讲天气", detail: "天气 · 好天 · 落雨 · 风颱", xp: 60 },
  { num: 7, unit: 2, title: "数字佮钱", detail: "一 · 两 · 百 · 箍", xp: 60 },
  { num: 8, unit: 2, title: "菜市仔买物", detail: "菜市仔 · 青菜 · 鱼 · 肉", xp: 65 },
  { num: 9, unit: 3, title: "坐车出门", detail: "火车 · 公车 · 车头 · 车票", xp: 70 },
  { num: 10, unit: 3, title: "身体无爽快", detail: "头疼 · 腹肚 · 看医生 · 药", xp: 70 },
  { num: 11, unit: 3, title: "学校读册", detail: "读册 · 写字 · 老师 · 学校", xp: 75 },
  { num: 12, unit: 3, title: "讲心内的话", detail: "欢喜 · 艰苦 · 受气 · 伤心", xp: 80 },
  { num: 13, unit: 4, title: "借问按怎行", detail: "借问 · 佗位 · 倒手爿 · 正手爿", xp: 80 },
  { num: 14, unit: 4, title: "搭车佮换车", detail: "捷运 · 月台 · 落车 · 换车", xp: 85 },
  { num: 15, unit: 4, title: "旅馆办入住", detail: "旅馆 · 订房 · 房间 · 护照", xp: 85 },
  { num: 16, unit: 4, title: "景点佮求助", detail: "门票 · 翕相 · 毋见去 · 派出所", xp: 90 },
];

const units = [
  { num: 1, eyebrow: "第一单元 · 生存会话", title: "会讲，嘛爱会读", description: "从问候、家庭到出门问路，先建立开口的勇气。" },
  { num: 2, eyebrow: "第二单元 · 日常生活", title: "时间、天气佮买物", description: "把数字、天气和市场用语放进真实生活。" },
  { num: 3, eyebrow: "第三单元 · 独立表达", title: "出门、健康佮心情", description: "能搭车、看医生，也能讲学习和自己的感受。" },
  { num: 4, eyebrow: "第四单元 · 出行旅游", title: "问路、住宿佮景点求助", description: "从找方向、换车到入住与遗失求助，把旅行中真正会用到的话练熟。" },
];

const questions: QuizQuestion[] = [
  { eyebrow: "听完整词语 · 选择白读音", prompt: "“大箍”怎样读？", sub: "先听完整的两个音节", options: ["tuā-khoo", "tāi-khoo", "tā-khoo"], answer: "tuā-khoo", explain: "“大箍”是生活口语，完整读作 tuā-khoo。", audio: "/audio/tua-khoo-word.mp3" },
  { eyebrow: "听完整词语 · 选择正确搭配", prompt: "“流汗”怎样读？", sub: "音档会完整读出“流汗”", options: ["liû-kuānn", "lâu-kuānn", "lâu-hân"], answer: "lâu-kuānn", explain: "“流汗”固定用白读 lâu，完整读作 lâu-kuānn。", audio: "/audio/lau-kuann-word.mp3" },
  { eyebrow: "听完整词语 · 认识文读音", prompt: "节气“大寒”怎样读？", sub: "节气名称使用文读", options: ["tuā-kuânn", "tāi-hân", "ta-hân"], answer: "tāi-hân", explain: "节气“大寒”使用文读，完整读作 tāi-hân。", audio: "/audio/tai-han-word.mp3" },
  { eyebrow: "听完整词语 · 完成挑战", prompt: "“好人”怎样读？", sub: "日常说一个好人", options: ["hó-jîn", "hó-lâng", "hó-lîn"], answer: "hó-lâng", explain: "口语的“人”读 lâng，完整读作 hó-lâng。", audio: "/audio/ho-lang-word.mp3" },
];

const questionSets: Record<number, QuizQuestion[]> = {
  1: [
    { eyebrow: "第一课 · 开口第一句", prompt: "“歹势”怎样读？", sub: "道歉或不好意思时使用", options: ["pháinn-sè", "to-siā", "tsài-huē"], answer: "pháinn-sè", explain: "“歹势”读作 pháinn-sè，表示不好意思或对不起。", audio: "/audio/phainn-se-word.mp3" },
    { eyebrow: "第一课 · 开口第一句", prompt: "“多谢”怎样读？", sub: "表达感谢", options: ["pháinn-sè", "to-siā", "tsài-huē"], answer: "to-siā", explain: "“多谢”读作 to-siā。", audio: "/audio/to-sia-word.mp3" },
    { eyebrow: "第一课 · 开口第一句", prompt: "“再会”怎样读？", sub: "道别时使用", options: ["tsài-huē", "to-siā", "pháinn-sè"], answer: "tsài-huē", explain: "“再会”读作 tsài-huē。", audio: "/audio/tsai-hue-word.mp3" },
    { eyebrow: "第一课 · 开口第一句", prompt: "“多谢你”怎样读？", sub: "把感谢完整说给对方", options: ["to-siā--lí", "pháinn-sè--lí", "tsài-huē--lí"], answer: "to-siā--lí", explain: "“多谢你”读作 to-siā--lí。", audio: "/audio/lesson-1-sentence.mp3" },
  ],
  2: questions,
  3: [
    { eyebrow: "第三课 · 厝内的人", prompt: "“阿爸”怎样读？", sub: "先听完整称谓", options: ["a-pah", "a-bú", "lāu-pē"], answer: "a-pah", explain: "“阿爸”是对父亲的称呼，读作 a-pah。", audio: "/audio/a-pah-word.mp3" },
    { eyebrow: "第三课 · 厝内的人", prompt: "“阿母”怎样读？", sub: "先听完整称谓", options: ["a-bú", "a-pah", "a-niâ"], answer: "a-bú", explain: "“阿母”是对母亲的称呼，读作 a-bú。", audio: "/audio/a-bu-word.mp3" },
    { eyebrow: "第三课 · 厝内的人", prompt: "“囡仔”怎样读？", sub: "称呼小孩", options: ["gín-á", "kiánn-á", "gín-ná"], answer: "gín-á", explain: "“囡仔”读作 gín-á，意思是小孩。", audio: "/audio/gin-a-word.mp3" },
    { eyebrow: "第三课 · 厝内的人", prompt: "“厝内”是什么意思？", sub: "家人生活的地方", options: ["家里", "街上", "学校"], answer: "家里", explain: "“厝内”读作 tshù-lāi，意思是家里、屋内。", audio: "/audio/tshu-lai-word.mp3" },
  ],
  4: [
    { eyebrow: "第四课 · 街仔路", prompt: "“买”怎样读？", sub: "在街上购物会用到", options: ["bé", "bē", "bái"], answer: "bé", explain: "“买”读作 bé；部分腔口也读 bué。", audio: "/audio/be-word.mp3" },
    { eyebrow: "第四课 · 街仔路", prompt: "“问路”怎样读？", sub: "找不到方向时使用", options: ["mn̄g-lōo", "m̄-lōo", "būn-lōo"], answer: "mn̄g-lōo", explain: "“问路”读作 mn̄g-lōo。", audio: "/audio/mng-loo-word.mp3" },
    { eyebrow: "第四课 · 街仔路", prompt: "“行路”怎样读？", sub: "表示走路", options: ["kiânn-lōo", "hâng-lōo", "kìnn-lōo"], answer: "kiânn-lōo", explain: "日常口语的“行路”读作 kiânn-lōo。", audio: "/audio/kiann-loo-word.mp3" },
    { eyebrow: "第四课 · 街仔路", prompt: "“车头”通常是什么意思？", sub: "问路时可能听见", options: ["车站", "商店", "医院"], answer: "车站", explain: "“车头”读作 tshia-thâu，常用来指车站。", audio: "/audio/tshia-thau-word.mp3" },
  ],
  5: [
    { eyebrow: "第五课 · 一工的时间", prompt: "“早起”怎样读？", sub: "一天刚开始的时候", options: ["tsá-khí", "tsá-khì", "tso-khí"], answer: "tsá-khí", explain: "“早起”读作 tsá-khí，意思是早上。", audio: "/audio/tsa-khi-word.mp3" },
    { eyebrow: "第五课 · 一工的时间", prompt: "“下晡”怎样读？", sub: "中午过后的时段", options: ["ē-poo", "ē-pōo", "ē-pôo"], answer: "ē-poo", explain: "“下晡”读作 ē-poo，意思是下午。", audio: "/audio/e-poo-word.mp3" },
    { eyebrow: "第五课 · 一工的时间", prompt: "“暗时”怎样读？", sub: "天黑后的时段", options: ["àm-sî", "àm-sī", "am-sî"], answer: "àm-sî", explain: "“暗时”读作 àm-sî，意思是晚上。", audio: "/audio/am-si-word.mp3" },
    { eyebrow: "第五课 · 一工的时间", prompt: "“明仔载”怎样读？", sub: "指今天的下一天", options: ["bîn-á-tsài", "bîng-á-tsài", "bîn-á-tài"], answer: "bîn-á-tsài", explain: "“明仔载”读作 bîn-á-tsài，意思是明天。", audio: "/audio/bin-a-tsai-word.mp3" },
  ],
  6: [
    { eyebrow: "第六课 · 看天讲天气", prompt: "“天气”怎样读？", sub: "先听完整词语", options: ["thinn-khì", "thian-khì", "thinn-khī"], answer: "thinn-khì", explain: "“天气”读作 thinn-khì。", audio: "/audio/thinn-khi-word.mp3" },
    { eyebrow: "第六课 · 看天讲天气", prompt: "“好天”怎样读？", sub: "形容晴朗的天气", options: ["hó-thinn", "hó-thian", "hō-thinn"], answer: "hó-thinn", explain: "“好天”读作 hó-thinn。", audio: "/audio/ho-thinn-word.mp3" },
    { eyebrow: "第六课 · 看天讲天气", prompt: "“落雨”怎样读？", sub: "表示正在下雨", options: ["lo̍h-hōo", "lo̍h-hú", "lōh-hōo"], answer: "lo̍h-hōo", explain: "“落雨”读作 lo̍h-hōo。", audio: "/audio/loh-hoo-word.mp3" },
    { eyebrow: "第六课 · 看天讲天气", prompt: "“风颱”怎样读？", sub: "台湾夏秋常见的天气", options: ["hong-thai", "hong-tâi", "hông-thai"], answer: "hong-thai", explain: "“风颱”读作 hong-thai，意思是台风。", audio: "/audio/hong-thai-word.mp3" },
  ],
  7: [
    { eyebrow: "第七课 · 数字佮钱", prompt: "“一”在数量里怎样读？", sub: "日常数数使用白读", options: ["tsi̍t", "it", "tsit"], answer: "tsi̍t", explain: "数量“一”常读作 tsi̍t。", audio: "/audio/tsit-word.mp3" },
    { eyebrow: "第七课 · 数字佮钱", prompt: "“两”怎样读？", sub: "表示两个、两件", options: ["nn̄g", "lióng", "nńg"], answer: "nn̄g", explain: "日常数量“两”读作 nn̄g。", audio: "/audio/nng-word.mp3" },
    { eyebrow: "第七课 · 数字佮钱", prompt: "“百”怎样读？", sub: "一百、两百都会用到", options: ["pah", "peh", "pak"], answer: "pah", explain: "“百”读作 pah。", audio: "/audio/pah-word.mp3" },
    { eyebrow: "第七课 · 数字佮钱", prompt: "“箍”在钱数里是什么意思？", sub: "台湾台语常见货币量词", options: ["块、元", "角", "张"], answer: "块、元", explain: "“箍”读作 khoo，可表示一块钱、一元。", audio: "/audio/khoo-word.mp3" },
  ],
  8: [
    { eyebrow: "第八课 · 菜市仔买物", prompt: "“菜市仔”怎样读？", sub: "买菜买肉的地方", options: ["tshài-tshī-á", "tshài-tshì-á", "tshāi-tshī-á"], answer: "tshài-tshī-á", explain: "“菜市仔”读作 tshài-tshī-á，意思是菜市场。", audio: "/audio/tshai-tshi-a-word.mp3" },
    { eyebrow: "第八课 · 菜市仔买物", prompt: "“青菜”怎样读？", sub: "市场里常买的蔬菜", options: ["tshenn-tshài", "tshing-tshài", "tshenn-tshāi"], answer: "tshenn-tshài", explain: "“青菜”通行腔读作 tshenn-tshài。", audio: "/audio/tshenn-tshai-word.mp3" },
    { eyebrow: "第八课 · 菜市仔买物", prompt: "“鱼”怎样读？", sub: "市场水产摊会看到", options: ["hî", "hû", "gû"], answer: "hî", explain: "“鱼”通行腔读作 hî，部分腔口读 hû。", audio: "/audio/hi-word.mp3" },
    { eyebrow: "第八课 · 菜市仔买物", prompt: "“肉”怎样读？", sub: "买猪肉、鸡肉都会用到", options: ["bah", "jio̍k", "ba̍h"], answer: "bah", explain: "口语的“肉”读作 bah。", audio: "/audio/bah-word.mp3" },
  ],
  9: [
    { eyebrow: "第九课 · 坐车出门", prompt: "“火车”怎样读？", sub: "搭铁路交通工具", options: ["hué-tshia", "hé-tshia", "hué-tshā"], answer: "hué-tshia", explain: "通行腔“火车”读作 hué-tshia；也有 hé-tshia 的腔口。", audio: "/audio/hue-tshia-word.mp3" },
    { eyebrow: "第九课 · 坐车出门", prompt: "“公车”怎样读？", sub: "城市里常见的大众运输", options: ["kong-tshia", "kong-tshā", "kóng-tshia"], answer: "kong-tshia", explain: "“公车”读作 kong-tshia。", audio: "/audio/kong-tshia-word.mp3" },
    { eyebrow: "第九课 · 坐车出门", prompt: "“车头”通常是什么意思？", sub: "出门时常用来指车站", options: ["车站", "车票", "司机"], answer: "车站", explain: "“车头”读作 tshia-thâu，在许多语境里指车站。", audio: "/audio/tshia-thau-word.mp3" },
    { eyebrow: "第九课 · 坐车出门", prompt: "“车票”怎样读？", sub: "上车前要准备的票", options: ["tshia-phiò", "tshia-phiō", "tshia-piò"], answer: "tshia-phiò", explain: "“车票”读作 tshia-phiò。", audio: "/audio/tshia-phio-word.mp3" },
  ],
  10: [
    { eyebrow: "第十课 · 身体无爽快", prompt: "“头疼”怎样读？", sub: "表示头痛", options: ["thâu-thiànn", "thâu-thàng", "thāu-thiànn"], answer: "thâu-thiànn", explain: "“头疼”读作 thâu-thiànn。", audio: "/audio/thau-thiann-word.mp3" },
    { eyebrow: "第十课 · 身体无爽快", prompt: "“腹肚”是什么意思？", sub: "身体中间的部位", options: ["肚子", "头", "手臂"], answer: "肚子", explain: "“腹肚”读作 pak-tóo，意思是肚子。", audio: "/audio/pak-too-word.mp3" },
    { eyebrow: "第十课 · 身体无爽快", prompt: "“看医生”怎样读？", sub: "身体不舒服时要做的事", options: ["khuànn-i-sing", "khuànn-i-sinn", "khuānn-i-sing"], answer: "khuànn-i-sing", explain: "“看医生”读作 khuànn-i-sing。", audio: "/audio/khuann-i-sing-word.mp3" },
    { eyebrow: "第十课 · 身体无爽快", prompt: "“药”怎样读？", sub: "看医生后可能需要服用", options: ["io̍h", "ioh", "ia̍h"], answer: "io̍h", explain: "“药”读作 io̍h。", audio: "/audio/ioh-word.mp3" },
  ],
  11: [
    { eyebrow: "第十一课 · 学校读册", prompt: "“读册”怎样读？", sub: "表示读书或上学", options: ["tha̍k-tsheh", "tha̍k-tsu", "thak-tsheh"], answer: "tha̍k-tsheh", explain: "“读册”读作 tha̍k-tsheh。", audio: "/audio/thak-tsheh-word.mp3" },
    { eyebrow: "第十一课 · 学校读册", prompt: "“写字”怎样读？", sub: "拿笔书写文字", options: ["siá-jī", "siá-lī", "sia-jī"], answer: "siá-jī", explain: "“写字”读作 siá-jī。", audio: "/audio/sia-ji-word.mp3" },
    { eyebrow: "第十一课 · 学校读册", prompt: "“老师”怎样读？", sub: "教导学生的人", options: ["lāu-su", "lāu-sai", "lau-su"], answer: "lāu-su", explain: "“老师”读作 lāu-su。", audio: "/audio/lau-su-word.mp3" },
    { eyebrow: "第十一课 · 学校读册", prompt: "“学校”怎样读？", sub: "学习和上课的地方", options: ["ha̍k-hāu", "ha̍k-háu", "hak-hāu"], answer: "ha̍k-hāu", explain: "“学校”读作 ha̍k-hāu。", audio: "/audio/hak-hau-word.mp3" },
  ],
  12: [
    { eyebrow: "第十二课 · 讲心内的话", prompt: "“欢喜”是什么意思？", sub: "表达开心、高兴", options: ["高兴", "担心", "疲倦"], answer: "高兴", explain: "“欢喜”读作 huann-hí，意思是高兴。", audio: "/audio/huann-hi-word.mp3" },
    { eyebrow: "第十二课 · 讲心内的话", prompt: "“艰苦”在心情上是什么意思？", sub: "表示难受、不好过", options: ["难受", "轻松", "惊讶"], answer: "难受", explain: "“艰苦”读作 kan-khóo，可表示难受、不好过。", audio: "/audio/kan-khoo-word.mp3" },
    { eyebrow: "第十二课 · 讲心内的话", prompt: "“受气”怎样读？", sub: "受到委屈或生气", options: ["siū-khì", "siu-khì", "siū-khī"], answer: "siū-khì", explain: "“受气”读作 siū-khì。", audio: "/audio/siu-khi-word.mp3" },
    { eyebrow: "第十二课 · 讲心内的话", prompt: "“伤心”怎样读？", sub: "心里悲伤难过", options: ["siong-sim", "sióng-sim", "siong-sîm"], answer: "siong-sim", explain: "“伤心”读作 siong-sim。", audio: "/audio/siong-sim-word.mp3" },
  ],
  13: [
    { eyebrow: "第十三课 · 借问按怎行", prompt: "问路前说“借问”是什么意思？", sub: "先礼貌地向对方开口", options: ["请问、劳驾", "谢谢", "再见"], answer: "请问、劳驾", explain: "“借问”读作 tsioh-mn̄g，是向陌生人问路时很自然的开场。", audio: "/audio/travel/tsioh-mng.wav" },
    { eyebrow: "第十三课 · 借问按怎行", prompt: "“佗位”是什么意思？", sub: "询问目的地的位置", options: ["哪里", "什么时候", "多少钱"], answer: "哪里", explain: "“佗位”读作 tó-uī，用来问地点在哪里。", audio: "/audio/travel/to-ui.wav" },
    { eyebrow: "第十三课 · 借问按怎行", prompt: "“倒手爿”是哪一边？", sub: "听懂路线中的方向", options: ["左边", "右边", "前面"], answer: "左边", explain: "“倒手爿”读作 tò-tshiú-pîng，意思是左边。", audio: "/audio/travel/to-tshiu-ping.wav" },
    { eyebrow: "第十三课 · 借问按怎行", prompt: "“正手爿”是哪一边？", sub: "听懂路线中的方向", options: ["右边", "左边", "后面"], answer: "右边", explain: "“正手爿”读作 tsiànn-tshiú-pîng，意思是右边。", audio: "/audio/travel/tsiann-tshiu-ping.wav" },
  ],
  14: [
    { eyebrow: "第十四课 · 搭车佮换车", prompt: "“捷运”是什么交通工具？", sub: "城市里常见的大众运输", options: ["地铁、捷运", "出租车", "轮船"], answer: "地铁、捷运", explain: "“捷运”读作 tsia̍t-ūn。", audio: "/audio/travel/tsiat-un.wav" },
    { eyebrow: "第十四课 · 搭车佮换车", prompt: "“月台”是什么意思？", sub: "上车前等待的地方", options: ["站台", "售票处", "停车场"], answer: "站台", explain: "“月台”读作 gua̍t-tâi，是候车和上下车的平台。", audio: "/audio/travel/guat-tai.wav" },
    { eyebrow: "第十四课 · 搭车佮换车", prompt: "“落车”是什么意思？", sub: "到站以后要做的动作", options: ["下车", "上车", "开车"], answer: "下车", explain: "“落车”读作 lo̍h-tshia，意思是下车。", audio: "/audio/travel/loh-tshia.wav" },
    { eyebrow: "第十四课 · 搭车佮换车", prompt: "“换车”是什么意思？", sub: "途中改搭另一班车", options: ["换乘、转车", "买车票", "等下一站"], answer: "换乘、转车", explain: "“换车”读作 uānn-tshia，表示换乘另一班车。", audio: "/audio/travel/uann-tshia.wav" },
  ],
  15: [
    { eyebrow: "第十五课 · 旅馆办入住", prompt: "“旅馆”是什么意思？", sub: "旅行时住宿的地方", options: ["旅馆、酒店", "餐厅", "车站"], answer: "旅馆、酒店", explain: "“旅馆”读作 lí-kuán。", audio: "/audio/travel/li-kuan.wav" },
    { eyebrow: "第十五课 · 旅馆办入住", prompt: "“订房”是什么意思？", sub: "抵达以前先保留房间", options: ["预订房间", "打扫房间", "退房"], answer: "预订房间", explain: "“订房”读作 tīng-pâng，表示预订住宿。", audio: "/audio/travel/ting-pang.wav" },
    { eyebrow: "第十五课 · 旅馆办入住", prompt: "“房间”怎样读？", sub: "办理入住时会用到", options: ["pâng-king", "pâng-kan", "phâng-king"], answer: "pâng-king", explain: "“房间”读作 pâng-king。", audio: "/audio/travel/pang-king.wav" },
    { eyebrow: "第十五课 · 旅馆办入住", prompt: "办理入住时可能要出示什么？", sub: "用来确认旅客身份", options: ["护照", "门票", "车票"], answer: "护照", explain: "“护照”读作 hōo-tsiàu。", audio: "/audio/travel/hoo-tsiau.wav" },
  ],
  16: [
    { eyebrow: "第十六课 · 景点佮求助", prompt: "“门票”怎样读？", sub: "进入景点前购买", options: ["mn̂g-phiò", "mn̂g-phio", "bûn-phiò"], answer: "mn̂g-phiò", explain: "“门票”读作 mn̂g-phiò。", audio: "/audio/travel/mng-phio.wav" },
    { eyebrow: "第十六课 · 景点佮求助", prompt: "“翕相”是什么意思？", sub: "旅行时记录风景", options: ["拍照", "买票", "问路"], answer: "拍照", explain: "“翕相”读作 hip-siòng，意思是拍照。", audio: "/audio/travel/hip-siong.wav" },
    { eyebrow: "第十六课 · 景点佮求助", prompt: "“毋见去”表示什么情况？", sub: "随身物品找不到了", options: ["不见了、遗失了", "已经买到了", "暂时借给别人"], answer: "不见了、遗失了", explain: "“毋见去”读作 m̄-kìnn-khì，表示东西不见了。", audio: "/audio/travel/m-kinn-khi.wav" },
    { eyebrow: "第十六课 · 景点佮求助", prompt: "遗失重要物品可以去哪里求助？", sub: "向警方说明情况", options: ["派出所", "旅馆", "月台"], answer: "派出所", explain: "“派出所”读作 phài-tshut-sóo。", audio: "/audio/travel/phai-tshut-soo.wav" },
  ],
};

const lessonSentences: Record<number, LessonSentence> = {
  1: { han: "多谢你！", tl: "To-siā--lí!", meaning: "谢谢你！", audio: "/audio/lesson-1-sentence.mp3" },
  2: { han: "大学毕业了后就爱揣头路。", tl: "Tāi-ha̍k pit-gia̍p liáu-āu tō ài tshuē thâu-lōo.", meaning: "大学毕业以后就要找工作。", audio: "/audio/lesson-2-sentence.mp3" },
  3: { han: "伊的囡仔真古锥。", tl: "I ê gín-á tsin kóo-tsui.", meaning: "他的小孩真可爱。", audio: "/audio/lesson-3-sentence.mp3" },
  4: { han: "借问一下，我欲去车头爱按佗位行？", tl: "Tsioh-mn̄g--tsi̍t-ē, guá beh khì tshia-thâu ài àn tó-uī kiânn?", meaning: "请问一下，我要去车站该往哪里走？", audio: "/audio/lesson-4-sentence.mp3" },
  5: { han: "明仔载的代志明仔载才阁讲。", tl: "Bîn-á-tsài ê tāi-tsì bîn-á-tsài tsiah-koh kóng.", meaning: "明天的事情明天再说。", audio: "/audio/lesson-5-sentence.mp3" },
  6: { han: "外口咧落雨，等雨停才来去。", tl: "Guā-kháu teh lo̍h-hōo, tán hōo thîng tsiah lâi-khì.", meaning: "外面在下雨，等雨停了再去。", audio: "/audio/lesson-6-sentence.mp3" },
  7: { han: "一百箍。", tl: "Tsi̍t-pah khoo.", meaning: "一百块钱。", audio: "/audio/lesson-7-sentence.mp3" },
  8: { han: "我欲买衫。", tl: "Guá beh bé sann.", meaning: "我要买衣服。", audio: "/audio/lesson-8-sentence.mp3" },
  9: { han: "等咧咱佇火车头的前驿相等，做伙坐后一帮火车上北。", tl: "Tán--leh lán tī hué-tshia-thâu ê tsîng-ia̍h sio-tán, tsò-hué tsē āu tsi̍t pang hué-tshia tsiūnn-pak.", meaning: "等一下我们在火车站的前站见，一起坐下一班火车北上。", audio: "/audio/lesson-9-sentence.mp3" },
  10: { han: "你病甲遮尔严重，爱紧去看医生。", tl: "Lí pēnn kah tsiah-nī giâm-tiōng, ài kín khì khuànn-i-sing.", meaning: "你病得这么严重，要赶快去看医生。", audio: "/audio/lesson-10-sentence.mp3" },
  11: { han: "咱读册就毋通读对尻脊骿去。", tl: "Lán tha̍k-tsheh tō m̄-thang tha̍k tuì kha-tsiah-phiann--khì.", meaning: "读书也要懂道理，不能白读。", audio: "/audio/lesson-11-sentence.mp3" },
  12: { han: "伊毋知咧欢喜啥物？", tl: "I m̄ tsai teh huann-hí siánn-mih?", meaning: "不知道他在高兴什么？", audio: "/audio/lesson-12-sentence.mp3" },
  13: { han: "借问，火车头佇佗位？", tl: "Tsioh-mn̄g, hué-tshia-thâu tī tó-uī?", meaning: "请问，火车站在哪里？", audio: "/audio/travel/lesson-13-sentence.wav" },
  14: { han: "欲去机场，佇佗位换车？", tl: "Beh khì ki-tiûnn, tī tó-uī uānn-tshia?", meaning: "要去机场，在哪里换车？", audio: "/audio/travel/lesson-14-sentence.wav" },
  15: { han: "我有订一间房间。", tl: "Guá ū tīng tsi̍t king pâng-king.", meaning: "我预订了一间房。", audio: "/audio/travel/lesson-15-sentence.wav" },
  16: { han: "歹势，会使共我翕相无？", tl: "Pháinn-sè, ē-sái kā guá hip-siòng--bô?", meaning: "不好意思，可以帮我拍照吗？", audio: "/audio/travel/lesson-16-sentence.wav" },
};

// A lesson sentence is shown only beside questions whose target word it actually contains.
const lessonSentenceQuestions: Record<number, number[]> = {
  1: [1, 3],
  3: [2],
  4: [3],
  5: [3],
  6: [2],
  7: [3],
  9: [0, 2],
  10: [2],
  11: [0],
  12: [0],
  13: [0, 1],
  14: [3],
  15: [1, 2],
  16: [1],
};

const topicTracks: TopicTrack[] = [
  {
    id: "numbers",
    eyebrow: "数字专题 · 3 个单元",
    title: "从 0 数到亿",
    description: "先把 0–10 的生活读法练熟，再进入十、百、千、万、亿与金额组合。",
    accent: "number",
    units: [
      {
        num: 1,
        title: "空到五",
        goal: "认识 0–5，建立最基础的计数节奏。",
        note: "数字 0 在号码或逐位报数时常读 khòng；生活数量中的“一、两”常读 tsi̍t、nn̄g。",
        words: [
          { han: "空（0）", tl: "khòng", meaning: "零；号码里的 0", audio: "/audio/khong-zero-word.mp3", exampleHan: "电话号码是空三空。", exampleTl: "Tiān-uē hō-bé sī khòng-sann-khòng.", exampleMeaning: "电话号码是 030。" },
          { han: "一（1）", tl: "tsi̍t", meaning: "一、一个", audio: "/audio/tsit-word.mp3", exampleHan: "我欲买一枝铅笔。", exampleTl: "Guá beh bé tsi̍t ki iân-pit.", exampleMeaning: "我要买一枝铅笔。" },
          { han: "两（2）", tl: "nn̄g", meaning: "二、两个", audio: "/audio/nng-word.mp3", exampleHan: "我欲买两斤青菜。", exampleTl: "Guá beh bé nn̄g kin tshenn-tshài.", exampleMeaning: "我要买两斤青菜。" },
          { han: "三（3）", tl: "sann", meaning: "三", audio: "/audio/sann-number-word.mp3", exampleHan: "伊有三个囡仔。", exampleTl: "I ū sann ê gín-á.", exampleMeaning: "他有三个孩子。" },
          { han: "四（4）", tl: "sì", meaning: "四", audio: "/audio/si-number-word.mp3", exampleHan: "一领衫四百箍。", exampleTl: "Tsi̍t niá sann sì pah khoo.", exampleMeaning: "一件衣服四百块。" },
          { han: "五（5）", tl: "gōo", meaning: "五", audio: "/audio/goo-number-word.mp3", exampleHan: "我买五本簿仔。", exampleTl: "Guá bé gōo pún phōo-á.", exampleMeaning: "我买五本本子。" },
        ],
      },
      {
        num: 2,
        title: "六到十",
        goal: "完成 6–10，并练习连续报数。",
        note: "三、八、十等数字另有文读音；本单元先学习日常计数常用的白读 sann、peh、tsa̍p。",
        words: [
          { han: "六（6）", tl: "la̍k", meaning: "六", audio: "/audio/lak-number-word.mp3", exampleHan: "阮兜有六个人。", exampleTl: "Guán tau ū la̍k ê lâng.", exampleMeaning: "我们家有六个人。" },
          { han: "七（7）", tl: "tshit", meaning: "七", audio: "/audio/tshit-number-word.mp3", exampleHan: "一礼拜有七工。", exampleTl: "Tsi̍t lé-pài ū tshit kang.", exampleMeaning: "一个星期有七天。" },
          { han: "八（8）", tl: "peh", meaning: "八", audio: "/audio/peh-number-word.mp3", exampleHan: "这盒有八枝笔。", exampleTl: "Tsit a̍p ū peh ki pit.", exampleMeaning: "这盒有八枝笔。" },
          { han: "九（9）", tl: "káu", meaning: "九", audio: "/audio/kau-number-word.mp3", exampleHan: "伊九点到。", exampleTl: "I káu tiám kàu.", exampleMeaning: "他九点到。" },
          { han: "十（10）", tl: "tsa̍p", meaning: "十", audio: "/audio/tsap-number-word.mp3", exampleHan: "这本册十箍。", exampleTl: "Tsit pún tsheh tsa̍p khoo.", exampleMeaning: "这本书十块钱。" },
        ],
      },
      {
        num: 3,
        title: "百、千、万、亿",
        goal: "读懂价格、人口和较大的数字。",
        note: "组合时从大位数往小位数读，例如“一百箍”是 tsi̍t-pah khoo。",
        words: [
          { han: "十", tl: "tsa̍p", meaning: "10", audio: "/audio/tsap-number-word.mp3", exampleHan: "这本册十箍。", exampleTl: "Tsit pún tsheh tsa̍p khoo.", exampleMeaning: "这本书十块钱。" },
          { han: "百", tl: "pah", meaning: "100", audio: "/audio/pah-word.mp3", exampleHan: "这领衫一百箍。", exampleTl: "Tsit niá sann tsi̍t pah khoo.", exampleMeaning: "这件衣服一百块。" },
          { han: "千", tl: "tshing", meaning: "1,000", audio: "/audio/tshing-number-word.mp3", exampleHan: "这台车一千箍。", exampleTl: "Tsit tâi tshia tsi̍t tshing khoo.", exampleMeaning: "这辆车一千块。" },
          { han: "万", tl: "bān", meaning: "10,000", audio: "/audio/ban-number-word.mp3", exampleHan: "伊有一万箍。", exampleTl: "I ū tsi̍t bān khoo.", exampleMeaning: "他有一万块钱。" },
          { han: "亿", tl: "ik", meaning: "100,000,000", audio: "/audio/ik-number-word.mp3", exampleHan: "一亿是十个一千万。", exampleTl: "Tsi̍t ik sī tsa̍p ê tsi̍t-tshing-bān.", exampleMeaning: "一亿是十个一千万。" },
          { han: "一百箍", tl: "tsi̍t-pah khoo", meaning: "一百块钱", audio: "/audio/lesson-7-sentence.mp3", exampleHan: "这件一百箍。", exampleTl: "Tsit kiānn tsi̍t-pah khoo.", exampleMeaning: "这一件一百块。" },
        ],
      },
    ],
  },
  {
    id: "shopping",
    eyebrow: "购物专题 · 3 个单元",
    title: "从菜市场买到文具店",
    description: "依真实购物场景学习买菜、买衣服、买文具所需的词语和问法。",
    accent: "shopping",
    units: [
      {
        num: 1,
        title: "买菜",
        goal: "认摊位、说品项、问重量和价钱。",
        note: "问价钱可先掌握“偌济”（多少）和“钱”，再组合成生活问句。",
        words: [
          { han: "菜市仔", tl: "tshài-tshī-á", meaning: "菜市场", audio: "/audio/tshai-tshi-a-word.mp3", exampleHan: "我欲去菜市仔。", exampleTl: "Guá beh khì tshài-tshī-á.", exampleMeaning: "我要去菜市场。" },
          { han: "青菜", tl: "tshenn-tshài", meaning: "蔬菜、青菜", audio: "/audio/tshenn-tshai-word.mp3", exampleHan: "我欲买青菜。", exampleTl: "Guá beh bé tshenn-tshài.", exampleMeaning: "我要买青菜。" },
          { han: "鱼", tl: "hî", meaning: "鱼", audio: "/audio/hi-word.mp3", exampleHan: "这尾鱼真青。", exampleTl: "Tsit bué hî tsin tshenn.", exampleMeaning: "这条鱼很新鲜。" },
          { han: "肉", tl: "bah", meaning: "肉", audio: "/audio/bah-word.mp3", exampleHan: "我欲买肉。", exampleTl: "Guá beh bé bah.", exampleMeaning: "我要买肉。" },
          { han: "斤", tl: "kin", meaning: "斤；重量单位", audio: "/audio/kin-word.mp3", exampleHan: "青菜一斤偌济钱？", exampleTl: "Tshenn-tshài tsi̍t kin guā-tsē tsînn?", exampleMeaning: "青菜一斤多少钱？" },
          { han: "偌济", tl: "guā-tsē", meaning: "多少", audio: "/audio/gua-tse-word.mp3", exampleHan: "青菜一斤偌济钱？", exampleTl: "Tshenn-tshài tsi̍t kin guā-tsē tsînn?", exampleMeaning: "青菜一斤多少钱？" },
          { han: "钱", tl: "tsînn", meaning: "钱、价钱", audio: "/audio/tsinn-word.mp3", exampleHan: "青菜一斤偌济钱？", exampleTl: "Tshenn-tshài tsi̍t kin guā-tsē tsînn?", exampleMeaning: "青菜一斤多少钱？" },
        ],
      },
      {
        num: 2,
        title: "买衣服",
        goal: "说衣物、问尺寸，并提出试穿。",
        note: "“试看觅”是试试看；买衣服时可搭配“大细”询问尺寸大小。",
        words: [
          { han: "衫", tl: "sann", meaning: "衣服、上衣", audio: "/audio/sann-word.mp3", exampleHan: "我欲买衫。", exampleTl: "Guá beh bé sann.", exampleMeaning: "我要买衣服。" },
          { han: "裤", tl: "khòo", meaning: "裤子", audio: "/audio/khoo-trousers-word.mp3", exampleHan: "这条裤偌济钱？", exampleTl: "Tsit tiâu khòo guā-tsē tsînn?", exampleMeaning: "这条裤子多少钱？" },
          { han: "鞋", tl: "ê", meaning: "鞋子", audio: "/audio/e-shoes-word.mp3", exampleHan: "这双鞋有合无？", exampleTl: "Tsit siang ê ū ha̍h--bô?", exampleMeaning: "这双鞋合不合脚？" },
          { han: "衫仔裤", tl: "sann-á-khòo", meaning: "衣服和裤子", audio: "/audio/sann-a-khoo-word.mp3", exampleHan: "衫仔裤拢伫遮。", exampleTl: "Sann-á-khòo lóng tī tsia.", exampleMeaning: "衣服和裤子都在这里。" },
          { han: "大细", tl: "tuā-sè", meaning: "大小、尺寸", audio: "/audio/tua-se-word.mp3", exampleHan: "这领衫的大细有合无？", exampleTl: "Tsit niá sann ê tuā-sè ū ha̍h--bô?", exampleMeaning: "这件衣服的尺寸合适吗？" },
          { han: "试看觅", tl: "tshì khuànn-māi", meaning: "试试看", audio: "/audio/tshi-khuann-mai-word.mp3", exampleHan: "这领衫予你试看觅。", exampleTl: "Tsit niá sann hōo lí tshì khuànn-māi.", exampleMeaning: "这件衣服给你试试看。" },
        ],
      },
      {
        num: 3,
        title: "买文具",
        goal: "走进文具店，找笔、本子、橡皮擦和尺。",
        note: "“簿仔”是本子，“拊仔”可指橡皮擦；先听完整词语，再记臺罗。",
        words: [
          { han: "文具店", tl: "bûn-kū-tiàm", meaning: "文具店", audio: "/audio/bun-ku-tiam-word.mp3", exampleHan: "文具店伫佗位？", exampleTl: "Bûn-kū-tiàm tī tó-uī?", exampleMeaning: "文具店在哪里？" },
          { han: "铅笔", tl: "iân-pit", meaning: "铅笔", audio: "/audio/ian-pit-word.mp3", exampleHan: "我欲买一枝铅笔。", exampleTl: "Guá beh bé tsi̍t ki iân-pit.", exampleMeaning: "我要买一枝铅笔。" },
          { han: "原子笔", tl: "guân-tsú-pit", meaning: "圆珠笔", audio: "/audio/guan-tsu-pit-word.mp3", exampleHan: "我欲买一枝原子笔。", exampleTl: "Guá beh bé tsi̍t ki guân-tsú-pit.", exampleMeaning: "我要买一枝圆珠笔。" },
          { han: "簿仔", tl: "phōo-á", meaning: "本子、笔记本", audio: "/audio/phoo-a-word.mp3", exampleHan: "我欲买两本簿仔。", exampleTl: "Guá beh bé nn̄g pún phōo-á.", exampleMeaning: "我要买两本本子。" },
          { han: "拊仔", tl: "hú-á", meaning: "橡皮擦", audio: "/audio/hu-a-word.mp3", exampleHan: "铅笔写毋着，用拊仔拭。", exampleTl: "Iân-pit siá m̄-tio̍h, īng hú-á tshit.", exampleMeaning: "铅笔写错了，用橡皮擦擦掉。" },
          { han: "尺", tl: "tshe", meaning: "尺子", audio: "/audio/tshe-ruler-word.mp3", exampleHan: "这枝尺真长。", exampleTl: "Tsit ki tshe tsin tn̂g.", exampleMeaning: "这把尺很长。" },
        ],
      },
    ],
  },
];

type AccentPreference = "台湾通行腔" | "厦门腔" | "泉州腔" | "漳州腔";

type LearningSettings = {
  volume: number;
  fontSize: number;
  accent: AccentPreference;
  autoPlay: boolean;
  script: "simplified" | "traditional";
};

const defaultSettings: LearningSettings = {
  volume: 80,
  fontSize: 16,
  accent: "台湾通行腔",
  autoPlay: false,
  script: "simplified",
};

const accentNotes: Record<AccentPreference, string> = {
  台湾通行腔: "教育部臺罗 · 本调标音",
  厦门腔: "厦门市区常用腔调",
  泉州腔: "保留较多古音特色",
  漳州腔: "语调柔和、韵母鲜明",
};

function SoundButton({ text, src, label = "听真人发音" }: { text: string; src: string; label?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "playing">("idle");
  const play = () => {
    audioRef.current?.pause();
    const audio = new Audio(src);
    const preferredVolume = Number(document.documentElement.dataset.audioVolume ?? defaultSettings.volume);
    audio.volume = Math.min(1, Math.max(0, preferredVolume / 100));
    audioRef.current = audio;
    setStatus("loading");
    audio.onplaying = () => setStatus("playing");
    audio.onended = () => setStatus("idle");
    audio.onerror = () => setStatus("idle");
    void audio.play().catch(() => setStatus("idle"));
  };
  return <button className={`sound-button ${status}`} onClick={play} aria-label={`${label}：${text}`} title="播放闽南话发音"><span>{status === "playing" ? "〽" : "▶"}</span>{status === "loading" ? "载入中" : label}</button>;
}

export default function Home() {
  const [tab, setTab] = useState("学习");
  const [showLesson, setShowLesson] = useState(false);
  const [question, setQuestion] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(7);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [selectedLesson, setSelectedLesson] = useState(2);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [lexiconView, setLexiconView] = useState<"phrases" | "topics">("phrases");
  const [showTopicLesson, setShowTopicLesson] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState("numbers");
  const [selectedTopicUnit, setSelectedTopicUnit] = useState(1);
  const [topicStep, setTopicStep] = useState(0);
  const [topicPicked, setTopicPicked] = useState<string | null>(null);
  const [completedTopicUnits, setCompletedTopicUnits] = useState<string[]>([]);
  const [devMode, setDevMode] = useState(false);
  const [stateReady, setStateReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<LearningSettings>(defaultSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const state = window.localStorage.getItem("lanlai-state");
      const storedSettings = window.localStorage.getItem("lanlai-settings");
      if (state) {
        try {
          const parsed = JSON.parse(state);
          const restoredXp = parsed.xp ?? 120;
          setXp(restoredXp); setStreak(parsed.streak ?? 7); setSaved(parsed.saved ?? []);
          setCompletedLessons(parsed.completedLessons ?? (restoredXp >= 160 ? [1, 2] : [1]));
          setCompletedTopicUnits(parsed.completedTopicUnits ?? []);
          setDevMode(parsed.devMode ?? false);
        } catch { /* keep demo defaults */ }
      }
      if (storedSettings) {
        try { setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) }); } catch { /* keep preference defaults */ }
      }
      setStateReady(true);
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!stateReady) return;
    window.localStorage.setItem("lanlai-state", JSON.stringify({ xp, streak, saved, completedLessons, completedTopicUnits, devMode }));
  }, [xp, streak, saved, completedLessons, completedTopicUnits, devMode, stateReady]);

  useEffect(() => {
    document.documentElement.dataset.audioVolume = String(settings.volume);
    document.body.style.setProperty("zoom", String(settings.fontSize / 16));
    return () => document.body.style.removeProperty("zoom");
  }, [settings.volume, settings.fontSize]);

  useEffect(() => {
    const root = document.querySelector(".app-shell");
    if (!root) return;
    let disposed = false;
    let observer: MutationObserver | null = null;
    const applyScript = async () => {
      const converter = settings.script === "traditional"
        ? (await import("opencc-js/cn2t")).Converter({ from: "cn", to: "tw" })
        : (await import("opencc-js/t2cn")).Converter({ from: "tw", to: "cn" });
      if (disposed) return;
      const convertText = (node: Text) => {
        const parentTag = node.parentElement?.tagName;
        if (parentTag === "SCRIPT" || parentTag === "STYLE") return;
        const nextValue = converter(node.data);
        if (nextValue !== node.data) node.data = nextValue;
      };
      const convertElement = (element: Element) => {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
          convertText(node as Text);
          node = walker.nextNode();
        }
        element.querySelectorAll<HTMLElement>("[aria-label], [title], input[placeholder]").forEach((target) => {
          ["aria-label", "title", "placeholder"].forEach((attribute) => {
            const value = target.getAttribute(attribute);
            if (value) target.setAttribute(attribute, converter(value));
          });
        });
      };

      document.documentElement.lang = settings.script === "traditional" ? "zh-Hant" : "zh-CN";
      convertElement(root);
      let converting = false;
      observer = new MutationObserver((mutations) => {
        if (converting || !observer) return;
        converting = true;
        observer.disconnect();
        mutations.forEach((mutation) => {
          if (mutation.type === "characterData") convertText(mutation.target as Text);
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) convertText(node as Text);
            if (node.nodeType === Node.ELEMENT_NODE) convertElement(node as Element);
          });
        });
        observer.observe(root, { subtree: true, childList: true, characterData: true });
        converting = false;
      });
      observer.observe(root, { subtree: true, childList: true, characterData: true });
    };
    void applyScript();
    return () => {
      disposed = true;
      observer?.disconnect();
    };
  }, [settings.script]);

  useEffect(() => {
    if (!settingsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [settingsOpen]);

  const updateSetting = <K extends keyof LearningSettings>(key: K, value: LearningSettings[K]) => {
    setSettings((currentSettings) => ({ ...currentSettings, [key]: value }));
    setSettingsSaved(false);
  };

  const saveSettings = () => {
    window.localStorage.setItem("lanlai-settings", JSON.stringify(settings));
    setSettingsSaved(true);
    window.setTimeout(() => setSettingsSaved(false), 1600);
  };

  const filtered = useMemo(() => readings.filter((item) => (activeCategory === "全部" || item.category === activeCategory) && `${item.han}${item.tl}${item.meaning}${item.note}${item.category}`.toLowerCase().includes(search.toLowerCase())), [search, activeCategory]);
  const activeQuestions = questionSets[selectedLesson] ?? questions;
  const current = activeQuestions[question];
  const currentSentence = lessonSentences[selectedLesson];
  const showCurrentSentence = Boolean(currentSentence && lessonSentenceQuestions[selectedLesson]?.includes(question));
  const correct = picked === current?.answer;
  const activeTopic = topicTracks.find((track) => track.id === selectedTopicId) ?? topicTracks[0];
  const activeTopicUnit = activeTopic.units.find((unit) => unit.num === selectedTopicUnit) ?? activeTopic.units[0];
  const currentTopicWord = activeTopicUnit.words[topicStep] ?? activeTopicUnit.words[0];
  const topicDistractors = activeTopicUnit.words.filter((word) => word.meaning !== currentTopicWord.meaning).slice(topicStep % Math.max(activeTopicUnit.words.length - 1, 1)).concat(activeTopicUnit.words.filter((word) => word.meaning !== currentTopicWord.meaning)).slice(0, 2).map((word) => word.meaning);
  const topicAnswerPosition = topicStep % 3;
  const topicOptions = [...topicDistractors];
  topicOptions.splice(topicAnswerPosition, 0, currentTopicWord.meaning);
  const topicCorrect = topicPicked === currentTopicWord.meaning;
  const currentTopicExampleAudio = `/audio/topic-${activeTopic.id}-${activeTopicUnit.num}-${topicStep + 1}-example.wav`;

  useEffect(() => {
    if (!settings.autoPlay || !showLesson || !current?.audio) return;
    const audio = new Audio(current.audio);
    audio.volume = settings.volume / 100;
    void audio.play().catch(() => undefined);
    return () => audio.pause();
  }, [current?.audio, question, settings.autoPlay, settings.volume, showLesson]);

  useEffect(() => {
    if (!settings.autoPlay || !showTopicLesson || !currentTopicWord?.audio) return;
    const audio = new Audio(currentTopicWord.audio);
    audio.volume = settings.volume / 100;
    void audio.play().catch(() => undefined);
    return () => audio.pause();
  }, [currentTopicWord?.audio, settings.autoPlay, settings.volume, showTopicLesson, topicStep]);

  const nextLesson = lessons.find((lesson) => !completedLessons.includes(lesson.num))?.num ?? lessons.length;
  const isUnlocked = (num: number) => devMode || num === 1 || completedLessons.includes(num) || completedLessons.includes(num - 1);
  const openLesson = (num: number) => {
    if (!isUnlocked(num)) return;
    setSelectedLesson(num); setQuestion(0); setPicked(null); setShowLesson(true);
  };
  const openTopic = (id: string) => {
    setTab("专题");
    window.setTimeout(() => document.getElementById(`topic-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };
  const topicUnitKey = (id: string, num: number) => `${id}-${num}`;
  const isTopicUnitUnlocked = (id: string, num: number) => devMode || num === 1 || completedTopicUnits.includes(topicUnitKey(id, num - 1));
  const openTopicUnit = (id: string, num: number) => {
    if (!isTopicUnitUnlocked(id, num)) return;
    setSelectedTopicId(id); setSelectedTopicUnit(num); setTopicStep(0); setTopicPicked(null); setShowTopicLesson(true);
  };

  const nextQuestion = () => {
    if (!picked) return;
    if (question === activeQuestions.length - 1) {
      if (!completedLessons.includes(selectedLesson)) {
        setCompletedLessons((items) => [...items, selectedLesson].sort());
        setXp((value) => value + (lessons.find((lesson) => lesson.num === selectedLesson)?.xp ?? 20));
      }
      setShowLesson(false); setQuestion(0); setPicked(null); return;
    }
    setQuestion((value) => value + 1); setPicked(null);
  };
  const nextTopicStep = () => {
    if (!topicPicked) return;
    if (topicStep === activeTopicUnit.words.length - 1) {
      const key = topicUnitKey(activeTopic.id, activeTopicUnit.num);
      if (!completedTopicUnits.includes(key)) {
        setCompletedTopicUnits((items) => [...items, key]);
        setXp((value) => value + 40);
      }
      setShowTopicLesson(false); setTopicStep(0); setTopicPicked(null); return;
    }
    setTopicStep((value) => value + 1); setTopicPicked(null);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">讲</div><div><strong>咱来讲</strong><span>Lán Lâi Kóng</span></div></div>
        <nav aria-label="主导航">
          {[['学习','⌂'],['专题','册'],['复习','↻'],['词库','文'],['我的','人']].map(([name, icon]) => <button key={name} onClick={() => setTab(name)} className={tab === name ? "active" : ""}><i>{icon}</i>{name}</button>)}
        </nav>
        <div className="dialect-card"><span>偏好课程音系</span><strong>{settings.accent}</strong><small>{accentNotes[settings.accent]}</small><button className="dialect-link" onClick={() => setSettingsOpen(true)}>调整学习设置 →</button><div className="dev-toggle-row"><div><strong>开发者模式</strong><small>{devMode ? "全部课程已开放" : "课程依进度解锁"}</small></div><button className={`switch ${devMode ? "on" : ""}`} type="button" role="switch" aria-checked={devMode} aria-label="开发者模式：开放全部课程" onClick={() => setDevMode((value) => !value)}><i /></button></div></div>
        <div className="profile-mini"><div className="avatar">林</div><div><strong>学习者</strong><span>白鹭段位 · Lv. 4</span></div><b>›</b></div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => setTab("学习")}><b>讲</b> 咱来讲</button>
          <div className="stats"><span title="连续学习"><b className="fire">◆</b>{streak} 天</span><span title="本周经验"><b className="star">★</b>{xp} XP</span><button className="notice-button" aria-label="通知">●<i /></button><button className="settings-gear" type="button" aria-label="打开设置" aria-haspopup="dialog" onClick={() => setSettingsOpen(true)}>⚙</button></div>
        </header>

        {tab === "学习" && <div className="screen learn-screen">
          <section className="welcome">
            <div><p className="kicker">礼拜五 · 今日学习</p><h1>食饱未？继续来讲两句。</h1><p>Tsia̍h-pá--buē? 今天先学会辨认 4 组文白读。</p></div>
            <div className="today-ring"><div><strong>{completedLessons.length}</strong><span>/ {lessons.length} 课</span></div></div>
          </section>

          <section className="daily-card">
            <div className="daily-icon">文<small>白</small></div>
            <div className="daily-copy"><span className="tag">今日重点 · 约 6 分钟</span><h2>同一个字，为什么有两种读音？</h2><p>从“大”的 tuā / tāi 入手，用语境记住文读与白读。</p><div className="daily-sounds"><SoundButton text="大 tuā" src="/audio/toa-white.mp3" label="白读 tuā" /><SoundButton text="大 tāi" src="/audio/tai-literary.mp3" label="文读 tāi" /></div><div className="mini-progress"><i style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }} /><span>已完成 {completedLessons.length} / {lessons.length} 课</span></div></div>
            <button className="primary" onClick={() => openLesson(nextLesson)}>{completedLessons.length >= lessons.length ? "回顾课程" : `继续第 ${nextLesson} 课`} <span>→</span></button>
          </section>

          <section className="topic-overview">
            <header><div><span>新增专题课程</span><h2>数字与购物 · 6 个完整单元</h2><p>专题已经接入学习首页，可按单元直接进入，不必再到导航里寻找。</p></div><b>NEW</b></header>
            <div className="topic-overview-grid">{topicTracks.map((track) => <article className={track.accent} key={track.id}>
              <div className="topic-overview-title"><span>{track.eyebrow}</span><h3>{track.title}</h3><p>{track.description}</p></div>
              <div className="topic-overview-units">{track.units.map((unit) => { const done = completedTopicUnits.includes(topicUnitKey(track.id, unit.num)); const unlocked = isTopicUnitUnlocked(track.id, unit.num); return <button key={unit.num} onClick={() => openTopicUnit(track.id, unit.num)} disabled={!unlocked} className={done ? "done" : unlocked ? "active" : "locked"}><span>{done ? "✓" : unlocked ? unit.num : "锁"}</span><div><strong>{unit.title}</strong><small>{done ? "已完成 · 可重新学习" : unlocked ? unit.goal : "完成上一单元后解锁"}</small></div><b>→</b></button>})}</div>
              <button className="topic-enter" onClick={() => openTopic(track.id)}>进入{track.title}专题</button>
            </article>)}</div>
          </section>

          <div className="section-heading curriculum-heading"><div><span>初级完整课程 {devMode && <em className="dev-badge">DEV · 全课程开放</em>}</span><h2>16 课 · 4 个生活单元</h2></div><button onClick={() => setTab("词库")}>查看词表 →</button></div>
          <div className="curriculum-units">
            {units.map((unit) => <section className="curriculum-unit" key={unit.num}>
              <header className="unit-heading"><div><span>{unit.eyebrow}</span><h3>{unit.title}</h3><p>{unit.description}</p></div><b>{lessons.filter((lesson) => lesson.unit === unit.num && completedLessons.includes(lesson.num)).length} / {lessons.filter((lesson) => lesson.unit === unit.num).length}</b></header>
              <div className="lesson-path">
                {lessons.filter((lesson) => lesson.unit === unit.num).map((lesson, index, unitLessons) => { const done = completedLessons.includes(lesson.num); const unlocked = isUnlocked(lesson.num); const state = done ? "done" : unlocked ? "active" : "locked"; return <article key={lesson.num} className={`lesson ${state}`}>
                  <div className="path-line">{index < unitLessons.length - 1 && <i />}</div><button className="lesson-node" onClick={() => openLesson(lesson.num)} disabled={!unlocked} aria-label={done ? `回看第 ${lesson.num} 课` : `开始第 ${lesson.num} 课`}>{done ? "✓" : !unlocked ? "锁" : lesson.num}</button>
                  <div className="lesson-info"><div><span>第 {lesson.num} 课 · +{lesson.xp} XP</span><h3>{lesson.title}</h3><p>{lesson.detail}</p></div>{state === "active" && <b>可学习</b>}{done && <button className="done-label replay-label" onClick={() => openLesson(lesson.num)}>已掌握 · 回看</button>}</div>
                </article>})}
              </div>
            </section>)}
          </div>

          <section className="language-note"><div className="note-symbol">字</div><div><span>今日小知识</span><h3>文读不是“正式”，白读也不是“随便”</h3><p>它们是汉字音的两个层次。该读哪一个，常常由词语搭配决定：流汗 lâu-kuānn，流浪 liû-lōng。</p></div><button onClick={() => setTab("词库")}>看看例词</button></section>
        </div>}

        {tab === "专题" && <div className="screen topics-screen">
          <p className="kicker">生活深化专题</p><h1>像正式课程一样，一条条学会。</h1><p className="topics-intro">每个单元包含逐词学习、匹配例句、发音、选择题和完成进度；字词卡已移到“词库”。</p>
          <div className="topic-jumps">{topicTracks.map((track) => <a key={track.id} href={`#topic-${track.id}`} className={track.accent}><span>{track.eyebrow}</span><strong>{track.title}</strong><small>{completedTopicUnits.filter((key) => key.startsWith(`${track.id}-`)).length} / {track.units.length} 单元完成 →</small></a>)}</div>
          <div className="topic-tracks">{topicTracks.map((track) => <section id={`topic-${track.id}`} className={`topic-track ${track.accent}`} key={track.id}>
            <header className="topic-track-heading"><div><span>{track.eyebrow}</span><h2>{track.title}</h2><p>{track.description}</p></div><b>{completedTopicUnits.filter((key) => key.startsWith(`${track.id}-`)).length} / {track.units.length}</b></header>
            <div className="topic-course-path">{track.units.map((unit, index) => { const key = topicUnitKey(track.id, unit.num); const done = completedTopicUnits.includes(key); const unlocked = isTopicUnitUnlocked(track.id, unit.num); return <article className={`topic-course-unit ${done ? "done" : unlocked ? "active" : "locked"}`} key={key}>
              <div className="topic-course-rail">{index < track.units.length - 1 && <i />}</div><button className="topic-course-node" onClick={() => openTopicUnit(track.id, unit.num)} disabled={!unlocked} aria-label={`${done ? "回看" : "开始"}${track.title}单元 ${unit.num}`}>{done ? "✓" : unlocked ? unit.num : "锁"}</button>
              <div className="topic-course-copy"><div><span>单元 {unit.num} · {unit.words.length} 个步骤 · +40 XP</span><h3>{unit.title}</h3><p>{unit.goal}</p><small>{unit.note}</small></div>{done ? <button onClick={() => openTopicUnit(track.id, unit.num)}>已完成 · 回看</button> : unlocked ? <button onClick={() => openTopicUnit(track.id, unit.num)}>开始单元 →</button> : <b>完成上一单元解锁</b>}</div>
            </article>})}</div>
          </section>)}</div>
        </div>}

        {tab === "复习" && <div className="screen review-screen">
          <p className="kicker">智能复习</p><h1>趁还记得，再说一遍。</h1><div className="review-hero"><div className="review-ring"><strong>86%</strong><span>本周记忆度</span></div><div><span className="tag">今天待复习</span><h2>8 个词正在等你</h2><p>先复习最容易忘记的文白读搭配，约 4 分钟。</p><button className="primary" onClick={() => openLesson(Math.max(...completedLessons))}>开始复习 →</button></div></div>
          <div className="mistake-grid">{readings.slice(0,4).map((item) => <article key={item.tl}><span>{item.kind}词组</span><strong>{item.han}</strong><b>{item.tl}</b><small>{item.meaning}</small><SoundButton text={`${item.han} ${item.tl}`} src={item.audio} label="听词组" /></article>)}</div>
        </div>}

        {tab === "词库" && <div className="screen dictionary-screen">
          <p className="kicker">独立积累词库</p><h1>课程负责逐条练习，词库负责随时回看。</h1>
          <div className="lexicon-tabs"><button className={lexiconView === "phrases" ? "active" : ""} onClick={() => setLexiconView("phrases")}>词组词典</button><button className={lexiconView === "topics" ? "active" : ""} onClick={() => setLexiconView("topics")}>专题字词</button></div>
          {lexiconView === "phrases" ? <>
            <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜词组、臺罗或华语释义" /></label>
            <div className="filter-row category-row">{["全部", "饮食", "人物", "日常动作", "描述", "时间", "天气", "居家", "购物", "交通", "旅行", "健康", "学习", "心情"].map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={activeCategory === category ? "selected" : ""}>{category}</button>)}<span>共 {filtered.length} 个词组</span></div>
            <div className="word-list">{filtered.map((item) => { const key = item.han + item.tl; return <article key={key}><div className="word-han phrase-han">{item.han}</div><div className="word-reading"><div className="reading-tags"><span className={item.kind === "白读" ? "white" : item.kind === "文读" ? "literary" : "common"}>{item.kind}词组</span><em>{item.category}</em></div><h3>{item.tl}</h3><p>{item.meaning}</p><SoundButton text={`${item.han} ${item.tl}`} src={item.audio} label="听词组" /></div><div className="phrase-note"><span>使用提示</span><p>{item.note}</p></div><button className={`save ${saved.includes(key) ? "saved" : ""}`} onClick={() => setSaved((items) => items.includes(key) ? items.filter((x) => x !== key) : [...items, key])} aria-label="收藏词组">{saved.includes(key) ? "★" : "☆"}</button></article>})}</div>
          </> : <div className="topic-bank"><div className="topic-bank-intro"><span>专题课程配套词表</span><p>这里仅用于积累和复听；需要例句、答题和进度时，请进入“专题”课程。</p></div>{topicTracks.map((track) => <section key={track.id} className={`topic-bank-track ${track.accent}`}><header><span>{track.eyebrow}</span><h2>{track.title}</h2></header>{track.units.map((unit) => <article key={`${track.id}-${unit.num}`}><h3>单元 {unit.num} · {unit.title}</h3><div className="topic-word-grid">{unit.words.map((word) => <div className="topic-word" key={`${track.id}-${unit.num}-${word.han}`}><div><strong>{word.han}</strong><b>{word.tl}</b><small>{word.meaning}</small></div><SoundButton text={`${word.han} ${word.tl}`} src={word.audio} label="听读音" /></div>)}</div></article>)}</section>)}</div>}
        </div>}

        {tab === "我的" && <div className="screen profile-screen">
          <p className="kicker">学习档案</p><h1>你已经坚持了 {streak} 天。</h1><section className="profile-card"><div className="big-avatar">林</div><div><span>白鹭段位 · Lv. 4</span><h2>闽南话学习者</h2><p>加入第 7 天 · {settings.accent}课程</p></div></section><div className="profile-stats"><article><span>总经验</span><strong>{xp}</strong><small>XP</small></article><article><span>词典词组</span><strong>{readings.length}</strong><small>个</small></article><article><span>收藏词组</span><strong>{saved.length}</strong><small>个</small></article></div>
          <section className={`dev-mode-card ${devMode ? "enabled" : ""}`}><div><span>本地调试工具</span><h3>开发者模式</h3><p>{devMode ? "普通课程与 6 个专题单元均已开放，学习进度仍会正常保存。" : "开启后可跳过课程顺序，直接访问任意普通课程和专题单元。"}</p></div><button className={`switch ${devMode ? "on" : ""}`} type="button" role="switch" aria-checked={devMode} aria-label="开发者模式：开放全部课程" onClick={() => setDevMode((value) => !value)}><i /></button></section>
          <section className="source-card"><h3>课程标音与发音说明</h3><p>词语发音采用教育部《臺湾台语常用词辞典》的真人主音读音档；专题自编例句使用本地闽南语语音模型依画面上的臺罗合成，并随应用保存在本机。文、白读需放进具体词语学习；各地腔口可能有语音差异。</p><div><a href="https://sutian.moe.edu.tw/zh-hant/piantsip/piantsip-thele/" target="_blank" rel="noreferrer">文白异读说明 ↗</a><a href="https://language.moe.gov.tw/files/people_files/tshiutsheh_1140819.pdf" target="_blank" rel="noreferrer">臺罗使用手册 ↗</a></div></section>
        </div>}
      </section>

      <nav className="bottom-nav" aria-label="移动端导航">{[['学习','⌂'],['专题','册'],['复习','↻'],['词库','文'],['我的','人']].map(([name, icon]) => <button key={name} className={tab === name ? "active" : ""} onClick={() => setTab(name)}><i>{icon}</i><span>{name}</span></button>)}</nav>

      {settingsOpen && <div className="settings-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
        <section className="settings-drawer" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <header><div><span>LEARNING PREFERENCES</span><h2 id="settings-title">学习设置</h2><p>调整后立即预览，保存后下次打开仍会保留。</p></div><button type="button" onClick={() => setSettingsOpen(false)} aria-label="关闭设置">×</button></header>

          <div className="settings-block">
            <div className="settings-label"><i>♪</i><div><strong>发音音量</strong><small>影响词语、例句和课程示范音</small></div><output>{settings.volume}%</output></div>
            <input className="settings-range" type="range" min="0" max="100" value={settings.volume} onChange={(event) => updateSetting("volume", Number(event.target.value))} aria-label="发音音量" />
            <div className="range-hints"><span>静音</span><span>最大</span></div>
          </div>

          <div className="settings-block">
            <div className="settings-label"><i>Aa</i><div><strong>字体大小</strong><small>同步缩放课程内容和操作按钮</small></div><output>{settings.fontSize}px</output></div>
            <input className="settings-range" type="range" min="14" max="20" step="1" value={settings.fontSize} onChange={(event) => updateSetting("fontSize", Number(event.target.value))} aria-label="字体大小" />
            <div className="font-sample"><span>小</span><b>食饱未？ Tsia̍h-pá--buē?</b><span>大</span></div>
          </div>

          <div className="settings-block">
            <div className="settings-label"><i>字</i><div><strong>文字显示</strong><small>切换整个界面的简体或繁體中文</small></div></div>
            <div className="script-switcher" role="radiogroup" aria-label="文字显示">
              <button type="button" role="radio" aria-checked={settings.script === "simplified"} className={settings.script === "simplified" ? "selected" : ""} onClick={() => updateSetting("script", "simplified")}><span>简体中文</span><small>学习 · 设置 · 课程</small></button>
              <button type="button" role="radio" aria-checked={settings.script === "traditional"} className={settings.script === "traditional" ? "selected" : ""} onClick={() => updateSetting("script", "traditional")}><span>繁體中文</span><small>學習 · 設定 · 課程</small></button>
            </div>
          </div>

          <div className="settings-block">
            <div className="settings-label"><i>腔</i><div><strong>偏好口音</strong><small>用于课程推荐与音系标记</small></div></div>
            <div className="accent-grid" role="radiogroup" aria-label="偏好口音">{(Object.keys(accentNotes) as AccentPreference[]).map((accent) => <button type="button" role="radio" aria-checked={settings.accent === accent} className={settings.accent === accent ? "selected" : ""} onClick={() => updateSetting("accent", accent)} key={accent}><strong>{accent}</strong><small>{accentNotes[accent]}</small><i>✓</i></button>)}</div>
            {settings.accent !== "台湾通行腔" && <p className="accent-notice">当前真人音档以台湾通行腔为主；你的偏好已保存，后续会优先推荐对应腔口内容。</p>}
          </div>

          <div className="auto-play-row"><div><strong>自动播放发音</strong><small>进入新的学习词条时自动播放</small></div><button type="button" role="switch" aria-checked={settings.autoPlay} className={`settings-switch ${settings.autoPlay ? "on" : ""}`} onClick={() => updateSetting("autoPlay", !settings.autoPlay)}><i /></button></div>

          <footer><button className="settings-reset" type="button" onClick={() => setSettings(defaultSettings)}>恢复默认</button><button className="settings-save" type="button" onClick={saveSettings}>{settingsSaved ? "已保存 ✓" : "保存设置"}</button></footer>
        </section>
      </div>}

      {showLesson && <div className="lesson-overlay" role="dialog" aria-modal="true" aria-label="文白读练习">
        <div className="lesson-modal">
          <header><button onClick={() => {setShowLesson(false);setQuestion(0);setPicked(null)}} aria-label="退出练习">×</button><div className="quiz-progress"><i style={{ width: `${((question + 1) / activeQuestions.length) * 100}%` }} /></div><span>第 {selectedLesson} 课 · {question + 1} / {activeQuestions.length}</span></header>
          <div className="quiz-body"><span className="quiz-kicker">{current.eyebrow}</span><h2>{current.prompt}</h2><p>{current.sub}</p>{current.audio && <SoundButton text={current.answer} src={current.audio} label="听示范音" />}
            {showCurrentSentence && currentSentence && <section className="sentence-card"><div className="sentence-label"><span>本题词语例句</span><SoundButton text={`${currentSentence.han} ${currentSentence.tl}`} src={currentSentence.audio} label="听例句" /></div><strong>{currentSentence.han}</strong><b>{currentSentence.tl}</b><p>{currentSentence.meaning}</p></section>}
            <div className="answers">{current.options.map((option, index) => <button key={option} onClick={() => setPicked(option)} className={picked === option ? (correct ? "correct" : "wrong") : ""} disabled={!!picked}><span>{index + 1}</span><b>{option}</b>{picked && option === current.answer && <i>✓</i>}</button>)}</div>
          </div>
          <footer className={picked ? (correct ? "feedback correct" : "feedback wrong") : ""}>{picked ? <div><strong>{correct ? "着！答对了" : "差一点，记住这个搭配"}</strong><p>{current.explain}</p></div> : <p>选一个答案继续</p>}<button onClick={nextQuestion} disabled={!picked}>{question === activeQuestions.length - 1 ? (completedLessons.includes(selectedLesson) ? "完成回看" : selectedLesson < lessons.length ? `完成并解锁第 ${selectedLesson + 1} 课` : "完成全部课程") : "继续 →"}</button></footer>
        </div>
      </div>}

      {showTopicLesson && <div className="lesson-overlay" role="dialog" aria-modal="true" aria-label={`${activeTopic.title}${activeTopicUnit.title}学习`}>
        <div className="lesson-modal topic-lesson-modal">
          <header><button onClick={() => {setShowTopicLesson(false);setTopicStep(0);setTopicPicked(null)}} aria-label="退出专题单元">×</button><div className="quiz-progress"><i style={{ width: `${((topicStep + 1) / activeTopicUnit.words.length) * 100}%` }} /></div><span>{activeTopic.title} · 单元 {activeTopicUnit.num} · {topicStep + 1} / {activeTopicUnit.words.length}</span></header>
          <div className="quiz-body topic-quiz-body"><span className="quiz-kicker">{activeTopicUnit.title} · 逐条学习</span><div className="topic-target"><div><h2>{currentTopicWord.han}</h2><b>{currentTopicWord.tl}</b><p>{currentTopicWord.meaning}</p></div><SoundButton text={`${currentTopicWord.han} ${currentTopicWord.tl}`} src={currentTopicWord.audio} label="听词语" /></div>
            <section className="sentence-card topic-example-card"><div className="sentence-label"><span>本词生活例句</span><SoundButton text={`${currentTopicWord.exampleHan} ${currentTopicWord.exampleTl}`} src={currentTopicExampleAudio} label="听例句" /></div><strong>{currentTopicWord.exampleHan}</strong><b>{currentTopicWord.exampleTl}</b><p>{currentTopicWord.exampleMeaning}</p></section>
            <div className="topic-check"><span>确认一下</span><h3>“{currentTopicWord.han}”在本单元里的意思是？</h3></div>
            <div className="answers">{topicOptions.map((option, index) => <button key={`${currentTopicWord.han}-${option}`} onClick={() => setTopicPicked(option)} className={topicPicked === option ? (topicCorrect ? "correct" : "wrong") : ""} disabled={!!topicPicked}><span>{index + 1}</span><b>{option}</b>{topicPicked && option === currentTopicWord.meaning && <i>✓</i>}</button>)}</div>
          </div>
          <footer className={topicPicked ? (topicCorrect ? "feedback correct" : "feedback wrong") : ""}>{topicPicked ? <div><strong>{topicCorrect ? "着！这条学会了" : "再看一次词义和例句"}</strong><p>{currentTopicWord.han} · {currentTopicWord.tl} · {currentTopicWord.meaning}</p></div> : <p>听发音、读例句，再选择答案</p>}<button onClick={nextTopicStep} disabled={!topicPicked}>{topicStep === activeTopicUnit.words.length - 1 ? `完成单元 · +${completedTopicUnits.includes(topicUnitKey(activeTopic.id, activeTopicUnit.num)) ? 0 : 40} XP` : "下一条 →"}</button></footer>
        </div>
      </div>}
    </main>
  );
}
