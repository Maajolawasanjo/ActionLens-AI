import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { 
  DEMO_ACTIVE_ALERTS, 
  DEMO_AI_RECOMMENDATIONS, 
  DEMO_RESOURCE_DOCUMENTS 
} from "@/lib/demoSeedData";

// Map free-form types to DB enum values
// risk_type: 'flood' | 'drought' | 'disease' | 'agriculture' | 'storm' | 'food'
const toRiskType = (raw: string): string => {
  const map: Record<string, string> = {
    flood:       "flood",
    cyclone:     "storm",
    wildfire:    "storm",
    heatwave:    "drought",
    earthquake:  "storm",
    health:      "disease",
    landslide:   "storm",
    drought:     "drought",
    disease:     "disease",
    agriculture: "agriculture",
    food:        "food",
    storm:       "storm",
  };
  return map[raw.toLowerCase()] ?? "storm";
};

// risk_level: 'critical' | 'high' | 'moderate' | 'low' | 'safe'
const toRiskLevel = (raw: string): string => {
  const map: Record<string, string> = {
    critical: "critical",
    high:     "high",
    moderate: "moderate",
    low:      "low",
    safe:     "safe",
  };
  return map[raw.toLowerCase()] ?? "moderate";
};

// Lat/lng lookup for demo regions
const regionCoords: Record<string, [number, number]> = {
  "Lagos":        [6.4969,   3.3881],
  "Florida":      [25.7617, -80.1918],
  "California":   [34.1808, -118.0963],
  "Northern Region": [12.0022,  8.5920],
  "Nairobi":      [-1.2921,  36.8219],
  "Tokyo":        [35.6895, 139.6917],
  "Greater Accra":[-1.8845,  40.1221],
  "Benue":        [7.7322,   8.5214],
  "Tana River":   [-1.8845,  40.1221],
  "Garissa":      [-0.4500,  39.6400],
};

export async function POST() {
  try {
    const supabase = createAdminClient();

    // ── 1. Clear existing seed tables (safe no-op if empty) ──
    const tables = ["user_actions","recommendations","alerts","community_reports","resources","risk_data"];
    for (const table of tables) {
      await supabase.from(table as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    }

    // ── 2. Seed Alerts ──
    const alertsToInsert = DEMO_ACTIVE_ALERTS.map((a) => {
      const [lat, lng] = regionCoords[a.region] ?? [-1.8845, 40.1221];
      return {
        title:               a.title,
        description:         a.recommended_action,
        severity:            toRiskLevel(a.severity),
        type:                toRiskType(a.type),
        region:              a.region,
        country:             a.country || "Kenya",
        source:              a.issued_by,
        affected_population: a.affected_population || 0,
        is_active:           true,
        geom:                `SRID=4326;POINT(${lng} ${lat})`,
      };
    });
    const { error: alertErr } = await supabase.from("alerts").insert(alertsToInsert);
    if (alertErr) throw new Error(`alerts: ${alertErr.message}`);

    // ── 3. Seed Risk Data (hydrology telemetry) ──
    const riskData = [
      {
        region:      "Tana River",
        country:     "Kenya",
        risk_type:   "flood",
        risk_level:  "critical",
        source:      "River Tana Basin Watch Sensor 4A",
        valid_until: new Date(Date.now() + 86400000 * 7).toISOString(),
        payload:     { discharge_rate: "8.4m [CRITICAL]", alert_threshold: "7.0m", trend: "increasing" },
        geom:        "SRID=4326;POINT(40.1221 -1.8845)",
      },
      {
        region:      "Garissa",
        country:     "Kenya",
        risk_type:   "drought",
        risk_level:  "high",
        source:      "IGAD Drought Index Telemetry",
        valid_until: new Date(Date.now() + 86400000 * 30).toISOString(),
        payload:     { drought_index: "0.64 [HIGH ALERT]", soil_moisture: "12%", vegetation_health_vci: "vulnerable" },
        geom:        "SRID=4326;POINT(39.6400 -0.4500)",
      },
    ];
    const { error: riskErr } = await supabase.from("risk_data").insert(riskData);
    if (riskErr) throw new Error(`risk_data: ${riskErr.message}`);

    // ── 4. Seed Resources ──
    // report_category enum: 'flood' | 'drought' | 'infrastructure' | 'health' | 'food' | 'other'
    // resources.category is risk_type: 'flood' | 'drought' | 'disease' | 'agriculture' | 'storm' | 'food'
    const resourcesToInsert = DEMO_RESOURCE_DOCUMENTS.slice(0, 10).map((r) => ({
      title:       r.title,
      description: r.description,
      type:        r.type,
      category:    toRiskType(r.category || "flood"),
      language:    r.language || "en",
      file_url:    r.download_url,
    }));
    const { error: resErr } = await supabase.from("resources").insert(resourcesToInsert);
    if (resErr) throw new Error(`resources: ${resErr.message}`);

    // ── 5. Seed Recommendations ──
    // user_role enum: 'government'|'ngo'|'responder'|'farmer'|'health_worker'|'citizen'
    const roleMap: Record<string, string> = {
      government: "government", ngo: "ngo", responder: "responder",
      farmer: "farmer", health_worker: "health_worker", citizen: "citizen",
    };
    // priority_level: 'critical'|'high'|'medium'|'low'
    const priorityMap: Record<string, string> = {
      critical: "critical", high: "high", moderate: "medium", medium: "medium", low: "low"
    };
    // time_horizon enum: 'now'|'6h'|'24h'|'72h'
    const horizonMap = (raw: string): string => {
      if (raw === "Immediate" || raw.includes("0-3")) return "now";
      if (raw.includes("6")) return "6h";
      if (raw.includes("24")) return "24h";
      return "72h";
    };

    const recsToInsert = DEMO_AI_RECOMMENDATIONS.slice(0, 12).map((r) => ({
      role:             roleMap[r.role] ?? "citizen",
      region:           r.region,
      risk_type:        toRiskType(r.risk_type),
      action:           r.action,
      priority:         priorityMap[r.priority] ?? "high",
      time_horizon:     horizonMap(r.time_horizon),
      confidence_score: r.confidence_score,
      reasoning:        r.reasoning,
      expected_impact:  r.expected_impact,
      evidence:         r.evidence,
      status:           "active",
    }));
    const { error: recErr } = await supabase.from("recommendations").insert(recsToInsert);
    if (recErr) throw new Error(`recommendations: ${recErr.message}`);

    return NextResponse.json({
      success: true,
      seeded: {
        alerts:          alertsToInsert.length,
        risk_data:       riskData.length,
        resources:       resourcesToInsert.length,
        recommendations: recsToInsert.length,
      },
      message: "Database seeded successfully.",
    });
  } catch (err: any) {
    console.error("[Seed Error]", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
