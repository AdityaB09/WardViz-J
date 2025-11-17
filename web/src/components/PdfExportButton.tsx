import React from "react";

const PdfExportButton: React.FC = () => {
  const handleClick = () => {
    alert("PDF export wiring is not implemented in this MVP.");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-100 hover:bg-slate-800"
    >
      📄 Export storyboard
    </button>
  );
};

export default PdfExportButton;
