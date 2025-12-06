# ProductMapping - API Specifications

## Overview
This document contains the JSON API specifications that the UI expects from the backend for the ProductMapping project. The backend team should implement these APIs to match the exact structure provided.

---

## 1. Overview Tab APIs

### 1.1 GET /api/overview/product-flow
**Description:** Returns product flow data for the chord diagram visualization

```json
{
  "success": true,
  "data": {
    "departments": {
      "Kitchen": {
        "products": [
          {
            "id": 1,
            "name": "Fresh Vegetables",
            "category": "fast",
            "flow": 45,
            "cost": 5000,
            "revenue": 15000,
            "margin": 67,
            "status": "normal",
            "expiryDays": 3,
            "consumption": "normal"
          },
          {
            "id": 2,
            "name": "Meat & Poultry",
            "category": "fast",
            "flow": 38,
            "cost": 12000,
            "revenue": 35000,
            "margin": 66,
            "status": "over-consumed",
            "expiryDays": 2,
            "consumption": "high"
          }
        ]
      },
      "Bar": {
        "products": [
          {
            "id": 3,
            "name": "Beer & Wine",
            "category": "fast",
            "flow": 50,
            "cost": 8000,
            "revenue": 28000,
            "margin": 71,
            "status": "normal",
            "expiryDays": 365,
            "consumption": "high"
          }
        ]
      },
      "Restaurant": {
        "products": [
          {
            "id": 4,
            "name": "Table Linens",
            "category": "fast",
            "flow": 30,
            "cost": 2000,
            "revenue": 0,
            "margin": 0,
            "status": "normal",
            "expiryDays": 365,
            "consumption": "normal"
          }
        ]
      },
      "Room Service": {
        "products": [
          {
            "id": 5,
            "name": "Breakfast Items",
            "category": "fast",
            "flow": 35,
            "cost": 4000,
            "revenue": 14000,
            "margin": 71,
            "status": "normal",
            "expiryDays": 3,
            "consumption": "normal"
          }
        ]
      },
      "Banquet": {
        "products": [
          {
            "id": 6,
            "name": "Buffet Supplies",
            "category": "fast",
            "flow": 25,
            "cost": 5000,
            "revenue": 20000,
            "margin": 75,
            "status": "normal",
            "expiryDays": 7,
            "consumption": "normal"
          }
        ]
      },
      "Storage": {
        "products": [
          {
            "id": 7,
            "name": "Dry Goods",
            "category": "fast",
            "flow": 40,
            "cost": 6000,
            "revenue": 0,
            "margin": 0,
            "status": "normal",
            "expiryDays": 180,
            "consumption": "normal"
          }
        ]
      }
    },
    "metadata": {
      "lastUpdated": "2024-11-28T10:30:00Z",
      "totalProducts": 31,
      "totalDepartments": 6
    }
  }
}
```

**Field Definitions:**
- `category`: "fast" | "medium" | "slow" | "occasional"
- `status`: "normal" | "over-consumed" | "expiry-near" | "under-consumed" | "dead-stock"
- `consumption`: "normal" | "high" | "low" | "minimal"
- `flow`: Daily units consumed
- `cost`: Total cost in currency units
- `revenue`: Total revenue in currency units
- `margin`: Profit margin percentage
- `expiryDays`: Days until expiry

### 1.2 GET /api/overview/financial-summary
**Description:** Returns aggregated financial metrics for the dashboard

```json
{
  "success": true,
  "data": {
    "totalCost": 112000,
    "totalRevenue": 369000,
    "totalProfit": 257000,
    "profitMargin": 69.6,
    "currency": "USD",
    "period": "current_month",
    "lastUpdated": "2024-11-28T10:30:00Z"
  }
}
```

### 1.3 GET /api/overview/category-stats
**Description:** Returns product count statistics by category and status

```json
{
  "success": true,
  "data": {
    "movementSpeed": {
      "fast": 18,
      "medium": 7,
      "slow": 4,
      "occasional": 2
    },
    "businessImpact": {
      "overConsumed": 5,
      "expiryNear": 5,
      "underConsumed": 5,
      "deadStock": 5,
      "normal": 11
    },
    "totalProducts": 31,
    "lastUpdated": "2024-11-28T10:30:00Z"
  }
}
```

---

## 2. Product Journey APIs

### 2.1 GET /api/products
**Description:** Returns all products with filtering capabilities

**Query Parameters:**
- `category`: Filter by category (optional)
- `location`: Filter by location (optional)
- `search`: Search by name or category (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Fresh Tomatoes",
        "sku": "SKU-001",
        "category": "Fresh Produce",
        "location": "Downtown Hotel",
        "unit": "kg",
        "consumption": 120,
        "expectedConsumption": 100,
        "variance": 20,
        "status": "over",
        "lastUpdated": "2024-11-28T10:30:00Z"
      },
      {
        "id": 2,
        "name": "Organic Lettuce",
        "sku": "SKU-002",
        "category": "Fresh Produce",
        "location": "Airport Restaurant",
        "unit": "bunch",
        "consumption": 85,
        "expectedConsumption": 100,
        "variance": -15,
        "status": "under",
        "lastUpdated": "2024-11-28T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    },
    "filters": {
      "categories": [
        "Fresh Produce",
        "Dairy",
        "Meat & Poultry",
        "Beverages",
        "Pantry Items",
        "Frozen Foods",
        "Bakery",
        "Spices & Condiments"
      ],
      "locations": [
        "Downtown Hotel",
        "Airport Restaurant",
        "Beach Resort",
        "City Center Cafe",
        "Suburban Hotel",
        "Fine Dining",
        "Fast Casual",
        "Rooftop Bar"
      ]
    }
  }
}
```

### 2.2 GET /api/products/{id}/performance
**Description:** Returns detailed performance metrics for a specific product

**Query Parameters:**
- `timeframe`: "hourly" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly"

```json
{
  "success": true,
  "data": {
    "productId": 1,
    "timeframe": "daily",
    "metrics": {
      "consumption": 120,
      "expected": 100,
      "variance": 20,
      "status": "over",
      "performanceScore": 85
    },
    "timeSeriesData": [
      {
        "date": "2024-11-28",
        "consumption": 120,
        "expected": 100,
        "variance": 20
      },
      {
        "date": "2024-11-27",
        "consumption": 115,
        "expected": 100,
        "variance": 15
      }
    ],
    "summary": {
      "avgConsumption": 118,
      "maxConsumption": 125,
      "minConsumption": 95,
      "totalDays": 30
    }
  }
}
```

---

## 3. Product Labeling APIs

### 3.1 GET /api/rl-products
**Description:** Returns products with RL-suggested labels

**Query Parameters:**
- `status`: "pending" | "approved" | "rejected" (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Fresh Tomatoes",
        "sku": "SKU-001",
        "category": "Fresh Produce",
        "suggestedLabel": "Perishable - High Priority",
        "confidence": 92,
        "status": "pending",
        "description": "RL model suggests this product requires high-priority handling due to perishability and high consumption variance. Recommended for daily inventory checks.",
        "createdAt": "2024-11-24T10:30:00Z",
        "updatedAt": "2024-11-24T10:30:00Z",
        "reviewedBy": null,
        "reviewedAt": null
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    },
    "stats": {
      "pending": 15,
      "approved": 8,
      "rejected": 2,
      "total": 25
    }
  }
}
```

### 3.2 PUT /api/rl-products/{id}/status
**Description:** Update the status of an RL-suggested product label

**Request Body:**
```json
{
  "status": "approved",
  "reviewedBy": "user123",
  "comments": "Label approved after review"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "approved",
    "reviewedBy": "user123",
    "reviewedAt": "2024-11-28T10:30:00Z",
    "comments": "Label approved after review"
  }
}
```

### 3.3 PUT /api/rl-products/{id}/label
**Description:** Update the suggested label for a product

**Request Body:**
```json
{
  "suggestedLabel": "Perishable - Medium Priority",
  "updatedBy": "user123",
  "reason": "Adjusted based on recent consumption patterns"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "suggestedLabel": "Perishable - Medium Priority",
    "updatedBy": "user123",
    "updatedAt": "2024-11-28T10:30:00Z",
    "reason": "Adjusted based on recent consumption patterns"
  }
}
```

---

## 4. Common Data Structures

### 4.1 Product Object (Complete)
```json
{
  "id": 1,
  "name": "Fresh Tomatoes",
  "sku": "SKU-001",
  "category": "Fresh Produce",
  "location": "Downtown Hotel",
  "department": "Kitchen",
  "unit": "kg",
  "consumption": 120,
  "expectedConsumption": 100,
  "variance": 20,
  "status": "over",
  "flow": 45,
  "cost": 5000,
  "revenue": 15000,
  "margin": 67,
  "expiryDays": 3,
  "consumptionLevel": "high",
  "businessStatus": "over-consumed",
  "lastUpdated": "2024-11-28T10:30:00Z",
  "createdAt": "2024-11-20T08:00:00Z"
}
```

### 4.2 Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 123 not found",
    "details": {
      "requestId": "req-123456",
      "timestamp": "2024-11-28T10:30:00Z"
    }
  }
}
```

---

## 5. Authentication & Headers

### Required Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
X-API-Version: v1
```

### Rate Limiting
- 1000 requests per hour per user
- 100 requests per minute per endpoint

---

## 6. Status Codes

- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## 7. Filtering & Search

### Common Query Parameters
- `search`: Text search across name, sku, category
- `category`: Filter by product category
- `location`: Filter by location
- `department`: Filter by department
- `status`: Filter by status
- `dateFrom`: Filter from date (ISO 8601)
- `dateTo`: Filter to date (ISO 8601)
- `sortBy`: Sort field (name, cost, revenue, etc.)
- `sortOrder`: "asc" | "desc"
- `page`: Page number (1-based)
- `limit`: Items per page (max 100)

### Example Filter Request
```
GET /api/products?category=Fresh%20Produce&location=Downtown%20Hotel&status=over&sortBy=consumption&sortOrder=desc&page=1&limit=20
```

---

## 8. Real-time Updates (WebSocket)

### Connection
```
ws://localhost:8080/ws/products
```

### Message Format
```json
{
  "type": "PRODUCT_UPDATE",
  "data": {
    "productId": 1,
    "field": "consumption",
    "oldValue": 120,
    "newValue": 125,
    "timestamp": "2024-11-28T10:30:00Z"
  }
}
```

---

## Notes for Backend Team

1. **Data Consistency**: Ensure all counts and totals are consistent across different endpoints
2. **Performance**: Implement caching for frequently accessed data (financial summaries, category stats)
3. **Validation**: Validate all enum values (category, status, consumption levels)
4. **Timestamps**: Use ISO 8601 format for all timestamps
5. **Pagination**: Implement cursor-based pagination for large datasets
6. **Monitoring**: Add logging for all API calls and performance metrics
7. **Testing**: Provide test data that matches the UI expectations exactly

**Contact**: For any questions about these specifications, please reach out to the frontend team.
