# EcoHabit - Active Context

## Current Project State

### Phase: Planning & Setup
- **Status**: Pre-development phase
- **Focus**: Memory bank creation and project foundation
- **Next Milestone**: Monorepo structure setup and development environment

### Immediate Priorities
1. **Memory Bank Completion**: Finalizing comprehensive project documentation
2. **Monorepo Setup**: Turborepo structure with pnpm workspace
3. **Firebase Configuration**: Project setup and service configuration
4. **Development Environment**: Local development setup with emulators

## Recent Decisions & Rationale

### Technology Choices
- **Monorepo**: Turborepo + pnpm for efficient code sharing between web and mobile
- **Backend**: Firebase for serverless architecture and cost optimization
- **Testing**: Playwright for E2E testing with MCP integration for AI-assisted test maintenance
- **AI Integration**: Google Gemini API for personalized eco-coaching
- **3D Graphics**: Three.js for gamified visualizations and avatar progression

### Architecture Decisions
- **Domain-Driven Design**: Organize code by business domains rather than technical layers
- **Component Architecture**: Atomic design with compound components
- **State Management**: Zustand for client state, React Query for server state
- **Database Design**: Firestore with subcollections for user-specific data

### Cost Optimization Strategy
- **Firebase Free Tier**: Design to stay within free tier limits for MVP
- **Efficient Queries**: Batch operations and optimized Firestore indexes
- **Caching Strategy**: Reduce API calls through intelligent caching
- **Asset Optimization**: Compress images and 3D models for faster loading

## Active Considerations

### Technical Constraints
- **Firebase Free Tier Limits**: 50K reads/writes, 1GB storage per month
- **Gemini API Costs**: Limit chat interactions to control expenses
- **Sri Lankan Localization**: Multi-language support (English, Sinhala, Tamil)
- **Mobile Performance**: Ensure smooth experience on lower-end devices

### Development Approach
- **Spec-Driven Development**: Comprehensive documentation before implementation
- **AI-Assisted Development**: Use Cursor IDE for efficient code generation
- **Behavioral Psychology First**: Design decisions based on habit formation research
- **Mobile-First Design**: PWA with native mobile app for maximum reach

### Market-Specific Requirements
- **Sri Lankan Context**: Address local waste management challenges
- **Cultural Sensitivity**: Respectful messaging and timing
- **Local Recyclers**: Integration with 16 licensed e-waste collectors
- **Environmental Impact**: Focus on dengue prevention and coastal pollution

## Current Blockers & Challenges

### No Current Blockers
- All required documentation is complete
- Technology stack is finalized
- Market research is comprehensive
- Development approach is clear

### Potential Future Challenges
- **Firebase Free Tier**: May need optimization as user base grows
- **Gemini API Costs**: Monitor usage and implement rate limiting
- **3D Performance**: Ensure smooth experience across devices
- **Localization Complexity**: Three languages with cultural considerations

## Next Steps & Priorities

### Immediate Actions (Next 1-2 weeks)
1. **Complete Memory Bank**: Finish all documentation files
2. **Monorepo Setup**: Initialize Turborepo structure with pnpm
3. **Firebase Project**: Create and configure Firebase services
4. **Development Environment**: Set up local development with emulators
5. **Basic Authentication**: Implement Firebase Auth with social login

### Short-term Goals (Next 1-2 months)
1. **Core Features**: Habit logging, points system, streak tracking
2. **Gamification Engine**: Badge system, level progression, leaderboards
3. **Educational Content**: 25-day lesson program implementation
4. **AI Chat Integration**: Gemini API for personalized coaching
5. **Mobile App**: Expo setup with shared components

### Medium-term Goals (Next 3-6 months)
1. **Community Features**: Social sharing, friend connections, group challenges
2. **Maps Integration**: Recycler locator with Google Maps
3. **3D Gamification**: Three.js avatar progression and trophy room
4. **Advanced Analytics**: User behavior tracking and insights
5. **Sri Lankan Localization**: Multi-language support and cultural adaptation

## Active Development Focus

### Current Sprint: Memory Bank & Foundation
- **Duration**: 1-2 weeks
- **Goal**: Complete project documentation and setup
- **Deliverables**: 
  - Complete memory bank structure
  - Monorepo setup with basic configuration
  - Firebase project initialization
  - Development environment setup

### Next Sprint: Core Authentication & Onboarding
- **Duration**: 2-3 weeks
- **Goal**: User registration, login, and onboarding flow
- **Deliverables**:
  - Firebase Auth integration
  - Onboarding screens (web and mobile)
  - User profile setup
  - Basic navigation structure

## Key Metrics to Track

### Development Metrics
- **Code Coverage**: Target 90%+ for critical functions
- **Bundle Size**: Keep under 1MB for critical path
- **Performance**: Page load under 3 seconds on 3G
- **Accessibility**: WCAG 2.1 AA compliance

### Business Metrics (Future)
- **User Engagement**: Daily Active Users (DAU)
- **Retention**: 7-day and 30-day retention rates
- **Behavioral Impact**: Average streak length, actions per user
- **Environmental Impact**: Waste diverted from landfills

## Risk Mitigation

### Technical Risks
- **Firebase Costs**: Monitor usage and implement optimization early
- **Performance Issues**: Regular performance testing and optimization
- **Mobile Compatibility**: Test on various devices and screen sizes
- **3D Performance**: Implement fallbacks for low-end devices

### Business Risks
- **User Adoption**: Focus on psychological engagement from day one
- **Market Fit**: Regular user feedback and iteration
- **Competition**: Unique value proposition through gamification
- **Sustainability**: Cost-effective architecture for long-term viability

## Success Criteria

### Technical Success
- [ ] Monorepo setup with shared packages working
- [ ] Firebase services configured and tested
- [ ] Development environment fully functional
- [ ] Basic authentication flow working
- [ ] Mobile and web apps building successfully

### Product Success (Future)
- [ ] Users can register and complete onboarding
- [ ] Habit logging system functional
- [ ] Gamification mechanics working
- [ ] AI chat providing helpful responses
- [ ] Educational content engaging users

## Notes & Observations

### Key Insights
- **Behavioral Psychology**: Self-happiness approach is more effective than external rewards
- **Sri Lankan Market**: High smartphone penetration but limited recycling infrastructure
- **Technical Architecture**: Monorepo enables efficient code sharing between platforms
- **Cost Optimization**: Firebase free tier sufficient for MVP with proper design

### Lessons Learned
- **Documentation First**: Comprehensive planning prevents costly rework
- **User-Centric Design**: Psychological principles should drive all decisions
- **Local Context**: Market-specific features are crucial for adoption
- **Technical Simplicity**: Start simple and iterate based on user feedback

### Future Considerations
- **Scalability**: Architecture designed for growth beyond MVP
- **Internationalization**: Framework ready for expansion to other markets
- **Advanced Features**: 3D gamification and AR capabilities for future versions
- **Partnerships**: Integration with local recyclers and environmental organizations
