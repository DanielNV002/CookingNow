import { useState } from "react";
import { addRecipe } from "../../infrastructure/db/recipeStorage";
import { createRecipe } from "../../domain/models/Recipe";
import "./RecipeForm.scss";

export default function RecipeForm({ userId, onSaved, onCancel }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  function handleIngredientChange(index, value) {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  }

  function handleStepChange(index, value) {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  }

  function addIngredient() {
    setIngredients([...ingredients, ""]);
  }

  function addStep() {
    setSteps([...steps, ""]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const recipe = createRecipe({ title, ingredients, steps }, userId);
    await addRecipe(recipe);
    onSaved(recipe);
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h1>➕ Nueva Receta</h1>

      <label>Título</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <section className="section">
        <h2>Ingredientes</h2>
        {ingredients.map((ing, i) => (
          <input
            key={i}
            type="text"
            value={ing}
            placeholder={`Ingrediente ${i + 1}`}
            onChange={(e) => handleIngredientChange(i, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addIngredient}>
          + Añadir ingrediente
        </button>
      </section>

      <section className="section">
        <h2>Pasos</h2>
        {steps.map((step, i) => (
          <input
            key={i}
            type="text"
            value={step}
            placeholder={`Paso ${i + 1}`}
            onChange={(e) => handleStepChange(i, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addStep}>
          + Añadir paso
        </button>
      </section>

      <div className="buttons">
        <button type="submit">Guardar Receta</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
