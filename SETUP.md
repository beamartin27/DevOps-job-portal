# Setup Guide - Job Portal

## Quick Start

### Step 1: Install Backend Dependencies
```bash
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:
```env
PORT=5000
RAPIDAPI_KEY=16ccf2114cmshe411b5b592feca2p11a6dajsnde32158908c1
RAPIDAPI_HOST=rapidapi.com
```

Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Run the Application

#### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev
```

#### Option 2: Run Separately

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### Step 5: Open in Browser

Frontend: http://localhost:3000
Backend API: http://localhost:5000/api

## Testing the API

You can test the backend API directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all jobs
curl http://localhost:5000/api/jobs

# Search jobs
curl "http://localhost:5000/api/jobs?search=engineer&location=remote"

# Get specific job
curl http://localhost:5000/api/jobs/1903980996
```

## Project Structure Overview

```
job-portal/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # UI Components
│   │   ├── services/    # API Layer
│   │   └── utils/       # Helpers
│   └── public/
├── server/              # Node.js Backend
│   ├── config/
│   └── index.js
└── package.json
```

## Available Scripts

### Root Directory
- `npm run dev` - Run both frontend and backend
- `npm run server` - Run backend only
- `npm run client` - Run frontend only
- `npm run install-all` - Install all dependencies

### Client Directory
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:

**Change Backend Port:**
Edit `.env` file: `PORT=5001`

**Change Frontend Port:**
When prompted "Would you like to run the app on another port instead?", type `Y`

### Module Not Found
```bash
# Reinstall dependencies
npm install
cd client && npm install
```

### Cannot Find .env
Make sure `.env` files are created in both root and client directories.

### CORS Errors
Backend has CORS enabled by default. If you still see CORS errors, check that `proxy` is set in `client/package.json`:
```json
"proxy": "http://localhost:5000"
```

## Features Implemented

✅ Job search and filtering
✅ Location-based search
✅ Remote job filtering
✅ Pagination
✅ Responsive design (mobile, tablet, desktop)
✅ Dark mode support
✅ Loading states
✅ Error handling
✅ Job detail view
✅ External application links

## Next Steps

1. **Replace Mock Data**: Update `server/index.js` to fetch from real API
2. **Add Authentication**: Implement user login/signup
3. **Save Jobs**: Add bookmark functionality
4. **Apply Tracking**: Track application status
5. **Email Alerts**: Set up job alert notifications

## Production Deployment

### Build Frontend
```bash
cd client
npm run build
```

### Deploy Options
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, DigitalOcean
- **Full Stack**: AWS, Google Cloud, Azure

## Support

For issues or questions, please check:
- README.md for detailed documentation
- rules.mdc for design guidelines
- GitHub issues (if applicable)

