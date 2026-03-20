# CINEVERSE - Next-Generation Cinematic Streaming Platform

## Project Overview
- **Name**: CINEVERSE
- **Goal**: Create a highly immersive, cinematic UI/UX for an online video streaming platform that feels like an interactive cinematic experience rather than a traditional OTT app
- **Vision**: Users don't just watch content — they experience it

## Features

### Completed
- **Cinematic Loading Screen** - Film reel animation with gradient branding
- **Fullscreen Hero Banner** - Auto-rotating featured content with slow zoom, vignette, film grain overlay
- **Dynamic Carousels** - Trending Now, Because You Watched..., Hidden Gems, Director's Picks
- **Mood-Based Navigation** - Feel the Thrill, Mind-Bending, Late Night Vibes
- **Continue Watching Strip** - Progress bars with cinematic card design
- **Content Detail Page** - Cinematic backdrop with depth blur, title reveal animation, word-by-word synopsis reveal, horizontal cast scroll
- **Video Player** - Minimal overlay, ambient color cycling, interactive timeline with preview thumbnails, auto-hiding controls
- **Profile Selection** - Animated avatars with floating particles background
- **Mood Pages** - Dedicated mood-filtered content browsing
- **Microinteractions** - Hover glow/scale/shadow, ripple clicks, page fade+zoom transitions, parallax scroll reveal
- **Glassmorphism UI** - Frosted glass navigation, cards, and buttons
- **Cinematic Lighting** - Spotlight effects, glow edges, vignette overlays
- **Full SPA Router** - Client-side navigation with history API and cinematic transitions
- **Responsive Design** - Desktop, tablet, and mobile optimized

### Design System
- Dark moody theme (deep blacks, charcoal, subtle gradients)
- Accent colors: Neon Red (#ff2d55), Electric Blue (#5e5ce6), Gold (#ffd60a)
- Typography: Bebas Neue (display), Inter (body), Playfair Display (elegant)
- Glassmorphism + soft blur backgrounds
- Cinematic shadows and depth layers

## URLs
- **Homepage**: `/` - Hero banner, carousels, mood navigation
- **Detail Page**: `/detail/:id` - Movie details, synopsis, cast
- **Player**: `/player/:id` - Immersive video player
- **Profiles**: `/profiles` - Profile selection screen
- **Mood Pages**: `/mood/:mood` - Mood-filtered content (thrill, mind-bending, late-night)

### API Endpoints
- `GET /api/movies` - All movies
- `GET /api/movies/:id` - Single movie
- `GET /api/moods` - Available moods
- `GET /api/profiles` - User profiles
- `GET /api/movies/mood/:mood` - Movies by mood
- `GET /api/trending` - Trending movies (rating >= 8.7)
- `GET /api/hidden-gems` - Hidden gems (rating < 8.7)
- `GET /api/directors-picks` - Director's picks
- `GET /api/continue-watching` - Continue watching with progress

## Data Architecture
- **Data Models**: Movies with full metadata (cast, synopsis, posters, backdrops), Moods, Profiles
- **Storage**: In-memory mock data (API-ready for future D1/KV integration)
- **Images**: Unsplash for cinematic high-quality imagery

## Tech Stack
- **Backend**: Hono framework on Cloudflare Workers
- **Frontend**: Vanilla JS SPA with custom router
- **Styling**: Custom CSS with CSS Custom Properties, Glassmorphism, Cinematic effects
- **Fonts**: Google Fonts (Bebas Neue, Inter, Playfair Display)
- **Icons**: Font Awesome 6
- **Build**: Vite + @hono/vite-build
- **Platform**: Cloudflare Pages

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: Active
- **Last Updated**: 2026-03-20

## User Guide
1. **Profiles**: Select your profile on the profile selection screen
2. **Browse**: Scroll through cinematic carousels or use mood-based navigation
3. **Explore**: Click any movie card to see its full detail page with synopsis, cast, and similar movies
4. **Watch**: Click "Watch Now" to enter the immersive player experience
5. **Navigate**: Use the top navigation bar to switch between sections
