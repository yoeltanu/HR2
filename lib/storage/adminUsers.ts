
"use client";

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: "superadmin" | "admin";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const ADMIN_USERS_KEY = "gadgetnio_admin_users";

export const defaultAdminUsers: AdminUser[] = [
  {
    id: "admin-default",
    username: "admin",
    password: "admin123",
    role: "superadmin",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function getAdminUsers(): AdminUser[] {
  if (typeof window === "undefined") return defaultAdminUsers;

  const raw = localStorage.getItem(ADMIN_USERS_KEY);

  if (!raw) {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaultAdminUsers));
    return defaultAdminUsers;
  }

  try {
    const users = JSON.parse(raw) as AdminUser[];
    return Array.isArray(users) && users.length ? users : defaultAdminUsers;
  } catch {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaultAdminUsers));
    return defaultAdminUsers;
  }
}

export function saveAdminUsers(users: AdminUser[]): AdminUser[] {
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  return users;
}

export function validateAdminLogin(username: string, password: string): AdminUser | null {
  const users = getAdminUsers();

  return (
    users.find(
      (user) =>
        user.active &&
        user.username.toLowerCase() === username.trim().toLowerCase() &&
        user.password === password
    ) || null
  );
}
