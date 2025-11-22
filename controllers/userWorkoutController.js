import { UserWorkoutModel } from "../models/UserWorkout.js";


function getUserId(req) {
    if (req?.user?.id) return req.user.id;
    if (req?.body?.userId) return req.body.userId;
    if (req?.query?.userId) return req.query.userId;
    return null;
}

export const userWorkoutController = {


    addWorkoutEntry: async (req, res) => {
        try {
            //dont have the auth meged into it yet so keeping it like karolina for now when the auth boss is here we will cahnge it

            const userId = getUserId(req);
            if (!userId)
                return res.status(401).json({ error: "User not authenticated" });

            const { workoutId } = req.body;

            if (!workoutId)
                return res.status(400).json({ error: "workoutId is required" });

            const entry = await UserWorkoutModel.createWorkoutEntry({
                userId,
                workoutId,
            });

            const stats = await UserWorkoutModel.getTodayStats(userId);

            res.status(201).json({
                message: "Workout entry added",
                stats,
                entry,
            });
        } catch (err) {
            console.error("Error adding workout entry:", err);
            res
                .status(500)
                .json({ error: "Database error while adding workout entry" });
        }
    },




    removeWorkoutEntry: async (req, res) => {
        try {
            const userId = getUserId(req);
            if (!userId)
                return res.status(401).json({ error: "User not authenticated" });

            const { recordId } = req.body;

            if (!recordId)
                return res.status(400).json({ error: "recordId is required" });

            const deleted = await UserWorkoutModel.removeEntryById({
                userId,
                recordId,
            });

            if (!deleted)
                return res.status(404).json({ error: "Workout entry not found" });

            const stats = await UserWorkoutModel.getTodayStats(userId);

            res.json({
                message: "Workout entry removed",
                stats,
            });
        } catch (err) {
            console.error("Error removing workout entry:", err);
            res
                .status(500)
                .json({ error: "Database error while removing workout entry" });
        }
    },





    getTodayStats: async (req, res) => {
        try {
            const userId = getUserId(req);
            if (!userId)
                return res.status(401).json({ error: "User not authenticated" });

            const stats = await UserWorkoutModel.getTodayStats(userId);
            res.json(stats);
        } catch (err) {
            console.error("Error getting today's stats:", err);
            res
                .status(500)
                .json({ error: "Database error while getting stats" });
        }
    },






    getWorkouts: async (req, res) => {
        try {
            const userId = getUserId(req);
            if (!userId)
                return res.status(401).json({ error: "User not authenticated" });

            const workouts = await UserWorkoutModel.getWorkouts(userId);
            res.json(workouts);
        } catch (err) {
            console.error("Error getting workouts:", err);
            res
                .status(500)
                .json({ error: "Database error while getting workouts" });
        }
    },





    getWeeklyStats: async (req, res) => {
        try {
            const userId = getUserId(req);
            if (!userId)
                return res.status(401).json({ error: "User not authenticated" });

            const data = await UserWorkoutModel.getWeekStats(userId);

            res.json(data);
        } catch (err) {
            console.error("Error getting weekly stats:", err);
            res
                .status(500)
                .json({ error: "Database error while getting weekly stats" });
        }
    },
};