import { ContactMessageModel } from "../models/ContactMessageModel.js";

export const contactMessagesController = {
    createMessage: async (req, res) => {
        try {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const newMsg = await ContactMessageModel.create({ name, email, message });

            res.status(201).json({
                message: "Message received",
                data: newMsg
            });
        } catch (err) {
            console.error("Error creating contact message:", err);
            res.status(500).json({ error: "Database error while saving message" });
        }
    },

    getAllMessages: async (req, res) => {
        try {
            const messages = await ContactMessageModel.getAll();
            res.json(messages);
        } catch (err) {
            console.error("Error getting contact messages:", err);
            res.status(500).json({ error: "Database error while fetching messages" });
        }
    }
};
