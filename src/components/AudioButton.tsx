import "./AudioButton.css";

interface AudioButtonProps {
  onClick?: () => void;
  label?: string;
}

// 📢 童声听题按钮。真实音频由 Tauri 后端播放（tauri-plugin / audio.rs）；
// 此处仅 UI，onClick 接后端播放指令。
export function AudioButton({ onClick, label = "点击听题" }: AudioButtonProps) {
  return (
    <button className="audio-btn" onClick={onClick}>
      <span className="audio-btn__icon">📢</span>
      <span className="audio-btn__label">{label}</span>
    </button>
  );
}
