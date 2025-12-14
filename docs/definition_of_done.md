# Definition of Done (DoD)

This document defines when a user story or task is considered complete for our DevOps project.

---

## General
- Task is marked "Done" in Azure Boards.
- Code is committed to Azure DevOps Repos.
- Pull Request created and reviewed by at least one teammate.
- Code merged to main branch (no direct pushes).
- Feature works as described in acceptance criteria.
- No merge conflicts or breaking changes introduced.

---

##  Backend
- All API endpoints return correct HTTP status codes and data structures.
- Error handling implemented for all failure scenarios (e.g 500 errors).
- Automated tests written using Jest and Supertest.
- All tests pass locally (`npm test`).
- Code follows Express.js best practices.
- Environment variables documented in README.
- API endpoints documented with request/response examples.

---

##  Frontend
- Component renders correctly across breakpoints (mobile, tablet, desktop).
- Feature connects to backend API successfully.
- Loading states implemented for asynchronous operations.
- Error messages displayed for failed requests.
- Component tests written using Jest and React Testing Library.
- All tests pass locally (`npm test`).
- No console errors or warnings in browser.
- Accessibility basics considered (semantic HTML, ARIA labels where needed).

---

##  Infrastructure / DevOps
- Changes pushed to both Azure DevOps and GitHub repositories.
- CI/CD pipeline triggered automatically on push to main.
- All pipeline stages pass:
  - Code checkout from Azure DevOps
  - Dependency installation (`npm ci`)
  - Test execution
  - Build (frontend only)
  - Deployment to Azure App Service
- Application deployed successfully to Azure.
- Environment variables configured in Azure App Service.
- Both `AZDO_PAT` and `AZURE_CREDENTIALS` secrets valid.
- Pipeline run visible in GitHub Actions with green status.

---

##  Testing & Monitoring
- Unit tests written for new code (backend and frontend).
- Integration tests pass for API endpoints.
- Test coverage maintained or improved.
- Health check endpoint (`/api/health`) returns 200 OK.
- Application accessible via Azure URLs:
  - Frontend: `https://job-portal-frontend-f9dheecvatencefk.azurewebsites.net`
  - Backend: `https://job-portal-api-d7gectbxabcqaxa0.westeurope-01.azurewebsites.net`
- No runtime errors in Azure App Service logs.
- Manual smoke test performed on deployed application.

---

##  Code Quality
- Code follows project structure conventions.
- Functions and variables use descriptive names.
- Complex logic includes comments.
- No unused imports or commented-out code.
- `package.json` and `package-lock.json` in sync.
- Dependencies properly listed in correct `package.json` (root for backend, client for frontend).

---

##  Documentation
- README.md updated if setup/deployment steps change.
- API endpoints documented if new endpoints added.
- Architecture diagrams updated if system design changes.
- Environment variables documented.
- Code comments added for non-obvious logic.
- Relevant documentation files updated (ARCHITECTURE.md, FEATURES.md, TEST_PLAN.md).
