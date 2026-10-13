import { NextRequest, NextResponse } from "next/server";
import { analyzeEvents, normaliseRows } from "@/lib/analyzer";
import { sampleEvents } from "@/lib/sample-data";
import { SecurityEvent } from "@/lib/types";

export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let events: SecurityEvent[];
    if (body?.mode === "sample") events = sampleEvents;
    else if (Array.isArray(body?.events)) events = normaliseRows(body.events);
    else return NextResponse.json({ error: "Send { mode: 'sample' } or { events: [...] }." }, { status: 400 });
    if (!events.length) return NextResponse.json({ error: "No events were provided." }, { status: 400 });
    if (events.length > 10000) return NextResponse.json({ error: "Maximum 10,000 events per analysis." }, { status: 413 });
    const incidents = analyzeEvents(events);
    return NextResponse.json({
      incidents,
      stats: {
        events: events.length,
        users: new Set(events.map(e => e.user)).size,
        critical: incidents.filter(i => i.severity === "Critical").length,
        high: incidents.filter(i => i.severity === "High").length,
        medium: incidents.filter(i => i.severity === "Medium").length,
        low: incidents.filter(i => i.severity === "Low").length
      },
      engine: "BreachLens deterministic correlation engine v1"
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON request or malformed input." }, { status: 400 });
  }
}