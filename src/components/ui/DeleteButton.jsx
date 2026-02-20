import { useState } from "react";
import { softDeleteRecipe } from "../../infrastructure/db/recipeStorage";
import { deleteImage } from "../../utils/imageUtils";
import "./DeleteButton.scss";

function DeleteButton({ recipe, onBack }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    if (recipe.imagePath) {
      await deleteImage(recipe.imagePath); // borrar la imagen física
    }

    await softDeleteRecipe(recipe.id); // borrado lógico
    setDeleted(true);
    setShowConfirm(false);
    onBack();
  }

  if (deleted) return null;

  return (
    <>
      <button className="btn-delete" onClick={() => setShowConfirm(true)}>
        Eliminar receta
      </button>

      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>¿Seguro que quieres eliminar esta receta?</p>
            <div className="modal-buttons">
              <button
                className="btn-cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
              <button className="btn-delete" onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteButton;
