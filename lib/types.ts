export type Severity = "Critical" | "High" | "Medium" | "Low";
export type SecurityEvent = {
  id: string;
  timestamp: string;
  user: string;
  source_ip: string;
  event_type: string;
  resource: string;
  action: string;
  bytes?: number;
  status?: string;
};
export type Finding = { title: string; detail: string; points: number };
export type Incident = {
  id: string;
  title: string;
  user: string;
  score: number;
  severity: Severity;
  status: "Open" | "Investigating" | "Resolved";
  eventCount: number;
  firstSeen: string;
  lastSeen: string;
  summary: string;
  findings: Finding[];
  events: SecurityEvent[];
  recommendedActions: string[];
};