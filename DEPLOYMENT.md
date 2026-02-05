# Wally - Vercel Deployment Guide

## Prerequisites
- ✅ Gemini API Key configured
- ✅ Build tested successfully
- ✅ Git repository initialized

## Quick Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variable**:
   After first deployment, add the Gemini API key:
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   ```
   Paste your API key when prompted, and select "Production", "Preview", and "Development".

5. **Redeploy** to apply environment variable:
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Dashboard

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Add Environment Variable**:
   - In project settings → Environment Variables
   - Add `VITE_GEMINI_API_KEY` with your API key
   - Select all environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

## Post-Deployment Checklist

After successful deployment:

- [ ] ✅ Visit your production URL
- [ ] ✅ Test with both Rafiq (Free) and Sarah (Pro) accounts
- [ ] ✅ Verify AI Coach works (requires Gemini API key)
- [ ] ✅ Check Budget Trends Graph (Pro only)
- [ ] ✅ Test AI Budget Insights (Pro only)
- [ ] ✅ Verify all brand logos load correctly
- [ ] ✅ Test transaction modal
- [ ] ✅ Check Year in Review feature
- [ ] ✅ Test remote name change: `?name=YourName`

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI Coach | Yes | `AIzaSy...` |

## Build Information

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite + React
- **Node Version**: 20.x (recommended)

## Known Considerations

### Dev-Only Features
These features only run in development and are automatically disabled in production:
- `/api/name` endpoint for remote name updates
- Network IP logging in terminal
- Dimension logging in browser console

### URL Parameters
- `?name=YourName` - Changes displayed user name (works in production)

### File Sizes
- Main bundle: ~984 KB (minified)
- Includes: React, Recharts, Framer Motion, Gemini AI SDK
- Consider code splitting for optimization if needed

## Troubleshooting

### AI Coach Not Working
- ✅ Check if `VITE_GEMINI_API_KEY` is set correctly in Vercel dashboard
- ✅ Verify API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- ✅ Check browser console for API errors

### Images Not Loading
- ✅ Verify all images exist in `public/` directory
- ✅ Check that paths start with `/` (e.g., `/assets/logo.png`)
- ✅ Clear browser cache

### Build Fails
- ✅ Run `npm run build` locally to reproduce
- ✅ Check that all dependencies are in `package.json`
- ✅ Ensure Node version matches (20.x recommended)

## Performance Optimization (Optional)

To reduce bundle size:

1. **Enable code splitting**:
   ```js
   // In vite.config.js
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'react-vendor': ['react', 'react-dom'],
           'charts': ['recharts'],
           'motion': ['framer-motion'],
         }
       }
     }
   }
   ```

2. **Lazy load routes**:
   ```js
   // Use React.lazy() for page components
   const ReportsPage = React.lazy(() => import('./components/reports/ReportsPage'));
   ```

## Custom Domain (Optional)

To add a custom domain:
1. Go to project settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

## Support

For issues specific to:
- **Wally app**: Check CLAUDE.md for project documentation
- **Vercel deployment**: Visit [Vercel Docs](https://vercel.com/docs)
- **Gemini API**: Visit [Google AI Studio](https://ai.google.dev/)

---

**Ready to deploy!** 🚀
