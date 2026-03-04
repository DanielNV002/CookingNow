import { Filesystem, Directory } from "@capacitor/filesystem";

// EXPORTAR
export const exportRecipes = async (recipes) => {
  try {
    console.log("Exportando recetas...", recipes);

    const data = JSON.stringify(recipes, null, 2);

    await Filesystem.writeFile({
      path: "recipes-export.json",
      data,
      directory: Directory.Documents,
    });

    console.log("Export correcto");
  } catch (error) {
    console.error("Error exportando:", error);
  }
};

// IMPORTAR
export const importRecipes = async () => {
  const result = await Filesystem.readFile({
    path: "recipes-export.json",
    directory: Directory.Documents,
  });

  return JSON.parse(result.data);
};
