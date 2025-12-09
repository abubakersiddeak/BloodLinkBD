import server from "./api";
export const userApi = {
  // Get all users with filters
  getAllUsers: async (params = {}) => {
    const response = await server.get("/api/user", { params });
    return response.data;
  },

  // Get single user
  getUserById: async (id) => {
    const response = await server.get(`/api/user/${id}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id, status) => {
    const response = await server.patch(`/api/user/${id}/status`, { status });
    return response.data;
  },

  // Update user role
  updateUserRole: async (id, role) => {
    const response = await server.patch(`/api/user/${id}/role`, { role });
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await server.delete(`/api/user/${id}`);
    return response.data;
  },
};
