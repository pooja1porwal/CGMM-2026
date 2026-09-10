export const FURNITURE = [
  {
    type: "sofa",
    name: "Sofa",
    icon: "▰",
    color: "#B98255",
    material: "Fabric",
  },
  {
    type: "chair",
    name: "Chair",
    icon: "▱",
    color: "#B5A58F",
    material: "Wood",
  },
  {
    type: "table",
    name: "Table",
    icon: "⊞",
    color: "#4A382C",
    material: "Wood",
  },
  {
    type: "bed",
    name: "Bed",
    icon: "▤",
    color: "#71858A",
    material: "Fabric",
  },
  {
    type: "cabinet",
    name: "Cabinet",
    icon: "▥",
    color: "#5C554D",
    material: "Wood",
  },
  {
    type: "lamp",
    name: "Lamp",
    icon: "◉",
    color: "#B89A62",
    material: "Metal",
  },
  {
    type: "tv",
    name: "TV",
    icon: "▣",
    color: "#111111",
    material: "Glass",
  },
];

export const MATERIALS = {
  Wood: {
    roughness: 0.52,
    metalness: 0.03,
  },

  Fabric: {
    roughness: 0.58,
    metalness: 0,
  },

  Metal: {
    roughness: 0.2,
    metalness: 0.9,
  },

  Plastic: {
    roughness: 0.32,
    metalness: 0.05,
  },

  Glass: {
    roughness: 0.06,
    metalness: 0.1,
    transparent: true,
    opacity: 0.5,
  },
};

export const makeFurniture = (type, count = 0) => {
  const base = FURNITURE.find((item) => item.type === type);

  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,

    type,
    name: base.name,

    position: [
      ((count % 3) - 1) * 1.25,
      0,
      -0.2 + Math.floor(count / 3) * 1.15,
    ],

    rotation: [0, 0, 0],
    scale: [1, 1, 1],

    color: base.color,
    material: base.material,
  };
};

export const INITIAL_FURNITURE = [
  {
    id: "sofa-default",
    type: "sofa",
    name: "Sofa",
    position: [-1.9, 0, -1.7],
    rotation: [0, 0.25, 0],
    scale: [1, 1, 1],
    color: "#B98255",
    material: "Fabric",
  },

  {
    id: "table-default",
    type: "table",
    name: "Table",
    position: [0.3, 0, -0.2],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    color: "#4A382C",
    material: "Wood",
  },

  {
    id: "lamp-default",
    type: "lamp",
    name: "Lamp",
    position: [2.4, 0, -1.9],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    color: "#B89A62",
    material: "Metal",
  },
  {
    id: "tv-default",
    type: "tv",
    name: "TV",
    position: [0, 0, -3.1],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    color: "#18222A",
    material: "Glass",
  },
];
