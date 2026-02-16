import { useEffect, useState } from "react";
import { initStorage } from "./infrastructure/db/recipeStorage";
import RecipeList from "./features/recipes/RecipeList";
import RecipeDetail from "./features/recipes/RecipeDetails";
import RecipeForm from "./features/recipes/RecipeForm";

export default function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  const userId = "usuario1"; // para pruebas offline

  // 🔹 Inicializar storage
  useEffect(() => {
    async function init() {
      await initStorage();
      setStorageReady(true);
    }
    init();
  }, []);

  if (!storageReady) {
    return <p>Cargando...</p>; // Esperamos que se cree el JSON
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
    <div>
      <button
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: "15px 20px",
          borderRadius: "50%",
          backgroundColor: "#5a9",
          color: "#fff",
          fontSize: "24px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => setAddingRecipe(true)}
      >
        +
      </button>

      <RecipeList onSelectRecipe={setSelectedRecipe} />
    </div>
  );
}
