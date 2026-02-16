import "./RecipeDetails.scss";
import { softDeleteRecipe } from "../../infrastructure/db/recipeStorage";
import { useState } from "react";

export default function RecipeDetail({ recipe, onBack }) {
  const [deleted, setDeleted] = useState(recipe.deleted);

  async function handleDelete() {
    const confirm = window.confirm("¿Seguro que quieres eliminar esta receta?");
    if (!confirm) return;

    await softDeleteRecipe(recipe.id);
    setDeleted(true);
    alert("Receta eliminada");
    onBack();
  }

  if (deleted) {
    return (
      <div className="recipe-detail">
        <button className="back-btn" onClick={onBack}>
          ← Volver
        </button>
        <p>Esta receta ha sido eliminada.</p>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <button className="back-btn" onClick={onBack}>
        ← Volver
      </button>

      <h1>{recipe.title}</h1>

      <section className="ingredients">
        <h2>Ingredientes</h2>
        <ul>
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      </section>

      <section className="steps">
        <h2>Pasos</h2>
        <ol>
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <button className="delete-btn" onClick={handleDelete}>
        Eliminar receta
      </button>
    </div>
  );
}
