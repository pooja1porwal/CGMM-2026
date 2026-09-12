# Validation record

- Production command: `npm run build` (TypeScript checking followed by Vite bundling).
- Automated tests: `npm test`; 65 passing assertions across four test files.
- Coverage: semantic category decisions, six distinct concepts for every industry, every style and font option, XML parsing of generated SVG, escaped user text, related icon geometry, palette contrast, nine brand-kit variants, editor history, layer order/visibility, localStorage behavior, and raster-export handling.
- The raster tests use controlled Image/Canvas doubles to check dimensions, MIME types, JPEG flattening, and Blob URL cleanup. They do not execute a browser's actual graphics renderer.
- The local Vite server responded successfully over HTTP. Automated browser interaction and visual screenshot checks were not run.
- Useful manual checks before a live presentation are listed in README.md and VIVA.md.

Two edge cases were corrected during testing: a `chai` substring collision inside `chair`, and a gray background whose initial wordmark color fell below the 4.5:1 contrast target. The fallback initial is intentionally an additional SVG text node, alongside the complete name and tagline.
