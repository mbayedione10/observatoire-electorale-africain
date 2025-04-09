import { defineCollection, z } from 'astro:content';
import { listTableRecords } from '../lib/api/nocodb';

// Fonction utilitaire pour générer un slug à partir d’une chaîne
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Type slug avec Zod
const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Slug invalide');

// Collection 'pays'
const pays = defineCollection({
  loader: async () => {
    const tableId = 'mlhf50tyvgsqmz4';
    const fields = [
      'Id',
      'Nom du pays',
      'code',
      'Population totale',
      'Démographie Hommes',
      'Démographie Femmes',
      "Nombre d'électeurs",
      'Corps électoral représentation des femmes',
      'Corps électoral représentation des hommes'
    ];
    const params = { 
      limit: '55',
      where: "(Nom du pays,notnull)",
      sort: 'Nom du pays'
    };
    const records = await listTableRecords(tableId, fields, params);
    return records.map(record => ({
      id: record['Id'].toString(),
      code: record['code'],
      name: record['Nom du pays'],
      population: parseInt(record['Population totale']),
      politicalSystem: Math.random() < 0.5 ? "République Présidentielle" : "République Parlementaire",
      lastElection: {
        "type": Math.random() < 0.5 ? "Présidentielle" : "Législative",
        "year": Math.floor(Math.random() * 1000) + 1025,
        "turnout": Math.random() * (60 - 30) + 30,
        "nextElectionYear": Math.floor(Math.random() * 1000) + 2025
      },
      demographics: {
        ageGroups: [
          { group: "0-14", "percentage": 25.3 },
          { group: "15-24", "percentage": 16.5 },
          { group: "25-54", "percentage": 42.2 },
          { group: "55+", "percentage": 16 }
        ],
        gender: {
          male: parseFloat(record['Démographie Hommes']),
          female: parseFloat(record['Démographie Femmes'])
        },
        voterRegistration: {
          registered: parseInt(record["Nombre d'électeurs"]),
          eligible: Math.floor(Math.random() * parseInt(record["Nombre d'électeurs"]))
        }
      }
    }));
  },
  schema: z.object({
    code: z.string(),
    name: z.string(),
    population: z.number(),
    politicalSystem: z.string(),
    lastElection: z.object({
      type: z.string(),
      year: z.number(),
      turnout: z.number(),
      nextElectionYear: z.number(),
    }),
    demographics: z.object({
      ageGroups: z.array(z.object({
        group: z.string(),
        percentage: z.number()
      })),
      gender: z.object({
        male: z.number(),
        female: z.number()
      }),
      voterRegistration: z.object({
        registered: z.number(),
        eligible: z.number()
      })
    })
  }),
});

export const collections = { pays };