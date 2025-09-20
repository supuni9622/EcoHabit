# Testing and Bug Tracking – EcoHabit

## 1. Testing Strategy

### Unit Testing
- **Tools:** Jest + React Testing Library (frontend), Flutter test (mobile)
- **Scope:** Components, utility functions, hooks, gamification logic

### Integration Testing
- **Tools:** Cypress / Playwright
- **Scope:** End-to-end flows: habit logging, streak updates, AI chat, map interactions

### Backend Testing
- **Tools:** Firebase Emulator Suite
- **Scope:** Firestore rules, Cloud Functions triggers, notifications, AI API proxy

### QA Environment
- Use Firebase staging project
- Test all user stories before promotion to production
- Screenshots & video recording for verification

## 2. Bug Tracking

### Issue Tracking
- **Tool:** GitHub Issues
- **Labels:** bug, enhancement, feature, critical, minor
- **Board:** Kanban (To Do, In Progress, QA, Done)
- **Priority Levels:** P1 (Critical), P2 (Major), P3 (Minor)

### Logging & Monitoring
- Firebase Crashlytics for runtime errors and crashes
- Firestore logs for key actions: habit completion, streaks, points
- Console alerts for Firebase Functions errors

### Regression Testing
- Automated test suite for critical flows before each release
- Manual exploratory testing for UI/UX feedback

### Continuous Improvement
- Weekly bug triage meetings
- Feedback loop between QA and development
- User feedback collected via in-app AI chat prompts

