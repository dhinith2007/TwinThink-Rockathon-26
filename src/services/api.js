/**
 * ProcuraAI Backend API Client
 * Connects React frontend to FastAPI backend (Port 8000)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[ProcuraAI API] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // Procurement lifecycle
  async analyzeRequest(payload) {
    return this.request('/procurement/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getProcurementById(requestId) {
    return this.request(`/procurement/${requestId}`);
  }

  async simulateRelaxation(requestId, deliveryDays) {
    return this.request(`/procurement/${requestId}/simulate-relaxation`, {
      method: 'POST',
      body: JSON.stringify({ delivery_days: deliveryDays }),
    });
  }

  async getAuditTrail(requestId) {
    return this.request(`/procurement/${requestId}/audit`);
  }

  // Approvals & PO
  async approveDecision(requestId, payload) {
    return this.request(`/approvals/${requestId}/approve`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Catalog
  async getVendors() {
    return this.request('/vendors');
  }

  async getPolicies() {
    return this.request('/policies');
  }
}

export const api = new ApiClient();
export default api;
