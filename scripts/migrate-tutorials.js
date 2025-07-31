const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Tutorial data with the new schema structure
const tutorialData = {
  overview: {
    title: {
      en: "Understanding Tarot Cards",
      es: "Entendiendo las Cartas del Tarot"
    },
    content: {
      en: {
        description: "Tarot cards are a powerful tool for divination, self-reflection, and spiritual guidance. A traditional tarot deck consists of 78 cards divided into two main categories: the Major Arcana and the Minor Arcana.",
        total_cards: 78,
        major_arcana_count: 22,
        minor_arcana_count: 56
      },
      es: {
        description: "Las cartas del tarot son una herramienta poderosa para la adivinación, la auto-reflexión y la guía espiritual. Un mazo tradicional de tarot consta de 78 cartas divididas en dos categorías principales: el Arcano Mayor y el Arcano Menor.",
        total_cards: 78,
        major_arcana_count: 22,
        minor_arcana_count: 56
      }
    }
  },
  major_arcana: {
    title: {
      en: "The Major Arcana",
      es: "El Arcano Mayor"
    },
    content: {
      en: {
        subtitle: "The Greater Mysteries",
        description: "The Major Arcana consists of 22 cards that represent significant life events, spiritual lessons, and archetypal energies. These cards carry the most weight in a reading and often indicate major turning points or profound spiritual insights.",
        characteristics: [
          "Represent major life themes and spiritual lessons",
          "Indicate significant turning points and transformations",
          "Carry more weight in readings than Minor Arcana",
          "Often represent archetypal energies and universal experiences",
          "Can indicate long-term influences and karmic patterns"
        ],
        numbering: "Cards are numbered 0-21, with The Fool as 0 and The World as 21",
        themes: [
          "Spiritual growth and enlightenment",
          "Life cycles and transformations",
          "Archetypal energies and universal experiences",
          "Karmic patterns and soul lessons",
          "Major life decisions and turning points"
        ]
      },
      es: {
        subtitle: "Los Misterios Mayores",
        description: "El Arcano Mayor consta de 22 cartas que representan eventos significativos de la vida, lecciones espirituales y energías arquetípicas. Estas cartas tienen el mayor peso en una lectura y a menudo indican puntos de inflexión importantes o insights espirituales profundos.",
        characteristics: [
          "Representan temas importantes de la vida y lecciones espirituales",
          "Indican puntos de inflexión y transformaciones significativas",
          "Tienen más peso en las lecturas que el Arcano Menor",
          "A menudo representan energías arquetípicas y experiencias universales",
          "Pueden indicar influencias a largo plazo y patrones kármicos"
        ],
        numbering: "Las cartas están numeradas 0-21, con El Loco como 0 y El Mundo como 21",
        themes: [
          "Crecimiento espiritual e iluminación",
          "Ciclos de vida y transformaciones",
          "Energías arquetípicas y experiencias universales",
          "Patrones kármicos y lecciones del alma",
          "Decisiones importantes de la vida y puntos de inflexión"
        ]
      }
    }
  },
  minor_arcana: {
    title: {
      en: "The Minor Arcana",
      es: "El Arcano Menor"
    },
    content: {
      en: {
        subtitle: "The Lesser Mysteries",
        description: "The Minor Arcana consists of 56 cards divided into four suits, each representing different aspects of daily life and human experience. These cards provide practical guidance and reflect the everyday situations we encounter.",
        characteristics: [
          "Represent daily life and practical matters",
          "Provide specific guidance for everyday situations",
          "Reflect immediate influences and short-term energies",
          "Offer practical advice and actionable insights",
          "Show the details and nuances of life circumstances"
        ],
        structure: {
          suits: 4,
          cards_per_suit: 14,
          number_cards: "Ace through 10 (10 cards per suit)",
          court_cards: "Page, Knight, Queen, King (4 cards per suit)"
        }
      },
      es: {
        subtitle: "Los Misterios Menores",
        description: "El Arcano Menor consta de 56 cartas divididas en cuatro palos, cada uno representando diferentes aspectos de la vida diaria y la experiencia humana. Estas cartas proporcionan orientación práctica y reflejan las situaciones cotidianas que encontramos.",
        characteristics: [
          "Representan la vida diaria y asuntos prácticos",
          "Proporcionan orientación específica para situaciones cotidianas",
          "Reflejan influencias inmediatas y energías a corto plazo",
          "Ofrecen consejos prácticos e insights accionables",
          "Muestran los detalles y matices de las circunstancias de la vida"
        ],
        structure: {
          suits: 4,
          cards_per_suit: 14,
          number_cards: "As hasta 10 (10 cartas por palo)",
          court_cards: "Paje, Caballero, Reina, Rey (4 cartas por palo)"
        }
      }
    }
  },
  suits: {
    title: {
      en: "The Four Suits",
      es: "Los Cuatro Palos"
    },
    content: {
      en: {
        description: "Each suit represents different aspects of life and human experience.",
        wands: {
          name: "Wands",
          element: "Fire",
          description: "Wands represent creativity, passion, energy, and spiritual growth. They are associated with inspiration, ambition, and the spark of new ideas.",
          keywords: ["creativity", "passion", "energy", "inspiration", "ambition", "spiritual growth", "action", "enthusiasm"],
          life_areas: [
            "Career and professional development",
            "Creative projects and artistic endeavors",
            "Spiritual growth and personal development",
            "Passion and romantic relationships",
            "New ventures and opportunities"
          ],
          personality_traits: [
            "Energetic and enthusiastic",
            "Creative and innovative",
            "Passionate and driven",
            "Spontaneous and adventurous",
            "Optimistic and inspiring"
          ]
        },
        cups: {
          name: "Cups",
          element: "Water",
          description: "Cups represent emotions, relationships, intuition, and matters of the heart. They are associated with love, compassion, and emotional fulfillment.",
          keywords: ["emotions", "relationships", "intuition", "love", "compassion", "creativity", "spirituality", "healing"],
          life_areas: [
            "Romantic relationships and love",
            "Emotional well-being and healing",
            "Intuition and psychic abilities",
            "Family and close friendships",
            "Creative expression and artistic pursuits"
          ],
          personality_traits: [
            "Emotional and sensitive",
            "Intuitive and empathetic",
            "Romantic and idealistic",
            "Creative and artistic",
            "Compassionate and caring"
          ]
        },
        swords: {
          name: "Swords",
          element: "Air",
          description: "Swords represent intellect, communication, challenges, and mental clarity. They are associated with thoughts, decisions, and the power of the mind.",
          keywords: ["intellect", "communication", "challenges", "mental clarity", "truth", "justice", "conflict", "transformation"],
          life_areas: [
            "Intellectual pursuits and education",
            "Communication and self-expression",
            "Decision-making and problem-solving",
            "Legal matters and justice",
            "Mental health and clarity"
          ],
          personality_traits: [
            "Intellectual and analytical",
            "Direct and honest",
            "Strategic and logical",
            "Truth-seeking and just",
            "Mental and communicative"
          ]
        },
        pentacles: {
          name: "Pentacles",
          element: "Earth",
          description: "Pentacles represent material wealth, practical matters, health, and physical manifestation. They are associated with abundance, security, and tangible results.",
          keywords: ["wealth", "practicality", "health", "abundance", "security", "material success", "stability", "manifestation"],
          life_areas: [
            "Financial matters and wealth",
            "Career and professional success",
            "Health and physical well-being",
            "Home and family life",
            "Material goals and achievements"
          ],
          personality_traits: [
            "Practical and grounded",
            "Reliable and responsible",
            "Ambitious and hardworking",
            "Generous and abundant",
            "Stable and secure"
          ]
        }
      },
      es: {
        description: "Cada palo representa diferentes aspectos de la vida y la experiencia humana.",
        wands: {
          name: "Bastos",
          element: "Fuego",
          description: "Los Bastos representan creatividad, pasión, energía y crecimiento espiritual. Están asociados con la inspiración, la ambición y la chispa de nuevas ideas.",
          keywords: ["creatividad", "pasión", "energía", "inspiración", "ambición", "crecimiento espiritual", "acción", "entusiasmo"],
          life_areas: [
            "Carrera y desarrollo profesional",
            "Proyectos creativos y esfuerzos artísticos",
            "Crecimiento espiritual y desarrollo personal",
            "Pasión y relaciones románticas",
            "Nuevas empresas y oportunidades"
          ],
          personality_traits: [
            "Energético y entusiasta",
            "Creativo e innovador",
            "Apasionado y motivado",
            "Espontáneo y aventurero",
            "Optimista e inspirador"
          ]
        },
        cups: {
          name: "Copas",
          element: "Agua",
          description: "Las Copas representan emociones, relaciones, intuición y asuntos del corazón. Están asociadas con el amor, la compasión y la realización emocional.",
          keywords: ["emociones", "relaciones", "intuición", "amor", "compasión", "creatividad", "espiritualidad", "sanación"],
          life_areas: [
            "Relaciones románticas y amor",
            "Bienestar emocional y sanación",
            "Intuición y habilidades psíquicas",
            "Familia y amistades cercanas",
            "Expresión creativa y esfuerzos artísticos"
          ],
          personality_traits: [
            "Emocional y sensible",
            "Intuitivo y empático",
            "Romántico e idealista",
            "Creativo y artístico",
            "Compasivo y cariñoso"
          ]
        },
        swords: {
          name: "Espadas",
          element: "Aire",
          description: "Las Espadas representan intelecto, comunicación, desafíos y claridad mental. Están asociadas con pensamientos, decisiones y el poder de la mente.",
          keywords: ["intelecto", "comunicación", "desafíos", "claridad mental", "verdad", "justicia", "conflicto", "transformación"],
          life_areas: [
            "Pursuits intelectuales y educación",
            "Comunicación y auto-expresión",
            "Toma de decisiones y resolución de problemas",
            "Asuntos legales y justicia",
            "Salud mental y claridad"
          ],
          personality_traits: [
            "Intelectual y analítico",
            "Directo y honesto",
            "Estratégico y lógico",
            "Buscador de verdad y justo",
            "Mental y comunicativo"
          ]
        },
        pentacles: {
          name: "Oros",
          element: "Tierra",
          description: "Los Oros representan riqueza material, asuntos prácticos, salud y manifestación física. Están asociados con abundancia, seguridad y resultados tangibles.",
          keywords: ["riqueza", "practicidad", "salud", "abundancia", "seguridad", "éxito material", "estabilidad", "manifestación"],
          life_areas: [
            "Asuntos financieros y riqueza",
            "Carrera y éxito profesional",
            "Salud y bienestar físico",
            "Hogar y vida familiar",
            "Metas materiales y logros"
          ],
          personality_traits: [
            "Práctico y fundamentado",
            "Confiable y responsable",
            "Ambicioso y trabajador",
            "Generoso y abundante",
            "Estable y seguro"
          ]
        }
      }
    }
  }
};

async function insertTutorials() {
  try {
    console.log('🚀 Starting tutorial migration...\n');
    
    // Clear existing tutorials
    const { error: deleteError } = await supabase
      .from('tutorials')
      .delete()
      .neq('id', 0);
    
    if (deleteError) {
      console.error('Error clearing existing tutorials:', deleteError);
      throw deleteError;
    }
    
    console.log('Cleared existing tutorials');
    
    // Transform and insert tutorial data
    const tutorialSections = Object.entries(tutorialData).map(([key, data], index) => ({
      section_key: key,
      title: data.title,
      content: data.content,
      order_index: index,
      is_active: true
    }));
    
    const { data, error } = await supabase
      .from('tutorials')
      .insert(tutorialSections)
      .select();
    
    if (error) {
      console.error('Error inserting tutorials:', error);
      throw error;
    }
    
    console.log(`✅ Successfully inserted ${data.length} tutorial sections`);
    
    console.log('\n📋 Tutorial sections:');
    data.forEach(section => {
      console.log(`  - ${section.title.en} (${section.section_key})`);
    });
    
    console.log('\n💡 Next steps:');
    console.log('  - Update your frontend to use the new schema');
    console.log('  - Implement language switching functionality');
    console.log('  - Add more tutorial content as needed');
    
  } catch (error) {
    console.error('\n❌ Tutorial migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  insertTutorials();
}

module.exports = { insertTutorials }; 