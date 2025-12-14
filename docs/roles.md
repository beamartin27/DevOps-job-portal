# Scrum Roles — Job Portal Project

This document defines the Scrum roles for each sprint, based on the project plan and sprint assignments visible in Azure DevOps.

---

##  Team Members
| ID | Name | Focus Area |
|----|------|-------------|
| P1 | **Blanca Valdés Caparrós** | Product / Architecture |
| P2 | **Beatriz Martín Martín** | Azure Infrastructure |
| P3 | **George Vashakidze** | Backend / Database |
| P4 | **María José Coleman** | Frontend / UX |
| P5 | **Joud Suleiman Mohammad Taher** | Pipelines / Documentation |
| P6 | **Adriana Fernanda Casco** | Testing / Monitoring |

---
## Role Rotation in Practice

Although each team member had a primary expertise area (e.g., frontend, backend, infrastructure, pipelines), the team adopted a **lightweight rotation** of Scrum leadership roles so that everyone would experience both Product Ownership and Scrum Master responsibilities during the project.

This rotation was not the main driver of the workflow, but rather a practical way to share accountability and ensure all team members understood the Scrum process. The technical work remained aligned with each person’s specialization, while the rotating roles handled sprint facilitation, backlog refinement, and communication tasks.

The rotation aligned naturally with the work visible in Azure DevOps:

- Members taking on more architectural or requirement-focused tasks acted as **Product Owner** for that sprint.
- Members coordinating sprint meetings, resolving blockers, or ensuring deployment alignment acted as **Scrum Master**.
- All team members contributed as **Developers/DevOps Engineers**, regardless of the leadership role for that sprint.

This approach allowed the team to keep velocity high while still practicing shared leadership in a realistic DevOps environment.

##  Sprint-by-Sprint Roles

| Sprint | Product Owner | Scrum Master | Notes |
|---------|----------------|---------------|--------|
| **Sprint 0 – Preparation** | **Blanca (P1)** | **Joud (P5)** | Formed team, defined roles, created Azure subscription, initial repo, and backlog. |
| **Sprint 1 – Setup & Hello World** | **Blanca (P1)** | **Joud (P5)** | Defined Azure architecture (App Service, DB, App Insights, CI/CD). Created the skeleton app and first health endpoint. |
| **Sprint 2 – Core Features & CI/CD** | **George (P3)** | **Beatriz (P2)** | Implemented main backend & frontend features. Added automated tests and set up full CI/CD pipelines. |
| **Sprint 3 – Database & Monitoring** | **María José (P4)** | **Adriana (P6)** | Integrated database, logging, and Application Insights. Conducted code reviews and refined deployment automation. |
| **Sprint 4 – Final Polish & Demo** | **Adriana (P6)** | **Blanca (P1)** | Final testing, documentation, and demo preparation. Collected monitoring data, finalized architecture docs, and delivered final presentation. |

---

##  Summary of Responsibilities

- **Product Owner (PO)** → Ensures each sprint delivers business value. Owns backlog, priorities, and scope.  
- **Scrum Master (SM)** → Facilitates the sprint, ensures blockers are removed, and that Scrum process is followed.  
- **Developers/DevOps Engineers** → Build, test, and deploy the product based on sprint goals.  

| Role | Main Responsibilities |
|------|-----------------------|
| **P1 Blanca (Product Owner / Architect)** | Defines architecture, keeps backlog clean, leads product vision, supports documentation and final demo. |
| **P2 Bea (Azure Infra)** | Builds and maintains cloud infrastructure: App Service, SQL, App Insights. Supports CI/CD deployments. |
| **P3 George (Backend / DB)** | Owns backend logic and database integration, ensures stable API for frontend and monitoring. |
| **P4 MJ (Frontend / UX)** | Implements UI components and user flows, connects frontend to API, handles design polish. |
| **P5 Joud (Pipelines / Docs)** | Manages CI/CD pipelines, repo organization, and Scrum documentation (roles, DoD, architecture, retrospectives). |
| **P6 Adri (Testing / Monitoring)** | Owns automated tests, quality checks, and observability (Application Insights dashboards). |

---

##  Notes

Instead of fixed leadership roles, the team rotated Product Owner and Scrum Master duties to:

- Distribute project management responsibilities fairly  
- Ensure no single person carried facilitation overhead every sprint  
- Help each member understand how DevOps decisions affect backlog priorities  
- Keep the team flexible while respecting each member’s technical specialization  

Leadership rotated, but **technical roles remained stable** to ensure productivity:
- Backend tasks stayed with the backend developer,
- Infra tasks stayed with the cloud engineer,
- Pipelines stayed with the DevOps member, etc.

This hybrid approach helped the team stay efficient while still fulfilling Scrum requirements.

