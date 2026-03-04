import "./RecipeDetails.scss";
import { useState } from "react";
import Button from "./../../components/ui/Button";
import backArrow from "../../assets/back_arrow.svg";
import DeleteButton from "../../components/ui/DeleteButton";
import { getImageUrl } from "../../utils/imageUtils";

export default function RecipeDetail({ recipe, onBack }) {
  const [deleted] = useState(recipe.deleted);

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
      <div className="back-btn">
        <Button onClick={onBack}>
          <img src={backArrow} alt="Atrás" />
        </Button>
      </div>
      <div className="imagen">
        <img src={getImageUrl(recipe.imagePath)} />
      </div>
      <h1>⭐ {recipe.title} </h1>
      <section className="ingredients">
        <h2>Ingredientes</h2>
        <ul
          className={`dos-columnas ${recipe.ingredients.length > 8 ? "lista-scroll" : ""}`}
        >
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      </section>
      <section className="steps">
        <h2>Pasos</h2>
        <ol className={recipe.steps.length > 6 ? "lista-scroll" : ""}>
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>
      <div className="delete-section">
        <DeleteButton recipe={recipe} onBack={onBack} />
      </div>
    </div>
  );
}
