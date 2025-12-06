import pool from '../src/db.js';


export const DeskRecordModel = {
    createDeskRecord: async (deskId, userId, status) => {
        const res = await pool.query(
            `INSERT INTO desk_records (desk_id, user_id, status, timestamp) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING *`,
            [deskId, userId, status]
        );
        return res.rows[0] || null;
    },


    getDeskRecordsByUser: async (userId, startDate, endDate) => {
        const res = await pool.query(
            `SELECT * FROM desk_records 
            WHERE user_id = $1 
            AND timestamp >= $2 
            AND timestamp <= $3 
            ORDER BY timestamp ASC`,
            [userId, startDate, endDate]
        );
        return res.rows;
    },


    getLatestDeskRecord: async (userId) => {    
        const res = await pool.query(
            `SELECT * FROM desk_records 
            WHERE user_id = $1 
            ORDER BY timestamp DESC 
            LIMIT 1`,
            [userId]
        );
        return res.rows[0] || null;
    },

    /**
     * Calculate standing time per day for the last 7 days
     * Returns an array of { day: 'Mon', minutes: 45 } objects
     */
    getWeeklyStandingStats: async (userId) => {
        // Get records from the last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const records = await getDeskRecordsByUser(userId, startDate, endDate);

        // Initialize days array for the week
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekData = {};

        // Initialize all 7 days with 0 minutes
        for (let i = 0; i <= 6; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
            const dayName = dayNames[date.getDay()];
            weekData[dayKey] = { day: dayName, date: dayKey, minutes: 0 };
        }

        // Calculate standing time from status change records
        for (let i = 0; i < records.length; i++) {
            const record = records[i];

            // If this is a 'sitting' record, calculate time since last 'standing' record
            if (record.status === 'sitting' && i > 0) {
                // Find the previous 'standing' record
                let prevStandingRecord = null;
                for (let j = i - 1; j >= 0; j--) {
                    if (records[j].status === 'standing') {
                        prevStandingRecord = records[j];
                        break;
                    }
                }

                if (prevStandingRecord) {
                    const standingStart = new Date(prevStandingRecord.timestamp);
                    const standingEnd = new Date(record.timestamp);

                    // Calculate minutes for each day the standing period spans
                    let currentDay = new Date(standingStart);
                    currentDay.setHours(0, 0, 0, 0);

                    while (currentDay <= standingEnd) {
                        const dayKey = currentDay.toISOString().split('T')[0];

                        if (weekData[dayKey]) {
                            const dayStart = new Date(currentDay);
                            const dayEnd = new Date(currentDay);
                            dayEnd.setHours(23, 59, 59, 999);

                            const periodStart = standingStart > dayStart ? standingStart : dayStart;
                            const periodEnd = standingEnd < dayEnd ? standingEnd : dayEnd;

                            if (periodEnd > periodStart) {
                                const minutes = Math.round((periodEnd - periodStart) / 60000);
                                weekData[dayKey].minutes += minutes;
                            }
                        }

                        currentDay.setDate(currentDay.getDate() + 1);
                    }
                }
            }
        }

        // Check if currently standing (last record is 'standing')
        if (records.length > 0) {
            const lastRecord = records[records.length - 1];
            if (lastRecord.status === 'standing') {
                const standingStart = new Date(lastRecord.timestamp);
                const now = new Date();
                const todayKey = now.toISOString().split('T')[0];

                if (weekData[todayKey]) {
                    const todayStart = new Date(now);
                    todayStart.setHours(0, 0, 0, 0);

                    const effectiveStart = standingStart > todayStart ? standingStart : todayStart;
                    const minutes = Math.round((now - effectiveStart) / 60000);
                    weekData[todayKey].minutes += minutes;
                }
            }
        }

        // Convert to array ordered by date
        return Object.values(weekData).sort((a, b) => a.date.localeCompare(b.date));
    }

};


