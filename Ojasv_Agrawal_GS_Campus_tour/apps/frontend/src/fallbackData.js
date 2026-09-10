const author = { id: "demo-admin", name: "SGSITS College Admin", email: "admin@sgsits.ac.in", role: "ADMIN" };

function panorama(title, sky = "#86b9db", ground = "#66835d") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1200"><defs><linearGradient id="s" x2="0" y2="1"><stop stop-color="${sky}"/><stop offset="1" stop-color="#eaf4f7"/></linearGradient></defs><rect width="2400" height="650" fill="url(#s)"/><rect y="650" width="2400" height="550" fill="${ground}"/><path d="M0 690h400V390h420v300h300V330h560v360h270V460h450v310H0z" fill="#eee8d8"/><path d="M70 620h250V445H70zm1130 0h400V390h-400z" fill="#0b2545" opacity=".78"/><path d="M0 900 Q600 760 1200 900T2400 880v320H0z" fill="#526c4d"/><text x="1200" y="170" text-anchor="middle" font-family="Georgia" font-size="82" font-weight="bold" fill="white">${title}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const stopData = [
  ["sgsits-main-gate", "SGSITS Main Gate", "South Campus", "Entrance", 42, 91, "The Main Gate is the primary visitor entrance to the SGSITS campus from Park Road and the natural starting point for the virtual campus route.", "SGSITS has served technical education in central India since 1952. The main entrance connects the historic institute campus with the city of Indore."],
  ["sgsits-front-gate", "SGSITS Front Gate", "South-East Campus", "Entrance", 69, 91, "The Front Gate provides direct access to the eastern side of the institute and is a familiar arrival point for students and visitors.", "This gate forms part of the institute frontage along SGSITS Road and links the campus to nearby public transport and city routes."],
  ["civil-ground", "Civil Experimentation Ground", "West Campus", "Academic Facility", 11, 72, "The Civil Experimentation Ground is an open practical-learning area used to connect classroom principles with field-scale civil engineering work.", "Practical experimentation has long been central to engineering education at SGSITS, giving students space to observe, measure and test beyond the laboratory."],
  ["golden-gate", "Golden Gate SGSITS", "North-East Campus", "Campus Landmark", 92, 47, "Golden Gate is a prominent landmark on the north-eastern edge of the mapped campus and a useful orientation point for campus navigation.", "The landmark helps define the institute boundary and connects the campus route with Yeshwant Niwas Road."],
  ["academic-core", "Central Academic Block", "Academic Zone", "Academic Building", 56, 73, "The central academic area brings together lecture spaces, laboratories and everyday student activity at the heart of SGSITS.", "Across decades of technical education, the academic blocks have supported engineering, science and interdisciplinary learning for generations of students."],
];

export const fallbackPlaces = stopData.map(([id, title, district, category, mapX, mapY, story, history]) => ({
  id, title, district, category, mapX, mapY, story, history, author,
  panoramaDataUrl: panorama(title), gallery: [], comments: [], latitude: 0, longitude: 0,
  durationMinutes: 20, bestTime: "Open during institute hours",
  accessibility: "Campus pathways connect this location",
  audioGuide: `${title}. ${story} ${history}`,
}));

const source = fallbackPlaces[0];
const destination = fallbackPlaces[4];
export const fallbackRoutes = [{
  id: "demo-main-gate-academic-core", title: "Main Gate to Central Academic Block",
  sourceId: source.id, destinationId: destination.id, source, destination,
  path: [{ x: 42, y: 91 }, { x: 44, y: 84 }, { x: 50, y: 78 }, { x: 56, y: 73 }],
  instructions: ["Enter through the Main Gate", "Continue north on the central campus road", "Turn right toward the academic zone"],
  durationMinutes: 4, distanceMeters: 280, media: [],
}];
