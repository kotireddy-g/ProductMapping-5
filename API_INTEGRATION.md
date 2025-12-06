# API Integration Guide

## Overview
This document provides guidelines for integrating real backend APIs with the Procurement Model application.

---

## Current State
The application currently uses **mock data** from `src/data/mockData.js`. To connect to a real backend, follow the integration patterns below.

---

## API Endpoints Required

### 1. Products API

#### Get All Products
```
GET /api/products
Query Parameters:
  - category: string (optional)
  - location: string (optional)
  - search: string (optional)
  - limit: number (optional, default: 100)
  - offset: number (optional, default: 0)

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Fresh Tomatoes",
      "sku": "SKU-001",
      "category": "Fresh Produce",
      "location": "Downtown Hotel",
      "unit": "kg",
      "consumption": 120,
      "expectedConsumption": 100
    }
  ],
  "total": 20,
  "page": 1
}
```

#### Get Product by ID
```
GET /api/products/:id

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Get Product Performance
```
GET /api/products/:id/performance
Query Parameters:
  - timeframe: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  - startDate: ISO string (optional)
  - endDate: ISO string (optional)

Response:
{
  "success": true,
  "data": {
    "productId": 1,
    "timeframe": "daily",
    "metrics": [
      {
        "time": "2024-11-24",
        "consumed": 120,
        "expected": 100,
        "variance": 20,
        "status": "over"
      }
    ]
  }
}
```

### 2. RL Products API

#### Get RL Labeled Products
```
GET /api/rl-products
Query Parameters:
  - status: 'pending' | 'approved' | 'rejected' (optional)
  - limit: number (optional, default: 50)
  - offset: number (optional, default: 0)

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Fresh Tomatoes",
      "sku": "SKU-001",
      "category": "Fresh Produce",
      "suggestedLabel": "Perishable - High Priority",
      "confidence": 92,
      "status": "pending",
      "description": "...",
      "createdAt": "2024-11-24T10:30:00Z",
      "updatedAt": "2024-11-24T10:30:00Z"
    }
  ],
  "total": 10,
  "page": 1
}
```

#### Update RL Product Status
```
POST /api/rl-products/:id/approve
Body:
{
  "approvedBy": "user_id",
  "notes": "Approved as suggested"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

```
POST /api/rl-products/:id/reject
Body:
{
  "rejectedBy": "user_id",
  "reason": "Incorrect label"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Update RL Product Label
```
PUT /api/rl-products/:id
Body:
{
  "name": "Updated Name",
  "suggestedLabel": "Updated Label",
  "description": "Updated description",
  "updatedBy": "user_id"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### 3. Categories API

#### Get All Categories
```
GET /api/categories

Response:
{
  "success": true,
  "data": [
    "Fresh Produce",
    "Dairy",
    "Meat & Poultry",
    ...
  ]
}
```

### 4. Locations API

#### Get All Locations
```
GET /api/locations

Response:
{
  "success": true,
  "data": [
    "Downtown Hotel",
    "Airport Restaurant",
    ...
  ]
}
```

---

## Implementation Steps

### Step 1: Create API Service Layer

Create `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Products
export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/products?${params}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const fetchProductPerformance = async (id, timeframe) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${id}/performance?timeframe=${timeframe}`
  );
  if (!response.ok) throw new Error('Failed to fetch performance data');
  return response.json();
};

// RL Products
export const fetchRLProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/rl-products?${params}`);
  if (!response.ok) throw new Error('Failed to fetch RL products');
  return response.json();
};

export const approveRLProduct = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/rl-products/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to approve product');
  return response.json();
};

export const rejectRLProduct = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/rl-products/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to reject product');
  return response.json();
};

export const updateRLProduct = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/rl-products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
};

// Categories & Locations
export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchLocations = async () => {
  const response = await fetch(`${API_BASE_URL}/locations`);
  if (!response.ok) throw new Error('Failed to fetch locations');
  return response.json();
};
```

### Step 2: Update Components to Use API

Example: Update `ProductJourney.js`:

```javascript
import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';

function ProductJourney({ filterType, selectedCategory, selectedLocation, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const filters = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          location: selectedLocation !== 'all' ? selectedLocation : undefined,
          search: searchQuery || undefined,
        };
        
        const response = await fetchProducts(filters);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, selectedLocation, searchQuery]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Rest of component...
}
```

### Step 3: Add Error Handling

Create `src/hooks/useApi.js`:

```javascript
import { useState, useEffect } from 'react';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiFunction();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};
```

### Step 4: Configure Environment Variables

Create `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=30000
REACT_APP_ENABLE_MOCK_DATA=false
```

### Step 5: Add Loading & Error States

Update components to show:
- Loading spinners
- Error messages
- Retry buttons
- Empty states

---

## Authentication

### Add JWT Token Support

Update `src/services/api.js`:

```javascript
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/products?${params}`, {
    headers: getAuthHeaders(),
  });
  // ...
};
```

### Login Endpoint

```
POST /api/auth/login
Body:
{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

---

## Error Handling

### Standard Error Response

```javascript
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 999 not found",
    "statusCode": 404
  }
}
```

### Handle Errors in Components

```javascript
const handleError = (error) => {
  if (error.statusCode === 401) {
    // Redirect to login
    window.location.href = '/login';
  } else if (error.statusCode === 403) {
    // Show permission denied
    showNotification('Permission denied');
  } else {
    // Show generic error
    showNotification(error.message);
  }
};
```

---

## Caching Strategy

### Add Request Caching

```javascript
const cache = new Map();

export const fetchProductsWithCache = async (filters = {}) => {
  const cacheKey = JSON.stringify(filters);
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const data = await fetchProducts(filters);
  cache.set(cacheKey, data);
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
  
  return data;
};
```

---

## Rate Limiting

### Implement Request Throttling

```javascript
import { throttle } from 'lodash';

export const throttledSearch = throttle(
  (query) => fetchProducts({ search: query }),
  500
);
```

---

## Testing API Integration

### Mock API for Testing

```javascript
// src/services/mockApi.js
export const mockFetchProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockProductData });
    }, 500);
  });
};
```

### Use in Tests

```javascript
import * as api from '../services/api';
import * as mockApi from '../services/mockApi';

jest.mock('../services/api', () => mockApi);
```

---

## Performance Optimization

### Pagination

```javascript
export const fetchProducts = async (page = 1, limit = 20) => {
  const response = await fetch(
    `${API_BASE_URL}/products?page=${page}&limit=${limit}`
  );
  return response.json();
};
```

### Lazy Loading

```javascript
const [page, setPage] = useState(1);
const [products, setProducts] = useState([]);

const loadMore = async () => {
  const newProducts = await fetchProducts(page + 1);
  setProducts([...products, ...newProducts.data]);
  setPage(page + 1);
};
```

### Infinite Scroll

```javascript
useEffect(() => {
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadMore();
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [page]);
```

---

## Deployment Considerations

### Environment-Specific APIs

```javascript
const API_BASE_URL = {
  development: 'http://localhost:5000/api',
  staging: 'https://staging-api.example.com/api',
  production: 'https://api.example.com/api',
}[process.env.NODE_ENV];
```

### CORS Configuration

Backend should allow:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Monitoring & Logging

### Add Request Logging

```javascript
export const fetchWithLogging = async (url, options = {}) => {
  console.log(`[API] ${options.method || 'GET'} ${url}`);
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, options);
    const duration = performance.now() - startTime;
    console.log(`[API] Response in ${duration.toFixed(2)}ms`);
    return response;
  } catch (error) {
    console.error(`[API] Error: ${error.message}`);
    throw error;
  }
};
```

---

## Next Steps

1. Set up backend API server
2. Implement endpoints as specified
3. Update `.env` with API URL
4. Replace mock data imports with API calls
5. Add error handling and loading states
6. Test all workflows
7. Deploy to production

---

**For questions or issues, refer to the main README.md and SETUP.md files.**
