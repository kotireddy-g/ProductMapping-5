# ExperienceFlow Hospital Pharmacy Procurement Platform

## Overview
ExperienceFlow is a comprehensive Hospital Pharmacy Procurement Intelligence platform featuring advanced medicine tracking, OTIF performance analytics, AI-powered product labeling, and forecast management. Designed for Monday manager meetings with professional visualizations and consistent synthetic data.

## Project Status
- **Current State**: Fully functional React application ready for demo
- **Last Updated**: December 5, 2024
- **Demo Ready**: Yes - Pre-filled login credentials for quick demo access

## Technology Stack
- **Frontend Framework**: React 18.2.0
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Styling**: Tailwind CSS 3.3.0
- **Charts & Visualization**: 
  - Recharts 2.10.3
  - D3.js 7.8.5 (Animated chord diagrams)
- **Icons**: Lucide React 0.263.1
- **CSS Processing**: PostCSS 8.4.31, Autoprefixer 10.4.16

## Project Architecture

### Directory Structure
```
src/
├── components/
│   ├── Auth/              # Login (with demo access) and Signup
│   ├── Dashboard/         # Main dashboard components
│   │   ├── MainDashboard.js       # 3-section tabbed dashboard
│   │   ├── OTIFSection.js         # OTIF metrics and chord diagram
│   │   ├── LabelsSection.js       # Medicine labels management
│   │   ├── ForecastSection.js     # Forecast overview
│   │   ├── AnimatedChordDiagram.js # D3 animated visualization
│   │   ├── ProductJourneyScreen.js # Circuit flow visualization
│   │   └── RCAScreen.js           # Root Cause Analysis
│   ├── Layout/            # Header, NotificationPanel, UploadModal
│   ├── ForecastReview/    # Detailed forecast adjustment
│   └── [Legacy screens]/  # Previous screen components
├── data/
│   └── unifiedPharmaData.js  # Centralized synthetic data
├── utils/                 # Utility functions
├── App.js                # Main application with routing
├── index.js              # Entry point
└── index.css             # Global styles with Tailwind
```

### Key Features

#### 1. Three-Section Dashboard
- **OTIF Section**: On-Time In-Full metrics, animated chord diagram, OTIF reasons table, 4 KPI cards
- **Labels Section**: 7 core medicine labels with sub-labels, label performance KPIs
- **Forecast Section**: Medicine category cards, forecast accuracy metrics, 4 KPI cards

#### 2. Product Journey Visualization
- Animated canvas-based circuit flow
- Real-time particle animations
- Category-specific data (Cardiac, Emergency, Antibiotics, Surgical)
- Distribution and consumption nodes

#### 3. Root Cause Analysis (RCA)
- Context-aware causes and recommendations
- Supports OTIF reason drill-down (Supplier Delay, Transportation, Stock Unavailability, etc.)
- Supports label-specific analysis
- Priority matrix visualization

#### 4. Interactive Chord Diagram
- D3-based animated connections
- Left side: Medicine categories (6 categories, 1,630 total items)
- Right side: Hierarchical hospital departments (3 levels)
- Drill-down navigation with breadcrumbs

#### 5. Notifications & Uploads
- Categorized notification panel (Critical, Warning, Info)
- Upload Forecast modal with file selection

## Demo Access
- **Email**: admin@hospital.com
- **Password**: password123
- **Quick Demo Button**: One-click access to dashboard

## Data Structure

### Medicine Categories (Total: 1,630 items)
1. Emergency Medicines: 350 items
2. OT Medicines: 180 items
3. Ward Medicines: 420 items
4. Daycare Medicines: 95 items
5. General Medicines: 510 items
6. Implant Medicines: 75 items

### Hospital Departments (Hierarchical)
- Level 1: 8 main departments
- Level 2: Sub-departments per main department
- Level 3: Specific units/areas

### OTIF Metrics
- Overall OTIF: 92.4%
- On-Time Delivery: 94.2%
- In-Full Delivery: 93.8%
- Perfect Order Rate: 89.6%

## Replit Configuration

### Environment Variables
- `PORT`: 5000
- `HOST`: 0.0.0.0
- `DANGEROUSLY_DISABLE_HOST_CHECK`: true

### Workflow
- **Name**: Start application
- **Command**: `npm start`
- **Port**: 5000
- **Output Type**: webview

### Deployment
- **Type**: static
- **Build Command**: `npm run build`
- **Public Directory**: build

## Recent Changes
- **December 5, 2024 (Latest)**:
  - Fixed ProductJourneyScreen to respect passed category drill-down
  - Added context-aware RCA data with comprehensive cause/recommendation mappings
  - Updated chord diagram to use consistent data connections
  - Added Quick Demo Access button to login
  - Pre-filled demo credentials for fast access
  - Fixed ForecastReviewPage useEffect dependency warning

- **December 5, 2024 (Initial)**:
  - Initial import and Replit environment setup
  - Created unified synthetic data structure
  - Built 3-section dashboard architecture
  - Implemented all core visualizations

## Known ESLint Warnings
- Unused imports/variables (non-critical)
- These don't affect functionality

## Scripts
- `npm start` - Development server on port 5000
- `npm run build` - Production build
- `npm test` - Run tests

## Color Coding System
- **Green**: Good performance (>=90%)
- **Yellow**: Medium/Warning (80-90%)
- **Red**: Critical (<80%)
