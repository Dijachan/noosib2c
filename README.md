# Noosi

## Overview
Noosi is a mobile healthcare application designed to empower patients in managing their health routines. It provides a centralized, secure platform for scheduling medications, tracking adherence, and engaging with pharmacy services. 

The application solves the critical problem of medication non-adherence by replacing scattered reminders and confusing schedules with an intuitive, native mobile experience. It is built for patients who need a reliable, easy-to-use tool to stay on top of their health regimens.

## Features
- **Simulated Authentication & Onboarding Flow:** A fully designed, multi-step mockup of the sign-up, login, and patient profile creation process (simulated for demonstration purposes).
- **Live Hardware Data Integration:** The dashboard displays real medication adherence and activity log data fetched directly from Supabase, syncing with physical Noosi hardware.
- **Medication Management:** Search for drugs, add them to a personalized care schedule, and map out specific time slots.
- **Adherence Tracking:** Visual insights into medication adherence with detailed activity logs and charts.
- **Pharmacy Hub:** A dedicated hub to interact with pharmacy services.
- **Smart Navigation Flow:** Enforced multi-step onboarding (Patient Profile, Consent, Device Pairing) before accessing the main app.
- **Custom UI/UX:** Clean, responsive design featuring glassmorphism elements, native-like interactions, and accessible typography.

## Tech Stack
- **Framework:** React Native & Expo
- **Language:** TypeScript
- **Backend & Auth:** Supabase
- **State Management:** Zustand & React Context
- **Navigation:** React Navigation v7
- **UI & Data Visualization:** React Native Gifted Charts, Expo Blur

## Architecture / How It Works
Noosi follows a modern client-server mobile architecture:
- **Client App:** Built with React Native and Expo, providing a native feel across iOS and Android devices.
- **Routing State Machine:** The app uses a strict 3-tier routing architecture (`AuthNavigator` -> `OnboardingNavigator` -> `AppNavigator`) governed by a global `AuthContext` to ensure users complete required setup steps before accessing sensitive health data.
- **Backend Services & Hardware Integration:** Live dashboard data (medication adherence and activity logs) is fetched directly from our Supabase database, which syncs with physical Noosi hardware. For this demonstration, the initial user authentication and onboarding flow is simulated and locally managed using Zustand and React Context.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator
- A Supabase account (for backend configuration)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd noosib2c
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add your Supabase credentials (e.g., `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`).

### Running Locally
Start the Expo development server:
```bash
npx expo start
```
Press `i` to open in the iOS simulator, or `a` to open in an Android emulator.

## Usage
1. **Sign Up:** Create a new account using an email address.
2. **Onboarding:** Complete your Patient Profile, provide necessary consents, and optionally pair medical devices.
3. **Add Medications:** Navigate to the Meds Tray, search for a drug, and map it to your daily schedule.
4. **Track Progress:** View the Home dashboard to see daily adherence rates, recent activity logs, and upcoming medication slots.
5. **Manage Health:** Access the Pharmacy Hub for additional resources and services.

## Project Structure
- `/src/screens/`: Contains the main UI views, categorized by feature area (`auth`, `home`, `medications`, `health`, `settings`).
- `/src/components/`: Reusable UI components used across different screens.
- `/src/context/`: Global React Context providers (e.g., `AuthContext`, `MedicationContext`).
- `/src/lib/`: Third-party service configurations, such as the `supabase.ts` client.
- `/src/hooks/`: Custom React hooks for shared logic.
- `App.tsx`: The application entry point and root navigation controller.

## Challenges & Decisions
- **Strict Onboarding Funnel:** A major design decision was separating the navigation into three distinct stacks (Auth, Onboarding, App). This prevents un-onboarded users from deep-linking into the app and ensures all legal consents and patient profiles are completed upfront.
- **Supabase Integration:** Chose Supabase for its robust PostgreSQL database and strictly typed data fetching, which pairs exceptionally well with our TypeScript architecture.
- **Performance Optimization:** Handled complex UI requirements (like the Pharmacy Hub header and infinite scrolling logs) by utilizing native-driven animations and efficient list rendering techniques within React Native.

## Future Improvements
- **Offline Mode:** Implement local-first data caching so patients can check their schedules and log medication doses even without an internet connection.
- **Push Notifications:** Integrate native push notifications to actively remind users of upcoming medication slots.
- **Hardware Integrations:** Fully flesh out the `DevicePairingScreen` to sync with bluetooth-enabled health tracking devices.

## Author
Khadijah Arowosegbe
https://github.com/Dijachan
