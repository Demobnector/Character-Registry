// ======================== MANIFEST ========================
const CHARACTER_FOLDERS = [
  "natasha"
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
  const subfolder = type === "video" ? "videos" : "images";
  return `./characters/${char.id}/${subfolder}/${path}`;
}

// ======================== STATE ========================
let allCharacters = [];
let currentChar = null;
let currentTab = 'overview';
let activeSearchQuery = '';

// ======================== LIGHTBOX ZOOM STATE ========================
let currentZoom = 1;
let isPanning = false;
let panStartX = 0, panStartY = 0;
let panStartScrollLeft = 0, panStartScrollTop = 0;

// ======================== ZOOM FUNCTIONS ========================
function updateZoomUI() {
  const imgWrap = document.getElementById('lightbox-img-wrap');
  const indicator = document.getElementById('zoom-indicator');
  if (indicator) indicator.textContent = `${Math.round(currentZoom * 100)}%`;
  
  if (imgWrap) {
    if (currentZoom === 1) {
      imgWrap.classList.remove('zoomed');
      imgWrap.style.cursor = 'zoom-in';
    } else {
      imgWrap.classList.add('zoomed');
      imgWrap.style.cursor = 'grab';
    }
  }
}

function zoomAtPoint(clientX, clientY, delta) {
  const imgWrap = document.getElementById('lightbox-img-wrap');
  const img = document.getElementById('lightbox-img');
  if (!imgWrap || !img) return;
  
  // Get the image element's actual dimensions
  const imgRect = img.getBoundingClientRect();
  const wrapRect = imgWrap.getBoundingClientRect();
  
  // Calculate cursor position relative to the image (not the scrollable area)
  // This is the key fix - we need coordinates relative to the image itself
  const x = clientX - imgRect.left;
  const y = clientY - imgRect.top;
  
  // Calculate percentage position on the image (0 to 1)
  const percentX = Math.min(1, Math.max(0, x / imgRect.width));
  const percentY = Math.min(1, Math.max(0, y / imgRect.height));
  
  // Calculate new zoom level
  let newZoom = currentZoom + delta;
  newZoom = Math.min(3, Math.max(1, newZoom));
  
  if (newZoom === currentZoom) return;
  
  // Calculate new scroll position to keep the same point under cursor
  // When zoom changes, the image size changes, so we need to adjust scroll
  const oldZoom = currentZoom;
  currentZoom = newZoom;
  
  // Apply the transform
  img.style.transform = `scale(${currentZoom})`;
  updateZoomUI();
  
  // Wait for the transform to apply, then calculate scroll position
  setTimeout(() => {
    const newImgRect = img.getBoundingClientRect();
    
    // Where should the same percentage point be on the new image?
    const targetX = newImgRect.left + (newImgRect.width * percentX);
    const targetY = newImgRect.top + (newImgRect.height * percentY);
    
    // How much do we need to scroll to bring that point under the cursor?
    const scrollDeltaX = targetX - clientX;
    const scrollDeltaY = targetY - clientY;
    
    // Apply the scroll adjustment
    imgWrap.scrollLeft += scrollDeltaX;
    imgWrap.scrollTop += scrollDeltaY;
  }, 0);
}

function zoomIn(e) {
  let clientX, clientY;
  if (e && e.clientX !== undefined) {
    clientX = e.clientX;
    clientY = e.clientY;
  } else {
    // Center of viewport for button clicks
    const rect = document.getElementById('lightbox-img-wrap').getBoundingClientRect();
    clientX = rect.left + rect.width / 2;
    clientY = rect.top + rect.height / 2;
  }
  zoomAtPoint(clientX, clientY, 0.5);
}

function zoomOut(e) {
  let clientX, clientY;
  if (e && e.clientX !== undefined) {
    clientX = e.clientX;
    clientY = e.clientY;
  } else {
    const rect = document.getElementById('lightbox-img-wrap').getBoundingClientRect();
    clientX = rect.left + rect.width / 2;
    clientY = rect.top + rect.height / 2;
  }
  zoomAtPoint(clientX, clientY, -0.5);
}

function resetZoom() {
  const imgWrap = document.getElementById('lightbox-img-wrap');
  const img = document.getElementById('lightbox-img');
  if (!imgWrap || !img) return;
  currentZoom = 1;
  img.style.transform = 'scale(1)';
  imgWrap.scrollLeft = 0;
  imgWrap.scrollTop = 0;
  updateZoomUI();
}

function handleWheel(e) {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  e.preventDefault();
  if (e.deltaY < 0) {
    zoomIn(e);
  } else {
    zoomOut(e);
  }
}

// ======================== PANNING FUNCTIONS (FIXED) ========================
function startPanning(e) {
  const imgWrap = document.getElementById('lightbox-img-wrap');
  if (!imgWrap || currentZoom === 1) return;
  
  e.preventDefault();
  isPanning = true;
  
  const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
  const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
  
  panStartX = clientX;
  panStartY = clientY;
  panStartScrollLeft = imgWrap.scrollLeft;
  panStartScrollTop = imgWrap.scrollTop;
  
  imgWrap.style.cursor = 'grabbing';
}

function doPanning(e) {
  if (!isPanning) return;
  
  const imgWrap = document.getElementById('lightbox-img-wrap');
  if (!imgWrap) return;
  
  e.preventDefault();
  
  const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
  const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
  
  const dx = clientX - panStartX;
  const dy = clientY - panStartY;
  
  imgWrap.scrollLeft = panStartScrollLeft - dx;
  imgWrap.scrollTop = panStartScrollTop - dy;
}

function stopPanning() {
  if (!isPanning) return;
  const imgWrap = document.getElementById('lightbox-img-wrap');
  isPanning = false;
  if (imgWrap) {
    imgWrap.style.cursor = currentZoom === 1 ? 'zoom-in' : 'grab';
  }
}

// ======================== RENDER FUNCTIONS (keep all your existing ones) ========================
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
          <div class="char-list-name">${escapeHtml(c.name)}</div>
          <div class="char-list-role">${escapeHtml(c.overview?.occupation || 'unknown')}</div>
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
        <div class="splash-name">${escapeHtml(c.name)}</div>
        <div class="splash-role">${escapeHtml(c.overview?.occupation?.split('/')[0] || '')}</div>
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
  tagsContainer.innerHTML = (char.tags || []).map(t => `<span class="hero-tag ${t.style || ''}">${escapeHtml(t.label)}</span>`).join('');
  const statsContainer = document.getElementById('hero-stats');
  statsContainer.innerHTML = (char.stats || []).map(s => `<div class="hero-stat">${escapeHtml(s.label)}: <span>${escapeHtml(s.value)}</span></div>`).join('');
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
        ${ov.fullName ? `<div class="stat-row"><span class="stat-label">Full Name</span><span class="stat-value">${escapeHtml(ov.fullName)}</span></div>` : ''}
        ${ov.height ? `<div class="stat-row"><span class="stat-label">Height</span><span class="stat-value">${escapeHtml(ov.height)}</span></div>` : ''}
        ${ov.gender ? `<div class="stat-row"><span class="stat-label">Gender</span><span class="stat-value">${escapeHtml(ov.gender)}</span></div>` : ''}
        ${ov.occupation ? `<div class="stat-row"><span class="stat-label">Occupation</span><span class="stat-value">${escapeHtml(ov.occupation)}</span></div>` : ''}
      </div>
      <div class="info-card"><div class="info-card-title">Preferences</div>
        <div style="margin-bottom:12px;"><div style="font-size:11px;color:var(--text3);">LIKES</div><div class="list-pills">${(ov.likes || []).map(l => `<span class="pill like">${escapeHtml(l)}</span>`).join('')}</div></div>
        <div><div style="font-size:11px;color:var(--text3);">DISLIKES</div><div class="list-pills">${(ov.dislikes || []).map(l => `<span class="pill dislike">${escapeHtml(l)}</span>`).join('')}</div></div>
      </div>
      <div class="info-card overview-full"><div class="info-card-title">Personality</div><p class="text-block">${escapeHtml(ov.personalitySummary || '')}</p></div>
      <div class="info-card overview-full"><div class="info-card-title">Background</div><p class="text-block">${escapeHtml(ov.backgroundSummary || '')}</p></div>
      <div class="info-card"><div class="info-card-title">Hobbies</div><div class="list-pills">${(ov.hobbies || []).map(h => `<span class="pill hobby">${escapeHtml(h)}</span>`).join('')}</div></div>
      <div class="info-card"><div class="info-card-title">Relationship</div><p class="text-block">${escapeHtml(ov.relationshipBehavior || '')}</p></div>
      <div class="info-card overview-full"><div class="info-card-title">Equipment / Fighting Style</div><p class="text-block">${escapeHtml(ov.equipment || '')}</p></div>
    </div>
  `;
}

function renderGallery(char) {
  const items = char.gallery || [];
  const galleryContainer = document.getElementById('tab-gallery');
  
  if (!items.length) {
    galleryContainer.innerHTML = '<div class="empty-state" style="padding:48px;text-align:center;">No gallery items.</div>';
    return;
  }
  
  // Get category configuration from character data (optional)
  const categoryConfig = char.galleryCategories || {};
  const categoryOrder = categoryConfig.order || []; // Empty by default
  const categoryNames = categoryConfig.names || {};
  const categoryIcons = categoryConfig.icons || {};
  
  // Auto-discover all categories from gallery items
  const allCategories = [...new Set(items.map(item => item.category || 'uncategorized'))];
  
  // Group items by category
  const groupedItems = {};
  items.forEach((item, originalIndex) => {
    const category = item.category || 'uncategorized';
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push({ ...item, originalIndex });
  });
  
  // Determine display order:
  // 1. Use custom order from data.js if provided
  // 2. Otherwise, sort alphabetically
  let orderedCategories;
  if (categoryOrder.length > 0) {
    // Only include categories that actually have items
    orderedCategories = categoryOrder.filter(cat => groupedItems[cat]);
    // Add any missing categories (that have items but weren't in order) at the end
    const missingCategories = allCategories.filter(cat => !categoryOrder.includes(cat));
    orderedCategories = [...orderedCategories, ...missingCategories];
  } else {
    // No custom order, sort alphabetically
    orderedCategories = allCategories.sort();
  }
  
  // Build HTML with category sections
  let html = '';
  
  orderedCategories.forEach(category => {
    const categoryItems = groupedItems[category];
    if (categoryItems && categoryItems.length > 0) {
      // Get display name from data.js, or fallback to capitalized category name
      const displayName = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
      // Get icon from data.js (can be empty string, emoji, or text)
      const icon = categoryIcons[category] || '';
      
      html += `
        <div class="gallery-category-section">
          <div class="gallery-category-header">
            <span class="gallery-category-title">${icon ? icon + ' ' : ''}${displayName}</span>
            <span class="gallery-category-count">${categoryItems.length} item${categoryItems.length !== 1 ? 's' : ''}</span>
          </div>
          <div class="gallery-category-grid">
      `;
      
      categoryItems.forEach(img => {
        const imgSrc = resolveMediaPath(char, img.src, "picture");
        html += `
          <div class="gallery-item" data-gallery-idx="${img.originalIndex}">
            <div class="gallery-thumb">${imgSrc ? `<img src="${imgSrc}" onerror="this.parentElement.innerHTML='<div style=\'padding:20px;text-align:center;\'>🎨 ${escapeHtml(img.title)}</div>'">` : `<div style="padding:20px;text-align:center;">🎨 ${escapeHtml(img.title)}</div>`}</div>
            <div class="gallery-caption">
              <div class="cap-title" title="${escapeHtml(img.title)}">${escapeHtml(img.title)}</div>
              <div class="cap-date">${formatDate(img.date)}</div>
              ${img.description ? `<div class="cap-desc">${escapeHtml(img.description)}</div>` : ''}
            </div>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    }
  });
  
  galleryContainer.innerHTML = html;
  
  // Add click listeners to gallery items
  document.querySelectorAll('.gallery-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.galleryIdx);
      openLightbox(currentChar, idx);
    });
  });
}

function openLightbox(char, idx) {
  const img = char.gallery[idx];
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const ph = document.getElementById('lightbox-placeholder');
  const imgSrc = resolveMediaPath(char, img.src, "picture");
  
  resetZoom();
  
  if (imgSrc) {
    lbImg.src = imgSrc;
    lbImg.style.display = 'block';
    if (ph) ph.style.display = 'none';
  } else {
    lbImg.style.display = 'none';
    if (ph) {
      ph.style.display = 'flex';
      ph.innerHTML = '🖼️ No image preview';
    }
  }
  document.getElementById('lightbox-title').innerHTML = escapeHtml(img.title);
  document.getElementById('lightbox-desc').innerHTML = escapeHtml(img.description || '');
  lb.classList.add('open');
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  resetZoom();
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
          <div class="video-title">${escapeHtml(v.title)}</div>
          <div class="video-date">${formatDate(v.date)}</div>
          ${v.description ? `<div class="video-desc">${escapeHtml(v.description)}</div>` : ''}
        </div>
      </div>
    `;
  }).join('')}</div>`;
  document.querySelectorAll('.video-thumb-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
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
  if (ex.lore) html += `<div class="extra-section"><div class="extra-section-title">📖 Lore & Backstory</div><p class="text-block">${escapeHtml(ex.lore)}</p></div>`;
  if (ex.trivia?.length) html += `<div class="extra-section"><div class="extra-section-title">💡 Trivia</div>${ex.trivia.map((t, i) => `<div class="trivia-item"><span class="trivia-num">#${String(i + 1).padStart(2, '0')}</span> <span>${escapeHtml(t)}</span></div>`).join('')}</div>`;
  if (ex.dailyLife) html += `<div class="extra-section"><div class="extra-section-title">🌙 Daily Life</div><p class="text-block">${escapeHtml(ex.dailyLife)}</p></div>`;
  if (ex.habits?.length) html += `<div class="extra-section"><div class="extra-section-title">🔄 Habits & Mannerisms</div><div class="habit-grid">${ex.habits.map(h => `<div class="habit-card"><div class="habit-card-label">${escapeHtml(h.label)}</div><div>${escapeHtml(h.text)}</div></div>`).join('')}</div></div>`;
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

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

// Zoom controls
document.getElementById('zoom-in-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  zoomIn();
});
document.getElementById('zoom-out-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  zoomOut();
});
document.getElementById('zoom-reset-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  resetZoom();
});

// Wheel zoom on entire lightbox
document.getElementById('lightbox').addEventListener('wheel', handleWheel, { passive: false });

// Panning events
const imgWrap = document.getElementById('lightbox-img-wrap');
if (imgWrap) {
  imgWrap.addEventListener('mousedown', startPanning);
  imgWrap.addEventListener('touchstart', startPanning, { passive: false });
  imgWrap.addEventListener('touchmove', doPanning, { passive: false });
  imgWrap.addEventListener('touchend', stopPanning);
}
window.addEventListener('mousemove', doPanning);
window.addEventListener('mouseup', stopPanning);

// Tab buttons
document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

// ======================== BOOTSTRAP ========================
loadAllCharacters();