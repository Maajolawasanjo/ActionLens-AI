import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface UserProfile {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  onboarding_complete: boolean;
  created_at: string;
}

const STORE_PATH = path.join(process.cwd(), ".auth_store.json");

function loadUsers(): Record<string, UserProfile> {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch {}
  return {};
}

function saveUsers(users: Record<string, UserProfile>) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.error("[AuthStore Save Error]", err);
  }
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function findUserByEmail(email: string): UserProfile | null {
  const users = loadUsers();
  const lower = email.toLowerCase().trim();
  return Object.values(users).find((u) => u.email.toLowerCase() === lower) ?? null;
}

export function findUserById(id: string): UserProfile | null {
  const users = loadUsers();
  return users[id] ?? null;
}

export function createUserProfile(input: {
  email: string;
  password: string;
  full_name: string;
  role: string;
}): UserProfile {
  const users = loadUsers();
  const lower = input.email.toLowerCase().trim();

  const id = crypto.randomUUID();
  const newUser: UserProfile = {
    id,
    email: lower,
    password_hash: hashPassword(input.password),
    full_name: input.full_name.trim(),
    role: input.role,
    onboarding_complete: false,
    created_at: new Date().toISOString(),
  };

  users[id] = newUser;
  saveUsers(users);
  return newUser;
}

export function verifyUserCredentials(email: string, password: string): UserProfile | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  const targetHash = hashPassword(password);
  if (user.password_hash === targetHash) {
    return user;
  }
  return null;
}

export function completeUserOnboarding(id: string) {
  const users = loadUsers();
  if (users[id]) {
    users[id].onboarding_complete = true;
    saveUsers(users);
  }
}
