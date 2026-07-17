import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/Card";
import { ProgressBar } from "../../components/ProgressBar";
import * as bridge from "../../services/bridge";
import { useChildStore } from "../../store/useChildStore";
import type { Child, Progress } from "../../types/models";
import "./HomePage.css";

const MODULES = [
  { to: "/recite", emoji: "📖", title: "启蒙入门", sub: "口诀背诵·理解乘法", tag: "零基础" },
  { to: "/advanced/difficulty", emoji: "🎯", title: "专项进阶", sub: "分层训练·提速闯关", tag: "L1-L3" },
  { to: "/wrong/book", emoji: "📒", title: "错题攻克", sub: "智能复盘·精准补短", tag: "12题待复习" },
  { to: "/profile", emoji: "👤", title: "个人中心", sub: "数据看板·家长管理", tag: "家长入口" },
];

export function HomePage() {
  const child = useChildStore((s) => s.children.find((c) => c.id === s.currentChildId)) as Child | undefined;
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    bridge.getProgress().then(setProgress).catch(() => {});
  }, []);

  const pct = progress ? Math.round((progress.masteredFormulas / progress.totalFormulas) * 100) : 0;

  return (
    <div className="home">
      <header className="home__header">
        <div>
          <div className="home__greet">下午好，{child?.name ?? "同学"}</div>
          <div className="home__sub">今天也要加油哦！🌟</div>
        </div>
        <div className="home__avatar">{child?.avatar ?? "🐱"}</div>
      </header>

      <Card className="home__progress">
        <div className="home__progress-head">
          <span>📊 口诀掌握进度</span>
          <span className="home__progress-num">
            {progress?.masteredFormulas ?? 0}/{progress?.totalFormulas ?? 45}
          </span>
        </div>
        <ProgressBar percent={pct} />
        <div className="home__progress-foot">
          已掌握 {pct}% · 连续打卡 {progress?.streakDays ?? 0} 天 🔥
        </div>
      </Card>

      <div className="home__modules">
        {MODULES.map((m) => (
          <Link key={m.to} to={m.to} className="home__module">
            <div className="home__module-icon">{m.emoji}</div>
            <div className="home__module-text">
              <div className="home__module-title">{m.title}</div>
              <div className="home__module-sub">{m.sub}</div>
            </div>
            <span className="home__module-tag">{m.tag}</span>
          </Link>
        ))}
      </div>

      <Card className="home__recommend">
        <div className="home__recommend-title">🎯 今日推荐</div>
        <div className="home__recommend-sub">每日打卡 · 10题基础训练</div>
        <Link to="/checkin" className="btn btn--ghost home__recommend-btn">
          开始打卡
        </Link>
      </Card>
    </div>
  );
}
