import "./Toggle.css";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="toggle">
      {label && <span className="toggle__label">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={"toggle__switch" + (checked ? " is-on" : "")}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle__knob" />
      </button>
    </label>
  );
}
