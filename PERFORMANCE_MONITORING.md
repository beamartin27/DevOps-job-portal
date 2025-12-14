# Performance, Reliability & Monitoring — Job Portal

This document captures the non-functional requirements (NFRs), SLOs, monitoring, alerting and verification steps for the Job Portal application.

## Purpose

- Define measurable performance and reliability targets.
- Provide monitoring and alerting guidance (Application Insights + Azure Monitor).
- Describe autoscale and incident verification procedures.

## Non-Functional Requirements (summary)

- Availability: production endpoints must have 99.9% uptime (monthly).
- Latency:
  - API median response time < 300ms under normal load.
  - API 95th percentile < 800ms under normal load.
  - Frontend key page first contentful paint < 2s on a typical mobile connection.
- Error budget: less than 0.1% downtime or critical failures per month.
- Durability: daily backups for the Azure SQL database, 7-day point-in-time restore.
- Security: secrets stored in Key Vault or secure pipeline variable groups; HTTPS enforced.

## Service-Level Objectives (SLOs)

- Uptime SLO: 99.9% (equates to ≈43.8 minutes downtime/month).
- Error-rate SLO: < 0.5% 5xx responses over a rolling 24h window.
- Latency SLO: 95th percentile API latency < 800ms.

## Monitoring Setup

- Instrumentation:
  - Backend: Application Insights SDK (track requests, dependencies, exceptions, custom events).
  - Frontend: Browser instrumentation to collect page load and frontend exceptions (sampled to limit cost).
- Logs: backend structured logs (JSON) forwarded to Application Insights or Log Analytics workspace.
- Metrics: request count, failure count, response time percentiles (p50/p95/p99), CPU and memory for App Services.

## Alerts (recommended)

- High error rate: trigger when 5xx rate > 5% over 5 minutes.
- Health endpoint failure: trigger when `GET /api/health` fails on 3 consecutive checks.
- High latency: trigger when p95 latency > 1000ms for 10 minutes.
- Resource saturation: trigger when App Service CPU > 80% for 10 minutes.

Alert actions:

- Send to PagerDuty/Teams/Email and create an incident ticket.
- Run remediation runbook (scale up/out, restart service, inspect recent deploys).

## Autoscale and Recovery

- Autoscale rules for App Service (example):
  - Scale out by 1 instance when CPU > 70% for 5 minutes.
  - Scale in when CPU < 30% for 10 minutes and p95 latency < 600ms.
- Use deployment slots for safe swaps and quick rollbacks.

## Backups & Retention

- Azure SQL: automated backups retained per subscription plan (configure 7–14 day retention for dev/prod).
- Application logs: retain 30 days in Log Analytics; move to cold storage for longer retention if needed.

## Verification & Tests

- Post-deploy smoke tests:
  - `GET /api/health` returns 200 and expected JSON.
  - Frontend root loads and contains app shell string.
- Load test: run a focused load test against `GET /api/jobs` to validate p95 latency at expected concurrency.
- Chaos test: simulate a single instance failure and verify autoscale / failover behaviour.

## Where NFRs are referenced

- This doc (`PERFORMANCE_MONITORING.md`) — canonical NFR and monitoring rules.
- `ARCHITECTURE.md` — high-level summary and pointers to this file.
- `TEST_PLAN.md` — contains acceptance criteria for performance test cases.

## Quick runbook (on alert)

1. Check Application Insights for recent exceptions and failed requests.
2. Check pipeline recent deploys for potential rollback.
3. If CPU/memory alerts, scale out via portal or runbook.
4. If 3rd party dependency failing (DB), follow DB failover/runbook steps.

---

If you'd like, I can convert alert rules to ARM/Bicep snippets for automated provisioning.
# Performance, Reliability & Monitoring — Job Portal

This document captures the non-functional requirements (NFRs), SLOs, monitoring, alerting and verification steps for the Job Portal application.

## Purpose

- Define measurable performance and reliability targets.
- Provide monitoring and alerting guidance (Application Insights + Azure Monitor).
- Describe autoscale and incident verification procedures.

## Non-Functional Requirements (summary)

- Availability: production endpoints must have 99.9% uptime (monthly).
- Latency:
  - API median response time < 300ms under normal load.
  - API 95th percentile < 800ms under normal load.
  - Frontend key page first contentful paint < 2s on a typical mobile connection.
- Error budget: less than 0.1% downtime or critical failures per month.
- Durability: daily backups for the Azure SQL database, 7-day point-in-time restore.
- Security: secrets stored in Key Vault or secure pipeline variable groups; HTTPS enforced.

## Service-Level Objectives (SLOs)

- Uptime SLO: 99.9% (equates to ≈43.8 minutes downtime/month).
- Error-rate SLO: < 0.5% 5xx responses over a rolling 24h window.
- Latency SLO: 95th percentile API latency < 800ms.

## Monitoring Setup

- Instrumentation:
  - Backend: Application Insights SDK (track requests, dependencies, exceptions, custom events).
  - Frontend: Browser instrumentation to collect page load and frontend exceptions (sampled to limit cost).
- Logs: backend structured logs (JSON) forwarded to Application Insights or Log Analytics workspace.
- Metrics: request count, failure count, response time percentiles (p50/p95/p99), CPU and memory for App Services.

## Alerts (recommended)

- High error rate: trigger when 5xx rate > 5% over 5 minutes.
- Health endpoint failure: trigger when `GET /api/health` fails on 3 consecutive checks.
- High latency: trigger when p95 latency > 1000ms for 10 minutes.
- Resource saturation: trigger when App Service CPU > 80% for 10 minutes.

Alert actions:
- Send to PagerDuty/Teams/Email and create an incident ticket.
- Run remediation runbook (scale up/out, restart service, inspect recent deploys).

## Autoscale and Recovery

- Autoscale rules for App Service (example):
  - Scale out by 1 instance when CPU > 70% for 5 minutes.
  - Scale in when CPU < 30% for 10 minutes and p95 latency < 600ms.
- Use deployment slots for safe swaps and quick rollbacks.

## Backups & Retention

- Azure SQL: automated backups retained per subscription plan (configure 7–14 day retention for dev/prod).
- Application logs: retain 30 days in Log Analytics; move to cold storage for longer retention if needed.

## Verification & Tests

- Post-deploy smoke tests:
  - `GET /api/health` returns 200 and expected JSON.
  - Frontend root loads and contains app shell string.
- Load test: run a focused load test against `GET /api/jobs` to validate p95 latency at expected concurrency.
- Chaos test: simulate a single instance failure and verify autoscale / failover behaviour.

## Where NFRs are referenced

- This doc (`PERFORMANCE_MONITORING.md`) — canonical NFR and monitoring rules.
- `ARCHITECTURE.md` — high-level summary and pointers to this file.
- `TEST_PLAN.md` — contains acceptance criteria for performance test cases.

## Quick runbook (on alert)

1. Check Application Insights for recent exceptions and failed requests.
2. Check pipeline recent deploys for potential rollback.
3. If CPU/memory alerts, scale out via portal or runbook.
4. If 3rd party dependency failing (DB), follow DB failover/runbook steps.

---

I can convert any of the alert examples to ARM/Bicep snippets if you want infrastructure-as-code rules next.
