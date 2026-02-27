export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ROLES = {
  CITIZEN: "citizen",
  AUTHORITY: "authority",
  CONTRACTOR: "contractor",
};

export const TICKET_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  REJECTED: "rejected",
};

export const TICKET_CATEGORIES = [
  { value: "road", label: "Road / Pothole" },
  { value: "water", label: "Water Supply" },
  { value: "electricity", label: "Electricity" },
  { value: "garbage", label: "Garbage" },
  { value: "drainage", label: "Drainage" },
  { value: "other", label: "Other" },
];

export const MAP_DEFAULT_CENTER = [18.5204, 73.8567]; // Pune, India
export const MAP_DEFAULT_ZOOM = 13;
