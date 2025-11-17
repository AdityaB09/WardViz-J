import React from "react";

const VoiceoverButton: React.FC = () => {
  const handleClick = () => {
    alert("Voiceover is a placeholder in this MVP.");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-100 hover:bg-slate-800"
    >
      🎙️ Voiceover
    </button>
  );
};

export default VoiceoverButton;
