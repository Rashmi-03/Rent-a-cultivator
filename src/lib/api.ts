const API_BASE_URL = '/api';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
};

// Machines API
export const machinesAPI = {
  getAll: () => apiRequest('/machines'),
  
  getById: (id: string) => apiRequest(`/machines/${id}`),
  
  create: (machineData: any) =>
    apiRequest('/machines', {
      method: 'POST',
      body: JSON.stringify(machineData),
    }),
  
  update: (id: string, machineData: any) =>
    apiRequest(`/machines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(machineData),
    }),
  
  delete: (id: string) =>
    apiRequest(`/machines/${id}`, {
      method: 'DELETE',
    }),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => apiRequest('/bookings'),
  
  getById: (id: string) => apiRequest(`/bookings/${id}`),
  
  create: (bookingData: any) =>
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
  
  update: (id: string, bookingData: any) =>
    apiRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    }),
  
  updateStatus: (id: string, status: string) =>
    apiRequest(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  
  delete: (id: string) =>
    apiRequest(`/bookings/${id}`, {
      method: 'DELETE',
    }),
};

// User API
export const userAPI = {
  getProfile: () => apiRequest('/auth/profile'),
  
  updateProfile: (userData: any) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};
