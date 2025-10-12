# EcoHabit - Technology Context

## Development Environment

### Core Requirements
- **Node.js**: v18+ (LTS recommended)
- **Package Manager**: pnpm (faster, disk-efficient)
- **IDE**: Cursor (AI-assisted development)
- **Version Control**: Git with GitHub
- **OS Support**: Windows, macOS, Linux

### Development Tools
- **Monorepo**: Turborepo for workspace management
- **TypeScript**: Strict mode enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates

## Frontend Technology Stack

### Web Application (Next.js)
- **Framework**: Next.js 14+ with App Router
- **React**: 18+ with concurrent features
- **TypeScript**: Strict typing throughout
- **Styling**: TailwindCSS + HeroUI components
- **3D Graphics**: Three.js with react-three-fiber
- **State Management**: Zustand + React Query
- **Animations**: Framer Motion for micro-interactions
- **PWA**: Service worker for offline functionality

### Mobile Application (Expo)
- **Framework**: Expo SDK 50+
- **React Native**: Latest stable version
- **TypeScript**: Shared with web application
- **Navigation**: Expo Router for file-based routing
- **State Management**: Shared Zustand stores
- **Push Notifications**: Expo Notifications
- **Over-the-Air Updates**: Expo Updates

### Shared Packages
- **UI Components**: HeroUI-based component library
- **Business Logic**: Shared TypeScript utilities
- **Firebase**: Unified Firebase configuration
- **Types**: Shared TypeScript interfaces
- **Validation**: Zod schemas for data validation

## Backend Technology Stack

### Firebase Services
- **Authentication**: Firebase Auth (Email, Google, Facebook)
- **Database**: Firestore (NoSQL, real-time)
- **Functions**: Cloud Functions (Node.js, serverless)
- **Storage**: Firebase Storage (media files)
- **Messaging**: Firebase Cloud Messaging (push notifications)
- **Analytics**: Firebase Analytics + Google Analytics
- **Hosting**: Firebase Hosting (backup to Vercel)

### External APIs
- **AI Chat**: Google Gemini API for personalized coaching
- **Maps**: Google Maps API for recycler locator
- **Image Processing**: Next.js Image optimization
- **Email**: Firebase Extensions or SendGrid

## Testing Technology Stack

### End-to-End Testing
- **Playwright**: Cross-browser E2E testing
- **Playwright MCP**: AI-assisted test generation and maintenance
- **Test Coverage**: User journeys, critical paths
- **Visual Regression**: UI consistency testing
- **Performance**: Load time and interaction testing

### Unit & Integration Testing
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **Firebase Emulator**: Backend integration testing
- **MSW**: API mocking for external services
- **Accessibility**: jest-axe for a11y testing

### Testing Strategy
- **Unit Tests**: Individual component and utility functions
- **Integration Tests**: API routes and Firebase functions
- **E2E Tests**: Complete user workflows
- **Visual Tests**: UI component regression testing
- **Performance Tests**: Load and stress testing

## Database Architecture

### Firestore Collections
```typescript
// Core collections
users/                    # User profiles and preferences
habitLogs/               # Daily action logging
userStreaks/            # Streak tracking
badges/                 # Badge definitions
userAchievements/       # User badge progress
lessons/                # Educational content
challenges/             # Community challenges
leaderboards/           # Rankings and competitions
recyclingLocations/     # Map data for recyclers
```

### Data Models
- **User**: Profile, gamification, progress, social data
- **HabitLog**: Action type, quantity, points, impact
- **Badge**: Requirements, rewards, rarity levels
- **Lesson**: Content, media, AI prompts, gamification
- **Challenge**: Requirements, participants, rewards

### Indexing Strategy
- **Composite Indexes**: Multi-field queries for leaderboards
- **Array Indexes**: Badge and achievement tracking
- **Geospatial**: Location-based recycler queries
- **Time-based**: Streak and progress analytics

## AI Integration

### Google Gemini API
- **Chat Interface**: Personalized eco-coaching
- **Reflection Prompts**: Daily emotional check-ins
- **Educational Content**: Dynamic lesson explanations
- **Content Generation**: Personalized challenge descriptions
- **Safety Moderation**: Content filtering and safety checks

### AI Features
- **Contextual Responses**: User progress-aware coaching
- **Emotional Intelligence**: Empathetic and encouraging tone
- **Educational Q&A**: Environmental knowledge base
- **Habit Coaching**: Personalized behavior change guidance
- **Content Personalization**: Adaptive lesson delivery

## Maps & Location Services

### Google Maps Integration
- **Recycler Locator**: Find nearby recycling centers
- **Directions**: Native maps app integration
- **Geocoding**: Address to coordinates conversion
- **Places API**: Business information and reviews
- **Distance Calculation**: Nearest facility recommendations

### Location Features
- **GPS Integration**: User location detection
- **Filtering**: Waste type and service availability
- **Operating Hours**: Real-time business hours
- **Contact Info**: Phone, email, website links
- **User Reviews**: Community feedback and ratings

## 3D Graphics & Gamification

### Three.js Integration
- **Avatar System**: 3D character progression
- **Trophy Room**: 3D badge collection display
- **Eco World**: Interactive environmental scenes
- **Particle Effects**: Celebration animations
- **Asset Management**: GLTF/GLB model optimization

### Performance Optimization
- **Lazy Loading**: Load 3D assets on demand
- **Asset Compression**: Optimized file sizes
- **Fallback Rendering**: 2D alternatives for low-end devices
- **Progressive Enhancement**: Basic → Enhanced experience

## State Management

### Zustand Stores
```typescript
// User state
interface UserStore {
  user: User | null;
  profile: UserProfile | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// Gamification state
interface GamificationStore {
  points: number;
  level: number;
  streak: number;
  badges: Badge[];
  addPoints: (amount: number) => void;
  updateStreak: (days: number) => void;
}
```

### React Query Integration
- **Server State**: User data, habits, leaderboards
- **Caching Strategy**: Stale-while-revalidate
- **Optimistic Updates**: Immediate UI updates
- **Background Refetching**: Keep data fresh
- **Error Handling**: Graceful failure states

## Naming Conventions

### File Naming
- **Components**: PascalCase (e.g., `HabitLogger.tsx`)
- **Handlers**: kebab-case with domain prefix (e.g., `habit.log.handler.ts`)
- **Services**: PascalCase with Service suffix (e.g., `GamificationService.ts`)
- **Types**: kebab-case (e.g., `user.types.ts`)
- **Utils**: kebab-case (e.g., `date.utils.ts`)

### Directory Organization
- **Domain-Driven**: Group by business domain, not technical layer
- **Plural Names**: Collections (e.g., `components/`, `handlers/`)
- **Separation of Concerns**: Clear boundaries between layers
- **Shared Code**: Common utilities in packages/

## Development Workflow

### Code Quality
- **TypeScript**: Strict mode with comprehensive typing
- **ESLint**: Airbnb config with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality gates
- **Conventional Commits**: Standardized commit messages

### Testing Workflow
- **Unit Tests**: Run on every commit
- **Integration Tests**: Run on pull requests
- **E2E Tests**: Run on deployment
- **Visual Tests**: Run on UI changes
- **Performance Tests**: Run on major releases

### Deployment Pipeline
- **Development**: Local development with Firebase emulators
- **Staging**: Preview deployments for testing
- **Production**: Automated deployment on main branch
- **Monitoring**: Error tracking and performance monitoring

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Route and component-based splitting
- **Image Optimization**: Next.js Image with WebP format
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker for offline functionality
- **Lazy Loading**: Components and assets loaded on demand

### Backend Performance
- **Firestore Indexes**: Optimized query performance
- **Batch Operations**: Reduce read/write operations
- **Caching**: Frequently accessed data caching
- **Cost Optimization**: Stay within Firebase free tier
- **Monitoring**: Performance metrics and alerts

## Security Considerations

### Data Protection
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: API endpoint protection
- **Data Encryption**: Sensitive data encryption
- **Privacy Controls**: User data sharing preferences
- **GDPR Compliance**: Data protection regulations

### Authentication Security
- **JWT Tokens**: Secure session management
- **Role-Based Access**: Permission-based features
- **Social Login**: Secure OAuth integration
- **Anonymous Mode**: Guest access with limitations
- **Session Management**: Automatic timeout and refresh

## Deployment Targets

### Web Application
- **Primary**: Vercel (optimized for Next.js)
- **Backup**: Firebase Hosting
- **CDN**: Global edge caching
- **SSL**: Automatic HTTPS certificates
- **Custom Domain**: Production domain configuration

### Mobile Application
- **Distribution**: Expo Application Services (EAS)
- **App Stores**: iOS App Store and Google Play Store
- **Over-the-Air**: Quick updates without store approval
- **Push Notifications**: FCM integration
- **Deep Linking**: Seamless web-to-app transitions

### Backend Services
- **Functions**: Firebase Cloud Functions (serverless)
- **Database**: Firestore (managed NoSQL)
- **Storage**: Firebase Storage (media files)
- **CDN**: Global content delivery
- **Monitoring**: Firebase Performance Monitoring
