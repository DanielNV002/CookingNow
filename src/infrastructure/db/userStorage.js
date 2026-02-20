import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const FILE_PATH = "users.json";

async function readFileSafe() {
  try {
    const result = await Filesystem.readFile({
      path: FILE_PATH,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    return JSON.parse(result.data);
  } catch (e) {
    return { users: [], currentUserId: null };
  }
}

async function writeFileSafe(data) {
  await Filesystem.writeFile({
    path: FILE_PATH,
    directory: Directory.Data,
    data: JSON.stringify(data, null, 2),
    encoding: Encoding.UTF8,
  });
}

// 🔹 API pública
export async function initUserStorage() {
  const data = await readFileSafe();
  if (!data.users) {
    await writeFileSafe({ users: [], currentUserId: null });
  }
}

export async function registerUser(username) {
  const data = await readFileSafe();
  const existing = data.users.find((u) => u.username === username);
  if (existing) {
    data.currentUserId = existing.id;
  } else {
    const id = crypto.randomUUID();
    const user = { id, username };
    data.users.push(user);
    data.currentUserId = id;
  }
  await writeFileSafe(data);
  return data.currentUserId;
}

export async function getCurrentUserId() {
  const data = await readFileSafe();
  return data.currentUserId;
}

export async function logout() {
  const data = await readFileSafe();
  data.currentUserId = null;
  await writeFileSafe(data);
}

export async function getUsernameById(id) {
  const data = await readFileSafe();
  const user = data.users.find((u) => u.id === id);
  return user ? user.username : "Desconocido";
}
