/**
 * SmileLoader — ตัวโหลดหน้ายิ้มน่ารัก วาดปากด้วยมือ (draw-in), กระพริบตา, เด้งเบาๆ
 *
 * วิธีใช้ (Vite + React):
 *   import SmileLoader from "./SmileLoader";
 *   <SmileLoader />
 *   <SmileLoader size={120} label="กำลังโหลดข้อมูล" />
 *
 * ไม่ต้องพึ่ง library ภายนอกใดๆ ใช้ React ล้วนๆ
 */
export default function SmileLoader({
  size = 96,
  label = "กำลังโหลด",
  showLabel = true,
}) {
  return (
    <div className="smile-loader-wrap" style={{ "--sl-size": `${size}px` }}>
      <svg
        className="smile-loader-svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role="img"
        aria-label={label}
      >
        {/* หน้า */}
        <circle className="sl-face" cx="50" cy="50" r="40" />

        {/* แก้มยิ้ม */}
        <ellipse className="sl-cheek" cx="26" cy="56" rx="8" ry="5" />
        <ellipse className="sl-cheek" cx="74" cy="56" rx="8" ry="5" />

        {/* ตา */}
        <circle className="sl-eye sl-eye-left" cx="34" cy="42" r="4.5" />
        <circle className="sl-eye sl-eye-right" cx="66" cy="42" r="4.5" />

        {/* ปากยิ้ม วาดขึ้นเรื่อยๆ */}
        <path className="sl-mouth" d="M28 58 Q50 80 72 58" />
      </svg>

      {showLabel && (
        <p className="smile-loader-label">
          {label}
          <span className="sl-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      )}

      <style>{`
        .smile-loader-wrap {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          font-family: "Mali", system-ui, sans-serif;
        }

        .smile-loader-svg {
          animation: sl-bob 1.8s ease-in-out infinite;
          overflow: visible;
        }

        .sl-face {
          fill: #ffd166;
          stroke: #2b2d42;
          stroke-width: 4;
        }

        .sl-cheek {
          fill: #ff6b6b;
          opacity: 0.35;
        }

        .sl-eye {
          fill: #2b2d42;
          transform-box: fill-box;
          transform-origin: center;
          animation: sl-blink 3.2s ease-in-out infinite;
        }

        .sl-eye-right {
          animation-delay: 0.05s;
        }

        .sl-mouth {
          fill: none;
          stroke: #2b2d42;
          stroke-width: 4.5;
          stroke-linecap: round;
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: sl-draw 1.8s ease-in-out infinite;
        }

        .smile-loader-label {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #2b2d42;
          letter-spacing: 0.02em;
        }

        .sl-dots span {
          animation: sl-dot 1.4s infinite;
          opacity: 0;
        }
        .sl-dots span:nth-child(1) { animation-delay: 0s; }
        .sl-dots span:nth-child(2) { animation-delay: 0.2s; }
        .sl-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes sl-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes sl-blink {
          0%, 88%, 100% { transform: scaleY(1); }
          92% { transform: scaleY(0.1); }
        }

        @keyframes sl-draw {
          0% { stroke-dashoffset: 60; }
          45%, 55% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -60; }
        }

        @keyframes sl-dot {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .smile-loader-svg,
          .sl-eye,
          .sl-mouth,
          .sl-dots span {
            animation: none !important;
          }
          .sl-mouth {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
