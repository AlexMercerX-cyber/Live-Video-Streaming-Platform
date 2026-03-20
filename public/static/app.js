/* ═══════════════════════════════════════════════════════════
   CINEVERSE — Interactive Cinematic Streaming Platform
   SPA Router + All Pages + Microinteractions
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── State ───────────────────────────────────────────────
  const state = {
    movies: [],
    moods: [],
    profiles: [],
    trending: [],
    hiddenGems: [],
    directorsPicks: [],
    continueWatching: [],
    currentHero: 0,
    heroInterval: null,
    scrollY: 0,
    playerProgress: 35,
    controlsTimeout: null,
    currentPage: '',
  };

  // ─── Router ──────────────────────────────────────────────
  function navigate(path, pushState = true) {
    if (pushState) history.pushState(null, '', path);
    const app = document.getElementById('app');
    app.classList.remove('page-enter');
    app.classList.add('page-exit');
    setTimeout(() => {
      app.classList.remove('page-exit');
      renderRoute(path);
      app.classList.add('page-enter');
      window.scrollTo(0, 0);
    }, 350);
  }

  function renderRoute(path) {
    const app = document.getElementById('app');
    if (path === '/' || path === '') {
      state.currentPage = 'home';
      renderHome(app);
    } else if (path === '/profiles') {
      state.currentPage = 'profiles';
      renderProfiles(app);
    } else if (path.startsWith('/detail/')) {
      state.currentPage = 'detail';
      const id = parseInt(path.split('/')[2]);
      renderDetail(app, id);
    } else if (path.startsWith('/player/')) {
      state.currentPage = 'player';
      const id = parseInt(path.split('/')[2]);
      renderPlayer(app, id);
    } else if (path.startsWith('/mood/')) {
      state.currentPage = 'mood';
      const mood = path.split('/')[2];
      renderMoodPage(app, mood);
    } else {
      state.currentPage = 'home';
      renderHome(app);
    }
  }

  window.addEventListener('popstate', () => {
    renderRoute(location.pathname);
  });

  // ─── Data Fetch ──────────────────────────────────────────
  async function fetchData() {
    try {
      const [moviesRes, moodsRes, profilesRes, trendingRes, gemsRes, picksRes, continueRes] = await Promise.all([
        fetch('/api/movies'), fetch('/api/moods'), fetch('/api/profiles'),
        fetch('/api/trending'), fetch('/api/hidden-gems'),
        fetch('/api/directors-picks'), fetch('/api/continue-watching')
      ]);
      state.movies = await moviesRes.json();
      state.moods = await moodsRes.json();
      state.profiles = await profilesRes.json();
      state.trending = await trendingRes.json();
      state.hiddenGems = await gemsRes.json();
      state.directorsPicks = await picksRes.json();
      state.continueWatching = await continueRes.json();
    } catch (e) {
      console.error('Failed to fetch data:', e);
    }
  }

  // ─── Helpers ─────────────────────────────────────────────
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'className') node.className = v;
      else if (k === 'innerHTML') node.innerHTML = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    });
    children.forEach(c => {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function addRipple(e, element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // ─── Navbar ──────────────────────────────────────────────
  function createNavbar(activePage = 'home') {
    const nav = el('nav', { className: 'navbar' });
    const logo = el('div', { className: 'nav-logo', onClick: () => navigate('/') }, ['CINEVERSE']);

    const center = el('div', { className: 'nav-center' }, [
      createNavLink('Home', 'home', activePage, '/'),
      createNavLink('Explore', 'explore', activePage, '/'),
      createNavLink('My List', 'mylist', activePage, '/'),
      createNavLink('Moods', 'moods', activePage, '/mood/thrill'),
    ]);

    const right = el('div', { className: 'nav-right' }, [
      el('button', { className: 'nav-search', innerHTML: '<i class="fas fa-search"></i>' }),
      el('button', { className: 'nav-search', innerHTML: '<i class="fas fa-bell"></i>' }),
      el('div', { className: 'nav-profile', onClick: () => navigate('/profiles') }, ['🎬']),
    ]);

    nav.append(logo, center, right);

    // Scroll listener for navbar
    const handleScroll = () => {
      if (window.scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', handleScroll);
    return nav;
  }

  function createNavLink(text, id, active, href) {
    return el('a', {
      className: `nav-link ${active === id ? 'active' : ''}`,
      href: href,
      onClick: (e) => { e.preventDefault(); navigate(href); }
    }, [text]);
  }

  // ─── Movie Card ──────────────────────────────────────────
  function createMovieCard(movie) {
    const card = el('div', { className: 'movie-card', onClick: (e) => { addRipple(e, card); setTimeout(() => navigate('/detail/' + movie.id), 200); } });

    const poster = el('img', { className: 'card-poster', src: movie.poster, alt: movie.title, loading: 'lazy' });
    const overlay = el('div', { className: 'card-overlay' }, [
      el('div', { className: 'card-play-btn', innerHTML: '<i class="fas fa-play" style="margin-left:2px"></i>' }),
      el('div', { className: 'card-title' }, [movie.title]),
      el('div', { className: 'card-info' }, [
        el('span', { className: 'card-rating' }, ['★ ' + movie.rating]),
        el('span', { className: 'card-dot' }),
        el('span', {}, [movie.duration]),
        el('span', { className: 'card-dot' }),
        el('span', {}, [movie.genre.split(' / ')[0]]),
      ]),
    ]);

    card.append(poster, overlay);
    return card;
  }

  // ─── Carousel ────────────────────────────────────────────
  function createCarousel(movies) {
    const container = el('div', { className: 'carousel-container' });
    const carousel = el('div', { className: 'carousel' });
    movies.forEach(m => carousel.appendChild(createMovieCard(m)));

    const leftArrow = el('button', {
      className: 'carousel-arrow left',
      innerHTML: '<i class="fas fa-chevron-left"></i>',
      onClick: () => carousel.scrollBy({ left: -600, behavior: 'smooth' })
    });
    const rightArrow = el('button', {
      className: 'carousel-arrow right',
      innerHTML: '<i class="fas fa-chevron-right"></i>',
      onClick: () => carousel.scrollBy({ left: 600, behavior: 'smooth' })
    });

    container.append(leftArrow, carousel, rightArrow);
    return container;
  }

  // ─── Continue Watching Strip ─────────────────────────────
  function createContinueStrip(movies) {
    const carousel = el('div', { className: 'carousel' });
    movies.forEach(m => {
      const card = el('div', { className: 'continue-card', onClick: () => navigate('/player/' + m.id) });
      const thumbWrap = el('div', { className: 'continue-thumb' });
      const img = el('img', { className: 'continue-thumb-img', src: m.backdrop || m.poster, alt: m.title, loading: 'lazy' });
      const play = el('div', { className: 'continue-play', innerHTML: '<i class="fas fa-play"></i>' });
      thumbWrap.append(img, play);

      const progress = el('div', { className: 'continue-progress' });
      const bar = el('div', { className: 'continue-progress-bar', style: `width:${m.progress}%` });
      progress.appendChild(bar);

      const info = el('div', { className: 'continue-info' }, [
        el('div', { className: 'continue-title' }, [m.title]),
        el('div', { className: 'continue-meta' }, [`${m.progress}% watched · ${m.duration}`]),
      ]);

      card.append(thumbWrap, progress, info);
      carousel.appendChild(card);
    });
    return carousel;
  }

  // ─── Hero Section ────────────────────────────────────────
  function createHero(movies) {
    const featured = movies.slice(0, 4);
    state.currentHero = 0;

    const hero = el('div', { className: 'hero' });
    const bg = el('div', { className: 'hero-bg', style: `background-image:url('${featured[0].backdrop}')` });
    const overlay = el('div', { className: 'hero-overlay' });
    const vignette = el('div', { className: 'hero-vignette' });
    const noise = el('div', { className: 'hero-noise' });

    function updateHero(index) {
      const m = featured[index];
      bg.style.backgroundImage = `url('${m.backdrop}')`;
      bg.style.opacity = '0';
      setTimeout(() => { bg.style.opacity = '1'; }, 50);
      content.innerHTML = '';
      content.append(
        el('div', { className: 'hero-genre' }, [
          el('span', { className: 'hero-genre-dot' }),
          document.createTextNode(m.genre),
        ]),
        el('div', { className: 'hero-title' }, [m.title.toUpperCase()]),
        el('div', { className: 'hero-tagline' }, [m.tagline]),
        el('div', { className: 'hero-meta' }, [
          el('span', { className: 'hero-rating', innerHTML: '<i class="fas fa-star" style="font-size:12px"></i> ' + m.rating }),
          el('span', { className: 'hero-meta-divider' }),
          el('span', {}, [m.year.toString()]),
          el('span', { className: 'hero-meta-divider' }),
          el('span', {}, [m.duration]),
          el('span', { className: 'hero-meta-divider' }),
          el('span', {}, [m.director]),
        ]),
        el('div', { className: 'hero-actions' }, [
          el('button', { className: 'btn-primary', innerHTML: '<i class="fas fa-play"></i> Watch Now', onClick: (e) => { addRipple(e, e.currentTarget); setTimeout(() => navigate('/player/' + m.id), 300); } }),
          el('button', { className: 'btn-glass', innerHTML: '<i class="fas fa-info-circle"></i> More Info', onClick: () => navigate('/detail/' + m.id) }),
          el('button', { className: 'btn-icon', innerHTML: '<i class="fas fa-plus"></i>', title: 'Add to My List' }),
          el('button', { className: 'btn-icon', innerHTML: '<i class="fas fa-volume-up"></i>', title: 'Unmute' }),
        ])
      );
      // Update indicators
      indicators.querySelectorAll('.hero-indicator').forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
      });
    }

    const content = el('div', { className: 'hero-content' });
    const indicators = el('div', { className: 'hero-indicators' });
    featured.forEach((_, i) => {
      const ind = el('div', {
        className: `hero-indicator ${i === 0 ? 'active' : ''}`,
        onClick: () => { state.currentHero = i; updateHero(i); resetHeroInterval(); }
      });
      indicators.appendChild(ind);
    });

    function resetHeroInterval() {
      if (state.heroInterval) clearInterval(state.heroInterval);
      state.heroInterval = setInterval(() => {
        state.currentHero = (state.currentHero + 1) % featured.length;
        updateHero(state.currentHero);
      }, 6000);
    }

    hero.append(bg, overlay, vignette, noise, content, indicators);
    updateHero(0);
    resetHeroInterval();

    return hero;
  }

  // ─── Section Builder ─────────────────────────────────────
  function createSection(title, subtitle, content) {
    const section = el('div', { className: 'section parallax-section' });
    const header = el('div', { className: 'section-header' }, [
      el('div', {}, [
        el('h2', { className: 'section-title' }, [title]),
        subtitle ? el('div', { className: 'section-subtitle' }, [subtitle]) : null,
      ].filter(Boolean)),
      el('button', { className: 'section-see-all', innerHTML: 'See All <i class="fas fa-arrow-right" style="font-size:10px"></i>' }),
    ]);
    section.append(header, content);
    return section;
  }

  // ─── Footer ──────────────────────────────────────────────
  function createFooter() {
    const footer = el('div', { className: 'footer' });
    footer.innerHTML = `
      <div class="footer-top">
        <div>
          <div class="footer-brand">CINEVERSE</div>
          <div class="footer-tagline">Experience Cinema. Feel Every Frame.</div>
        </div>
        <div class="footer-links">
          <div>
            <div class="footer-col-title">Explore</div>
            <a class="footer-link" href="#">Trending</a>
            <a class="footer-link" href="#">New Releases</a>
            <a class="footer-link" href="#">Top Rated</a>
            <a class="footer-link" href="#">Genres</a>
          </div>
          <div>
            <div class="footer-col-title">Account</div>
            <a class="footer-link" href="#">My List</a>
            <a class="footer-link" href="#">Settings</a>
            <a class="footer-link" href="#">Profiles</a>
            <a class="footer-link" href="#">Help</a>
          </div>
          <div>
            <div class="footer-col-title">Legal</div>
            <a class="footer-link" href="#">Privacy</a>
            <a class="footer-link" href="#">Terms</a>
            <a class="footer-link" href="#">Cookies</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 Cineverse. All rights reserved.</span>
        <span>Made with <span style="color:var(--accent-red)">&hearts;</span> for cinephiles</span>
      </div>
    `;
    return footer;
  }

  // ═══════════════════════════════════════════════════════════
  // PAGES
  // ═══════════════════════════════════════════════════════════

  // ─── HOME PAGE ───────────────────────────────────────────
  function renderHome(container) {
    container.innerHTML = '';
    if (state.heroInterval) clearInterval(state.heroInterval);

    container.appendChild(createNavbar('home'));
    container.appendChild(createHero(state.movies));

    // Continue Watching
    if (state.continueWatching.length) {
      container.appendChild(
        createSection('Continue Watching', 'Pick up where you left off', createContinueStrip(state.continueWatching))
      );
    }

    // Mood Navigation
    const moodNav = el('div', { className: 'mood-nav' });
    const moodChips = el('div', { className: 'mood-chips' });
    state.moods.forEach(m => {
      const chip = el('div', {
        className: 'mood-chip',
        onClick: () => navigate('/mood/' + m.id)
      }, [
        el('span', { className: 'mood-icon' }, [m.icon]),
        document.createTextNode(m.label),
      ]);
      moodChips.appendChild(chip);
    });
    moodNav.appendChild(moodChips);
    container.appendChild(moodNav);

    // Trending
    container.appendChild(
      createSection('Trending Now', 'What everyone is watching', createCarousel(state.trending))
    );

    // Because You Watched
    const recommended = [...state.movies].sort(() => Math.random() - 0.5).slice(0, 7);
    container.appendChild(
      createSection(`Because You Watched "${state.movies[0].title}"`, 'AI-powered picks for you', createCarousel(recommended))
    );

    // Hidden Gems
    container.appendChild(
      createSection('Hidden Gems', 'Undiscovered masterpieces', createCarousel(state.hiddenGems))
    );

    // Director's Picks
    container.appendChild(
      createSection("Director's Picks", 'Curated by visionary filmmakers', createCarousel(state.directorsPicks))
    );

    container.appendChild(createFooter());

    // Parallax on scroll
    initParallax();
  }

  // ─── DETAIL PAGE ─────────────────────────────────────────
  function renderDetail(container, movieId) {
    container.innerHTML = '';
    const movie = state.movies.find(m => m.id === movieId);
    if (!movie) { navigate('/'); return; }

    const page = el('div', { className: 'detail-page' });

    // Backdrop
    const backdrop = el('div', { className: 'detail-backdrop', style: `background-image:url('${movie.backdrop}')` });
    const backdropOverlay = el('div', { className: 'detail-backdrop-overlay' });
    backdrop.appendChild(backdropOverlay);
    page.appendChild(backdrop);

    // Navbar
    page.appendChild(createNavbar(''));

    // Content
    const content = el('div', { className: 'detail-content' });
    const inner = el('div', { className: 'detail-inner' });

    // Title reveal
    inner.appendChild(el('h1', { className: 'detail-title-reveal' }, [movie.title.toUpperCase()]));

    // Meta row
    const metaRow = el('div', { className: 'detail-meta-row' }, [
      el('div', { className: 'detail-rating-badge', innerHTML: '<i class="fas fa-star"></i> ' + movie.rating }),
      el('span', { style: 'color:var(--text-secondary)' }, [movie.year.toString()]),
      el('span', { className: 'hero-meta-divider' }),
      el('span', { style: 'color:var(--text-secondary)' }, [movie.duration]),
      el('span', { className: 'hero-meta-divider' }),
      el('span', { style: 'color:var(--text-secondary)' }, [movie.genre]),
      el('span', { className: 'hero-meta-divider' }),
      el('span', { style: 'color:var(--text-muted)' }, ['Directed by ' + movie.director]),
    ]);
    inner.appendChild(metaRow);

    // Actions
    const actions = el('div', { className: 'detail-actions' }, [
      el('button', { className: 'btn-play-glow', onClick: () => navigate('/player/' + movie.id), innerHTML: '<i class="fas fa-play" style="margin-left:3px"></i>' }),
      el('button', { className: 'btn-primary', style: 'margin-left:16px', innerHTML: '<i class="fas fa-play"></i> Watch Now', onClick: (e) => { addRipple(e, e.currentTarget); setTimeout(() => navigate('/player/' + movie.id), 300); } }),
      el('button', { className: 'btn-glass', innerHTML: '<i class="fas fa-plus"></i> My List' }),
      el('button', { className: 'btn-icon', innerHTML: '<i class="fas fa-share-alt"></i>' }),
    ]);
    inner.appendChild(actions);

    // Synopsis
    const synopsisSection = el('div', { className: 'detail-section' });
    synopsisSection.appendChild(el('h3', { className: 'detail-section-title' }, ['SYNOPSIS']));
    const synopsisText = el('p', { className: 'detail-synopsis synopsis-text' });
    // Animate text reveal word by word
    const words = movie.synopsis.split(' ');
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.animationDelay = (i * 0.02) + 's';
      synopsisText.appendChild(span);
    });
    synopsisSection.appendChild(synopsisText);
    inner.appendChild(synopsisSection);
    // Trigger animation
    setTimeout(() => synopsisText.classList.add('reveal'), 600);

    // Cast & Crew
    if (movie.cast && movie.cast.length) {
      const castSection = el('div', { className: 'detail-section' });
      castSection.appendChild(el('h3', { className: 'detail-section-title' }, ['CAST & CREW']));
      const castScroll = el('div', { className: 'cast-scroll' });
      movie.cast.forEach(c => {
        const castCard = el('div', { className: 'cast-card' }, [
          el('img', { className: 'cast-img', src: c.img, alt: c.name, loading: 'lazy' }),
          el('div', { className: 'cast-name' }, [c.name]),
          el('div', { className: 'cast-role' }, [c.role]),
        ]);
        castScroll.appendChild(castCard);
      });
      castSection.appendChild(castScroll);
      inner.appendChild(castSection);
    }

    // Similar Movies
    const similarSection = el('div', { className: 'detail-section' });
    similarSection.appendChild(el('h3', { className: 'detail-section-title' }, ['YOU MIGHT ALSO LIKE']));
    const similar = state.movies.filter(m => m.id !== movie.id && m.mood === movie.mood).slice(0, 6);
    if (similar.length === 0) similar.push(...state.movies.filter(m => m.id !== movie.id).slice(0, 6));
    similarSection.appendChild(createCarousel(similar.length ? similar : state.movies.slice(0, 6)));
    inner.appendChild(similarSection);

    content.appendChild(inner);
    page.appendChild(content);
    page.appendChild(createFooter());
    container.appendChild(page);

    // Backdrop blur on scroll
    window.addEventListener('scroll', function detailScroll() {
      if (state.currentPage !== 'detail') {
        window.removeEventListener('scroll', detailScroll);
        return;
      }
      const sy = window.scrollY;
      const blur = Math.min(sy / 30, 20);
      backdrop.style.filter = `blur(${blur}px)`;
      backdrop.style.transform = `translateY(${sy * 0.3}px)`;
    });
  }

  // ─── PLAYER PAGE ─────────────────────────────────────────
  function renderPlayer(container, movieId) {
    container.innerHTML = '';
    const movie = state.movies.find(m => m.id === movieId);
    if (!movie) { navigate('/'); return; }

    if (state.heroInterval) clearInterval(state.heroInterval);

    const page = el('div', { className: 'player-page' });
    const playerContainer = el('div', { className: 'player-container' });

    // Ambient light
    const ambient = el('div', { className: 'player-ambient' });
    playerContainer.appendChild(ambient);

    // Video area (placeholder)
    const videoArea = el('div', { className: 'player-video-area' });
    const placeholder = el('div', { className: 'player-placeholder' });
    placeholder.innerHTML = `
      <i class="fas fa-film"></i>
      <div class="player-placeholder-title">${movie.title.toUpperCase()}</div>
      <div class="player-placeholder-sub">${movie.tagline}</div>
    `;
    videoArea.appendChild(placeholder);
    playerContainer.appendChild(videoArea);

    // Top controls
    const topControls = el('div', { className: 'player-top-controls' });
    const backBtn = el('div', { className: 'player-back', onClick: () => navigate('/detail/' + movie.id) });
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
    topControls.appendChild(backBtn);
    topControls.appendChild(el('div', { style: 'display:flex;gap:16px' }, [
      el('button', { className: 'player-btn', innerHTML: '<i class="fas fa-closed-captioning"></i>' }),
      el('button', { className: 'player-btn', innerHTML: '<i class="fas fa-cog"></i>' }),
    ]));
    playerContainer.appendChild(topControls);

    // Bottom controls
    const controls = el('div', { className: 'player-controls' });

    // Timeline
    const timeline = el('div', { className: 'player-timeline' });
    const timelineProgress = el('div', { className: 'player-timeline-progress', style: `width:${state.playerProgress}%` });
    const timelineThumb = el('div', { className: 'player-timeline-thumb' });
    timelineThumb.style.backgroundColor = 'var(--bg-tertiary)';
    timelineThumb.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-muted)">Preview</div>';
    timeline.append(timelineProgress, timelineThumb);

    timeline.addEventListener('click', (e) => {
      const rect = timeline.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      state.playerProgress = Math.max(0, Math.min(100, pct));
      timelineProgress.style.width = state.playerProgress + '%';
    });

    timeline.addEventListener('mousemove', (e) => {
      const rect = timeline.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      timelineThumb.style.left = pct + '%';
    });

    controls.appendChild(timeline);

    // Bottom bar
    const bottom = el('div', { className: 'player-bottom' });
    const left = el('div', { className: 'player-left' });
    let isPlaying = true;
    const playBtn = el('button', { className: 'player-btn play-btn', innerHTML: '<i class="fas fa-pause"></i>' });
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    });
    left.append(
      playBtn,
      el('button', { className: 'player-btn', innerHTML: '<i class="fas fa-backward"></i>' }),
      el('button', { className: 'player-btn', innerHTML: '<i class="fas fa-forward"></i>' }),
      el('button', { className: 'player-btn', innerHTML: '<i class="fas fa-volume-up"></i>' }),
      el('div', { className: 'player-title-info' }, [
        el('div', { className: 'player-title-text' }, [movie.title]),
        el('div', { className: 'player-title-episode' }, [movie.genre]),
      ])
    );

    const right = el('div', { className: 'player-right' });
    const timeDisplay = el('div', { className: 'player-time' }, ['0:48:12 / ' + movie.duration.replace('h ', ':').replace('m', ':00')]);
    right.append(
      timeDisplay,
      el('button', { className: 'player-btn', innerHTML: '<i class="fas fa-film"></i>', title: 'Scenes' }),
      el('button', { className: 'player-btn', innerHTML: '<i class="fas fa-expand"></i>', title: 'Fullscreen' })
    );

    bottom.append(left, right);
    controls.appendChild(bottom);
    playerContainer.appendChild(controls);
    page.appendChild(playerContainer);
    container.appendChild(page);

    // Auto-hide controls
    let controlsVisible = true;
    function showControls() {
      page.classList.remove('controls-hidden');
      controlsVisible = true;
      document.body.style.cursor = '';
      if (state.controlsTimeout) clearTimeout(state.controlsTimeout);
      state.controlsTimeout = setTimeout(() => {
        page.classList.add('controls-hidden');
        controlsVisible = false;
        document.body.style.cursor = 'none';
      }, 3000);
    }

    page.addEventListener('mousemove', showControls);
    page.addEventListener('click', showControls);
    showControls();

    // Animate ambient
    const colors = ['#ff2d55', '#5e5ce6', '#ffd60a', '#ff6b8a', '#2d3ae6'];
    let ci = 0;
    setInterval(() => {
      ci = (ci + 1) % colors.length;
      ambient.style.background = `radial-gradient(ellipse at center, ${colors[ci]} 0%, transparent 70%)`;
    }, 4000);

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (isPlaying && state.playerProgress < 100) {
        state.playerProgress += 0.05;
        timelineProgress.style.width = state.playerProgress + '%';
      }
    }, 100);

    // Cleanup on page change
    const origPage = state.currentPage;
    const checkCleanup = setInterval(() => {
      if (state.currentPage !== 'player') {
        clearInterval(progressInterval);
        clearInterval(checkCleanup);
        document.body.style.cursor = '';
      }
    }, 500);
  }

  // ─── PROFILES PAGE ───────────────────────────────────────
  function renderProfiles(container) {
    container.innerHTML = '';
    if (state.heroInterval) clearInterval(state.heroInterval);

    const page = el('div', { className: 'profiles-page' });

    // Background particles
    const bgParticles = el('div', { style: 'position:absolute;inset:0;overflow:hidden;pointer-events:none' });
    for (let i = 0; i < 30; i++) {
      const particle = el('div');
      particle.style.cssText = `
        position:absolute; width:${Math.random() * 4 + 1}px; height:${Math.random() * 4 + 1}px;
        background:rgba(255,45,85,${Math.random() * 0.3}); border-radius:50%;
        left:${Math.random() * 100}%; top:${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      bgParticles.appendChild(particle);
    }
    // Add float animation
    const style = document.createElement('style');
    style.textContent = `@keyframes float { 0%,100% { transform: translateY(0) translateX(0); } 25% { transform: translateY(-30px) translateX(10px); } 50% { transform: translateY(-10px) translateX(-15px); } 75% { transform: translateY(-40px) translateX(5px); } }`;
    page.appendChild(style);
    page.appendChild(bgParticles);

    page.appendChild(el('h1', { className: 'profiles-title' }, ["Who's Watching?"]));

    const grid = el('div', { className: 'profiles-grid' });
    state.profiles.forEach(p => {
      const card = el('div', {
        className: 'profile-card',
        onClick: () => { if (p.name !== 'Add Profile') navigate('/'); }
      });
      const avatar = el('div', {
        className: 'profile-avatar',
        style: `background: linear-gradient(135deg, ${p.color}22, ${p.color}44)`
      }, [p.avatar]);
      card.append(avatar, el('div', { className: 'profile-name' }, [p.name]));
      grid.appendChild(card);
    });

    page.appendChild(grid);
    container.appendChild(page);
  }

  // ─── MOOD PAGE ───────────────────────────────────────────
  function renderMoodPage(container, moodId) {
    container.innerHTML = '';
    if (state.heroInterval) clearInterval(state.heroInterval);

    const mood = state.moods.find(m => m.id === moodId) || state.moods[0];
    const moodMovies = state.movies.filter(m => m.mood === moodId);

    const page = el('div', { className: 'mood-page' });
    page.appendChild(createNavbar('moods'));

    const hero = el('div', { className: 'mood-hero' }, [
      el('div', { className: 'mood-hero-icon' }, [mood.icon]),
      el('h1', { className: 'mood-hero-title', style: `color:${mood.color}` }, [mood.label.toUpperCase()]),
      el('p', { className: 'mood-hero-sub' }, [getMoodDescription(moodId)]),
    ]);
    page.appendChild(hero);

    // Mood chips for switching
    const moodNav = el('div', { className: 'mood-nav', style: 'text-align:center' });
    const chips = el('div', { className: 'mood-chips', style: 'justify-content:center' });
    state.moods.forEach(m => {
      const chip = el('div', {
        className: `mood-chip ${m.id === moodId ? 'active' : ''}`,
        onClick: () => navigate('/mood/' + m.id)
      }, [
        el('span', { className: 'mood-icon' }, [m.icon]),
        document.createTextNode(m.label),
      ]);
      chips.appendChild(chip);
    });
    moodNav.appendChild(chips);
    page.appendChild(moodNav);

    // Movie grid
    const grid = el('div', { className: 'mood-grid' });
    const moviesForGrid = moodMovies.length > 0 ? moodMovies : state.movies;
    moviesForGrid.forEach(m => {
      grid.appendChild(createMovieCard(m));
    });
    page.appendChild(grid);

    page.appendChild(createFooter());
    container.appendChild(page);
  }

  function getMoodDescription(mood) {
    const desc = {
      'thrill': 'Heart-pounding adventures and edge-of-your-seat action that will leave you breathless.',
      'mind-bending': 'Thought-provoking stories that twist reality and challenge perception.',
      'late-night': 'Dark, atmospheric tales perfect for those quiet midnight hours.',
    };
    return desc[mood] || 'Curated cinematic experiences tailored to your mood.';
  }

  // ─── Parallax System ─────────────────────────────────────
  function initParallax() {
    const sections = document.querySelectorAll('.parallax-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    sections.forEach(s => {
      s.style.opacity = '0';
      s.style.transform = 'translateY(30px)';
      s.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(s);
    });
  }

  // ─── Init ────────────────────────────────────────────────
  async function init() {
    await fetchData();

    // Hide loader
    const loader = document.getElementById('app-loader');
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 500);
      setTimeout(() => loader.remove(), 1300);
    }

    // Render current route
    renderRoute(location.pathname);
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
