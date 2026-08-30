# ACADEMIC PROJECT REPORT
## Title: Virtual Shopping Mall (3D WebGL Application)

---

### 1. Introduction
The "Virtual Shopping Mall" is a 3D immersive web application designed to simulate a real-world shopping experience. Users can navigate a digitally constructed environment, browse different stores, interact with 3D product representations, and utilize a shopping cart. This project serves as a practical implementation of theoretical Computer Graphics concepts using modern web technologies.

### 2. Problem Statement
Traditional e-commerce websites rely on 2D grids of images, which lack spatial immersion. The challenge is to build a robust, interactive 3D environment that runs efficiently in a standard web browser without requiring heavy standalone software or plugins, strictly utilizing Computer Graphics mathematical principles.

### 3. Objectives
- To apply geometric modeling, transformations, and projections.
- To implement a realistic lighting and shading model.
- To allow interactive user navigation in a 3D coordinate system.
- To demonstrate object picking via Raycasting.

### 4. Existing System
Existing e-commerce platforms primarily use HTML/CSS card layouts. Some advanced systems use 360-degree photos, but they are static and do not allow true spatial exploration or real-time interaction with the lighting and environment.

### 5. Proposed System
The proposed system uses WebGL (via Three.js) to render a fully real-time 3D mall. It features first-person navigation, procedural object generation, dynamic lighting, and interactive UI overlays.

### 6. Hardware Requirements
- **Processor**: Intel Core i3 or equivalent (minimum).
- **RAM**: 4GB (8GB recommended).
- **Graphics**: Any standard integrated graphics supporting WebGL.

### 7. Software Requirements
- **OS**: Windows, macOS, or Linux.
- **Browser**: Modern web browser (Chrome, Firefox, Edge, Safari).
- **Environment**: Node.js (for local server).

### 8. Technologies Used
- HTML5, CSS3, JavaScript (ES6+).
- Three.js (JavaScript 3D Library).
- Vite (Build Tool).

### 9. System Architecture
The application follows a modular architecture separating the rendering engine from the data layer. 
`UI Layer <--> Interaction Layer (Raycaster/Controls) <--> Three.js Scene Graph <--> WebGL Renderer`.

### 10. Methodology
The development was carried out incrementally:
1. Scene and Camera Initialization.
2. Geometric Construction of the Mall Structure.
3. Procedural Generation of Stores and Products.
4. Lighting and Material Application.
5. Implementation of First-Person Controls and Raycasting.
6. Integration of 2D HTML Overlays (Cart, Panel, Minimap).

### 11. 3D Modeling
Objects in the scene are modeled using geometric primitives provided by Three.js (e.g., `BoxGeometry`, `CylinderGeometry`, `SphereGeometry`). Complex objects (like the Laptop or Dumbbell) are created by grouping multiple primitives together hierarchically using `THREE.Group`.

### 12. Transformations
Matrix transformations are heavily utilized:
- **Translation** (`position.set`): Used to place items on shelves.
- **Rotation** (`rotation.y`): Used to orient stores toward the center corridor and animate products.
- **Scaling** (`scale.set`): Used to provide visual feedback when a user hovers over a product.

### 13. Camera and Projection
A `PerspectiveCamera` is used to simulate human vision. Objects further from the camera appear smaller. The field of view (FOV) is set to 75 degrees, providing a natural peripheral vision suitable for first-person exploration.

### 14. Lighting and Shading
Multiple light sources are used to create depth:
- `AmbientLight`: Provides a base level of illumination.
- `DirectionalLight`: Simulates the sun, casting strong, parallel shadows through the mall entrance.
- `HemisphereLight`: Simulates indoor light bouncing off the floor and ceiling.
- `PointLight`: Used inside individual stores for localized illumination.
Materials use `MeshStandardMaterial`, a PBR (Physically Based Rendering) model that reacts realistically to these lights.

### 15. Rendering
The `WebGLRenderer` handles drawing the scene 60 times per second. It is configured with antialiasing for smooth edges and PCFSoft shadows for realistic shadow blurring.

### 16. User Navigation
Navigation is handled via `PointerLockControls`. When locked, raw mouse movement controls the camera's pitch and yaw. Keyboard inputs (WASD) modify a velocity vector, which is applied to the camera's position, simulating walking physics with friction.

### 17. Raycasting
To interact with objects, a `Raycaster` shoots a mathematical line from the camera's coordinates straight forward. The engine calculates if this line intersects with any bounding boxes in the scene, enabling the application to know exactly what the user is looking at.

### 18. Product Interaction
When a raycast hits a mesh, the system traverses up the scene graph to find the parent object marked as a product. The product is then scaled up by 10%, and its emissive color is brightened to indicate interactivity.

### 19. UI/UX
The 3D canvas is overlaid with standard HTML/CSS. This approach is highly performant. A hidden product panel and shopping cart become visible via DOM manipulation when triggered by 3D raycast events. A 2D minimap translates the camera's 3D (X,Z) position into 2D (Left, Top) CSS coordinates.

### 20. Multimedia
The project integrates the Web Audio API. It attempts to load an ambient MP3 track. If unavailable, it degrades gracefully by procedurally generating a low-frequency sine wave using an `OscillatorNode` to simulate mall ambient noise.

### 21. Shopping Cart
The cart maintains state using a JavaScript array. It calculates subtotals dynamically and updates the DOM, demonstrating integration between the 3D interaction layer and standard web application logic.

### 22. Testing
Testing was conducted manually against a checklist including boundary collision checks, raycasting accuracy, UI responsiveness, and cross-browser rendering stability.

### 23. Results
The final application successfully renders a 60FPS 3D environment inside a web browser. Users can seamlessly walk through stores, click 3D objects, and use a 2D interface simultaneously.

### 24. Advantages
- No installation required; runs in a web browser.
- Cross-platform compatibility.
- Highly modular codebase.

### 25. Limitations
- Entirely client-side; no backend database is currently attached.
- Relying entirely on primitive shapes limits the photorealism of the products.

### 26. Future Scope
- Implementation of GLTF model loading for high-fidelity assets.
- Multiplayer networking to see other users in the mall.
- E-commerce backend integration for real-time inventory and checkout.

### 27. Conclusion
The Virtual Shopping Mall successfully demonstrates that complex Computer Graphics principles—such as perspective projection, raycasting, and physically based rendering—can be effectively utilized to create highly interactive, practical web applications. 

### 28. References
- Three.js Documentation (threejs.org)
- WebGL Fundamentals (webglfundamentals.org)
- MDN Web Docs - Web Audio API
