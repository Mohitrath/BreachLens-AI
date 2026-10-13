# SignalSentry AI

Evidence-led cybersecurity threat detection and incident investigation for SOC analysts. This Next.js MVP ingests event CSVs, groups signals by identity, links findings to exact event IDs, provides transparent heuristic prioritisation, and generates an investigation brief using Gemini when configured (otherwise deterministic fallback).

## Features
- SOC dashboard, risk-ranked cases, charts and incident timeline
- Synthetic attack-like demo sequence plus normal control activity
- CSV upload and field aliases for common security log schemas
- Explainable rules for auth bursts, sensitive access, bulk activity, privileges, outbound transfers, devices, source IPs and volume
- Evidence-linked recommendations and case CSV export
- Optional Gemini investigation copilot

## Run locally
Requires Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000 and click **Load demo data**. For a production build, run `npm run build` then `npm start`.

## CSV fields
Suggested columns: `id,timestamp,user,source_ip,device,event_type,action,resource,status,bytes`. Common aliases are normalised automatically.

## Optional Gemini
Add `GEMINI_API_KEY` and `GEMINI_MODEL=gemini-2.0-flash` to `.env.local`, then restart. Never commit secrets or send production logs to an external model without privacy/security approval.

## API
- `POST /api/analyze` accepts `{ "mode": "demo" }` or `{ "events": [...] }`.
- `POST /api/copilot` accepts `{ "incident": {...} }`.

## Important limitations
This is an MVP, not a production SIEM: no authentication, RBAC, persistence, live SIEM integrations, tenant isolation, or automated containment. Correlation is heuristic and grouped across the uploaded dataset rather than a bounded sliding window. Risk scores are prioritisation indicators, **not calibrated probabilities**. Validate cases against trusted identity, endpoint, cloud audit, and network telemetry.

## Demo flow
1. Load demo data.
2. Open the highest-ranked case and inspect evidence event IDs.
3. Walk the event timeline.
4. Generate an investigation brief and export the case CSV.
5. Upload a clean CSV to compare results.
