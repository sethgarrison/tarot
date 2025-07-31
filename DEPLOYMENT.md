# Tarot App Deployment Guide

## Current Status ✅

The application has been successfully cleaned up and is ready for deployment:

- ✅ All console.log statements removed for production
- ✅ TypeScript compilation errors fixed
- ✅ Build process working correctly
- ✅ Application tested locally

## Pre-Deployment Checklist

### 1. Environment Variables
Make sure your Supabase environment variables are properly configured:

**For Development:**
Create a `.env` file in your project root:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**For Production:**
Set environment variables in your deployment platform (Vercel, Netlify, etc.):
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

**Note:** GitHub Pages doesn't support environment variables. For GitHub Pages deployment, consider using Vercel or Netlify instead.

### 2. Netlify Configuration
The application is configured for Netlify deployment:
- Base path: `/` (root)
- Build output: `dist/`
- Custom domain support
- Environment variables support

### 3. Image Assets
Ensure all tarot card images are in the `public/tarot-images/` directory.

## Deployment Steps

### Option 1: Deploy to Netlify (Recommended)

1. **Go to [netlify.com](https://netlify.com)** and sign up/login
2. **Click "Add new site"** → **"Import an existing project"**
3. **Connect your GitHub repository**
4. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Set environment variables** in Netlify dashboard (Site settings → Environment variables):
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
6. **Deploy** - Netlify will automatically build and deploy your app

### Option 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Import your GitHub repository**
3. **Set environment variables** in Vercel dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
4. **Deploy** - Vercel will automatically build and deploy your app

### Option 3: Deploy to GitHub Pages (Limited)

**Note:** GitHub Pages doesn't support environment variables, so Supabase functionality won't work.

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment - cleaned up logging and fixed TypeScript errors"
   git push origin main
   ```

2. **Deploy using npm script:**
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "Deploy from a branch"
   - Select "gh-pages" branch
   - Save

### Option 2: Deploy to Vercel/Netlify

1. **Connect your repository** to Vercel or Netlify
2. **Set environment variables** in the deployment platform
3. **Deploy** - the build process is already configured

## Post-Deployment Verification

1. **Check the deployed site** at `https://sethgarrison.github.io/tarot`
2. **Test all features:**
   - Card Reader (drawing cards)
   - Deck page (browsing all cards)
   - Tutorial page (learning content)
   - Card flipping and interactions
3. **Verify Supabase connection** is working in production

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Set**
   - Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured
   - Check that the variables are accessible in the deployment environment

2. **Images Not Loading**
   - Verify all tarot card images are in `public/tarot-images/`
   - Check that the image paths match the card names

3. **Build Failures**
   - Run `npm run build` locally to test
   - Check for any TypeScript errors
   - Ensure all dependencies are installed

4. **CORS Issues**
   - Verify Supabase CORS settings include your domain
   - Check that the Supabase project is properly configured

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## File Structure

```
tarot/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom hooks for data fetching
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── styles/             # CSS files
├── public/
│   └── tarot-images/       # Tarot card images
├── scripts/                # Migration and utility scripts
└── dist/                   # Production build output
```

## Features

- 🔮 **Card Reader**: Draw random cards with interpretations
- 🎴 **Deck Browser**: Browse all 78 tarot cards with filtering
- 📚 **Tutorial**: Learn about tarot basics and card meanings
- 🌐 **Multi-language Support**: Ready for English/Spanish translations
- 📱 **Responsive Design**: Works on desktop and mobile
- ⚡ **Fast Loading**: Optimized with SWR caching

The application is now production-ready! 🎉 