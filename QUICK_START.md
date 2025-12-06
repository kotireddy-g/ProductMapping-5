# Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Install and Run
```bash
cd /Users/exflow_koti_air/StudioProjects/ProductMapping
npm install
npm start
```

The app opens at `http://localhost:3000`

### Step 2: Explore Product Journey
1. **Search**: Use the search bar to find products (try "Tomato" or "Milk")
2. **Filter**: Select category, location, or view type
3. **Navigate**: Use arrow buttons to browse products
4. **View Metrics**: See performance across 6 timeframes
5. **Watch Bubbles**: Observe animated bubbles showing status

### Step 3: Analyze Details
1. **Click**: Click any bubble to open detail drawer
2. **Review**: Check performance summary and metrics
3. **Analyze**: View trend charts and deviation patterns
4. **Understand**: Read product details

---

## Main Features at a Glance

### 🔍 Product Journey Tab
- **Global Search**: Find any product instantly
- **Smart Filters**: Filter by category, location, view type
- **Performance Metrics**: 6 timeframe columns (Hourly to Yearly)
- **Bouncing Bubbles**: Animated visualization of product status
- **Color Coding**:
  - 🟢 Green = Normal consumption
  - 🟡 Yellow = Under-consumed
  - 🔴 Red = Over-consumed

### 📊 Detail Drawer
- **Performance Summary**: Avg, Max, Min consumption
- **Consumption Status**: Over/Under/Normal breakdown
- **Trend Charts**: Expected vs Actual consumption
- **Deviation Analysis**: Visual deviation patterns
- **Product Details**: SKU, category, location, unit

### 🏷️ Product Labeling Tab
- **Review RL Labels**: See AI-suggested product labels
- **Approve/Reject**: Manage label suggestions
- **Confidence Scores**: See how confident the AI is
- **Status Tracking**: Pending, Approved, Rejected
- **Edit Labels**: Update labels with notes

---

## Common Tasks

### Find a Specific Product
1. Click search bar at top
2. Type product name (e.g., "Tomato")
3. Results auto-filter
4. Use arrow buttons to navigate

### Check Product Performance
1. Find product using search/filters
2. Click on bouncing bubble or product card
3. Right drawer opens with full analysis
4. Review charts and metrics
5. Close drawer by clicking X or backdrop

### Approve a Product Label
1. Click "Product Labeling (RL)" tab
2. Filter by "Pending" status
3. Read RL analysis and confidence score
4. Click "Approve" button
5. Confirm action

### Reject a Product Label
1. Click "Product Labeling (RL)" tab
2. Find product to reject
3. Click "Reject" button
4. Confirm action

### Update a Product Label
1. Click "Product Labeling (RL)" tab
2. Find product to update
3. Click "Update" button
4. Edit name, label, and notes in modal
5. Click "Save"

---

## Understanding the Data

### Performance Metrics
- **Consumed**: Actual amount used in timeframe
- **Expected**: Baseline expected consumption
- **Variance**: Difference (positive = over, negative = under)
- **Status**: Green/Yellow/Red based on variance

### Consumption Status
- **Over Consumed**: Used more than 120% of expected
- **Normal**: Used 80-120% of expected
- **Under Consumed**: Used less than 80% of expected

### RL Confidence
- **90-100%**: Very high confidence - safe to approve
- **80-89%**: High confidence - likely correct
- **70-79%**: Medium confidence - review carefully
- **Below 70%**: Low confidence - consider rejecting

---

## Tips & Tricks

### 💡 Efficient Navigation
- Use keyboard arrow keys to navigate between products
- Click product counter to jump to specific product
- Use filters to narrow down products quickly

### 📈 Reading Charts
- **Blue area**: Expected consumption baseline
- **Red line**: Actual consumption
- **Red area (deviation)**: Shows anomalies
- Hover over chart for exact values

### 🎯 Filtering Strategy
1. Start with broad category filter
2. Narrow by location if needed
3. Use search for specific products
4. Combine multiple filters for precision

### ⚡ Quick Status Check
- Green bubbles = All good, no action needed
- Yellow bubbles = Monitor, may need adjustment
- Red bubbles = Investigate immediately

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Next Product | Right Arrow |
| Previous Product | Left Arrow |
| Open Search | Ctrl+F (browser) |
| Close Drawer | Escape |
| Scroll Drawer | Mouse Wheel |

---

## Troubleshooting

### App Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port 3000 in Use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
npm start
```

### Styles Not Loading
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart dev server

### Charts Not Displaying
- Check browser console for errors
- Ensure JavaScript is enabled
- Try different browser

---

## File Structure Reference

```
src/
├── App.js                    # Main app, tab switching
├── components/
│   ├── SearchBar.js         # Search functionality
│   ├── FilterPanel.js       # Filters and quick stats
│   ├── ProductJourney.js    # Main product view
│   ├── PerformanceMetrics.js # Timeframe cards
│   ├── BouncingBubbles.js   # Animated visualization
│   ├── DetailDrawer.js      # Side panel with charts
│   └── ProductLabelingPanel.js # RL label management
├── data/
│   └── mockData.js          # All mock data
└── index.css                # Tailwind styles
```

---

## Next Steps

1. **Explore the UI**: Click around and get familiar
2. **Try Filters**: Test different filter combinations
3. **Review Charts**: Understand the trend visualizations
4. **Manage Labels**: Approve/reject some RL suggestions
5. **Read Documentation**: Check FEATURES.md for details

---

## Support Resources

- **README.md**: Project overview
- **FEATURES.md**: Detailed feature documentation
- **SETUP.md**: Installation and deployment guide
- **Browser Console**: Check for error messages (F12)
- **React DevTools**: Install extension for debugging

---

## Key Statistics

- **Total Products**: 20
- **Categories**: 8
- **Locations**: 8
- **RL Products**: 10
- **Timeframes**: 6 (Hourly to Yearly)
- **Status Types**: 3 (Normal, Over, Under)

---

## Performance Notes

- ✅ Smooth animations at 50ms refresh rate
- ✅ Responsive design for all screen sizes
- ✅ Fast search and filtering
- ✅ Interactive charts with hover tooltips
- ✅ Real-time bubble physics simulation

---

**Ready to use!** Open `http://localhost:3000` and start exploring.
