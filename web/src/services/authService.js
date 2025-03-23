// web/src/services/authService.js

// Check if user is authenticated
export const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  };
  
  // Get user information
  export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  
  // Login function
  export const login = (username, password) => {
    // In a real app, this would make an API call
    return new Promise((resolve, reject) => {
      // Simple validation for demo
      if (!username || !password) {
        reject(new Error('Please enter both username and password'));
        return;
      }
  
      // For demo purposes, use hardcoded credentials
      if (username === 'admin' && password === 'admin123') {
        // Store authentication token
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
        resolve({ username, role: 'admin' });
      } else {
        reject(new Error('Invalid username or password'));
      }
    });
  };
  
  // Logout function
  export const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };
  
  export default {
    isAuthenticated,
    getUser,
    login,
    logout
  };