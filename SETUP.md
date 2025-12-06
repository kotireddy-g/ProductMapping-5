# Setup and Deployment Guide

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git (optional)

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

This will install all required packages:
- React 18.2.0
- Tailwind CSS 3.3.0
- Recharts 2.10.3
- Lucide React 0.263.1
- PostCSS and Autoprefixer

### 2. Start Development Server
```bash
npm start
```

The application will:
- Start on `http://localhost:3000`
- Automatically open in your default browser
- Enable hot-reload for code changes
- Show compilation warnings/errors in console

### 3. Development Workflow
- Edit files in `src/` directory
- Changes auto-reload in browser
- Check browser console for errors
- Use React DevTools browser extension for debugging

## Build for Production

### 1. Create Optimized Build
```bash
npm run build
```

This will:
- Create a `build/` directory
- Minify and optimize all assets
- Generate source maps
- Prepare for deployment

### 2. Test Production Build Locally
```bash
npm install -g serve
serve -s build
```

Then visit `http://localhost:3000` to test the production build.

## Project Structure

```
ProductMapping/
├── public/
│   └── index.html                 # Main HTML file
├── src/
│   ├── components/
│   │   ├── SearchBar.js          # Global search component
│   │   ├── FilterPanel.js        # Filter controls
│   │   ├── ProductJourney.js     # Main product view
│   │   ├── PerformanceMetrics.js # Timeframe metrics
│   │   ├── BouncingBubbles.js    # Animated bubbles
│   │   ├── DetailDrawer.js       # Side panel analysis
│   │   └── ProductLabelingPanel.js # RL labeling interface
│   ├── data/
│   │   └── mockData.js           # Mock products and RL data
│   ├── App.js                    # Main app component
│   ├── index.js                  # Entry point
│   └── index.css                 # Global styles
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── README.md                     # Project overview
├── FEATURES.md                   # Feature documentation
└── SETUP.md                      # This file
```

## Configuration Files

### package.json
- Defines project metadata
- Lists all dependencies
- Includes npm scripts

### tailwind.config.js
- Tailwind CSS configuration
- Custom color definitions
- Theme extensions

### postcss.config.js
- PostCSS plugin configuration
- Tailwind CSS integration
- Autoprefixer setup

## Available Scripts

### Development
```bash
npm start
```
Runs the app in development mode with hot-reload.

### Production Build
```bash
npm run build
```
Creates an optimized production build.

### Testing
```bash
npm test
```
Launches the test runner (when tests are added).

### Eject
```bash
npm run eject
```
**Note**: This is a one-way operation. Once you eject, you can't go back!

## Deployment Options

### Option 1: Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Deploy automatically on push

### Option 2: Vercel
1. Push code to GitHub
2. Import project to Vercel
3. Vercel auto-detects Create React App
4. Deploy with one click

### Option 3: GitHub Pages
1. Add to package.json: `"homepage": "https://yourusername.github.io/ProductMapping"`
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Run: `npm run deploy`

### Option 4: Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=0 /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build"]
```

Build and run:
```bash
docker build -t procurement-model .
docker run -p 3000:3000 procurement-model
```

### Option 5: Traditional Server (Node.js)
1. Build: `npm run build`
2. Install serve: `npm install -g serve`
3. Run: `serve -s build -l 3000`
4. Use reverse proxy (nginx/Apache) for production

## Environment Variables

Create `.env` file for environment-specific configuration:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_KEY=your_api_key_here

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_REAL_TIME_DATA=false

# Environment
REACT_APP_ENV=development
```

Access in code:
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind CSS Not Working
- Ensure `tailwind.config.js` has correct content paths
- Check that `@tailwind` directives are in `index.css`
- Rebuild: `npm run build`

### Hot Reload Not Working
- Check browser console for errors
- Restart dev server: `npm start`
- Clear browser cache (Ctrl+Shift+Delete)

## Performance Optimization

### Code Splitting
Already handled by Create React App. Components are automatically code-split.

### Image Optimization
- Use SVG for icons (Lucide React)
- Compress images before adding
- Use WebP format when possible

### Bundle Analysis
```bash
npm install --save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Dependencies**: Regularly update packages
   ```bash
   npm audit
   npm audit fix
   ```
3. **API Keys**: Store in environment variables
4. **CORS**: Configure backend for production domain
5. **HTTPS**: Always use HTTPS in production

## Monitoring and Logging

### Development
- Browser DevTools (F12)
- React DevTools extension
- Console logs

### Production
- Error tracking (Sentry, Rollbar)
- Analytics (Google Analytics, Mixpanel)
- Performance monitoring (Datadog, New Relic)

## Backup and Version Control

### Git Setup
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <repository-url>
git push -u origin main
```

### Backup Strategy
- Use GitHub/GitLab for version control
- Tag releases: `git tag -a v1.0.0 -m "Release 1.0.0"`
- Maintain changelog

## Support and Documentation

- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Recharts**: https://recharts.org
- **Lucide Icons**: https://lucide.dev
- **Create React App**: https://create-react-app.dev

## Contact and Maintenance

For issues, feature requests, or maintenance:
1. Check existing documentation
2. Review component code
3. Check browser console for errors
4. Test in development mode
5. Create detailed bug reports with steps to reproduce
