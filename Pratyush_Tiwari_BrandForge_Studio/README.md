# BrandForge Studio

### Semantic SVG Logo and Brand Identity Generator

A complete Computer Graphics semester project built with React, Vite, TypeScript, Tailwind CSS, and original procedural SVG artwork. BrandForge turns a brand brief into six meaningful vector logo concepts, offers a layer-based editor, and packages the chosen identity into a complete brand kit.

**No backend. No API key. No paid image generation.** All logo generation, editing, and image export happen in the browser. After dependency installation, the local application runs without internet access; it does not fetch external fonts or artwork. The app is not a PWA and does not promise offline reload of the hosted website.

## Quick start

Use Node.js 22 LTS or newer, with npm installed. Open a terminal in this folder:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To build and inspect the production version:

```sh
npm run build
npm run preview
```

The production output is `dist/`. It must be served over HTTP; do not double-click `dist/index.html` because browser restrictions affect ES modules. For a reproducible installation using the included lockfile, use `npm ci`.

## Features

- Premium responsive landing page with animated, genuinely generated logo previews.
- Five-step wizard: brand information, up to three personality traits, ten styles, color preferences, and eight font directions.
- Three ready-to-edit demo briefs: Vadapav, NovaTech, and Finora.
- Fifteen industry options and exactly six original SVG concepts per generation.
- Semantic category preview before generation and a Semantic Connection explanation on every concept.
- Dedicated food vocabularies for Vadapav/street food, cafés and beverages, pizza kitchens, and bakeries.
- Direct canvas manipulation: drag to translate, resize handle, rotation handle, and zoom.
- Numeric position, width, height, scale, rotation, opacity, color, stroke, radius, and font controls.
- Add text, eight shape types, and symbols from the original SVG icon library.
- Layer ordering, hide/show, lock/unlock, duplicate, and delete.
- Undo/redo with up to 80 snapshots and gesture coalescing, so a drag is one undo step.
- Download SVG, 1800 × 1200 PNG, JPEG, and transparent PNG.
- Nine logo variants, color specifications in HEX/RGB, typography previews, usage guidance, and brand personality summary.
- ZIP brand-kit export with nine SVG variants, primary and transparent PNG, palette JSON, editable project JSON, and text guidelines.
- Seven CSS/SVG mockups: business card, app icon, website header, social profile, packaging, letterhead, and T-shirt.
- My Brands dashboard with localStorage save, edit, brand-kit access, SVG download, and confirmed deletion.
- About CG page with an interactive transformation lab and the complete architecture pipeline.

## Demo brands

| Brand    | Industry   | Personality                        | Style       | Color         | Font       |
| -------- | ---------- | ---------------------------------- | ----------- | ------------- | ---------- |
| Vadapav  | Food       | Playful, Bold, Friendly            | Icon + Text | Orange        | Rounded    |
| NovaTech | Technology | Modern, Futuristic, Professional   | Geometric   | Purple / Blue | Futuristic |
| Finora   | Finance    | Professional, Minimal, Trustworthy | Emblem      | Blue          | Corporate  |

Click **Try Demo**, choose **Vadapav**, inspect the Food detection, and continue through the wizard. See [VIVA.md](VIVA.md) for a full presentation script.

## Semantic generation logic

The engine is deterministic and explainable. It is a rule-based graphics system, not a trained generative AI model.

1. **Normalize input.** Split camel case, normalize Unicode, lowercase text, and tokenize words.
2. **Score categories.** A keyword contributes 10 points when it matches the name, 3 in the tagline, and 2 in the description. The selected industry adds 5 points. Every matched keyword contributes separately.
3. **Avoid short substring collisions.** Short tokens such as `ai` require a complete token; longer terms can match inside compound names. `Vadapav` has a dedicated `pav` rule.
4. **Select a symbol vocabulary.** The highest category score wins. Food includes more specific café, pizza, and bakery branches. If no category scores, use an explicitly explained geometric fallback.
5. **Apply design rules.** Style influences layout order, icon size, gradients, ornament, and rotation. Personality adjusts typography weight/spacing and selected palette rules. Color and font preferences directly shape the result.
6. **Compose exactly six concepts.** Six different symbols and six layouts combine icon, name, optional tagline, and optional supporting geometry. Wordmark and Lettermark preferences still retain a related graphical symbol.
7. **Serialize the editable layer model.** Each concept includes `id`, `name`, `category`, `semanticConnection`, `palette`, `typography`, `svgElements`, `svg`, `layout`, and `background`.

For **Vadapav**, the six symbols are:

1. Bun, vada patty, and chutney wave.
2. Striped street-food cart carrying a bun.
3. Takeaway packet with a pav symbol.
4. Pav inside a round street-food seal.
5. Spice flame above a serving plate.
6. Bun framed by a fork and spoon.

The matcher does not understand every possible name, language, or metaphor. Ambiguous input can be refined through the description and industry field. The app explains geometric fallbacks instead of inventing a literal meaning.

## Computer Graphics concepts

| Concept              | Implementation                                                                  |
| -------------------- | ------------------------------------------------------------------------------- |
| Vector graphics      | SVG artboards in a 600 × 400 logical coordinate system                          |
| Geometric primitives | `circle`, `ellipse`, `rect`, `polygon`, `line`, `path`, and `text`              |
| Paths and curves     | Original Bézier paths for buns, leaves, hearts, clouds, and other symbols       |
| Translation          | Element X/Y positions and pointer drag mapped through the inverse screen CTM    |
| Rotation             | Group rotation around the element center; Shift snaps to 15° increments         |
| Scaling              | Independent scale X/Y and width/height controls; proportional resize with Shift |
| Composition          | Grouped SVG layers and document-order painting                                  |
| Opacity / alpha      | 0–100% editor control serialized to SVG opacity 0–1                             |
| Gradients            | Linear symbol/text gradients and radial shape gradients                         |
| Filters              | Optional `feDropShadow`                                                         |
| Typography           | System font stacks, weight, size, tracking, and fitting long names              |
| Color theory         | Coordinated palettes, HEX/RGB conversion, luminance and contrast calculation    |
| Rasterization        | SVG → browser Image → Canvas → PNG/JPEG Blob                                    |
| Multimedia           | The same vector identity composed into seven 2D application previews            |

The transformation lab demonstrates `p′ = T · R · S · p` with column vectors. The editor adds a pivot translation around the layer center for rotation. Pointer coordinates use the SVG screen transformation matrix, so dragging works while the responsive artboard is scaled.

## Project structure

```text
src/
  assets/                   Original artwork policy and extension notes
  components/
    Navbar.tsx              Shared navigation
    LogoCard.tsx             Semantic concept cards
    LogoPreview.tsx          SVG image previews
    PaletteStrip.tsx         Palette swatches
    ExportButtons.tsx        SVG/PNG/JPEG exports
    StudioContext.tsx        Working brief, selected logo, feedback, save flow
    DemoModal.tsx            Accessible native-dialog demo chooser
    BrandMockups.tsx         Seven 2D mockups
  pages/
    Home.tsx
    Create.tsx
    Generate.tsx
    Editor.tsx
    BrandKit.tsx
    Dashboard.tsx
    AboutCG.tsx
  generator/
    semanticAnalyzer.ts
    logoGenerator.ts
    iconLibrary.ts
    paletteEngine.ts
    typographyEngine.ts
    brandKitGenerator.ts
    generator.test.ts
  editor/
    editorTypes.ts
    editorUtils.ts
    useEditorState.ts
    editor.test.ts
  utils/
    exportUtils.ts
    storage.ts
    colorUtils.ts
    export.test.ts
    storage.test.ts
  types/
    brand.ts
    logo.ts
  data/presets.ts
  App.tsx
  main.tsx
  styles.css                Shared theme, landing, wizard, gallery, responsiveness
  studio.css                Editor, brand kit, mockups, dashboard, academic page
public/favicon.svg
```

Hash-based routing lets all routes work on a static host without server rewrites. No application server, authentication service, or database is required.

## Editor and storage behavior

Select a layer from the canvas or Layers list. Drag the artwork to move it, the bottom-right square to resize it, and the top dot to rotate it. Properties also expose exact numeric values. Unlock locked layers before editing them. Hidden layers remain in the saved document and are serialized with `display="none"`.

| Shortcut                             | Action                                |
| ------------------------------------ | ------------------------------------- |
| Ctrl/Cmd + Z                         | Undo                                  |
| Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y | Redo                                  |
| Ctrl/Cmd + S                         | Save project to My Brands             |
| Arrow keys                           | Move selected unlocked layer by 1 px  |
| Shift + arrows                       | Move selected unlocked layer by 10 px |
| Delete / Backspace                   | Delete selected unlocked layer        |

Typing fields keep normal keyboard behavior. Zoom affects the workspace view; exports keep their defined size. A sessionStorage draft survives refresh within the current tab. Explicitly saved projects use the versioned localStorage key `brandforge.projects.v1`. Saves update the current project instead of creating duplicates. Storage failures show a message and leave downloads available.

Projects stay in the same browser/profile/origin. They do not sync to another device or between localhost and a hosted site. Clearing browser data removes them. Download the ZIP for a portable copy. The included editable project JSON is a data backup; the current UI does not import it.

## Export details

- **SVG:** live, scalable elements and text; edited position, order, color, and transforms are preserved.
- **PNG:** 1800 × 1200 pixels (3× artboard); background retained unless transparent export is chosen.
- **JPEG:** 1800 × 1200; flattened onto white because JPEG does not support alpha.
- **Brand kit ZIP:** nine SVG variants, two PNGs, palette JSON, project JSON, and guidelines.
- **Mockups:** illustrative in-app previews, not print-production files or photo-realistic 3D renders.

The primary logo preserves all custom layers. Secondary, horizontal, vertical, and icon-only variants rearrange the designated symbol/name/tagline layers; custom decorative layers stay in the primary. Black, white, monochrome, and transparent versions preserve the complete composition. If all artwork is hidden or moved beyond the artboard, exports will reflect that state.

System fonts avoid network dependencies. SVG text remains live and can vary on devices that lack the selected font. PNG/JPEG capture the current browser’s rendering. Long names fit within the text layer width; enlarge the layer if the letters appear compressed.

## Testing

```sh
npm test
npm run build
```

Vitest covers semantic categories, dedicated food symbols, false substring matches, fallback explanations, all industry and style combinations, XML-valid SVG output, text escaping, typography options, color contrast, all nine brand variants, undo/redo, layer reordering, browser-storage round trips, quota failures, and raster-export resource cleanup. The raster pipeline tests use a controlled Image/Canvas test double; they do not replace a real-browser raster or interaction check.

Manual presentation checks: generate each demo; edit text and colors; drag, resize, rotate, and change opacity; reorder/lock/hide layers; undo and redo; save and refresh; inspect the dashboard; download SVG/PNG/JPEG; unzip the brand kit; check all seven mockups; try a narrow viewport and keyboard navigation.

## Deploy on Vercel

1. Push this folder’s source to your Git repository, excluding `node_modules` and `dist`.
2. Import the repository into Vercel and choose the **Vite** framework preset.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Deploy. No environment variables or API keys are needed.

The included `vercel.json` records these settings. Hash routes do not need an SPA rewrite. For CLI deployment, run `vercel` from this project folder with the Vercel CLI installed and authenticated. Consult the official [Vercel Vite documentation](https://vercel.com/docs/frameworks/frontend/vite) and [Vite static deployment guide](https://vite.dev/guide/static-deploy.html).

The optional `.openai/hosting.json` stores private Sites deployment metadata; it is not an application dependency and is not used by Vercel or local logo generation.

## Screenshots

Screenshot placeholders for the semester report—capture these from your running copy:

| Screenshot          | Suggested capture                                    |
| ------------------- | ---------------------------------------------------- |
| Landing             | Hero, original SVG preview, and feature strip        |
| Semantic generation | Vadapav brief with Food detection                    |
| Concept gallery     | All six food-related concepts and explanations       |
| Editor              | Selected symbol, transforms, and Layers panel        |
| Brand kit           | Logo variants and color specifications               |
| Mockups             | Business card, app icon, website, and social profile |
| About CG            | Interactive transformation lab and architecture      |

## Academic relevance

This project demonstrates the complete graphics pipeline: semantic input interpretation, geometric modeling, transforms, visual attributes, composition, interactive manipulation, and raster output. Its decision rules are inspectable during a viva, and each logo has a traceable relationship to its brief. It remains useful when third-party image APIs are unavailable.

## Future improvements

- Expanded multilingual keyword dictionaries and user-editable semantic rules.
- Custom path drawing and Bézier control-point editing.
- SVG text-to-path conversion with locally bundled, licensed fonts.
- Import/export of versioned editable project files.
- More layout constraints, alignment guides, and snapping.
- Optional print layouts with bleed and page-size presets.
- Optional offline install support using a service worker.

All current logo artwork is authored procedurally in this project. There are no copied logo-site images, Google Images assets, or external image generation calls.
