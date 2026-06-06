// ======================== MANIFEST ========================
// Just add folder names here! The system will auto-load "./characters/[name]/data.js"
const CHARACTER_FOLDERS = [
  "natasha"
  // Add more: "ayumi", "kaito", etc.
];

// ======================== GLOBAL REGISTRY ========================
window._characterRegistry = window._characterRegistry || [];
window.registerCharacter = function(characterData) {
  if (!characterData.id || !characterData.name) {
    console.warn("Invalid character registration", characterData);
    return;
  }
  if (!window._characterRegistry.some(c => c.id === characterData.id)) {
    window._characterRegistry.push(characterData);
    console.log(`✅ Registered: ${characterData.name}`);
  }
};

// ======================== MEDIA RESOLUTION ========================
function resolveMediaPath(char, path, type = "picture") {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }
  // Auto-resolve based on character folder
  const subfolder = type === "video" ? "videos" : "images";
  return `./characters/${char.id}/${subfolder}/${path}`;
}

// ======================== STATE ========================
let allCharacters = [];
let currentChar = null;
let currentTab = 'overview';
let activeSearchQuery = '';

// ======================== RENDER FUNCTIONS ========================
function refreshUI() {
  allCharacters = [...window._characterRegistry];
  renderSidebar();
  renderSplashGrid();
  updateCharCount();
  if (currentChar && allCharacters.some(c => c.id === currentChar.id)) {
    renderHero(currentChar);
    if (currentTab === 'overview') renderOverview(currentChar);
    else if (currentTab === 'gallery') renderGallery(currentChar);
    else if (currentTab === 'video') renderVideo(currentChar);
    else if (currentTab === 'extra') renderExtra(currentChar);
  } else if (allCharacters.length > 0) {
    selectCharacterById(allCharacters[0].id);
  } else {
    document.getElementById('landing').style.display = 'flex';
    document.getElementById('profile-view').style.display = 'none';
    currentChar = null;
  }
}

function loadAllCharacters() {
  window._characterRegistry = [];
  allCharacters = [];
  currentChar = null;
  document.getElementById('landing').style.display = 'flex';
  document.getElementById('profile-view').style.display = 'none';
  renderSidebar();
  renderSplashGrid();
  updateCharCount();

  if (CHARACTER_FOLDERS.length === 0) {
    refreshUI();
    return;
  }

  let pending = CHARACTER_FOLDERS.length;
  CHARACTER_FOLDERS.forEach(folder => {
    const scriptPath = `./characters/${folder}/data.js`;
    const script = document.createElement('script');
    script.src = scriptPath;
    script.onload = () => {
      pending--;
      if (pending === 0) refreshUI();
    };
    script.onerror = () => {
      console.error(`Failed to load character from folder: ${folder}`);
      pending--;
      if (pending === 0) refreshUI();
    };
    document.head.appendChild(script);
  });
}

function renderSidebar() {
  const container = document.getElementById('char-list');
  let filtered = allCharacters;
  if (activeSearchQuery) {
    filtered = allCharacters.filter(c => c.name.toLowerCase().includes(activeSearchQuery) || 
      (c.overview?.occupation || '').toLowerCase().includes(activeSearchQuery));
  }
  if (filtered.length === 0) {
    container.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text3);">No characters found</div>';
    return;
  }
  container.innerHTML = filtered.map(c => {
    const avatarSrc = resolveMediaPath(c, c.avatar, "picture");
    return `
      <div class="char-list-item ${currentChar?.id === c.id ? 'active' : ''}" data-id="${c.id}">
        <div class="char-avatar">${avatarSrc ? `<img src="${avatarSrc}" onerror="this.style.display='none';this.parentElement.innerHTML='${c.initials || c.name.slice(0, 2).toUpperCase()}'">` : (c.initials || c.name.slice(0, 2).toUpperCase())}</div>
        <div class="char-list-info">
          <div class="char-list-name">${c.name}</div>
          <div class="char-list-role">${c.overview?.occupation || 'unknown'}</div>
        </div>
      </div>
    `;
  }).join('');
  document.querySelectorAll('.char-list-item').forEach(el => {
    el.addEventListener('click', () => { selectCharacterById(el.dataset.id); closeSidebar(); });
  });
}

function renderSplashGrid() {
  const grid = document.getElementById('splash-grid');
  if (allCharacters.length === 0) {
    grid.innerHTML = '<p style="color:var(--text3);">No characters loaded. Add folder names to CHARACTER_FOLDERS array.</p>';
    return;
  }
  grid.innerHTML = allCharacters.map(c => {
    const avatarSrc = resolveMediaPath(c, c.avatar, "picture");
    return `
      <div class="splash-card" data-id="${c.id}">
        <div class="splash-avatar">${avatarSrc ? `<img src="${avatarSrc}" onerror="this.outerHTML='${c.initials || c.name.slice(0, 2).toUpperCase()}'">` : (c.initials || c.name.slice(0, 2).toUpperCase())}</div>
        <div class="splash-name">${c.name}</div>
        <div class="splash-role">${c.overview?.occupation?.split('/')[0] || ''}</div>
      </div>
    `;
  }).join('');
  document.querySelectorAll('.splash-card').forEach(el => {
    el.addEventListener('click', () => { selectCharacterById(el.dataset.id); });
  });
}

function updateCharCount() {
  document.getElementById('char-count').textContent = `${allCharacters.length} Character${allCharacters.length !== 1 ? 's' : ''}`;
}

function selectCharacterById(id) {
  const target = allCharacters.find(c => c.id === id);
  if (!target) return;
  currentChar = target;
  document.getElementById('landing').style.display = 'none';
  document.getElementById('profile-view').style.display = 'flex';
  renderHero(currentChar);
  switchTab(currentTab);
  renderSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHero(char) {
  const portraitDiv = document.getElementById('hero-portrait');
  const avatarSrc = resolveMediaPath(char, char.avatar, "picture");
  portraitDiv.innerHTML = avatarSrc ? `<img src="${avatarSrc}" onerror="this.outerHTML='${char.initials || char.name.slice(0, 2).toUpperCase()}'">` : (char.initials || char.name.slice(0, 2).toUpperCase());
  document.getElementById('hero-name').textContent = char.name;
  document.getElementById('hero-subtitle').textContent = char.overview?.fullName || '';
  const tagsContainer = document.getElementById('hero-tags');
  tagsContainer.innerHTML = (char.tags || []).map(t => `<span class="hero-tag ${t.style || ''}">${t.label}</span>`).join('');
  const statsContainer = document.getElementById('hero-stats');
  statsContainer.innerHTML = (char.stats || []).map(s => `<div class="hero-stat">${s.label}: <span>${s.value}</span></div>`).join('');
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === `tab-${tab}`));
  if (!currentChar) return;
  if (tab === 'overview') renderOverview(currentChar);
  else if (tab === 'gallery') renderGallery(currentChar);
  else if (tab === 'video') renderVideo(currentChar);
  else if (tab === 'extra') renderExtra(currentChar);
}

function renderOverview(char) {
  const ov = char.overview || {};
  document.getElementById('tab-overview').innerHTML = `
    <div class="overview-grid">
      <div class="info-card"><div class="info-card-title">Identity</div>
        ${ov.fullName ? `<div class="stat-row"><span class="stat-label">Full Name</span><span class="stat-value">${ov.fullName}</span></div>` : ''}
        ${ov.height ? `<div class="stat-row"><span class="stat-label">Height</span><span class="stat-value">${ov.height}</span></div>` : ''}
        ${ov.gender ? `<div class="stat-row"><span class="stat-label">Gender</span><span class="stat-value">${ov.gender}</span></div>` : ''}
        ${ov.occupation ? `<div class="stat-row"><span class="stat-label">Occupation</span><span class="stat-value">${ov.occupation}</span></div>` : ''}
      </div>
      <div class="info-card"><div class="info-card-title">Preferences</div>
        <div style="margin-bottom:12px;"><div style="font-size:11px;color:var(--text3);">LIKES</div><div class="list-pills">${(ov.likes || []).map(l => `<span class="pill like">${l}</span>`).join('')}</div></div>
        <div><div style="font-size:11px;color:var(--text3);">DISLIKES</div><div class="list-pills">${(ov.dislikes || []).map(l => `<span class="pill dislike">${l}</span>`).join('')}</div></div>
      </div>
      <div class="info-card overview-full"><div class="info-card-title">Personality</div><p class="text-block">${ov.personalitySummary || ''}</p></div>
      <div class="info-card overview-full"><div class="info-card-title">Background</div><p class="text-block">${ov.backgroundSummary || ''}</p></div>
      <div class="info-card"><div class="info-card-title">Hobbies</div><div class="list-pills">${(ov.hobbies || []).map(h => `<span class="pill hobby">${h}</span>`).join('')}</div></div>
      <div class="info-card"><div class="info-card-title">Relationship</div><p class="text-block">${ov.relationshipBehavior || ''}</p></div>
      <div class="info-card overview-full"><div class="info-card-title">Equipment / Fighting Style</div><p class="text-block">${ov.equipment || ''}</p></div>
    </div>
  `;
}

function renderGallery(char) {
  const items = char.gallery || [];
  if (!items.length) {
    document.getElementById('tab-gallery').innerHTML = '<div class="empty-state" style="padding:48px;text-align:center;">No gallery items.</div>';
    return;
  }
  document.getElementById('tab-gallery').innerHTML = `<div class="gallery-grid">${items.map((img, i) => {
    const imgSrc = resolveMediaPath(char, img.src, "picture");
    const escapedDesc = (img.description || '').replace(/"/g, '&quot;');
    return `
      <div class="gallery-item" data-gallery-idx="${i}">
        <div class="gallery-thumb">${imgSrc ? `<img src="${imgSrc}" onerror="this.parentElement.innerHTML='<div style=\'padding:20px;text-align:center;\'>🎨 ${img.title}</div>'">` : `<div style="padding:20px;text-align:center;">🎨 ${img.title}</div>`}</div>
        <div class="gallery-caption">
          <div class="cap-title" title="${img.title}">${img.title}</div>
          <div class="cap-date">${formatDate(img.date)}</div>
          ${img.description ? `<div class="cap-desc" data-fulltext="${escapedDesc}" title="${escapedDesc}">${img.description}</div>` : ''}
        </div>
      </div>
    `;
  }).join('')}</div>`;
  // ... rest of the function
  document.querySelectorAll('.gallery-item').forEach(el => {
    el.addEventListener('click', () => openLightbox(currentChar, parseInt(el.dataset.galleryIdx)));
  });
}

function openLightbox(char, idx) {
  const img = char.gallery[idx];
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const ph = document.getElementById('lightbox-placeholder');
  const imgSrc = resolveMediaPath(char, img.src, "picture");
  if (imgSrc) {
    lbImg.src = imgSrc;
    lbImg.style.display = 'block';
    ph.style.display = 'none';
  } else {
    lbImg.style.display = 'none';
    ph.style.display = 'flex';
    ph.innerHTML = '🖼️ No image preview';
  }
  document.getElementById('lightbox-title').innerHTML = img.title;
  document.getElementById('lightbox-desc').innerHTML = img.description || '';
  lb.classList.add('open');
}

function renderVideo(char) {
  const videos = char.videos || [];
  if (!videos.length) {
    document.getElementById('tab-video').innerHTML = '<div class="empty-state" style="padding:48px;text-align:center;">No video content.</div>';
    return;
  }
  document.getElementById('tab-video').innerHTML = `<div class="video-list">${videos.map(v => {
    const thumbSrc = resolveMediaPath(char, v.thumbnailUrl, "picture");
    const videoUrl = v.url ? resolveMediaPath(char, v.url, "video") : null;
    return `
      <div class="video-card">
        <div class="video-thumb-wrap" data-video-type="${v.youtubeId ? 'youtube' : (videoUrl ? 'file' : 'none')}" data-video-id="${v.youtubeId || ''}" data-video-url="${videoUrl || ''}">
          ${thumbSrc ? `<img src="${thumbSrc}" onerror="this.style.display='none'">` : '<div style="width:100%;height:100%;background:var(--bg4);display:flex;align-items:center;justify-content:center;">📹</div>'}
          <div class="play-btn">▶</div>
        </div>
        <div class="video-info">
          <div class="video-title">${v.title}</div>
          <div class="video-date">${formatDate(v.date)}</div>
          ${v.description ? `<div class="video-desc">${v.description}</div>` : ''}
        </div>
      </div>
    `;
  }).join('')}</div>`;
  document.querySelectorAll('.video-thumb-wrap').forEach(wrap => {
    wrap.addEventListener('click', (e) => {
      const type = wrap.dataset.videoType;
      if (type === 'youtube') {
        const ytid = wrap.dataset.videoId;
        wrap.innerHTML = `<iframe width="100%" height="220" src="https://www.youtube.com/embed/${ytid}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
      } else if (type === 'file') {
        const url = wrap.dataset.videoUrl;
        wrap.innerHTML = `<video width="100%" controls autoplay><source src="${url}"></video>`;
      }
    });
  });
}

function renderExtra(char) {
  const ex = char.extra || {};
  let html = '';
  if (ex.lore) html += `<div class="extra-section"><div class="extra-section-title">📖 Lore & Backstory</div><p class="text-block">${ex.lore}</p></div>`;
  if (ex.trivia?.length) html += `<div class="extra-section"><div class="extra-section-title">💡 Trivia</div>${ex.trivia.map((t, i) => `<div class="trivia-item"><span class="trivia-num">#${String(i + 1).padStart(2, '0')}</span> ${t}</div>`).join('')}</div>`;
  if (ex.dailyLife) html += `<div class="extra-section"><div class="extra-section-title">🌙 Daily Life</div><p class="text-block">${ex.dailyLife}</p></div>`;
  if (ex.habits?.length) html += `<div class="extra-section"><div class="extra-section-title">🔄 Habits & Mannerisms</div><div class="habit-grid">${ex.habits.map(h => `<div class="habit-card"><div class="habit-card-label">${h.label}</div><div>${h.text}</div></div>`).join('')}</div></div>`;
  document.getElementById('tab-extra').innerHTML = html || '<div class="empty-state" style="padding:48px;text-align:center;">No extra information.</div>';
}

function formatDate(str) {
  if (!str) return '';
  try {
    return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return str;
  }
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

function addCharacterFromFolder(folderName) {
  const scriptPath = `./characters/${folderName}/data.js`;
  const script = document.createElement('script');
  script.src = scriptPath;
  script.onload = () => {
    refreshUI();
    alert(`Character loaded from folder: ${folderName}`);
  };
  script.onerror = () => alert(`Failed to load character from folder: ${folderName}`);
  document.head.appendChild(script);
}

function reloadManifest() {
  loadAllCharacters();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// ======================== EVENT LISTENERS ========================
document.getElementById('burger-btn').addEventListener('click', toggleSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);
document.getElementById('search-input').addEventListener('input', (e) => {
  activeSearchQuery = e.target.value.toLowerCase().trim();
  renderSidebar();
});
document.getElementById('add-char-folder').addEventListener('click', () => {
  const folderName = prompt('Enter folder name (e.g., "ayumi"):');
  if (folderName) addCharacterFromFolder(folderName);
});
document.getElementById('reload-manifest').addEventListener('click', reloadManifest);
document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});
document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

// ======================== BOOTSTRAP ========================
loadAllCharacters();