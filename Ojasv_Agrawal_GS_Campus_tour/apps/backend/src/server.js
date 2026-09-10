import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import multer from "multer";
import { createToken, requireAdmin, requireAuth } from "./auth.js";
import { prisma } from "./db.js";
import { buildAudioGuide, buildGuide, makeDataUrl, normalizeVideoUrl } from "./guide.js";
import { loginSchema, placeSchema, routeSchema } from "./validators.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 60,
  },
});

const allowedOrigins = (process.env.CLIENT_URL ?? "http://localhost:5173")
  .split(",")
  .map((value) => value.trim().replace(/\/+$/, ""))
  .filter(Boolean);

function isAllowedOrigin(origin) {
  const normalized = origin.replace(/\/+$/, "");
  if (allowedOrigins.includes(normalized)) return true;
  // A Vercel deployment URL changes on every build. Once a Vercel production
  // origin is configured, accept this project's preview deployments too.
  return allowedOrigins.some((allowed) => {
    try {
      const configured = new URL(allowed);
      const requested = new URL(normalized);
      const projectPrefix = configured.hostname.replace(/\.vercel\.app$/, "");
      return configured.hostname.endsWith(".vercel.app")
        && requested.protocol === "https:"
        && requested.hostname.endsWith(".vercel.app")
        && (requested.hostname === configured.hostname || requested.hostname.startsWith(`${projectPrefix}-`));
    } catch {
      return false;
    }
  });
}

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      // Requests without Origin are server-to-server or local health checks.
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

function publicUser(user) {
  return {
    email: user.email,
    id: user.id,
    name: user.name,
    role: user.role,
  };
}

function publicRoute(route) {
  const parse = (value, fallback) => { try { return JSON.parse(value); } catch { return fallback; } };
  return { id: route.id, title: route.title, sourceId: route.sourceId, destinationId: route.destinationId,
    source: route.source && publicPlace(route.source), destination: route.destination && publicPlace(route.destination),
    path: parse(route.pathJson, []), instructions: parse(route.instructionsJson, []), durationMinutes: route.durationMinutes,
    distanceMeters: route.distanceMeters, media: (route.media ?? []).sort((a,b)=>a.sortOrder-b.sortOrder).map(x=>({id:x.id,caption:x.caption,dataUrl:x.dataUrl,mimeType:x.mimeType,sortOrder:x.sortOrder})) };
}

function publicPlace(place) {
  const gallery = place.media
    ?.filter((item) => item.type === "PHOTO")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      caption: item.caption,
      dataUrl: item.dataUrl,
      id: item.id,
      mimeType: item.mimeType,
    })) ?? [];

  return {
    accessibility: place.accessibility,
    audioGuide: buildAudioGuide(place),
    author: publicUser(place.author),
    bestTime: place.bestTime,
    category: place.category,
    comments: place.comments?.map((comment) => ({
      author: publicUser(comment.user),
      body: comment.body,
      createdAt: comment.createdAt,
      id: comment.id,
    })) ?? [],
    createdAt: place.createdAt,
    district: place.district,
    durationMinutes: place.durationMinutes,
    gallery,
    history: place.history,
    id: place.id,
    imageMime: place.imageMime,
    latitude: place.latitude,
    localFood: place.localFood,
    longitude: place.longitude,
    mapX: place.mapX,
    mapY: place.mapY,
    panoramaDataUrl: place.panoramaDataUrl,
    safetyNote: place.safetyNote,
    story: place.story,
    title: place.title,
    travelTip: place.travelTip,
    videoUrl: place.videoUrl,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "SGSITS Virtual Campus API" });
});

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "SGSITS Virtual Campus API", health: "/api/health" });
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid login data." });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user) {
    return res.status(401).json({ message: "Wrong email or password." });
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({ message: "This login is reserved for the college administrator." });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);

  if (!ok) {
    return res.status(401).json({ message: "Wrong email or password." });
  }

  res.json({ token: createToken(user), user: publicUser(user) });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.get("/api/places", async (req, res) => {
  const query = String(req.query.q ?? "").trim();
  const district = String(req.query.district ?? "").trim();
  const category = String(req.query.category ?? "").trim();

  const places = await prisma.place.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      AND: [
        district ? { district: { contains: district } } : {},
        category ? { category: { contains: category } } : {},
        query
          ? {
              OR: [
                { title: { contains: query } },
                { district: { contains: query } },
                { category: { contains: query } },
                { story: { contains: query } },
                { history: { contains: query } },
                { travelTip: { contains: query } },
              ],
            }
          : {},
      ],
    },
    include: {
      author: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      media: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  res.json({ places: places.map(publicPlace) });
});

app.get("/api/places/:id", async (req, res) => {
  const place = await prisma.place.findUnique({
    where: { id: req.params.id },
    include: {
      author: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      media: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!place) {
    return res.status(404).json({ message: "Place not found." });
  }

  res.json({ place: publicPlace(place) });
});

app.get("/api/places/:id/guide", async (req, res) => {
  const place = await prisma.place.findUnique({
    where: { id: req.params.id },
    include: {
      author: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      media: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!place) {
    return res.status(404).json({ message: "Place not found." });
  }

  res.json({ guide: buildGuide(place), place: publicPlace(place) });
});

app.post("/api/places", requireAuth, requireAdmin, upload.fields([
  { name: "panorama", maxCount: 1 },
  { name: "photos", maxCount: 6 },
]), async (req, res) => {
  const parsed = placeSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid place details." });
  }

  const panorama = req.files?.panorama?.[0];
  const photos = req.files?.photos ?? [];

  if (!panorama) {
    return res.status(400).json({ message: "Panorama image is required." });
  }

  if (!panorama.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "Only image uploads are allowed." });
  }

  if (photos.some((file) => !file.mimetype.startsWith("image/"))) {
    return res.status(400).json({ message: "Gallery uploads must be images." });
  }

  const { mapX, mapY } = parsed.data;
  const panoramaDataUrl = makeDataUrl(panorama);
  const videoUrl = normalizeVideoUrl(parsed.data.videoUrl);
  const audioGuide = parsed.data.audioGuide || [
    `Welcome to ${parsed.data.title} in ${parsed.data.district}.`,
    parsed.data.story,
    parsed.data.history,
  ].join(" ");

  const place = await prisma.place.create({
    data: {
      accessibility: parsed.data.accessibility || null,
      audioGuide,
      authorId: req.user.id,
      bestTime: parsed.data.bestTime || null,
      category: parsed.data.category,
      district: parsed.data.district,
      durationMinutes: parsed.data.durationMinutes ?? 30,
      history: parsed.data.history,
      imageMime: panorama.mimetype,
      imageSizeBytes: panorama.size,
      latitude: parsed.data.latitude ?? 0,
      localFood: parsed.data.localFood || null,
      longitude: parsed.data.longitude ?? 0,
      mapX,
      mapY,
      media: {
        create: photos.map((file, index) => ({
          caption: `${parsed.data.title} gallery ${index + 1}`,
          dataUrl: makeDataUrl(file),
          mimeType: file.mimetype,
          sizeBytes: file.size,
          sortOrder: index,
          type: "PHOTO",
        })),
      },
      panoramaDataUrl,
      safetyNote: parsed.data.safetyNote || null,
      story: parsed.data.story,
      title: parsed.data.title,
      travelTip: parsed.data.travelTip || null,
      videoUrl,
    },
    include: {
      author: true,
      comments: { include: { user: true } },
      media: { orderBy: { sortOrder: "asc" } },
    },
  });

  res.status(201).json({ place: publicPlace(place) });
});

app.patch("/api/places/:id", requireAuth, requireAdmin, upload.fields([{ name: "panorama", maxCount: 1 }, { name: "photos", maxCount: 6 }]), async (req, res) => {
  const parsed = placeSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid place details." });
  const old = await prisma.place.findUnique({ where: { id: req.params.id } });
  if (!old) return res.status(404).json({ message: "Place not found." });
  const p = parsed.data, pano = req.files?.panorama?.[0], photos = req.files?.photos ?? [];
  const data = { ...p };
  if (p.videoUrl !== undefined) data.videoUrl = normalizeVideoUrl(p.videoUrl);
  if (p.latitude === undefined) delete data.latitude;
  if (p.longitude === undefined) delete data.longitude;
  if (pano) Object.assign(data, { panoramaDataUrl: makeDataUrl(pano), imageMime: pano.mimetype, imageSizeBytes: pano.size });
  const place = await prisma.place.update({ where:{id:req.params.id}, data:{...data, ...(photos.length ? {media:{create:photos.map((f,i)=>({caption:`${p.title||old.title} gallery ${i+1}`,dataUrl:makeDataUrl(f),mimeType:f.mimetype,sizeBytes:f.size,sortOrder:i,type:"PHOTO"}))}}:{})}, include:{author:true,comments:{include:{user:true}},media:{orderBy:{sortOrder:"asc"}}} });
  res.json({ place: publicPlace(place) });
});

app.delete("/api/places/:id", requireAuth, requireAdmin, async (req,res)=>{
  try {
    const connectedRoutes = await prisma.route.findMany({
      where: { OR: [{ sourceId: req.params.id }, { destinationId: req.params.id }] },
      select: { id: true },
    });
    const routeIds = connectedRoutes.map((route) => route.id);
    await prisma.$transaction([
      prisma.routeMedia.deleteMany({ where: { routeId: { in: routeIds } } }),
      prisma.route.deleteMany({ where: { id: { in: routeIds } } }),
      prisma.comment.deleteMany({ where: { placeId: req.params.id } }),
      prisma.placeMedia.deleteMany({ where: { placeId: req.params.id } }),
      prisma.place.delete({ where: { id: req.params.id } }),
    ]);
    res.status(204).end();
  } catch (error) {
    if (error?.code === "P2025") return res.status(404).json({message:"Place not found."});
    console.error("Unable to delete place", req.params.id, error);
    res.status(500).json({message:"Could not delete this stop. Please retry."});
  }
});

app.delete("/api/media/:id", requireAuth, requireAdmin, async (req,res)=>{
  try { await prisma.placeMedia.delete({where:{id:req.params.id}}); res.status(204).end(); }
  catch { res.status(404).json({message:"Photo not found."}); }
});

const routeInclude = { source:{include:{author:true,comments:{include:{user:true}},media:true}}, destination:{include:{author:true,comments:{include:{user:true}},media:true}}, media:{orderBy:{sortOrder:"asc"}} };
app.get("/api/routes", async (_req,res)=>res.json({routes:(await prisma.route.findMany({include:routeInclude,orderBy:{updatedAt:"desc"}})).map(publicRoute)}));
app.post("/api/routes", requireAuth, requireAdmin, upload.array("photos",52), async (req,res)=>{
  const parsed=routeSchema.safeParse(req.body); if(!parsed.success)return res.status(400).json({message:parsed.error.issues[0]?.message||"Invalid route."});
  if(parsed.data.sourceId===parsed.data.destinationId)return res.status(400).json({message:"Source and destination must be different."});
  if((req.files??[]).some(f=>!f.mimetype.startsWith("image/")))return res.status(400).json({message:"Every Street View position must be an image."});
  const route=await prisma.route.create({data:{...parsed.data,authorId:req.user.id,media:{create:(req.files??[]).map((f,i)=>({caption:f.originalname.replace(/\.[^.]+$/,"")||`Position ${i+1}`,dataUrl:makeDataUrl(f),mimeType:f.mimetype,sizeBytes:f.size,sortOrder:i}))}},include:routeInclude});
  res.status(201).json({route:publicRoute(route)});
});
app.patch("/api/routes/:id", requireAuth, requireAdmin, upload.array("photos",52), async (req,res)=>{
  const parsed=routeSchema.partial().safeParse(req.body); if(!parsed.success)return res.status(400).json({message:"Invalid route."});
  if((req.files??[]).some(f=>!f.mimetype.startsWith("image/")))return res.status(400).json({message:"Every Street View position must be an image."});
  const count=await prisma.routeMedia.count({where:{routeId:req.params.id}});
  const route=await prisma.route.update({where:{id:req.params.id},data:{...parsed.data,...((req.files??[]).length?{media:{create:req.files.map((f,i)=>({caption:f.originalname.replace(/\.[^.]+$/,"")||`Position ${count+i+1}`,dataUrl:makeDataUrl(f),mimeType:f.mimetype,sizeBytes:f.size,sortOrder:count+i}))}}:{})},include:routeInclude});
  res.json({route:publicRoute(route)});
});
app.delete("/api/routes/:id", requireAuth, requireAdmin, async(req,res)=>{try{await prisma.route.delete({where:{id:req.params.id}});res.status(204).end()}catch{res.status(404).json({message:"Route not found."})}});
app.delete("/api/route-media/:id", requireAuth, requireAdmin, async(req,res)=>{try{await prisma.routeMedia.delete({where:{id:req.params.id}});res.status(204).end()}catch{res.status(404).json({message:"Photo not found."})}});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: "Server error." });
});

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log(`SGSITS Virtual Campus API running on http://localhost:${port}`);
});
