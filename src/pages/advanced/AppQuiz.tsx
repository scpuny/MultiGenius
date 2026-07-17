import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card";
import { AudioButton } from "../../components/AudioButton";
import { NumberPad } from "../../components/NumberPad";
import * as bridge from "../../services/bridge";
import { usePracticeStore } from "../../store/usePracticeStore";
import { useChildStore } from "../../store/useChildStore";
import type { Question } from "../../types/models";
import "./AppQuiz.css";

// 应用题专项答题页（V3）：图文应用题 + 童声听题 + 算式/选择作答
export function AppQuiz() {
  const nav = useNavigate();
  const childId = useChildStore((s) => s.currentChildId)!;
  const { questions, index, start, answer, next, buildResult, reset } = usePracticeStore();
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    if (questions.length === 0) {
      bridge
        .generateApplication({ dimensions: ["word_problem"], difficulty: "L5", count: 10 })
        .then((qs) => start({ questions: qs, module: "application", mode: "free", difficulty: "L5" }))
        .catch(() => {});
    }
  }, [questions.length, start]);

  if (questions.length === 0) return <div style={{ padding: 40, textAlign: "center" }}>加载中…</div>;

  const q: Question = questions[index];
  const isChoice = !!q.options?.length;

  const submit = (val: number) => {
    const correct = val === q.answer;
    answer(q, val, correct);
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      setInput("");
      const hasNext = next();
      if (!hasNext) {
        bridge.submitSession(buildResult(childId)).then(() => {
          reset();
          nav("/result");
        });
      }
    }, 900);
  };

  const onConfirm = () => {
    if (input === "") return;
    submit(Number(input));
  };

  return (
    <div className="appquiz">
      <div className="topbar">
        <span className="topbar__title">图文应用题</span>
        <span className="appquiz__idx">{index + 1}/{questions.length}</span>
      </div>

      <Card className="appquiz__card">
        <div className="appquiz__label">看图列式</div>
        <div className="appquiz__scene">🍎🍎🍎🍎 × ? 组</div>
        <div className="appquiz__text">{q.wordProblem?.text}</div>
        <AudioButton onClick={() => {/* 后端播放童声 */}} />
      </Card>

      {isChoice ? (
        <div className="appquiz__options">
          {q.options!.map((o) => (
            <button key={o} className="appquiz__option" onClick={() => submit(o)}>
              {o}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="appquiz__expr">
            <span>{q.expression} =</span>
            <input
              className="appquiz__input"
              value={input}
              placeholder="?"
              inputMode="numeric"
              onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
              readOnly
            />
          </div>
          <div className="appquiz__hint">提示：{q.wordProblem?.hint}</div>
          <NumberPad onInput={(d) => setInput((p) => p + d)} onBackspace={() => setInput((p) => p.slice(0, -1))} onConfirm={onConfirm} />
        </>
      )}

      {feedback === "correct" && <div className="appquiz__fb appquiz__fb--ok">✅ 答对了！</div>}
      {feedback === "wrong" && <div className="appquiz__fb appquiz__fb--no">❌ 再想想～</div>}
    </div>
  );
}
