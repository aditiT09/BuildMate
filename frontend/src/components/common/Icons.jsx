// Common Props: size (default 16), color (default "currentColor"), className
const baseSvg = (width, height, viewBox = "0 0 24 24") => ({
  xmlns: "http://www.w3.org/2000/svg",
  width,
  height,
  viewBox,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: { flexShrink: 0 },
});

export const CelebrationIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

export const DeadIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export const TimelineIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M5 2h14" />
    <path d="M5 22h14" />
    <path d="M19 2v6c0 3.3-2.7 6-6 6h-2c-3.3 0-6-2.7-6-6V2" />
    <path d="M19 22v-6c0-3.3-2.7-6-6-6h-2c-3.3 0-6 2.7-6 6v6" />
  </svg>
);

export const HatIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M2 12a10 10 0 0 1 20 0Z" />
    <path d="M6 12v3a6 6 0 0 0 12 0v-3" />
    <path d="M12 2v6" />
  </svg>
);

export const HopeIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

export const MailIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const MailOpenIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <polygon points="22 12 16 12 14 15 10 15 8 12 2 12 2 6 22 6 22 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

export const CheckIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const CheckCircleIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const XIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const EyeIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const WarningIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const SparkleIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const TargetIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const ChevronUpIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export const HelpCircleIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const SearchIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const SeedlingIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M12 22V10" />
    <path d="M12 10a6 6 0 0 1 6-6h2v2a6 6 0 0 1-6 6h-2z" />
    <path d="M12 14a6 6 0 0 0-6-6H4v2a6 6 0 0 0 6 6h2z" />
  </svg>
);

export const BrainIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
  </svg>
);

export const HandshakeIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M20 8v6M23 11h-6" />
  </svg>
);

export const MedalIcon = ({ size = 16, color = "currentColor", rank = 1, ...props }) => {
  const getColors = () => {
    if (rank === 1) return { fill: "#FFD700", stroke: "#DAA520" }; // Gold
    if (rank === 2) return { fill: "#C0C0C0", stroke: "#9C9C9C" }; // Silver
    return { fill: "#CD7F32", stroke: "#A0522D" }; // Bronze
  };
  const colors = getColors();
  return (
    <svg {...baseSvg(size, size)} stroke={colors.stroke} fill={colors.fill} {...props}>
      <circle cx="12" cy="12" r="7" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" fill="none" stroke={color} />
    </svg>
  );
};

export const MonitorIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export const WrenchIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const PaletteIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.35471 19.5128 6.06915 19.8 6.8152 19.8H7.5C8.32843 19.8 9 19.1284 9 18.3V17.8C9 16.9716 9.67157 16.3 10.5 16.3H11.5C12.3284 16.3 13 16.9716 13 17.8V19C13 20.6569 11.6569 22 10 22H12Z" />
    <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
    <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
    <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
  </svg>
);

export const BotIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8.01" y2="16" />
    <line x1="16" y1="16" x2="16.01" y2="16" />
  </svg>
);

export const CompassIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export const PenIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

export const BoardIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M4 15h16" />
    <rect x="4" y="4" width="16" height="12" rx="2" />
    <path d="M12 16v4" />
    <path d="M8 20h8" />
  </svg>
);

export const ChairIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M7 18V5h10v13" />
    <path d="M5 18h14" />
    <path d="M12 18v3" />
    <path d="M9 21h6" />
  </svg>
);

export const InboxIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

export const LockIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const LockOpenIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

export const SaveIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

export const GlobeIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const SmartphoneIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

export const RocketIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M12 2C7.5 2 4 5.5 4 10c0 2 1.5 3.5 3.5 3.5 4.5 0 8-3.5 8-8 0-2-1.5-3.5-3.5-3.5z" />
    <path d="M9 15l-3 3M15 9l3-3" />
  </svg>
);

export const TagIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

export const MessageIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const FolderIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export const BookIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z" />
  </svg>
);

export const ClipboardIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

export const GitHubIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const PlayIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const LinkIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const UserIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const UserPlusIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

export const UserXIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="18" y1="8" x2="23" y2="13" />
    <line x1="23" y1="8" x2="18" y2="13" />
  </svg>
);

export const UsersIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const PinIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <line x1="12" y1="17" x2="12" y2="22" />
    <path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.33-2.91A1 1 0 0 1 15.44 10.5V5a1 1 0 0 0-1-1H9.56a1 1 0 0 0-1 1v5.5a1 1 0 0 1-.79.59l-2.33 2.91A2 2 0 0 0 5 15.24z" />
  </svg>
);

export const LightbulbIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A7 7 0 0 0 4 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

export const TrashIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const DoorIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8M19 9l-4-4v14z" />
  </svg>
);

export const PaperclipIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

export const WebIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const SparklesIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
  </svg>
);

export const ZapIcon = ({ size = 16, color = "currentColor", ...props }) => (
  <svg {...baseSvg(size, size)} stroke={color} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

