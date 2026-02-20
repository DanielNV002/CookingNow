import { useState, useEffect } from "react";
import UserLogin from "./features/users/UserLogin";
import RecipeList from "./features/recipes/RecipeList";
import RecipeForm from "./features/recipes/RecipeForm";
import RecipeDetail from "./features/recipes/RecipeDetails";
import { initStorage } from "./infrastructure/db/recipeStorage";
import { logout } from "../src/infrastructure/db/userStorage";
import logOutIcon from "./assets/log-out.svg";
import Button from "./components/ui/Button";
import "./App.scss";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  // 🔹 Inicializar storage
  useEffect(() => {
    async function init() {
      await initStorage();
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
      <div className="logout-button">
        <Button onClick={handleLogout}>
          <img src={logOutIcon} alt="Cerrar sesión" />
        </Button>
      </div>

      <div className="plus-button">
        <Button onClick={() => setAddingRecipe(true)}>+</Button>
      </div>

      <div className="Recipe-list">
        <RecipeList onSelectRecipe={setSelectedRecipe} />
      </div>
    </div>
  );
}
