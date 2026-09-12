# BrandForge Studio — Viva demonstration

Suggested duration: 8–12 minutes. Start the app with `npm run dev` before presenting. No internet is needed once dependencies are installed and the local server is running.

| Step | Action                                                                     | Point to explain                                                            |
| ---- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1    | Open the landing page.                                                     | A complete branding workflow built with React, TypeScript, and SVG.         |
| 2    | Click **Try Demo**.                                                        | Repeatable demo briefs avoid typing during the presentation.                |
| 3    | Choose **Vadapav**.                                                        | The name, tagline, Food industry, and description provide semantic context. |
| 4    | Show **Detected: Food** below the brief.                                   | Name matches carry 10 points; tagline 3, description 2, industry 5.         |
| 5    | Continue through personality, style, color, and font.                      | Preferences affect composition, weight, tracking, and palette.              |
| 6    | Generate six concepts.                                                     | The generation stages expose the procedural pipeline.                       |
| 7    | Identify bun/patty/chutney, cart, packet, badge, spice flame, and cutlery. | Symbols express the street-food identity instead of just using initials.    |
| 8    | Read two Semantic Connection explanations.                                 | Every graphical choice has an explicit relationship to the brief.           |
| 9    | Customize a concept.                                                       | The preview and editor use the same editable layer model.                   |
| 10   | Drag the icon. Show X and Y changing.                                      | Translation; pointer coordinates are mapped into the SVG artboard.          |
| 11   | Add a rounded rectangle; resize and rotate it.                             | Geometric primitive, scale, rotation, radius, and local coordinate system.  |
| 12   | Change fill and opacity. Move it behind the icon.                          | RGB colors, alpha blending, and painter’s-algorithm layering.               |
| 13   | Edit the brand-name text. Lock, hide, duplicate, and reorder layers.       | Typography and interactive state changes. Undo and redo a change.           |
| 14   | Save the project, then download SVG and PNG.                               | SVG preserves geometry; PNG rasterizes it to 1800 × 1200 pixels.            |
| 15   | Open Brand Kit; show Identity, Colors & Type, and Mockups.                 | Reuse one identity across multiple aspect ratios and media. Download ZIP.   |
| 16   | Open About CG and use the transformation lab.                              | Explain `p′ = T · R · S · p`, then trace the architecture pipeline.         |
| 17   | Open My Brands; edit the saved project.                                    | Browser-local persistence without a backend.                                |

## Questions you may be asked

**Is this AI?** It is a semantic rule-based graphics algorithm. It does not train or call an image model. “Intelligence” here means input analysis and explicit design rules.

**Why SVG instead of a generated bitmap?** SVG stores geometry and text, scales cleanly, and exposes editable layers. A bitmap has fixed pixels. Canvas is only needed for raster export.

**How are the six logos different?** Each uses a different category-related symbol and layout. Style changes layout order and other rules. Color and font preferences shape the visual system.

**What happens with an unknown name?** The chosen industry can supply the symbol vocabulary. If no category matches, the engine produces geometric concepts and clearly explains the fallback.

**How does dragging stay accurate when the canvas is resized?** Pointer positions are transformed through the inverse SVG screen CTM into the logical 600 × 400 coordinate space.

**How does undo work?** Immutable document snapshots form past, present, and future stacks. New edits clear redo. A pointer gesture records one starting snapshot and commits on release.

**Why do colors change on different backgrounds?** Perceived readability depends on foreground/background luminance. BrandForge picks high-contrast text and reports the selected wordmark’s contrast ratio.

**Does JPEG support transparency?** No. It is flattened onto white. Transparent PNG and SVG can omit the artboard background.

**Where are projects stored?** localStorage in the current browser, profile, and origin. A sessionStorage draft also survives a refresh in the current tab. ZIP download creates a portable copy.

**What are the limitations?** Finite semantic vocabulary; no arbitrary language understanding; platform-dependent live SVG fonts; 2D illustrative mockups; no project import or cloud synchronization.
