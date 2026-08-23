/**
 * ScentTopography3D - Interactive 3D Olfactory Landscape & 2D Scent Map Engine
 * Maps all 144+ odor types and blender groups in the TGSC database
 * onto a continuous 360° 2D Ground Floor and 3D Mountain Elevation (Z).
 */

const SCENT_SECTORS = [
  {
    id: 'citrus',
    name: 'Citrus & Aldehydes',
    icon: '🍋',
    angle: 0,
    color: '#facc15',
    subOdors: [
      'citrus', 'citrus (lime)', 'citrus (orange)', 'mandarin', 'grapefruit', 'yuzu',
      'aldehydic (clean)', 'aldehydic (complex)', 'aliphatic', 'citronella', 'ethereal',
      'terpenic', 'acetic', 'acidic', 'astringent', 'clean', 'sour', 'vinegar'
    ]
  },
  {
    id: 'green',
    name: 'Green & Herbaceous',
    icon: '🌿',
    angle: 30,
    color: '#4ade80',
    subOdors: [
      'green', 'green (stem)', 'green (bitter)', 'green (fatty)', 'green (gemstone)', 'green (harsh)',
      'herbal', 'mint', 'minty', 'facet (minty)', 'facet (wintergreen)', 'sage', 'basil', 'rosemary',
      'thyme', 'lavender', 'galbanum', 'grassy', 'foliage', 'tarragon', 'celery', 'thujonic',
      'vegetable', 'radish', 'rhubarb', 'tomato', 'mustard', 'wasabi'
    ]
  },
  {
    id: 'aquatic',
    name: 'Aquatic & Marine',
    icon: '🌊',
    angle: 60,
    color: '#38bdf8',
    subOdors: [
      'marine', 'facet (marine)', 'facet (oceanic)', 'aquatic', 'water (fresh)', 'calone',
      'cucumber', 'fresh air', 'cooling', 'ozonic', 'oceanic', 'seaweed'
    ]
  },
  {
    id: 'fresh_floral',
    name: 'Fresh Floral (Muguet)',
    icon: '🌸',
    angle: 90,
    color: '#f472b6',
    subOdors: [
      'floral (fresh)', 'floral (muguet)', 'muguet', 'floral (lilac)', 'floral (peony)',
      'floral (hawthorn)', 'hedione', 'freesia', 'magnolia', 'transparent floral', 'cyclamen', 'lotus'
    ]
  },
  {
    id: 'heavy_floral',
    name: 'Warm Floral (Rose/Jasmin)',
    icon: '🌺',
    angle: 120,
    color: '#e879f9',
    subOdors: [
      'floral', 'floral (heavy)', 'floral (rose)', 'floral (jasmine)', 'floral (ylang)',
      'floral (orange bl.)', 'floral (violet)', 'floral (orris)', 'floral (powder)',
      'tuberose', 'gardenia', 'carnation', 'neroli', 'damascenone', 'geraniol', 'pea'
    ]
  },
  {
    id: 'fruity',
    name: 'Fruity & Berry',
    icon: '🍑',
    angle: 150,
    color: '#fb923c',
    subOdors: [
      'fruity', 'fruit (apple/plum)', 'fruit (pineapple)', 'fruit (strawberry)', 'fruit (tropical)',
      'apple', 'berry', 'cherry', 'peach', 'apricot', 'cassis', 'melon', 'banana', 'pear', 'plum',
      'grape', 'estery', 'jammy', 'juicy'
    ]
  },
  {
    id: 'gourmand',
    name: 'Gourmand & Vanilla',
    icon: '🍨',
    angle: 180,
    color: '#fbbf24',
    subOdors: [
      'gourmet', 'gourmet (sweet)', 'gourmet (buttery)', 'gourmet (nutty)', 'gourmet (coconut)',
      'vanilla', 'caramellic', 'chocolate', 'cocoa', 'coffee', 'honey', 'almond', 'coconut',
      'bready', 'buttery', 'candy', 'coumarinic', 'creamy', 'dairy', 'malty', 'molasses',
      'popcorn', 'toasted', 'tonka', 'corn', 'corn chip'
    ]
  },
  {
    id: 'amber',
    name: 'Amber & Balsamic',
    icon: '✨',
    angle: 210,
    color: '#f59e0b',
    subOdors: [
      'amber', 'amber (rich)', 'amber (powerful)', 'balsamic', 'benzoin', 'labdanum',
      'cistus', 'myrrh', 'frankincense', 'incense', 'styrax', 'elemi', 'opoponax', 'resinous',
      'spicy', 'spice (saffron)', 'peppery', 'anise', 'anisic', 'licorice'
    ]
  },
  {
    id: 'animalic',
    name: 'Animalic, Leather & Musk',
    icon: '🦌',
    angle: 240,
    color: '#c084fc',
    subOdors: [
      'animal', 'animalic', 'civet', 'castoreum', 'musk', 'musk (botanical)', 'musk (woody)',
      'leather', 'costus', 'indolic', 'skatole', 'alliaceous', 'garlic', 'onion', 'cabbage',
      'sulfurous', 'ammoniacal', 'cheesy', 'eggy', 'fishy', 'meaty', 'savory', 'seafood', 'sweaty'
    ]
  },
  {
    id: 'dry_wood',
    name: 'Dry Woods & Smoke',
    icon: '🪵',
    angle: 270,
    color: '#a3e635',
    subOdors: [
      'woods (dry amber)', 'woods (pine)', 'woods (pepper)', 'woods (rot)', 'cedar',
      'vetiver', 'guaiacwood', 'smoke', 'smoky', 'tar', 'birch', 'fir needle', 'pine',
      'dry', 'burnt', 'phenolic', 'tobacco'
    ]
  },
  {
    id: 'creamy_wood',
    name: 'Creamy Woods & Sandal',
    icon: '🌲',
    angle: 300,
    color: '#2dd4bf',
    subOdors: [
      'woody', 'woody amber', 'woods (sandal)', 'woods (agarwood)', 'sandalwood',
      'cashmeran', 'oud', 'agarwood', 'milky', 'lactonic', 'iso e super', 'tea',
      'rummy', 'whiskey', 'winey', 'alcoholic', 'fusel', 'fermented', 'yeasty'
    ]
  },
  {
    id: 'mossy',
    name: 'Earthy & Oakmoss',
    icon: '🦠',
    angle: 330,
    color: '#10b981',
    subOdors: [
      'woods (mossy)', 'woods (patchouli)', 'mossy', 'oakmoss', 'evernyl', 'veramoss',
      'patchouli', 'earthy', 'earthy (mushroom)', 'mushroom', 'fungal', 'soil', 'humus',
      'lichen', 'damp', 'musty', 'moldy', 'dusty', 'rooty', 'potato'
    ]
  }
];

// Helper to find sector for any query
function classifyScentSector(text, fallbackFam) {
  const s = ((text || '') + ' ' + (fallbackFam || '')).toLowerCase();
  
  for (const sec of SCENT_SECTORS) {
    for (const sub of sec.subOdors) {
      if (s.includes(sub)) return sec.id;
    }
  }

  // Broad keyword fallbacks
  if (/\b(citrus|lemon|lime|orange|bergamot|grapefruit|mandarin|aldehyde|citral|limonene)\b/.test(s)) return 'citrus';
  if (/\b(green|grass|herb|herbal|mint|basil|sage|lavender|rosemary|thyme|galbanum)\b/.test(s)) return 'green';
  if (/\b(marine|ozone|aquatic|sea|water|calone|ocean|watery|fresh air|ozonic)\b/.test(s)) return 'aquatic';
  if (/\b(muguet|lily|lilac|freesia|hyacinth|fresh floral|cyclamen|magnolia|hedione)\b/.test(s)) return 'fresh_floral';
  if (/\b(rose|jasmine|jasmin|tuberose|gardenia|ylang|violet|carnation|floral|damasc|geraniol)\b/.test(s)) return 'heavy_floral';
  if (/\b(fruit|fruity|apple|peach|berry|raspberry|strawberry|cherry|plum|melon|tropical)\b/.test(s)) return 'fruity';
  if (/\b(gourmand|vanill|caramel|sugar|honey|chocolate|coffee|coumarin|maltol|sweet)\b/.test(s)) return 'gourmand';
  if (/\b(amber|benzoin|labdanum|cistus|myrrh|frankincense|incense|balsam|ambroxan|spice)\b/.test(s)) return 'amber';
  if (/\b(animal|animalic|civet|castoreum|musk|leather|indol|skatol|costus)\b/.test(s)) return 'animalic';
  if (/\b(cedar|vetiver|smoke|smoky|tar|guaiac|birch|dry wood|pine|cypress)\b/.test(s)) return 'dry_wood';
  if (/\b(sandal|sandalwood|cashmeran|oud|agarwood|creamy|milky|woody)\b/.test(s)) return 'creamy_wood';
  if (/\b(moss|oakmoss|veramoss|patchouli|earthy|soil|fungal|mushroom)\b/.test(s)) return 'mossy';

  return 'heavy_floral';
}

class ScentTopography3D {
  constructor(containerEl, options = {}) {
    this.container = typeof containerEl === 'string' ? document.getElementById(containerEl) : containerEl;
    if (!this.container) return;

    this.options = Object.assign({
      width: this.container.clientWidth || 600,
      height: 380,
      gridRes: 26,
      maxElevation: 130
    }, options);

    this.pitch = 54 * (Math.PI / 180);
    this.yaw = 40 * (Math.PI / 180);
    this.zoom = 1.0;
    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.hoverSector = null;

    this.sectorWeights = {};
    this.sectorBlenders = {};
    SCENT_SECTORS.forEach(sec => {
      this.sectorWeights[sec.id] = 0;
      this.sectorBlenders[sec.id] = [];
    });

    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.userSelect = 'none';

    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'relative';
    this.wrapper.style.width = '100%';
    this.wrapper.style.height = `${this.options.height}px`;
    this.wrapper.style.background = 'radial-gradient(circle at center, #111827 0%, #090d16 100%)';
    this.wrapper.style.borderRadius = 'var(--radius-md, 8px)';
    this.wrapper.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    this.wrapper.style.overflow = 'hidden';

    this.canvas = document.createElement('canvas');
    this.canvas.width = (this.container.clientWidth || this.options.width) * (window.devicePixelRatio || 1);
    this.canvas.height = this.options.height * (window.devicePixelRatio || 1);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.cursor = 'grab';
    this.ctx = this.canvas.getContext('2d');

    this.wrapper.appendChild(this.canvas);

    // Overlay Toolbar
    this.toolbar = document.createElement('div');
    this.toolbar.style.position = 'absolute';
    this.toolbar.style.top = '10px';
    this.toolbar.style.right = '10px';
    this.toolbar.style.display = 'flex';
    this.toolbar.style.gap = '6px';
    this.toolbar.style.zIndex = '10';

    this.toolbar.innerHTML = `
      <button class="topography-btn" id="topo-btn-3d" title="Isometric 3D Mountain View" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; cursor: pointer;">🏔️ 3D View</button>
      <button class="topography-btn" id="topo-btn-2d" title="Top-Down 2D Radar View" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; cursor: pointer;">🧭 2D Ground Floor</button>
      <button class="topography-btn" id="topo-btn-atlas" title="Open 360 Scent Atlas Reference" style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); color: var(--accent-blue, #38bdf8); padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; cursor: pointer; font-weight: 600;">🗺️ Full Scent Map</button>
      <button class="topography-btn" id="topo-btn-reset" title="Reset Camera" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; cursor: pointer;">↺ Reset</button>
    `;

    this.wrapper.appendChild(this.toolbar);

    // HUD Tooltip Badge
    this.hud = document.createElement('div');
    this.hud.style.position = 'absolute';
    this.hud.style.bottom = '12px';
    this.hud.style.left = '12px';
    this.hud.style.background = 'rgba(15, 23, 42, 0.85)';
    this.hud.style.backdropFilter = 'blur(6px)';
    this.hud.style.border = '1px solid rgba(255, 255, 255, 0.12)';
    this.hud.style.padding = '6px 12px';
    this.hud.style.borderRadius = '6px';
    this.hud.style.fontSize = '0.78rem';
    this.hud.style.color = '#e2e8f0';
    this.hud.style.pointerEvents = 'none';
    this.hud.style.zIndex = '10';
    this.hud.innerHTML = `<strong>🏔️ 3D Scent Landscape</strong> <span style="color: var(--text-muted, #94a3b8); margin-left: 6px;">Drag to Orbit • Scroll to Zoom</span>`;

    this.wrapper.appendChild(this.hud);
    this.container.appendChild(this.wrapper);
  }

  bindEvents() {
    const el = this.canvas;

    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouse = { x: e.clientX, y: e.clientY };
      el.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) {
        this.handleHover(e);
        return;
      }
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;
      this.yaw += dx * 0.008;
      this.pitch = Math.max(0.05, Math.min(Math.PI / 2 - 0.05, this.pitch + dy * 0.008));
      this.lastMouse = { x: e.clientX, y: e.clientY };
      this.render();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      el.style.cursor = 'grab';
    });

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      this.zoom = Math.max(0.5, Math.min(2.5, this.zoom * zoomFactor));
      this.render();
    }, { passive: false });

    // Touch Support
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.lastMouse.x;
      const dy = e.touches[0].clientY - this.lastMouse.y;
      this.yaw += dx * 0.008;
      this.pitch = Math.max(0.05, Math.min(Math.PI / 2 - 0.05, this.pitch + dy * 0.008));
      this.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      this.render();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Toolbar Buttons
    const btn3D = this.wrapper.querySelector('#topo-btn-3d');
    const btn2D = this.wrapper.querySelector('#topo-btn-2d');
    const btnAtlas = this.wrapper.querySelector('#topo-btn-atlas');
    const btnReset = this.wrapper.querySelector('#topo-btn-reset');

    if (btn3D) btn3D.onclick = () => {
      this.pitch = 54 * (Math.PI / 180);
      this.yaw = 40 * (Math.PI / 180);
      this.zoom = 1.0;
      this.render();
    };

    if (btn2D) btn2D.onclick = () => {
      this.pitch = 0.08;
      this.yaw = 0;
      this.zoom = 1.0;
      this.render();
    };

    if (btnAtlas) btnAtlas.onclick = () => {
      openScentAtlasModal();
    };

    if (btnReset) btnReset.onclick = () => {
      this.pitch = 54 * (Math.PI / 180);
      this.yaw = 40 * (Math.PI / 180);
      this.zoom = 1.0;
      this.render();
    };

    if (window.ResizeObserver) {
      new ResizeObserver(() => {
        if (!this.container) return;
        const w = this.container.clientWidth;
        if (w > 50) {
          this.canvas.width = w * (window.devicePixelRatio || 1);
          this.render();
        }
      }).observe(this.container);
    }
  }

  handleHover(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < rect.height * 0.45 && dist > 15) {
      let angleRad = Math.atan2(dx, -dy);
      if (angleRad < 0) angleRad += Math.PI * 2;
      let angleDeg = angleRad * (180 / Math.PI);

      let closest = SCENT_SECTORS[0];
      let minDiff = 360;
      SCENT_SECTORS.forEach(sec => {
        let diff = Math.abs(sec.angle - angleDeg);
        if (diff > 180) diff = 360 - diff;
        if (diff < minDiff) {
          minDiff = diff;
          closest = sec;
        }
      });

      if (this.hoverSector !== closest.id) {
        this.hoverSector = closest.id;
        const count = this.sectorWeights[closest.id] || 0;
        const blenders = this.sectorBlenders[closest.id] || [];
        const top3 = blenders.slice(0, 3).map(b => b.name).join(', ') || 'No direct blenders';

        this.hud.innerHTML = `
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 1rem;">${closest.icon}</span>
            <strong style="color: ${closest.color};">${closest.name}</strong>
            <span style="background: rgba(255,255,255,0.1); padding: 1px 6px; border-radius: 4px; font-weight: 600; font-size: 0.72rem;">${count} Blenders</span>
          </div>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">Key Bridges: ${top3}</div>
        `;
        this.render();
      }
    } else if (this.hoverSector !== null) {
      this.hoverSector = null;
      this.hud.innerHTML = `<strong>🏔️ 3D Scent Landscape</strong> <span style="color: var(--text-muted, #94a3b8); margin-left: 6px;">Drag to Orbit • Scroll to Zoom</span>`;
      this.render();
    }
  }

  loadMaterial(mat) {
    SCENT_SECTORS.forEach(sec => {
      this.sectorWeights[sec.id] = 0;
      this.sectorBlenders[sec.id] = [];
    });

    if (mat.blenders_by_group) {
      Object.entries(mat.blenders_by_group).forEach(([grp, list]) => {
        list.forEach(b => {
          const secId = classifyScentSector(grp + ' ' + b.name, b.odor_group);
          this.sectorWeights[secId] = (this.sectorWeights[secId] || 0) + 1;
          this.sectorBlenders[secId].push(b);
        });
      });
    }

    const total = Object.values(this.sectorWeights).reduce((a, b) => a + b, 0);
    if (total === 0) {
      const primarySec = classifyScentSector(mat.family || mat.name, mat.family);
      this.sectorWeights[primarySec] = 10;
      (mat.facets || []).forEach(f => {
        const fSec = classifyScentSector(f, f);
        this.sectorWeights[fSec] = (this.sectorWeights[fSec] || 0) + 4;
      });
    }

    this.render();
  }

  loadAccord(accord, materialsMap) {
    SCENT_SECTORS.forEach(sec => {
      this.sectorWeights[sec.id] = 0;
      this.sectorBlenders[sec.id] = [];
    });

    (accord.ingredients || []).forEach(ing => {
      const mat = materialsMap ? materialsMap.get(ing.id) : null;
      const secId = classifyScentSector(ing.name, mat ? mat.family : accord.family);
      this.sectorWeights[secId] = (this.sectorWeights[secId] || 0) + 1;
      this.sectorBlenders[secId].push(ing);
    });

    this.render();
  }

  render() {
    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 + (this.pitch > 0.3 ? 20 : 0);
    const radius = Math.min(w, h) * 0.38 * this.zoom;

    const rawMax = Math.max(1, ...Object.values(this.sectorWeights));
    const normalizedWeights = {};
    SCENT_SECTORS.forEach(sec => {
      normalizedWeights[sec.id] = (this.sectorWeights[sec.id] || 0) / rawMax;
    });

    const project = (x, y, z) => {
      const x1 = x * Math.cos(this.yaw) - y * Math.sin(this.yaw);
      const y1 = x * Math.sin(this.yaw) + y * Math.cos(this.yaw);
      const x2 = x1;
      const y2 = y1 * Math.cos(this.pitch) - z * Math.sin(this.pitch);
      const z2 = y1 * Math.sin(this.pitch) + z * Math.cos(this.pitch);

      return {
        px: cx + x2 * radius,
        py: cy + y2 * radius,
        depth: z2
      };
    };

    // 1. Concentric Rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    [0.33, 0.66, 1.0].forEach(rRatio => {
      ctx.beginPath();
      for (let a = 0; a <= 360; a += 10) {
        const rad = a * (Math.PI / 180);
        const pt = project(Math.sin(rad) * rRatio, -Math.cos(rad) * rRatio, 0);
        if (a === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.closePath();
      ctx.stroke();
    });

    // Radial Sector Rays
    SCENT_SECTORS.forEach(sec => {
      const rad = sec.angle * (Math.PI / 180);
      const pCenter = project(0, 0, 0);
      const pEdge = project(Math.sin(rad), -Math.cos(rad), 0);
      
      ctx.beginPath();
      ctx.moveTo(pCenter.px, pCenter.py);
      ctx.lineTo(pEdge.px, pEdge.py);
      ctx.strokeStyle = this.hoverSector === sec.id ? sec.color : 'rgba(255, 255, 255, 0.06)';
      ctx.stroke();
    });

    // 2. Generate 3D Topographic Mesh Grid
    const res = this.options.gridRes;
    const grid = [];
    const maxZ = (this.options.maxElevation / radius) * (this.pitch < 0.2 ? 0.1 : 1.0);

    for (let i = 0; i <= res; i++) {
      grid[i] = [];
      const gx = (i / res) * 2 - 1;
      for (let j = 0; j <= res; j++) {
        const gy = (j / res) * 2 - 1;
        const distFromCenter = Math.sqrt(gx * gx + gy * gy);

        let elevation = 0;
        if (distFromCenter <= 1.05) {
          SCENT_SECTORS.forEach(sec => {
            const sRad = sec.angle * (Math.PI / 180);
            const sx = Math.sin(sRad) * 0.72;
            const sy = -Math.cos(sRad) * 0.72;
            const d = (gx - sx) * (gx - sx) + (gy - sy) * (gy - sy);
            const w = normalizedWeights[sec.id] || 0;
            elevation += w * Math.exp(-d / 0.12);
          });

          const edgeFalloff = Math.max(0, 1.0 - Math.pow(distFromCenter, 4));
          elevation = elevation * edgeFalloff * maxZ;
        }

        const pt = project(gx, gy, elevation);
        grid[i][j] = { gx, gy, z: elevation, px: pt.px, py: pt.py, depth: pt.depth, valid: distFromCenter <= 1.05 };
      }
    }

    // 3. Render Shaded Quads (Depth Sorted)
    const quads = [];
    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const p0 = grid[i][j];
        const p1 = grid[i + 1][j];
        const p2 = grid[i + 1][j + 1];
        const p3 = grid[i][j + 1];

        if (p0.valid && p1.valid && p2.valid && p3.valid) {
          const avgDepth = (p0.depth + p1.depth + p2.depth + p3.depth) / 4;
          const avgZ = (p0.z + p1.z + p2.z + p3.z) / 4;
          quads.push({ p0, p1, p2, p3, avgDepth, avgZ });
        }
      }
    }

    quads.sort((a, b) => a.avgDepth - b.avgDepth);

    quads.forEach(q => {
      const normHeight = Math.min(1.0, q.avgZ / (maxZ * 0.85 || 1));

      let fillColor = 'rgba(15, 23, 42, 0.75)';
      if (normHeight > 0.65) {
        fillColor = `rgba(244, 63, 94, ${0.4 + normHeight * 0.45})`;
      } else if (normHeight > 0.35) {
        fillColor = `rgba(251, 191, 36, ${0.35 + normHeight * 0.4})`;
      } else if (normHeight > 0.12) {
        fillColor = `rgba(16, 185, 129, ${0.3 + normHeight * 0.35})`;
      } else if (normHeight > 0.02) {
        fillColor = `rgba(6, 182, 212, 0.25)`;
      }

      ctx.beginPath();
      ctx.moveTo(q.p0.px, q.p0.py);
      ctx.lineTo(q.p1.px, q.p1.py);
      ctx.lineTo(q.p2.px, q.p2.py);
      ctx.lineTo(q.p3.px, q.p3.py);
      ctx.closePath();

      ctx.fillStyle = fillColor;
      ctx.fill();

      ctx.strokeStyle = normHeight > 0.4 ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });

    // 4. Render Billboards & Sector Tags around Perimeter
    SCENT_SECTORS.forEach(sec => {
      const rad = sec.angle * (Math.PI / 180);
      const isHover = this.hoverSector === sec.id;
      const count = this.sectorWeights[sec.id] || 0;
      
      const labelDist = 1.16;
      const pt = project(Math.sin(rad) * labelDist, -Math.cos(rad) * labelDist, 0);

      ctx.font = isHover ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.beginPath();
      ctx.arc(pt.px, pt.py - 12, isHover ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = sec.color;
      ctx.fill();
      if (isHover) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.fillStyle = isHover ? '#fff' : 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(sec.name.split(' ')[0], pt.px, pt.py + 2);

      if (count > 0) {
        ctx.fillStyle = isHover ? sec.color : 'rgba(255, 255, 255, 0.4)';
        ctx.font = '9px var(--font-mono, monospace)';
        ctx.fillText(`${count}`, pt.px, pt.py + 13);
      }
    });

    ctx.restore();
  }
}

// 2D Scent Atlas & Reference Map Modal
function openScentAtlasModal() {
  let atlasModal = document.getElementById('scent-atlas-modal');
  if (!atlasModal) {
    atlasModal = document.createElement('div');
    atlasModal.id = 'scent-atlas-modal';
    atlasModal.className = 'modal-overlay';
    document.body.appendChild(atlasModal);
  }

  const sectorsHtml = SCENT_SECTORS.map(sec => `
    <div class="atlas-sector-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-top: 3px solid ${sec.color}; border-radius: var(--radius-md, 8px); padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 1.2rem;">${sec.icon}</span>
          <strong style="color: #fff; font-size: 0.92rem;">${sec.name}</strong>
        </div>
        <span style="font-family: var(--font-mono, monospace); font-size: 0.72rem; color: ${sec.color}; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">${sec.angle}° Pole</span>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
        ${sec.subOdors.map(sub => `
          <span class="crossover-pill" onclick="filterOrganByOdor('${sub}')" style="font-size: 0.72rem; padding: 0.15rem 0.45rem;" title="Click to filter organ for '${sub}'">
            ${sub}
          </span>
        `).join('')}
      </div>
    </div>
  `).join('');

  atlasModal.innerHTML = `
    <div class="modal-card" style="max-width: 960px; max-height: 88vh;">
      <div class="modal-header">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <h2 style="font-size: 1.35rem; color: #fff; margin: 0;">🗺️ 2D Olfactory Ground Floor Scent Map</h2>
            <span class="facet-chip" style="color: var(--accent-gold); border-color: var(--accent-gold);">144 Odor Types • 12 Harmonic Sectors</span>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-secondary);">Continuous 360° coordinate reference mapping all material families, blender groups, and sensory facets.</span>
        </div>
        <button class="modal-close" onclick="closeScentAtlasModal()">&times;</button>
      </div>

      <div class="modal-body" style="padding: 1.25rem; overflow-y: auto;">
        <!-- Search bar inside atlas -->
        <div style="margin-bottom: 1.25rem;">
          <input type="text" id="atlas-search-input" placeholder="🔍 Search any odor quality (e.g., lime, mushroom, saffron, vetiver, tonka)..." 
                 style="width: 100%; padding: 0.65rem 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: #fff; font-size: 0.85rem;"
                 oninput="filterAtlasSectors(this.value)">
        </div>

        <div id="atlas-sectors-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.85rem;">
          ${sectorsHtml}
        </div>
      </div>
    </div>
  `;

  atlasModal.classList.add('active');
}

function closeScentAtlasModal() {
  const modal = document.getElementById('scent-atlas-modal');
  if (modal) modal.classList.remove('active');
}

function filterAtlasSectors(query) {
  const q = (query || '').toLowerCase().trim();
  const cards = document.querySelectorAll('.atlas-sector-card');
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
  });
}

function filterOrganByOdor(odor) {
  closeScentAtlasModal();
  const searchInput = document.getElementById('search-input');
  const matTab = document.querySelector('.tab-btn[data-tab="materials"]');
  if (matTab) matTab.click();
  if (searchInput) {
    searchInput.value = odor;
    searchInput.dispatchEvent(new Event('input'));
  }
}

window.ScentTopography3D = ScentTopography3D;
window.SCENT_SECTORS = SCENT_SECTORS;
window.openScentAtlasModal = openScentAtlasModal;
window.closeScentAtlasModal = closeScentAtlasModal;
window.filterAtlasSectors = filterAtlasSectors;
window.filterOrganByOdor = filterOrganByOdor;
