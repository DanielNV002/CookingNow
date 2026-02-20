import { Filesystem, Directory } from "@capacitor/filesystem";

// Convertir File a base64 (solo para procesar)
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

// Redimensionar/comprimir imagen (opcional, recomendable)
export function resizeImage(base64, maxWidth = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", 0.7)); // calidad 70%
    };
  });
}

// Guardar imagen en almacenamiento interno
export async function saveImage(fileName, base64Data) {
  try {
    const result = await Filesystem.writeFile({
      path: `recetas/${fileName}`,
      data: base64Data,
      directory: Directory.Data,
      recursive: true,
    });

    return result.uri; // 🔥 GUARDA ESTO EN EL JSON
  } catch (err) {
    console.error("Error guardando imagen:", err);
    throw err;
  }
}

// Convertir la ruta para mostrar en <img>
import { Capacitor } from "@capacitor/core";
export function getImageUrl(path) {
  console.log(path);

  return Capacitor.convertFileSrc(path);
}

// Borrar imagen del filesystem
export async function deleteImage(path) {
  try {
    await Filesystem.deleteFile({
      path,
      directory: Directory.Data,
    });
  } catch (err) {
    console.error("Error borrando imagen:", err);
  }
}
