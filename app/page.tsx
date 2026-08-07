"use client";

import { useEffect, useState } from "react";

type Accent = "厦门腔" | "泉州腔" | "漳州腔" | "台湾腔";

type Preferences = {
  volume: number;
  fontSize: number;
  accent: Accent;
  autoPlay: boolean;
};

const defaultPreferences: Preferences = {
  volume: 72,
  fontSize: 17,
  accent: "厦门腔",
  autoPlay: false,
};

const accentSamples: Record<Accent, { romanization: string; hint: string }> = {
  厦门腔: { romanization: "Lí hó!", hint: "厦门市区常用腔调" },
  泉州腔: { romanization: "Lír hó!", hint: "保留较多古音特色" },
  漳州腔: { romanization: "Lí hóo!", hint: "语调柔和、韵母鲜明" },
  台湾腔: { romanization: "Lí hó!", hint: "台湾通行的台语腔调" },
};

type TravelLesson = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  duration: string;
  phrases: Array<{ chinese: string; romanization: string; meaning: string }>;
};

const travelLessons: TravelLesson[] = [
  {
    id: "transport",
    number: "01",
    title: "问路搭车",
    subtitle: "车站、方向与车票",
    icon: "车",
    duration: "8 分钟",
    phrases: [
      { chinese: "车头伫佗位？", romanization: "Chhia-thâu tī tó-uī?", meaning: "车站在哪里？" },
      { chinese: "这班车有到机场无？", romanization: "Chit pan chhia ū kàu ki-tiûⁿ bô?", meaning: "这班车到机场吗？" },
      { chinese: "一张票偌济钱？", romanization: "Chi̍t tiuⁿ phiò gōa-chē chîⁿ?", meaning: "一张票多少钱？" },
    ],
  },
  {
    id: "hotel",
    number: "02",
    title: "酒店入住",
    subtitle: "订房、入住与需求",
    icon: "宿",
    duration: "7 分钟",
    phrases: [
      { chinese: "我有订房间。", romanization: "Góa ū tēng pâng-keng.", meaning: "我预订了房间。" },
      { chinese: "敢会使较早入住？", romanization: "Kám ē-sái khah chá ji̍p-chū?", meaning: "可以提前入住吗？" },
      { chinese: "劳力，欲一领被单。", romanization: "Ló͘-la̍t, beh chi̍t niá phōe-toaⁿ.", meaning: "谢谢，我想要一床被单。" },
    ],
  },
  {
    id: "sightseeing",
    number: "03",
    title: "景点游览",
    subtitle: "买票、拍照与推荐",
    icon: "游",
    duration: "9 分钟",
    phrases: [
      { chinese: "这搭有啥物好𨑨迌？", romanization: "Chit-tah ū siánn-mih hó chhit-thô?", meaning: "这里有什么好玩的？" },
      { chinese: "会使共我翕相无？", romanization: "Ē-sái kā góa hip-siòng bô?", meaning: "可以帮我拍照吗？" },
      { chinese: "门票欲去佗位买？", romanization: "Mn̂g-phiò beh khì tó-uī bé?", meaning: "门票要去哪里买？" },
    ],
  },
  {
    id: "help",
    number: "04",
    title: "应急求助",
    subtitle: "迷路、遗失与身体不适",
    icon: "助",
    duration: "6 分钟",
    phrases: [
      { chinese: "歹势，我揣无路。", romanization: "Pháinn-sè, góa chhōe-bô lō͘.", meaning: "不好意思，我迷路了。" },
      { chinese: "我的物件毋见去。", romanization: "Góa ê mi̍h-kiāⁿ m̄-kìⁿ-khì.", meaning: "我的东西丢了。" },
      { chinese: "我身躯无爽快。", romanization: "Góa seng-khu bô sóng-khoài.", meaning: "我身体不舒服。" },
    ],
  },
];

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTravelLesson, setActiveTravelLesson] = useState(travelLessons[0].id);
  const [playingPhrase, setPlayingPhrase] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("banlam-preferences");
    if (!stored) return;

    try {
      setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
    } catch {
      window.localStorage.removeItem("banlam-preferences");
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--app-font-size",
      `${preferences.fontSize}px`,
    );
  }, [preferences.fontSize]);

  useEffect(() => {
    if (!settingsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [settingsOpen]);

  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const savePreferences = () => {
    window.localStorage.setItem(
      "banlam-preferences",
      JSON.stringify(preferences),
    );
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const playPronunciation = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("你好");
    utterance.lang = preferences.accent === "台湾腔" ? "zh-TW" : "zh-CN";
    utterance.volume = preferences.volume / 100;
    utterance.rate = 0.78;
    utterance.pitch = preferences.accent === "泉州腔" ? 0.9 : 1;
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const playTravelPhrase = (phrase: TravelLesson["phrases"][number]) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase.meaning);
    utterance.lang = preferences.accent === "台湾腔" ? "zh-TW" : "zh-CN";
    utterance.volume = preferences.volume / 100;
    utterance.rate = 0.72;
    utterance.onstart = () => setPlayingPhrase(phrase.chinese);
    utterance.onend = () => setPlayingPhrase(null);
    utterance.onerror = () => setPlayingPhrase(null);
    window.speechSynthesis.speak(utterance);
  };

  const sample = accentSamples[preferences.accent];
  const selectedTravelLesson = travelLessons.find((lesson) => lesson.id === activeTravelLesson) ?? travelLessons[0];

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="厝边闽南语首页">
          <span className="brand-mark">厝</span>
          <span>
            <strong>厝边</strong>
            <small>闽南语学习</small>
          </span>
        </a>

        <div className="header-actions">
          <div className="streak" aria-label="连续学习7天">
            <span>🔥</span>
            <b>7</b>
          </div>
          <button
            className="settings-button"
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="打开设置"
            aria-haspopup="dialog"
          >
            <span aria-hidden="true">⚙</span>
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> 今日学习 · 第 12 天</p>
          <h1>从一句<span>「食饱未？」</span><br />开始讲闽南语</h1>
          <p className="lead">
            每天十分钟，听懂厝边人的问候。<br />跟着真实语境，学会地道表达。
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => document.querySelector("#travel-unit")?.scrollIntoView({ behavior: "smooth" })}>
              继续学习 <span>→</span>
            </button>
            <span className="progress-copy">本周已完成 <b>4/7</b> 课</span>
          </div>
        </div>

        <article className="lesson-card" aria-label="今日词句">
          <div className="card-topline">
            <span className="lesson-tag">今日词句</span>
            <span className="accent-pill">{preferences.accent}</span>
          </div>
          <div className="phrase">
            <span className="quote-mark">“</span>
            <h2>你好！</h2>
            <p>{sample.romanization}</p>
          </div>
          <button
            className={`audio-button ${playing ? "is-playing" : ""}`}
            type="button"
            onClick={playPronunciation}
            aria-label="播放你好发音"
          >
            <span className="sound-icon" aria-hidden="true">{playing ? "◼" : "▶"}</span>
            <span>{playing ? "正在播放" : "听发音"}</span>
            <i>{preferences.volume}%</i>
          </button>
          <div className="tone-line">
            <span>lí</span><span>hó</span><span>→</span><small>{sample.hint}</small>
          </div>
        </article>
      </section>

      <section className="learning-path" aria-labelledby="path-title">
        <div className="section-heading">
          <div>
            <p>LEARNING PATH</p>
            <h2 id="path-title">你的学习路径</h2>
          </div>
          <a href="#path-title">查看全部课程 <span>→</span></a>
        </div>
        <div className="path-grid">
          <article className="path-card active-card">
            <span className="path-number">01</span>
            <div className="path-icon">招</div>
            <h3>日常招呼</h3>
            <p>见面、道别与寒暄</p>
            <div className="mini-progress"><i style={{ width: "68%" }} /></div>
            <small>8 / 12 词句</small>
          </article>
          <article className="path-card">
            <span className="path-number">02</span>
            <div className="path-icon coral">食</div>
            <h3>食饭点菜</h3>
            <p>从街边小吃到茶桌</p>
            <div className="mini-progress"><i style={{ width: "22%" }} /></div>
            <small>3 / 14 词句</small>
          </article>
          <article className="path-card locked">
            <span className="path-number">03</span>
            <div className="path-icon gold">行</div>
            <h3>出门行路</h3>
            <p>问路、搭车与闲逛</p>
            <span className="lock-copy">再完成 2 课解锁</span>
          </article>
          <article className="path-card travel-path-card">
            <span className="path-number">04</span>
            <div className="path-icon sky">旅</div>
            <h3>旅行出游</h3>
            <p>交通、住宿、游览与求助</p>
            <a className="path-start" href="#travel-unit">开始学习 <span>→</span></a>
          </article>
        </div>
      </section>

      <section className="travel-unit" id="travel-unit" aria-labelledby="travel-title">
        <div className="travel-intro">
          <div>
            <p className="unit-kicker">NEW UNIT · 单元 04</p>
            <h2 id="travel-title">旅行出游</h2>
            <p>从抵达到返程，带着 12 句实用闽南语安心出发。</p>
          </div>
          <div className="unit-stats" aria-label="课程信息">
            <span><b>4</b> 个场景</span>
            <span><b>12</b> 句表达</span>
            <span><b>30</b> 分钟</span>
          </div>
        </div>

        <div className="travel-course">
          <nav className="travel-tabs" aria-label="旅行课程场景">
            {travelLessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                className={lesson.id === selectedTravelLesson.id ? "travel-tab active" : "travel-tab"}
                aria-current={lesson.id === selectedTravelLesson.id ? "step" : undefined}
                onClick={() => setActiveTravelLesson(lesson.id)}
              >
                <span className="travel-tab-icon">{lesson.icon}</span>
                <span><small>场景 {lesson.number}</small><b>{lesson.title}</b><em>{lesson.subtitle}</em></span>
                <i>→</i>
              </button>
            ))}
          </nav>

          <article className="travel-lesson-panel">
            <div className="travel-lesson-heading">
              <div>
                <span>场景 {selectedTravelLesson.number}</span>
                <h3>{selectedTravelLesson.title}</h3>
                <p>{selectedTravelLesson.subtitle} · {selectedTravelLesson.duration}</p>
              </div>
              <span className="lesson-count">3 句</span>
            </div>
            <div className="phrase-list">
              {selectedTravelLesson.phrases.map((phrase, index) => (
                <div className="travel-phrase" key={phrase.chinese}>
                  <span className="phrase-index">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{phrase.chinese}</h4>
                    <p>{phrase.romanization}</p>
                    <small>{phrase.meaning}</small>
                  </div>
                  <button
                    type="button"
                    className={playingPhrase === phrase.chinese ? "phrase-audio playing" : "phrase-audio"}
                    onClick={() => playTravelPhrase(phrase)}
                    aria-label={`播放${phrase.chinese}的发音`}
                  >{playingPhrase === phrase.chinese ? "■" : "▶"}</button>
                </div>
              ))}
            </div>
            <div className="lesson-tip"><span>厝边提示</span> 问路前先说「歹势」（不好意思），听起来更自然也更有礼貌。</div>
          </article>
        </div>
      </section>

      {settingsOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSettingsOpen(false);
          }}
        >
          <section
            className="settings-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <div className="settings-header">
              <div>
                <p>学习偏好</p>
                <h2 id="settings-title">设置</h2>
              </div>
              <button type="button" onClick={() => setSettingsOpen(false)} aria-label="关闭设置">×</button>
            </div>

            <div className="setting-group">
              <div className="setting-label">
                <span className="setting-symbol">♪</span>
                <div><b>发音音量</b><small>调整例句与跟读的播放音量</small></div>
                <output>{preferences.volume}%</output>
              </div>
              <input
                className="range-control"
                type="range"
                min="0"
                max="100"
                value={preferences.volume}
                style={{ "--range-progress": `${preferences.volume}%` } as React.CSSProperties}
                onChange={(event) => updatePreference("volume", Number(event.target.value))}
                aria-label="发音音量"
              />
              <div className="range-ends"><span>静音</span><span>最大</span></div>
            </div>

            <div className="setting-group">
              <div className="setting-label">
                <span className="setting-symbol">Aa</span>
                <div><b>字体大小</b><small>改变学习内容和界面的字号</small></div>
                <output>{preferences.fontSize}px</output>
              </div>
              <input
                className="range-control"
                type="range"
                min="14"
                max="22"
                value={preferences.fontSize}
                style={{ "--range-progress": `${((preferences.fontSize - 14) / 8) * 100}%` } as React.CSSProperties}
                onChange={(event) => updatePreference("fontSize", Number(event.target.value))}
                aria-label="字体大小"
              />
              <div className="font-preview"><span>小</span><b>食饱未？</b><span>大</span></div>
            </div>

            <div className="setting-group accent-setting">
              <div className="setting-label">
                <span className="setting-symbol">腔</span>
                <div><b>偏好口音</b><small>课程会优先使用所选地区的读音</small></div>
              </div>
              <div className="accent-options" role="radiogroup" aria-label="偏好口音">
                {(Object.keys(accentSamples) as Accent[]).map((accent) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={preferences.accent === accent}
                    className={preferences.accent === accent ? "selected" : ""}
                    onClick={() => updatePreference("accent", accent)}
                    key={accent}
                  >
                    <span>{accent.slice(0, 2)}</span>
                    <small>{accentSamples[accent].romanization}</small>
                    <i>✓</i>
                  </button>
                ))}
              </div>
            </div>

            <div className="toggle-row">
              <div><b>自动播放发音</b><small>打开新词句时自动播放</small></div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.autoPlay}
                className={preferences.autoPlay ? "toggle active" : "toggle"}
                onClick={() => updatePreference("autoPlay", !preferences.autoPlay)}
              ><span /></button>
            </div>

            <div className="settings-footer">
              <button className="reset-button" type="button" onClick={() => setPreferences(defaultPreferences)}>恢复默认</button>
              <button className="save-button" type="button" onClick={savePreferences}>{saved ? "已保存 ✓" : "保存设置"}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
