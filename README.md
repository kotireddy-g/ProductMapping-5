# Procurement Model - Hospitality

A comprehensive procurement management system for hospitality businesses (hotels, restaurants) with product labeling using Reinforcement Learning (RLHL concept).

## Features

### 1. Product Journey
- **Global Search**: Search products, categories, locations, or establishments
- **Advanced Filtering**:
  - View by: All Products, Individual Product, Product Category, Functions, Restaurants, Hotels, Areas
  - Filter by Category: Fresh Produce, Dairy, Meat & Poultry, Beverages, etc.
  - Filter by Location: Multiple hospitality establishments
- **Product Performance Tracking**:
  - Hourly, Daily, Weekly, Monthly, Quarterly, Yearly metrics
  - Real-time consumption vs. expected consumption comparison
  - Status indicators: Over Consumed (Red), Normal (Green), Under Consumed (Yellow)

### 2. Bouncing Bubbles Visualization
- Interactive animated bubbles representing product performance across timeframes
- Color-coded status indicators
- Click to view detailed analysis

### 3. Detail Drawer
- Comprehensive product performance analysis
- Trend graphs showing:
  - Expected vs. Actual consumption line chart
  - Deviation analysis with color-coded areas
- Performance metrics:
  - Average, Max, Min consumption
  - Anomaly detection
  - Consumption status breakdown
- Product details and metadata

### 4. Product Labeling (RL)
- Review products labeled by Reinforcement Learning system
- Actions: Approve, Reject, Update
- Status tracking: Pending, Approved, Rejected
- Confidence scores for each label
- Batch operations and filtering

## Technology Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **Charts & Visualization**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Create React App

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── SearchBar.js              # Global search component
│   ├── FilterPanel.js            # Filter controls
│   ├── ProductJourney.js         # Main product view
│   ├── PerformanceMetrics.js     # Timeframe metrics display
│   ├── BouncingBubbles.js        # Animated bubble visualization
│   ├── DetailDrawer.js           # Side panel with detailed analysis
│   └── ProductLabelingPanel.js   # RL product labeling interface
├── data/
│   └── mockData.js               # Mock data for products and RL labels
├── App.js                        # Main application component
├── index.js                      # Entry point
└── index.css                     # Global styles
```

## Usage

### Viewing Product Journey

1. Open the application
2. Use the global search to find specific products
3. Select filters for view type, category, and location
4. Navigate through products using arrow buttons
5. View performance metrics across different timeframes
6. Observe bouncing bubbles showing real-time status

### Analyzing Product Details

1. Click on any bubble or product
2. Right-side drawer opens with detailed analysis
3. View trend graphs and deviation charts
4. Review performance statistics
5. Check product metadata

### Managing Product Labels

1. Switch to "Product Labeling (RL)" tab
2. View products suggested by RL system
3. Filter by status: Pending, Approved, Rejected
4. Approve, reject, or update product labels
5. Track confidence scores and RL analysis

## Mock Data

The application includes mock data for:
- 20 products across 8 categories
- 8 hospitality locations
- 10 RL-labeled products with different statuses

## Color Coding

- **Green**: Normal consumption (within expected range)
- **Yellow**: Under consumed (below 80% of expected)
- **Red**: Over consumed (above 120% of expected)

## Features in Detail

### Performance Metrics
Each timeframe shows:
- Actual consumption
- Expected consumption
- Variance (positive/negative)
- Status badge
- Progress bar visualization

### Trend Analysis
- 24-hour consumption data
- Expected vs. actual comparison
- Deviation visualization
- Statistical summaries

### RL Labeling System
- Confidence scores (0-100%)
- Suggested labels for products
- Status tracking
- Batch approval/rejection
- Edit capabilities

## Future Enhancements

- Real-time data integration
- Advanced analytics and reporting
- Multi-user collaboration
- Custom alert thresholds
- Export functionality
- Mobile app version
- API integration with POS systems

## License

MIT

## Support

For issues or feature requests, please contact the development team.
