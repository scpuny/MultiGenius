import "./Stars.css";

interface StarsProps {
  value: 1 | 2 | 3;
  size?: number;
}

// 星级评价（答题结果页）
export function Stars({ value, size = 40 }: StarsProps) {
  return (
    <div className="stars" style={{ fontSize: size }}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={"stars__item" + (i <= value ? " is-on" : "")}>
          ★
        </span>
      ))}
    </div>
  );
}
