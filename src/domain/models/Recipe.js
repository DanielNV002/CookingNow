export function createRecipe(data, userId) {
  return {
    id: crypto.randomUUID(),
    title: data.title,
    ingredients: data.ingredients || [],
    steps: data.steps || [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    deleted: false,
    version: 1,
    authorId: userId
  };
}
