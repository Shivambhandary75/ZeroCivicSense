import React from "react";

const Loader = ({ size = "md", text = "Loading..." }) => {
  const dims = { sm: 24, md: 40, lg: 60 };
  const stroke = { sm: 2.5, md: 3, lg: 3 };
  const d = dims[size] || 40;
  const sw = stroke[size] || 3;
  const r = (d - sw * 2) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`}>
        {/* Track */}
        <circle
          cx={d / 2} cy={d / 2} r={r}
          fill="none"
          stroke="var(--sand)"
          strokeWidth={sw}
        />
        {/* Spinner */}
        <circle
          cx={d / 2} cy={d / 2} r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${circ * 0.25} ${circ * 0.75}`}
          style={{ transformOrigin: "center", animation: "spin 0.9s linear infinite" }}
        />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {text && <p className="text-sm" style={{ color: "var(--steel-dark)" }}>{text}</p>}
    </div>
  );
};

export default Loader;
