import { FoodModel } from "../models/Food.js";

export const adminFoodsController = {
  getAllFoods: async (req, res) => {
    try {
      const foods = await FoodModel.getAll();
      res.json(foods);
    } catch (err) {
      console.error("Error getting foods:", err);
      res.status(500).json({ error: "Database error while getting foods" });
    }
  },

  createFood: async (req, res) => {
    try {
      const { name, calories_intake } = req.body;
      const food = await FoodModel.create({ name, calories_intake });
      res.json(food);
    } catch (err) {
      console.error("Error creating food:", err);
      res.status(500).json({ error: "Database error while creating food" });
    }
  },

  deleteFood: async (req, res) => {
    try {
      await FoodModel.deleteById(req.params.id);
      res.json({ message: "Food deleted" });
    } catch (err) {
      console.error("Error deleting food:", err);
      res.status(500).json({ error: "Database error while deleting food" });
    }
  }
};
