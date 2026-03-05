import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { FilePicker } from "@capawesome/capacitor-file-picker";

// EXPORTAR
export const exportRecipes = async (recipes) => {
  try {
    const data = JSON.stringify(recipes, null, 2);

    const result = await Filesystem.writeFile({
      path: "recipes-export.json",
      data,
      directory: Directory.Documents,
      encoding: Encoding.UTF8, // ✔ necesario para texto
    });

    await Share.share({
      title: "Exportar recetas",
      text: "Backup de recetas CookingNow",
      url: result.uri,
      dialogTitle: "Compartir backup",
    });

    return result.uri;
  } catch (error) {
    console.error("Error exportando:", error);
    return null;
  }
};

// IMPORTAR
export const importRecipes = async () => {
  try {
    const result = await FilePicker.pickFiles({
      types: ["application/json"],
    });

    const file = result.files[0];

    console.log("Archivo seleccionado:", file);

    const fileContent = await Filesystem.readFile({
      path: file.path,
    });

    const text = atob(fileContent.data);
    const json = JSON.parse(text);

    return json;
  } catch (error) {
    console.error("Error importando:", error);
    return null;
  }
};
