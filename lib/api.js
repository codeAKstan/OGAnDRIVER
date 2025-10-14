const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * API service for handling backend requests
 */
class ApiService {
  /**
   * Make a request to the API
   * @param {string} endpoint - API endpoint
   * @param {object} options - Request options
   * @returns {Promise} Response data
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData - let browser handle it
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : await response.text().catch(() => '');
      
      if (!response.ok) {
        // Handle different error response formats from Django
        const errorMessage = (payload && typeof payload === 'object')
          ? (payload.error || payload.message || payload.detail || `HTTP error! status: ${response.status}`)
          : (typeof payload === 'string' && payload.trim().length > 0
              ? payload
              : `HTTP error! status: ${response.status}`);
        throw new Error(errorMessage);
      }
      
      return payload;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise} Registration response
   */
  async registerUser(userData) {
    return this.request('/signup/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Login user
   * @param {object} credentials - Login credentials (email, password)
   * @returns {Promise} Login response with user data and role
   */
  async loginUser(credentials) {
    return this.request('/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Logout user
   * @returns {Promise} Logout response
   */
  async logoutUser() {
    return this.request('/logout/', {
      method: 'POST',
    });
  }

  /**
   * Add a new vehicle
   * @param {object} vehicleData - Vehicle data including photo_url
   * @returns {Promise} Add vehicle response
   */
  async addVehicle(vehicleData) {
    return this.request('/vehicles/', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  /**
   * Get vehicles for an owner
   * @param {string} ownerId - Owner UUID
   * @returns {Promise<Array>} List of vehicles
   */
  async getVehicles(ownerId) {
    const qp = ownerId ? `?owner=${encodeURIComponent(ownerId)}` : '';
    return this.request(`/vehicles/${qp}`);
  }

  /**
   * Check API health
   * @returns {Promise} Health check response
   */
  async healthCheck() {
    return this.request('/health/');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const { registerUser, loginUser, logoutUser, healthCheck } = apiService;