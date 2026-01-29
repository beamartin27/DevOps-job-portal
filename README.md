# Job Portal - DevOps CI/CD Project

Full-stack job search application demonstrating DevOps practices with automated CI/CD pipelines, comprehensive testing, and Azure deployment.

## My Contributions (Beatriz Martín Martín)
I owned the **Azure deployment & monitoring** workstream for the team:

- Defined the cloud high-level architecture (Frontend App Service, Backend App Service, Azure SQL, Application Insights).
- Created and configured the **App Service plan** + web apps for frontend and backend.
- Performed the **first manual backend deployment** and validated health endpoints (`/api/health`, `/api/jobs`).
- Provisioned **Azure SQL Server + database**, executed schema scripts (Users/Searches), and validated connectivity.
- Enabled **Application Insights**, checked Live Metrics/logs to confirm real traffic from frontend → backend.
- Helped debug the frontend deployment workflow so the React build was served correctly.

*(This repository is a public portfolio mirror of a team project; CI/CD secrets are intentionally not configured here.)*

> Original team repo: https://github.com/GVasha/DEVOPS_FINAL

## Project Requirements Met

-  **REST API Backend**: Node.js/Express with 3 endpoints
-  **Frontend**: React 19 single-page application
-  **Testing**: Jest tests for frontend and backend
-  **CI/CD**: GitHub Actions with automated build, test, deploy
-  **Version Control**: Git via Azure DevOps Repos
-  **Cloud Deployment**: Azure App Services (frontend + backend)
-  **Monitoring**: Application Insights with dashboards and request tracking
-  **Database**: Azure SQL Database with user searches persistence

---

## Architecture

```
GitHub Actions (CI/CD)
        ↓
┌─────────────────────────────────────────────────────┐
│         Azure Cloud (West Europe)                   │
│                                                     │
│  ┌────────────────┐  ┌────────────────┐            │
│  │ App Service    │  │ App Service    │            │
│  │ Frontend       │←─│ Backend API    │            │
│  │ (React)        │  │ (Node.js)      │            │
│  └────────────────┘  └───────┬────────┘            │
│                              │                      │
│                              ├─→ ┌──────────────┐  │
│                              │   │ Azure SQL DB │  │
│                              │   │ (jobportaldb)│  │
│                              │   └──────────────┘  │
│                              │                      │
│                              ├─→ ┌──────────────┐  │
│                              │   │ RapidAPI     │  │
│                              │   │ (Jobs Data)  │  │
│                              │   └──────────────┘  │
│                              │                      │
│                              └─→ ┌──────────────┐  │
│                                  │ App Insights │  │
│                                  │ (Monitoring) │  │
│                                  └──────────────┘  │
└─────────────────────────────────────────────────────┘

Source: Azure DevOps Repos
Pipelines: GitHub Actions
```

---

## Technology Stack

**Frontend**
- React 19.2.0
- React Query (@tanstack/react-query 5.62.14)
- Axios 1.7.9
- Lucide React icons
- Testing: Jest, React Testing Library

**Backend**
- Node.js 18.x
- Express.js 4.18.2
- CORS 2.8.5
- Testing: Jest 29.7.0, Supertest 6.3.4

**DevOps**
- CI/CD: GitHub Actions
- Version Control: Azure DevOps Repos
- Cloud: Microsoft Azure (West Europe)
  - 2x App Services (B1 tier)
  - Azure SQL Database (Basic tier)
  - Application Insights (monitoring)
- Containerization: Docker (optional)

---

## Application Features

### Job Search & Discovery
- **Full-text search**: Find jobs by title or company name with real-time filtering
- **Location-based filtering**: Search jobs by specific cities or regions
- **Remote work toggle**: Filter exclusively for remote positions
- **Pagination**: Browse through results 10 jobs at a time with easy navigation
- **Job details view**: Click any job card to see full description, salary info, and application link

### User Experience
- **Responsive design**: Optimized layouts for mobile, tablet, and desktop screens
- **Loading states**: Skeleton loaders and spinners during data fetching
- **Error handling**: User-friendly error messages for network failures or empty results
- **Accessibility**: Semantic HTML structure with ARIA labels for screen readers
- **Clean interface**: Modern card-based design with clear typography and spacing

### Data Integration
- **External API**: Connects to RapidAPI job listings service
- **Mock data fallback**: Development mode with sample job data
- **Health monitoring**: Backend health check endpoint for deployment verification

---

## Documentation

- `docs/ARCHITECTURE.md`: System architecture and deployment notes
- `docs/COMPONENTS.md`: Frontend and backend component responsibilities
- `docs/definition_of_done.md`: Definition of Done checklist
- `docs/retrospective-summary.md`: Final retrospective summary
- `docs/roles.md`: Team roles and responsibilities
- `docs/scrum-snapshots-evidents/`: Screenshots and sprint evidence
- `docs/sprints/`: Sprint retrospectives and reviews
   - `docs/sprints/sprint-1-retrospective.md`
   - `docs/sprints/sprint-1-review.md`
   - `docs/sprints/sprint-2-retrospective.md`
   - `docs/sprints/sprint-2-review.md`
   - `docs/sprints/sprint-3-retrospective.md`
   - `docs/sprints/sprint-3-review.md`
   - `docs/sprints/sprint-4-retrospective.md`
   - `docs/sprints/sprint-4-review.md`

---

## CI/CD Pipeline

### Architecture

```
Developer Push → Azure DevOps Repos
                       ↓
            GitHub Actions Clone Code
                       ↓
            ┌──────────┴──────────┐
            ↓                     ↓
    Frontend Pipeline      Backend Pipeline
    - npm ci               - npm ci
    - npm test             - npm test
    - npm run build        - Coverage report
    - Deploy to Azure      - Deploy to Azure
```

### Pipeline Configuration

**Frontend Pipeline** (`.github/workflows/frontend-deploy.yml`)

Triggers:
- Push to `main` with changes in `client/**`
- Manual dispatch

Steps:
1. Clone from Azure DevOps using PAT
2. Setup Node.js 18.x
3. Install dependencies (`npm ci`)
4. Run tests
5. Build production bundle
6. Deploy to Azure App Service

**Backend Pipeline** (`.github/workflows/backend-deploy.yml`)

Triggers:
- Push to `main` with changes in `server/**`, `package.json`, or `jest.config.js`
- Manual dispatch

Steps:
1. Clone from Azure DevOps using PAT
2. Setup Node.js 18.x
3. Install dependencies (`npm ci`)
4. Run tests with coverage
5. Deploy to Azure App Service

### Required Secrets

`AZDO_PAT` - Azure DevOps Personal Access Token
- Used to clone repository from Azure DevOps
- Permissions: Code (Read)

`AZURE_CREDENTIALS` - Azure Service Principal
- Used for Azure deployment
- Format:
```json
{
  "clientId": "xxx",
  "clientSecret": "xxx",
  "subscriptionId": "xxx",
  "tenantId": "xxx"
}
```

---

## Azure Deployment

### Frontend App Service

**Name**: `job-portal-frontend-f9dheecvatencefk`  
**URL**: <frontend-url>
**Runtime**: Node 18 LTS  
**Region**: West Europe

Environment Variables:
```
REACT_APP_API_URL=https://job-portal-api-d7gectbxabcqaxa0.westeurope-01.azurewebsites.net/api
```

### Backend App Service

**Name**: `job-portal-api-d7gectbxabcqaxa0`  
**URL**: <backend-url>
**Runtime**: Node 18 LTS  
**Region**: West Europe

Environment Variables:
```
PORT=8080
RAPIDAPI_KEY=<your-key>
RAPIDAPI_HOST=jobs-api14.p.rapidapi.com
DB_CONNECTION_STRING=<azure-sql-connection-string>
```

### Azure SQL Database

**Server**: `job-portal-sqlserver-5b`  
**Database**: `jobportaldb`  
**Tier**: Basic  
**Region**: West Europe  
**Resource Group**: <resource-group>

**Schema**:
- **Users** table: `Id`, `Username`, `PasswordHash`
- **Searches** table: `SearchId`, `UserId`, `SearchTerm`, `Location`, `WorkType` (Foreign Key → Users.Id with CASCADE delete)

**Features**:
- User search history persistence
- SQL Authentication configured
- Firewall allows Azure services access
- Connection string secured in App Service environment variables

**Backend Integration**:
- Uses `mssql` NPM package
- Connection via `process.env.DB_CONNECTION_STRING`
- Replaces mock data for saved searches feature

### Application Insights

**Resource**: Linked to backend App Service  
**Region**: West Europe

**Monitored Metrics**:
- HTTP request count and response times
- Failed requests (4xx, 5xx errors)
- Database query performance
- External API dependencies (RapidAPI calls)
- Custom traces and logging

**Dashboards Created**:
- Request volume over time
- Error rate tracking (p95 response time)
- API dependency health
- Failed request analysis

**Access**: Azure Portal → Application Insights → Monitoring dashboards

---

## Testing Strategy

### Backend Tests (`server/index.test.js`)

**Framework**: Jest 29.7.0 + Supertest 6.3.4

**Test Coverage (5 tests):**

1. **Health Check** (`GET /api/health`)
   - Returns 200 OK status
   - Response contains status: 'OK'
   - Response contains timestamp

2. **Job Listings** (`GET /api/jobs`)
   - Returns jobs with pagination structure
   - Validates response schema (success, data, pagination)
   - Data returned as array

3. **Search Functionality** (`GET /api/jobs?search=Engineer`)
   - Filters jobs by search term
   - Returns success: true
   - Data returned as array

4. **Single Job Retrieval** (`GET /api/jobs/:id`)
   - Returns specific job when valid ID provided (1903980996)
   - Validates job data structure
   - Returns success: true with data property

5. **Error Handling**
   - Returns 404 for non-existent job IDs
   - Response includes success: false
   - Response includes message: 'Job not found'

**Run Backend Tests:**
```bash
npm test                        # Run all tests
npm run test:api -- --coverage  # With coverage report
```

### Frontend Tests

**Framework**: Jest + React Testing Library 16.1.0

**Component Test Coverage (3 tests):**

1. **App.test.jsx** - Application smoke test
   - Renders without crashing
   - "JobPortal" heading displays
   - "Jobs" navigation link appears
   - API service is mocked

2. **SearchBar.test.jsx** - Search interaction test
   - Search input accepts text ("React Developer")
   - Search button triggers onSearch callback
   - Passes correct parameters (search, location, remote)

3. **JobCard.test.jsx** - Job card rendering test
   - Job title renders ("React Developer")
   - Company name displays ("Tech Company Inc")
   - Remote badge shows for remote jobs
   - Posted date displays ("Posted 2 days ago")
   - Formatters module is mocked

**Run Frontend Tests:**
```bash
cd client
npm test              # Run all tests
npm test -- --coverage # With coverage
```

### CI/CD Test Integration

- ✅ Tests run automatically on every push to main
- ✅ Deployment blocked if tests fail
- ✅ Coverage reports generated (jest-junit)
- ✅ Test results visible in GitHub Actions logs
- ✅ Both frontend and backend tested independently

---

## Local Development Setup

1. **Clone repository**
```bash
git clone https://dev.azure.com/csai-devops/job-portal/_git/job-portal
cd job-portal
```

2. **Install dependencies**
```bash
npm install
cd client && npm install && cd ..
```

3. **Configure environment**

Root `.env`:
```
PORT=5000
RAPIDAPI_KEY=your_key
RAPIDAPI_HOST=jobs-api14.p.rapidapi.com
```

`client/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Run application**
```bash
npm run dev  # Runs both frontend (3000) and backend (5000)
```

---

## API Documentation

### GET /api/health
Health check endpoint.

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-12-14T10:00:00.000Z"
}
```

### GET /api/jobs
Retrieve job listings with pagination.

Query Parameters:
- `search` (string) - Search term
- `location_filter` (string) - Location
- `page` (number) - Page number (default: 1)
- `limit` (number) - Results per page (default: 10)

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### GET /api/jobs/:id
Retrieve single job by ID.

---

## Team

| Member | Role | Responsibilities |
|--------|------|------------------|
| Blanca Valdés (P1) | Product Owner / Architect | Architecture, backlog, product vision |
| Beatriz Martín (P2) | Azure Infrastructure | App Services, cloud resources |
| George Vashakidze (P3) | Backend Developer | API development, database integration |
| María José Coleman (P4) | Frontend Developer | React UI, user experience |
| Joud Taher (P5) | DevOps Engineer | CI/CD pipelines, documentation |
| Adriana Casco (P6) | QA / Monitoring | Testing, Application Insights |

---

## Project Structure

```
job-portal/
├── .github/workflows/        # CI/CD pipelines
│   ├── frontend-deploy.yml
│   └── backend-deploy.yml
├── client/                   # React frontend
│   ├── public/
│   └── src/
│       ├── components/       # UI components
│       ├── services/         # API client
│       └── utils/            # Helper functions
├── server/                   # Node.js backend
│   ├── config/
│   │   └── api.js           # API configuration
│   └── index.js             # Express server
├── docs/                     # Documentation
│   ├── definition_of_done.md
│   └── roles.md
├── ARCHITECTURE.md           # Detailed architecture
├── COMPONENTS.md             # Component documentation
├── TEST_PLAN.md              # Testing documentation
├── package.json              # Backend dependencies
└── jest.config.js            # Test configuration
```

---

## Development Workflow

1. **Create feature branch**
```bash
git checkout -b feature/your-feature
```

2. **Make changes and test locally**
```bash
npm test
cd client && npm test
```

3. **Commit and push to Azure DevOps**
```bash
git add .
git commit -m "Description"
git push origin feature/your-feature
```

4. **Sync to GitHub to trigger CI/CD**
```bash
git checkout main
git pull origin main
git push github main
```

5. **Monitor pipeline**
- Check GitHub Actions tab for build/deploy status

---

## Planned Enhancements
- User authentication
- Job application tracking
- Email notifications
- Advanced analytics dashboard

---

## Documentation

### Technical Documentation
- [Architecture Details](./docs/ARCHITECTURE.md)
- [Component Specifications](./docs/COMPONENTS.md)
- [Team Roles](./docs/roles.md)

### Scrum & Agile Artifacts
- [Definition of Done](./docs/definition_of_done.md)
- [Final Retrospective Summary](./docs/retrospective-summary.md)
- [Scrum Evidence & Screenshots](./docs/scrum-snapshots-evidents/)

### Sprint Documentation

- **Sprint 1**: [Review](./docs/sprints/sprint-1-review.md) | [Retrospective](./docs/sprints/sprint-1-retrospective.md)
- **Sprint 2**: [Review](./docs/sprints/sprint-2-review.md) | [Retrospective](./docs/sprints/sprint-2-retrospective.md)
- **Sprint 3**: [Review](./docs/sprints/sprint-3-review.md) | [Retrospective](./docs/sprints/sprint-3-retrospective.md)
- **Sprint 4**: [Review](./docs/sprints/sprint-4-review.md) | [Retrospective](./docs/sprints/sprint-4-retrospective.md)

---

## License

MIT License

---

**Azure Subscription**: Azure Simple IE Instituto de Empresa, S.L.  
**Version**: 1.0.0  
**Last Updated**: December 14, 2025
