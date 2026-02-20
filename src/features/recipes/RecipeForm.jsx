import { useState } from "react";
import { addRecipe } from "../../infrastructure/db/recipeStorage";
import { createRecipe } from "../../domain/models/Recipe";
import { saveImage } from "../../utils/imageUtils"; // 🔹 IMPORT CORRECTO

import "./RecipeForm.scss";

export default function RecipeForm({ userId, onSaved, onCancel }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [imagePath, setImagePath] = useState(null);

  function handleIngredientChange(index, value) {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  }

  // Al seleccionar imagen
  async function handleImage(e) {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Full = reader.result;
      const base64 = base64Full.split(",")[1]; // quitar data:image/...

      const fileName = `${crypto.randomUUID()}.jpg`;

      const uri = await saveImage(fileName, base64);

      console.log("URI guardada:", uri);

      setImagePath(uri);
    };

    reader.readAsDataURL(file);
  }
  function handleStepChange(index, value) {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  }

  function addIngredient() {
    setIngredients([...ingredients, ""]);
  }

  function removeIngredient(index) {
    if (ingredients.length === 1) return; // evita quedarte sin ninguno
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  }

  function addStep() {
    setSteps([...steps, ""]);
  }

  function removeStep(index) {
    if (steps.length === 1) return;
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const recipe = createRecipe(
      { title, ingredients, steps, imagePath },
      userId,
    );
    await addRecipe(recipe);
    onSaved(recipe);
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h1>⭐ Nueva Receta ⭐</h1>
      <label>Imagen</label>
      <input type="file" accept="image/*" onChange={handleImage} />{" "}
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
          <div key={i} className="input-row">
            <input
              type="text"
              value={ing}
              placeholder={`Ingrediente ${i + 1}`}
              onChange={(e) => handleIngredientChange(i, e.target.value)}
              required
            />
            <button
              type="button"
              className="delete-input"
              onClick={() => removeIngredient(i)}
            >
              ✕
            </button>
          </div>
        ))}
        <button className="button_anadir" onClick={addIngredient}>
          + Añadir ingrediente
        </button>
      </section>
      <section className="section">
        <h2>Pasos</h2>
        {steps.map((step, i) => (
          <div key={i} className="input-row">
            <input
              type="text"
              value={step}
              placeholder={`Paso ${i + 1}`}
              onChange={(e) => handleStepChange(i, e.target.value)}
              required
            />
            <button
              type="button"
              className="delete-input"
              onClick={() => removeStep(i)}
            >
              ✕
            </button>
          </div>
        ))}
        <button className="button_anadir" onClick={addStep}>
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
