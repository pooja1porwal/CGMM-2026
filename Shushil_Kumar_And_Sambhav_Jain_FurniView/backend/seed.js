const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Furniture = require('./models/Furniture');

dotenv.config();

const furnitureData = [
  {
    name: 'Modern Luxury Sofa',
    category: 'Sofa',
    description: 'A plush multi-cushion contemporary sofa featuring deep ergonomic seats, welt piping seams, and angled brass-tipped legs.',
    modelType: 'glb',
    modelUrl: '/models/sofa.glb',
    thumbnail: '🛋️',
    colors: ['#3b4252', '#1e293b', '#8b5a2b', '#b45309', '#047857', '#e2e8f0'],
    colorNames: ['Charcoal Slate', 'Midnight Navy', 'Warm Walnut', 'Cognac Amber', 'Emerald Velvet', 'Ivory Bouclé'],
    materials: ['Fabric', 'Leather', 'Velvet', 'Wood', 'Metal'],
    configurations: {
      seating: {
        label: 'Seating Configuration',
        options: ['3-Seat Luxury', '2-Seat Loveseat'],
        default: '3-Seat Luxury',
      },
    },
  },
  {
    name: 'Nordic Accent Armchair',
    category: 'Armchair',
    description: 'Sculpted accent club chair featuring an ergonomic curved high backrest, deep bucket cushion, and mid-century splayed legs.',
    modelType: 'glb',
    modelUrl: '/models/armchair.glb',
    thumbnail: '🪑',
    colors: ['#0f766e', '#1e293b', '#b91c1c', '#d97706', '#64748b', '#f8fafc'],
    colorNames: ['Teal Velvet', 'Obsidian', 'Crimson Ruby', 'Ochre Gold', 'Slate Gray', 'Cream White'],
    materials: ['Velvet', 'Fabric', 'Leather', 'Wood', 'Metal'],
    configurations: {
      style: {
        label: 'Silhouette',
        options: ['Wingback Accent', 'Modern Club'],
        default: 'Wingback Accent',
      },
    },
  },
  {
    name: 'Architectural Dining Table',
    category: 'Table',
    description: 'Minimalist statement dining table with beveled edge profile, cross-truss underframe, and brass ferrule legs.',
    modelType: 'glb',
    modelUrl: '/models/dining-table.glb',
    thumbnail: '🍽️',
    colors: ['#78350f', '#1c1917', '#d97706', '#f5f5f4', '#334155'],
    colorNames: ['Natural Walnut', 'Smoked Espresso', 'Warm Honey Oak', 'Calacatta White', 'Anthracite Ash'],
    materials: ['Wood', 'Metal', 'Leather', 'Fabric'],
    configurations: {
      tableShape: {
        label: 'Top Profile',
        options: ['Rectangular Bevel', 'Soft Oval'],
        default: 'Rectangular Bevel',
      },
    },
  },
  {
    name: 'Floating Tier Coffee Table',
    category: 'Table',
    description: 'Contemporary low-profile living room coffee table with curved edge perimeter, floating magazine shelf, and brass legs.',
    modelType: 'glb',
    modelUrl: '/models/coffee-table.glb',
    thumbnail: '☕',
    colors: ['#92400e', '#0f172a', '#e2e8f0', '#b45309', '#475569'],
    colorNames: ['Warm Oak', 'Piano Black', 'Carrara White', 'Amber Teak', 'Titanium Gray'],
    materials: ['Wood', 'Metal', 'Leather', 'Fabric'],
    configurations: {
      tierStyle: {
        label: 'Shelf Arrangement',
        options: ['Two-Tier Storage', 'Single Minimalist'],
        default: 'Two-Tier Storage',
      },
    },
  },
  {
    name: 'Grand Fluted Platform Bed',
    category: 'Bed',
    description: 'Opulent queen/king upholstered platform bed with fluted vertical channel headboard, plush mattress, and layered designer bedding.',
    modelType: 'glb',
    modelUrl: '/models/bed.glb',
    thumbnail: '🛏️',
    colors: ['#334155', '#1e1b4b', '#713f12', '#475569', '#064e3b', '#f1f5f9'],
    colorNames: ['Slate Fabric', 'Royal Indigo', 'Saddle Brown', 'Heather Gray', 'Forest Green', 'Alabaster Linen'],
    materials: ['Fabric', 'Leather', 'Velvet', 'Wood', 'Metal'],
    configurations: {
      headboardStyle: {
        label: 'Headboard Design',
        options: ['Fluted Vertical Channels', 'Tufted Minimalist'],
        default: 'Fluted Vertical Channels',
      },
    },
  },
  {
    name: 'Executive Ergonomic Chair',
    category: 'Chair',
    description: 'High-performance executive task chair with ribbed contoured lumbar support, adjustable headrest, and 5-star swivel caster base.',
    modelType: 'glb',
    modelUrl: '/models/office-chair.glb',
    thumbnail: '💺',
    colors: ['#1e293b', '#0f172a', '#78350f', '#475569', '#1d4ed8'],
    colorNames: ['Obsidian Black', 'Midnight Carbon', 'Cognac Tan', 'Steel Gray', 'Cobalt Blue'],
    materials: ['Leather', 'Fabric', 'Metal', 'Wood'],
    configurations: {
      armrests: {
        label: 'Armrest Type',
        options: ['3D Adjustable', 'Armless Minimalist'],
        default: '3D Adjustable',
      },
    },
  },
  {
    name: 'Scandinavian Dining Chair',
    category: 'Chair',
    description: 'Clean Scandinavian curved steam-bent silhouette with contoured back spindles, padded seat cushion, and brass ferrule legs.',
    modelType: 'glb',
    modelUrl: '/models/dining-chair.glb',
    thumbnail: '🪑',
    colors: ['#854d0e', '#1c1917', '#475569', '#fef3c7', '#0f766e'],
    colorNames: ['Smoked Ash', 'Carbon Black', 'Slate Gray', 'Natural Birch', 'Nordic Sage'],
    materials: ['Wood', 'Fabric', 'Leather', 'Velvet', 'Metal'],
    configurations: {
      backrest: {
        label: 'Backrest Style',
        options: ['Curved Spindle', 'Solid Contour'],
        default: 'Curved Spindle',
      },
    },
  },
  {
    name: 'Modernist Armoire Wardrobe',
    category: 'Wardrobe',
    description: 'Full-height 2-door minimalist wardrobe with vertical brass handle bars, recessed plinth, and customizable interior storage.',
    modelType: 'glb',
    modelUrl: '/models/wardrobe.glb',
    thumbnail: '🚪',
    colors: ['#57534e', '#1c1917', '#78350f', '#f5f5f4', '#1e293b'],
    colorNames: ['Smoked Oak', 'Dark Charcoal', 'Warm Walnut', 'Matte White', 'Navy Lacquer'],
    materials: ['Wood', 'Metal', 'Leather', 'Fabric'],
    configurations: {
      doorStyle: {
        label: 'Door Finish',
        options: ['Wood Veneer Panels', 'Matte Lacquer'],
        default: 'Wood Veneer Panels',
      },
    },
  },
  {
    name: 'Executive Workstation Desk',
    category: 'Desk',
    description: 'Streamlined workstation featuring a solid wood top with cable port, 3-drawer storage pedestal, articulated task lamp, and laptop.',
    modelType: 'glb',
    modelUrl: '/models/study-desk.glb',
    thumbnail: '🖥️',
    colors: ['#78350f', '#18181b', '#d97706', '#e2e8f0', '#334155'],
    colorNames: ['Rich Walnut', 'Matte Black', 'Amber Oak', 'Pure White', 'Gunmetal'],
    materials: ['Wood', 'Metal', 'Leather', 'Fabric'],
    configurations: {
      pedestalSide: {
        label: 'Pedestal Layout',
        options: ['Right Pedestal (3-Drawer)', 'Open Minimalist Frame'],
        default: 'Right Pedestal (3-Drawer)',
      },
    },
  },
  {
    name: 'Fluted Media TV Console',
    category: 'Cabinet',
    description: 'Low-profile entertainment credenza with slatted fluted sliding doors, cable routing channels, 55" OLED TV display, and stereo soundbar.',
    modelType: 'glb',
    modelUrl: '/models/tv-cabinet.glb',
    thumbnail: '📺',
    colors: ['#451a03', '#18181b', '#78350f', '#334155', '#f8fafc'],
    colorNames: ['Dark Walnut', 'Deep Obsidian', 'Classic Oak', 'Slate Gray', 'Ivory Lacquer'],
    materials: ['Wood', 'Metal', 'Leather', 'Fabric'],
    configurations: {
      consoleStyle: {
        label: 'Front Sliding Panels',
        options: ['Fluted Wood Slats', 'Minimalist Flat Panels'],
        default: 'Fluted Wood Slats',
      },
    },
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Furniture.deleteMany({});
    console.log('Cleared existing furniture data.');

    // Insert seed data
    const inserted = await Furniture.insertMany(furnitureData);
    console.log(`Seeded ${inserted.length} furniture items successfully!`);

    inserted.forEach((item) => {
      console.log(`  - ${item.name} (${item._id})`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
