import { useState, useEffect } from "react";
import {
  initUserStorage,
  registerUser,
  getCurrentUserId,
} from "../../infrastructure/db/userStorage";
import Button from "../../components/ui/Button";
import "./UserLogin.scss";

export default function UserLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await initUserStorage();
      const current = await getCurrentUserId();
      if (current) onLogin(current);
      setLoading(false);
    }
    init();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const id = await registerUser(username);
    onLogin(id);
  }

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <form onSubmit={handleSubmit} className="form">
      <h1> CookingNow </h1>
      <h2>⭐ Identificate ⭐</h2>
      <input
        type="text"
        value={username}
        placeholder="Nombre de usuario"
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Button type="submit">Entrar / Registrar</Button>
    </form>
  );
}
