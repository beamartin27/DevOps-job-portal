# Sprint 3 Retrospective

**Sprint Duration**: December 3 – December 8  
**Sprint Goal**: Integrate database functionality, enable monitoring and Application Insights, and finalize architecture and deployment documentation

---

## What Went Well ✅

- Azure SQL Database successfully created and backend fully connected
- DB-backed features implemented with realistic error handling and validation
- Application Insights enabled for monitoring logs, failed requests, and performance
- Monitoring dashboards created with visibility into API and database behavior
- UI updates completed to display database-driven data and surface errors
- Technical uncertainties around Azure monitoring and instrumentation resolved

## What Didn't Go Well ❌

- Architecture and deployment documentation remained incomplete despite dependencies
- Documentation effort underestimated - implementation done before proper diagrams existed
- App Insights functional but not fully understood by whole team
- Monitoring dashboards created but interpretation unclear to some members
- Database tasks required backtracking due to missing decision history in architecture
- Late DB integration surfaced errors causing rushed fixes

## What We Learned 💡

- Documentation updates must happen parallel with development, not at sprint end
- Monitoring tools require learning time - enabling isn't enough, team must understand metrics
- Architecture should include DB schemas, error flows, and monitoring before implementation
- UI changes easier when backend contracts and DB models stabilized early
- Documentation clarity is as important as coding - unclear docs slow entire team

## Improvements Identified 🔧

- Dedicate explicit time each sprint for documentation
- Ensure architecture includes data flow, error propagation, and monitoring from start
- Improve communication between backend, frontend, and documentation owners
- Clarify monitoring responsibilities - ensure all know how to use App Insights
- Validate documentation updates in pull requests, not after deployments

## Team Agreements for Next Sprint 🤝

- Update architecture documents immediately when design decisions change
- Introduce monitoring and instrumentation earlier to catch errors faster
- Keep pipeline documentation aligned with actual implementation
- Ensure both code and documentation reflect work before closing tasks
- Establish clearer ownership for documentation, monitoring, and pipeline tasks
