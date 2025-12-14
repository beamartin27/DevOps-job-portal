# Azure Architecture - Job Portal

## Project Goal
Deploy the Job Portal application to Microsoft Azure with automated CI/CD, monitoring, and scalability.

## Selected Azure Services

1. Azure App Service (Frontend) - React Application
   - Purpose: Host the React frontend application
   - Runtime: Node.js 18 LTS
   - App Service name: `app-job-portal-frontend`

2. Azure App Service (Backend) - Node.js API
   - Purpose: Host the Express.js REST API
   - Runtime: Node.js 18 LTS
   - App Service name: `app-job-portal-backend`

3. Azure SQL Database
   - Purpose: Store job listings and related data
   - Server: `sql-job-portal-server`
   - Database: `sqldb-job-portal`

4. Azure Application Insights
   - Purpose: Monitor app performance and errors
   - Instance: `appi-job-portal`

5. Azure DevOps
   - Purpose: CI/CD pipelines and repository management

## System Topology
Frontend (browser) → Frontend App Service → Backend App Service (REST API) → Azure SQL Database

## CI/CD Variable Group (secrets)

- Create an Azure DevOps Variable Group named `production-secrets` in Pipelines → Library.
- Store only non-rotating secrets and connection strings here (mark sensitive variables as secret):
  - `DATABASE_URL` (connection string)
  - `APPINSIGHTS_INSTRUMENTATIONKEY`
  - `AZURE_SUBSCRIPTION`
  - Any service credentials required for deployments
- Link the `production-secrets` variable group to the `azure-pipelines.yml` pipeline under pipeline variables.

## Security Notes
- Do NOT store secrets in repo files. Use the pipeline variable group and App Service settings.
- Enforce HTTPS on App Services and restrict SQL server firewall to App Service outbound IPs or use private endpoints.

## Deployment & Post-deploy Checks
- Frontend: deploy `/client/build` to `app-job-portal-frontend` and verify root URL loads.
- Backend: deploy Node app to `app-job-portal-backend` and verify `GET /api/health` returns 200.
- Verify Application Insights receives telemetry from both apps.

## Naming Conventions
- Resource Group: `rg-job-portal-prod`
- App Service Plan: `asp-job-portal-frontend`, `asp-job-portal-backend`

## Monitoring & Alerts (examples)
- Configure Application Insights alert rules for:
  - Failed requests (5xx rate)
  - Availability (health endpoint checks)
  - Latency (p95 request duration)

## References
- See `azure-pipelines.yml` and `CICD_PIPELINE.md` for pipeline configuration and deployment flow.
