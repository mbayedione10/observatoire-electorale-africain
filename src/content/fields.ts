export const paysData = [
  "Id",
  "nom_pays",
  "code",
  "population",
  "hommes",
  "femmes",
  "langues_officielles",
  "nombre_électeurs",
  "électeurs_hommes",
  "électeurs_femmes",
  "modèle_gestion_élections",
  "système_politique",
  "modèle_gestion_élections",
  "Organe de validation des candidatures",
  "Régime de vote presidentiel",
  "Régime de vote legislative",
  "Organe de proclamation des résultats provisoires",
  "Organe de gestion des contentieux électoraux",
  "Organe de proclamation des resultats definitifs",
  "Organes Gestion Electoraux",
  "Elections",
  "Ressources",
  "Organisations",
];

export const electionsData = [
  "Id",
  "statut",
  "date_élection",
  "type_élection",
  "Pays_id",
  "Résultats Élections",
  ];
  
export const resultatsElectionsData = [
      "Id",
      "résultats",
      "participation",
      "source_résultats",
      "Défis Electorals",
      "Elections_id",
    ];

export const defisData = [
      "Id",
      "libellé defis",
      "type_défi",
      "source_defi",
      "Résultats Élections_id",
    ];

export const organismesElectorauxData = [
      "Id",
      "nom",
      "ville",
      "annee de creation",
      "siteweb",
      "telephone",
      "email",
      "Pays_id",
    ];