import "./ProgressBar.css";

interface ProgressBarProps {
  percent: number; // 0-100
  label?: string;
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  return (
    <div className="progress">
      {label && (
        <div className="progress__head">
          <span>{label}</span>
          <span className="progress__pct">{percent}%</span>
        </div>
      )}
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
    </div>
  );
}
