# UI/UX Document – EcoHabit

App Theme: “Eco-Journey: Empower, Act, Celebrate”

## Theme & Design Principles

- **Theme**: Nature-inspired, soft greens, ocean blues, and earthy tones.
- **Design Style**: Minimal, clean, gamified with playful animations.
- **Principles**:
  - Habit-forming psychology first
  - Clear feedback loops
  - Accessible and mobile-first
  - Delightful animations (confetti, sparkles, eco-icons)

### Color Palette:

- Primary: #4CAF50 (green) → sustainability, growth, action
- Secondary: #FFB74D (warm orange) → energy, positivity, encouragement
- Accent: #2196F3 (blue) → trust, clarity, environmental water reference
- Background: #FAFAFA (light) → clean, minimalistic

### Typography:

- Headers: Poppins Bold → modern, friendly
- Body: Inter / Roboto → easy readability for storytelling

### UI Style:

- Rounded cards, smooth animations
- Micro-interactions: confetti, badges, progress meters
- Storytelling panels for lessons: swipeable, interactive

### UX Principles:

- Emotionally engaging → storytelling + visuals
- Habit reinforcement → streaks, points, micro-rewards
- Minimal friction → fast logging, micro-actions
- Social validation → shareable achievements

---

## Key Flow Overview (Daily User Experience)

1. User opens app → Home Dashboard

- Shows daily challenge, streaks, badges, and impact meter

2. Lesson Delivery & Storytelling

- Micro-lesson → visual + interactive content
- AI reflection prompt: “How do you feel about today’s lesson?”

3. Logging Action (Self-Reported)

- User logs recycling / micro-action
- Backend calculates points, updates streaks, triggers micro-rewards

4. Feedback / Gamification

- Confetti / animation → badge unlock → level progress
- Optional leaderboard update

5. Reflection / AI Chat

- AI responds empathetically → encourages habit continuation
- Journaling / reflection tracked in Firestore

6. Notifications & Reminders

- FCM pushes daily challenges / streak reminders / unlocks

7. Community / Social Sharing (Optional)

- Share badges / achievements on social platforms
- Team challenges → peer motivation


---

## Core Screens

### 1. Onboarding
- Storytelling-driven intro (images + text about plastic impact on oceans, animals, climate)
- Simple sign-in (Google, Facebook, Email)
- Avatar selection (user personal eco-hero)

### 2. Home Dashboard
- Daily Eco Quest prominently displayed
- Quick Log Action ("I recycled today")
- Streak tracker (🔥 streak counter)
- Progress stats (trees saved, plastic avoided)
- Emotional feedback message

### 3. Lesson & Story Flow
- Micro-stories with images (turtles, birds, ocean life)
- Short eco-lessons (<2 min)
- Unlock content after completing quests
- Progress shown as chapters in a book

### 4. Challenges & Quests
- Daily and weekly challenges
- Example: "Say no to plastic bags this week"
- Completion unlocks badges
- Leaderboard for friends/community

### 5. Rewards & Profile
- Points wallet
- Badges, trophies, titles
- Customizable eco-avatar
- Shareable achievements

### 6. Recycler Finder Map
- Map view with nearest recyclers pinned
- Filter by waste type (plastic, paper, e-waste)
- Directions via Google Maps integration

### 7. AI Chat (Gemini)
- Conversational space for users to express feelings about recycling
- Eco-coach style: motivational + supportive
- Daily reflection prompts

---

## Interactions & Gamification Mechanics
- Confetti after completing challenges
- Variable reward system (sometimes points, sometimes badge, sometimes story unlock)
- Streak notifications (push)
- Surprise "Eco Hero of the Day" feature

---

## Accessibility
- Font scaling for readability
- High-contrast mode
- Sinhala & Tamil support planned for scaling

---

## Example Flows

**User Morning Flow:**
1. Open app → See today’s Eco Quest
2. Log yesterday’s recycling → Confetti + points
3. Watch short story → Unlock badge
4. Quick chat with eco-coach

**Weekly Flow:**
1. Finish 5 daily quests → Unlock “Plastic Warrior” badge
2. See cumulative impact → Share on social media
3. Plan next week’s challenge

## ✅ Key Principles:

- Keep friction minimal (quick actions, self-reporting enough)
- Focus on psychological rewards (dopamine hits, social recognition, sense of purpose)
- Make content short, visual, story-driven
- Encourage daily micro-habits → eventually lead to real recycling behavior

