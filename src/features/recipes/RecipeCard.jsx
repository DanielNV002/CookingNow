// src/components/RecipeCard.jsx
import "./RecipeCard.scss";

export default function RecipeCard({ recipe, authorName, onSelect }) {
  return (
    <li className="recipe-card" onClick={() => onSelect(recipe)}>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      )}

      <div className="recipe-info">
        <h3>{recipe.title}</h3>
        <p>
          {recipe.ingredients.length > 1
            ? `${recipe.ingredients.length} Ingredientes`
            : `${recipe.ingredients.length} Ingrediente`}
        </p>
        <p>De {authorName || "Desconocido"}</p>
      </div>
    </li>
  );
}
