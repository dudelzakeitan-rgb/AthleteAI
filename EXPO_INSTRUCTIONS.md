# AthleteAI — Expo Go Testing Guide

## Prerequisites
- Node.js 18+ installed on your computer
- A smartphone (iOS or Android) with the **Expo Go** app installed
  - iOS: https://apps.apple.com/app/expo-go/id982107779
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- Your phone and computer must be on the **same Wi-Fi network**

---

## 1. Install Dependencies

```bash
npm install
```

This installs all Expo, React Native, and navigation packages.

---

## 2. Start the Expo Dev Server

```bash
npx expo start
```

You will see output like this in the terminal:

```
Metro waiting on exp://192.168.x.x:8081
› Press s │ switch to Expo Go
› Press a │ open Android
› Press i │ open iOS simulator

██████████████
█  ████████  █   ← QR CODE HERE
█  ████████  █
██████████████

exp://192.168.x.x:8081
```

---

## 3. Scan the QR Code with Expo Go

### On iOS:
1. Open the **Camera** app
2. Point it at the QR code in the terminal
3. Tap the notification that appears
4. Expo Go will open and load the app

### On Android:
1. Open the **Expo Go** app
2. Tap **"Scan QR code"**
3. Point it at the QR code in the terminal
4. The app will load automatically

---

## 4. Using the App

Once loaded, you'll see the **AthleteAI** home screen with a bottom tab bar:

| Tab | Description |
|-----|-------------|
| **Home** | Overview, stats, quick actions |
| **Sports** | Choose a sport to start training |
| **Dashboard** | Workout history, achievements |
| **AI Coach** | Chat with your AI coach |
| **More** | Progress, Video Analysis, Nutrition, Settings |

### Core Flow:
1. Tap **Sports** → choose your sport (e.g., Swimming)
2. Select an improvement area (e.g., Speed)
3. Complete the 5-step questionnaire
4. View your **AI-generated training plan** (Step 6)
5. Tap **Start Training** to see the full plan with exercise demos

### Exercise Demos:
In the Training Plan screen, tap any **Dryland exercise** card to open a demo modal with step-by-step instructions.

---

## 5. Troubleshooting

**"Network request failed" or can't connect:**
- Make sure phone and computer are on the same Wi-Fi
- Try pressing `s` in the terminal to switch to Expo Go tunnel mode

**"Unable to resolve module":**
- Run `npm install` again
- Restart the server with `npx expo start --clear`

**App loads but looks broken (no styles):**
- NativeWind may need a cache clear: `npx expo start --clear`

**"Invariant Violation: requireNativeComponent":**
- Some packages need a custom dev build. Run: `npx expo install --fix`

---

## 6. Key Technical Notes

- **Styling**: Uses NativeWind v4 (Tailwind CSS for React Native)
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **Icons**: lucide-react-native
- **Backend**: Supabase (data persists across sessions)
- **Charts**: Replaced with native stat cards (no charting lib needed)

---

## 7. Building for Production (optional)

To create a standalone app:

```bash
npx eas build --platform ios
# or
npx eas build --platform android
```

Requires an Expo account and EAS CLI. Not needed for Expo Go testing.
