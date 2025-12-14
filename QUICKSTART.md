# 🚀 Quick Start Guide - Job Portal

## ⚡ 60-Second Setup

```bash
# 1. Install backend dependencies (in project root)
npm install

# 2. Install frontend dependencies
cd client
npm install
cd ..

# 3. Start both servers
npm run dev
```

**That's it!** Open http://localhost:3000 in your browser.

---

## 📁 What You Have

```
job-portal/
├── 🎨 client/              React Frontend
│   ├── src/
│   │   ├── components/     UI Components (Header, JobCard, etc.)
│   │   ├── services/       API Integration
│   │   └── utils/          Helper Functions
│   └── public/
│
├── 🔧 server/              Node.js Backend
│   ├── config/             Configuration Files
│   └── index.js            Express Server + Mock Data
│
└── 📦 package.json         Root Dependencies
```

---

## 🎯 How It Works

### Backend (Node.js + Express)
- Runs on port **5000**
- Serves job data via REST API
- Handles search, filtering, and pagination
- Currently uses mock data (ready for real API integration)

### Frontend (React)
- Runs on port **3000**
- Modern React with Hooks
- React Query for data fetching
- Lucide React for icons
- Fully responsive design

### Data Flow
```
User → React Frontend → API Request → Express Backend → Mock Data → Response → UI Update
```

---

## 🎬 Try These Features

### 1. Search Jobs
Type "Engineer" in the search box → Click "Search"

### 2. Filter by Location
Type "New York" in the location field

### 3. Filter Remote Jobs
Select "Remote only" from the dropdown

### 4. View Job Details
Click any job card to see full details

### 5. Navigate Pages
Use pagination at the bottom to browse more jobs

### 6. Reset Filters
Click "Reset" to clear all filters

---

## 🌐 API Endpoints You Can Test

```bash
# Get all jobs
curl http://localhost:5000/api/jobs

# Search for "engineer"
curl "http://localhost:5000/api/jobs?search=engineer"

# Filter by location
curl "http://localhost:5000/api/jobs?location=new%20york"

# Get remote jobs only
curl "http://localhost:5000/api/jobs?remote=true"

# Pagination (page 2, 10 items per page)
curl "http://localhost:5000/api/jobs?page=2&limit=10"

# Get specific job
curl http://localhost:5000/api/jobs/1903980996

# Health check
curl http://localhost:5000/api/health
```

---

## 📱 Responsive Design

The app automatically adapts to your screen size:

**📱 Mobile (< 640px)**
- Stacked search inputs
- Full-width cards
- Full-screen job details

**💻 Tablet (640px - 1024px)**
- Two-column search
- Grid layout
- Side panel details

**🖥️ Desktop (> 1024px)**
- Three-column search
- Split view (list + details)
- Maximum 1200px width

---

## 🎨 Design System

### Colors
```
Primary:   Blue (#2563eb)    - Buttons, links, active states
Secondary: Slate (#64748b)   - Text, icons
Accent:    Amber (#f59e0b)   - Highlights
```

### Spacing
```
4px   - Tiny gaps
8px   - Small gaps
16px  - Medium gaps
24px  - Large gaps
32px  - Extra large gaps
```

### Typography
```
32px - Main headings
24px - Section headings
18px - Subheadings
16px - Body text
14px - Small text
```

---

## 🔧 Common Commands

### Development
```bash
npm run dev           # Run both frontend & backend
npm run server        # Backend only (port 5000)
npm run client        # Frontend only (port 3000)
```

### Production
```bash
cd client
npm run build         # Build optimized React app
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Problem:** Port 3000 or 5000 is taken

**Solution:**
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Module Not Found

**Problem:** Missing dependencies

**Solution:**
```bash
# Reinstall everything
npm install
cd client && npm install
```

### Changes Not Showing

**Problem:** Hot reload not working

**Solution:**
- Save the file (Ctrl+S)
- Refresh browser (F5)
- Restart dev server (Ctrl+C, then npm run dev)

### API Not Responding

**Problem:** Backend not running

**Solution:**
- Check terminal for errors
- Verify port 5000 is free
- Restart: `npm run server`

---

## 📚 More Documentation

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup instructions
- `FEATURES.md` - Complete feature list
- `rules.mdc` - Design guidelines & project structure

---

## 🎉 What's Next?

1. **Explore the Code**
   - Check `client/src/components/` for UI components
   - Look at `server/index.js` for API logic

2. **Customize the Design**
   - Edit colors in `client/src/App.css`
   - Modify spacing in CSS variables

3. **Add Real API**
   - Replace mock data in `server/index.js`
   - Add your API credentials in `.env`

4. **Add Features**
   - User authentication
   - Save favorite jobs
   - Application tracking
   - Email notifications

---

## 💡 Pro Tips

- **Ctrl+Shift+I** - Open browser DevTools
- **Ctrl+K** in VS Code - Command palette
- Use **React DevTools** extension for debugging
- Check **Network tab** to see API calls
- **Console.log** is your friend for debugging

---

## 🤝 Need Help?

- Check the documentation files
- Review the code comments
- Look at component structure in `rules.mdc`
- Search for similar issues online

---

**Happy Coding! 🚀**

