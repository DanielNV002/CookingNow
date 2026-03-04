// src/components/RecipeCard.jsx
import "./RecipeCard.scss";
import { getImageUrl } from "../../utils/imageUtils";

export default function RecipeCard({ recipe, authorName, onSelect }) {
  const getDificultad = (steps) => {
    if (steps >= 10) return { texto: "DIFICIL", clase: "dificil" };
    if (steps >= 5) return { texto: "INTERMEDIA", clase: "intermedia" };
    return { texto: "FACIL", clase: "facil" };
  };

  const dificultad = getDificultad(recipe.steps.length);

  return (
    <li className="recipe-card" onClick={() => onSelect(recipe)}>
      <div className="recipe-image">
        <img src={getImageUrl(recipe.imagePath)} />
      </div>
      <div className="recipe-info">
        <h3>{recipe.title}</h3>
        <div className="nIngredientes">
          <p>
            {recipe.ingredients.length > 1
              ? `${recipe.ingredients.length} Ingredientes`
              : `${recipe.ingredients.length} Ingrediente`}
          </p>
        </div>
        <div className={`dificultad ${dificultad.clase}`}>
          <p>{dificultad.texto}</p>
        </div>
        <div className="autor">
          <p>De {authorName || "Desconocido"}</p>
        </div>
      </div>
    </li>
  );
}
