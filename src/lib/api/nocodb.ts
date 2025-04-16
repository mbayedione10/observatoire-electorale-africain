import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Récupération des variables d'environnement
const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;

if (!API_URL || !API_TOKEN) {
  throw new Error('Les variables d\'environnement API_URL et API_TOKEN doivent être définies.');
}

// Configuration d'une instance Axios pour toutes les requêtes
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'xc-token': API_TOKEN,
    'Content-Type': 'application/json',
  },
});

/**
 * Liste les enregistrements d'une table avec sélection de colonnes.
 * @param tableId - L'ID de la table.
 * @param fields - Les colonnes à récupérer (ex: ['title', 'content']).
 * @param params - Paramètres optionnels (ex: limit, offset).
 * @returns Un tableau d'enregistrements.
 */
export async function listTableRecords(tableId: string, fields: string[] = [], params: Record<string, string> = {}): Promise<any[]> {
  try {
    if (fields.length > 0) {
      params.fields = fields.join(',');
    }
    const response = await api.get(`/api/v2/tables/${tableId}/records`, { params });
    const data = response.data;
    if (!data.list) throw new Error('Format de données invalide');
    return data.list.map((record: any) => ({ id: record.Id.toString(), ...record }));
  } catch (error) {
    console.error(`Erreur lors de la récupération des enregistrements pour la table ${tableId}:`, error);
    return [];
  }
}

/**
 * Récupère un enregistrement spécifique.
 * @param tableId - L'ID de la table.
 * @param recordId - L'ID de l'enregistrement.
 * @param fields - Les colonnes à récupérer.
 * @returns L'enregistrement ou null si non trouvé.
 */
export async function readTableRecord(tableId: string, recordId: string, fields: string[] = []): Promise<any | null> {
  try {
    const params = fields.length > 0 ? { fields: fields.join(',') } : {};
    const response = await api.get(`/api/v2/tables/${tableId}/records/${recordId}`, { params });
    const record = response.data;
    return { id: record.Id.toString(), ...record };
  } catch (error) {
    if (error.response && error.response.status === 404) return null;
    console.error(`Erreur lors de la récupération de l'enregistrement ${recordId}:`, error);
    return null;
  }
}

/**
 * Compte les enregistrements d'une table.
 * @param tableId - L'ID de la table.
 * @param params - Paramètres optionnels (ex: filtres).
 * @returns Le nombre d'enregistrements.
 */
export async function countTableRecords(tableId: string, params: Record<string, string> = {}): Promise<number> {
  try {
    const response = await api.get(`/api/v2/tables/${tableId}/records/count`, { params });
    return response.data.count;
  } catch (error) {
    console.error(`Erreur lors du comptage des enregistrements pour la table ${tableId}:`, error);
    return 0;
  }
}

/**
 * Liste les enregistrements liés via un champ de lien.
 * @param tableId - L'ID de la table.
 * @param linkFieldId - L'ID du champ de lien.
 * @param recordId - L'ID de l'enregistrement.
 * @param fields - Les colonnes à récupérer.
 * @param params - Paramètres optionnels.
 * @returns Un tableau d'enregistrements liés.
 */
export async function listLinkedRecords(
  tableId: string,
  linkFieldId: string,
  recordId: string,
  fields: string[] = [],
  params: Record<string, string> = {}
): Promise<any[]> {
  try {
    if (fields.length > 0) {
      params.fields = fields.join(',');
    }
    const response = await api.get(`/api/v2/tables/${tableId}/links/${linkFieldId}/records/${recordId}`, { params });
    const data = response.data;
    if (!data.list) throw new Error('Format de données invalide');
    return data.list.map((record: any) => ({ id: record.Id.toString(), ...record }));
  } catch (error) {
    console.error(`Erreur lors de la récupération des enregistrements liés:`, error);
    return [];
  }
}

export async function getFullLinkedRecords(
  sourceTableId: string,
  sourceRecordId: string,
  linkFieldId: string,
  linkedTableId: string
): Promise<any[]> {
  try {
    // Étape 1 : récupérer les IDs liés
    const linkResponse = await api.get(
      `/api/v2/tables/${sourceTableId}/links/${linkFieldId}/records/${sourceRecordId}`
    );

    const linkedItems = linkResponse.data?.list;
    const linkedIds = Array.isArray(linkedItems)
      ? linkedItems.map((item: any) => item.Id)
      : linkedItems?.Id
      ? [linkedItems.Id]
      : [];

    if (!linkedIds.length) return [];

    // Étape 2 : filtrer les enregistrements par ID
    const whereClause = `(Id,in,${linkedIds.join(",")})`;
    
    const params = {
      where: whereClause,
      limit: linkedIds.length.toString(),
    };

    const response = await api.get(`/api/v2/tables/${linkedTableId}/records`, {
      params,
    });

    return response.data?.list ?? [];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données liées complètes :",
      error
    );
    return [];
  }
}
