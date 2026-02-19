# మన వార్తలు (Mana Varthalu)

> Telugu-first news platform with AI-powered content tools

![Flutter](https://img.shields.io/badge/Flutter-3.16+-blue) ![Next.js](https://img.shields.io/badge/Next.js-14+-black) ![Firebase](https://img.shields.io/badge/Firebase-v10-orange)

## 🏗️ Architecture

```
mana-varthalu/
├── flutter/           # Mobile app (Android/iOS)
├── admin/             # Next.js admin panel (port 3001)
├── web/               # Next.js public website (port 3002)
├── functions/         # Firebase Cloud Functions
├── shared/            # Shared types + constants
└── firebase configs   # firestore.rules, storage.rules, etc.
```

## 🚀 Features

### 📱 Flutter Mobile App
- **Breaking news ticker** with real-time updates
- **Hero card + vertical feed** for immersive reading
- **Audio player** (text-to-speech) on each article
- **Bullet summary** (AI-generated సారాంశం)
- **Categories grid** with Telugu + English labels
- **Live TV** tab (YouTube integration)
- **Saved/bookmarks** with offline access
- **Google Sign-in** with saffron-themed login
- **Search** across articles
- **AI Highlights** (daily news digest)
- **FCM push** notifications by district/category

### 🖥️ Admin Panel (12 pages)
- **Article editor** with TipTap + 5 Gemini AI tools
  - Translate (En→Te), Generate summary bullets, Suggest headlines, SEO keywords, Fact-check
- **Pending approvals** workflow (approve/reject)
- **Analytics** dashboard (bar charts + top articles)
- **Ad manager** with CTR tracking
- **Comments moderation** (approve/reject/delete)
- **Categories, Users, Notifications, Highlights, YouTube, App Config** management

### 🌐 Public Website (6 pages)
- **Home** page with ticker, hero article, sidebar
- **Article** detail with share + structured data
- **Category** feed pages
- **Highlights** (daily AI summary)
- **Live TV** section
- **Search** with Telugu support

### ⚡ Cloud Functions
- `onArticleApproved` — sends FCM push on publish
- `onCommentCreated` — notifies admin of new comments
- `scheduledHighlights` — daily Gemini-powered news digest
- `youtubePoller` — checks live stream status every 5 min

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | Flutter 3.16+ (Riverpod, GoRouter, just_audio) |
| Admin | Next.js 14 (App Router, TipTap, Chart.js) |
| Website | Next.js 14 (SSR, SEO-optimized) |
| Backend | Firebase (Firestore, Auth, Storage, FCM, Functions) |
| AI | Google Gemini (translate, summarize, headlines, fact-check) |
| Ads | AdMob (mobile) + AdSense (web) |

## 🚀 Getting Started

### Prerequisites
- Flutter SDK ≥ 3.16
- Node.js ≥ 18
- Firebase CLI

### Setup
```bash
# Clone
git clone https://github.com/deccaneyeai/mana-varthalu.git
cd mana-varthalu

# Flutter app
cd flutter && flutter pub get && flutter run

# Admin panel
cd admin && npm install && npm run dev

# Public website
cd web && npm install && npm run dev

# Cloud Functions
cd functions && npm install && npm run serve
```

### Firebase Setup
1. Create a Firebase project at console.firebase.google.com
2. Enable: Authentication (Google), Firestore, Storage, Functions, FCM
3. Add your `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Run `firebase deploy` to push rules + functions

## 📋 Theme

| Token | Value |
|-------|-------|
| Saffron (primary) | `#FF9933` |
| Dark BG | `#0F172A` |
| Breaking Red | `#DC2626` |
| Font (Telugu) | Noto Sans Telugu |
| Font (English) | Inter |

## 📄 License

Proprietary — Deccan Eye Media Pvt Ltd.
