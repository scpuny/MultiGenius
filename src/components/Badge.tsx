import "./Badge.css";

interface BadgeProps {
  emoji: string;
  name: string;
  locked?: boolean;
}

// 勋章（个人中心/成长报告）
export function Badge({ emoji, name, locked }: BadgeProps) {
  return (
    <div className={"badge" + (locked ? " is-locked" : "")}>
      <div className="badge__icon">{locked ? "🔒" : emoji}</div>
      <div className="badge__name">{name}</div>
    </div>
  );
}
