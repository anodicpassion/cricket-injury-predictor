const API_BASE_URL = 'http://localhost:5500';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
}

export interface PredictionData {
  age: number;
  playerRole: string;
  playerType: string;
  bmi: number;
  matchesLastWeek: number;
  matchesLastMonth: number;
  ballsFacedLastMatch: number;
  acuteWorkload: number;
  chronicWorkload: number;
  injuriesLast30d: number;
  restDays: number;
  travelLoad: string;
  matchFormat: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async login(data: LoginData) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  }

  async register(data: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  }

  async predict(data: PredictionData) {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Prediction failed');
    }
    
    return response.json();
  }
}

export const apiService = new ApiService();