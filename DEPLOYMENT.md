# Job Portal - Azure Deployment Guide

This guide explains how to deploy the Job Portal application to Azure.

## Prerequisites

- Azure subscription
- Azure CLI installed
- Docker installed (for containerized deployment)
- Azure DevOps account (for CI/CD pipeline)

## Environment Variables

The following environment variables must be configured in Azure:

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `RAPIDAPI_KEY` | Your RapidAPI key for job search | Yes |
| `RAPIDAPI_HOST` | RapidAPI host (default: active-jobs-db.p.rapidapi.com) | No |
| `REACT_APP_API_URL` | Backend API URL for frontend | Yes (at build time) |

## Deployment Options

### Option 1: Azure App Service (Recommended for simplicity)

#### Backend Deployment

1. Create an Azure App Service:
```bash
az group create --name job-portal-rg --location eastus
az appservice plan create --name job-portal-plan --resource-group job-portal-rg --sku B1 --is-linux
az webapp create --name job-portal-backend --resource-group job-portal-rg --plan job-portal-plan --runtime "NODE:20-lts"
```

2. Configure environment variables:
```bash
az webapp config appsettings set --name job-portal-backend --resource-group job-portal-rg --settings \
  RAPIDAPI_KEY="your-api-key" \
  RAPIDAPI_HOST="active-jobs-db.p.rapidapi.com"
```

3. Deploy the backend:
```bash
cd job-portal
zip -r backend.zip package*.json server/
az webapp deployment source config-zip --name job-portal-backend --resource-group job-portal-rg --src backend.zip
```

#### Frontend Deployment (Azure Static Web Apps)

1. Build the frontend:
```bash
cd job-portal/client
REACT_APP_API_URL=https://job-portal-backend.azurewebsites.net/api npm run build
```

2. Create Azure Static Web App:
```bash
az staticwebapp create --name job-portal-frontend --resource-group job-portal-rg --source . --location eastus2
```

3. Deploy:
```bash
az staticwebapp upload --name job-portal-frontend --resource-group job-portal-rg --app-location client/build
```

### Option 2: Azure Container Apps (Recommended for production)

1. Create Azure Container Registry:
```bash
az acr create --name jobportalacr --resource-group job-portal-rg --sku Basic
az acr login --name jobportalacr
```

2. Build and push Docker images:
```bash
cd job-portal

# Build backend
docker build -f Dockerfile.backend -t jobportalacr.azurecr.io/job-portal-backend:latest .
docker push jobportalacr.azurecr.io/job-portal-backend:latest

# Build frontend
docker build -f Dockerfile.frontend -t jobportalacr.azurecr.io/job-portal-frontend:latest .
docker push jobportalacr.azurecr.io/job-portal-frontend:latest
```

3. Create Container Apps environment:
```bash
az containerapp env create --name job-portal-env --resource-group job-portal-rg --location eastus
```

4. Deploy backend:
```bash
az containerapp create \
  --name job-portal-backend \
  --resource-group job-portal-rg \
  --environment job-portal-env \
  --image jobportalacr.azurecr.io/job-portal-backend:latest \
  --target-port 5000 \
  --ingress external \
  --registry-server jobportalacr.azurecr.io \
  --env-vars RAPIDAPI_KEY=your-key RAPIDAPI_HOST=active-jobs-db.p.rapidapi.com
```

5. Deploy frontend:
```bash
az containerapp create \
  --name job-portal-frontend \
  --resource-group job-portal-rg \
  --environment job-portal-env \
  --image jobportalacr.azurecr.io/job-portal-frontend:latest \
  --target-port 80 \
  --ingress external \
  --registry-server jobportalacr.azurecr.io
```

### Option 3: Azure DevOps Pipeline (CI/CD)

1. Create a new Azure DevOps project

2. Connect your repository to Azure DevOps

3. Create the following service connections in Project Settings:
   - Docker Registry (for Azure Container Registry)
   - Azure Resource Manager (for Azure subscription)

4. Update `azure-pipelines.yml` variables:
   - `azureContainerRegistry`: Your ACR name
   - `dockerRegistryServiceConnection`: Your service connection name
   - `backendWebAppName`: Your backend app name
   - `frontendWebAppName`: Your frontend app name

5. Create environments in Azure DevOps:
   - `staging`
   - `production`

6. The pipeline will automatically:
   - Run tests on PR
   - Build Docker images on merge to main
   - Deploy to staging
   - Deploy to production (with manual approval)

## Local Development with Docker

```bash
cd job-portal

# Create .env file
cp .env.example .env
# Edit .env with your values

# Build and run
docker-compose up --build

# Access the app
# Frontend: http://localhost
# Backend API: http://localhost:5000/api
```

## Troubleshooting

### API Key not working
- Verify the key is correctly set in Azure App Settings
- Check the backend logs: `az webapp log tail --name job-portal-backend --resource-group job-portal-rg`

### Frontend can't reach backend
- Ensure CORS is enabled on the backend
- Verify `REACT_APP_API_URL` is set correctly during build
- Check nginx configuration for proper proxy settings

### Container not starting
- Check container logs: `az containerapp logs show --name job-portal-backend --resource-group job-portal-rg`
- Verify health check endpoint is accessible

## Monitoring

Set up Azure Application Insights for monitoring:

```bash
az monitor app-insights component create \
  --app job-portal-insights \
  --location eastus \
  --resource-group job-portal-rg
```

Add the instrumentation key to your application for detailed telemetry.

