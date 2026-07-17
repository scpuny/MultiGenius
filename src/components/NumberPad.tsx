import "./NumberPad.css";

interface NumberPadProps {
  onInput: (digit: string) => void; // "0"-"9"
  onBackspace: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function NumberPad({ onInput, onBackspace, onConfirm, confirmLabel = "确定" }: NumberPadProps) {
  return (
    <div className="numpad">
      {KEYS.map((k) => (
        <button key={k} className="numpad__key" onClick={() => onInput(k)}>
          {k}
        </button>
      ))}
      <button className="numpad__key numpad__key--fn" onClick={onBackspace} aria-label="退格">
        ⌫
      </button>
      <button className="numpad__key" onClick={() => onInput("0")}>
        0
      </button>
      <button className="numpad__key numpad__key--confirm" onClick={onConfirm}>
        {confirmLabel}
      </button>
    </div>
  );
}
