# 🚀 Deployment Guide for AI Model Comparison Platform

This guide will help you deploy your AI Model Comparison Platform to various hosting services.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- All dependencies installed (`npm install`)

## 🎯 Deployment Options

### 1. GitHub Pages (Recommended for Open Source)

#### Setup GitHub Pages
1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"

#### Automatic Deployment
The platform is configured with GitHub Actions for automatic deployment:
- Push to `main` branch triggers build
- Builds are automatically deployed to GitHub Pages
- Available at: `https://yourusername.github.io/AI_FIESTA`

#### Manual Deployment
```bash
# Build the project
npm run build

# The build output will be in the `out/` directory
# This directory is automatically deployed by GitHub Actions
```

### 2. Vercel (Recommended for Production)

#### Quick Deploy
1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect Next.js and deploy

#### Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to configure your project
```

#### Environment Variables
No additional environment variables required for basic deployment.

### 3. Netlify

#### Quick Deploy
1. Visit [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `out`

#### Manual Deploy
```bash
# Build the project
npm run build

# Deploy the `out` directory to Netlify
# You can drag and drop the `out` folder to Netlify's deploy area
```

## 🔧 Build Configuration

### Next.js Configuration
The platform is configured for static export in `next.config.js`:
- `output: 'export'` - Enables static site generation
- `trailingSlash: true` - Required for GitHub Pages
- `basePath: '/AI_FIESTA'` - Matches your repository name

### Build Scripts
```json
{
  "scripts": {
    "build": "next build",
    "export": "next build && next export",
    "deploy": "npm run build && touch out/.nojekyll"
  }
}
```

## 📁 Build Output

After running `npm run build`, the following structure is generated:
```
out/
├── _next/
├── index.html
├── .nojekyll
└── ... (other static files)
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Fails
```bash
# Clear cache and reinstall dependencies
rm -rf .next node_modules
npm install
npm run build
```

#### 2. GitHub Pages Not Working
- Ensure `.nojekyll` file exists in `out/` directory
- Check GitHub Actions workflow is running
- Verify repository settings for Pages

#### 3. Routing Issues
- Ensure `trailingSlash: true` in Next.js config
- Check `basePath` matches your repository name

#### 4. Charts Not Rendering
- Verify Recharts library is properly imported
- Check browser console for JavaScript errors
- Ensure all dependencies are installed

### Performance Optimization

#### 1. Bundle Size
- The platform uses dynamic imports for charts
- Tailwind CSS is purged in production
- Images are optimized for static export

#### 2. Loading Speed
- Static export ensures fast loading
- Charts are loaded on-demand
- Responsive design for mobile optimization

## 🔄 Continuous Deployment

### GitHub Actions
The workflow automatically:
1. Builds the project on every push
2. Runs tests (if configured)
3. Deploys to GitHub Pages
4. Handles build caching

### Manual Triggers
```bash
# Force rebuild and deploy
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

## 📱 Mobile Optimization

The platform is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktop computers
- Touch interfaces

## 🔒 Security Considerations

- No sensitive data in client-side code
- Static export reduces attack surface
- HTTPS enforced on all platforms
- No server-side vulnerabilities

## 📊 Analytics (Optional)

To add analytics, consider:
- Google Analytics
- Plausible Analytics
- Vercel Analytics (if using Vercel)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review GitHub Actions logs
3. Verify all dependencies are correct
4. Ensure Node.js version compatibility

## 🎉 Success!

Once deployed, your AI Model Comparison Platform will be available at:
- **GitHub Pages**: `https://yourusername.github.io/AI_FIESTA`
- **Vercel**: `https://your-project.vercel.app`
- **Netlify**: `https://your-project.netlify.app`

The platform will automatically update on every push to the main branch!