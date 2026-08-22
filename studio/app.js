// Perfumery Student Organ & Accord Studio - Core Engine
// State Management
const state = {
  materials: [],
  materialsMap: new Map(),
  filteredMaterials: [],
  fragrances: [],
  fragrancesMap: new Map(),
  filteredFragrances: [],
  activeTab: 'organ',
  filters: {
    search: '',
    family: 'all',
    volatility: 'all',
    strength: 'all'
  },
  fragranceFilters: {
    search: '',
    family: 'all',
    type: 'all'
  },
  formula: [],
  faceoff: ['', '', ''],
  activeBridgeMat1: '',
  activeBridgeMat2: ''
};

// Olfactory Family Color Palette
const FAMILY_COLORS = {
  woody: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
  floral: { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
  citrus: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  balsamic: { bg: 'rgba(217, 119, 6, 0.15)', text: '#f59e0b', border: 'rgba(217, 119, 6, 0.3)' },
  green: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
  herbal: { bg: 'rgba(5, 150, 105, 0.15)', text: '#10b981', border: 'rgba(5, 150, 105, 0.3)' },
  fruity: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
  spicy: { bg: 'rgba(249, 115, 22, 0.15)', text: '#fb923c', border: 'rgba(249, 115, 22, 0.3)' },
  animal: { bg: 'rgba(147, 51, 234, 0.15)', text: '#c084fc', border: 'rgba(147, 51, 234, 0.3)' },
  aldehydic: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
  earthy: { bg: 'rgba(120, 113, 108, 0.15)', text: '#a8a29e', border: 'rgba(120, 113, 108, 0.3)' },
  sweet: { bg: 'rgba(244, 63, 94, 0.15)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.3)' },
  default: { bg: 'rgba(255, 255, 255, 0.08)', text: '#9ca3af', border: 'rgba(255, 255, 255, 0.12)' }
};

function getFamilyStyle(family) {
  const f = (family || '').toLowerCase();
  for (const [key, val] of Object.entries(FAMILY_COLORS)) {
    if (f.includes(key)) return val;
  }
  return FAMILY_COLORS.default;
}

// Data Fetching & Initialization
async function initApp() {
  const feedbackEl = document.getElementById('search-feedback');
  try {
    let data;
    if (window.TGSC_DATA && window.TGSC_DATA.materials && window.TGSC_DATA.materials.length > 0) {
      data = window.TGSC_DATA;
    } else {
      if (feedbackEl) feedbackEl.textContent = 'Loading 674 materials from Olfactory Database...';
      const res = await fetch('tgsc_student_payload.json?v=20260822_07');
      if (!res.ok) {
        const resFallback = await fetch('../data/processed/tgsc_student_payload.json');
        if (!resFallback.ok) throw new Error('Data payload not found');
        data = await resFallback.json();
      } else {
        data = await res.json();
      }
    }

    state.materials = data.materials || [];
    state.materials.forEach(m => state.materialsMap.set(m.id, m));
    state.filteredMaterials = [...state.materials];

    // Initialize empty formulation beaker
    state.formula = [];

    // Update Header Stats
    const matStatEl = document.getElementById('stat-materials-count');
    if (matStatEl) matStatEl.textContent = state.materials.length.toLocaleString();
    const blenderStatEl = document.getElementById('stat-blenders-count');
    if (blenderStatEl) blenderStatEl.textContent = ((data.meta && data.meta.total_blender_edges) || 0).toLocaleString();

    // Populate Family Filter & Dropdowns
    populateFamilyFilter();
    populateSelectDropdowns();

    // Render Views
    renderOrganGrid();
    renderFormulaTable();
    updateFormulaMetrics();
    renderFaceOff();

    if (feedbackEl) feedbackEl.textContent = `Displaying ${state.filteredMaterials.length} materials in Student Organ`;

    // Fetch Fragrance Accords & Specialty Bases
    try {
      if (window.TGSC_FRAGRANCES && window.TGSC_FRAGRANCES.length > 0) {
        state.fragrances = window.TGSC_FRAGRANCES;
      } else {
        const fragRes = await fetch('tgsc_fragrances.json?v=20260822_07');
        if (fragRes.ok) {
          state.fragrances = await fragRes.json();
        }
      }
      
      if (state.fragrances && state.fragrances.length > 0) {
        state.fragrances.forEach(f => state.fragrancesMap.set(f.id, f));
        state.filteredFragrances = [...state.fragrances];
        const fragStatEl = document.getElementById('stat-fragrances-count');
        if (fragStatEl) fragStatEl.textContent = state.fragrances.length.toLocaleString();
        populateFragranceFamilyFilter();
        renderFragranceGrid();
      }
    } catch (fragErr) {
      console.warn('Could not load fragrance accords:', fragErr);
    }

  } catch (err) {
    console.error('Init error:', err);
    if (feedbackEl) feedbackEl.innerHTML = `<span style="color: #ef4444;">Error loading olfactory database: ${err.message}.</span>`;
  }
}

// Populate Scent Family Dropdown
function populateFamilyFilter() {
  const families = new Set();
  state.materials.forEach(m => {
    if (m.family && m.family !== 'unclassified') families.add(m.family);
  });

  const select = document.getElementById('family-filter');
  if (!select) return;
  select.innerHTML = '<option value="all">All Scent Families</option>';
  [...families].sort().forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f.charAt(0).toUpperCase() + f.slice(1);
    select.appendChild(opt);
  });
}

function populateFragranceFamilyFilter() {
  const families = new Set();
  state.fragrances.forEach(f => {
    if (f.family && f.family !== 'unclassified') families.add(f.family);
  });

  const select = document.getElementById('fragrance-family-filter');
  if (!select) return;
  select.innerHTML = '<option value="all">All Scent Families</option>';
  [...families].sort().forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f.charAt(0).toUpperCase() + f.slice(1);
    select.appendChild(opt);
  });
}

// Populate Dropdowns in Chord, Faceoff & Sandbox
function populateSelectDropdowns() {
  const sorted = [...state.materials].sort((a, b) => a.name.localeCompare(b.name));
  
  const selectIds = [
    'bridge-mat-1',
    'bridge-mat-2',
    'bridge-mat-3',
    'bridge-mat-4',
    'faceoff-select-1',
    'faceoff-select-2',
    'faceoff-select-3',
    'sandbox-add-select'
  ];

  selectIds.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const defaultText = sel.options && sel.options.length > 0 ? sel.options[0].textContent : 'Select Material...';
    sel.innerHTML = `<option value="">${defaultText}</option>`;
    sorted.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.name} (${m.family || 'misc'} • ${m.tier})`;
      sel.appendChild(opt);
    });
  });

  // Set defaults
  const m1 = sorted[0]?.id || '';
  const m2 = sorted[1]?.id || '';
  const m3 = sorted[2]?.id || '';
  const m4 = sorted[3]?.id || '';

  const b1 = document.getElementById('bridge-mat-1');
  const b2 = document.getElementById('bridge-mat-2');
  const b3 = document.getElementById('bridge-mat-3');
  const b4 = document.getElementById('bridge-mat-4');
  const f1 = document.getElementById('faceoff-select-1');
  const f2 = document.getElementById('faceoff-select-2');
  const f3 = document.getElementById('faceoff-select-3');

  if (b1 && !b1.value) b1.value = m1;
  if (b2 && !b2.value) b2.value = m2;
  if (b3 && !b3.value) b3.value = m3;
  if (b4 && !b4.value) b4.value = m4;
  if (f1 && !f1.value) f1.value = m1;
  if (f2 && !f2.value) f2.value = m2;
  if (f3 && !f3.value) f3.value = m3;

  state.faceoff = [m1, m2, m3];
  state.activeBridgeMat1 = m1;
  state.activeBridgeMat2 = m2;
}

// Filtering & Searching Logic
function filterMaterials() {
  const q = state.filters.search.toLowerCase().trim();
  const fam = state.filters.family;
  const vol = state.filters.volatility;
  const str = state.filters.strength;

  state.filteredMaterials = state.materials.filter(m => {
    // Search match
    if (q) {
      const nameMatch = (m.name || '').toLowerCase().includes(q);
      const casMatch = (m.cas || '').includes(q);
      const femaMatch = (m.fema || '').includes(q);
      const famMatch = (m.family || '').toLowerCase().includes(q);
      const facetMatch = (m.facets || []).some(f => f.toLowerCase().includes(q));
      const descMatch = (m.desc || []).some(d => d.toLowerCase().includes(q));
      if (!nameMatch && !casMatch && !femaMatch && !famMatch && !facetMatch && !descMatch) return false;
    }

    // Family match
    if (fam !== 'all' && (m.family || '').toLowerCase() !== fam.toLowerCase()) {
      return false;
    }

    // Volatility tier match
    if (vol !== 'all' && m.tier !== vol) {
      return false;
    }

    // Strength match
    if (str !== 'all') {
      const s = (m.strength || '').toLowerCase();
      if (str === 'high' && !s.includes('high') && !s.includes('powerful') && !s.includes('strong')) return false;
      if (str === 'medium' && !s.includes('medium')) return false;
      if (str === 'low' && !s.includes('low') && !s.includes('weak') && !s.includes('mild')) return false;
    }

    return true;
  });

  const feedbackEl = document.getElementById('search-feedback');
  feedbackEl.textContent = `Showing ${state.filteredMaterials.length} of ${state.materials.length} materials`;

  renderOrganGrid();
}

// Render Organ Cards Grid
function renderOrganGrid() {
  const container = document.getElementById('organ-grid');
  container.innerHTML = '';

  const displayLimit = 60; // Smooth DOM rendering
  const items = state.filteredMaterials.slice(0, displayLimit);

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 3rem; text-align: center; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No matching materials found</p>
        <span style="font-size: 0.85rem;">Try adjusting your search keywords or resetting note tier filters.</span>
      </div>
    `;
    return;
  }

  items.forEach(m => {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.setAttribute('data-id', m.id);

    const famStyle = getFamilyStyle(m.family);
    const tierClass = m.tier === 'Top Note' ? 'tier-top' : m.tier === 'Heart Note' ? 'tier-heart' : 'tier-base';

    const descPreview = m.desc && m.desc.length > 0 ? m.desc[0] : `${m.name} is a key ${m.family || 'aromatic'} building block exhibiting classic ${m.tier || 'substantive'} characteristics.`;
    const facetsHtml = (m.facets || []).slice(0, 5).map(f => `<span class="facet-chip">${f}</span>`).join('');
    
    const badgeCode = m.sku || (m.id.startsWith('rw') || m.id.startsWith('es') || m.id.startsWith('pb') || m.id.startsWith('fr')
      ? m.id.toUpperCase()
      : (m.id.split('_').pop() || m.id).toUpperCase());

    card.innerHTML = `
      <div class="card-top">
        <div style="min-width: 0; flex: 1;">
          <h3 class="mat-title">${m.name}</h3>
          <div class="mat-cas">${m.cas ? `CAS: ${m.cas}` : `SKU: ${badgeCode}`}</div>
        </div>
        <span class="mat-id-badge" title="${m.id}">${badgeCode}</span>
      </div>

      <div class="badge-row">
        <span class="tag-family" style="background: ${famStyle.bg}; color: ${famStyle.text}; border: 1px solid ${famStyle.border}">
          ${m.family || 'unclassified'}
        </span>
        <span class="tag-tier ${tierClass}">
          ${m.tier === 'Top Note' ? '⚡' : m.tier === 'Heart Note' ? '⏳' : '⚓'} ${m.tier}
        </span>
      </div>

      <div class="mat-desc-preview">
        ${descPreview}
      </div>

      <div class="facets-list">
        ${facetsHtml}
      </div>

      <div class="card-footer">
        <span class="blender-stat">
          <span>🔗</span> ${m.blenders_count} Blenders
        </span>
        <div class="card-actions">
          <button class="btn-icon btn-inspect" data-id="${m.id}" title="Deep Inspection">🔍 Details</button>
          <button class="btn-icon btn-chord" data-id="${m.id}" title="Explore Blenders">🔀 Blends</button>
          <button class="btn-icon btn-add-sandbox" data-id="${m.id}" title="Add to Sandbox">🧪 +Beaker</button>
        </div>
      </div>
    `;

    // Click handler for card
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-chord')) {
        openChordExplorer(m.id);
      } else if (e.target.closest('.btn-add-sandbox')) {
        addToSandbox(m.id);
      } else {
        openMaterialModal(m.id);
      }
    });

    container.appendChild(card);
  });

  if (state.filteredMaterials.length > displayLimit) {
    const moreNotice = document.createElement('div');
    moreNotice.style.gridColumn = '1 / -1';
    moreNotice.style.textAlign = 'center';
    moreNotice.style.padding = '1.5rem';
    moreNotice.style.color = 'var(--text-muted)';
    moreNotice.innerHTML = `Showing first ${displayLimit} materials. Use search bar to filter directly.`;
    container.appendChild(moreNotice);
  }
}

// Deep Inspection Modal
function openMaterialModal(matId) {
  const m = state.materialsMap.get(matId);
  if (!m) return;

  const modal = document.getElementById('material-modal');
  document.getElementById('modal-mat-name').textContent = m.name;
  document.getElementById('modal-mat-id').textContent = m.id.toUpperCase();
  document.getElementById('modal-mat-cas').textContent = `CAS: ${m.cas || 'N/A'} • FEMA: ${m.fema || 'N/A'}`;

  const famStyle = getFamilyStyle(m.family);
  const tierClass = m.tier === 'Top Note' ? 'tier-top' : m.tier === 'Heart Note' ? 'tier-heart' : 'tier-base';

  const body = document.getElementById('modal-body-content');
  body.innerHTML = `
    <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
      <span class="tag-family" style="background: ${famStyle.bg}; color: ${famStyle.text}; border: 1px solid ${famStyle.border}; font-size: 0.8rem; padding: 0.3rem 0.8rem;">
        ${m.family || 'unclassified'}
      </span>
      <span class="tag-tier ${tierClass}" style="font-size: 0.8rem; padding: 0.3rem 0.8rem;">
        ${m.tier} (${m.hours ? `${m.hours} hrs on blotter` : (m.tenacity_raw || 'N/A')})
      </span>
      <span class="tag-family" style="background: rgba(255,255,255,0.05); color: #fff; font-size: 0.8rem; padding: 0.3rem 0.8rem;">
        Strength: ${m.strength || 'Medium'}
      </span>
    </div>

    <!-- Physical Properties Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
      <div><span style="font-size: 0.7rem; color: var(--text-muted);">VAPOR PRESSURE</span><div style="font-family: var(--font-mono); font-size: 0.85rem; color: #fff;">${m.vp || 'N/A'}</div></div>
      <div><span style="font-size: 0.7rem; color: var(--text-muted);">FLASH POINT</span><div style="font-family: var(--font-mono); font-size: 0.85rem; color: #fff;">${m.fp || 'N/A'}</div></div>
      <div><span style="font-size: 0.7rem; color: var(--text-muted);">BOILING POINT</span><div style="font-family: var(--font-mono); font-size: 0.85rem; color: #fff;">${m.bp || 'N/A'}</div></div>
      <div><span style="font-size: 0.7rem; color: var(--text-muted);">LOGP (O/W)</span><div style="font-family: var(--font-mono); font-size: 0.85rem; color: #fff;">${m.logp || 'N/A'}</div></div>
    </div>

    <!-- Organoleptic Descriptions -->
    <div>
      <h4 style="font-size: 0.95rem; color: #fff; margin-bottom: 0.5rem;">Organoleptic Descriptions & Quotes</h4>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${(m.desc || []).map(d => `
          <div style="background: rgba(255,255,255,0.02); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-gold); font-size: 0.85rem; line-height: 1.4;">
            ${d}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Scent Facets Tags -->
    <div>
      <h4 style="font-size: 0.95rem; color: #fff; margin-bottom: 0.5rem;">Scent Facets & Descriptors</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
        ${(m.facets || []).map(f => `<span class="facet-chip" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">${f}</span>`).join('')}
      </div>
    </div>

    <!-- Actions -->
    <div style="display: flex; gap: 0.75rem; margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
      <button class="btn-primary" onclick="openChordExplorer('${m.id}'); closeMaterialModal();">🔀 Explore Blenders & Chords</button>
      <button class="btn-icon" onclick="addToSandbox('${m.id}'); closeMaterialModal();" style="padding: 0.65rem 1rem;">🧪 Add to Formulation Beaker</button>
    </div>
  `;

  modal.classList.add('active');
}

function closeMaterialModal() {
  document.getElementById('material-modal').classList.remove('active');
}

// Chord & Bridge Recommender View
function openChordExplorer(matId) {
  switchTab('chords');
  const m = state.materialsMap.get(matId);
  if (!m) return;

  document.getElementById('bridge-mat-1').value = matId;
  document.getElementById('chord-mat-title').textContent = `${m.name} — Recommended Blenders`;
  document.getElementById('chord-mat-sub').textContent = `Olfactory database records ${m.blenders_count} mutual blending partners for ${m.name} across odor families.`;

  const results = document.getElementById('chord-results-container');
  results.innerHTML = '';

  const groups = m.blenders_by_group || {};
  const groupKeys = Object.keys(groups);

  if (groupKeys.length === 0) {
    results.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-muted); background: rgba(0,0,0,0.2); border-radius: var(--radius-md);">
        No specific blender grouping recorded for this entry in library.
      </div>
    `;
    return;
  }

  groupKeys.forEach(grp => {
    const list = groups[grp];
    const famStyle = getFamilyStyle(grp);

    const grpCard = document.createElement('div');
    grpCard.style.background = 'rgba(0,0,0,0.25)';
    grpCard.style.border = '1px solid var(--border-color)';
    grpCard.style.borderRadius = 'var(--radius-md)';
    grpCard.style.padding = '1.25rem';

    const itemsHtml = list.map(item => {
      const subCode = item.id.startsWith('rw') || item.id.startsWith('es') || item.id.startsWith('pb') || item.id.startsWith('fr')
        ? item.id.toUpperCase()
        : (item.id.split('_').pop() || item.id).toUpperCase();

      return `
        <div class="blender-mini-card">
          <div class="blender-mini-info">
            <span class="blender-name" title="${item.name}">${item.name}</span>
            <span class="blender-code">${subCode}</span>
          </div>
          <div class="blender-mini-actions">
            <span class="app-badge">${item.app || 'FR'}</span>
            <button class="btn-inspect-mini" onclick="openMaterialModal('${item.id}')">Inspect</button>
          </div>
        </div>
      `;
    }).join('');

    grpCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
        <h4 style="color: ${famStyle.text}; font-size: 0.95rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
          ${grp} Synergies (${list.length})
        </h4>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem;">
        ${itemsHtml}
      </div>
    `;

    results.appendChild(grpCard);
  });
}

// Chord Mode State
state.chordMode = '2';

function setChordMode(mode) {
  state.chordMode = mode;
  document.querySelectorAll('.chord-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  const slot3 = document.getElementById('slot-mat-3-container');
  const slot4 = document.getElementById('slot-mat-4-container');

  if (slot3) slot3.style.display = (mode === '3' || mode === '4') ? 'block' : 'none';
  if (slot4) slot4.style.display = (mode === '4') ? 'block' : 'none';
}

// 2-Hop Graph Walk for Polar Opposite Notes
function find2HopTransitionPath(m1, m2) {
  const blenders1 = new Map();
  Object.values(m1.blenders_by_group || {}).flat().forEach(b => blenders1.set(b.id, b));

  const blenders2 = new Set();
  Object.values(m2.blenders_by_group || {}).flat().forEach(b => blenders2.add(b.id));

  const pathways = [];

  // Iterate over step 1 candidates
  for (const [idX, itemX] of blenders1.entries()) {
    const matX = state.materialsMap.get(idX);
    if (!matX || !matX.blenders_by_group) continue;

    const blendersX = Object.values(matX.blenders_by_group).flat();
    for (const itemY of blendersX) {
      if (blenders2.has(itemY.id) && itemY.id !== m1.id && itemY.id !== idX) {
        const matY = state.materialsMap.get(itemY.id);
        pathways.push({
          step1: { id: idX, name: itemX.name, mat: matX },
          step2: { id: itemY.id, name: itemY.name, mat: matY }
        });
        if (pathways.length >= 6) break;
      }
    }
    if (pathways.length >= 6) break;
  }

  return pathways;
}

// Universal Harmonic Chord & Bridge Solver
function solveHarmonicChord() {
  const mode = state.chordMode || '2';
  const id1 = document.getElementById('bridge-mat-1')?.value;
  const id2 = document.getElementById('bridge-mat-2')?.value;
  const id3 = document.getElementById('bridge-mat-3')?.value;
  const id4 = document.getElementById('bridge-mat-4')?.value;

  if (!id1 || !id2) {
    alert('Please select Note 1 and Note 2.');
    return;
  }

  const m1 = state.materialsMap.get(id1);
  const m2 = state.materialsMap.get(id2);
  const m3 = (mode === '3' || mode === '4') && id3 ? state.materialsMap.get(id3) : null;
  const m4 = (mode === '4') && id4 ? state.materialsMap.get(id4) : null;

  if (mode === '3' && !m3) {
    alert('Please select Note 3 for the Triad Chord.');
    return;
  }
  if (mode === '4' && (!m3 || !m4)) {
    alert('Please select all 4 notes for the Tetrad Accord.');
    return;
  }

  const results = document.getElementById('chord-results-container');
  results.innerHTML = '';

  const selectedMats = [m1, m2, m3, m4].filter(Boolean);
  const names = selectedMats.map(m => m.name).join(' ⟷ ');

  // -------------------------------------------------------------
  // MODE 2: 2-Note Pair Bridge & 2-Hop Graph Walk
  // -------------------------------------------------------------
  if (mode === '2') {
    document.getElementById('chord-mat-title').textContent = `2-Note Bridge: ${m1.name} ⟷ ${m2.name}`;
    document.getElementById('chord-mat-sub').textContent = `Solving intermediate harmonic bridge molecules between ${m1.name} (${m1.family}) and ${m2.name} (${m2.family}).`;

    const blenders1 = new Map();
    Object.values(m1.blenders_by_group || {}).flat().forEach(b => blenders1.set(b.id, b));

    const blenders2 = new Map();
    Object.values(m2.blenders_by_group || {}).flat().forEach(b => blenders2.set(b.id, b));

    const mutualBridges = [];
    blenders1.forEach((val, key) => {
      if (blenders2.has(key)) {
        mutualBridges.push({ id: key, name: val.name, mat: state.materialsMap.get(key) });
      }
    });

    if (mutualBridges.length > 0) {
      // Direct 1-hop bridges found!
      const bridgeCardsHtml = mutualBridges.map(b => {
        const fam = b.mat ? b.mat.family : 'misc';
        const tier = b.mat ? b.mat.tier : 'Heart Note';
        const famStyle = getFamilyStyle(fam);
        const subCode = (b.id.split('_').pop() || b.id).toUpperCase();

        return `
          <div style="background: rgba(0,0,0,0.4); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.6rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
              <h4 style="color: #fff; font-size: 0.95rem; font-weight: 600;" title="${b.name}">${b.name}</h4>
              <span class="mat-id-badge">${subCode}</span>
            </div>
            <div style="display: flex; gap: 0.4rem;">
              <span class="tag-family" style="background: ${famStyle.bg}; color: ${famStyle.text}; font-size: 0.7rem;">${fam}</span>
              <span class="tag-tier tier-heart" style="font-size: 0.7rem;">${tier}</span>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem;">
              <button class="btn-icon" onclick="openMaterialModal('${b.id}')" style="flex: 1;">🔍 Details</button>
              <button class="btn-icon" onclick="loadChordToSandbox(['${m1.id}', '${m2.id}', '${b.id}'])" style="flex: 1.5; color: var(--accent-blue); font-weight: 600;">🧪 Load 3-Chord</button>
            </div>
          </div>
        `;
      }).join('');

      results.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: var(--radius-lg); padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <h3 style="color: #fff; font-size: 1.15rem; margin-bottom: 0.25rem;">🌟 Found ${mutualBridges.length} Direct Harmonic Bridge Materials</h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary);">These materials directly blend with both <strong>${m1.name}</strong> and <strong>${m2.name}</strong>.</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
            ${bridgeCardsHtml}
          </div>
        </div>
      `;
    } else {
      // 0 Direct bridges: Run 2-Hop Graph Walk!
      const pathways = find2HopTransitionPath(m1, m2);
      
      let ladderHtml = '';
      if (pathways.length > 0) {
        ladderHtml = pathways.map((p, idx) => {
          const s1Fam = p.step1.mat ? p.step1.mat.family : 'aromatic';
          const s2Fam = p.step2.mat ? p.step2.mat.family : 'aromatic';

          return `
            <div class="ladder-chain">
              <div class="ladder-step terminal">
                <span style="font-size: 0.68rem; color: var(--accent-blue); font-weight: 700; text-transform: uppercase;">Origin</span>
                <span style="color: #fff; font-weight: 600; font-size: 0.85rem;">${m1.name}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${m1.family}</span>
              </div>
              <div class="ladder-arrow">➔</div>
              <div class="ladder-step">
                <span style="font-size: 0.68rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase;">Step 1 Bridge</span>
                <span style="color: #fff; font-weight: 600; font-size: 0.85rem;">${p.step1.name}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${s1Fam}</span>
              </div>
              <div class="ladder-arrow">➔</div>
              <div class="ladder-step">
                <span style="font-size: 0.68rem; color: var(--accent-purple); font-weight: 700; text-transform: uppercase;">Step 2 Bridge</span>
                <span style="color: #fff; font-weight: 600; font-size: 0.85rem;">${p.step2.name}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${s2Fam}</span>
              </div>
              <div class="ladder-arrow">➔</div>
              <div class="ladder-step terminal">
                <span style="font-size: 0.68rem; color: var(--accent-rose); font-weight: 700; text-transform: uppercase;">Destination</span>
                <span style="color: #fff; font-weight: 600; font-size: 0.85rem;">${m2.name}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${m2.family}</span>
              </div>
              <button class="btn-icon" onclick="loadChordToSandbox(['${m1.id}', '${p.step1.id}', '${p.step2.id}', '${m2.id}'])" style="margin-left: auto; color: var(--accent-gold); font-weight: 600; padding: 0.6rem 0.9rem;">
                🧪 Load 4-Step Ladder
              </button>
            </div>
          `;
        }).join('');
      }

      results.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-lg); padding: 1.5rem;">
          <h3 style="color: #fff; font-size: 1.15rem; margin-bottom: 0.4rem;">🔀 2-Step Transition Pathways (Polar Contrast Walk)</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
            <strong>${m1.name}</strong> and <strong>${m2.name}</strong> are distinct olfactory polarities with zero direct 1-hop blenders. The knowledge graph resolved <strong>${pathways.length} multi-step transition ladders</strong> to smoothly bridge them:
          </p>
          <div class="transition-ladder">
            ${ladderHtml || '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">No harmonic pathway found between these two extreme notes.</div>'}
          </div>
        </div>
      `;
    }
  }

  // -------------------------------------------------------------
  // MODE 3: 3-Note Triad Chord Solver (Harmonic Center)
  // -------------------------------------------------------------
  else if (mode === '3') {
    document.getElementById('chord-mat-title').textContent = `3-Note Triad Chord: ${m1.name} + ${m2.name} + ${m3.name}`;
    document.getElementById('chord-mat-sub').textContent = `Calculating universal harmonic center materials that bind all 3 notes simultaneously.`;

    const b1 = new Set(Object.values(m1.blenders_by_group || {}).flat().map(b => b.id));
    const b2 = new Set(Object.values(m2.blenders_by_group || {}).flat().map(b => b.id));
    const b3 = new Set(Object.values(m3.blenders_by_group || {}).flat().map(b => b.id));

    // 3-way intersection
    const centerBridges = [];
    b1.forEach(id => {
      if (b2.has(id) && b3.has(id)) {
        centerBridges.push({ id, mat: state.materialsMap.get(id) });
      }
    });

    const centerCardsHtml = centerBridges.map(c => {
      const name = c.mat ? c.mat.name : c.id;
      const fam = c.mat ? c.mat.family : 'universal';
      const tier = c.mat ? c.mat.tier : 'Heart Note';
      const famStyle = getFamilyStyle(fam);

      return `
        <div style="background: rgba(0,0,0,0.4); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.6rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h4 style="color: #fff; font-size: 0.95rem; font-weight: 600;">${name}</h4>
            <span class="badge-frag-type badge-base" style="font-size: 0.65rem;">TRIAD CENTER</span>
          </div>
          <div style="display: flex; gap: 0.4rem;">
            <span class="tag-family" style="background: ${famStyle.bg}; color: ${famStyle.text}; font-size: 0.7rem;">${fam}</span>
            <span class="tag-tier tier-heart" style="font-size: 0.7rem;">${tier}</span>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem;">
            <button class="btn-icon" onclick="openMaterialModal('${c.id}')" style="flex: 1;">🔍 Details</button>
            <button class="btn-icon" onclick="loadChordToSandbox(['${m1.id}', '${m2.id}', '${m3.id}', '${c.id}'])" style="flex: 1.5; color: var(--accent-purple); font-weight: 600;">🧪 Load 4-Triad Chord</button>
          </div>
        </div>
      `;
    }).join('');

    results.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: var(--radius-lg); padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h3 style="color: #fff; font-size: 1.15rem; margin-bottom: 0.25rem;">🔺 Triad Harmonic Centers (${centerBridges.length} Found)</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">Molecules that share synergistic blending bonds with <strong>${m1.name}</strong>, <strong>${m2.name}</strong>, AND <strong>${m3.name}</strong>.</p>
          </div>
          <button class="btn btn-primary" onclick="loadChordToSandbox(['${m1.id}', '${m2.id}', '${m3.id}'])" style="font-size: 0.82rem;">
            🧪 Load Base Triad (3 Notes)
          </button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${centerCardsHtml || '<div style="color: var(--text-muted); padding: 2rem; grid-column: 1/-1; text-align: center;">No single molecule links all 3 notes simultaneously. The 3 base notes themselves form the triad accord.</div>'}
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // MODE 4: 4-Note Tetrad Archetype Solver
  // -------------------------------------------------------------
  else if (mode === '4') {
    document.getElementById('chord-mat-title').textContent = `4-Note Tetrad: ${m1.name} + ${m2.name} + ${m3.name} + ${m4.name}`;
    document.getElementById('chord-mat-sub').textContent = `Evaluating 4-pillar full structural skeleton and mutual cross-affinities.`;

    results.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(56, 189, 248, 0.12) 100%); border: 1px solid rgba(236, 72, 153, 0.35); border-radius: var(--radius-lg); padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h3 style="color: #fff; font-size: 1.2rem; margin-bottom: 0.25rem;">👑 Complete 4-Pillar Tetrad Architecture</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">Classical perfumery skeleton balancing top radiance, floral/green heart, resinous warmth, and woody fixation.</p>
          </div>
          <button class="btn btn-primary" onclick="loadChordToSandbox(['${m1.id}', '${m2.id}', '${m3.id}', '${m4.id}'])" style="font-size: 0.85rem;">
            🧪 Load Complete 4-Pillar Formula
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
          ${selectedMats.map((m, idx) => {
            const role = idx === 0 ? 'Pillar 1: Radiance / Top' : idx === 1 ? 'Pillar 2: Heart / Modifier' : idx === 2 ? 'Pillar 3: Fixation / Body' : 'Pillar 4: Depth / Base';
            const famStyle = getFamilyStyle(m.family);
            return `
              <div style="background: rgba(0,0,0,0.4); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <span style="font-size: 0.7rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase;">${role}</span>
                <h4 style="color: #fff; font-size: 1rem; margin: 0.4rem 0 0.2rem 0;">${m.name}</h4>
                <div style="display: flex; gap: 0.4rem; margin-top: 0.4rem;">
                  <span class="tag-family" style="background: ${famStyle.bg}; color: ${famStyle.text}; font-size: 0.7rem;">${m.family}</span>
                  <span class="tag-tier tier-heart" style="font-size: 0.7rem;">${m.tier}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

// One-Click Helper to Load Chord into Sandbox
function loadChordToSandbox(matIds) {
  state.formula = [];
  const count = matIds.length;
  const equalPpt = Math.floor(1000 / count);

  matIds.forEach((id, idx) => {
    const mat = state.materialsMap.get(id);
    if (mat) {
      // Give realistic tier ratios if possible
      let ppt = equalPpt;
      if (count === 3) {
        ppt = idx === 0 ? 200 : idx === 1 ? 350 : 450;
      } else if (count === 4) {
        ppt = idx === 0 ? 150 : idx === 1 ? 250 : idx === 2 ? 300 : 300;
      }
      state.formula.push({ id, ppt });
    }
  });

  renderFormulaTable();
  updateFormulaMetrics();
  switchTab('sandbox');
}

// Side-by-Side Faceoff Renderer
function renderFaceOff() {
  const container = document.getElementById('faceoff-matrix-container');
  const ids = [
    document.getElementById('faceoff-select-1').value,
    document.getElementById('faceoff-select-2').value,
    document.getElementById('faceoff-select-3').value
  ].filter(Boolean);

  if (ids.length < 2) {
    container.innerHTML = `
      <div style="padding: 3rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        Please select at least 2 materials above to compare side-by-side.
      </div>
    `;
    return;
  }

  const mats = ids.map(id => state.materialsMap.get(id)).filter(Boolean);

  const colsHtml = mats.map(m => {
    const famStyle = getFamilyStyle(m.family);
    const tierClass = m.tier === 'Top Note' ? 'tier-top' : m.tier === 'Heart Note' ? 'tier-heart' : 'tier-base';
    return `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
        <div>
          <span class="mat-id-badge">${m.id.toUpperCase()}</span>
          <h3 style="font-size: 1.2rem; color: #fff; margin-top: 0.3rem;">${m.name}</h3>
          <span style="font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-mono);">CAS: ${m.cas || 'N/A'}</span>
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="tag-family" style="background: ${famStyle.bg}; color: ${famStyle.text}; border: 1px solid ${famStyle.border}">${m.family || 'unclassified'}</span>
          <span class="tag-tier ${tierClass}">${m.tier}</span>
        </div>

        <!-- Tenacity & Substantivity Bar -->
        <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: var(--radius-md);">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.3rem;">
            <span>Substantivity / Tenacity</span>
            <span style="color: #fff; font-family: var(--font-mono); font-weight: 700;">${m.hours ? `${m.hours}h` : 'N/A'}</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: var(--radius-full); overflow: hidden;">
            <div style="height: 100%; width: ${Math.min(100, ((m.hours || 12) / 400) * 100)}%; background: ${m.tier === 'Top Note' ? '#38bdf8' : m.tier === 'Heart Note' ? '#f59e0b' : '#a855f7'};"></div>
          </div>
        </div>

        <!-- Physical Constants Table -->
        <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="color: var(--text-muted); padding: 0.4rem 0;">Vapor Press.</td><td style="color: #fff; font-family: var(--font-mono); text-align: right;">${m.vp || 'N/A'}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="color: var(--text-muted); padding: 0.4rem 0;">Flash Point</td><td style="color: #fff; font-family: var(--font-mono); text-align: right;">${m.fp || 'N/A'}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="color: var(--text-muted); padding: 0.4rem 0;">Boiling Point</td><td style="color: #fff; font-family: var(--font-mono); text-align: right;">${m.bp || 'N/A'}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="color: var(--text-muted); padding: 0.4rem 0;">LogP</td><td style="color: #fff; font-family: var(--font-mono); text-align: right;">${m.logp || 'N/A'}</td></tr>
          <tr><td style="color: var(--text-muted); padding: 0.4rem 0;">Blenders</td><td style="color: var(--accent-blue); font-family: var(--font-mono); text-align: right; font-weight: 700;">${m.blenders_count} pairs</td></tr>
        </table>

        <!-- Primary Scent Descriptors -->
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Facets & Nuances</span>
          <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.4rem;">
            ${(m.facets || []).map(f => `<span class="facet-chip">${f}</span>`).join('')}
          </div>
        </div>

        <div style="margin-top: auto; display: flex; gap: 0.5rem;">
          <button class="btn-primary" onclick="openChordExplorer('${m.id}')" style="flex: 1; font-size: 0.8rem; padding: 0.5rem;">🔀 Blenders</button>
          <button class="btn-icon" onclick="addToSandbox('${m.id}')" style="padding: 0.5rem 0.8rem;">+ Beaker</button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(${mats.length}, 1fr); gap: 1.5rem;">
      ${colsHtml}
    </div>
  `;
}

// Formulation Sandbox Engine
function addToSandbox(matId, ppt = 100) {
  const existing = state.formula.find(item => item.id === matId);
  if (existing) {
    existing.ppt += ppt;
  } else {
    state.formula.push({ id: matId, ppt: ppt });
  }
  renderFormulaTable();
  updateFormulaMetrics();
  switchTab('sandbox');
}

function removeFromFormula(index) {
  state.formula.splice(index, 1);
  renderFormulaTable();
  updateFormulaMetrics();
}

function updateFormulaPpt(index, newPpt) {
  state.formula[index].ppt = Math.max(1, parseInt(newPpt) || 1);
  renderFormulaTable();
  updateFormulaMetrics();
}

function renderFormulaTable() {
  const tbody = document.getElementById('formula-tbody');
  tbody.innerHTML = '';

  const totalPpt = state.formula.reduce((sum, item) => sum + item.ppt, 0);

  if (state.formula.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-muted);">
          Your formulation beaker is empty. Add materials above to analyze note pyramid and chord synergies.
        </td>
      </tr>
    `;
    return;
  }

  state.formula.forEach((item, idx) => {
    const m = state.materialsMap.get(item.id);
    if (!m) return;

    const pct = totalPpt > 0 ? ((item.ppt / totalPpt) * 100).toFixed(1) : 0;
    const famStyle = getFamilyStyle(m.family);
    const tierClass = m.tier === 'Top Note' ? 'tier-top' : m.tier === 'Heart Note' ? 'tier-heart' : 'tier-base';

    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-color)';
    tr.innerHTML = `
      <td style="padding: 0.75rem 0.6rem; font-weight: 600; color: #fff;">
        ${m.name}
        <div style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">${m.id.toUpperCase()}</div>
      </td>
      <td style="padding: 0.6rem;">
        <span class="tag-family" style="background: ${famStyle.bg}; color: ${famStyle.text}; font-size: 0.7rem;">${m.family || 'unclassified'}</span>
      </td>
      <td style="padding: 0.6rem;">
        <span class="tag-tier ${tierClass}" style="font-size: 0.7rem;">${m.tier}</span>
      </td>
      <td style="padding: 0.6rem;">
        <input type="number" value="${item.ppt}" min="1" max="1000" onchange="updateFormulaPpt(${idx}, this.value)" style="width: 80px; padding: 0.35rem 0.5rem; background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); color: #fff; border-radius: var(--radius-sm); font-family: var(--font-mono); outline: none;">
      </td>
      <td style="padding: 0.6rem; font-family: var(--font-mono); color: var(--accent-gold); font-weight: 600;">
        ${pct}%
      </td>
      <td style="padding: 0.6rem; text-align: right;">
        <button class="btn-icon" onclick="removeFromFormula(${idx})" style="color: var(--accent-rose);">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateFormulaMetrics() {
  const totalPpt = state.formula.reduce((sum, item) => sum + item.ppt, 0);
  const totalPptEl = document.getElementById('formula-total-ppt');
  if (totalPptEl) totalPptEl.textContent = `${totalPpt} ppt`;

  let topPpt = 0;
  let heartPpt = 0;
  let basePpt = 0;

  state.formula.forEach(item => {
    const m = state.materialsMap.get(item.id);
    if (!m) return;
    if (m.tier === 'Top Note') topPpt += item.ppt;
    else if (m.tier === 'Heart Note') heartPpt += item.ppt;
    else basePpt += item.ppt;
  });

  const topPct = totalPpt > 0 ? (topPpt / totalPpt) * 100 : 0;
  const heartPct = totalPpt > 0 ? (heartPpt / totalPpt) * 100 : 0;
  const basePct = totalPpt > 0 ? (basePpt / totalPpt) * 100 : 0;

  const topPctEl = document.getElementById('pyramid-top-pct');
  if (topPctEl) topPctEl.textContent = `${topPct.toFixed(1)}%`;
  const heartPctEl = document.getElementById('pyramid-heart-pct');
  if (heartPctEl) heartPctEl.textContent = `${heartPct.toFixed(1)}%`;
  const basePctEl = document.getElementById('pyramid-base-pct');
  if (basePctEl) basePctEl.textContent = `${basePct.toFixed(1)}%`;

  const barTop = document.getElementById('bar-top');
  if (barTop) {
    barTop.style.width = `${topPct}%`;
    barTop.textContent = `${Math.round(topPct)}%`;
  }

  const barHeart = document.getElementById('bar-heart');
  if (barHeart) {
    barHeart.style.width = `${heartPct}%`;
    barHeart.textContent = `${Math.round(heartPct)}%`;
  }

  const barBase = document.getElementById('bar-base');
  if (barBase) {
    barBase.style.width = `${basePct}%`;
    barBase.textContent = `${Math.round(basePct)}%`;
  }

  // Calculate pairwise synergies
  let synergyPairs = 0;
  for (let i = 0; i < state.formula.length; i++) {
    for (let j = i + 1; j < state.formula.length; j++) {
      const m1 = state.materialsMap.get(state.formula[i].id);
      const m2 = state.materialsMap.get(state.formula[j].id);
      if (m1 && m2) {
        const blenders1 = Object.values(m1.blenders_by_group || {}).flat();
        if (blenders1.some(b => b.id === m2.id)) synergyPairs++;
      }
    }
  }
  const synergyCountEl = document.getElementById('formula-synergy-count');
  if (synergyCountEl) synergyCountEl.textContent = `${synergyPairs} verified pairs`;
}

// Tab Switching
function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabId);
  });
  document.querySelectorAll('.view-panel').forEach(p => {
    p.classList.toggle('active', p.id === `view-${tabId}`);
  });

  if (tabId === 'faceoff') {
    renderFaceOff();
  }
}

// Event Listeners Setup
function startApp() {
  initApp();

  // Tab Navigation
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Global Search
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      filterMaterials();
    });
  }

  // Volatility filter buttons
  document.querySelectorAll('.vol-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.vol-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filters.volatility = btn.dataset.vol;
      filterMaterials();
    });
  });

  // Scent Family filter
  const famFilter = document.getElementById('family-filter');
  if (famFilter) {
    famFilter.addEventListener('change', (e) => {
      state.filters.family = e.target.value;
      filterMaterials();
    });
  }

  // Strength filter
  const strFilter = document.getElementById('strength-filter');
  if (strFilter) {
    strFilter.addEventListener('change', (e) => {
      state.filters.strength = e.target.value;
      filterMaterials();
    });
  }

  // Modal Close
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeMaterialModal);
  const matModal = document.getElementById('material-modal');
  if (matModal) {
    matModal.addEventListener('click', (e) => {
      if (e.target.id === 'material-modal') closeMaterialModal();
    });
  }

  // Chord Mode switcher buttons
  document.querySelectorAll('.chord-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setChordMode(btn.dataset.mode));
  });

  // Solve Harmonic Chord & Bridges button
  const bridgeBtn = document.getElementById('btn-find-bridge');
  if (bridgeBtn) {
    bridgeBtn.addEventListener('click', solveHarmonicChord);
  }

  // Preset Accords buttons
  document.querySelectorAll('.accord-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode || '2';
      setChordMode(mode);
      const m1 = btn.dataset.m1;
      const m2 = btn.dataset.m2;
      const m3 = btn.dataset.m3;
      const m4 = btn.dataset.m4;

      if (m1) document.getElementById('bridge-mat-1').value = m1;
      if (m2) document.getElementById('bridge-mat-2').value = m2;
      if (m3 && document.getElementById('bridge-mat-3')) document.getElementById('bridge-mat-3').value = m3;
      if (m4 && document.getElementById('bridge-mat-4')) document.getElementById('bridge-mat-4').value = m4;

      solveHarmonicChord();
    });
  });

  // Faceoff dropdowns
  ['faceoff-select-1', 'faceoff-select-2', 'faceoff-select-3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderFaceOff);
  });

  // Sandbox Add
  const addBtn = document.getElementById('btn-add-to-formula');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const sel = document.getElementById('sandbox-add-select');
      const ppt = parseInt(document.getElementById('sandbox-add-ppt').value) || 100;
      if (sel.value) {
        addToSandbox(sel.value, ppt);
        sel.value = '';
      }
    });
  }

  // Fragrance Search
  const fragSearch = document.getElementById('fragrance-search');
  if (fragSearch) {
    fragSearch.addEventListener('input', (e) => {
      state.fragranceFilters.search = e.target.value;
      filterFragrances();
    });
  }

  // Fragrance Type filter buttons
  document.querySelectorAll('.frag-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.frag-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.fragranceFilters.type = btn.dataset.type;
      filterFragrances();
    });
  });

  // Fragrance Family filter
  const fragFamFilter = document.getElementById('fragrance-family-filter');
  if (fragFamFilter) {
    fragFamFilter.addEventListener('change', (e) => {
      state.fragranceFilters.family = e.target.value;
      filterFragrances();
    });
  }
}

// Fragrance Filtering & Grid Rendering
function filterFragrances() {
  const { search, family, type } = state.fragranceFilters;
  const q = search.trim().toLowerCase();

  state.filteredFragrances = state.fragrances.filter(f => {
    if (family !== 'all' && f.family !== family) return false;
    if (type !== 'all' && f.type !== type) return false;
    if (q) {
      const matchName = (f.name || '').toLowerCase().includes(q);
      const matchFam = (f.family || '').toLowerCase().includes(q);
      const matchDesc = (f.desc || []).some(d => d.toLowerCase().includes(q));
      const matchFacets = (f.facets || []).some(fac => fac.toLowerCase().includes(q));
      const matchIng = (f.ingredients || []).some(i => i.name.toLowerCase().includes(q));
      if (!matchName && !matchFam && !matchDesc && !matchFacets && !matchIng) return false;
    }
    return true;
  });

  const fb = document.getElementById('fragrance-feedback');
  if (fb) fb.textContent = `Displaying ${state.filteredFragrances.length} of ${state.fragrances.length} fragrance accords & bases`;
  renderFragranceGrid();
}

function renderFragranceGrid() {
  const grid = document.getElementById('fragrance-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (state.filteredFragrances.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No fragrance accords match your search criteria.</p>
        <p style="font-size: 0.85rem;">Try adjusting your scent family, type filter, or search keywords.</p>
      </div>
    `;
    return;
  }

  state.filteredFragrances.forEach(f => {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.setAttribute('data-id', f.id);

    const famStyle = getFamilyStyle(f.family);
    const typeClass = f.type === 'fragrance' ? 'badge-fragrance' : f.type === 'base' ? 'badge-base' : 'badge-flavor';
    const typeLabel = f.type === 'fragrance' ? '🌸 Fragrance Accord' : f.type === 'base' ? '🏺 Perfume Base' : '🍬 Flavor Theme';

    const descPreview = f.desc && f.desc.length > 0 ? f.desc[0] : `${f.name} curated fragrance composition.`;
    const facetsHtml = (f.facets || []).slice(0, 5).map(fac => `<span class="facet-chip">${fac}</span>`).join('');
    const supplierText = (f.suppliers && f.suppliers.length > 0) ? f.suppliers.join(', ') : 'TGSC Evaluator Classic';

    card.innerHTML = `
      <div class="card-top">
        <div style="min-width: 0; flex: 1;">
          <h3 class="mat-title">${f.name}</h3>
          <div class="mat-cas" style="color: var(--accent-gold);">${supplierText}</div>
        </div>
        <span class="badge-frag-type ${typeClass}">${typeLabel}</span>
      </div>

      <div class="badge-row">
        <span class="tag-family" style="background: ${famStyle.bg}; color: ${famStyle.text}; border: 1px solid ${famStyle.border}">
          ${f.family || 'unclassified'}
        </span>
        <span class="facet-chip" style="color: var(--accent-blue);">
          🔗 ${f.ingredients_count} Ingredients
        </span>
      </div>

      <div class="mat-desc-preview" style="border-left-color: var(--accent-rose);">
        ${descPreview}
      </div>

      <div class="facets-list">
        ${facetsHtml}
      </div>

      <div class="card-footer">
        <span class="blender-stat" style="color: var(--accent-rose);">
          <span>🏷️</span> ${f.category || 'Fine Fragrance'}
        </span>
        <div class="card-actions">
          <button class="btn-icon btn-inspect-frag" data-id="${f.id}" title="Deconstruct Accord">🔍 Deconstruct</button>
          <button class="btn-icon btn-load-beaker-frag" data-id="${f.id}" title="Load into Beaker" style="color: var(--accent-gold);">🧪 +Beaker</button>
        </div>
      </div>
    `;

    // Click handler for inspect
    card.querySelector('.btn-inspect-frag').addEventListener('click', (e) => {
      e.stopPropagation();
      openFragranceModal(f.id);
    });

    // Click handler for +Beaker
    card.querySelector('.btn-load-beaker-frag').addEventListener('click', (e) => {
      e.stopPropagation();
      loadAccordToSandbox(f.id);
    });

    card.addEventListener('click', () => openFragranceModal(f.id));
    grid.appendChild(card);
  });
}

// Open Fragrance Accord Deconstruction Modal
function openFragranceModal(id) {
  const f = state.fragrancesMap.get(id);
  if (!f) return;

  const modal = document.getElementById('material-modal');
  const nameEl = document.getElementById('modal-mat-name');
  const idEl = document.getElementById('modal-mat-id');
  const casEl = document.getElementById('modal-mat-cas');
  const body = document.getElementById('modal-body-content');

  if (nameEl) nameEl.textContent = `🌸 ${f.name}`;
  if (idEl) idEl.textContent = f.id.toUpperCase();
  if (casEl) casEl.textContent = `${f.category || 'Fine Fragrance Accord'} • ${f.suppliers && f.suppliers.length > 0 ? f.suppliers.join(', ') : 'TGSC Evaluator Composition'}`;

  const famStyle = getFamilyStyle(f.family);
  const typeClass = f.type === 'fragrance' ? 'badge-fragrance' : f.type === 'base' ? 'badge-base' : 'badge-flavor';
  const typeLabel = f.type === 'fragrance' ? 'Fragrance Accord' : f.type === 'base' ? 'Specialty Perfume Base' : 'Flavor Theme';

  // Smart matching and classification for constituent ingredients
  const norm = str => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const ingredientsHtml = (f.ingredients || []).map(ing => {
    const ingNorm = norm(ing.name);
    const matchMat = state.materials.find(m => {
      const mNorm = norm(m.name);
      return mNorm === ingNorm || mNorm.includes(ingNorm) || ingNorm.includes(mNorm) || (m.official_name && norm(m.official_name) === ingNorm);
    });

    const isOwned = Boolean(matchMat);

    // Natural vs Base vs Molecule Detection
    const isNatural = ing.id.startsWith('es') || ing.id.startsWith('ex') ||
      /\b(oil|extract|absolute|resinoid|balsam|co2|butter|tincture|wood|peel|leaf|flower|root|seed|gum)\b/i.test(ing.name) ||
      (matchMat && /\b(oil|extract|absolute|resinoid|balsam|co2|natural|essential)\b/i.test(matchMat.name));

    const isBase = ing.id.startsWith('pb') || /\b(base|specialty|replacer|accord|blend|complex)\b/i.test(ing.name);

    let typeBadge = '';
    if (isNatural) {
      typeBadge = `<span style="font-size: 0.68rem; color: #34d399; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 500;">🌿 Natural Extract</span>`;
    } else if (isBase) {
      typeBadge = `<span style="font-size: 0.68rem; color: #c084fc; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.25); padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 500;">🏺 Specialty Base</span>`;
    } else {
      typeBadge = `<span style="font-size: 0.68rem; color: #38bdf8; background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.25); padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 500;">🔬 Aroma Molecule</span>`;
    }

    const organBadge = isOwned
      ? `<span style="font-size: 0.68rem; color: #10b981; background: rgba(16,185,129,0.2); border: 1px solid rgba(16,185,129,0.4); padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 600;">In Your Organ ✅</span>`
      : '';

    return `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
        <td style="padding: 0.65rem 0.8rem; color: #fff; font-weight: 500;">
          ${ing.name}
        </td>
        <td style="padding: 0.65rem 0.8rem; white-space: nowrap;">
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            ${typeBadge}
            ${organBadge}
          </div>
        </td>
        <td style="padding: 0.65rem 0.8rem; text-align: right;">
          ${isOwned ? `<button class="btn-icon" onclick="addToSandbox('${matchMat.id}', 50)" style="font-size: 0.72rem; color: var(--accent-blue);">+ Beaker</button>` : ''}
        </td>
      </tr>
    `;
  }).join('');

  // Demo Recipe if available
  let recipeHtml = '';
  if (f.recipe && f.recipe.length > 0) {
    const totalParts = f.recipe.reduce((s, r) => s + r.parts, 0);
    const recipeRows = f.recipe.map(r => `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
        <td style="padding: 0.6rem; color: #fff;">${r.name}</td>
        <td style="padding: 0.6rem; text-align: right; font-family: var(--font-mono); color: var(--accent-gold); font-weight: 600;">
          ${r.parts.toFixed(2)} PPT
        </td>
        <td style="padding: 0.6rem; text-align: right; color: var(--text-secondary); font-size: 0.75rem;">
          ${((r.parts / totalParts) * 100).toFixed(1)}%
        </td>
      </tr>
    `).join('');

    recipeHtml = `
      <div class="modal-section" style="margin-top: 1.5rem;">
        <h4 class="modal-sec-title">📜 Verified Demonstration Formula Recipe</h4>
        <div style="background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border: 1px solid var(--border-color); overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
            <thead>
              <tr style="background: rgba(255,255,255,0.04); border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.75rem;">
                <th style="padding: 0.5rem 0.6rem; text-align: left;">Ingredient</th>
                <th style="padding: 0.5rem 0.6rem; text-align: right;">Parts</th>
                <th style="padding: 0.5rem 0.6rem; text-align: right;">Ratio</th>
              </tr>
            </thead>
            <tbody>
              ${recipeRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  body.innerHTML = `
    <!-- Top Identity Card -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1.25rem;">
      <div>
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
          <span class="badge-frag-type ${typeClass}">${typeLabel}</span>
          <span class="tag-family" style="background: ${famStyle.bg}; color: ${famStyle.text}; border: 1px solid ${famStyle.border}">
            ${f.family || 'unclassified'}
          </span>
          <span class="facet-chip">${f.category || 'Fine Fragrance'}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">
          ${(f.suppliers && f.suppliers.length > 0) ? `Formulated by <strong>${f.suppliers.join(', ')}</strong>` : 'Compiled from Perfumery Formula Archives'}
        </p>
      </div>

      <button class="btn btn-primary" onclick="loadAccordToSandbox('${f.id}')" style="display: flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1rem; font-size: 0.82rem;">
        <span>🧪</span> Load Accord into Beaker
      </button>
    </div>

    <!-- Evaluator Descriptions -->
    <div class="modal-section">
      <h4 class="modal-sec-title">📝 Olfactory Character & Evaluator Notes</h4>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${(f.desc || []).map(d => `<div style="background: rgba(0,0,0,0.25); padding: 0.75rem 0.9rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent-rose); font-size: 0.85rem; color: #e5e7eb; line-height: 1.5;">${d}</div>`).join('')}
      </div>
    </div>

    ${recipeHtml}

    <!-- Constituent Building Blocks -->
    <div class="modal-section" style="margin-top: 1.5rem;">
      <h4 class="modal-sec-title">🌿 Constituent Naturals, Aroma Molecules & Bases (${f.ingredients_count} total)</h4>
      <div style="background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border: 1px solid var(--border-color); max-height: 280px; overflow-y: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
          <tbody>
            ${ingredientsHtml || '<tr><td style="padding: 1rem; color: var(--text-muted);">No direct chemical breakdown listed.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// Transfer Accord Ingredients to Sandbox Beaker
function loadAccordToSandbox(id) {
  const f = state.fragrancesMap.get(id);
  if (!f) return;

  state.formula = []; // Always clear old formula first

  let addedCount = 0;

  // 1. If formula has exact recipe with parts
  if (f.recipe && f.recipe.length > 0) {
    f.recipe.forEach(r => {
      let matchMat = state.materials.find(m => m.name.toLowerCase() === r.name.toLowerCase() || m.name.toLowerCase().includes(r.name.toLowerCase()) || r.name.toLowerCase().includes(m.name.toLowerCase()));
      const matId = matchMat ? matchMat.id : ('rec_' + r.name.toLowerCase().replace(/[^a-z0-9]/g, '_'));
      if (!matchMat) {
        state.materialsMap.set(matId, {
          id: matId,
          name: r.name,
          family: 'aromatic',
          tier: r.parts > 200 ? 'Heart Note' : 'Top Note',
          desc: ['Formula constituent ingredient'],
          blenders_by_group: {},
          blenders_count: 0
        });
      }
      state.formula.push({ id: matId, ppt: Math.max(5, Math.round(r.parts)) });
      addedCount++;
    });
  } else if (f.ingredients && f.ingredients.length > 0) {
    // 2. If ingredient list
    const partsPerItem = Math.max(25, Math.floor(1000 / f.ingredients.length));
    f.ingredients.forEach(ing => {
      let matchMat = state.materials.find(m => m.name.toLowerCase() === ing.name.toLowerCase() || m.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(m.name.toLowerCase()));
      const matId = matchMat ? matchMat.id : ('ing_' + ing.name.toLowerCase().replace(/[^a-z0-9]/g, '_'));
      if (!matchMat) {
        state.materialsMap.set(matId, {
          id: matId,
          name: ing.name,
          family: 'aromatic',
          tier: 'Heart Note',
          desc: ['Formula constituent ingredient'],
          blenders_by_group: {},
          blenders_count: 0
        });
      }
      state.formula.push({ id: matId, ppt: partsPerItem });
      addedCount++;
    });
  }

  renderFormulaTable();
  