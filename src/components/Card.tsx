import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  padding?: boolean;
}

export function Card({ children, onClick, className = "", padding = true }: CardProps) {
  return (
    <div
      className={"card" + (padding ? " card--pad" : "") + (onClick ? " card--click" : "") + " " + className}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
