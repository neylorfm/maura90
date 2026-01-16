import { SlideType, SlideData } from './types';

// Dynamically import all images from the img directory
const imageModules = import.meta.glob('../public/img/*.{png,jpg,jpeg,svg}', { eager: true });
const musicModules = import.meta.glob('./music/*.mp3', { eager: true });

// Extract URLs from modules
export const IMAGES: string[] = Object.values(imageModules).map((mod: any) => mod.default);
export const MUSIC_TRACKS: Record<string, string> = Object.fromEntries(
  Object.entries(musicModules).map(([path, mod]: [string, any]) => {
    const filename = path.split('/').pop() || path;
    return [filename, mod.default];
  })
);

// Helper to get random image
const getRandomImage = () => IMAGES[Math.floor(Math.random() * IMAGES.length)];

// Helper to get image at specific index (looping)
const getImage = (index: number) => IMAGES[index % IMAGES.length];

export const APP_DATA: SlideData[] = [
  {
    "id": "intro",
    type: SlideType.COVER,
    "name": "Maura Magalhães",
    "years": "1936 — 2026",
    "subtitle": "90 Anos",
    "tagline": "Uma jornada de amor, luta e sabedoria."
  },
  {
    "id": "showcase-0",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Maura",
    "year": "90 anos",
    "location": "Celebrando a Vida",
    "image": "/img/30.jpg",
    "description": "Cada imagem conta uma história de alegria e superação.",
    "position": "70% 100%",
    "scale": 160
  },
  {
    "id": "timeline-1",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "",
    "year": "com as irmãs Ana e Zús",
    "location": "Goiânia",
    "image": "/img/8.jpeg",
    "description": "",
    "position": "40% 50%"
  },
  {
    "id": "collage-2",
    type: SlideType.COLLAGE,
    "title": "Fragmentos de Felicidade",
    "subtitle": "Sorrisos que iluminam",
    "images": [
      {
        "src": "/img/4.jpeg",
        "label": "Momento Especial",
        "sublabel": "Inesquecível",
        "rotation": -2,
        "scale": 210,
        "position": "30% 30%"
      },
      {
        "src": "/img/1.jpeg",
        "label": "Alegria",
        "sublabel": "Eterna",
        "highlight": true,
        "rotation": 2,
        "position": "50% 5%",
        "scale": 110
      },
      {
        "src": "/img/39.jpg",
        "label": "Amor",
        "sublabel": "Família",
        "rotation": -1
      }
    ],
    "stats": [
      {
        "label": "Capítulo",
        "value": "3"
      },
      {
        "label": "Ano",
        "value": "2026"
      }
    ]
  },
  {
    "id": "timeline-3",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Irmãs",
    "year": "",
    "location": "",
    "image": "/img/7.jpeg",
    "description": "",
    "position": "50% 50%"
  },
  {
    "id": "timeline-4",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Família",
    "year": "",
    "location": "Mãe Etelvina e queridas irmãs",
    "image": "/img/2.jpeg",
    "description": "",
    "scale": 180,
    "position": "55% 30%"
  },
  {
    "id": "showcase-5",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Gerações",
    "year": "filho e bisneta",
    "location": "Mãe",
    "image": "/img/20.jpeg",
    "description": "",
    "position": "50% 40%"
  },
  {
    "id": "timeline-6",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Sobrinhos",
    "year": "",
    "location": "Com os sobrinhos Nete, Fábio, Imelde e Claudia",
    "image": "/img/33.jpeg",
    "description": "",
    "scale": 100,
    "position": "55% 50%"
  },
  {
    "id": "collage-7",
    type: SlideType.COLLAGE,
    "title": "Fragmentos de Felicidade",
    "subtitle": "Sorrisos que iluminam",
    "images": [
      {
        "src": "/img/16.jpeg",
        "label": "Momento Especial",
        "sublabel": "Inesquecível",
        "rotation": -2
      },
      {
        "src": "/img/13.jpeg",
        "label": "Elton e Naira",
        "sublabel": "Netos",
        "highlight": true,
        "rotation": 2,
        "position": "50% 20%"
      },
      {
        "src": "/img/14.jpeg",
        "label": "Amor",
        "sublabel": "Família",
        "rotation": -1,
        "position": "90% 50%"
      }
    ],
    "stats": [
      {
        "label": "Capítulo",
        "value": "8"
      },
      {
        "label": "Ano",
        "value": "2026"
      }
    ]
  },
  {
    "id": "timeline-8",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Amizades",
    "year": "",
    "location": "",
    "image": "/img/17.jpeg",
    "description": ""
  },
  {
    "id": "timeline-9",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Sempre Presente",
    "year": "o seu amor e apoio sempre estiveram lá.",
    "location": "Em cada passo importante das nossas vidas",
    "image": "/img/31.jpeg",
    "description": "",
    "position": "45% 50%"
  },
  {
    "id": "showcase-10",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Missão",
    "year": "Memórias",
    "location": "Celebrando a Vida",
    "image": "/img/19.jpeg",
    "description": "Com Fé"
  },
  {
    "id": "timeline-11",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Celebrando",
    "year": "Helena e Diana",
    "location": "Com as amigas",
    "image": "/img/12.jpeg",
    "description": "",
    "position": "100% 50%",
    "scale": 130
  },
  {
    "id": "collage-12",
    type: SlideType.COLLAGE,
    "title": "Fragmentos de Felicidade",
    "subtitle": "Sorrisos que iluminam",
    "images": [
      {
        "src": "/img/10.jpeg",
        "label": "Momento Especial",
        "sublabel": "Inesquecível",
        "rotation": -2,
        "position": "65% 50%"
      },
      {
        "src": "/img/6.jpeg",
        "label": "Praias do Ceará",
        "sublabel": "Com a irmã e sobrinhos",
        "highlight": true,
        "rotation": 2,
        "scale": 150,
        "position": "60% 50%"
      },
      {
        "src": "/img/5.jpeg",
        "label": "Amor",
        "sublabel": "Família",
        "rotation": -1
      }
    ],
    "stats": [
      {
        "label": "Capítulo",
        "value": "13"
      },
      {
        "label": "Ano",
        "value": "2026"
      }
    ]
  },
  {
    "id": "timeline-13",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Em Juazeiro/CE",
    "year": "e bisnetas",
    "location": "Com o filho",
    "image": "/img/21.jpeg",
    "description": ""
  },
  {
    "id": "timeline-14",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Graças a você, nós somos.",
    "year": "A origem de todas essas vidas.",
    "location": "",
    "image": "/img/22.jpeg",
    "description": "",
    "scale": 120,
    "position": "60% 30%"
  },
  {
    "id": "showcase-15",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Quintinho Cunha",
    "year": "Memórias",
    "location": "Brincando com os bisnetos",
    "image": "/img/23.jpeg",
    "description": ""
  },
  {
    "id": "timeline-16",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "São Luiz/MA",
    "year": "Jader Jr.",
    "location": "Aniversário do bisneto",
    "image": "/img/24.jpeg",
    "description": ""
  },
  {
    "id": "collage-17",
    type: SlideType.COLLAGE,
    "title": "Fragmentos de Felicidade",
    "subtitle": "Sorrisos que iluminam",
    "images": [
      {
        "src": "/img/38.jpeg",
        "label": "Momento Especial",
        "sublabel": "Inesquecível",
        "rotation": -2
      },
      {
        "src": "/img/26.jpeg",
        "label": "Batizado do bisneto Jader Jr.",
        "sublabel": "no Quintino Cunha",
        "highlight": true,
        "rotation": 2
      },
      {
        "src": "/img/42.jpeg",
        "label": "Amor",
        "sublabel": "Família",
        "rotation": -1
      }
    ],
    "stats": [
      {
        "label": "Capítulo",
        "value": "18"
      },
      {
        "label": "Ano",
        "value": "2026"
      }
    ]
  },
  {
    "id": "timeline-18",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "São Luiz/MA",
    "year": "Jader Jr.",
    "location": "Aniversário do bisneto",
    "image": "/img/27.jpeg",
    "description": "",
    "scale": 110,
    "position": "85% 15%"
  },
  {
    "id": "timeline-19",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Em Goiânia",
    "year": "",
    "location": "Comemorando o aniversário",
    "image": "/img/9.jpeg",
    "description": ""
  },
  {
    "id": "showcase-20",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Momentos Eternos",
    "year": "Memórias",
    "location": "Celebrando a Vida",
    "image": "/img/18.jpeg",
    "description": "",
    "scale": 110,
    "position": "0% 95%"
  },
  {
    "id": "timeline-21",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "",
    "year": "",
    "location": "",
    "image": "/img/29.jpeg",
    "description": "",
    "scale": 190,
    "position": "50% 55%"
  },
  {
    "id": "collage-22",
    type: SlideType.COLLAGE,
    "title": "Fragmentos de Felicidade",
    "subtitle": "Sorrisos que iluminam",
    "images": [
      {
        "src": "/img/3.jpeg",
        "label": "Momento Especial",
        "sublabel": "Inesquecível",
        "rotation": -2,
        "position": "30% 50%"
      },
      {
        "src": "/img/43.jpeg",
        "label": "Em Beberibe/CE",
        "sublabel": "Com a sobrinha Fátima",
        "highlight": true,
        "rotation": 2
      },
      {
        "src": "/img/25.jpg",
        "label": "Amor",
        "sublabel": "Família",
        "rotation": -1,
        "position": "70% 50%"
      }
    ],
    "stats": [
      {
        "label": "Capítulo",
        "value": "23"
      },
      {
        "label": "Ano",
        "value": "2026"
      }
    ]
  },
  {
    "id": "timeline-23",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "",
    "year": "",
    "location": "",
    "image": "/img/11.jpeg",
    "description": "",
    "position": "50% 5%",
    "scale": 110
  },
  {
    "id": "timeline-24",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "",
    "year": "Carolina",
    "location": "Com a bisneta",
    "image": "/img/36.jpeg",
    "description": "",
    "scale": 100,
    "position": "80% 70%"
  },
  {
    "id": "timeline-26",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "",
    "year": "",
    "location": "",
    "image": "/img/32.jpeg",
    "description": ""
  },
  {
    "id": "collage-27",
    type: SlideType.COLLAGE,
    "title": "Fragmentos de Felicidade",
    "subtitle": "Sorrisos que iluminam",
    "images": [
      {
        "src": "/img/45.jpeg",
        "label": "Momento Especial",
        "sublabel": "Inesquecível",
        "rotation": -2,
        "scale": 170,
        "position": "50% 15%"
      },
      {
        "src": "/img/34.jpeg",
        "label": "Essência",
        "sublabel": "ÚNICA",
        "highlight": true,
        "rotation": 2,
        "position": "50% 35%"
      },
      {
        "src": "/img/46.jpeg",
        "label": "Amor",
        "sublabel": "Família",
        "rotation": -1
      }
    ],
    "stats": [
      {
        "label": "Capítulo",
        "value": "28"
      },
      {
        "label": "Ano",
        "value": "2026"
      }
    ]
  },
  {
    "id": "timeline-29",
    type: SlideType.PHOTO_SHOWCASE,
    "decade": "Feliz",
    "year": "",
    "location": "Obrigada",
    "image": "/img/28.jpeg",
    "description": "",
    "scale": 150,
    "position": "60% 90%"
  },
  {
    "id": "multi-34",
    type: SlideType.MULTI_PHOTO,
    "title": "MAIS MOMENTOS FELIZES",
    "subtitle": "Celebrando cada sorriso.",
    "images": [
      {
        "src": "/img/30.jpg"
      },
      {
        "src": "/img/8.jpeg"
      },
      {
        "src": "/img/4.jpeg"
      },
      {
        "src": "/img/1.jpeg"
      },
      {
        "src": "/img/39.png"
      },
      {
        "src": "/img/7.jpeg"
      },
      {
        "src": "/img/2.jpeg"
      },
      {
        "src": "/img/20.jpeg"
      },
      {
        "src": "/img/33.jpeg"
      },
      {
        "src": "/img/16.jpeg"
      },
      {
        "src": "/img/13.jpeg"
      },
      {
        "src": "/img/14.jpeg"
      },
      {
        "src": "/img/17.jpeg"
      },
      {
        "src": "/img/31.jpeg"
      },
      {
        "src": "/img/19.jpeg"
      },
      {
        "src": "/img/12.jpeg"
      },
      {
        "src": "/img/10.jpeg"
      },
      {
        "src": "/img/6.jpeg"
      },
      {
        "src": "/img/5.jpeg"
      },
      {
        "src": "/img/21.jpeg"
      },
      {
        "src": "/img/22.jpeg"
      },
      {
        "src": "/img/23.jpeg"
      },
      {
        "src": "/img/24.jpeg"
      },
      {
        "src": "/img/38.jpeg"
      },
      {
        "src": "/img/26.jpeg"
      },
      {
        "src": "/img/42.jpeg"
      },
      {
        "src": "/img/27.jpeg"
      },
      {
        "src": "/img/9.jpeg"
      },
      {
        "src": "/img/18.jpeg"
      },
      {
        "src": "/img/29.jpeg"
      },
      {
        "src": "/img/3.jpeg"
      },
      {
        "src": "/img/43.jpeg"
      },
      {
        "src": "/img/25.png"
      },
      {
        "src": "/img/11.jpeg"
      },
      {
        "src": "/img/36.jpeg"
      },
      {
        "src": "/img/32.jpeg"
      },
      {
        "src": "/img/45.jpeg"
      },
      {
        "src": "/img/34.jpeg"
      },
      {
        "src": "/img/46.jpeg"
      },
      {
        "src": "/img/28.jpeg"
      }
    ]
  },
  {
    "id": "quotes-family",
    type: SlideType.QUOTES,
    "title": "COM AMOR",
    "subtitle": "Família e Amigos",
    "centralImage": "/img/47.jpeg",
    "quotes": [
      {
        "relation": "FAMÍLIA",
        "author": "O Filho, Netos e Bisnetos",
        "text": "Sua vida é nossa maior inspiração. Te amamos!",
        "position": "top-left"
      },
      {
        "relation": "AMIGOS",
        "author": "Amigos Queridos",
        "text": "90 anos de uma vida extraordinária! Com todo o nosso amor e admiração.",
        "position": "bottom-right"
      }
    ],
    "floatingImages": [
      { "src": "/img/30.jpg", "x": 22.8, "y": 39.1, "size": 100, cyclic: true },
      { "src": "/img/8.jpeg", "x": 20, "y": 70, "size": 120 },
      { "src": "/img/4.jpeg", "x": 91.8, "y": 15.9, "size": 90 },
      { "src": "/img/39.png", "x": 87.4, "y": 41.5, "size": 110 },
      { "src": "/img/20.jpeg", "x": 50, "y": 50, "size": 150 },
      { "src": "/img/33.jpeg", "x": 15, "y": 40, "size": 80 },
      { "src": "/img/16.jpeg", "x": 66.8, "y": 0.0, "size": 130 },
      { "src": "/img/13.jpeg", "x": 43.8, "y": 53.6, "size": 100 },
      { "src": "/img/14.jpeg", "x": 61.6, "y": 29.4, "size": 115 },
      { "src": "/img/17.jpeg", "x": 40, "y": 85, "size": 95 },
      { "src": "/img/47.jpeg", "x": 28.5, "y": 43.8, "size": 200 },
      { "src": "/img/12.jpeg", "x": 75.7, "y": 1.2, "size": 200 },
      { "src": "/img/22.jpeg", "x": 49.8, "y": 1.4, "size": 200 }
    ]
  }
];