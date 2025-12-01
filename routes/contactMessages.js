import express from "express";
import { contactMessagesController } from "../controllers/contactMessagesController.js";

const router = express.Router();

router.post("/", contactMessagesController.createMessage);
router.get("/", contactMessagesController.getAllMessages);

export default router;
