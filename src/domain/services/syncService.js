import {
  getAllRecipes,
  overwriteAllRecipes,
} from "../../infrastructure/db/recipeStorage";

/**
 * mergeRecipes
 *
 * @param {Array} externalRecipes - Lista de recetas importadas desde otro dispositivo
 * @returns {Object} stats - { added, updated, deleted }
 */
export async function mergeRecipes(externalRecipes) {
  if (!Array.isArray(externalRecipes))
    throw new Error("External recipes must be an array");

  const localRecipes = await getAllRecipes();

  const mergedMap = new Map();

  //Primero ponemos todas las locales en el mapa
  for (const r of localRecipes) {
    mergedMap.set(r.id, r);
  }

  // Estadísticas
  let stats = { added: 0, updated: 0, deleted: 0 };

  //Iteramos externas y hacemos merge
  for (const ext of externalRecipes) {
    const local = mergedMap.get(ext.id);

    if (!local) {
      // Nueva receta
      mergedMap.set(ext.id, ext);
      stats.added++;
    } else {
      // Existe → comparamos updatedAt
      if ((ext.updatedAt || 0) > (local.updatedAt || 0)) {
        mergedMap.set(ext.id, ext);

        if (ext.deleted) stats.deleted++;
        else stats.updated++;
      }
      // Si local es más reciente, ignoramos
    }
  }

  //Creamos array final
  const mergedRecipes = Array.from(mergedMap.values());

  //Sobrescribimos almacenamiento
  await overwriteAllRecipes(mergedRecipes);

  return stats;
}
