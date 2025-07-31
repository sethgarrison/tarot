const fs = require('fs');
const path = require('path');

// Function to convert JSON data to CSV format
function jsonToCSV(cards) {
  // CSV headers
  const headers = [
    'name_short',
    'name',
    'type',
    'value',
    'value_int',
    'suit',
    'meaning_up',
    'meaning_rev',
    'description',
    'image_path'
  ];

  // Convert cards to CSV rows
  const rows = cards.map(card => {
    return [
      card.name_short,
      JSON.stringify(card.name), // JSONB format
      card.type,
      JSON.stringify(card.value), // JSONB format
      card.value_int,
      card.suit ? JSON.stringify(card.suit) : '', // JSONB format or empty
      JSON.stringify(card.meaning_up), // JSONB format
      JSON.stringify(card.meaning_rev), // JSONB format
      JSON.stringify(card.description), // JSONB format
      card.image_path
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => {
      // Properly escape JSON content for CSV
      const escapedField = field.toString().replace(/"/g, '""');
      return `"${escapedField}"`;
    }).join(','))
    .join('\n');

  return csvContent;
}

// Function to transform API-style card data to our schema
function transformCardData(apiCard) {
  return {
    name_short: apiCard.name_short,
    name: {
      en: apiCard.name,
      es: null // Will be filled in later with translations
    },
    type: apiCard.type,
    value: {
      en: apiCard.value,
      es: null
    },
    value_int: apiCard.value_int,
    suit: apiCard.suit ? {
      en: apiCard.suit,
      es: getSuitTranslation(apiCard.suit)
    } : null,
    meaning_up: {
      en: apiCard.meaning_up,
      es: null
    },
    meaning_rev: {
      en: apiCard.meaning_rev,
      es: null
    },
    description: {
      en: apiCard.desc,
      es: null
    },
    image_path: `/tarot-images/${apiCard.name.toLowerCase().replace(/\s+/g, '_')}.jpg`
  };
}

function getSuitTranslation(suit) {
  const suitTranslations = {
    'wands': 'bastos',
    'cups': 'copas',
    'swords': 'espadas',
    'pentacles': 'oros'
  };
  return suitTranslations[suit.toLowerCase()] || null;
}

// Function to create CSV from JSON file
function createCSVFromJSON(jsonFilePath, outputFilePath) {
  try {
    console.log(`Reading JSON file: ${jsonFilePath}`);
    
    // Read JSON file
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const cards = JSON.parse(jsonData);
    
    console.log(`Found ${cards.length} cards in JSON file`);
    
    // Transform the data
    const transformedCards = cards.map(transformCardData);
    
    // Convert to CSV
    const csvContent = jsonToCSV(transformedCards);
    
    // Write CSV file
    fs.writeFileSync(outputFilePath, csvContent);
    
    console.log(`✅ CSV file created: ${outputFilePath}`);
    console.log(`📊 Statistics:`);
    console.log(`  - Total cards: ${transformedCards.length}`);
    console.log(`  - Major Arcana: ${transformedCards.filter(c => c.type === 'major').length}`);
    console.log(`  - Minor Arcana: ${transformedCards.filter(c => c.type === 'minor').length}`);
    
    // Show sample cards
    console.log(`\n📋 Sample cards:`);
    transformedCards.slice(0, 3).forEach(card => {
      console.log(`  - ${card.name.en} (${card.type})`);
    });
    
    console.log(`\n💡 Next steps:`);
    console.log(`  1. Import the CSV file into your Supabase cards table`);
    console.log(`  2. Add Spanish translations to the cards`);
    console.log(`  3. Update your frontend to use the new schema`);
    
  } catch (error) {
    console.error('❌ Error creating CSV:', error);
    process.exit(1);
  }
}

// Function to create tutorial CSV
function createTutorialCSV(outputFilePath) {
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

  try {
    console.log('Creating tutorial CSV...');
    
    // Transform tutorial data to CSV format
    const tutorialSections = Object.entries(tutorialData).map(([key, data], index) => ({
      section_key: key,
      title: data.title,
      content: data.content,
      order_index: index,
      is_active: true
    }));

    // CSV headers for tutorials
    const headers = [
      'section_key',
      'title',
      'content',
      'order_index',
      'is_active'
    ];

    // Convert to CSV rows
    const rows = tutorialSections.map(section => {
      return [
        section.section_key,
        JSON.stringify(section.title), // JSONB format
        JSON.stringify(section.content), // JSONB format
        section.order_index,
        section.is_active
      ];
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => {
        // Properly escape JSON content for CSV
        const escapedField = field.toString().replace(/"/g, '""');
        return `"${escapedField}"`;
      }).join(','))
      .join('\n');

    // Write CSV file
    fs.writeFileSync(outputFilePath, csvContent);
    
    console.log(`✅ Tutorial CSV file created: ${outputFilePath}`);
    console.log(`📊 Tutorial sections: ${tutorialSections.length}`);
    
    tutorialSections.forEach(section => {
      console.log(`  - ${section.title.en} (${section.section_key})`);
    });
    
  } catch (error) {
    console.error('❌ Error creating tutorial CSV:', error);
    process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node json-to-csv.js cards <input.json> <output.csv>');
    console.log('  node json-to-csv.js tutorials <output.csv>');
    console.log('');
    console.log('Examples:');
    console.log('  node json-to-csv.js cards cards.json cards.csv');
    console.log('  node json-to-csv.js tutorials tutorials.csv');
    process.exit(1);
  }
  
  const command = args[0];
  
  if (command === 'cards') {
    if (args.length !== 3) {
      console.error('❌ For cards, provide input JSON file and output CSV file');
      console.log('Example: node json-to-csv.js cards cards.json cards.csv');
      process.exit(1);
    }
    
    const inputFile = args[1];
    const outputFile = args[2];
    
    if (!fs.existsSync(inputFile)) {
      console.error(`❌ Input file not found: ${inputFile}`);
      process.exit(1);
    }
    
    createCSVFromJSON(inputFile, outputFile);
    
  } else if (command === 'tutorials') {
    if (args.length !== 2) {
      console.error('❌ For tutorials, provide output CSV file');
      console.log('Example: node json-to-csv.js tutorials tutorials.csv');
      process.exit(1);
    }
    
    const outputFile = args[1];
    createTutorialCSV(outputFile);
    
  } else {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Available commands: cards, tutorials');
    process.exit(1);
  }
}

module.exports = { jsonToCSV, transformCardData, createCSVFromJSON, createTutorialCSV }; 