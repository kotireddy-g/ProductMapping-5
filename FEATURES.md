# Procurement Model - Feature Documentation

## Overview
A sophisticated procurement management system designed for hospitality businesses (hotels, restaurants) that tracks product consumption patterns and applies Reinforcement Learning-based labeling for intelligent inventory management.

---

## 1. Product Journey Module

### Global Search
- **Location**: Top of the application
- **Functionality**: Search across all products, categories, locations, and establishments
- **Features**:
  - Real-time search filtering
  - Clear button to reset search
  - Search icon indicator

### Advanced Filtering System
Located in the Filter Panel with four main controls:

#### View Type Filter
- All Products
- Individual Product
- Product Category
- Functions
- Restaurants
- Hotels
- Areas

#### Category Filter
- Fresh Produce
- Dairy
- Meat & Poultry
- Beverages
- Pantry Items
- Frozen Foods
- Bakery
- Spices & Condiments

#### Location/Area Filter
- Downtown Hotel
- Airport Restaurant
- Beach Resort
- City Center Cafe
- Suburban Hotel
- Fine Dining
- Fast Casual
- Rooftop Bar

#### Quick Stats
- Displays total active products (247)
- Shows scope (across all locations)

### Product Navigation
- **Previous/Next Buttons**: Navigate through filtered products
- **Product Counter**: Shows current position (e.g., "1 of 20")
- **Product Information**:
  - Product name and category
  - Location
  - SKU
  - Unit of measurement
  - Status badge
  - Last updated timestamp

### Performance Metrics Display
Six timeframe columns showing consumption analysis:

#### Hourly
- Consumed amount
- Expected amount
- Variance (positive/negative)
- Status badge (Over/Under/Normal)
- Progress bar

#### Daily
- Same metrics as Hourly
- Aggregated daily data

#### Weekly
- Weekly consumption patterns
- Weekly expected consumption
- Variance analysis

#### Monthly
- Monthly aggregated metrics
- Trend indicators

#### Quarterly
- Quarterly performance summary
- Seasonal patterns

#### Yearly
- Annual consumption trends
- Year-over-year comparisons

### Status Indicators
- **Green Badge**: Normal consumption (within 80-120% of expected)
- **Yellow Badge**: Under consumed (below 80% of expected)
- **Red Badge**: Over consumed (above 120% of expected)

---

## 2. Bouncing Bubbles Visualization

### Interactive Animation
- **Canvas**: SVG-based animated visualization
- **Physics**: Bubbles bounce off walls with realistic physics
- **Update Rate**: 50ms refresh rate for smooth animation

### Bubble Properties
- **Size**: 40-100px diameter (varies by product)
- **Color Coding**:
  - Green: Normal consumption
  - Yellow: Under-consumed
  - Red: Over-consumed
- **Labels**: Single letter representing timeframe (H, D, W, M, Q, Y)
- **Status Label**: Text below bubble showing consumption status

### Interactive Features
- **Hover Effect**: Bubbles increase opacity on hover
- **Click Action**: Opens detail drawer for comprehensive analysis
- **Legend**: Shows color meaning at bottom of visualization

### Visual Elements
- Bubble shadow for depth
- Highlight reflection on bubble surface
- Smooth transitions and animations

---

## 3. Detail Drawer (Right Panel)

### Header Section
- Product name
- Category and location
- Close button (X)
- Gradient background (blue theme)

### Performance Summary Cards
Four metric cards displaying:

1. **Average Consumption**
   - Shows mean consumption across timeframe
   - Blue gradient background
   - Unit display

2. **Max Consumption**
   - Highest consumption recorded
   - Green gradient background
   - Unit display

3. **Min Consumption**
   - Lowest consumption recorded
   - Yellow gradient background
   - Unit display

4. **Anomalies**
   - Count of over-consumption instances
   - Red gradient background
   - Helps identify problem areas

### Consumption Status Section
Three status cards showing:

1. **Over Consumed**
   - Count of instances
   - Red alert icon
   - Red background

2. **Under Consumed**
   - Count of instances
   - Trending down icon
   - Yellow background

3. **Normal**
   - Count of instances
   - Trending up icon
   - Green background

### Trend Analysis
- **Timeframe Selector**: Buttons for Hourly, Daily, Weekly, Monthly
- **Default View**: Daily timeframe

### Charts

#### Expected vs Actual Consumption Chart
- **Type**: ComposedChart with Area and Line
- **X-Axis**: Time periods (24 hours)
- **Y-Axis**: Consumption quantity
- **Expected Line**: Blue area showing baseline expectation
- **Actual Line**: Red line showing real consumption
- **Features**:
  - Interactive tooltip on hover
  - Legend showing both series
  - Smooth animations
  - Grid lines for reference

#### Deviation from Expected Chart
- **Type**: AreaChart
- **Shows**: Difference between actual and expected
- **Color**: Red area indicating deviation
- **Purpose**: Visualize anomalies and variance
- **Features**:
  - Positive deviations (over-consumption)
  - Negative deviations (under-consumption)
  - Clear visualization of problem areas

### Product Details Section
Displays metadata in organized rows:
- SKU
- Category
- Location
- Unit of measurement
- Status badge (Active)

---

## 4. Product Labeling (RL) Module

### Overview
Review and manage products labeled by the Reinforcement Learning system.

### Statistics Dashboard
Four stat cards showing:
1. **Total Products**: All products in RL system
2. **Pending Review**: Products awaiting approval
3. **Approved**: Successfully approved labels
4. **Rejected**: Rejected labels

### Filter Tabs
- **All**: Show all products
- **Pending**: Only pending review
- **Approved**: Only approved products
- **Rejected**: Only rejected products

### Product Card Layout
Each product displays:

#### Left Section (Product Information)
- **Status Icon**: Visual indicator of status
- **Product Name**: Bold heading
- **Category**: Subheading
- **Details Grid**:
  - SKU
  - Confidence score (0-100%)
  - Suggested label
  - Status badge
- **RL Analysis**: Description of why RL suggested this label
- **Metadata**: Creation and update timestamps

#### Right Section (Actions)

**For Pending Products:**
- **Approve Button**: Green, with checkmark icon
- **Reject Button**: Red, with X icon
- **Update Button**: Blue, with edit icon

**For Approved/Rejected Products:**
- **Edit Button**: Blue, with edit icon

### Product Card Colors
- **Pending**: Yellow background (bg-yellow-50)
- **Approved**: Green background (bg-green-50)
- **Rejected**: Red background (bg-red-50)

### Edit Modal
Modal dialog for updating product labels:
- **Product Name Field**: Text input
- **Label Field**: Text input for suggested label
- **Notes Field**: Textarea for detailed notes
- **Cancel Button**: Dismiss without saving
- **Save Button**: Persist changes

### RL Analysis Features
- **Confidence Score**: Shows how confident the RL model is
- **Suggested Label**: Proposed label from RL system
- **Description**: Detailed explanation of RL reasoning
- **Status Tracking**: Shows approval/rejection history

---

## 5. User Interface Features

### Header
- **Title**: "Procurement Model"
- **Subtitle**: "Hospitality Product Management & Labeling"
- **RLHL Badge**: Shows "Reinforcement Learning Hospitality Labeling"

### Tab Navigation
- **Product Journey Tab**: Main product tracking interface
- **Product Labeling Tab**: RL label review interface
- **Active Indicator**: Blue underline on active tab

### Color Scheme
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#eab308)
- **Danger**: Red (#ef4444)
- **Background**: Light slate (#f8fafc)
- **Text**: Dark slate (#0f172a)

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: 2-column grid
- **Desktop**: Full multi-column layout
- **Drawer**: Full width on mobile, 50% on tablet, 50% on desktop

### Interactive Elements
- **Buttons**: Hover effects, transitions
- **Inputs**: Focus states with blue ring
- **Cards**: Shadow and border styling
- **Icons**: Lucide React icons throughout

---

## 6. Data Structure

### Product Object
```javascript
{
  id: number,
  name: string,
  sku: string,
  category: string,
  location: string,
  unit: string,
  consumption: number,
  expectedConsumption: number
}
```

### RL Product Object
```javascript
{
  id: number,
  name: string,
  sku: string,
  category: string,
  suggestedLabel: string,
  confidence: number (0-100),
  status: 'pending' | 'approved' | 'rejected',
  description: string,
  createdAt: string,
  updatedAt: string
}
```

### Performance Metrics
```javascript
{
  consumption: number,
  expected: number,
  status: 'over' | 'under' | 'normal',
  variance: number
}
```

---

## 7. Key Workflows

### Workflow 1: Monitor Product Performance
1. Open application (defaults to Product Journey)
2. Use global search to find product
3. Apply filters for category/location
4. Navigate through products
5. View performance metrics across timeframes
6. Observe bouncing bubbles for quick status

### Workflow 2: Analyze Product Details
1. Click on any bubble or product
2. Right drawer opens with detailed analysis
3. View performance summary metrics
4. Review consumption status breakdown
5. Select timeframe for trend analysis
6. Examine expected vs actual charts
7. Analyze deviation patterns
8. Review product metadata

### Workflow 3: Approve/Reject RL Labels
1. Switch to "Product Labeling (RL)" tab
2. View products with RL-suggested labels
3. Filter by status (pending, approved, rejected)
4. Review RL analysis and confidence score
5. Click Approve, Reject, or Update
6. For Update: Edit label and notes in modal
7. Save changes

### Workflow 4: Search and Filter
1. Use global search for quick product lookup
2. Combine with category filter for specific types
3. Use location filter for specific establishments
4. Use view type filter for different perspectives
5. Navigate results with prev/next buttons

---

## 8. Performance Indicators

### Consumption Status
- **Normal**: 80-120% of expected consumption
- **Under Consumed**: Below 80% of expected
- **Over Consumed**: Above 120% of expected

### Confidence Levels (RL)
- **90-100%**: Very high confidence
- **80-89%**: High confidence
- **70-79%**: Medium confidence
- **Below 70%**: Low confidence

### Variance Calculation
- **Positive Variance**: Actual > Expected (over-consumption)
- **Negative Variance**: Actual < Expected (under-consumption)
- **Zero Variance**: Actual = Expected (perfect match)

---

## 9. Future Enhancement Opportunities

- Real-time data integration with POS systems
- Advanced analytics and reporting
- Multi-user collaboration features
- Custom alert thresholds
- Export to CSV/PDF
- Mobile app version
- API integration
- Machine learning model training
- Predictive analytics
- Inventory optimization recommendations
