# Sprint 2 Retrospective

**Sprint Duration**: November 27 – December 2  
**Sprint Goal**: Enable CI/CD pipelines for frontend and backend, complete core MVP flows, and deploy both services to Azure

---

## What Went Well ✅

- Successfully created frontend App Service with defined deployment target
- Initial CI/CD pipelines created for both backend and frontend
- Several frontend MVP views and user flows implemented
- Product backlog refined and architecture documentation improved
- Basic automated tests introduced as foundation for quality practices

## What Didn't Go Well ❌

- CI/CD pipelines marked "Done" but not production-ready:
  - Frontend pipeline lacked complete environment configuration
  - Backend pipeline unstable with inconsistent deployments
  - Secrets and Azure credentials not fully integrated
- Architecture document still lacked clarity on App Insights, DB integration, and monitoring
- Underestimated difficulty of creating pipelines with multiple services
- Inconsistent coordination between pipeline creators caused duplication
- Backend MVP features required more work than expected
- Timeboxed sprint left "Done" tasks not production-ready

## What We Learned 💡

- CI/CD requires far more planning and shared understanding than anticipated
- Documentation must evolve during implementation, not only at task end
- Clearer roles needed for critical infrastructure tasks like pipelines
- Testing integration into pipeline is non-trivial - plan earlier
- Frontend ↔ Backend communication significantly improves development speed

## Improvements Identified 🔧

- Break CI/CD tasks into smaller steps with clear verification criteria
- Standardize and document environment variables, secrets, and Azure configuration
- Dedicate one person to pipeline ownership with others supporting
- Validate deployments in Azure before marking pipeline tasks Done
- Keep architecture document aligned as new services are added

## Team Agreements for Next Sprint 🤝

- Pipelines must deploy successfully end-to-end before closing tasks
- Perform code reviews before merging pipeline changes
- Document pipeline behavior directly in repo to avoid confusion
- Add App Insights and Azure SQL to architecture before coding
- Increase communication in standups around blockers and uncertainty
