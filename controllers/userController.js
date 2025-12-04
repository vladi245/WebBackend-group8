import { UserModel } from "../models/User.js";

export const userController = {
    getUserHeight: async (req, res) => {
        try {

            const userId = req.params.id;

            if (!userId || isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            const userHeight = await UserModel.getUserHeight(parseInt(userId));

            res.json({ user_height: userHeight });
        } catch (err) {
            console.error('Error fetching user height:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    updateUserHeight: async (req, res) => {
        try {

            const userId = req.params.id;
            const { height } = req.body;

            if (!userId || isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            if (height === undefined || height === null || isNaN(height)) {
                return res.status(400).json({ error: 'Height is required and must be a number' });
            }

            const heightNum = parseInt(height);
            if (heightNum < 100 || heightNum > 250) {
                return res.status(400).json({ error: 'Height must be between 100 and 250 cm' });
            }

            const updatedUser = await UserModel.updateUserHeight(parseInt(userId), heightNum);
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ success: true, user_height: updatedUser.user_height });
        } catch (err) {
            console.error('Error updating user height:', err);
            res.status(500).json({ error: 'Database error' });
        }
    }
};