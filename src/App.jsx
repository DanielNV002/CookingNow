import { useState, useEffect } from "react";
import UserLogin from "./features/users/UserLogin";
import RecipeList from "./features/recipes/RecipeList";
import RecipeForm from "./features/recipes/RecipeForm";
import RecipeDetail from "./features/recipes/RecipeDetails";
import { initStorage } from "./infrastructure/db/recipeStorage";
import { logout, getCurrentUserId } from "../src/infrastructure/db/userStorage";
import logOutIcon from "./assets/log-out.svg";
import plusIcon from "./assets/plus.svg";
import Button from "./components/ui/Button";
import "./App.scss";
import {
  exportRecipes,
  importRecipes,
} from "./infrastructure/export/exportService";
import {
  getAllRecipes,
  overwriteAllRecipes,
} from "./infrastructure/db/recipeStorage";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [recipes, setRecipes] = useState([]);

  // 🔹 Inicializar storage
  useEffect(() => {
    async function init() {
      await initStorage();

      const stored = await getAllRecipes();
      setRecipes(stored || []);

      setStorageReady(true);
    }

    async function restoreSession() {
      const saved = await getCurrentUserId();
      if (saved) {
        setUserId(saved);
      }
    }

    init();
    restoreSession();
  }, []);

  async function handleLogout() {
    await logout();
    setUserId(null);
  }

  if (!storageReady) return <p>Cargando app...</p>;

  if (!userId) {
    return <UserLogin onLogin={setUserId} />;
  }

  if (addingRecipe) {
    return (
      <RecipeForm
        userId={userId}
        onSaved={(recipe) => {
          setAddingRecipe(false);
          setSelectedRecipe(recipe);

          setRecipes((prev) => [...prev, recipe]);
        }}
        onCancel={() => setAddingRecipe(false)}
      />
    );
  }

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <div className="mainPage">
      <div className="exp-imp-buttons">
        <Button
          onClick={async () => {
            await exportRecipes(recipes);
          }}
        >
          Exportar JSON
        </Button>{" "}
        <Button
          onClick={async () => {
            const imported = await importRecipes();

            if (Array.isArray(imported)) {
              await overwriteAllRecipes(imported); // guarda en storage
              setRecipes(imported); //  actualiza UI
            }
          }}
        >
          Importar JSON
        </Button>
      </div>
      <div className="logout-button">
        <Button onClick={handleLogout}>
          <img src={logOutIcon} alt="Cerrar sesión" />
        </Button>
      </div>

      <div className="plus-button">
        <Button onClick={() => setAddingRecipe(true)}>
          <img src={plusIcon} alt="Cerrar sesión" />
        </Button>
      </div>

      <div className="Recipe-list">
        <RecipeList
          recipes={recipes}
          setRecipes={setRecipes}
          onSelectRecipe={setSelectedRecipe}
        />{" "}
      </div>
    </div>
  );
}
