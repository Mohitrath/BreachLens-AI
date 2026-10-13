import { Incident, SecurityEvent, Severity, Finding } from "./types";

const sensitive = /payroll|finance|customer|secret|backup|database|bank|confidential|credential|token/i;
const bulkAction = /download|export|large_upload|bulk_read|copy/i;
const failedLogin = /login_failed|authentication_failed|invalid_password/i;
const suspiciousAuth = /mfa_bypass|privilege_change|role_assumption|token_created|new_device/i;

function severityFor(score: number): Severity {
  if (score >= 85) return "Critical";
  if (score >= 65) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}
function dateValue(s: string) {
  const n = Date.parse(s);
  return Number.isFinite(n) ? n : 0;
}

export function analyzeEvents(input: SecurityEvent[]): Incident[] {
  const users = new Map<string, SecurityEvent[]>();
  for (const event of input) {
    const key = event.user || "unknown";
    users.set(key, [...(users.get(key) || []), event]);
  }
  const incidents: Incident[] = [];
  for (const [user, eventsUnsorted] of users.entries()) {
    const events = [...eventsUnsorted].sort((a, b) => dateValue(a.timestamp) - dateValue(b.timestamp));
    const findings: Finding[] = [];
    const fails = events.filter(e => failedLogin.test(e.action) || (e.event_type === "authentication" && e.status === "failed"));
    const sensitiveAccess = events.filter(e => sensitive.test(`${e.resource} ${e.action}`));
    const bulk = events.filter(e => bulkAction.test(e.action));
    const privilege = events.filter(e => suspiciousAuth.test(`${e.action} ${e.event_type}`));
    const upload = events.filter(e => /upload|exfil|large_upload/i.test(e.action));
    const uniqueIps = new Set(events.map(e => e.source_ip).filter(Boolean));
    const totalBytes = events.reduce((sum, e) => sum + (Number(e.bytes) || 0), 0);

    let score = 8;
    if (fails.length >= 3) {
      const points = Math.min(24, 10 + fails.length * 2);
      score += points;
      findings.push({ title: "Repeated authentication failures", detail: `${fails.length} failed authentication event(s) were recorded for ${user}.`, points });
    }
    if (sensitiveAccess.length > 0) {
      const points = Math.min(25, 8 + sensitiveAccess.length * 4);
      score += points;
      findings.push({ title: "Sensitive resource touched", detail: `${sensitiveAccess.length} event(s) referenced resources matching sensitive-data indicators. Review access legitimacy and data classification.`, points });
    }
    if (bulk.length >= 2) {
      const points = Math.min(22, 8 + bulk.length * 4);
      score += points;
      findings.push({ title: "Multiple bulk data actions", detail: `${bulk.length} download/export-like action(s) occurred in this user's event set.`, points });
    }
    if (privilege.length > 0) {
      const points = Math.min(20, 12 + privilege.length * 3);
      score += points;
      findings.push({ title: "Privilege or authentication control event", detail: `${privilege.length} event(s) involved privilege changes, token activity, or MFA-related indicators.`, points });
    }
    if (upload.length > 0) {
      const points = Math.min(20, 12 + upload.length * 4);
      score += points;
      findings.push({ title: "Possible outbound data transfer", detail: `${upload.length} upload/exfiltration-like event(s) were observed. Validate destination and business justification.`, points });
    }
    if (uniqueIps.size > 1) {
      score += 8;
      findings.push({ title: "Multiple source IP addresses", detail: `Events for this user came from ${uniqueIps.size} source IPs. This can be legitimate; compare with known device and VPN records.`, points: 8 });
    }
    if (totalBytes > 50_000_000) {
      score += 10;
      findings.push({ title: "High cumulative data volume", detail: `Approximately ${(totalBytes / 1_000_000).toFixed(1)} MB is represented by event byte counts.`, points: 10 });
    }
    score = Math.min(99, score);
    if (findings.length === 0) {
      findings.push({ title: "No high-confidence rule triggered", detail: "No configured risk patterns were found. This is not proof that the activity is safe.", points: 0 });
    }
    const risky = score >= 40;
    const title = score >= 85 ? "Potential account compromise and data exfiltration" :
      score >= 65 ? "Suspicious account activity" :
      score >= 40 ? "Activity requires review" : "Low-risk activity review";
    const recommendedActions = score >= 65
      ? ["Validate the account owner and activity with the identity provider.", "Review session/token activity and revoke suspicious sessions if confirmed.", "Preserve relevant authentication and data-access logs.", "Check destination, access entitlement, and business justification before containment."]
      : score >= 40
      ? ["Confirm whether the activity matches the user's role and normal working pattern.", "Review the listed events and source IP/device context.", "Escalate if independent evidence supports compromise."]
      : ["Retain the events for audit and compare with the user's normal baseline."];
    incidents.push({
      id: `INC-${user.replace(/[^a-z0-9]/gi, "").toUpperCase()}-${events[0]?.id || "UNKNOWN"}`,
      title, user, score, severity: severityFor(score),
      status: risky ? "Open" : "Investigating",
      eventCount: events.length,
      firstSeen: events[0]?.timestamp || new Date().toISOString(),
      lastSeen: events[events.length - 1]?.timestamp || new Date().toISOString(),
      summary: risky
        ? `The event set for ${user} contains ${findings.length} risk indicator category(s). The combined pattern merits analyst review; it is not a confirmed breach.`
        : `No strong configured indicator was detected for ${user}. Continue monitoring and validate against the organisation's baseline.`,
      findings, events, recommendedActions
    });
  }
  return incidents.sort((a, b) => b.score - a.score);
}

export function normaliseRows(rows: Record<string, unknown>[]): SecurityEvent[] {
  return rows.map((row, i) => {
    const lower: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) lower[key.trim().toLowerCase().replace(/[ -]/g, "_")] = value;
    const pick = (...keys: string[]) => {
      for (const key of keys) if (lower[key] !== undefined && lower[key] !== null && String(lower[key]).trim() !== "") return String(lower[key]).trim();
      return "";
    };
    const bytes = Number(pick("bytes", "bytes_transferred", "size_bytes"));
    return {
      id: pick("id", "event_id") || `UPLOAD-${String(i + 1).padStart(4, "0")}`,
      timestamp: pick("timestamp", "time", "datetime", "event_time") || new Date().toISOString(),
      user: pick("user", "username", "account", "actor") || "unknown",
      source_ip: pick("source_ip", "ip", "ip_address", "src_ip") || "unknown",
      event_type: pick("event_type", "type", "category") || "unknown",
      resource: pick("resource", "file", "target", "object") || "unknown",
      action: pick("action", "operation", "event") || "unknown",
      bytes: Number.isFinite(bytes) ? bytes : 0,
      status: pick("status", "result", "outcome") || "unknown"
    };
  });
}