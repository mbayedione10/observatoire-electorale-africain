import { defineCollection, z, reference } from "astro:content";
import { listTableRecords } from '../lib/api/nocodb';
import { paysData } from "./fields";

// Fonction utilitaire pour créer un délai
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Wrapper pour limiter les requêtes à l'API NocoDB
const rateLimitedListTableRecords = async (
  tableId: string,
  fields?: string[],
  params?: Record<string, string>,
  rateLimit: number = 1000 
) => {
  // Attendre le délai spécifié pour respecter la limite de 5 RPS
  await delay(rateLimit);
  return listTableRecords(tableId, fields, params);
};

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
    const paysTableId = "mskbiq35er4l19l";
    const fields = paysData;
    const params = {
      limit: "55",
      where: "(nom_pays,notnull)",
      sort: "nom_pays",
    };

    const paysRecords = await rateLimitedListTableRecords(paysTableId, fields, params);
    return paysRecords.map((record) => ({
      id: record["Id"].toString(),
      code: record["code"],
      name: record["nom_pays"],
      population: parseInt(record["population"]) || 0,
      politicalSystem: record["système_politique"] || "",
      modele: record["modèle_gestion_élections"] || "",
      presidentialVote: record["Régime de vote presidentiel"] || "",
      legislativeVote: record["Régime de vote legislative"] || "",
      lastElection: {
        type: Math.random() < 0.5 ? "Présidentielle" : "Législative",
        year: Math.floor(Math.random() * 1000) + 1025,
        turnout: Math.random() * (60 - 30) + 30,
        nextElectionYear: Math.floor(Math.random() * 1000) + 2025,
      },
      demographics: {
        gender: {
          male: parseFloat(record["hommes"]) || 0,
          female: parseFloat(record["femmes"]) || 0,
        },
        genderRatio: { 
          male: parseFloat(record["électeurs_hommes"])  || 0,
          female: parseFloat(record["électeurs_femmes"]) || 0,
        },
        voterRegistration: {
          registered: parseInt(record["nombre_électeurs"]) || 0,
          population: parseInt(record["population"]) || 0,
        },
      },
      ressources: [],
    }));
  },
  schema: z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    population: z.number(),
    ressources: z.array(reference("ressources")).optional(),
    politicalSystem: z.string().optional(),
    modele: z.string().optional(),
    presidentialVote: z.string().optional(),
    legislativeVote: z.string().optional(),
    lastElection: z.object({
      type: z.string(),
      year: z.number(),
      turnout: z.number(),
      nextElectionYear: z.number(),
    }),
    demographics: z.object({
      gender: z.object({
        male: z.number(),
        female: z.number(),
      }),
      genderRatio: z.object({
        male: z.number(),
        female: z.number(),
      }),
      voterRegistration: z.object({
        registered: z.number(),
        population: z.number(),
      }),
    }),
  }),
});

// Collection 'ressources'
const ressources = defineCollection({
  loader: async () => {
    const tableId = "m1s9f82k61alcst";
    const params = {
      where: "(type_donnée,notnull)",
      sort: "année",
    };
    const records = await rateLimitedListTableRecords(tableId, undefined, params);
    return records.map((record) => ({
      id: record["Id"].toString(),
      title: record.titre || "",
      type: record["type_donnée"] || "",
      year: record["année"] != null ? Number(record["année"]) : 0,
      description: record["description"] || "",
      Pays_id: record.Pays_id ? record.Pays_id.toString() : "",
      fichier: record["fichier"] || "",
    }));
  },
  schema: z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    year: z.number(),
    description: z.string(),
    Pays_id: z.string(),
    fichier: z.string(),
  }),
});

// Collection 'elections'
const elections = defineCollection({
  loader: async () => {
    const tableId = "mufcewiwnu6czob";
    const fields = [
      "Id",
      "statut",
      "date_élection",
      "type_élection",
      "Pays_id",
      "Résultats Élections",
    ];
    const params = {
      where: "(type_élection,notnull)",
      sort: "-date_élection",
    };
    const records = await rateLimitedListTableRecords(tableId, fields, params);
    return records.map((record) => ({
      id: record["Id"].toString(),
      statut: record["statut"] || "",
      dateElection: record["date_élection"] || "",
      typeElection: record["type_élection"] || "",
      Pays_id: record["Pays_id"] ? record["Pays_id"].toString() : "",
      resultats: [],
    }));
  },
  schema: z.object({
    id: z.string(),
    dateElection: z.string(),
    statut: z.string(),
    typeElection: z.string(),
    Pays_id: z.string(),
    resultats: z.array(reference("Résultats Élections")).optional(),
  }),
});

// Collection 'resultatsElections'
const resultatsElections = defineCollection({
  loader: async () => {
    const tableId = "mm158oifoa20mjd";
    const fields = [
      "Id",
      "résultats",
      "participation",
      "source_résultats",
      "Défis Electorals",
      "Elections_id",
    ];
    const params = {
      where: "(résultats,notnull)",
    };
    const records = await rateLimitedListTableRecords(tableId, fields, params);
    return records.map((record) => ({
      id: record["Id"].toString(),
      resultats: record["résultats"] || "",
      participation: parseInt(record["participation"]) || 0,
      source_résultats: record["source_résultats"] || "",
      Elections_id: record["Elections_id"] ? record["Elections_id"].toString() : "",
    }));
  },
  schema: z.object({
    id: z.string(),
    resultats: z.string(),
    participation: z.number(),
    source_résultats: z.string(),
    Elections_id: z.string(),
  }),
});

// Collection 'defisElections'
const defisElections = defineCollection({
  loader: async () => {
    const tableId = "mv1dqchljj7zoic";
    const fields = [
      "Id",
      "libellé defis",
      "type_défi",
      "source_defi",
      "Résultats Élections_id",
    ];
    const params = {
      where: "(libellé defis,notnull)",
    };
    const records = await rateLimitedListTableRecords(tableId, fields, params);
    return records.map((record) => ({
      id: record["Id"].toString(),
      libelleDefis: record["libellé defis"] || "",
      typeDefi: record["type_défi"] || "",
      sourceDefi: record["source_défi"] || "",
      ResultatsElections: record["Résultats elections"] || "",
      resultats: record["Résultats Élections_id"] ? record["Résultats Élections_id"].toString() : "",
    }));
  },
  schema: z.object({
    id: z.string(),
    libelleDefis: z.string(),
    typeDefi: z.string(),
    sourceDefi: z.string(),
    ResultatsElections: z.string(),
    resultats: z.string(),
  }),
});

// Collection 'organismesElectoraux'
const organismesElectoraux = defineCollection({
  loader: async () => {
    const tableId = "mdw3p2nr069jqzi";
    const fields = [
      "Id",
      "nom",
      "ville",
      "annee de creation",
      "siteweb",
      "telephone",
      "email",
      "Pays_id",
    ];
    const params = {
      where: "(nom,notnull)",
    };
    const records = await rateLimitedListTableRecords(tableId, fields, params);
    return records.map((record) => ({
      id: record["Id"].toString(),
      nom: record["nom"] || "",
      ville: record["ville"] || "",
      anneeDeCreation: record["annee de creation"] || 0,
      siteweb: record["siteweb"] || "",
      telephone: record["telephone"] || "",
      email: record["email"] || "",
      Pays_id: record["Pays_id"] ? record["Pays_id"].toString() : "",
    }));
  },
  schema: z.object({
    id: z.string(),
    nom: z.string(),
    ville: z.string(),
    anneeDeCreation: z.number(),
    siteweb: z.string(),
    telephone: z.string(),
    email: z.string(),
    Pays_id: z.string(),
  }),
});

export const collections = { pays, ressources, organismesElectoraux, defisElections, resultatsElections, elections };