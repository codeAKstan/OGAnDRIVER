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
   * Update a vehicle
   * @param {string} vehicleId - Vehicle UUID
   * @param {object} data - Partial data to update
   * @returns {Promise} Updated vehicle
   */
  async updateVehicle(vehicleId, data) {
    return this.request(`/vehicles/${vehicleId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Check API health
   * @returns {Promise} Health check response
   */
  async healthCheck() {
    return this.request('/health/');
  }

  /**
   * Get recent activity for a driver
   * @param {string} driverId - Driver UUID
   * @returns {Promise<Array>} List of activity items
   */
  async getRecentActivity(driverId) {
    const qp = driverId ? `?driver=${encodeURIComponent(driverId)}` : '';
    const res = await this.request(`/recent-activity/${qp}`);
    return res.items || [];
  }

  /**
   * Submit or update KYC information for a driver
   * @param {object} kycData - KYC payload including user id and fields
   * @returns {Promise<object>} KYC submission response
   */
  async submitKYC(kycData) {
    return this.request('/kyc/submit/', {
      method: 'POST',
      body: JSON.stringify(kycData),
    });
  }

  /**
   * Get current KYC status for a driver
   * @param {string} userId - Driver UUID
   * @returns {Promise<object>} { status, kyc? }
   */
  async getKYCStatus(userId) {
    const qp = userId ? `?user=${encodeURIComponent(userId)}` : '';
    return this.request(`/kyc/status/${qp}`);
  }

  /**
   * Get logistic credit risk metrics for a driver
   * @param {string} userId - Driver UUID
   * @param {string} [vehicleId] - Optional Vehicle UUID
   * @returns {Promise<object>} { probability, score, category }
   */
  async getCreditRiskScore(userId, vehicleId) {
    const qp = `?user=${encodeURIComponent(userId)}${vehicleId ? `&vehicle=${encodeURIComponent(vehicleId)}` : ''}`;
    return this.request(`/risk/score/${qp}`);
  }

  /**
   * Submit a driver application for a vehicle
   * @param {object} data - { applicant, vehicle }
   * @returns {Promise<object>} { application }
   */
  async submitApplication(data) {
    return this.request('/applications/submit/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get a driver application by id
   * @param {string} id - Application UUID
   * @returns {Promise<object>} Application details
   */
  async getApplication(id) {
    return this.request(`/applications/${id}/`);
  }

  /**
   * Update application status (APPROVED or REJECTED)
   * @param {string} applicationId - Application UUID
   * @param {('APPROVED'|'REJECTED')} status - New status
   * @returns {Promise<object>} { application }
   */
  async updateApplicationStatus(applicationId, status) {
    return this.request(`/applications/${applicationId}/status/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Get all applications for an owner's vehicles
   * @param {string} ownerId - Owner UUID
   * @returns {Promise<{items: Array, count: number}>}
   */
  async getOwnerApplications(ownerId) {
    const qp = ownerId ? `?owner=${encodeURIComponent(ownerId)}` : '';
    return this.request(`/applications/owner/${qp}`);
  }

  /**
   * Get notifications for a user
   * @param {string} userId - User UUID
   * @returns {Promise<{items: Array, count: number}>}
   */
  async getNotifications(userId) {
    const qp = userId ? `?user=${encodeURIComponent(userId)}` : '';
    return this.request(`/notifications/${qp}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const { registerUser, loginUser, logoutUser, healthCheck } = apiService;