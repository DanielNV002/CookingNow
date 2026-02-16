import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const FILE_NAME = 'recetas.json';
const FILE_PATH = FILE_NAME;

//
// 🔹 Helpers internos (NO exportar)
//

async function readFileSafe() {
  try {
    const result = await Filesystem.readFile({
      path: FILE_PATH,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    return JSON.parse(result.data);
  } catch (error) {
    return null;
  }
}

async function writeFileSafe(content) {
  await Filesystem.writeFile({
    path: FILE_PATH,
    directory: Directory.Data,
    data: JSON.stringify(content, null, 2),
    encoding: Encoding.UTF8,
  });
}

//
// 🔹 API pública
//

export async function initStorage() {
  const existing = await readFileSafe();

  if (!existing) {
    const initialData = {
      version: 1,
      lastModified: Date.now(),
      recipes: [],
    };

    await writeFileSafe(initialData);
  }
}

export async function getAllRecipes() {
  const data = await readFileSafe();
  if (!data) return [];
  return data.recipes || [];
}

export async function getActiveRecipes() {
  const recipes = await getAllRecipes();
  return recipes.filter(r => !r.deleted);
}

export async function overwriteAllRecipes(recipes) {
  const newData = {
    version: 1,
    lastModified: Date.now(),
    recipes,
  };

  await writeFileSafe(newData);
}

export async function addRecipe(recipe) {
  const data = await readFileSafe();
  if (!data) throw new Error('Storage not initialized');

  data.recipes.push(recipe);
  data.lastModified = Date.now();

  await writeFileSafe(data);
}

export async function updateRecipe(updatedRecipe) {
  const data = await readFileSafe();
  if (!data) throw new Error('Storage not initialized');

  const index = data.recipes.findIndex(r => r.id === updatedRecipe.id);
  if (index === -1) return;

  data.recipes[index] = updatedRecipe;
  data.lastModified = Date.now();

  await writeFileSafe(data);
}

export async function softDeleteRecipe(id) {
  const data = await readFileSafe();
  if (!data) throw new Error('Storage not initialized');

  const recipe = data.recipes.find(r => r.id === id);
  if (!recipe) return;

  recipe.deleted = true;
  recipe.updatedAt = Date.now();
  recipe.version = (recipe.version || 1) + 1;

  data.lastModified = Date.now();

  await writeFileSafe(data);
}

export async function getRecipeById(id) {
  const recipes = await getAllRecipes();
  return recipes.find(r => r.id === id) || null;
}
