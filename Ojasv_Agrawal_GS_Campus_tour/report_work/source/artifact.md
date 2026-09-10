# SGSITS Virtual Campus - Project Report Design Specification

## Reference authority

- Source: `old-report.docx`
- Preserve the academic project-report sequence, numbered sections, summary tables, setup/deployment guidance, testing, limitations, future scope, and conclusion.
- Replace all MP tourism concepts, tourist registration, Leaflet coordinates, comments, and community uploads with the SGSITS campus-tour idea and its two roles: public spectator and college administrator.

## Visual system

- Formal university project report with an editorial cover.
- SGSITS palette: navy `#0B2545`, gold `#BFA15F`, white, pale slate `#F7F8FA`.
- Page geometry: A4 portrait, 0.75-inch margins.
- Body: Arial 10.5 pt, 1.15 line spacing.
- Headings: Cambria, navy; Heading 1 numbered and separated by a gold rule.
- Running header: SGSITS Virtual Campus | Computer Graphics Project.
- Footer: Ojasv Agrawal | page number.

## Content structure

1. Cover page
2. Project summary and metadata
3. Abstract
4. Problem statement
5. Proposed solution
6. Objectives and scope
7. Technology stack and architecture
8. User roles and workflows
9. Major modules
10. Database and API design
11. Computer graphics implementation
12. Frontend design and screenshot walkthrough
13. Local setup and deployment
14. Testing and security
15. Limitations and future scope
16. Conclusion and references

## Figures

Use all seven supplied screenshots as numbered figures with short explanatory captions. Keep each figure and caption together. Use one large screenshot per page where readability requires it; pair only compatible admin screenshots.

## Accuracy constraints

- Public spectators do not register or log in.
- Only the seeded ADMIN role can add campus stops.
- Admin chooses a point on the campus raster map and uploads descriptions, panorama and gallery images.
- Normalized mapX/mapY coordinates replace real latitude/longitude navigation.
- CG methods: viewport mapping, DDA rasterization, quadratic Bezier animation, translation/rotation, requestAnimationFrame, panorama drag/zoom.
- Production: Vercel frontend, Render backend, Supabase PostgreSQL.
- Local: SQLite with explicit local Prisma schema.
