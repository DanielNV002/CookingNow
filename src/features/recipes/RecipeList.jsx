import { useEffect, useState } from "react";
import { getActiveRecipes } from "../../infrastructure/db/recipeStorage";
import { getUsernameById } from "../../infrastructure/db/userStorage";
import RecipeCard from "./RecipeCard";

import "./RecipeList.scss";

export default function RecipeList({ onSelectRecipe }) {
  const [recipes, setRecipes] = useState([]);
  const [usernames, setUsernames] = useState({}); // map id → nombre

  useEffect(() => {
    async function loadRecipes() {
      const all = await getActiveRecipes();
      setRecipes(all);

      // Cargamos los nombres de los autores
      const map = {};
      for (const r of all) {
        if (!map[r.authorId]) {
          map[r.authorId] = await getUsernameById(r.authorId);
        }
      }
      setUsernames(map);
    }

    loadRecipes();
  }, []);

  return (
    <div className="recipe-list">
      <h1>⭐ Mis Recetas ⭐</h1>

      {recipes.length === 0 && <p>No hay recetas aún.</p>}

      <ul>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            authorName={usernames[recipe.authorId]}
            onSelect={onSelectRecipe}
          />
        ))}
      </ul>
    </div>
  );
}
