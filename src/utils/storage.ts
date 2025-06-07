import { User, TestResult } from '../types';

const USERS_KEY =  import.meta.env.VITE_USERS_KEY;
const CURRENT_USER_KEY = import.meta.env.VITE_CURRENT_USER_KEY;
const RESULTS_KEY = import.meta.env.VITE_RESULTS_KEY;

export const storage = {
  // User management
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Results management
  getResults(userId?: string): TestResult[] {
    const results = localStorage.getItem(RESULTS_KEY);
    const allResults: TestResult[] = results ? JSON.parse(results) : [];
    
    if (userId) {
      return allResults.filter(result => result.userId === userId);
    }
    
    return allResults;
  },

  saveResult(result: TestResult): void {
    const results = this.getResults();
    results.push(result);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  },

  // Authentication helpers
  findUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  },

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    this.saveUser(user);
    return user;
  }
};