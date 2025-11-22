import { UserModel } from "../models/User.js";

export const adminUsersController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getAll();
      res.json(users);
    } catch (err) {
      console.error("Error getting users:", err);
      res.status(500).json({ error: "Database error while getting users" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await UserModel.deleteById(req.params.id);
      res.json({ message: "User deleted" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Database error while deleting user" });
    }
  }
  ,
  changeUserType: async (req, res) => {
    try {
      const { type } = req.body;
      const allowed = ["standard", "premium"];
      if (!type || !allowed.includes(type)) {
        return res.status(400).json({ error: "Invalid type. Allowed: standard, premium" });
      }

      const updated = await UserModel.updateType(req.params.id, type);
      if (!updated) return res.status(404).json({ error: 'User not found' });
      res.json({ user: updated });
    } catch (err) {
      console.error('Error changing user type:', err);
      res.status(500).json({ error: 'Database error while changing user type' });
    }
  }
};
