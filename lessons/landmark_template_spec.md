# Landmark & GCMS Perfume Analysis Template Specification

**Document Identifier:** `PERFUMERY_LANDMARK_SPEC_v01`  
**Reference Implementation:** [`landmark_template.html`](file:///Users/kijjaz/Desktop/Antigravity/2026/20260102%20Building%20Perfumery%20Student%20Organ/20260520%20Perfumery%20Course/lessons/landmark_template.html)  
**Live Canonical Template:** [https://kijjaz.github.io/perfumery-lessons/lessons/landmark_template.html](https://kijjaz.github.io/perfumery-lessons/lessons/landmark_template.html)  
**Live Proof of Concept (Angel 1992):** [https://kijjaz.github.io/perfumery-lessons/lessons/landmark_angel_1992.html](https://kijjaz.github.io/perfumery-lessons/lessons/landmark_angel_1992.html)

---

## 1. Core Purpose & Legal / Epistemic Disclaimer

> [!IMPORTANT]
> ### Crucial Formulation Disclaimer: Approximations, Ranges & Qualitative Tiers
> **The dosages, percentages, and materials documented in this template are NOT the actual trade secret commercial formulas of the referenced brands or perfumers.**
>
> All formulas within this analytical framework represent:
> 1. **Approximations & Estimated Ranges**: Inferred via gas chromatography–mass spectrometry (GCMS) analytical literature, patent disclosures, and historical reconstruction efforts (e.g. `2.0% – 4.5%`, `20% – 30%`).
> 2. **Trace & Qualitative Annotations**: Micro-impact molecules where precise percentages vary across production batches or analytical instruments are explicitly declared as:
>    - `"Trace"` (sub-threshold or ppm quantities, e.g. pyrazines, Calone, damascenones)
>    - `"Estimated / Approximation"`
>    - `"Not sure / Disputed in literature"`
>    - `"< 0.1% (PPM level)"`
> 3. **Educational Archetype Deconstructions**: The primary objective is to teach **formulation architecture, volatile kinetics, and chemical function**, not to manufacture counterfeit copies.

---

## 2. Invariant Pedagogical Principles

Every document generated from this template must adhere strictly to the foundational philosophy of the Perfumery Course:

1. **The 4D Perfume Life Cycle (The 3 Temporal Evaluation Windows)**:
   - **Window 1: The Flash (0 to 15 Minutes)**: Volatile impact, opening shock, radiant citrus, light esters, and fleeting aldehydes.
   - **Window 2: The Bloom (30 Minutes to 2 Hours)**: Heart expansion at body temperature, florals, bridges, modifiers, avoiding mid-phase volume collapse.
   - **Window 3: The Drydown (4 Hours to 24+ Hours)**: Fixatives, heavy sesquiterpenes, resins, ambers, musks, and skin-scent tenacity.
2. **Architectural Accord Quad (Formulation by Function)**:
   - Every raw material in the matrix must be assigned an architectural role:
     - `role-heart` (**Protagonist / Core Theme**): The primary olfactory identity.
     - `role-modifier` (**Modifier / Accent**): Contouring, contrast, shading, or shock nuances.
     - `role-blender` (**Blender / Bridge**): Eliminates seams between tiers; provides transparent aeration/sillage (e.g. Hedione, Iso E Super).
     - `role-fixative` (**Fixative / Anchor**): Retards evaporation rate and binds formula to skin.
3. **Terminology Rule**:
   - **Never say "oriental"**; always use **"Amber"** (e.g. *Amber Gourmand, Amber Floral, Woody Amber*).

---

## 3. UI/UX Architecture & Layout Rules

To prevent horizontal scrolling and ensure seamless readability across desktops, laptops, and tablets:

- **Full-Width Canvas**: The outer container is bounded at `max-width: 1600px; width: 100%;` with generous horizontal breathing room.
- **Theme**: High-contrast, dark luxury palette (*Carbon & Gold / Studio Night*):
  - Canvas: `#09090d`
  - Cards: `rgba(18, 18, 24, 0.85)` with `1px solid rgba(255, 255, 255, 0.08)` and subtle backdrop blur.
  - Accents: Gold (`#d4af37`), Top Flash Cyan (`#38bdf8`), Heart Bloom Rose (`#f472b6`), Base Botanical (`#10b981`), Amber Caramel (`#f59e0b`).
- **Streamlined 6-Column Matrix**:
  - The commercial marketing note (e.g. *Note: Red Berries, Cotton Candy*) is nested directly under the chemical material title, saving 16% horizontal space and removing marketing redundancy from the olfactory science.
  - Column width budget:
    1. **Tier / Life Cycle**: `12%` (`min-width: 110px`)
    2. **Architectural Role**: `12%` (`min-width: 115px`)
    3. **Material & Commercial Note**: `26%` (`min-width: 200px`)
    4. **Olfactory Role & Sensory Impact**: `27%` (`min-width: 200px`)
    5. **Dosage / % (Approx / Range / Trace)**: `11%` (`min-width: 95px`)
    6. **Source / Evidence**: `12%` (`min-width: 110px`)

---

## 4. Section-by-Section Structure Specification

### Section 1: Header & Identity (`REQUIRED`)
- **Title**: `[HOUSE / BRAND]: [PERFUME_NAME] ([YEAR])`
- **Lead Text**: 1–2 technical sentences summarizing the milestone, chemical catalyst, and archetype.
- **Meta-Pills**:
  - Perfumer(s)
  - Olfactory Archetype & Genre
  - Signature Innovation or Primary Overdose

### Section 2: Summary Formulation Metrics (`OPTIONAL` & `EXPANDABLE`)
- Rendered as a dynamic CSS grid of cards.
- **Extensibility**: Supports **2 to 6 cards** (or can be completely omitted for brief single-accord studies).
- Standard presets include:
  - *Core Overdose / Tension #1*
  - *Anchoring Chassis / Spine #2*
  - *Diffusive Engine / Transparency*
  - *Natural vs Synthetic Estimated Ratio*

### Section 3: 4D Life Cycle — 3 Evaluation Windows (`RECOMMENDED`)
- Details the evaporation kinetics across time:
  - *Window 1: The Flash (0–15m)*
  - *Window 2: The Bloom (30m–2h)*
  - *Window 3: The Drydown (4h–24h+)*
- **Extensibility**: Exact timestamps can be adapted if studying an ultra-volatile Eau de Cologne (shorter drydown) or high-fixation Extrait de Parfum.

### Section 4: Architectural Anatomy & Thematic Accords (`OPTIONAL` & `EXPANDABLE`)
- Qualitative narrative breakdown of the fragrance's internal tensions.
- **Extensibility**: Expandable to $N$ narrative boxes (e.g. *The Innovation Accord, The Classic Chassis, The Sillage Bridge, Animalic Counterpoints, Cold Spice Engines*).

### Section 5: Raw Materials & Approximated Formula Matrix (`REQUIRED` & `EXPANDABLE`)
- The interactive analytical engine of the page.
- **Features**:
  - **Live Search**: Instant multi-attribute search across CAS, chemical names, notes, and roles.
  - **Dual Filtering**: Filter by Volatility (*All, Top, Middle, Base*) or by Architectural Function (*Protagonist, Modifier, Blender, Fixative*).
- **Extensibility**: Add as many `<tr>` rows as needed (from 10 materials for a minimalist accord up to 60+ components for complex historical GCMS deconstructions).
- **Dosage Flexibility**:
  - Standard ranges: `<span class="dosage-badge">2.0% - 4.5%</span>`
  - Trace components: `<span class="dosage-badge">Trace (~0.03%)</span>`
  - Qualitative or uncertain entries: `<span class="dosage-badge">Not sure (0.5% - 1%)</span>` or `<span class="dosage-badge">Trace / PPM</span>`

### Section 6: Compounding & Analytical Chemistry Insights (`RECOMMENDED` & `EXPANDABLE`)
- Technical notes for students compounding in the laboratory:
  - **Material Grade & Fractionation**: e.g. Molecular distillation (MD), iron-free patchouli, bergapten-free citrus, decolorized resins.
  - **GCMS Calibration vs Folklore**: Correcting inflated public formulas or marketing legends against verified chromatograms.
  - **Synesthetic Accords / Illusions**: Deconstructing emergent illusions (e.g. cocoa, peach skin, leather, ambergris) that have no single molecule.
  - **Chemical Aging & Kinetics (Optional)**: Schiff base formation, spontaneous esterification, color darkening.
- **Extensibility**: Add or remove `<p>` topic blocks as required.

### Section 7: Literature & Analytical Citations (`OPTIONAL` & `EXPANDABLE`)
- Numbered reference list anchor-linked to badges in the matrix (`#ref-1`, `#ref-2`, etc.).
- **Extensibility**:
  - Can range from 1 single internal GCMS report up to 30+ literature cross-references.
  - Can be omitted if the study is an unreferenced studio experiment.

---

## 5. Quick Reference: Checklist for New Studies

When creating a new landmark analysis (e.g. `landmark_shalimar_1925.html`, `landmark_ck_one_1994.html`):

1. [ ] Duplicate `landmark_template.html` to `landmark_[perfume]_[year].html`.
2. [ ] Verify that **"Amber"** is used wherever traditional perfumery references "oriental".
3. [ ] Verify that dosages are explicitly framed as **approximations, ranges, or trace quantities**.
4. [ ] Map each ingredient to its **4D Lifecycle Window** (`Top`, `Middle`, `Base`) and **Architectural Role** (`role-heart`, `role-modifier`, `role-blender`, `role-fixative`).
5. [ ] Ensure the file is saved under `20260520 Perfumery Course/lessons/`.
6. [ ] Deploy to GitHub Pages repository if online access is needed.
