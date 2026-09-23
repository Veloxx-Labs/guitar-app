# Noodle — Mobile App

**Stack:** Next.js static export `out/` → Capacitor wrapper → Android / iOS WebView.

## What was done
- `capacitor.config.ts` — appId `com.noodle.guitar`, `webDir: out`, warm `#faf9f5` status bar
- `android/` + `ios/` platforms added via `npx cap add`
- Permissions: `AndroidManifest.xml:40` added `RECORD_AUDIO` + `MODIFY_AUDIO_SETTINGS`, `Info.plist:68` added `NSMicrophoneUsageDescription` (audio stays on-device)
- UI: `src/app/layout.tsx:1` viewport `viewportFit cover`, safe-area `env(safe-area-inset-*)`, `CapacitorInit.tsx` + `lib/capacitor/init.ts` for StatusBar, `MobileNav.tsx` bottom tab (Home/Tuner/Metro) on `lg:hidden`, `globals.css:95` tap-highlight + overscroll tweaks
- Scripts `package.json:5`: `cap:sync`, `cap:android`, `cap:build`, `mobile:dev`

## Prerequisites

### Android (Windows)
- Install Android Studio + SDK + platform-tools (adb)
- Set `ANDROID_HOME` env var
- Accept licenses: `sdkmanager --licenses`
- Device: enable USB debugging, or create AVD emulator

### iOS (macOS only)
- Xcode + `ios/App/App` — open with `npx cap open ios`

## Workflow

### 1. Dev with live reload on device (recommended)
Uncomment in `capacitor.config.ts:8`:
```ts
server: { url: 'http://192.168.0.252:3000', cleartext: true }
```
Then:
```
npm run dev          # keep running on 192.168...
npx cap run android --livereload --external
# or: npm run mobile:dev
```

### 2. Production build (static)
```
npm run cap:build    # next build → out → cap sync android
npx cap run android  # builds APK via Gradle and installs to device/emulator
# or open studio:
npx cap open android
# then Run from Android Studio
```

### 3. Web PWA still works
```
npm run dev   # http://localhost:3000
npm run build # out/ for Netlify/any static host
```

## Permissions flow
- Tuner page `src/app/tuner/page.tsx` calls `getUserMedia` — WebView will show native permission prompt (Android/iOS). If denied, shows “Allow mic access” banner.
- No audio leaves device.

## Store builds
- Android: `android/app/build.gradle` versionCode/versionName, sign with keystore → `gradlew assembleRelease`
- iOS: Xcode Archive → TestFlight

## Troubleshooting
- `npx cap doctor` — check Android SDK
- Clear WebView cache: uninstall app from device before reinstall
- If `npx cap run android` fails with `SDK not found`, set `ANDROID_HOME=C:\Users\<you>\AppData\Local\Android\Sdk`
- Dev server not loading on device? Ensure phone + PC same WiFi, firewall allows 3000

## Next steps (optional)
- Splash screen: `npm i @capacitor/splash-screen` + `npx cap sync`
- Icons: replace `android/app/src/main/res/mipmap-*` and `ios/App/App/Assets.xcassets`
- Haptics on metronome tick: `npm i @capacitor/haptics`
