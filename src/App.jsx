import { useState, useEffect } from "react";
import UserLogin from "./features/users/UserLogin";
import RecipeList from "./features/recipes/RecipeList";
import RecipeForm from "./features/recipes/RecipeForm";
import RecipeDetail from "./features/recipes/RecipeDetails";
import Button from "./components/ui/Button";

import {
  initStorage,
  getAllRecipes,
  overwriteAllRecipes,
} from "./infrastructure/db/recipeStorage";

import { logout, getCurrentUserId } from "./infrastructure/db/userStorage";

import {
  exportRecipes,
  importRecipes,
} from "./infrastructure/export/exportService";

import logOutIcon from "./assets/log-out.svg";
import plusIcon from "./assets/plus.svg";
import "./App.scss";

/* ============================================================
   HELPERS
============================================================ */
async function initializeStorage() {
  await initStorage();
  return (await getAllRecipes()) || [];
}

async function restoreUserSession() {
  return await getCurrentUserId();
}

/* ============================================================
   COMPONENT
============================================================ */
export default function App() {
  const [userId, setUserId] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [exportPath, setExportPath] = useState(null);

  // ============================================================
  // INITIALIZATION
  // ============================================================
  useEffect(() => {
    async function init() {
      const [storedRecipes, user] = await Promise.all([
        initializeStorage(),
        restoreUserSession(),
      ]);

      setRecipes(storedRecipes);
      if (user) setUserId(user);
      setStorageReady(true);
    }

    init();
  }, []);

  // ============================================================
  // HANDLERS
  // ============================================================
  async function handleLogout() {
    await logout();
    setUserId(null);
  }

  async function handleExport() {
    const uri = await exportRecipes(recipes);
    setExportPath(uri);
  }

  async function handleImport() {
    const imported = await importRecipes();

    if (!Array.isArray(imported)) {
      alert("El archivo no es válido");
      return;
    } else if (Array.isArray(imported)) {
      await overwriteAllRecipes(imported);
      setRecipes(imported);
    }
  }

  function navigateToDetail(recipe) {
    setAddingRecipe(false);
    setSelectedRecipe(recipe);
  }

  // ============================================================
  // RENDER FLOW
  // ============================================================
  if (!storageReady) return <p>Cargando app...</p>;

  if (!userId) {
    return <UserLogin onLogin={setUserId} />;
  }

  if (addingRecipe) {
    return (
      <RecipeForm
        userId={userId}
        onSaved={(recipe) => {
          setRecipes((prev) => [...prev, recipe]);
          navigateToDetail(recipe);
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
      {/* EXPORT / IMPORT */}
      <div className="exp-imp-buttons">
        <Button onClick={handleExport}>Exportar JSON</Button>
        <Button onClick={handleImport}>Importar JSON</Button>
      </div>

      {/* LOGOUT */}
      <div className="logout-button">
        <Button onClick={handleLogout}>
          <img src={logOutIcon} alt="Cerrar sesión" />
        </Button>
      </div>

      {/* NUEVA RECETA */}
      <div className="plus-button">
        <Button onClick={() => setAddingRecipe(true)}>
          <img src={plusIcon} alt="Nueva receta" />
        </Button>
      </div>

      {/* LISTA */}
      <RecipeList
        recipes={recipes}
        setRecipes={setRecipes}
        onSelectRecipe={navigateToDetail}
      />

      {/* MODAL EXPORT */}
      {exportPath && (
        <div className="export-modal">
          <div className="export-modal-content">
            <h3>Exportación completada</h3>
            <p>Archivo guardado en:</p>
            <p className="path">{exportPath}</p>
            <Button onClick={() => setExportPath(null)}>Cerrar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
