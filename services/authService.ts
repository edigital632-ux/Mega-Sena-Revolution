import { User } from '../types';

const STORAGE_KEY = 'megasena_inteligente_users';
const SESSION_KEY = 'megasena_inteligente_session';

// Simula um banco de dados local
const getUsers = (): User[] => {
  const usersStr = localStorage.getItem(STORAGE_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const authService = {
  login: (email: string, password: string): User | null => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  register: (name: string, email: string, password: string): User => {
    const users = getUsers();
    
    if (users.some(u => u.email === email)) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // Nota: Em produção real, nunca salvar senhas em texto puro!
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    
    // Auto login após cadastro
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  }
};