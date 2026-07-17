import { useState } from "react";
import { Card } from "../../components/Card";
import { AudioButton } from "../../components/AudioButton";
import "./WrongExplain.css";

interface Step {
  key: string;
  title: string;
  body: string;
}
const STEPS: Step[] = [
  { key: "read", title: "读题", body: "看清题目中的数字和运算符号。" },
  { key: "recite", title: "想口诀", body: "回忆对应的乘法口诀。" },
  { key: "verify", title: "验算", body: "用加法或图形验证结果是否正确。" },
  { key: "avoid", title: "防错", body: "对比易混口诀，避免记错。" },
];

// 错题精准讲解页（V3）：分步讲解 + 图形化 + 生活化记忆 + 易错归因
export function WrongExplain() {
  const [step, setStep] = useState(1); // 当前步（原型高亮第2步）

  return (
    <div className="explain">
      <div className="topbar">
        <span className="topbar__title">错题精准讲解</span>
        <span className="explain__step">第{step}步</span>
      </div>

      <div className="explain__steps">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            className={"explain__step-tab" + (i + 1 === step ? " is-on" : "")}
            onClick={() => setStep(i + 1)}
          >
            {s.title}
          </button>
        ))}
      </div>

      <Card className="explain__card">
        <div className="explain__origin">原题：7 × 8 = ?　你的答案：54</div>

        {step === 2 && (
          <>
            <div className="explain__sub">第2步：想口诀 — 回忆对应的乘法口诀</div>
            <div className="explain__dots">🟠 🟠 🟠 🟠 🟠 🟠 🟠</div>
            <div className="explain__dots">🟠 🟠 🟠 🟠 🟠 🟠 🟠</div>
            <div className="explain__formula">7 行 × 8 列 = 56 个圆点</div>
            <div className="explain__mnemonic">七八五十六 — 7 × 8 = 56，记住这个口诀！</div>
            <AudioButton label="语音讲解当前步骤" />
          </>
        )}
        {step !== 2 && <div className="explain__body">{STEPS[step - 1].body}</div>}

        {step === 4 && (
          <div className="explain__wrong">
            你为什么会错？你可能记成了「六九五十四」(6×9=54)，但这里是 7×8，口诀是「七八五十六」= 56！
          </div>
        )}
        {step === 1 && (
          <div className="explain__life">
            生活化记忆：想象一下，每周有 7 天，8 周刚好是 56 天，差不多两个月哦！
          </div>
        )}
      </Card>

      <div className="explain__nav">
        <button className="btn btn--ghost" disabled={step <= 1} onClick={() => setStep((s) => s - 1)}>
          上一步
        </button>
        <button className="btn" disabled={step >= 4} onClick={() => setStep((s) => s + 1)}>
          下一步：{STEPS[Math.min(step, 3)].title}
        </button>
      </div>
    </div>
  );
}
