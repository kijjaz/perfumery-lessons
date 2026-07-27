/**
 * Google Apps Script to create or populate the 10-Facet Botanical & Lifecycle Map Slide Deck in Google Slides.
 * 
 * HOW TO USE THIS SCRIPT:
 * 
 * OPTION A (In an existing Google Slides file - RECOMMENDED):
 * 1. Open your Google Slides presentation (or create a blank presentation at slides.google.com).
 * 2. Click "Extensions" -> "Apps Script" in the top menu bar.
 * 3. Replace all code in the editor with this script and click "Save".
 * 4. Select the "build10FacetPresentation" function and click "Run".
 * 5. Grant permissions if prompted. Your open Google Slides deck will be populated immediately!
 * 
 * OPTION B (Standalone script at script.google.com):
 * 1. Go to https://script.google.com and click "New project".
 * 2. Paste this code and click "Run".
 * 3. Look at the "Execution log" at the bottom to find the link to your newly generated presentation!
 */

function build10FacetPresentation() {
  let presentation;
  
  try {
    presentation = SlidesApp.getActivePresentation();
  } catch (e) {
    presentation = null;
  }
  
  if (!presentation) {
    Logger.log("No active presentation bound to script. Creating a brand new Google Slides presentation file...");
    presentation = SlidesApp.create("Lesson 4.4: Deconstructing Fruit Architecture (The 10-Facet Map)");
  } else {
    Logger.log("Active presentation found! Title: " + presentation.getName());
  }

  const slides = presentation.getSlides();
  let titleSlide;
  if (slides.length > 0) {
    titleSlide = slides[0];
  } else {
    titleSlide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  }
  
  // Format Title Slide
  titleSlide.getBackground().setSolidFill("#070708");
  
  const titleBox = titleSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 50, 120, 620, 160);
  const titleText = titleBox.getText();
  titleText.setText("DECONSTRUCTING FRUIT ARCHITECTURE\nThe 10-Facet Botanical & Lifecycle Map");
  titleText.getTextStyle().setFontFamily("Outfit").setFontSize(26).setBold(true).setForegroundColor("#D4AF37");
  
  const subtitleBox = titleSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 50, 260, 620, 80);
  const subtitleText = subtitleBox.getText();
  subtitleText.setText("Perfumery Course • Lesson 4.4 • Structural Engineering Disguised as Art");
  subtitleText.getTextStyle().setFontFamily("Outfit").setFontSize(14).setForegroundColor("#A0A0A5");
  
  // 10 Facets Data
  const facets = [
    {
      num: 1,
      name: "Epicarp / Skin",
      origin: "Outer Exocarp & Flavedo Wax",
      sensory: "Crisp skin friction, waxy peel bite, crunchy top-note spark",
      actors: "Hexanal (C6 green top), (E)-2-Hexenal (apple skin), d-Limonene (citrus peel)",
      modifiers: "Triplal, Octanal | Fixatives: Cold-Pressed Citrus Oils, Linalyl Acetate",
      sensation: "The physical sensation of biting into a taut green apple peel or scratching an orange rind."
    },
    {
      num: 2,
      name: "Mesocarp / Pith",
      origin: "Inner Albedo & Cellulosic Parenchyma Walls",
      sensory: "Dry green brake, bitter pithy astringency, structural white albedo",
      actors: "Isobutyl Methoxypyrazine (IBMP 0.002 ppb), 1-Hexanol (cellulosic alcohol)",
      modifiers: "Stemone, Rhubofix | Fixatives: Veramoss (Evernyl), Guaiacol",
      sensation: "The astringent, dry inner pith of a grapefruit; prevents synthetic candy flatness."
    },
    {
      num: 3,
      name: "Fleshy Pulp",
      origin: "Core Parenchyma & Juice Sac Cells",
      sensory: "Dominant estery/sweet core identity, succulent mouth-watering flesh",
      actors: "Ethyl Butanoate (juicy top), Ethyl 2-MB (ripe pulp), γ-Decalactone (peach flesh), Frambinone",
      modifiers: "Allyl Caproate, Pear Ester, Methyl Benzoate | Fixatives: Hedione, Habanolide / Galaxolide",
      sensation: "Biting into the sweet, dripping heart of a ripe peach or passionfruit."
    },
    {
      num: 4,
      name: "Aqueous Vacuole",
      origin: "Cytoplasmic Water & Vacuole Cell Sap",
      sensory: "Dewy humidity, watery sillage, aquatic transparency",
      actors: "cis-3-Hexenol (fresh dew), Melonal (watery melon juice), Calone 1951 (marine humidity)",
      modifiers: "Floralozone, Acetaldehyde | Fixatives: Helional, Florhydral",
      sensation: "The humid, cool spray cloud that bursts into the air when slicing open a melon."
    },
    {
      num: 5,
      name: "Mucilage / Aril",
      origin: "Gelatinous Seed Casing & Tropical Aril Envelope",
      sensory: "Slippery lactonic texture, exotic sulfurous veil, creamy aril coating",
      actors: "3M3SBA (Mangosteen/Durian thiol), δ-Decalactone (creamy lactone membrane)",
      modifiers: "Veloutone, Sulfurol | Fixatives: Ethylene Brassylate, γ-Nonalactone (C18)",
      sensation: "The velvety, slippery coating around mangosteen seeds with trace sulfur exoticism."
    },
    {
      num: 6,
      name: "Latex / Sap",
      origin: "Pedicel Stem Bleed & Shrub Resin Ducts",
      sensory: "Rubbery green sap, fig leaf milk, bitter stem bleed resin",
      actors: "Stemone (fig milk / papaya sap oxime), Galbanum Oil / Undecavertol (rubbery sap)",
      modifiers: "Allyl Amyl Glycolate, cis-3-Hexenyl Salicylate | Fixatives: Vertofix Coeur, Iso E Super",
      sensation: "The milky, bitter, raw sap that bleeds when snapping a green fig stem."
    },
    {
      num: 7,
      name: "Endocarp / Seed",
      origin: "Lignified Seed Core, Pit Stone & Kernel Oil",
      sensory: "Cyanic bitter almond, woody nuttiness, roasted kernel warmth",
      actors: "Benzaldehyde (cyanic bitter almond/cherry pit), 2,3,5-TMP (roasted nutty pyrazine)",
      modifiers: "Eugenol, Cyclotene | Fixatives: Vanillin, Benzoin Resinoid",
      sensation: "The rich, cyanic, woody bitterness inside a cracked cherry pit or peach stone."
    },
    {
      num: 8,
      name: "Calyx / Stem",
      origin: "Leaf Sepals & Peduncle Crown Base",
      sensory: "Raw crushed leaf greenness, stem foliage, earthy crown base",
      actors: "cis-3-Hexenyl Acetate (sharp green banana leaf & stem), Liffarome (violet stem)",
      modifiers: "Triplal, 1-Octen-3-ol | Fixatives: Violet Leaf Absolute, Isobutyl Quinoline (IBQ)",
      sensation: "The crisp, raw green leaves sitting on top of a fresh strawberry."
    },
    {
      num: 9,
      name: "Fermentative State",
      origin: "Yeast Glycolysis & Overripe Lees Transformation",
      sensory: "Boozy alcoholic lift, rummy wine lees, overripe fruit cider warmth",
      actors: "Ethyl Acetate (boozy lift VP 9700 Pa), Ethyl Lactate (cider lees), 2-Phenylethyl Acetate",
      modifiers: "Isoamyl Acetate, Isovaleric Acid | Fixatives: Green Cognac Oil, PEA (Phenylethyl Alcohol)",
      sensation: "The intoxicating, rummy, warm alcoholic sparkle of fermenting plum lees."
    },
    {
      num: 10,
      name: "Desiccated State",
      origin: "Maillard Reaction & Dehydrated Fruit Paste",
      sensory: "Jammy cooked syrup, burnt caramel sugar, Hoshigaki dried persimmon",
      actors: "β-Damascenone (cooked apple driver 0.002 ppb), Furaneol (burnt sugar / strawberry)",
      modifiers: "Ethyl Maltol, Sotolon | Fixatives: Ethyl Vanillin, Coumarin",
      sensation: "Rich, dark, sticky preserve paste, sun-dried persimmons, and caramelized jam."
    }
  ];
  
  // Build Slide 2 to 11 for each Facet
  facets.forEach(f => {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill("#070708");
    
    // Header
    const headBox = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 30, 640, 60);
    const headText = headBox.getText();
    headText.setText(`FACET ${f.num}: ${f.name.toUpperCase()}`);
    headText.getTextStyle().setFontFamily("Outfit").setFontSize(22).setBold(true).setForegroundColor("#D4AF37");
    
    // Content Box
    const bodyBox = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 95, 640, 270);
    const bodyText = bodyBox.getText();
    bodyText.setText(
      `Anatomical Origin: ${f.origin}\n` +
      `Sensory Contribution: ${f.sensory}\n\n` +
      `Primary Actors: ${f.actors}\n` +
      `Modifiers & Fixatives: ${f.modifiers}\n\n` +
      `Olfactory Sensation: "${f.sensation}"`
    );
    bodyText.getTextStyle().setFontFamily("Outfit").setFontSize(13).setForegroundColor("#F3F3F5");
  });
  
  // Slide 12: Master 10x10 Fruit Archetype Matrix
  const archSlide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  archSlide.getBackground().setSolidFill("#070708");
  const aHead = archSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 30, 640, 60);
  aHead.getText().setText("MASTER 10x10 FRUIT ARCHETYPE MATRIX").getTextStyle().setFontFamily("Outfit").setFontSize(22).setBold(true).setForegroundColor("#D4AF37");
  const aBody = archSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 95, 640, 270);
  aBody.getText().setText(
    "100-Cell Botanical Facet Expression across 10 Fruit Archetypes:\n\n" +
    "• Stone Fruits: Dominant F3 (Pulp), F7 (Cyanic Seed), F10 (Desiccated Prune)\n" +
    "• Red Berries: Dominant F3 (Pulp), F8 (Calyx Crown), F10 (Jam Caramel)\n" +
    "• Tropical & Exotic: Dominant F3 (Pulp), F5 (Thiol Aril), F9 (Lees Ferment)\n" +
    "• Pome Fruits: Dominant F1 (Crunchy Peel), F3 (Williams Pear Flesh)\n" +
    "• The Fig Illusion: Dominant F6 (Bitter Milk Sap), F10 (Dried Fig Paste)\n" +
    "• Cassis & Dark Fruits: Dominant F3 (Tart Pulp), F5 (Thiol Envelope), F9 (Liqueur)\n" +
    "• Aqueous Fruits: Dominant F2 (White Pith Brake), F4 (Humid Vacuole Cloud)\n" +
    "• Grape & Wild Berry: Dominant F3 (Narcotic Pulp), F7 (Tannic Seed), F9 (Wine Lees)\n" +
    "• Savory & Vegetal: Dominant F2 (Pyrazine Pith), F6 (Leaf Sap), F8 (Vine Crown)\n" +
    "• Desiccated State: Master F10 (Maillard Caramel & Dried Persimmon Paste)"
  ).getTextStyle().setFontFamily("Outfit").setFontSize(12).setForegroundColor("#F3F3F5");

  // Slide 13: Parameter Matrix & Waterfall
  const matrixSlide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  matrixSlide.getBackground().setSolidFill("#070708");
  const mHead = matrixSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 30, 640, 60);
  mHead.getText().setText("PHYSICAL-CHEMICAL WATERFALL MODEL").getTextStyle().setFontFamily("Outfit").setFontSize(22).setBold(true).setForegroundColor("#D4AF37");
  const mBody = matrixSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 95, 640, 270);
  mBody.getText().setText(
    "Volatility Waterfall Partitioning on Skin:\n\n" +
    "1. Top Volatility (>100 Pa): Hexanal (1200 Pa), Ethyl Butanoate (1700 Pa), cis-3-Hexenol (200 Pa)\n" +
    "   → Immediate diffusive pop and fresh outer skin impression.\n\n" +
    "2. Heart Volatility (1 - 100 Pa): IBMP (12 Pa), Stemone (28 Pa), Benzaldehyde (127 Pa)\n" +
    "   → Pith brake and seed core structural transition.\n\n" +
    "3. Base Volatility (<1 Pa): γ-Decalactone (0.12 Pa), Calone 1951 (0.05 Pa), β-Damascenone (0.25 Pa)\n" +
    "   → High skin substantivity, velvety flesh, and humid drydown tenacity."
  ).getTextStyle().setFontFamily("Outfit").setFontSize(13).setForegroundColor("#F3F3F5");

  Logger.log("Done! Presentation URL: " + presentation.getUrl());
}
