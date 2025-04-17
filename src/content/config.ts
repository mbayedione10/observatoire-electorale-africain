import { defineCollection, z, reference } from "astro:content";
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

const pays2 = defineCollection({
  loader: async () => {
    const paysTableId = "mu5a9zbmi73w0sz";
    const ressourcesTableId = "mzweqv3h6vfkyc1";

    // Champs à récupérer pour les pays
    const fields = [
      "Id",
      "pays",
      "code",
      "Population totale",
      "Démographie Hommes",
      "Démographie Femmes",
      "Nombre d'électeurs",
      "Corps électoral représentation des femmes",
      "Corps électoral représentation des hommes",
      "OGE",
      "Modele",
      "Systeme politique",
      "participation scrutin",
      "organismes",
      "date en preparation",
      "date election precedent",
      "date election precedente (from Résultats des Elections)",
      "participation scrutin (from Résultats des Elections)",
      "résultats  élection précédente (from Résultats des Elections)",
      "Source résultats election précédente (from Résultats des Elections)",
      "Defis 2 (from Défis Electoraux)",
      "Type election precedente",
      "Type election a venir",
      "type élection précédente (from Défis Electoraux)",
      "organisations_observation_afriques 1",
      "Calendrier Electorale",
      "Résultats des Elections",
      "Défis Electoraux",
      "Ressources",
      "Organisation des élections",
    ];

    // Requête pays
    const paysRecords = await listTableRecords(paysTableId, fields, {
      limit: "55",
      where: "(pays,notnull)",
      viewId: "vw7zgcf2jmm6wbn0",
      sort: "pays",
    });

    // Requête ressources
    const ressourcesRecords = await listTableRecords(ressourcesTableId, {
      where: "(Type de données,notnull)",
      sort: "Année",
    });
    //console.log(JSON.stringify(ressourcesRecords, null, 2));
    // Ensuite on map les pays
    return paysRecords.map((record) => {

      const countryId = record["Id"];

      const ressourcesAssociees = ressourcesRecords
        .filter((r) => r.presentation_pays_id === countryId)
        .map((r) => ({
          id: r.Id.toString(),
          collection: "ressources",
        }));

      return {
        id: record["Id"].toString(),
        code: record["code"],
        name: record["pays"],
        ressources: ressourcesAssociees,
        population: parseInt(record["Population totale"]),
        politicalSystem: record["Systeme politique"] || "",
        lastElection: {
          type: record["Type election precedente"]?.[0] || "",
          year: record["date election precedent"]?.[0] || "",
          turnout: record["participation scrutin"]?.[0] || "",
          nextElectionYear: record["date en preparation"]?.[0] || " ",
        },
        demographics: {
          ageGroups: [
            { group: "0-14", percentage: 25.3 },
            { group: "15-24", percentage: 16.5 },
            { group: "25-54", percentage: 42.2 },
            { group: "55+", percentage: 16 },
          ],
          gender: {
            male: parseFloat(record["Démographie Hommes"]),
            female: parseFloat(record["Démographie Femmes"]),
          },
          voterRegistration: {
            registered: parseInt(record["Nombre d'électeurs"]),
            eligible: parseInt(record["Population totale"]),
          },
        },
      };
    });
  },
  schema: z.object({
    code: z.string(),
    name: z.string(),
    population: z.number(),
    ressources: z.array(reference("ressources")),
    politicalSystem: z.string().optional(),
    lastElection: z.object({
      type: z.string(),
      year: z.string(),
      turnout: z.string(),
      nextElectionYear: z.string(),
    }),
    demographics: z.object({
      ageGroups: z.array(
        z.object({
          group: z.string(),
          percentage: z.number(),
        })
      ),
      gender: z.object({
        male: z.number(),
        female: z.number(),
      }),
      voterRegistration: z.object({
        registered: z.number(),
        eligible: z.number(),
      }),
    }),
  }),
});


const ressources = defineCollection({
  loader: async () => {
    const tableId = "mzweqv3h6vfkyc1";
    const params = {
      where: "(Type de données,notnull)",
      sort: "Année",
    };
    const records = await listTableRecords(tableId, params);
    return records
  },
});


export const collections = { pays, pays2, ressources };