# CGMS Viva Notes

1. **What is computer graphics?** Creating, storing, and displaying visual information with computers; here it produces an interactive 3D room.
2. **What is Three.js?** A JavaScript library that simplifies WebGL scenes, objects, cameras, lights, and materials.
3. **What is WebGL?** The browser API used to send graphics work to the GPU for real-time rendering.
4. **Why use Three.js instead of raw WebGL?** It provides a scene graph, loaders, math, cameras, and renderers, avoiding low-level shader setup for an academic application.
5. **What is a 3D coordinate system?** A space described by X (left/right), Y (up/down), and Z (forward/back) axes.
6. **What is translation?** Moving an object by changing its X, Y, and Z position.
7. **What is rotation?** Turning an object around its X, Y, or Z axis; this app exposes radians.
8. **What is scaling?** Enlarging or shrinking an object. Uniform scale changes all three dimensions equally.
9. **What is a transformation matrix?** A 4×4 matrix representing an object's translation, rotation, and scale. Three.js composes M = T × R × S.
10. **What is perspective projection?** A projection where distant objects appear smaller, like human vision.
11. **What is orthographic projection?** A projection without perspective foreshortening, useful for top/front/side inspection.
12. **What is a camera?** The virtual viewpoint that transforms scene coordinates into the image view.
13. **What is lighting?** Simulated illumination that gives objects visibility, depth, and mood. This app uses ambient, directional, and point light.
14. **What is shading?** Calculating a surface's final color based on lights, material, and surface orientation.
15. **What is a material?** Properties that describe a surface, including base color, roughness, metalness, and transparency.
16. **What is texture mapping?** Applying a 2D image to a 3D surface using UV coordinates; optional maps can be added in `public/textures`.
17. **What are shadows?** Darker regions caused when geometry blocks a light; enabled with cast/receive shadow flags.
18. **What is depth testing?** A GPU test that keeps the nearest pixel fragment so hidden objects do not draw over visible ones.
19. **What is raycasting?** Casting a mathematical ray from the camera through a pointer position to find clicked 3D objects.
20. **What is a scene graph?** A hierarchy of objects. Transforming a parent also affects its children.
21. **What is GLTF/GLB?** A compact 3D asset format for mesh, material, animation, and texture data; GLB is its binary form.
22. **How does Three.js communicate with WebGL?** Three.js creates GPU buffers and render commands through the WebGL renderer.
23. **What happens when the user moves furniture?** React state changes position; R3F updates the Three.js group; its model matrix is recomputed and WebGL renders the new image.
24. **How are transformations applied?** Translation, rotation, and scaling are combined into the object's model matrix before camera projection.
25. **How does the rendering pipeline work here?** Input updates React state, R3F updates the scene graph, Three.js prepares transforms/lights/materials, then WebGL/GPU rasterize the final canvas pixels.
