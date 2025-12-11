# Landing Page API Specification

## Overview
This document describes the API endpoint structure and response format for the Hospital Pharmacy OTIF Management System landing page.

---

## Endpoint

### GET /api/v1/landing-page

**Description**: Retrieves all data required to render the landing page dashboard.

**Authentication**: Required (Bearer Token)

**Request Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Query Parameters** (Optional):
- `refresh` (boolean): Force refresh cached data. Default: `false`
- `date` (string): ISO 8601 date for historical data. Default: current date

---

## Response Structure

### Success Response (200 OK)

```json
{
  "status": "success",
  "timestamp": "2025-12-11T09:54:39+05:30",
  "data": {
    "organization": { ... },
    "overview": { ... },
    "otifDepartments": [ ... ],
    "decisionActions": [ ... ],
    "decisionActionsSummary": { ... },
    "forecast": { ... },
    "searchSuggestions": { ... },
    "colorCoding": { ... },
    "metadata": { ... }
  }
}
```

---

## Data Object Specifications

### 1. Organization
Information about the organization.

```typescript
{
  "organization": {
    "name": string,        // Full organization name
    "subtitle": string     // Application subtitle/description
  }
}
```

**Example**:
```json
{
  "organization": {
    "name": "Experienceflow Software Technologies Private Limited",
    "subtitle": "Hospital Pharmacy OTIF Management System"
  }
}
```

---

### 2. Overview
Overall OTIF performance metrics.

```typescript
{
  "overview": {
    "overallOTIF": number  // Overall OTIF percentage (0-100)
  }
}
```

**Example**:
```json
{
  "overview": {
    "overallOTIF": 92.4
  }
}
```

---

### 3. OTIF Departments
Array of department-wise OTIF performance data.

```typescript
{
  "otifDepartments": [
    {
      "id": string,              // Unique department identifier
      "name": string,            // Short department name
      "description": string,     // Full department description
      "otifPercentage": number,  // OTIF percentage (0-100)
      "status": string,          // Color status: "green" | "amber" | "red"
      "icon": string             // Icon name (Lucide React icon)
    }
  ]
}
```

**Status Calculation**:
- `"green"`: otifPercentage >= 94
- `"amber"`: otifPercentage >= 85 && otifPercentage < 94
- `"red"`: otifPercentage < 85

**Supported Icons**:
- Heart, Activity, Bed, Users, Truck, Stethoscope, Pill, FlaskConical, Syringe, Thermometer, ClipboardList, Building2

**Example**:
```json
{
  "otifDepartments": [
    {
      "id": "icu",
      "name": "ICU",
      "description": "Intensive Care Unit",
      "otifPercentage": 95.2,
      "status": "green",
      "icon": "Heart"
    },
    {
      "id": "ward",
      "name": "Ward",
      "description": "General Ward",
      "otifPercentage": 82.3,
      "status": "red",
      "icon": "Bed"
    }
  ]
}
```

---

### 4. Decision Actions
Array of pending decision actions requiring attention.

```typescript
{
  "decisionActions": [
    {
      "id": string,              // Unique action identifier
      "name": string,            // Action category name
      "pendingCount": number,    // Number of pending items
      "severity": string,        // Severity level: "high" | "medium" | "low"
      "description": string,     // Short description
      "details": string          // Detailed explanation
    }
  ]
}
```

**Severity Levels**:
- `"high"`: Critical actions requiring immediate attention (red color)
- `"medium"`: Important actions needing attention (light red/orange color)
- `"low"`: Low priority actions (yellow color)

**Example**:
```json
{
  "decisionActions": [
    {
      "id": "usage-velocity",
      "name": "Usage / Velocity",
      "pendingCount": 45,
      "severity": "high",
      "description": "Items with abnormal usage patterns or velocity changes",
      "details": "Fast-moving items requiring immediate attention"
    },
    {
      "id": "demand-pattern",
      "name": "Demand Pattern & Predictability",
      "pendingCount": 28,
      "severity": "medium",
      "description": "Items with unpredictable demand patterns",
      "details": "Seasonal or irregular demand items"
    }
  ]
}
```

---

### 5. Decision Actions Summary
Aggregated summary of all decision actions.

```typescript
{
  "decisionActionsSummary": {
    "totalPendingActions": number  // Sum of all pendingCount values
  }
}
```

**Calculation**: Sum of all `pendingCount` from `decisionActions` array.

**Example**:
```json
{
  "decisionActionsSummary": {
    "totalPendingActions": 230
  }
}
```

---

### 6. Forecast
Demand forecast data for hospital areas.

```typescript
{
  "forecast": {
    "overallSurgePercentage": number,  // Overall forecast surge (%)
    "areas": [
      {
        "id": string,                   // Unique area identifier
        "areaName": string,             // Area name
        "currentForecast": number,      // Current forecast value
        "previousForecast": number,     // Previous period forecast
        "changePercentage": number,     // Percentage change
        "trend": string,                // Trend direction: "up" | "down"
        "description": string           // Area description
      }
    ]
  }
}
```

**Trend Calculation**:
- `"up"`: currentForecast > previousForecast
- `"down"`: currentForecast <= previousForecast

**Change Percentage Formula**:
```
changePercentage = ((currentForecast - previousForecast) / previousForecast) * 100
```

**Example**:
```json
{
  "forecast": {
    "overallSurgePercentage": 10,
    "areas": [
      {
        "id": "icu-forecast",
        "areaName": "ICU",
        "currentForecast": 15.2,
        "previousForecast": 13.8,
        "changePercentage": 10.1,
        "trend": "up",
        "description": "Intensive Care Unit forecast"
      }
    ]
  }
}
```

---

### 7. Search Suggestions
Pre-defined search suggestions for auto-complete functionality.

```typescript
{
  "searchSuggestions": {
    "otif": string[],       // OTIF-related suggestions
    "medicines": string[],  // Medicine name suggestions
    "actions": string[],    // Action type suggestions
    "labels": string[]      // Label/category suggestions
  }
}
```

**Example**:
```json
{
  "searchSuggestions": {
    "otif": [
      "OTIF Overall",
      "OTIF ICU",
      "OTIF OT",
      "OTIF by Department"
    ],
    "medicines": [
      "Paracetamol",
      "Amoxicillin",
      "Metformin",
      "Aspirin"
    ],
    "actions": [
      "Usage / Velocity",
      "Stock Position",
      "Expiry / Shelf-Life"
    ],
    "labels": [
      "Critical",
      "High Priority",
      "Fast Moving"
    ]
  }
}
```

---

### 8. Color Coding
Color coding rules and descriptions.

```typescript
{
  "colorCoding": {
    "otif": {
      "green": {
        "range": string,        // Percentage range
        "description": string   // Status description
      },
      "amber": { ... },
      "red": { ... }
    }
  }
}
```

**Example**:
```json
{
  "colorCoding": {
    "otif": {
      "green": {
        "range": "94-100%",
        "description": "Healthy performance"
      },
      "amber": {
        "range": "85-94%",
        "description": "Warning - needs attention"
      },
      "red": {
        "range": "<85%",
        "description": "Critical - immediate action required"
      }
    }
  }
}
```

---

### 9. Metadata
Response metadata and cache information.

```typescript
{
  "metadata": {
    "lastUpdated": string,      // ISO 8601 timestamp
    "dataVersion": string,      // Data version number
    "refreshInterval": number   // Recommended refresh interval (seconds)
  }
}
```

**Example**:
```json
{
  "metadata": {
    "lastUpdated": "2025-12-11T09:54:39+05:30",
    "dataVersion": "1.0",
    "refreshInterval": 300
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Authentication required",
  "timestamp": "2025-12-11T09:54:39+05:30"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "code": "FORBIDDEN",
  "message": "Insufficient permissions to access this resource",
  "timestamp": "2025-12-11T09:54:39+05:30"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred",
  "timestamp": "2025-12-11T09:54:39+05:30"
}
```

---

## Data Validation Rules

### OTIF Departments
- Minimum 1 department required
- `otifPercentage`: Must be between 0 and 100
- `status`: Must match calculated status based on percentage
- `id`: Must be unique across all departments

### Decision Actions
- Minimum 1 action required
- `pendingCount`: Must be >= 0
- `severity`: Must be one of ["high", "medium", "low"]
- Total pending count must match `decisionActionsSummary.totalPendingActions`

### Forecast Areas
- Minimum 1 area required
- `currentForecast` and `previousForecast`: Must be >= 0
- `changePercentage`: Should be calculated correctly
- `trend`: Must match the direction of change

---

## Frontend Integration Notes

### Data Mapping

The frontend expects the following data structure from `landingPageData.js`:

```javascript
// Map API response to frontend data
const mapAPIResponse = (apiData) => {
  return {
    overallOTIF: apiData.data.overview.overallOTIF,
    otifDepartments: apiData.data.otifDepartments,
    decisionActions: apiData.data.decisionActions,
    totalPendingActions: apiData.data.decisionActionsSummary.totalPendingActions,
    forecastSurge: apiData.data.forecast.overallSurgePercentage,
    forecastAreas: apiData.data.forecast.areas,
    searchSuggestions: apiData.data.searchSuggestions
  };
};
```

### Icon Mapping

Icons are referenced by name and should be imported from `lucide-react`:

```javascript
import { 
  Heart, Activity, Bed, Users, Truck, Stethoscope, 
  Pill, FlaskConical, Syringe, Thermometer, 
  ClipboardList, Building2 
} from 'lucide-react';

const iconMap = {
  'Heart': Heart,
  'Activity': Activity,
  'Bed': Bed,
  // ... etc
};
```

---

## Performance Considerations

1. **Caching**: Response should be cached for `refreshInterval` seconds
2. **Compression**: Enable gzip compression for response
3. **Response Size**: Typical response size ~5-10 KB (uncompressed)
4. **Response Time**: Target < 200ms for optimal UX

---

## Sample cURL Request

```bash
curl -X GET "https://api.example.com/api/v1/landing-page" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Changelog

### Version 1.0 (2025-12-11)
- Initial API specification
- Defined all data structures for landing page
- Added validation rules and error responses
