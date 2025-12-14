# Job Portal – Cloud Infrastructure

## 1. High-level architecture

Our Job Portal follows a simple 3-tier architecture:

- **Frontend**: React SPA served from Azure App Service.
- **Backend API**: Node.js + Express REST API on Azure App Service.
- **Database**: Azure SQL Database (serverless) for user accounts and saved searches.
- **Monitoring & logs**: Azure Application Insights + Log Analytics workspace.

All resources live in the same subscription and resource group:

- **Subscription**: Azure Simple IE Instituto de Empresa, S.L.
- **Resource group**: `BCSAI2025-DEVOPS-STUDENT-5B`
- **Region**: West Europe (for the JobPortal resources)

---

## 2. Azure resources we use

- **App Service Plan**
  - Name: `job-portal-plan`
  - Region: West Europe
  - SKU: B1 (basic)
  - Hosts both frontend and backend web apps.

- **Backend App Service**
  - Name: `job-portal-api`
  - Runtime: Node 20 (Linux)
  - Deployment source: GitHub Actions (`backend-ci.yml`)
  - Exposes endpoints such as:
    - `GET /api/health`
    - `GET /api/jobs`
    - `GET /api/jobs/:id`

- **Frontend App Service**
  - Name: `job-portal-frontend`
  - Runtime: Node 20 (Linux) – serving static React build from `/home/site/wwwroot`
  - Public URL: `https://job-portal-frontend-…azurewebsites.net`
  - Deployed via GitHub Actions (`frontend-deploy.yml`), using `client/build` as package.

- **SQL Server & Database**
  - SQL server: `job-portal-sqlserver-5b`
  - Database: `jobportaldb`
  - Tier: **Azure SQL Database – serverless**
  - Main schema:
    - `Users(Id, Username, PasswordHash, …)`
    - `Searches(SearchId, UserId, SearchTerm, Location, WorkType, …)`
    - Foreign key `Searches.UserId → Users.Id (ON DELETE CASCADE)`
  - Connection from backend via env var:
    - `DB_CONNECTION_STRING` (stored in App Service configuration, not in Git).

- **Application Insights**
  - Name: `job-portal-api-insights`
  - Connected to: `job-portal-api`
  - Uses a Log Analytics workspace in the same subscription.
  - Provides:
    - Live metrics (request rate, response time, failure rate)
    - Logs (requests, dependencies, exceptions)
    - Basic smart detector alerts (e.g. failure anomalies).

---

## 3. CI/CD and repositories

- **Source control**
  - Frontend + backend in **GitHub** (`DevOps-Group-Project` repo).
  - A mirror exists in **Azure DevOps** (`job-portal` project) for work items and legacy pipelines.

- **Backend CI**
  - Trigger: `push` to `main` (server folder).
  - Steps:
    1. Checkout code.
    2. Setup Node.
    3. Install dependencies.
    4. Run Jest + Supertest API tests.
    5. Generate coverage report.
  - Status: implemented and green in GitHub Actions. Azure DevOps pipeline exists but is blocked by lack of hosted parallelism.

- **Backend deployment**
  - First deployment: manual `git push azure main:master` to `job-portal-api` App Service (Local Git).
  - After that, Azure runs `npm install` and `npm start` (`node server/index.js`).

- **Frontend CI/CD**
  - Workflow: `frontend-deploy.yml`.
  - Trigger: `push` to `main` under `client/**` + manual `workflow_dispatch`.
  - Steps:
    1. Clone source code.
    2. Install client dependencies (`npm ci` in `client/`).
    3. Run frontend tests.
    4. Build React app (`npm run build`).
    5. Login to Azure using `AZURE_CREDENTIALS` service principal.
    6. Deploy `client/build` to `job-portal-frontend` App Service.

---

## 4. Networking & security

- **App Services**
  - Public HTTPS endpoints (`*.azurewebsites.net`) with TLS 1.2.
- **Database access**
  - Azure SQL server firewall configured to allow:
    - Azure services.
    - Specific client IPs for development (only when needed).
  - Backend authenticates using SQL user + password stored in App Service settings.

- **Secrets management**
  - Sensitive values (SQL connection string, PATs, Azure credentials) stored as:
    - **GitHub Secrets** (`AZDO_PAT`, `AZURE_CREDENTIALS`, etc.).
    - **App Service application settings** (`DB_CONNECTION_STRING`), not committed to Git.

---

## 5. Monitoring & responsible cloud usage

- **Monitoring**
  - Application Insights + Live Metrics for the backend.
  - Logs queried through Log Analytics (Kusto) when debugging.
  - Health-check endpoint (`/api/health`) used by both humans and potential probes.

- **Responsible cloud usage**
  - Database uses **Azure SQL Serverless** to auto-pause when idle.
  - No long-running virtual machines for this project.
  - Resource group is limited to:
    - 2 App Services (frontend + backend),
    - 1 serverless SQL database,
    - 1 App Service plan,
    - 1 Application Insights instance and related workbook/alert.
  - Any legacy resources (e.g. older “George*” demos) are planned to be stopped/removed once we confirm they are no longer needed.

---

## 6. Future improvements

- Add staging slots for backend/frontend with blue-green deployment.
- Tighten SQL firewall to only allow the backend App Service outbound IPs.
- Add more alerts (error rate, slow requests) and dashboards.
- Automate infra creation with Bicep / Terraform instead of the portal.
