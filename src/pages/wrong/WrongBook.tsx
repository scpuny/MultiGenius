import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/Card";
import * as bridge from "../../services/bridge";
import type { WrongQuestion } from "../../types/models";
import "./WrongBook.css";

// 错题本列表页：统计 + 薄弱点 + 错题列表
export function WrongBook() {
  const [list, setList] = useState<WrongQuestion[]>([]);

  useEffect(() => {
    bridge.listWrongQuestions().then(setList).catch(() => {});
  }, []);

  const pending = list.filter((w) => w.status === "pending").length;

  return (
    <div className="wrongbook">
      <div className="topbar">
        <span className="topbar__title">错题本</span>
      </div>

      <div className="wrongbook__stats">
        <div>
          <b>{pending}</b> 待复习
        </div>
        <div>
          <b>{list.length - pending}</b> 已掌握
        </div>
        <div>
          <b>{list.length ? Math.round(((list.length - pending) / list.length) * 100) : 0}%</b> 掌握率
        </div>
      </div>

      <div className="wrongbook__list">
        {list.map((w) => (
          <Card key={w.id} className="wrongbook__item">
            <div className="wrongbook__expr">{w.question.expression} = ?</div>
            <div className="wrongbook__ans">
              你的答案:{w.userAnswer} 正确答案:<b>{w.question.answer}</b>
            </div>
            <Link to="/wrong/explain" className="wrongbook__retry">
              🔄 重做
            </Link>
          </Card>
        ))}
        {list.length === 0 && <div style={{ textAlign: "center", color: "var(--color-text-sub)" }}>暂无错题，真棒！</div>}
      </div>
    </div>
  );
}
