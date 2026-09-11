# 3D Furniture Visualization System

A MERN-stack web application for interactive 3D furniture visualization. Built as a Computer Graphics project demonstrating 3D modeling, transformations, texture mapping, lighting, and real-time rendering using Three.js.

## Features

- **Interactive 3D Viewer** — Rotate, zoom, and pan furniture models with OrbitControls
- **Color Customization** — 6 color options applied dynamically to models
- **Material/Texture Selection** — Wood, Leather, Fabric, Metal with PBR properties
- **Furniture Configuration** — Leg styles, seating options, table shapes, headboard styles, armrests
- **3D Transformations** — Scaling (Small/Medium/Large), Translation (Left/Center/Right), Rotation (Auto-rotate toggle)
- **Lighting Control** — Low/Medium/High intensity with multi-light studio setup
- **5 Furniture Models** — Modern Chair, Comfortable Sofa, Dining Table, Queen Bed, Office Chair

## Computer Graphics Concepts Demonstrated

| Concept | Implementation |
|---------|---------------|
| 3D Modeling | Primitive-based furniture models (boxes, cylinders, spheres) |
| Transformations | Translation, rotation, scaling via Three.js |
| Texture Mapping | PBR materials (roughness, metalness) per material type |
| Lighting | Ambient, directional, spot, and point lights with shadows |
| Camera | Perspective camera with orbit controls |
| Rendering | WebGL rendering via Three.js / React Three Fiber |
| User Interaction | Mouse-based rotate, zoom, and pan |

## Tech Stack

- **Frontend**: React.js, Vite, Three.js, React Three Fiber, @react-three/drei, Tailwind CSS v4
- **Backend**: Node.js, Express.js, MongoDB, Mongoose

## Project Structure

```
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── FurnitureCard.jsx
│       │   ├── FurnitureViewer.jsx
│       │   ├── FurnitureModel.jsx
│       │   ├── CustomizationPanel.jsx
│       │   ├── LightingControls.jsx
│       │   └── models/
│       │       ├── ChairModel.jsx
│       │       ├── SofaModel.jsx
│       │       ├── TableModel.jsx
│       │       ├── BedModel.jsx
│       │       └── OfficeChairModel.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   └── Viewer.jsx
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Furniture.js
│   ├── controllers/
│   │   └── furnitureController.js
│   ├── routes/
│   │   └── furnitureRoutes.js
│   ├── seed.js
│   ├── server.js
│   └── .env
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Setup Backend

```bash
cd backend
npm install
```

Edit `.env` if needed:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/furniture-viz
```

Seed the database:
```bash
node seed.js
```

Start the backend server:
```bash
node server.js
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend on port 5000.

### 3. Usage

1. Open the home page to see the furniture collection
2. Click **"View in 3D"** on any furniture card
3. Interact with the 3D model:
   - **Drag** to rotate
   - **Scroll** to zoom
   - **Right-click drag** to pan
4. Use the customization panel to change:
   - Color, Material, Size, Configuration, Lighting
5. Toggle **Auto-Rotate** for continuous rotation
6. Click **Reset All** to restore defaults

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/furniture` | List all furniture items |
| GET | `/api/furniture/:id` | Get a single furniture item |
| GET | `/api/health` | Health check |

## License

MIT
