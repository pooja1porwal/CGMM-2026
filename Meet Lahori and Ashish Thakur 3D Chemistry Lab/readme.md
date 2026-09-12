# 🧪 3D Virtual Chemistry Laboratory

An interactive, browser-based 3D chemistry lab built with **React Three Fiber** and **Three.js**, letting students run guided and open-ended chemistry experiments — titrations, thermal reactions, and pH indicator behavior — without any real lab equipment, reagents, or safety risk.

Built by **Meet Lahori** and **Ashish Thakur** for the CGMM-2026 course submission.
https://chemistry-virtual-lab-iota.vercel.app/
---

## 🔬 Overview

Real chemistry experiments involving strong acids, bases, and heat can be expensive, slow, or unsafe to run repeatedly in a classroom. This project recreates four core experiments as an interactive 3D simulation:

- **Acid–Base Titration** (HCl + NaOH with phenolphthalein) — watch the sharp colorless → magenta transition at the pH ~8.2 endpoint.
- **Thermal Convection & Boiling** (CuSO₄ solution) — heat a blue copper sulfate solution with a Bunsen burner and watch convection, bubbling, and steam evolve as it approaches 100°C.
- **Universal pH Rainbow Spectrum** — add acid or base and watch the full universal indicator color range shift from red (strong acid) through green (neutral) to violet (strong base).
- **Free Sandbox Mode** — freely combine acids, bases, indicators, and metal salts while tracking live pH, temperature, and ionic concentration.

Rather than running a full physics engine, chemical behavior (color change, boiling, mixing) is driven by custom GLSL shaders and a lightweight chemistry state engine (`ChemicalEngine.js`), keeping it fast enough to run smoothly in-browser.

## 🛠 Tech Stack

| Layer | Tools |
|---|---|
| 3D rendering | React Three Fiber (`@react-three/fiber`), `three`, `@react-three/drei` |
| Shaders | Custom GLSL (fluid/boiling/color-mix effects) |
| UI feedback | `canvas-confetti` (experiment completion), `lucide-react` (icons) |
| Build tooling | Vite 6 |
| Language | JavaScript (JSX) |
| CI | GitHub Actions (`.github/workflows/deploy.yml`) |

## ✨ Key Features

- **4 guided experiments** with step-by-step instructions, each with its own real balanced chemical equation and expected pH/temperature behavior.
- **Interactive 3D lab equipment** — beaker, Erlenmeyer flask, Bunsen burner, digital pH/temperature probe, pipette dropper, reagent bottles, stirring rod, and test tube rack — all as separate, reusable R3F components.
- **Live telemetry HUD** (`LabHUD.jsx`) showing real-time pH, temperature, and reaction equation as the simulation runs.
- **Animated pouring and mixing** via a dedicated `AnimatedPourStream` component.
- **Sound feedback** through a custom `SoundEngine.js`.
- **Responsive design** — verified at both desktop (1440px) and mobile (390px) widths (see `desktop_1440.png`, `mobile_390_*.png` reference captures).

## 📂 Project Structure

```text
Meet Lahori and Ashish Thakur 3D Chemistry Lab/
├── src/
│   ├── components/          # Beaker, BunsenBurner, ErlenmeyerFlask, DigitalProbe,
│   │                         # PipetteDropper, ReagentBottle, StirringRod, TestTubeRack,
│   │                         # LabEnvironment, LabHUD, IonVisualizerModal, PHPaperStrip,
│   │                         # AnimatedPourStream
│   ├── core/                 # ChemicalEngine.js (reaction/pH logic), SoundEngine.js
│   ├── experiments/           # experimentList.js — the 4 guided experiments
│   ├── shaders/               # Custom GLSL fragment/vertex shaders
│   ├── App.jsx                 # Main app shell
│   ├── index.css
│   └── main.jsx                # Entry point
├── .github/workflows/deploy.yml # CI/deployment workflow
├── capture.mjs                  # Screenshot capture script (desktop/mobile views)
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## 🧬 Experiments Included

1. **Acid-Base Titration (HCl + NaOH)** — `HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l) + ΔH`
2. **Thermal Convection & Boiling (CuSO₄)** — `CuSO₄·5H₂O(aq) + Heat → Boiling Solution + H₂O(g)↑`
3. **Universal pH Rainbow Spectrum** — `HInd ⇌ H⁺ + Ind⁻`
4. **Free Sandbox Laboratory** — open-ended mixing with live pH/temperature/ionic tracking

## 📸 Screenshots

See `desktop_1440.png` and the `mobile_390_*.png` files in this folder for reference captures of the 3D view, chemicals panel, protocol steps, and telemetry HUD across screen sizes.

---

**Authors:** Meet Lahori & Ashish Thakur
