# CI/CD Pipeline Design - Job Portal

## Pipeline Flow Diagram

```
... (diagram unchanged) ...
```

## Pipeline Configuration File

### Example: `azure-pipelines.yml`

```yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Build
    displayName: 'Build Frontend and Backend'
    jobs:
      - job: BuildFrontend
        displayName: 'Build React Frontend'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'
            displayName: 'Install Node.js'

          - script: |
              cd client
              npm install
              npm run build
            displayName: 'Build Frontend'

          - task: PublishBuildArtifacts@1
            inputs:
              PathtoPublish: 'client/build'
              ArtifactName: 'frontend'

      - job: BuildBackend
        displayName: 'Build Node.js Backend'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'
            displayName: 'Install Node.js'

          - script: |
              npm install
            displayName: 'Install Backend Dependencies'

          - task: PublishBuildArtifacts@1
            inputs:
              PathtoPublish: '$(System.DefaultWorkingDirectory)'
              ArtifactName: 'backend'

  - stage: Test
    displayName: 'Run Tests'
    dependsOn: Build
    jobs:
      - job: RunTests
        displayName: 'Run Unit Tests'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'

          - script: |
              npm install
              npm test
            displayName: 'Run Tests'

  - stage: Deploy
    displayName: 'Deploy to Azure'
    dependsOn: Test
    jobs:
      - deployment: DeployFrontend
        displayName: 'Deploy Frontend to App Service'
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: '$(AZURE_SUBSCRIPTION)'
                    appName: 'app-job-portal-frontend'
                    package: '$(Pipeline.Workspace)/frontend'

      - deployment: DeployBackend
        displayName: 'Deploy Backend to App Service'
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: '$(AZURE_SUBSCRIPTION)'
                    appName: 'app-job-portal-backend'
                    package: '$(Pipeline.Workspace)/backend'

  - stage: Verify
    displayName: 'Post-Deployment Verification'
    dependsOn: Deploy
    jobs:
      - job: HealthCheck
        displayName: 'Run Health Checks'
        steps:
          - script: |
              curl -f https://job-portal-api.azurewebsites.net/api/health || exit 1
            displayName: 'Check Backend Health'

          - script: |
              curl -f https://job-portal-frontend.azurewebsites.net || exit 1
            displayName: 'Check Frontend Health'
```

## Branching Strategy

```
main (production)
  └── Protected branch
  └── Requires PR approval
  └── Triggers deployment to production

develop (staging)
  └── Active development
  └── Triggers deployment to staging (optional)
  └── Merge to main for releases

feature/[feature-name]
  └── Individual features
  └── Merge to develop when complete
  └── No automatic deployment
```

## Environment Variables Management

### How Environment Variables are Managed:

1. **Local Development:** `.env` files (not in git)
2. **Azure App Services:** Configured in App Service Settings
3. **Pipeline:** Stored as Azure DevOps Variables (secure)

### Pipeline Variables to Configure:

```yaml
variables:
  - group: 'production-secrets'  # Variable group in Azure DevOps
  - name: AZURE_SUBSCRIPTION
    value: 'your-subscription-id'
  - name: FRONTEND_APP_NAME
    value: 'app-job-portal-frontend'
  - name: BACKEND_APP_NAME
    value: 'app-job-portal-backend'
```

Notes: link the `production-secrets` variable group in the pipeline definition or via the pipeline settings UI.

## Rollback Strategy

If deployment fails or issues are detected:

1. **Automatic Rollback:** Pipeline fails → previous version stays live
2. **Manual Rollback:** Use Azure Portal to swap deployment slots
3. **Version Control:** Git revert → re-trigger pipeline

<!-- Removed sprint deliverable metadata and author footer. -->
