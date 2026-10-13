import { Event } from "./types";
const day = "2026-10-14T";
export const demoEvents: Event[] = [
{id:"SS-001",timestamp:day+"08:01:12Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"auth",action:"login_failed",resource:"identity-provider",status:"failed",bytes:0},
{id:"SS-002",timestamp:day+"08:01:49Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"auth",action:"login_failed",resource:"identity-provider",status:"failed",bytes:0},
{id:"SS-003",timestamp:day+"08:02:25Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"auth",action:"login_failed",resource:"identity-provider",status:"failed",bytes:0},
{id:"SS-004",timestamp:day+"08:03:01Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"auth",action:"login_success",resource:"identity-provider",status:"success",bytes:0},
{id:"SS-005",timestamp:day+"08:05:34Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"file",action:"download",resource:"finance/payroll-q3.csv",status:"success",bytes:18500000},
{id:"SS-006",timestamp:day+"08:07:09Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"file",action:"export",resource:"customer/customer-export.csv",status:"success",bytes:62000000},
{id:"SS-007",timestamp:day+"08:08:47Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"identity",action:"permission_grant",resource:"role/admin",status:"success",bytes:0},
{id:"SS-008",timestamp:day+"08:10:22Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"network",action:"external_upload",resource:"external-storage",status:"success",bytes:88000000},
{id:"SS-009",timestamp:day+"08:12:02Z",user:"a.sharma",source_ip:"198.51.100.28",device:"unknown-linux",event_type:"auth",action:"token_refresh",resource:"identity-provider",status:"success",bytes:0},
{id:"SS-010",timestamp:day+"08:19:09Z",user:"r.patel",source_ip:"10.0.4.21",device:"corp-laptop-22",event_type:"auth",action:"mfa_bypass_attempt",resource:"identity-provider",status:"blocked",bytes:0},
{id:"SS-011",timestamp:day+"08:22:01Z",user:"r.patel",source_ip:"10.0.4.21",device:"corp-laptop-22",event_type:"auth",action:"login_success",resource:"identity-provider",status:"success",bytes:0},
{id:"SS-012",timestamp:day+"08:23:14Z",user:"r.patel",source_ip:"10.0.4.21",device:"corp-laptop-22",event_type:"file",action:"read",resource:"engineering/design-doc.md",status:"success",bytes:2200},
{id:"SS-013",timestamp:day+"08:25:36Z",user:"m.jones",source_ip:"10.0.2.16",device:"corp-laptop-08",event_type:"auth",action:"login_success",resource:"identity-provider",status:"success",bytes:0},
{id:"SS-014",timestamp:day+"08:27:19Z",user:"m.jones",source_ip:"10.0.2.16",device:"corp-laptop-08",event_type:"file",action:"read",resource:"engineering/build.log",status:"success",bytes:5300},
{id:"SS-015",timestamp:day+"08:29:40Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"file",action:"download",resource:"finance/vendor-bank-details.xlsx",status:"success",bytes:7200000},
{id:"SS-016",timestamp:day+"08:32:16Z",user:"svc-backup",source_ip:"10.0.0.9",device:"backup-agent",event_type:"backup",action:"scheduled_backup",resource:"backup/nightly-snapshot",status:"success",bytes:640000000},
{id:"SS-017",timestamp:day+"08:34:09Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"auth",action:"token_refresh",resource:"identity-provider",status:"success",bytes:0},
{id:"SS-018",timestamp:day+"08:37:52Z",user:"a.sharma",source_ip:"203.0.113.44",device:"unknown-linux",event_type:"file",action:"read",resource:"customer/customer-export.csv",status:"success",bytes:42000000}
];
