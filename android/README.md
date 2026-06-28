# ScrollReminder (Android)

A personal Android app that interrupts mindless scrolling. When you've spent more than
a threshold (default 10 min) in a watched app in one sitting, it pops up your
"things to do when I have time" list — a calm nudge, not a punishment.

Built by Visible (Anita Solberg). Brand: black `#111111`, orange `#FF6600`.
Fully offline — there is no `INTERNET` permission.

## Tech

- Kotlin · Jetpack Compose · Material 3
- Min SDK 26, target/compile SDK 35
- Room (to-do items) + Preferences DataStore (settings)
- A foreground `Service` that polls the foreground app every ~5s via `UsageStatsManager`
- The interruption is a translucent full-screen Activity drawn over the scroll app
  (allowed in the background because the app holds `SYSTEM_ALERT_WINDOW`)

## Project layout

```
android/
├── app/
│   ├── build.gradle.kts
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/no/visible/scrollreminder/
│       │   ├── MainActivity.kt            # nav + service lifecycle wiring
│       │   ├── ScrollReminderApp.kt
│       │   ├── data/                       # Room + DataStore
│       │   ├── service/                    # FG service, foreground-app detection, timer logic
│       │   ├── overlay/                    # interruption Activity + Compose screen
│       │   ├── ui/screens/                 # onboarding, watched-apps, to-do, settings
│       │   ├── ui/theme/                   # black/orange theme
│       │   └── util/                       # permissions + installed-apps helpers
│       └── res/
├── settings.gradle.kts
└── gradlew
```

## Build

```bash
cd android
./gradlew assembleDebug      # APK at app/build/outputs/apk/debug/
# or open the android/ folder in Android Studio
```

You need the Android SDK installed (Android Studio, or `ANDROID_HOME` pointing at
command-line tools with platform 35). The AGP and AndroidX dependencies are fetched
from Google's Maven (`dl.google.com` / `maven.google.com`).

## First run

The two manual-grant permissions are the friction points; the Setup screen walks you
through both and shows live "Granted ✓ / Grant" status:

1. **Usage access** (`PACKAGE_USAGE_STATS`) — to read which app is in the foreground.
2. **Draw over other apps** (`SYSTEM_ALERT_WINDOW`) — so the to-do list can appear on top.

Then: pick apps to watch, add a few to-dos, tune the thresholds in Settings.

On aggressive OEMs (Samsung, Xiaomi…), disable battery optimization for the app so the
watcher isn't killed — there's a shortcut on the Setup screen.

## Tuning

All in Settings, persisted via DataStore:

| Setting | Default | Meaning |
|---|---|---|
| Reminder threshold | 10 min | time in a watched app before the reminder |
| Break resets timer | 60 s | leave the app this long and the sitting restarts |
| Cooldown | 5 min | don't nag again this soon in the same app |
| Watching on | on | master on/off without losing setup |

## Notes on verification

The core session-timer logic in `service/SessionTracker.kt` is pure Kotlin (no Android
deps) and was compiled and unit-checked directly. A full Gradle build was **not** run in
the authoring environment because Google's Maven was unreachable there; build it locally
with the Android SDK as above.
