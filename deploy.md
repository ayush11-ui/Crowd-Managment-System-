# 🚀 Quick Deployment Guide

## Prerequisites
- Git installed
- Node.js installed
- GitHub account

## Step 1: Push to GitHub

1. **Create a new repository on GitHub**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it: `crowd-management-system`
   - Don't initialize with README (we already have one)

2. **Push your code**:
   ```bash
   git remote add origin https://github.com/yourusername/crowd-management-system.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Heroku (Recommended)

1. **Install Heroku CLI**:
   - Download from: https://devcenter.heroku.com/articles/heroku-cli

2. **Deploy**:
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set JWT_SECRET=your-super-secret-jwt-key-here
   git push heroku main
   heroku open
   ```

## Step 3: Alternative - Deploy to Railway

1. **Go to**: https://railway.app
2. **Sign up with GitHub**
3. **Create new project from GitHub repo**
4. **Set environment variable**: `JWT_SECRET=your-secret-key`
5. **Deploy automatically**

## Step 4: Alternative - Deploy to Render

1. **Go to**: https://render.com
2. **Connect GitHub repository**
3. **Select your repository**
4. **Configure**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: `JWT_SECRET=your-secret-key`
5. **Deploy**

## Step 5: Test Your Deployment

1. **Visit your deployed URL**
2. **Try logging in with**:
   - Email: `demo@crowdmanagement.com`
   - Password: `password`
3. **Test the dashboard features**:
   - Run demos
   - Check real-time updates
   - Test API endpoints

## Features Working After Deployment:

✅ **User Authentication**: Real login/signup with JWT tokens
✅ **Crowd Management Backend**: All BFS algorithms running on server
✅ **Real-time Updates**: Live data streaming from backend
✅ **Interactive Dashboard**: Functional demos with real data
✅ **API Integration**: Frontend connected to backend APIs
✅ **Glassmorphism UI**: Beautiful Peace Sans font interface
✅ **Mobile Responsive**: Works on all devices

## Demo Credentials:
- **Email**: demo@crowdmanagement.com
- **Password**: password

## API Endpoints Available:
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/system/overview` - System statistics
- `GET /api/zones` - All zones data
- `POST /api/evacuation/route` - Find evacuation routes
- `POST /api/emergency/evacuate` - Emergency evacuation
- `POST /api/crowd/redistribute` - Crowd redistribution
- `GET /api/events` - Real-time updates (SSE)

🎉 **Your crowd management system is now live and fully functional!**
