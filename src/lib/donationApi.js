// lib/donationApi.js
import server from "./api";

export const donationApi = {
  // Get all donation requests (role-based)
  getAllDonations: async (params = {}) => {
    const response = await server.get("/api/donations", { params });
    return response.data;
  },

  // Get only user's donation requests
  getMyDonations: async (params = {}) => {
    const response = await server.get("/api/donations/my-requests", { params });
    return response.data;
  },

  // Get single donation request
  getDonationById: async (id) => {
    const response = await server.get(`/api/donations/${id}`);
    return response.data;
  },

  // Create donation request
  createDonation: async (data) => {
    const response = await server.post("/api/donations", data);
    return response.data;
  },

  // Update donation status
  updateDonationStatus: async (id, status) => {
    const response = await server.patch(`/api/donations/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Delete donation request
  deleteDonation: async (id) => {
    const response = await server.delete(`/api/donations/${id}`);
    return response.data;
  },
};
