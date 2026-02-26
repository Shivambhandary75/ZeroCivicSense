import React from "react";

// ─── Base wrapper ────────────────────────────────────────────────
const Icon = ({ size = 20, className = "", children, viewBox = "0 0 24 24" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

// ─── Icons ───────────────────────────────────────────────────────

export const MapPinIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z" />
    <circle cx="12" cy="8" r="2.5" />
  </Icon>
);

export const MapIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </Icon>
);

export const ShieldCheckIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" />
    <polyline points="9 12 11 14 15 10" />
  </Icon>
);

export const BuildingIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <rect x="3" y="9" width="18" height="12" rx="1" />
    <path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
    <line x1="12" y1="13" x2="12" y2="17" />
    <line x1="8" y1="13" x2="8" y2="17" />
    <line x1="16" y1="13" x2="16" y2="17" />
  </Icon>
);

export const CpuIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </Icon>
);

export const ClipboardIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="12" y2="16" />
  </Icon>
);

export const HardHatIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" />
    <path d="M10 10V7a2 2 0 1 1 4 0v3" />
    <path d="M4 15V12a8 8 0 0 1 16 0v3" />
  </Icon>
);

export const CheckCircleIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Icon>
);

export const CheckIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);

export const AlertTriangleIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

export const ArrowRightIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Icon>
);

export const ArrowLeftIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </Icon>
);

export const XIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

export const UploadIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </Icon>
);

export const ImageIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </Icon>
);

export const UserIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
);

export const LogOutIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
);

export const PlusIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Icon>
);

export const TicketIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
    <line x1="9" y1="9" x2="9" y2="9.01"/>
    <line x1="15" y1="9" x2="15" y2="9.01"/>
    <line x1="9" y1="15" x2="9" y2="15.01"/>
    <line x1="15" y1="15" x2="15" y2="15.01"/>
  </Icon>
);

export const BriefcaseIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="12.01" />
  </Icon>
);

export const GavelIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M14 13L20.5 6.5a2.121 2.121 0 0 0-3-3L11 10" />
    <path d="M4.5 20.5l6-6" />
    <path d="M3 22l1.5-1.5" />
    <path d="M14.5 4.5l5 5" />
    <line x1="3" y1="15" x2="9" y2="21" />
  </Icon>
);

export const EyeIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const PackageIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </Icon>
);

export const ShovelIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <line x1="3" y1="20" x2="8" y2="15" />
    <path d="M9.33 9.33L12 12l6-6-3-3-6 6z" />
    <path d="M14 6l4 4-2 2-4-4z" />
    <line x1="4" y1="16" x2="8" y2="20" />
  </Icon>
);

export const WrenchIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </Icon>
);

export const ClipboardCheckIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
    <path d="m9 14 2 2 4-4" />
  </Icon>
);

export const FlagIcon = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </Icon>
);

export const SpinnerIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className={`animate-spin ${className}`}
    aria-hidden="true"
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);
