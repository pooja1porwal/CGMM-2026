const BASE_URL = import.meta.env.BASE_URL;

export const monuments = [

    // =========================================================
    // 01 — RAJWADA PALACE
    // =========================================================
    {
        id: "rajwada-palace",
        name: "Rajwada Palace",
        city: "Indore",
        region: "Rajwada Chowk · Malwa",
        state: "Madhya Pradesh",
        year: "Built 1747 CE",
        era: "18th Century · Holkar Maratha",
        style: "Maratha · Mughal · French",
        architect: "Malhar Rao Holkar I · Ahilya Bai Holkar",
        coordinates: "22.7186° N, 75.8554° E",
        isMP: true,
        isIndore: true,

        model: `${BASE_URL}models/Rajwada/Rajwada.glb`,

        heroImage:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Rajwada_Palace%2C_Indore.jpg?width=1600",

        tagline:
            "Seven storeys of carved stone and seasoned teakwood at the royal heart of Indore.",

        introduction:
            "Rajwada is the historic seven-storey palace of the Holkar dynasty in Indore. Constructed in 1747 CE, its lower three floors are carved from dark basalt stone, while the upper four floors rise in intricately carved teak wood with ornate Maratha jharokha balconies and a central open-air chowk.",

        history: {
            when:
                "Construction commenced in 1747 CE under Malhar Rao Holkar, founder of the Holkar dynasty, with subsequent reconstructions in 1818, 1834, and the 2000s after historical fires.",

            where:
                "Rajwada Chowk at the historical center of Indore, adjacent to the famous Sarafa and Cloth markets in Madhya Pradesh.",

            who:
                "Commissioned by the rulers of the Holkar royal house and patronized by the revered Devi Ahilya Bai Holkar.",

            how:
                "The palace utilizes a structural composite system: earthquake-resistant loadbearing basalt stone masonry on the lower 3 storeys supporting timber-framed upper levels with cantilevered jharokhas, cusped arches, and brass-studded entrance gates.",

            why:
                "Constructed as the primary seat of administration, royal residence, and public Durbar for the Holkar rulers of Malwa.",

            story:
                "Rajwada survived three major fires in its history and was lovingly restored each time by master woodworkers and stone carvers, cementing its position as the soul and pride of Indore.",

            significance:
                "One of the most remarkable surviving examples of secular Maratha-Holkar royal architecture in India."
        },

        architecture:
            "The palace rises 7 storeys high. The stone base provided defense and thermal mass, while the wooden upper floors allowed rapid air circulation. Projecting wooden jharokha balconies, bracketed chhajjas, and a central courtyard illustrate ingenious climate-responsive design.",

        environment:
            "Surrounded by the bustling historical city center of Indore, including Rajwada garden, Devi Ahilya Bai statue, Sarafa night food street, and traditional textile bazaars.",

        presentDay:
            "Protected monument maintained by the Directorate of Archaeology, Archives & Museums, Government of Madhya Pradesh, hosting nightly sound-and-light spectacles.",

        preservation:
            "Digital heritage reconstruction documents the intricate timber joinery and stone relief carving, preserving the architectural memory of its post-fire reconstructions.",

        visitorExperience:
            "Walk into the grand entrance gate, marvel at the heavy timber doors and brass spikes, look upward into the open-sky courtyard, and admire the rhythmic wooden jharokhas.",

        gallery: [
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Rajwada_Palace%2C_Indore.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Rajwada_Palace%2C_Indore.jpg?width=900",
                title: "Rajwada Seven-Storey Facade",
                description: "The towering 7-storey facade combining dark basalt stone lower levels and intricately carved upper teakwood storeys."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Rajwada_Palace%2C_Indore%2C_Madhya_Pradesh.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Rajwada_Palace%2C_Indore%2C_Madhya_Pradesh.jpg?width=900",
                title: "Gopura Entrance Gate",
                description: "Massive carved wooden gate studded with defensive iron spikes and brass plates leading into Ganesh Chowk."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Indore_Rajwada_at_night.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Indore_Rajwada_at_night.jpg?width=900",
                title: "Night Illumination",
                description: "The palace illuminated against the evening sky during Indore cultural festivals and festive celebrations."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Ahilya_Status_Rajwada_Indore_2014.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Ahilya_Status_Rajwada_Indore_2014.jpg?width=900",
                title: "Devi Ahilya Bai Statue",
                description: "Bronze statue of the revered Holkar queen and philosopher-ruler overlooking Rajwada Chowk."
            }
        ],

        hotspots: [
            {
                title: "Grand Gopura Entrance Gate",
                description: "Massive carved wooden gate studded with defensive iron spikes and brass plating.",
                anchor: [0.00, 0.15, 0.95]
            },
            {
                title: "Basalt Stone Lower Levels",
                description: "Three heavy stone ground floors built for defense and structural load-bearing.",
                anchor: [0.60, 0.22, 0.50]
            },
            {
                title: "Wooden Upper Storeys & Jharokhas",
                description: "Four upper storeys crafted from seasoned teak wood with ornate projecting balconies.",
                anchor: [0.00, 0.62, 0.80]
            },
            {
                title: "Ganesh Chowk Courtyard",
                description: "The central open-to-sky quadrangle surrounded by pillared galleries.",
                anchor: [0.00, 0.25, 0.00]
            },
            {
                title: "Holkar Saffron Flag & Finial",
                description: "The uppermost pavilion flying the royal saffron flag over central Indore.",
                anchor: [0.00, 0.95, 0.00]
            }
        ],

        tour: [
            { title: "Grand Entrance Portal", hotspot: 0 },
            { title: "Basalt Stone Bastion", hotspot: 1 },
            { title: "Teakwood Jharokha Balconies", hotspot: 2 },
            { title: "Central Ganesh Chowk", hotspot: 3 },
            { title: "Royal Flagstaff Finial", hotspot: 4 }
        ],

        quiz: [
            {
                question: "How many storeys does Rajwada Palace in Indore have?",
                options: ["5 storeys", "7 storeys", "9 storeys", "3 storeys"],
                answer: 1
            },
            {
                question: "Which dynasty constructed Rajwada Palace?",
                options: ["Holkar Dynasty", "Scindia Dynasty", "Mughal Dynasty", "Paramara Dynasty"],
                answer: 0
            }
        ],

        sources: [
            "Directorate of Archaeology, Archives & Museums, Madhya Pradesh",
            "Indore Smart City Development Ltd.",
            "Madhya Pradesh Tourism Development Corporation"
        ]
    },


    // =========================================================
    // 02 — LAL BAGH PALACE
    // =========================================================
    {
        id: "lal-bagh-palace",
        name: "Lal Bagh Palace",
        city: "Indore",
        region: "Khan River Estate · Malwa",
        state: "Madhya Pradesh",
        year: "Built 1886–1921 CE",
        era: "Late 19th / Early 20th Century",
        style: "European Neoclassical · Italianate · Baroque",
        architect: "Bernard Triggs · Shivaji Rao Holkar",
        coordinates: "22.7005° N, 75.8427° E",
        isMP: true,
        isIndore: true,

        model: `${BASE_URL}models/LalBagh/LalBagh.glb`,

        heroImage:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Lal_Baug_Palace_IndoreR0010277s.jpg?width=1600",

        tagline:
            "A 28-acre European-Holkar palace with Versailles-inspired gates along the Khan River.",

        introduction:
            "Built between 1886 and 1921 by the Holkar rulers, Lal Bagh Palace represents the zenith of Holkar prosperity, blending Italian neoclassical porticos, English baroque ballrooms, Versailles-style cast-iron gates, and sprawling landscaped gardens.",

        history: {
            when:
                "Constructed in successive phases between 1886 and 1921 CE under Tukoji Rao Holkar II, Shivaji Rao Holkar, and Tukoji Rao Holkar III.",

            where:
                "Set within a picturesque 28-acre estate on the banks of the Khan (Kahn) River in southern Indore, Madhya Pradesh.",

            who:
                "Envisioned by the progressive Holkar monarchs and realized with British architect Bernard Triggs and master European craftsmen.",

            how:
                "Constructed with Italian Carrara marble, Belgian stained glass, French plaster moldings, and iron gates cast in England modeled after Buckingham Palace and Versailles.",

            why:
                "Designed to host international dignitaries, imperial viceroys, and grand durbars in state-of-the-art modern comfort.",

            story:
                "The towering entrance gates were cast in Shropshire, England, shipped across the oceans to Bombay port, and hauled to Indore by special steam engines and elephant caravans.",

            significance:
                "Universally recognized as one of the finest and most intact neoclassical palace complexes in the Indian subcontinent."
        },

        architecture:
            "The palace exhibits classical Corinthian columns, a pedimented entrance portico, mansard roofs, plaster relief ceiling frescoes, and a spring-mounted wooden ballroom floor.",

        environment:
            "Enclosed within extensive botanical grounds, rose gardens, ceremonial driveways, and riverbank pavilions along the Khan River.",

        presentDay:
            "Operated as a museum by the Government of Madhya Pradesh, displaying royal Holkar artifacts, coins, armory, and period furniture.",

        preservation:
            "Preserving the gilded wrought-iron gates and delicate ceiling frescoes demands specialized conservation and continuous digital modeling.",

        visitorExperience:
            "Pass through the gilded Versailles gates, approach the neoclassical carriage porch, and tour the grand ballroom and marble banquet halls.",

        gallery: [
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Lal_Baug_Palace_IndoreR0010277s.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Lal_Baug_Palace_IndoreR0010277s.jpg?width=900",
                title: "Italianate Renaissance Facade",
                description: "The grand European neoclassical palace facade with classical columns and landscaped grounds."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Ballroom_of_Lal_Bagh_Palace_of_Indore.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Ballroom_of_Lal_Bagh_Palace_of_Indore.jpg?width=900",
                title: "Royal Grand Ballroom",
                description: "Spring-cushioned wooden dance floor beneath Belgian crystal chandeliers and Renaissance-style ceiling frescoes."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Lalbagh_PalaceR0010282s.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Lalbagh_PalaceR0010282s.jpg?width=900",
                title: "Classical Colonnades & Pediments",
                description: "Neoclassical architectural detailing, Corinthian capitals, and Italian marble furnishings."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Lalbagh_PalaceR0010284s.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Lalbagh_PalaceR0010284s.jpg?width=900",
                title: "Versailles-Style Entrance Gates",
                description: "Gilded cast-iron entrance gates forged in Shropshire, England, modelled after Buckingham Palace gates."
            }
        ],

        hotspots: [
            {
                title: "Versailles-Style Entrance Gates",
                description: "Replica cast-iron gates forged in England bearing the royal Holkar sunburst crest.",
                anchor: [0.00, 0.20, 0.95]
            },
            {
                title: "Neoclassical Carriage Portico",
                description: "Classical Corinthian columns supporting the royal carriage entrance and pediment.",
                anchor: [0.00, 0.35, 0.40]
            },
            {
                title: "Grand Ballroom & Chandeliers",
                description: "Opulent ballroom with spring-mounted wooden flooring and Belgian chandeliers.",
                anchor: [0.45, 0.45, 0.00]
            },
            {
                title: "Italian Marble Dining Saloon",
                description: "State banqueting room paved in polished Italian Carrara marble.",
                anchor: [-0.45, 0.45, 0.00]
            },
            {
                title: "Estate Rose Gardens & Riverbank",
                description: "28-acre riverside parkland extending to the banks of the Khan River.",
                anchor: [0.00, 0.10, -0.80]
            }
        ],

        tour: [
            { title: "Gilded Entrance Gates", hotspot: 0 },
            { title: "Classical Portico", hotspot: 1 },
            { title: "Royal Ballroom", hotspot: 2 },
            { title: "Italian Marble Saloon", hotspot: 3 },
            { title: "River Estate Gardens", hotspot: 4 }
        ],

        quiz: [
            {
                question: "Where were the famous entrance gates of Lal Bagh Palace cast?",
                options: [
                    "England (Shropshire)",
                    "France (Paris)",
                    "Italy (Rome)",
                    "Indore Foundry"
                ],
                answer: 0
            },
            {
                question: "Along which river in Indore is Lal Bagh Palace situated?",
                options: [
                    "Khan (Kahn) River",
                    "Narmada River",
                    "Chambal River",
                    "Betwa River"
                ],
                answer: 0
            }
        ],

        sources: [
            "Directorate of Archaeology & Museums, Madhya Pradesh",
            "Indore Heritage Trust",
            "Madhya Pradesh Tourism Development Corporation"
        ]
    },


    // =========================================================
    // 03 — KRISHNAPURA CHHATRIS
    // =========================================================
    {
        id: "krishnapura-chhatris",
        name: "Krishnapura Chhatris",
        city: "Indore",
        region: "Kahn River Ghats · Malwa",
        state: "Madhya Pradesh",
        year: "Built c. 1849 CE",
        era: "Mid 19th Century · Holkar Dynasty",
        style: "Maratha Funerary · Nagara Stone Architecture",
        architect: "Holkar Royal Architects",
        coordinates: "22.7179° N, 75.8569° E",
        isMP: true,
        isIndore: true,

        model: `${BASE_URL}models/Krishnapura/Krishnapura.glb`,

        heroImage:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Indore_Krishnapura_Chhatri.JPG?width=1600",

        tagline:
            "Poetic Maratha stone cenotaphs and sacred river ghats honoring the Holkar monarchs.",

        introduction:
            "Erected on the banks of the Kahn River in Indore around 1849 CE, the Krishnapura Chhatris are royal cenotaphs dedicated to Maharani Krishna Bai Holkar and other rulers. They represent the crowning achievement of Maratha stone carving and funerary architecture in Malwa.",

        history: {
            when:
                "Constructed around 1849 CE following the passing of Maharani Krishna Bai Holkar, with additional cenotaphs built in subsequent decades.",

            where:
                "Overlooking the Kahn (Khan) River in central Indore, Madhya Pradesh.",

            who:
                "Commissioned by the royal house of Holkar to honor their deceased monarchs and queen regents.",

            how:
                "Sculpted from local Malwa sandstone and basalt, featuring stepped river ghats, carved elephant brackets, ribbed Nagara shikharas, and sacred interior sanctums.",

            why:
                "Chhatris were built as commemorative memorials over cremation sites to offer eternal peace and celebrate the ruler's earthly virtues.",

            story:
                "During evening aarti and festive nights, the illuminated stone spires reflect upon the river waters, while priests and pilgrims gather on the ancient ghat steps.",

            significance:
                "A masterpiece of Central Indian Maratha temple and memorial architecture reflecting deep spiritual and civic traditions."
        },

        architecture:
            "Combines stepped ghat platforms, octagonal pillared mandapas with cusped Maratha arches, ribbed curvilinear shikharas, amalakas, and golden finials.",

        environment:
            "Stepped stone ghats descending into the Kahn River, surrounded by the historic old city core of Indore.",

        presentDay:
            "Protected heritage monument undergoing riverfront revitalization under the Indore Smart City project.",

        preservation:
            "Riverbank stone conservation and moisture control are vital to preserving these delicate stone carvings.",

        visitorExperience:
            "Walk down the stone ghat steps, examine the carved elephant motifs, stand beneath the cusped arches, and look up at the towering ribbed spires.",

        gallery: [
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Indore_Krishnapura_Chhatri.JPG?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Indore_Krishnapura_Chhatri.JPG?width=900",
                title: "River Ghat Perspective",
                description: "The stone cenotaphs rising gracefully above the sacred Kahn river ghats in central Indore."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Krishnapura_Chhatri_-_sculptures.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Krishnapura_Chhatri_-_sculptures.jpg?width=900",
                title: "Intricate Stone Friezes",
                description: "Sculpted stone friezes and mythological reliefs adorning the Maratha cenotaph plinths."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Krishnapura_Chhatris_Indore_2.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Krishnapura_Chhatris_Indore_2.jpg?width=900",
                title: "Carved Shikhara Spires",
                description: "Intricately ribbed stone shikharas crowned with traditional amalaka and brass kalash finials."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Krishnapura_Chhatris_Indore_4.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Krishnapura_Chhatris_Indore_4.jpg?width=900",
                title: "Pillared Mandapa Colonnade",
                description: "Octagonal stone columns with sculpted brackets and Maratha cusped archways."
            }
        ],

        hotspots: [
            {
                title: "River Ghat Stepped Plinth",
                description: "Broad stone stairs descending directly into the Kahn river for sacred rituals.",
                anchor: [0.00, 0.10, 0.90]
            },
            {
                title: "Ribbed Nagara Shikharas",
                description: "Curvilinear stone spires carved with miniature shrines and golden kalasha finials.",
                anchor: [0.00, 0.85, 0.00]
            },
            {
                title: "Carved Stone Colonnade",
                description: "Octagonal pillars featuring Maratha floral cusps and sculpted elephant capitals.",
                anchor: [-0.50, 0.35, 0.20]
            },
            {
                title: "Inner Sanctum & Royal Paduka",
                description: "The sacred interior shrine containing symbolic marble footprints of the Holkar rulers.",
                anchor: [0.00, 0.30, 0.00]
            },
            {
                title: "Water Reflection Platform",
                description: "Water basin reflecting the silhouetted spires during evening illumination.",
                anchor: [0.60, 0.12, 0.60]
            }
        ],

        tour: [
            { title: "Stepped River Ghats", hotspot: 0 },
            { title: "Pillared Maratha Colonnade", hotspot: 2 },
            { title: "Sacred Inner Sanctum", hotspot: 3 },
            { title: "Ribbed Stone Spire", hotspot: 1 },
            { title: "River Mirror Reflection", hotspot: 4 }
        ],

        quiz: [
            {
                question: "In memory of which Holkar queen was the primary Krishnapura Chhatri built?",
                options: [
                    "Maharani Krishna Bai Holkar",
                    "Rani Lakshmibai",
                    "Rani Durgavati",
                    "Maharani Tarabai"
                ],
                answer: 0
            },
            {
                question: "What architectural feature crowns the spires of the Chhatris?",
                options: [
                    "Amalaka & Kalash",
                    "Minaret",
                    "Cross",
                    "Clock tower"
                ],
                answer: 0
            }
        ],

        sources: [
            "Archaeological Survey of India",
            "Indore Smart City Heritage Project",
            "Madhya Pradesh Tourism Development Corporation"
        ]
    },


    // =========================================================
    // 04 — JAHAZ MAHAL
    // =========================================================
    {
        id: "jahaz-mahal",
        name: "Jahaz Mahal",
        city: "Mandu",
        region: "Dhar District · Malwa",
        state: "Madhya Pradesh",
        year: "Built c. 1436–1469 CE",
        era: "15th Century · Malwa Sultanate",
        style: "Malwa Sultanate · Afghan-Islamic",
        architect: "Sultan Ghiyas-ud-din Khalji",
        coordinates: "22.3663° N, 75.3957° E",
        isMP: true,
        isIndore: false,

        model: `${BASE_URL}models/JahazMahal/JahazMahal.glb`,

        heroImage:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Jahaz_Mahal_01.jpg?width=1600",

        tagline:
            "The legendary Ship Palace floating between two turquoise lakes in the fortress city of Mandu.",

        introduction:
            "Built in the late 15th century by Sultan Ghiyas-ud-din Khalji, Jahaz Mahal spans 110 metres between the Kapur Talao and Munj Talao lakes in Mandu, appearing like a majestic medieval stone ship sailing serenely on placid waters.",

        history: {
            when:
                "Constructed circa 1436–1469 CE during the golden era of the Khalji Sultans of the Malwa Sultanate.",

            where:
                "Perched high on the Vindhyan plateau in the ruined fortress city of Mandu, Dhar District, Madhya Pradesh (90 km from Indore).",

            who:
                "Built by Sultan Ghiyas-ud-din Khalji as a pleasure palace and peaceful retreat for his royal court.",

            how:
                "Built with Malwa red and yellow sandstone, featuring a long two-storey colonnade, scalloped spiral bathing tanks, domed rooftop pavilions, and an ingenious gravity-fed water cooling network.",

            why:
                "Engineered to capture cooling lake breezes and provide natural air conditioning in the hot Malwa summer months.",

            story:
                "During the monsoon when both Kapur and Munj lakes are full, the reflection gives the breathtaking illusion of a gigantic sailing ship floating on water.",

            significance:
                "A world-famous pinnacle of medieval Islamic hydraulic engineering, landscape design, and secular pleasure architecture."
        },

        architecture:
            "Elongated 110m facade with pointed Sultanate arches, cantilevered stone balconies, open roof terraces, domed chhatris, and a lotus-shaped stepped bathing pool.",

        environment:
            "Flanked by the historic Kapur Talao and Munj Talao lakes amidst the mist-clad cliffs, baobab trees, and historic ruins of Mandu.",

        presentDay:
            "UNESCO tentative list property and one of the most visited heritage sites in Central India, maintained by the ASI.",

        preservation:
            "Preserving the historic lake hydrology and sandstone fabric against seasonal monsoon weathering.",

        visitorExperience:
            "Walk along the narrow causeway between the lakes, climb to the open terrace, inspect the scalloped lotus pool, and gaze across the Mandu plateau.",

        gallery: [
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Jahaz_Mahal_01.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Jahaz_Mahal_01.jpg?width=900",
                title: "Ship Palace Floating Facade",
                description: "The 110-metre long pink sandstone palace appearing to float between Kapur Talao and Munj Talao."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Jahaz_Mahal_02.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Jahaz_Mahal_02.jpg?width=900",
                title: "Rooftop Domed Chhatris",
                description: "Delicate arched pavilions commanding panoramic vistas across the historic Mandu plateau."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Jahaz_Mahal_04.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Jahaz_Mahal_04.jpg?width=900",
                title: "Scalloped Lotus Water Pools",
                description: "Ingenious rainwater aqueducts and filtration channels feeding open-air royal baths and cisterns."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Jahaz_Mahal_10.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Jahaz_Mahal_10.jpg?width=900",
                title: "Sunset Sandstone Colonnades",
                description: "Warm golden sunset light bathing the Malwa pink sandstone colonnades and water reflections."
            }
        ],

        hotspots: [
            {
                title: "Floating Ship Hull Facade",
                description: "The 110-meter long slender sandstone structure anchored between the twin lakes.",
                anchor: [0.00, 0.30, 0.85]
            },
            {
                title: "Rooftop Domed Pavilions",
                description: "Arched open-air chhatris with hemispherical domes overlooking the Malwa plateau.",
                anchor: [0.00, 0.85, 0.00]
            },
            {
                title: "Scalloped Lotus Bathing Pool",
                description: "An intricate spiral bathing tank on the terrace fed by historic rainwater aqueducts.",
                anchor: [-0.60, 0.60, 0.00]
            },
            {
                title: "Aqueducts & Hydraulic Channels",
                description: "Ancient gravity-fed water channels that cooled the palace chambers.",
                anchor: [0.60, 0.35, 0.30]
            },
            {
                title: "Twin Lake View Balconies",
                description: "Cantilevered stone balconies framing vistas of Kapur Talao and Munj Talao.",
                anchor: [0.00, 0.45, -0.85]
            }
        ],

        tour: [
            { title: "Ship Hull Facade", hotspot: 0 },
            { title: "Hydraulic Aqueduct", hotspot: 3 },
            { title: "Scalloped Lotus Pool", hotspot: 2 },
            { title: "Rooftop Domed Pavilions", hotspot: 1 },
            { title: "Twin Lake Vistas", hotspot: 4 }
        ],

        quiz: [
            {
                question: "Between which two lakes is Jahaz Mahal situated in Mandu?",
                options: [
                    "Kapur Talao & Munj Talao",
                    "Upper Lake & Lower Lake",
                    "Pichola & Fateh Sagar",
                    "Dal Lake & Nigeen Lake"
                ],
                answer: 0
            },
            {
                question: "Why is it named 'Jahaz Mahal'?",
                options: [
                    "It resembles a ship floating between two lakes",
                    "It was built inside a dry dock",
                    "It housed royal naval ships",
                    "It was designed by a ship captain"
                ],
                answer: 0
            }
        ],

        sources: [
            "Archaeological Survey of India",
            "UNESCO World Heritage Tentative List",
            "Madhya Pradesh Tourism Development Corporation"
        ]
    },


    // =========================================================
    // 05 — CHARMINAR
    // =========================================================
    {
        id: "charminar",
        name: "Charminar",
        city: "Hyderabad",
        region: "Old City",
        state: "Telangana",
        year: "Built 1591 CE",
        era: "16th Century",
        style: "Indo-Islamic · Qutb Shahi",
        architect: "Muhammad Quli Qutb Shah",
        coordinates: "17.3616° N, 78.4747° E",

        model: `${BASE_URL}models/Charminar/Charminar.glb`,

        heroImage:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Charminar-Pride%20of%20Hyderabad.jpg?width=1600",

        tagline:
            "Four minarets, four great arches, and the historic heart of Hyderabad.",

        introduction:
            "Charminar is not simply an isolated monument. It forms the architectural and urban heart of Hyderabad's historic Old City.",

        history: {
            when:
                "Construction of Charminar was completed around 1591 CE during the reign of Muhammad Quli Qutb Shah.",

            where:
                "The monument stands at the historic centre of Hyderabad in Telangana, surrounded by the living streets and markets of the Old City.",

            who:
                "It was commissioned by Muhammad Quli Qutb Shah, the fifth ruler of the Qutb Shahi dynasty.",

            how:
                "The square monument combines four monumental arches with four tall minarets, upper prayer spaces, balconies and rich surface ornamentation.",

            why:
                "Traditional accounts connect Charminar with the foundation of Hyderabad and with thanksgiving after a plague. Historians distinguish these traditions from firmly established documentary evidence.",

            story:
                "Charminar became the organising centre of the historic city, with the surrounding road network and markets developing around its four-sided composition.",

            significance:
                "It remains one of the strongest architectural symbols of Hyderabad and an important example of Qutb Shahi urban and religious architecture."
        },

        architecture:
            "The square plan is organised around four monumental arches and four minarets. The upper level contains prayer spaces, while balconies, stucco details and ornamental bands enrich the structure.",

        environment:
            "Charminar should be experienced within a dense historic cityscape: narrow streets, market activity, pedestrian movement, heritage shops and the surrounding Old City fabric.",

        presentDay:
            "Charminar remains a living heritage landmark and continues to function as a major tourist destination and religious site at the centre of Hyderabad's Old City.",

        preservation:
            "Its location inside an active urban environment makes digital documentation especially valuable for recording the monument and explaining its relationship with the surrounding city.",

        visitorExperience:
            "Approach from the historic streets, enter the monument's visual axis, inspect the central arch and then move your viewpoint toward the four minarets and upper levels.",

        gallery: [
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Charminar-Pride%20of%20Hyderabad.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Charminar-Pride%20of%20Hyderabad.jpg?width=900",
                title: "Grand Elevation",
                description: "Charminar rising above the old city with all four 48.7-metre minarets and central grand arches visible."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Minaret_of_charminar_12032012.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Minaret_of_charminar_12032012.jpg?width=900",
                title: "Balcony & Minaret Carving",
                description: "Close-up of the delicate stucco ornamentation, petal mouldings, and balustraded balconies."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Interior%20of%20the%20Charminar,%20Hyderabad%2018.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Interior%20of%20the%20Charminar,%20Hyderabad%2018.jpg?width=900",
                title: "Upper Mosque Gallery",
                description: "Inside the upper western prayer hall, showing the vaulted ceilings and historic gallery."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Charminar_Hyderabad_1.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Charminar_Hyderabad_1.jpg?width=900",
                title: "Historic Old City Context",
                description: "The landmark monument surrounded by the vibrant bazaars and historic streets of Hyderabad."
            }
        ],

        hotspots: [
            {
                title: "Four Minarets",
                description: "The four soaring minarets define the silhouette of Charminar and give the monument its name.",
                anchor: [0.73, 0.78, 0.08]
            },
            {
                title: "Central Arch",
                description: "The monumental arch forms the visual centre of the structure and its principal opening.",
                anchor: [0.00, 0.43, 0.95]
            },
            {
                title: "Upper Prayer Space",
                description: "The upper level contains prayer spaces reached through internal circulation.",
                anchor: [0.00, 0.76, 0.05]
            },
            {
                title: "Decorative Surface",
                description: "Stucco ornament and repeated architectural detailing enrich the surface of the monument.",
                anchor: [-0.53, 0.53, 0.74]
            }
        ],

        tour: [
            { title: "Historic City Approach", hotspot: 0 },
            { title: "Central Arch", hotspot: 1 },
            { title: "Upper Level", hotspot: 2 },
            { title: "Four Minarets", hotspot: 0 }
        ],

        quiz: [
            {
                question: "In which year was Charminar built?",
                options: ["1491", "1591", "1691", "1791"],
                answer: 1
            },
            {
                question: "How many major minarets does Charminar have?",
                options: ["Two", "Three", "Four", "Six"],
                answer: 2
            }
        ],

        sources: [
            "Government of Telangana",
            "Telangana Tourism",
            "Archaeological Survey of India references",
            "Wikimedia Commons image sources"
        ]
    },


    // =========================================================
    // 06 — GATEWAY OF INDIA
    // =========================================================
    {
        id: "gateway-of-india",
        name: "Gateway of India",
        city: "Mumbai",
        region: "Apollo Bunder · Colaba",
        state: "Maharashtra",
        year: "Completed 1924",
        era: "20th Century",
        style: "Indo-Saracenic",
        architect: "George Wittet",
        coordinates: "18.9220° N, 72.8347° E",

        model: `${BASE_URL}models/GatewayOfIndia/GatewayofIndia.glb`,

        heroImage:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mumbai%2003-2016%2030%20Gateway%20of%20India.jpg?width=1600",

        tagline:
            "A monumental waterfront arch whose story is inseparable from Mumbai Harbour.",

        introduction:
            "The Gateway of India is best understood through its waterfront setting, where the monument, harbour and public plaza form one continuous experience.",

        history: {
            when:
                "The foundation stone was laid in 1913 and the monument was completed in 1924.",

            where:
                "It stands at Apollo Bunder in South Mumbai overlooking Mumbai Harbour and the Arabian Sea.",

            who:
                "The monument was designed by architect George Wittet.",

            how:
                "The structure uses basalt and an Indo-Saracenic vocabulary with a monumental central arch, dome and corner turret forms.",

            why:
                "It was commissioned to commemorate the 1911 visit of King George V and Queen Mary to India.",

            story:
                "The monument's historical symbolism changed dramatically after independence when the last British troops leaving India passed through the gateway in 1948.",

            significance:
                "The Gateway became one of Mumbai's most recognizable public monuments and remains closely associated with tourism and the city's waterfront identity."
        },

        architecture:
            "The monument is a large basalt arch with a central dome and four corner turret forms. Its composition blends Indian, Islamic and Western architectural influences.",

        environment:
            "The real site is inseparable from the Arabian Sea, Mumbai Harbour, Apollo Bunder, ferries, pedestrians and the surrounding coastal skyline.",

        presentDay:
            "The Gateway remains one of Mumbai's most visited public landmarks and continues to function as an important gathering point and tourism destination.",

        preservation:
            "A digital reconstruction allows the monument and its changing waterfront context to be studied and interpreted remotely.",

        visitorExperience:
            "Begin at the harbour, approach the central façade, examine the arch and dome, then turn outward toward the sea and surrounding skyline.",

        gallery: [
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Mumbai%2003-2016%2030%20Gateway%20of%20India.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Mumbai%2003-2016%2030%20Gateway%20of%20India.jpg?width=900",
                title: "Apollo Bunder Waterfront",
                description: "The Gateway on Mumbai's waterfront overlooking the Arabian Sea and harbor ferries."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Arch-monument%20-%20Gate%20Way%20of%20India.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Arch-monument%20-%20Gate%20Way%20of%20India.jpg?width=900",
                title: "Basalt Triumphal Arch",
                description: "Full frontal view of the yellow basalt triumphal arch with 16th-century Gujarati architectural motifs."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Gateway%20of%20India%20dome%20inside%20view.JPG?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Gateway%20of%20India%20dome%20inside%20view.JPG?width=900",
                title: "Central Dome Vaulting",
                description: "Looking up into the 15-metre central dome adorned with intricate perforated stone jali work."
            }
        ],

        hotspots: [
            {
                title: "Central Arch",
                description: "The large central opening dominates the façade and defines the monument's identity.",
                anchor: [0.00, 0.40, 0.95]
            },
            {
                title: "Central Dome",
                description: "The dome crowns the monument and strengthens its Indo-Saracenic character.",
                anchor: [0.00, 0.79, 0.02]
            },
            {
                title: "Corner Turrets",
                description: "The turret forms strengthen the four corners and frame the central composition.",
                anchor: [0.69, 0.72, 0.08]
            },
            {
                title: "Waterfront",
                description: "The relationship with the sea and harbour is essential to understanding the monument.",
                anchor: [0.00, 0.08, -1.00]
            }
        ],

        tour: [
            { title: "Waterfront Arrival", hotspot: 3 },
            { title: "Central Arch", hotspot: 0 },
            { title: "Central Dome", hotspot: 1 },
            { title: "Turret Detail", hotspot: 2 }
        ],

        quiz: [
            {
                question: "When was the Gateway of India completed?",
                options: ["1901", "1911", "1924", "1947"],
                answer: 2
            },
            {
                question: "Which material is strongly associated with the monument?",
                options: ["Basalt", "Wood", "Marble", "Concrete"],
                answer: 0
            }
        ],

        sources: [
            "Mumbai City District Administration",
            "Maharashtra Tourism",
            "Government tourism references",
            "Wikimedia Commons image sources"
        ]
    },


    // =========================================================
    // 07 — LOTUS TEMPLE
    // =========================================================
    {
        id: "lotus-temple",
        name: "Lotus Temple",
        city: "New Delhi",
        region: "Kalkaji",
        state: "Delhi",
        year: "Completed 1986",
        era: "20th Century",
        style: "Expressionist · Bahá'í architecture",
        architect: "Fariborz Sahba",
        coordinates: "28.5535° N, 77.2588° E",

        model: `${BASE_URL}models/LotusTemple/Lotustemple.glb`,

        heroImage:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Lotus%20temple%20in%20Delhi,%20India.jpg?width=1600",

        tagline:
            "Twenty-seven marble petals unfold around a quiet hall open to people of every faith.",

        introduction:
            "The Lotus Temple transforms the familiar lotus form into a monumental place of worship surrounded by gardens and reflecting pools.",

        history: {
            when:
                "The Lotus Temple was completed in 1986.",

            where:
                "It is located in Kalkaji, South Delhi.",

            who:
                "The building was designed by Iranian-Canadian architect Fariborz Sahba.",

            how:
                "Twenty-seven marble-clad petal-like shells are organised in groups around a central hall.",

            why:
                "The lotus was selected as the primary architectural inspiration because of its strong cultural symbolism in India.",

            story:
                "As a Bahá'í House of Worship, the temple is designed as an open space where people of all faiths can pray, meditate or sit in silence.",

            significance:
                "The building is internationally recognised for combining modern structural engineering with an architectural form rooted in Indian symbolism."
        },

        architecture:
            "Twenty-seven marble-clad petals form the central expression of the building. The temple is surrounded by nine reflecting pools and formal gardens.",

        environment:
            "The site should feel open and quiet, with formal lawns, water pools, pedestrian approaches, gardens and carefully framed views toward the temple.",

        presentDay:
            "The Lotus Temple remains an active place of worship and a major visitor destination in Delhi.",

        preservation:
            "Digital representation provides an accessible way to study its unusual structure, landscape and cultural significance.",

        visitorExperience:
            "Approach through the gardens, cross the pedestrian paths, pass the reflecting pools and reveal the lotus structure from increasingly close viewpoints.",

        gallery: [
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Lotus%20temple%20in%20Delhi,%20India.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Lotus%20temple%20in%20Delhi,%20India.jpg?width=900",
                title: "Lotus Form & Nine Ponds",
                description: "The full lotus composition of 27 free-standing petals floating above nine surrounding ponds."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Lotus%20Temple%20in%20New%20Delhi%2003-2016.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Lotus%20Temple%20in%20New%20Delhi%2003-2016.jpg?width=900",
                title: "Penteli Marble Cladding",
                description: "Close view of the pure white Greek Pentelikon marble cladding curved into petals."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Lotus%20temple%20daytime.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Lotus%20temple%20daytime.jpg?width=900",
                title: "Gardens & Approaches",
                description: "Visitors approaching the serene sanctuary across geometric landscaped green lawns."
            }
        ],

        hotspots: [
            {
                title: "Lotus Petals",
                description: "The petal-shaped shells create the defining visual identity of the temple.",
                anchor: [0.00, 0.75, 0.08]
            },
            {
                title: "Main Entrance",
                description: "The main visitor approach is integrated into the surrounding gardens.",
                anchor: [0.00, 0.22, 0.92]
            },
            {
                title: "Central Hall",
                description: "The central hall sits within the surrounding petal structure.",
                anchor: [0.00, 0.48, 0.00]
            },
            {
                title: "Reflecting Pools",
                description: "The surrounding pools visually frame the building and reinforce the lotus metaphor.",
                anchor: [0.73, 0.08, 0.72]
            },
            {
                title: "Landscape",
                description: "Formal gardens, paths and lawns are an essential part of the visitor experience.",
                anchor: [-0.82, 0.08, -0.65]
            }
        ],

        tour: [
            { title: "Garden Approach", hotspot: 4 },
            { title: "Reflecting Pools", hotspot: 3 },
            { title: "Main Entrance", hotspot: 1 },
            { title: "Lotus Petals", hotspot: 0 },
            { title: "Central Hall", hotspot: 2 }
        ],

        quiz: [
            {
                question: "When was the Lotus Temple completed?",
                options: ["1965", "1975", "1986", "1996"],
                answer: 2
            },
            {
                question: "What inspired the building's main form?",
                options: ["Lotus flower", "Minaret", "Fort", "Chariot"],
                answer: 0
            }
        ],

        sources: [
            "Delhi Tourism",
            "Bahá'í reference material",
            "Wikimedia Commons image sources"
        ]
    },


    // =========================================================
    // 08 — QUTUB MINAR
    // =========================================================
    {
        id: "qutub-minar",
        name: "Qutub Minar",
        city: "New Delhi",
        region: "Mehrauli",
        state: "Delhi",
        year: "Begun 1192–93 CE",
        era: "Medieval India",
        style: "Early Indo-Islamic",
        architect: "Qutb-ud-din Aibak · Iltutmish",
        coordinates: "28.5245° N, 77.1855° E",

        model: `${BASE_URL}models/QutubMinar/Qutubminar.glb`,

        heroImage:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Qutub%20Minar,%20Delhi,%20India.jpg?width=1600",

        tagline:
            "A monumental 72.5-metre tower rising above one of Delhi's richest archaeological landscapes.",

        introduction:
            "The Qutub Minar is best understood as the centrepiece of a much larger archaeological complex containing monuments from several periods.",

        history: {
            when:
                "Construction began around 1192–93 CE.",

            where:
                "The tower stands at Mehrauli in New Delhi within the Qutb archaeological complex.",

            who:
                "Qutb-ud-din Aibak began the tower and later rulers, especially Iltutmish, continued and expanded it.",

            how:
                "The tapering tower rises through five principal storeys marked by projecting balconies, carved bands and strongly articulated surfaces.",

            why:
                "The tower is associated with the early establishment of Muslim rule in Delhi and with the neighbouring Quwwat-ul-Islam mosque.",

            story:
                "The surrounding complex contains reused architectural fragments, later additions and monuments from successive periods, making the site a visible record of Delhi's layered history.",

            significance:
                "The Qutb complex is a major UNESCO World Heritage property and an important surviving example of early Indo-Islamic architecture."
        },

        architecture:
            "The tower is 72.5 metres high and uses red and buff sandstone, fluting, projecting balconies and carved inscriptional bands to create a strong vertical rhythm.",

        environment:
            "The authentic setting is an archaeological park with lawns, trees, stone paths, historic ruins, mosque remains and other monuments.",

        presentDay:
            "The Qutb Minar complex remains one of Delhi's major heritage destinations and is protected and maintained as an archaeological site.",

        preservation:
            "Digital reconstruction can represent both the tower and the wider archaeological landscape that gives the monument its context.",

        visitorExperience:
            "Begin in the archaeological park, approach the tower from a low angle, inspect its surface detailing and then explore the surrounding monuments.",

        gallery: [
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Qutub%20Minar,%20Delhi,%20India.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Qutub%20Minar,%20Delhi,%20India.jpg?width=900",
                title: "Five-Storey Tapering Minaret",
                description: "The 72.5-metre tapering victory tower rising dramatically above the Mehrauli complex."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Qutb%20Minar%20Tower.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Qutb%20Minar%20Tower.jpg?width=900",
                title: "Fluted Sandstone Bands",
                description: "Alternating semicircular and angular flutings carved with calligraphic bands and brackets."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Carved%20Pillars%20Qutab%20Minar.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Carved%20Pillars%20Qutab%20Minar.jpg?width=900",
                title: "Complex Cloister Pillars",
                description: "Intricately sculpted stone pillars in the surrounding cloisters of the archaeological enclosure."
            }
        ],

        hotspots: [
            {
                title: "Tower Base",
                description: "The broad base establishes the monument's scale and vertical rise.",
                anchor: [0.00, 0.14, 0.90]
            },
            {
                title: "Fluted Shaft",
                description: "Alternating profiles give the shaft much of its distinctive visual texture.",
                anchor: [0.00, 0.43, 0.67]
            },
            {
                title: "Inscriptional Bands",
                description: "Carved bands divide and enrich the sandstone surface.",
                anchor: [0.00, 0.61, 0.54]
            },
            {
                title: "Projecting Balcony",
                description: "Projecting balconies create strong horizontal divisions between the storeys.",
                anchor: [0.48, 0.72, 0.16]
            },
            {
                title: "Archaeological Context",
                description: "The surrounding complex is essential to understanding the tower's historical significance.",
                anchor: [-0.72, 0.18, -0.58]
            }
        ],

        tour: [
            { title: "Archaeological Approach", hotspot: 4 },
            { title: "Tower Base", hotspot: 0 },
            { title: "Fluted Shaft", hotspot: 1 },
            { title: "Decorative Bands", hotspot: 2 },
            { title: "Balcony", hotspot: 3 }
        ],

        quiz: [
            {
                question: "What is the height of Qutub Minar?",
                options: [
                    "52.5 metres",
                    "62.5 metres",
                    "72.5 metres",
                    "82.5 metres"
                ],
                answer: 2
            },
            {
                question: "Which material is strongly associated with the tower?",
                options: [
                    "Red sandstone",
                    "Wood",
                    "Glass",
                    "Concrete"
                ],
                answer: 0
            }
        ],

        sources: [
            "UNESCO World Heritage Centre",
            "Archaeological Survey of India",
            "Ministry of Culture, Government of India",
            "Wikimedia Commons image sources"
        ]
    },


    // =========================================================
    // 09 — SANCHI STUPA
    // =========================================================
    {
        id: "sanchi-stupa",
        name: "Sanchi Stupa",
        city: "Sanchi",
        region: "Raisen District",
        state: "Madhya Pradesh",
        year: "Commissioned c. 250 BCE",
        era: "Ancient India",
        style: "Buddhist Stupa Architecture",
        architect: "Associated with Emperor Ashoka and later dynasties",
        coordinates: "23.4794° N, 77.7398° E",
        isMP: true,
        isIndore: false,

        model: `${BASE_URL}models/SanchiStupa/SanchiStupa.glb`,

        heroImage:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Great%20Sanchi%20Stupa.jpg?width=1600",

        tagline:
            "Nearly 2,300 years of Buddhist architectural history preserved on a quiet hilltop in Madhya Pradesh.",

        introduction:
            "Sanchi is not a single structure but an archaeological landscape containing stupas, gateways, railings, temples and monastic remains developed over many centuries.",

        history: {
            when:
                "The earliest phase is associated with the 3rd century BCE during the reign of Emperor Ashoka.",

            where:
                "The monuments stand on a hilltop at Sanchi in Madhya Pradesh.",

            who:
                "The earliest monument is traditionally associated with Emperor Ashoka, while later generations expanded the complex.",

            how:
                "The Great Stupa was enlarged and transformed through stone facing, railings, circumambulatory paths, stairways, a harmika, chhatra and four decorated toranas.",

            why:
                "Sanchi developed as an important Buddhist sacred and commemorative centre.",

            story:
                "The site declined over the centuries and was later rediscovered and restored, becoming one of India's most important surviving Buddhist archaeological landscapes.",

            significance:
                "Sanchi preserves an exceptionally important record of Buddhist architecture and art and remains one of India's major heritage destinations."
        },

        architecture:
            "The Great Stupa combines a hemispherical dome, terrace, circumambulatory paths, stone railings, four toranas, harmika and chhatra.",

        environment:
            "The site should appear as a quiet hilltop archaeological landscape with natural vegetation, grass, stone paths, ruins and open views across the surrounding countryside.",

        presentDay:
            "Sanchi is a UNESCO World Heritage Site and remains an important archaeological and pilgrimage destination maintained by the Archaeological Survey of India.",

        preservation:
            "Sanchi demonstrates why heritage preservation needs to consider complete archaeological landscapes, not only individual buildings.",

        visitorExperience:
            "Approach across the hilltop, encounter a carved torana, move toward the Great Stupa and follow the circumambulatory path around it.",

        gallery: [
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Great%20Sanchi%20Stupa.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Great%20Sanchi%20Stupa.jpg?width=900",
                title: "Great Stupa & Torana Gateway",
                description: "The massive hemispherical 3rd-century BCE stone dome framed by an intricately carved Torana."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Stupa%201,%20Sanchi%2002.jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Stupa%201,%20Sanchi%2002.jpg?width=900",
                title: "Hilltop Sanctuary Vista",
                description: "A wide panorama of the great Buddhist reliquary monument on its sacred hilltop terrace."
            },
            {
                file: "https://commons.wikimedia.org/wiki/Special:FilePath/Great%20Sanchi%20Stupa%20(1).jpg?width=900",
                url: "https://commons.wikimedia.org/wiki/Special:FilePath/Great%20Sanchi%20Stupa%20(1).jpg?width=900",
                title: "Stone Railing (Vedika)",
                description: "Monolithic stone uprights and crossbars forming the ritual circumambulation balustrade."
            }
        ],

        hotspots: [
            {
                title: "Great Stupa",
                description: "The hemispherical dome forms the central architectural focus of Stupa 1.",
                anchor: [0.00, 0.65, 0.00]
            },
            {
                title: "Torana Gateway",
                description: "The four decorated gateways are among the most celebrated features of Sanchi.",
                anchor: [0.00, 0.30, 0.95]
            },
            {
                title: "Stone Railing",
                description: "The stone railing defines the sacred enclosure and circulation space.",
                anchor: [0.82, 0.25, 0.00]
            },
            {
                title: "Circumambulatory Path",
                description: "The path around the stupa is an important part of ritual and spatial organisation.",
                anchor: [-0.72, 0.22, 0.00]
            },
            {
                title: "Harmika & Chhatra",
                description: "These upper elements crown the stupa and complete its characteristic profile.",
                anchor: [0.00, 0.94, 0.00]
            }
        ],

        tour: [
            { title: "Hilltop Approach", hotspot: 3 },
            { title: "Torana Gateway", hotspot: 1 },
            { title: "Great Stupa", hotspot: 0 },
            { title: "Stone Railing", hotspot: 2 },
            { title: "Upper Elements", hotspot: 4 }
        ],

        quiz: [
            {
                question: "Sanchi is primarily associated with which tradition?",
                options: [
                    "Buddhism",
                    "Jainism",
                    "Islam",
                    "Sikhism"
                ],
                answer: 0
            },
            {
                question: "What are the decorated gateways called?",
                options: [
                    "Toranas",
                    "Minarets",
                    "Mandapas",
                    "Pavilions"
                ],
                answer: 0
            }
        ],

        sources: [
            "UNESCO World Heritage Centre",
            "Archaeological Survey of India",
            "Wikimedia Commons image sources"
        ]
    }

];