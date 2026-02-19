# KPI Detail Page — API Specification

> **For Backend Team**  
> This document describes the single API endpoint that powers the **KPI Detail Page**.  
> The page is reached by clicking any KPI card on the landing page.

---

## UI Sections Covered

| # | Section | Frontend Component |
|---|---|---|
| 1 | Page header (title + subtitle) | `KPIDetailScreen` |
| 2 | Metrics row (Goal / YTD / Baseline / L Qtr / Current) | `EnhancedKPICard` |
| 3 | Trend chart with historical data + AI forecast overlay | `EnhancedKPICard` |
| 4 | Root Cause Analysis panel | `RootCausePanel` |
| 5 | Agent Recommendations grid | Inline in `KPIDetailScreen` |
| 6 | Related KPIs grid (SCOR stages) | `RelatedKPIsGrid` |

---

## Endpoint

```
GET /api/kpi/detail
```

| Property | Value |
|---|---|
| Method | `GET` |
| Auth Required | Yes (Bearer token) |

---

## Request

### Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `kpiId` | `string` | ✅ Yes | — | KPI identifier. Same IDs used in `/api/kpi/all`. E.g. `otif`, `stockHealth`, `expiryRisk` |
| `module` | `string` | ❌ No | `otif` | Active module. Controls which root causes, recommendations, and related KPIs are returned. |
| `timePeriod` | `string` | ❌ No | `daily` | Chart data granularity. UI has Daily / Monthly / Yearly tabs. |

**Allowed `module` values:** `otif` · `staff-allocation` · `customer-satisfaction` · `resource-utilization` · `order-management` · `bed-management`

**Allowed `timePeriod` values:** `daily` · `monthly` · `yearly`

### Example URL

```
/api/kpi/detail?kpiId=otif&module=otif&timePeriod=daily
```

---

## Response — Success `200`

```json
{
  "success": true,
  "data": { ... }
}
```

### `data` Object — Field by Field

---

### Section 1 · Page Header

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique KPI identifier (e.g. `"otif"`) |
| `name` | `string` | Display name shown in the page H1 (e.g. `"Internal OTIF"`) |
| `title` | `string` | Card heading inside EnhancedKPICard (usually same as `name`) |
| `subtitle` | `string` | One-line descriptor below the title (e.g. `"On-Time, In-Full Delivery"`) |
| `description` | `string` | Short text shown under the page H1 |
| `module` | `string` | Echoes back the requested `module` param |
| `timePeriod` | `string` | Echoes back the requested `timePeriod` param |

---

### Section 2 · Metrics Row

| Field | Type | Description |
|---|---|---|
| `unit` | `string` | Unit string applied throughout UI: `%`, `RM`, `days`, `hours`, etc. |
| `status` | `string` | `healthy` \| `warning` \| `critical` — controls card border colour and badge |
| `target` | `number` | **GOAL** column value. Also drawn as the dashed reference line on the chart. |
| `current` | `number` | **CURRENT** and **YTD** column value |
| `ytd` | `number` | Year-to-date value (can equal `current` if not separately tracked) |
| `baseline` | `number` | **BASELINE** column. If `null`, UI uses `trendData.history[0].value` |
| `lastQuarter` | `number` | **L QTR** column. If `null`, UI falls back to `target` |
| `trend` | `string` | Human-readable change string, e.g. `"+2.3%"`, `"-1.2%"` |
| `trendValue` | `number` | Numeric change. Positive → TrendingUp arrow, Negative → TrendingDown arrow |
| `gap` | `number` | Absolute difference between `target` and `current` |
| `overstock` | `number \| null` | Overstock % (only for `stockHealth` KPI). Send `null` for all others. |
| `formula` | `string` | Calculation formula shown in the expandable formula tooltip |

---

### Section 3 · Trend Chart

The chart renders historical data as a solid teal line and the AI forecast as a dashed orange overlay.  
Overlap points (last N history dates) must appear in **both** `history` and `forecast.dates` to create a smooth join.

```json
"trendData": {
  "history": [
    { "date": "2025-12-29", "value": 89 },
    { "date": "2025-12-30", "value": 90 },
    { "date": "2025-12-31", "value": 91 },
    { "date": "2026-01-01", "value": 89 },
    { "date": "2026-01-02", "value": 92 },
    { "date": "2026-01-03", "value": 93 },
    { "date": "2026-01-04", "value": 92 },
    { "date": "2026-01-05", "value": 92.5 }
  ],
  "forecast": {
    "model": "holt",
    "dates": [
      "2026-01-03", "2026-01-04", "2026-01-05",
      "2026-01-06", "2026-01-07", "2026-01-08",
      "2026-01-09", "2026-01-10", "2026-01-11", "2026-01-12"
    ],
    "values": [93, 92, 92.5, 92.8, 93.2, 93.5, 93.8, 94.1, 94.4, 94.7],
    "overlapPoints": 3,
    "futurePoints": 7,
    "confidencePct": 85
  }
}
```

| Field | Type | Description |
|---|---|---|
| `history` | `array` | `{ date: YYYY-MM-DD, value: number }`. Volume: ~8 daily, ~12 monthly, ~5 yearly |
| `forecast.model` | `string` | Model name for info purposes — `"holt"`, `"arima"`, etc. |
| `forecast.dates` | `string[]` | ISO date strings. First `overlapPoints` must match the last N history dates |
| `forecast.values` | `number[]` | Forecast values, same order as `dates` |
| `forecast.overlapPoints` | `integer` | How many forecast dates overlap with history (for smooth line join) |
| `forecast.futurePoints` | `integer` | Number of purely future forecast points |
| `forecast.confidencePct` | `integer` | Confidence percentage (informational only) |

---

### Section 4 · Root Cause Analysis

Groups causes by category. The panel renders each category as a section header with its causes listed below.

```json
"rootCauses": [
  {
    "category": "Demand",
    "causes": [
      { "id": 1, "name": "Forecast Inaccuracy", "severity": "high", "impact": 35, "description": "WAPE >15% for critical SKUs" },
      { "id": 2, "name": "Sudden Demand Spikes", "severity": "medium", "impact": 20, "description": "Unexpected increases in specific departments" }
    ]
  },
  {
    "category": "Supply",
    "causes": [
      { "id": 3, "name": "Supplier Delays", "severity": "high", "impact": 30, "description": "Inbound OTIF at 89% vs target 98%" },
      { "id": 4, "name": "Lead Time Variability", "severity": "medium", "impact": 15, "description": "High variance in supplier delivery times" }
    ]
  },
  {
    "category": "Products",
    "causes": [
      { "id": 5, "name": "SKU Complexity", "severity": "low", "impact": 10, "description": "High number of low-volume SKUs" }
    ]
  }
]
```

| Field | Type | Values |
|---|---|---|
| `category` | `string` | Free text group label, e.g. `"Demand"`, `"Supply"`, `"Products"`, `"People"`, etc. |
| `causes[].id` | `integer` | Unique ID within the KPI |
| `causes[].name` | `string` | Short cause label |
| `causes[].severity` | `string` | `high` \| `medium` \| `low` |
| `causes[].impact` | `integer` | % contribution to the KPI gap (all causes across all categories should sum to 100) |
| `causes[].description` | `string` | One-sentence explanation |

---

### Section 5 · Agent Recommendations

Rendered as a 2-column grid. Each card has a priority badge, impact label, title, description, tags, a metrics row (Improvement / Timeline / Cost), and an **Implement** button.

```json
"recommendations": [
  {
    "id": 1,
    "priority": "CRITICAL",
    "impact": "high",
    "title": "Increase Safety Stock for Life-saving Medicines",
    "description": "Prioritize safety stock buffers for ICU/critical-use items in OT.",
    "tags": ["Life-saving", "Critical"],
    "improvement": "+5.2% OTIF",
    "timeline": "2-3 days",
    "cost": "Medium",
    "implemented": false
  }
]
```

| Field | Type | Values / Notes |
|---|---|---|
| `id` | `integer` | Unique within list |
| `priority` | `string` | `CRITICAL` \| `HIGH` \| `MEDIUM` \| `LOW` |
| `impact` | `string` | `high` \| `medium` \| `low` |
| `title` | `string` | Short action title |
| `description` | `string` | 1-2 sentence explanation |
| `tags` | `string[]` | Label chips shown on the card |
| `improvement` | `string` | Expected benefit, e.g. `"+5.2% OTIF"`, `"-RM 0.8M Risk"` |
| `timeline` | `string` | Implementation time, e.g. `"2-3 days"`, `"1 week"` |
| `cost` | `string` | `"Low"` \| `"Medium"` \| `"High"` |
| `implemented` | `boolean` | Default `false`. Can be `true` if user already marked it. |

---

### Section 6 · Related KPIs Grid

Shown at the bottom of the page. Each card links to another KPI detail page when clicked.  
`stage` maps to the SCOR framework stages. `icon` is a [lucide-react](https://lucide.dev) icon name.

```json
"relatedKPIs": [
  { "id": "wape",             "stage": "Plan",    "name": "Forecast Quality (WAPE)",   "value": 12.5, "unit": "%",     "target": 10, "status": "warning",  "icon": "Target",     "color": "#f59e0b" },
  { "id": "inbound_otif",     "stage": "Source",  "name": "Inbound Supplier OTIF",     "value": 96.8, "unit": "%",     "target": 98, "status": "warning",  "icon": "Truck",      "color": "#f59e0b" },
  { "id": "fpy",              "stage": "Make",    "name": "First Pass Yield (FPY)",    "value": 94.2, "unit": "%",     "target": 96, "status": "warning",  "icon": "CheckCircle","color": "#f59e0b" },
  { "id": "customer_otif",    "stage": "Deliver", "name": "Customer OTIF",             "value": 97.5, "unit": "%",     "target": 99, "status": "warning",  "icon": "Package",    "color": "#f59e0b" },
  { "id": "return_resolution","stage": "Return",  "name": "Return Resolution Lead Time","value": 3.5, "unit": "days",  "target": 2,  "status": "critical", "icon": "RotateCcw",  "color": "#ef4444" },
  { "id": "e2r",              "stage": "Enable",  "name": "Exception-to-Recovery Time","value": 4.2, "unit": "hours", "target": 2,  "status": "critical", "icon": "Zap",        "color": "#ef4444" }
]
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | KPI ID — clicking this card navigates to `/api/kpi/detail?kpiId={id}` |
| `stage` | `string` | SCOR stage: `Plan` \| `Source` \| `Make` \| `Deliver` \| `Return` \| `Enable` |
| `name` | `string` | Display name |
| `description` | `string` | Short descriptor |
| `value` | `number` | Current value |
| `unit` | `string` | `%`, `days`, `hours`, etc. |
| `target` | `number` | Goal value |
| `status` | `string` | `healthy` \| `warning` \| `critical` |
| `formula` | `string` | Calculation formula |
| `icon` | `string` | `lucide-react` icon component name |
| `color` | `string` | Hex colour for the icon/accent |

---

## Error Responses

### `400` — Missing or invalid params
```json
{ "success": false, "error": { "code": "INVALID_PARAMS", "message": "kpiId is required." } }
```

### `404` — KPI not found
```json
{ "success": false, "error": { "code": "KPI_NOT_FOUND", "message": "KPI 'xyz' not found for module 'otif'." } }
```

---

## Module Adaptation Rules

> The **same endpoint** serves all modules. The backend must adapt content based on the `module` query param.

| Field category | Fields | Behaviour |
|---|---|---|
| **Module-neutral** | `id`, `name`, `title`, `subtitle`, `description`, `unit`, `status`, `target`, `current`, `ytd`, `baseline`, `lastQuarter`, `trend`, `trendValue`, `gap`, `formula`, `trendData` | Always KPI-specific. Never change per module. |
| **Module-specific** | `rootCauses`, `recommendations`, `relatedKPIs` | Return content relevant to the active module. E.g. for `staff-allocation`, root causes should reference staffing gaps — not supplier delays. |

---

## Known KPI IDs

| `kpiId` | Name |
|---|---|
| `otif` | Internal OTIF |
| `stockHealth` | Stock Position Health |
| `expiryRisk` | Expiry Risk Value |

> Additional KPI IDs should be discussed with the frontend team before adding new detail pages.
