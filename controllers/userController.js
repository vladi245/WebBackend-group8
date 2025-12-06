import { UserModel } from "../models/User.js";

export const userController = {
    // GET /users
    getAll: async (req, res) => {
        try {
            const users = await UserModel.getAll();
            res.json(users);
        } catch (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({ error: "Database error" });
        }
    },

    // PUT /users/:id/name
    updateName: async (req, res) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const { name } = req.body;

            if (!userId || isNaN(userId)) {
                return res.status(400).json({ error: "Invalid user ID" });
            }

            if (!name || typeof name !== "string" || !name.trim()) {
                return res.status(400).json({ error: "Name is required" });
            }

            const updated = await UserModel.updateName(userId, name.trim());
            if (!updated) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json(updated);
        } catch (err) {
            console.error("Error updating user name:", err);
            res.status(500).json({ error: "Database error" });
        }
    },

    // GET /users/:id/height
    getUserHeight: async (req, res) => {
        try {
            const userId = parseInt(req.params.id, 10);

            if (!userId || isNaN(userId)) {
                return res.status(400).json({ error: "Invalid user ID" });
            }

            const height = await UserModel.getUserHeight(userId);
            res.json({ user_height: height });
        } catch (err) {
            console.error("Error fetching user height:", err);
            res.status(500).json({ error: "Database error" });
        }
    },

    // PUT /users/:id/heightsave
    updateUserHeight: async (req, res) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const { height } = req.body;

            if (!userId || isNaN(userId)) {
                return res.status(400).json({ error: "Invalid user ID" });
            }

            if (height === undefined || height === null || isNaN(height)) {
                return res.status(400).json({ error: "Height is required and must be a number" });
            }

            const heightNum = parseInt(height);
            if (heightNum < 100 || heightNum > 250) {
                return res.status(400).json({ error: "Height must be between 100 and 250 cm" });
            }

            const updated = await UserModel.updateUserHeight(userId, heightNum);
            if (!updated) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json({ success: true, user_height: updated.user_height });
        } catch (err) {
            console.error("Error updating user height:", err);
            res.status(500).json({ error: "Database error" });
        }
    }
};
