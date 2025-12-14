# Definition of Done (DoD)

This document defines when a user story or task is considered complete for our MVP project.

---

## General
- The task is finished and marked “Done” in Azure Boards.
- Code is committed and merged through a Pull Request (no direct pushes to main).
- The app builds and runs successfully.
- Peer review completed by at least one teammate.
- The feature works as described in the user story.

---

##  Backend
- The endpoint runs correctly and returns the expected data.
- Basic error handling is implemented (no crashes on bad input).
- A simple test (manual or automated) confirms the endpoint works.

---

##  Frontend
- The feature displays correctly and connects to the backend.
- UI has no major layout or functionality issues.
- Works on the main browser used for demo (e.g., Chrome).

---

##  Infrastructure / DevOps
- CI pipeline runs automatically on new commits (build + test).
- Deployment (CD) to Azure App Service works without errors.
- Environment variables and secrets are correctly configured.

---

##  Testing & Monitoring
- At least one health check or test passes in the pipeline.
- App is accessible from the Azure URL.
- Application Insights or logs show no major runtime errors.

---

##  Documentation
- README or related docs are updated if something changes.
- Relevant files (e.g., DoD, Roles, Architecture) are up to date.
