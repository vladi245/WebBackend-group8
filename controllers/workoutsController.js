import { WorkoutRecordModel } from "../models/WorkoutRecord.js";

export const workoutsController = {
    // POST /api/workouts  -> body: { workout_id }
    addCompletedWorkout: async (req, res) => {
        try {
            const userId = req.user && req.user.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const { workout_id } = req.body;
            if (!workout_id) return res.status(400).json({ error: 'Missing workout_id' });

            const record = await WorkoutRecordModel.addRecord({ workout_id, user_id: userId });

            // Return updated stats and the newly created record
            const stats = await WorkoutRecordModel.getAggregatedStatsByUser(userId);
            res.json({ record, stats });
        } catch (err) {
            console.error('Error adding completed workout:', err);
            res.status(500).json({ error: 'Database error while adding workout record' });
        }
    },

    // GET /api/workouts -> list of user's completed workouts
    getUserWorkouts: async (req, res) => {
        try {
            const userId = req.user && req.user.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const records = await WorkoutRecordModel.getRecordsByUser(userId);
            res.json(records);
        } catch (err) {
            console.error('Error getting user workouts:', err);
            res.status(500).json({ error: 'Database error while fetching workout records' });
        }
    },

    // GET /api/workouts/stats -> aggregated stats and daily series
    getUserStats: async (req, res) => {
        try {
            const userId = req.user && req.user.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const stats = await WorkoutRecordModel.getAggregatedStatsByUser(userId);
            // model already returns normalized `daily` series and counts by-day
            res.json(stats);
        } catch (err) {
            console.error('Error getting user stats:', err);
            res.status(500).json({ error: 'Database error while computing stats' });
        }
    }
    ,

    deleteRecord: async (req, res) => {
        try {
            const userId = req.user && req.user.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const recordId = parseInt(req.params.id, 10);
            if (!recordId) return res.status(400).json({ error: 'Missing record id' });

            await WorkoutRecordModel.deleteById(recordId, userId);
            const stats = await WorkoutRecordModel.getAggregatedStatsByUser(userId);
            res.json({ message: 'Deleted', stats });
        } catch (err) {
            console.error('Error deleting workout record:', err);
            res.status(500).json({ error: 'Database error while deleting record' });
        }
    }
};
