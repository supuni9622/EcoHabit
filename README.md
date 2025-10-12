# EcoHabit - Gamified Waste Management & Recycling App

A comprehensive gamified waste management and recycling application built with Next.js, Expo, and Firebase. EcoHabit encourages users to adopt sustainable habits through engaging gamification, educational content, and community features.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Firebase CLI
- Expo CLI (for mobile development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ecohabit.git
   cd ecohabit
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Firebase and API keys
   ```

4. **Start development servers**
   ```bash
   # Start all apps
   pnpm dev
   
   # Or start specific apps
   pnpm dev --filter=@ecohabit/web
   pnpm dev --filter=@ecohabit/mobile
   ```

## 📁 Project Structure

```
ecohabit/
├── apps/                          # Applications
│   ├── web/                      # Next.js PWA
│   ├── mobile/                   # Expo React Native
│   └── admin/                    # Admin panel (optional)
├── packages/                     # Shared packages
│   ├── ui/                      # Shared UI components
│   ├── shared/                  # Business logic & types
│   ├── firebase/                # Firebase utilities
│   └── eslint-config/           # Shared ESLint config
├── functions/                    # Firebase Cloud Functions
├── firebase/                     # Firebase configuration
└── docs/                        # Documentation
```

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages and apps
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean all build artifacts

### Package-Specific Scripts

```bash
# Web app
pnpm dev --filter=@ecohabit/web
pnpm build --filter=@ecohabit/web

# Mobile app
pnpm dev --filter=@ecohabit/mobile
pnpm build --filter=@ecohabit/mobile

# Shared packages
pnpm build --filter=@ecohabit/shared
pnpm build --filter=@ecohabit/ui
```

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project named "ecohabit"
3. Enable Authentication, Firestore, Storage, and Functions

### 2. Configure Authentication

Enable the following sign-in methods:
- Email/Password
- Google
- Facebook (optional)

### 3. Set up Firestore

The database will be automatically configured with the provided rules and indexes.

### 4. Configure Storage

Set up Firebase Storage with the provided rules.

### 5. Deploy Functions

```bash
cd functions
pnpm install
pnpm build
firebase deploy --only functions
```

## 📱 Mobile Development

### Expo Setup

1. **Install Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

2. **Start Expo development server**
   ```bash
   cd apps/mobile
   pnpm dev
   ```

3. **Run on device**
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal

### Building for Production

```bash
# Build for app stores
expo build:android
expo build:ios

# Or use EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

## 🌐 Web Development

### Next.js PWA

The web app is built with Next.js 14+ and includes:
- App Router
- TailwindCSS + HeroUI
- Three.js for 3D gamification
- PWA capabilities
- Service worker

### Development Server

```bash
cd apps/web
pnpm dev
```

Visit `http://localhost:3000` to see the web app.

## 🧪 Testing

### Run Tests

```bash
# All tests
pnpm test

# Specific package
pnpm test --filter=@ecohabit/shared
```

### Test Coverage

```bash
pnpm test --coverage
```

## 📦 Deployment

### Web App (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Mobile App (EAS)

1. Install EAS CLI
   ```bash
   npm install -g eas-cli
   ```

2. Configure EAS
   ```bash
   eas login
   eas build:configure
   ```

3. Build and submit
   ```bash
   eas build --platform all
   eas submit --platform all
   ```

### Firebase Functions

```bash
firebase deploy --only functions
```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env.local` and configure:

- Firebase configuration
- Google Maps API key
- Gemini API key
- Analytics keys

### Firebase Emulators

Start local Firebase emulators:

```bash
pnpm firebase:emulators
```

This starts:
- Firestore emulator (port 8080)
- Auth emulator (port 9099)
- Functions emulator (port 5001)
- Storage emulator (port 9199)
- UI (port 4000)

## 📚 Documentation

- [Project Overview](docs/product_idea.md)
- [Technical Architecture](docs/solution_architecture.md)
- [Development Plan](docs/development_plan.md)
- [Firebase Guidelines](docs/firebase_guideline.md)
- [UI/UX Guidelines](docs/ui_ux.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Vercel for web hosting
- Expo for mobile development
- Three.js for 3D graphics
- TailwindCSS for styling
- The open-source community