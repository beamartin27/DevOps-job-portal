# Zip Deployment Guide for Azure App Service

This guide explains how to deploy the Job Portal application to Azure using ZIP deployment.

## Prerequisites

- Azure subscription
- Azure CLI installed
- Azure DevOps account (for CI/CD pipeline)
- Node.js 20.x installed locally (for local testing)

## Environment Variables

Configure these in Azure App Service → Configuration → Application Settings:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` (default) |
| `RAPIDAPI_KEY` | Your RapidAPI key | Yes | `209e08cb56msh...` |
| `RAPIDAPI_HOST` | RapidAPI host | No | `active-jobs-db.p.rapidapi.com` |
| `WEBSITE_NODE_DEFAULT_VERSION` | Node.js version | No | `20-lts` |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | Auto-build on deploy | No | `true` |

## Deployment Methods

### Method 1: Azure DevOps Pipeline (Recommended)

1. **Update Pipeline Variables:**
   - Open `azure-pipelines.yml`
   - Update `azureSubscription` with your Azure service connection name
   - Update `backendWebAppName` and `frontendWebAppName` with your app names
   - Update `azureResourceGroup` with your resource group name

2. **Create Azure Service Connection:**
   - Go to Azure DevOps → Project Settings → Service Connections
   - Create new Azure Resource Manager connection
   - Name it (e.g., `your-azure-subscription-connection`)

3. **Create Environments:**
   - Go to Pipelines → Environments
   - Create `staging` and `production` environments

4. **Run Pipeline:**
   - Push to `main` or `develop` branch
   - Pipeline will automatically build, test, package, and deploy

### Method 2: Manual ZIP Deployment via Azure CLI

#### Backend Deployment

1. **Create Azure App Service:**
```bash
az group create --name job-portal-rg --location eastus
az appservice plan create --name job-portal-plan --resource-group job-portal-rg --sku B1 --is-linux
az webapp create --name job-portal-backend --resource-group job-portal-rg --plan job-portal-plan --runtime "NODE:20-lts"
```

2. **Configure Environment Variables:**
```bash
az webapp config appsettings set \
  --name job-portal-backend \
  --resource-group job-portal-rg \
  --settings \
    RAPIDAPI_KEY="your-api-key" \
    RAPIDAPI_HOST="active-jobs-db.p.rapidapi.com" \
    PORT="5000" \
    WEBSITE_NODE_DEFAULT_VERSION="20-lts" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="true"
```

3. **Package and Deploy:**
```bash
cd job-portal
npm run package:backend
az webapp deployment source config-zip \
  --name job-portal-backend \
  --resource-group job-portal-rg \
  --src deploy/backend.zip
```

#### Frontend Deployment

1. **Create Azure Static Web App (Recommended for Frontend):**
```bash
# Build frontend
cd job-portal/client
REACT_APP_API_URL=https://job-portal-backend.azurewebsites.net/api npm run build

# Create Static Web App
az staticwebapp create \
  --name job-portal-frontend \
  --resource-group job-portal-rg \
  --source . \
  --location eastus2

# Deploy
az staticwebapp upload \
  --name job-portal-frontend \
  --resource-group job-portal-rg \
  --app-location client/build
```

**OR** Deploy as separate App Service:

```bash
# Create App Service for frontend
az webapp create --name job-portal-frontend --resource-group job-portal-rg --plan job-portal-plan --runtime "NODE:20-lts"

# Package and deploy
cd job-portal
npm run package:frontend
az webapp deployment source config-zip \
  --name job-portal-frontend \
  --resource-group job-portal-rg \
  --src deploy/frontend.zip
```

### Method 3: Azure Portal Manual Upload

1. **Package the application:**
```bash
cd job-portal
npm run package:backend  # or package:frontend
```

2. **Upload via Azure Portal:**
   - Go to Azure Portal → Your App Service → Deployment Center
   - Select "Local Git" or "ZIP Deploy"
   - Upload `deploy/backend.zip` or `deploy/frontend.zip`

## Package Scripts

The following npm scripts are available for packaging:

- `npm run package:backend` - Creates `deploy/backend.zip` with server files
- `npm run package:frontend` - Builds frontend and creates `deploy/frontend.zip`
- `npm run package:all` - Packages both backend and frontend

## Post-Deployment

### Verify Deployment

1. **Check Backend Health:**
```bash
curl https://job-portal-backend.azurewebsites.net/api/health
```

2. **Check Backend Debug:**
```bash
curl https://job-portal-backend.azurewebsites.net/api/debug
```

3. **Test API:**
```bash
curl "https://job-portal-backend.azurewebsites.net/api/jobs?search=developer&page=1&limit=10"
```

### View Logs

```bash
# Stream logs
az webapp log tail --name job-portal-backend --resource-group job-portal-rg

# Download logs
az webapp log download --name job-portal-backend --resource-group job-portal-rg
```

## Troubleshooting

### App Service Not Starting

1. **Check Logs:**
   - Azure Portal → App Service → Log stream
   - Or use Azure CLI: `az webapp log tail`

2. **Verify Node.js Version:**
   - Set `WEBSITE_NODE_DEFAULT_VERSION` to `20-lts` in App Settings

3. **Check Startup Command:**
   - Azure Portal → Configuration → General Settings
   - Startup Command: `node server/index.js`

### API Key Not Working

1. **Verify Environment Variables:**
   - Azure Portal → Configuration → Application Settings
   - Ensure `RAPIDAPI_KEY` and `RAPIDAPI_HOST` are set correctly

2. **Check Server Logs:**
   - Look for "API Key configured: NO" in logs
   - Use `/api/debug` endpoint to verify configuration

### Frontend Can't Reach Backend

1. **Update API URL:**
   - Rebuild frontend with correct `REACT_APP_API_URL`
   - For separate deployments: `https://job-portal-backend.azurewebsites.net/api`
   - For combined deployment: `/api`

2. **Check CORS:**
   - Backend has CORS enabled, but verify frontend URL is allowed

### Build Failures

1. **Check Node Version:**
   - Ensure `package.json` specifies Node 20.x
   - Set `WEBSITE_NODE_DEFAULT_VERSION=20-lts` in App Settings

2. **Verify Dependencies:**
   - Ensure `package.json` and `package-lock.json` are included in zip
   - Check that all dependencies are listed in `dependencies` (not `devDependencies`)

## Combined Deployment (Optional)

To deploy frontend and backend together:

1. **Build frontend:**
```bash
cd job-portal/client
REACT_APP_API_URL=/api npm run build
```

2. **Copy build to server directory:**
```bash
cp -r client/build server/public
```

3. **Package everything:**
```bash
npm run package:backend
# Modify to include public folder
```

4. **Deploy single zip** containing both frontend and backend

## Monitoring

Set up Application Insights:

```bash
az monitor app-insights component create \
  --app job-portal-insights \
  --location eastus \
  --resource-group job-portal-rg

# Get instrumentation key
az monitor app-insights component show \
  --app job-portal-insights \
  --resource-group job-portal-rg \
  --query instrumentationKey
```

Add instrumentation key to App Settings as `APPINSIGHTS_INSTRUMENTATIONKEY`.

