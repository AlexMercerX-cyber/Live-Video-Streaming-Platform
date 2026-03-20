import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/api/*', cors())

// Favicon - return a simple SVG
app.get('/favicon.ico', (c) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎬</text></svg>`
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' } })
})

// ─── Mock Data ───────────────────────────────────────────────
const movies = [
  { id: 1, title: "Echoes of Eternity", tagline: "Some echoes never fade", year: 2026, rating: 9.2, duration: "2h 18m", genre: "Sci-Fi / Thriller", mood: "mind-bending", director: "Aria Chen", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80", backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80", synopsis: "In a fractured timeline where memories bleed between dimensions, a quantum physicist discovers that the echoes she hears aren't from the past — they're warnings from a future that's already begun to collapse. As reality unravels thread by thread, she must navigate through layers of existence to prevent a catastrophe that transcends time itself.", cast: [{ name: "Zara Mitchell", role: "Dr. Elara Voss", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" }, { name: "Jin Tanaka", role: "Marcus Webb", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" }, { name: "Leila Okafor", role: "Agent Reyes", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" }, { name: "Ravi Sharma", role: "The Architect", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" }] },
  { id: 2, title: "Neon Requiem", tagline: "The city never sleeps. Neither do the dead.", year: 2026, rating: 8.7, duration: "1h 52m", genre: "Cyberpunk / Noir", mood: "late-night", director: "Viktor Novak", poster: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=600&q=80", backdrop: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=1920&q=80", synopsis: "In Neo-Tokyo 2089, a burned-out detective with synthetic memories hunts a serial killer who leaves quantum signatures at each crime scene. The deeper he dives into the neon-soaked underworld, the more he questions which memories are real — and whether the killer might be a version of himself.", cast: [{ name: "Kai Nomura", role: "Det. Sato", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" }, { name: "Eva Storm", role: "Yuki", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" }, { name: "Marcus Cole", role: "Ghost", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" }] },
  { id: 3, title: "Crimson Meridian", tagline: "Beyond the horizon lies the truth", year: 2025, rating: 8.9, duration: "2h 31m", genre: "Adventure / Drama", mood: "thrill", director: "Sofia Reyes", poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80", synopsis: "A cartographer who maps uncharted territories discovers coordinates that shouldn't exist — leading to a hidden meridian line where gravity bends and time fractures. Her expedition into this impossible geography becomes a journey into the Earth's deepest secret.", cast: [{ name: "Isabella Cruz", role: "Maya Torres", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" }, { name: "Theo James", role: "Dr. Harlan", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80" }] },
  { id: 4, title: "Whispers in Static", tagline: "Tune in. If you dare.", year: 2026, rating: 8.4, duration: "1h 47m", genre: "Horror / Psychological", mood: "late-night", director: "Mira Volkov", poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&q=80", backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&q=80", synopsis: "A radio astronomer intercepts a signal from deep space that sounds impossibly like a human voice whispering names — including hers. As she decodes the transmission, she realizes the signal isn't coming from space. It's coming from inside the Earth.", cast: [{ name: "Nora Blake", role: "Dr. Iris Vane", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80" }, { name: "Samuel Park", role: "Agent Holden", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80" }] },
  { id: 5, title: "The Last Meridian", tagline: "One final journey into the unknown", year: 2025, rating: 9.0, duration: "2h 05m", genre: "Sci-Fi / Drama", mood: "mind-bending", director: "James Wren", poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80", synopsis: "Humanity's last interstellar ship carries a thousand souls toward a dying star's habitable planet. But the navigation AI begins showing coordinates to a place that shouldn't exist — a meridian in space where physics rewrites itself.", cast: [{ name: "Diana Chen", role: "Commander Yara", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80" }, { name: "Leon Hart", role: "Dr. Orion", img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&q=80" }] },
  { id: 6, title: "Velvet Shadows", tagline: "Beauty hides the darkest secrets", year: 2026, rating: 8.6, duration: "1h 58m", genre: "Thriller / Romance", mood: "late-night", director: "Lucien Noir", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80", backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80", synopsis: "In the gilded corridors of a Parisian fashion empire, a photographer uncovers a trail of disappearances connected to the industry's most celebrated designer. Love and danger intertwine as she gets closer to the truth.", cast: [{ name: "Camille Roux", role: "Adele", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80" }, { name: "Andre Morel", role: "Julien", img: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&q=80" }] },
  { id: 7, title: "Obsidian Protocol", tagline: "Trust no one. Not even yourself.", year: 2026, rating: 8.8, duration: "2h 12m", genre: "Action / Espionage", mood: "thrill", director: "Alex Drake", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80", backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80", synopsis: "A decommissioned spy receives a coded message from her dead handler. The message activates a dormant protocol that pits the world's intelligence agencies against each other — and she's the only one who can stop the cascade.", cast: [{ name: "Sarah Vance", role: "Agent Zero", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" }, { name: "David Kim", role: "The Handler", img: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80" }] },
  { id: 8, title: "Aurora Falling", tagline: "When the lights go out, truth descends", year: 2025, rating: 9.1, duration: "2h 24m", genre: "Drama / Mystery", mood: "mind-bending", director: "Ingrid Svensson", poster: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80", backdrop: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80", synopsis: "In a remote Arctic research station, scientists witness the aurora borealis freeze mid-sky — and within it, they see images of their own pasts. The frozen light becomes a mirror of memory, revealing secrets that could tear the team apart.", cast: [{ name: "Freya Olsen", role: "Dr. Astrid", img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&q=80" }, { name: "Erik Strand", role: "Magnus", img: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&q=80" }] },
  { id: 9, title: "Phantom Frequency", tagline: "Every signal carries a soul", year: 2026, rating: 8.5, duration: "1h 44m", genre: "Horror / Sci-Fi", mood: "late-night", director: "Yuki Tanaka", poster: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&q=80", backdrop: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1920&q=80", synopsis: "A sound engineer discovers a hidden frequency in old vinyl records that, when played backward, reveal conversations from the dead. But listening too long has consequences — the voices start answering back.", cast: [{ name: "Hiro Matsuda", role: "Kenji", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" }, { name: "Luna Park", role: "Mika", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80" }] },
  { id: 10, title: "Gilded Abyss", tagline: "Fortune favors the fearless", year: 2025, rating: 8.3, duration: "2h 01m", genre: "Adventure / Fantasy", mood: "thrill", director: "Marco Pellegrini", poster: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=600&q=80", backdrop: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&q=80", synopsis: "Deep beneath the Mediterranean, a treasure hunter discovers an ancient golden city still inhabited by beings who've evolved beyond human comprehension. The abyss holds riches beyond imagination — and horrors beyond description.", cast: [{ name: "Luca Bianchi", role: "Marco", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" }, { name: "Aria Sol", role: "Nerida", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" }] },
]

const moods = [
  { id: "thrill", label: "Feel the Thrill", icon: "⚡", color: "#ff2d55" },
  { id: "mind-bending", label: "Mind-Bending", icon: "🌀", color: "#5e5ce6" },
  { id: "late-night", label: "Late Night Vibes", icon: "🌙", color: "#ffd60a" },
]

const profiles = [
  { id: 1, name: "Alex", avatar: "🎬", color: "#ff2d55" },
  { id: 2, name: "Jordan", avatar: "🎭", color: "#5e5ce6" },
  { id: 3, name: "Sam", avatar: "🌙", color: "#ffd60a" },
  { id: 4, name: "Add Profile", avatar: "➕", color: "#333" },
]

// ─── API Routes ──────────────────────────────────────────────
app.get('/api/movies', (c) => c.json(movies))
app.get('/api/movies/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const movie = movies.find(m => m.id === id)
  if (!movie) return c.json({ error: 'Not found' }, 404)
  return c.json(movie)
})
app.get('/api/moods', (c) => c.json(moods))
app.get('/api/profiles', (c) => c.json(profiles))
app.get('/api/movies/mood/:mood', (c) => {
  const mood = c.req.param('mood')
  return c.json(movies.filter(m => m.mood === mood))
})
app.get('/api/trending', (c) => c.json(movies.filter(m => m.rating >= 8.7)))
app.get('/api/hidden-gems', (c) => c.json(movies.filter(m => m.rating < 8.7)))
app.get('/api/directors-picks', (c) => c.json(movies.slice(0, 5)))
app.get('/api/continue-watching', (c) => c.json(movies.slice(2, 6).map(m => ({ ...m, progress: Math.floor(Math.random() * 80) + 10 }))))

// ─── HTML Shell ──────────────────────────────────────────────
const htmlShell = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>CINEVERSE | Experience Cinema</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
</head>
<body>
    <div id="app-loader">
        <div class="film-reel">
            <div class="reel-circle"></div>
            <div class="reel-strip">
                <div class="reel-frame"></div>
                <div class="reel-frame"></div>
                <div class="reel-frame"></div>
                <div class="reel-frame"></div>
                <div class="reel-frame"></div>
            </div>
        </div>
        <div class="loader-text">CINEVERSE</div>
        <div class="loader-sub">Loading your experience...</div>
    </div>
    <div id="app"></div>
    <script src="/static/app.js"></script>
</body>
</html>`

app.get('/', (c) => c.html(htmlShell))
app.get('/detail/:id', (c) => c.html(htmlShell))
app.get('/player/:id', (c) => c.html(htmlShell))
app.get('/profiles', (c) => c.html(htmlShell))
app.get('/mood/:mood', (c) => c.html(htmlShell))

export default app
