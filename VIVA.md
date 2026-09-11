# VIVA PREPARATION: Computer Graphics (Virtual Shopping Mall)

Here are 30 likely viva questions covering the Computer Graphics concepts used in this project, along with concise answers suitable for a B.Tech student.

---

### 1. What is Computer Graphics?
**Answer:** It is the field of computer science that involves creating, manipulating, and rendering visual images and models on a computer screen using mathematical algorithms.

### 2. What is WebGL?
**Answer:** WebGL (Web Graphics Library) is a JavaScript API used for rendering interactive 2D and 3D graphics within any compatible web browser without the use of plug-ins. It is based on OpenGL ES.

### 3. What is Three.js?
**Answer:** Three.js is a high-level JavaScript library that makes it easier to create and display 3D graphics in a web browser. It abstracts away the complex, low-level details of raw WebGL.

### 4. What is a "Scene" in 3D graphics?
**Answer:** A scene is a 3D space or container where you place all your objects, cameras, and lights. It is the virtual world that will be rendered.

### 5. What is a Camera?
**Answer:** A camera determines what part of the 3D scene is visible. It defines the viewpoint from which the scene is rendered onto the 2D screen.

### 6. What is Perspective Projection?
**Answer:** It is a method of projecting 3D objects onto a 2D plane where objects further away appear smaller, mimicking how the human eye works. Lines that are parallel in 3D space converge at a vanishing point.

### 7. Why did you use a Perspective Camera for the mall?
**Answer:** Because we wanted to simulate a realistic, first-person human experience. A perspective camera accurately represents depth, which is necessary for a virtual reality or walking simulation.

### 8. What is Orthographic Projection?
**Answer:** It is a projection method where parallel lines remain parallel, and objects remain the same size regardless of their distance from the camera. It is commonly used in CAD software or 2D isometric games.

### 9. What is a Mesh?
**Answer:** A mesh is a 3D object composed of two main components: a Geometry (its shape) and a Material (its appearance).

### 10. What is Geometry?
**Answer:** Geometry defines the mathematical shape of an object. It is made up of vertices (points in 3D space) and faces (polygons connecting the vertices). Examples in our project include BoxGeometry and SphereGeometry.

### 11. What is a Material?
**Answer:** A material defines how the surface of a geometry interacts with light. It determines properties like color, shininess, roughness, and transparency.

### 12. What is Lighting in Computer Graphics?
**Answer:** Lighting involves mathematical models used to simulate how light sources illuminate objects in a scene, affecting their color and brightness based on distance and angle.

### 13. What is the difference between Ambient Light and Directional Light?
**Answer:** Ambient light globally illuminates all objects equally from all directions (no shadows). Directional light simulates a distant source like the sun, emitting parallel rays that cast distinct shadows.

### 14. What is Shading?
**Answer:** Shading is the process of altering the color of an object/polygon based on its angle to lights and its material properties, giving it a 3D appearance.

### 15. What are Transformations?
**Answer:** Transformations are mathematical operations (using matrices) applied to an object's coordinates to alter its position, orientation, or size in 3D space.

### 16. Explain Translation.
**Answer:** Translation moves an object from one position to another in the 3D coordinate system by adding a specific value to its X, Y, and Z coordinates.

### 17. Explain Rotation.
**Answer:** Rotation turns an object around a specific axis (X, Y, or Z) by a certain angle (usually measured in radians).

### 18. Explain Scaling.
**Answer:** Scaling changes the size of an object by multiplying its coordinates by a scale factor. A factor > 1 enlarges it, while < 1 shrinks it.

### 19. What is Raycasting?
**Answer:** Raycasting is a technique where an invisible mathematical ray is traced from a point (like the camera) in a specific direction to detect intersections with 3D objects.

### 20. Why is Raycasting used in this project?
**Answer:** It is used for object selection. When the user points the center crosshair at a product, a ray is cast from the camera to detect which product mesh the user is looking at, allowing us to highlight it or open its details.

### 21. How is first-person navigation implemented?
**Answer:** We use the Pointer Lock API to capture raw mouse movement for rotating the camera (pitch and yaw). Keyboard inputs (W,A,S,D) modify a velocity vector to translate (move) the camera position along the X and Z axes.

### 22. What is the Rendering Loop?
**Answer:** It is an infinite function loop (using `requestAnimationFrame`) that continually clears the screen and redraws the updated 3D scene (usually 60 times a second), creating the illusion of movement.

### 23. What is a Frame in animation?
**Answer:** A frame is a single still image. When multiple frames are rendered in rapid succession, it creates an animation.

### 24. How is animation implemented for the rotating products?
**Answer:** Inside the render loop, we continuously apply a small rotation transformation (e.g., `rotation.y += delta`) to the product meshes before the renderer draws the next frame.

### 25. What are Shadows in Computer Graphics?
**Answer:** Shadows are areas where light from a source is obstructed by an object. In WebGL, they are usually implemented using "Shadow Mapping," where the scene is first rendered from the light's perspective to create a depth map.

### 26. How are the products represented mathematically?
**Answer:** Because we did not import external 3D files, products are represented procedurally by combining basic geometric primitives (like boxes and cylinders) using a scene graph hierarchy (`THREE.Group`).

### 27. How is product information associated with the 3D objects?
**Answer:** We use the `.userData` property of the Three.js mesh to store the product ID. When the raycaster hits the object, it reads this ID and fetches the matching details from a separate JavaScript data array.

### 28. How does the minimap work?
**Answer:** It applies 2D mathematical scaling. It reads the camera's 3D (X,Z) coordinates, normalizes them, and translates them into CSS (Left, Top) pixel values to move a red dot across a 2D HTML map.

### 29. What are the limitations of your project?
**Answer:** It relies entirely on client-side memory, meaning there is no backend database. Also, the 3D models are built from low-poly primitives rather than highly detailed imported meshes to keep the project lightweight.

### 30. What improvements could be made?
**Answer:** We could integrate a backend database (like Node.js + MongoDB) to fetch live product prices, load high-fidelity GLTF models for realism, and implement collision detection between the camera and internal store shelves.
