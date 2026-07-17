import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Stars } from "../../components/Stars";
import * as bridge from "../../services/bridge";
import { usePracticeStore } from "../../store/usePracticeStore";
import { useChildStore } from "../../store/useChildStore";
import type { SessionSummary } from "../../types/models";

// 答题结果页：星级 + 正确率 + 积分 + 错题收录
export function ResultPage() {
  const childId = useChildStore((s) => s.currentChildId)!;
  const { buildResult, reset, questions } = usePracticeStore();
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  useEffect(() => {
    if (questions.length === 0) return;
    bridge.submitSession(buildResult(childId)).then((s) => {
      setSummary(s);
      reset();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!summary) return <div style={{ padding: 40, textAlign: "center" }}>计算成绩中…</div>;

  return (
    <div style={{ paddingTop: 40, textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
      <h2>太棒了！练习完成</h2>
      <Stars value={summary.stars} />
      <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{summary.correctRate}%</div>
          <div style={{ fontSize: "var(--fs-sm)", color: "var(--color-text-sub)" }}>正确率</div>
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{summary.gainedPoints}</div>
          <div style={{ fontSize: "var(--fs-sm)", color: "var(--color-text-sub)" }}>获得积分</div>
        </div>
      </div>

      {summary.newWrong.length > 0 && (
        <div style={{ background: "#fff0f0", borderRadius: 16, padding: 12, fontSize: "var(--fs-sm)" }}>
          {summary.newWrong.length}道错题已收录：
          {summary.newWrong.map((w, i) => (
            <div key={i}>
              {w.expression}= {w.userAnswer}，正确答案是 {w.correctAnswer} 哦
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <Link to="/wrong/book" className="btn btn--ghost">查看错题</Link>
        <Link to="/advanced/difficulty" className="btn">继续闯关</Link>
      </div>
    </div>
  );
}
