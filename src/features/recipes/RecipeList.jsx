import { useEffect, useState } from "react";
import { getActiveRecipes } from "../../infrastructure/db/recipeStorage";
import "./RecipeList.scss";

export default function RecipeList({ onSelectRecipe }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function loadRecipes() {
      const all = await getActiveRecipes();
      setRecipes(all);
    }

    loadRecipes();
  }, []);

  return (
    <div className="recipe-list">
      <h1>📖 Mis Recetas</h1>

      {recipes.length === 0 && <p>No hay recetas aún.</p>}

      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id} onClick={() => onSelectRecipe(recipe)}>
            <h3>{recipe.title}</h3>
            <p>{recipe.ingredients.length} ingredientes</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
