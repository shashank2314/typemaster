const API_BASE_URL  = import.meta.env.VITE_API_BASE_URL;
class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async register(username: string, email: string, password: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Test results methods
  async saveResult(result: {
    config: any;
    wpm: number;
    accuracy: number;
    correctChars: number;
    incorrectChars: number;
    totalChars: number;
    timeSpent: number;
    text: string;
  }) {
    return this.request('/results', {
      method: 'POST',
      body: JSON.stringify(result),
    });
  }

  async getResults(limit = 50, offset = 0) {
    return this.request(`/results?limit=${limit}&offset=${offset}`);
  }

  // Statistics methods
  async getStats() {
    return this.request('/stats');
  }

  // Preferences methods
  async getPreferences() {
    return this.request('/preferences');
  }

  async updatePreferences(preferences: {
    theme?: string;
    fontSize?: string;
    soundEffects?: boolean;
    goalWpm?: number;
  }) {
    return this.request('/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();