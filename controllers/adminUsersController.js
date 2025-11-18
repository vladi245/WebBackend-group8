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
};
