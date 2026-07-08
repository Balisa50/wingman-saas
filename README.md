# Wingman

Your AI wingman for texting. Paste what they said, pick a vibe, and get replies
that actually sound like **you** — not copy-paste pickup lines. Think Rizz, but
it reads the room, matches your voice, and tells you *why* a line lands.

Built with Expo for iOS and Android.

## What makes it different from Rizz

- **Sounds like you.** Paste a few of your own texts once (Settings → Your style)
  and every reply matches your voice: casing, slang, emoji habits, length.
- **Reads the situation.** Each result opens with an honest read of what they're
  actually signaling, not just canned lines.
- **Distinct angles, never cringe.** Three genuinely different replies (a tease, a
  move-it-forward, a curveball) with hard guardrails against corny pickup-line energy.
- **The *why*, not just the line.** Every reply comes with one line of real strategy.
- **Depth Rizz skips.** Beyond dating: situationships, sales/work, and hard
  conversations (conflict, apologies, boundaries).
- **Generous.** Runs on a free LLM endpoint, so it isn't a paywall maze.

## Contexts & vibes

Contexts: **Dating**, **Situationship**, **Sales / Work**, **Hard talk**.
Vibes: Playful, Flirty, Witty, Smooth, Genuine, Bold.

## Stack

- Expo + React Native, Expo Router
- Reply engine on NVIDIA's free OpenAI-compatible endpoint (`lib/replies.ts`,
  `lib/nvidia.ts`) — resilient timeout + model fallback
- Supabase (auth), RevenueCat (subscriptions), Zustand + AsyncStorage (saved
  lines & your style)
- Text only — no mic, no audio.

## Running

```bash
npm install
cp .env.example .env   # set EXPO_PUBLIC_NVIDIA_API_KEY (build.nvidia.com)
npx expo start
```

Scan the QR code with Expo Go, or run on a simulator.
