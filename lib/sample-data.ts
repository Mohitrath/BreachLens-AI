import { SecurityEvent } from "./types";

const base = "2026-10-14T";
export const sampleEvents: SecurityEvent[] = [
  { id:"EVT-1001", timestamp:base+"08:01:12Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"authentication", resource:"identity-provider", action:"login_failed", status:"failed" },
  { id:"EVT-1002", timestamp:base+"08:01:29Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"authentication", resource:"identity-provider", action:"login_failed", status:"failed" },
  { id:"EVT-1003", timestamp:base+"08:01:47Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"authentication", resource:"identity-provider", action:"login_failed", status:"failed" },
  { id:"EVT-1004", timestamp:base+"08:03:02Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"authentication", resource:"identity-provider", action:"login_success", status:"success" },
  { id:"EVT-1005", timestamp:base+"08:05:41Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"file_access", resource:"finance/payroll-q3.csv", action:"download", bytes:18400000, status:"success" },
  { id:"EVT-1006", timestamp:base+"08:07:03Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"file_access", resource:"customer/customer-export.csv", action:"export", bytes:42600000, status:"success" },
  { id:"EVT-1007", timestamp:base+"08:08:19Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"privilege_change", resource:"cloud-console", action:"role_assumption", status:"success" },
  { id:"EVT-1008", timestamp:base+"08:10:54Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"file_access", resource:"backup/database-backup.zip", action:"download", bytes:98000000, status:"success" },
  { id:"EVT-1009", timestamp:base+"08:14:11Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"network", resource:"external-storage", action:"large_upload", bytes:126000000, status:"success" },
  { id:"EVT-1010", timestamp:base+"08:18:05Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"authentication", resource:"identity-provider", action:"mfa_bypass_attempt", status:"blocked" },
  { id:"EVT-1011", timestamp:base+"08:22:01Z", user:"r.patel", source_ip:"10.0.4.21", event_type:"authentication", resource:"identity-provider", action:"login_success", status:"success" },
  { id:"EVT-1012", timestamp:base+"08:23:14Z", user:"r.patel", source_ip:"10.0.4.21", event_type:"file_access", resource:"engineering/design-doc.md", action:"read", bytes:2200, status:"success" },
  { id:"EVT-1013", timestamp:base+"08:25:36Z", user:"m.jones", source_ip:"10.0.2.16", event_type:"authentication", resource:"identity-provider", action:"login_success", status:"success" },
  { id:"EVT-1014", timestamp:base+"08:27:19Z", user:"m.jones", source_ip:"10.0.2.16", event_type:"file_access", resource:"engineering/build.log", action:"read", bytes:5300, status:"success" },
  { id:"EVT-1015", timestamp:base+"08:29:40Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"file_access", resource:"finance/vendor-bank-details.xlsx", action:"download", bytes:7200000, status:"success" },
  { id:"EVT-1016", timestamp:base+"08:32:16Z", user:"svc-backup", source_ip:"10.0.0.9", event_type:"backup", resource:"backup/nightly-snapshot", action:"scheduled_backup", bytes:640000000, status:"success" },
  { id:"EVT-1017", timestamp:base+"08:34:09Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"authentication", resource:"identity-provider", action:"token_refresh", status:"success" },
  { id:"EVT-1018", timestamp:base+"08:37:52Z", user:"a.sharma", source_ip:"103.82.21.44", event_type:"file_access", resource:"customer/customer-export.csv", action:"read", bytes:42000000, status:"success" }
];