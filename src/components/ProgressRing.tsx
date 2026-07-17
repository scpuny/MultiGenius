import "./ProgressRing.css";

interface ProgressRingProps {
  percent: number; // 0-100
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}

// 环形进度（学习时长管控页用）
export function ProgressRing({ percent, size = 120, stroke = 12, children }: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, Math.max(0, percent)) / 100);
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring__bg" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring__fg"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={off}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring__label">{children}</div>
    </div>
  );
}
