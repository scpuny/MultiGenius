import { NavLink } from "react-router-dom";
import "./BottomNav.css";

const TABS = [
  { to: "/home", label: "首页", icon: "🏠" },
  { to: "/advanced/difficulty", label: "训练", icon: "🎯" },
  { to: "/wrong/book", label: "错题本", icon: "📒" },
  { to: "/profile", label: "我的", icon: "👤" },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) => "bottom-nav__item" + (isActive ? " is-active" : "")}
        >
          <span className="bottom-nav__icon">{t.icon}</span>
          <span className="bottom-nav__label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
