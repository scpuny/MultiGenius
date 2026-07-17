import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/Card";
import { ProgressBar } from "../../components/ProgressBar";
import { Badge } from "../../components/Badge";
import * as bridge from "../../services/bridge";
import { useChildStore } from "../../store/useChildStore";
import type { Child, Progress } from "../../types/models";

const MODULES = [
  { to: "/recite", emoji: "📖", title: "启蒙入门", sub: "口诀背诵·理解乘法" },
  { to: "/advanced/difficulty", emoji: "🎯", title: "专项进阶", sub: "分层训练·提速闯关" },
  { to: "/wrong/book", emoji: "📒", title: "错题攻克", sub: "智能复盘·精准补短" },
  { to: "/profile", emoji: "👤", title: "个人中心", sub: "数据看板·家长管理" },
];

// 平板首页：双栏布局（左模块卡，右侧栏推荐/勋章/数据）
export function HomeTabletPage() {
  const child = useChildStore((s) => s.children.find((c) => c.id === s.currentChildId)) as Child | undefined;
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    bridge.getProgress().then(setProgress).catch(() => {});
  }, []);

  const pct = progress ? Math.round((progress.masteredFormulas / progress.totalFormulas) * 100) : 0;

  return (
    <div className="home-tablet">
      <header className="home-tablet__header">
        <div className="home-tablet__avatar">{child?.avatar ?? "🐱"}</div>
        <div>
          <div className="home-tablet__greet">下午好，{child?.name ?? "同学"}</div>
          <div className="home-tablet__sub">今天也要加油哦！🌟 · 连续 {progress?.streakDays ?? 0} 天 🔥</div>
        </div>
      </header>

      <div className="home-tablet__grid">
        <div className="home-tablet__left">
          {MODULES.map((m) => (
            <Link key={m.to} to={m.to} className="home-tablet__module">
              <div className="home-tablet__module-icon">{m.emoji}</div>
              <div>
                <div className="home-tablet__module-title">{m.title}</div>
                <div className="home-tablet__module-sub">{m.sub}</div>
              </div>
            </Link>
          ))}
          <Card className="home-tablet__progress">
            <div className="home-tablet__progress-head">
              <span>📊 口诀掌握进度</span>
              <span>{progress?.masteredFormulas ?? 0}/{progress?.totalFormulas ?? 45}</span>
            </div>
            <ProgressBar percent={pct} />
            <div className="home-tablet__progress-foot">距离下一枚勋章还需掌握 5 句口诀</div>
          </Card>
        </div>

        <aside className="home-tablet__right">
          <Card>
            <div className="home-tablet__side-title">🎯 今日推荐</div>
            <div className="home-tablet__side-sub">每日打卡 · 10题基础训练</div>
            <Link to="/checkin" className="btn btn--ghost home-tablet__side-btn">开始打卡</Link>
          </Card>
          <Card>
            <div className="home-tablet__side-title">🏅 我的勋章</div>
            <div className="home-tablet__badges">
              <Badge emoji="🧮" name="口算小能手" />
              <Badge emoji="📅" name="打卡达人" />
              <Badge emoji="💯" name="全对之星" />
              <Badge emoji="🌟" name="口诀大师" locked />
            </div>
          </Card>
          <Card>
            <div className="home-tablet__side-title">📈 今日数据</div>
            <div className="home-tablet__stat">
              <span>{progress?.todayQuestions ?? 0}</span> 做题数
            </div>
            <div className="home-tablet__stat">
              <span>{progress?.todayMinutes ?? 0}</span> 学习分钟
            </div>
            <div className="home-tablet__stat">
              <span>{progress?.todayAccuracy ?? 0}%</span> 正确率
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
