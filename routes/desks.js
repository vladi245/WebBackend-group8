import express from 'express';
import { getAllDesks, getDeskById, createDesk, updateDeskHeight } from '../models/Desk.js';
import { createDeskRecord, getWeeklyStandingStats, getLatestDeskRecord } from '../models/DeskRecord.js';

const router = express.Router();

// GET /desks - list all desks (mounted under /api)
router.get('/desks', async (req, res) => {
    try {
        const desks = await getAllDesks();
        res.json(desks);
    } catch (err) {
        console.error('Failed to fetch desks', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET /desks/:id - get a single desk by id
router.get('/desks/:id', async (req, res) => {
    try {
        const deskId = typeof req.params.id === 'string' ? req.params.id.trim() : '';
        if (!deskId) return res.status(400).json({ error: 'Invalid id' });

        const desk = await getDeskById(deskId);
        if (!desk) return res.status(404).json({ error: 'Desk not found' });
        res.json(desk);
    } catch (err) {
        console.error('Failed to fetch desk', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST /desks - create a new desk
router.post('/desks', async (req, res) => {
    try {
        const { id, height } = req.body;
        const parsedHeight = Number(height);
        const deskId = id !== undefined && id !== null ? String(id).trim() : '';

        if (!Number.isFinite(parsedHeight)) {
            return res.status(400).json({ error: 'height must be a numeric value' });
        }

        if (!Number.isInteger(parsedHeight) || parsedHeight < 0) {
            return res.status(400).json({ error: 'height must be a non-negative integer' });
        }

        if (!deskId) {
            return res.status(400).json({ error: 'id must be a non-empty string' });
        }

        const createdDesk = await createDesk({ id: deskId, height: parsedHeight });
        res.status(201).json(createdDesk);
    } catch (err) {
        console.error('Failed to create desk', err);

        if (err.code === '23505') {
            return res.status(409).json({ error: 'Desk id already exists' });
        }

        res.status(500).json({ error: 'Database error' });
    }
});

// PUT /desks/:id/height - update desk height
router.put('/desks/:id/height', async (req, res) => {
    try {
        const deskId = typeof req.params.id === 'string' ? req.params.id.trim() : '';
        const { height } = req.body;
        const parsedHeight = Number(height);

        if (!deskId) return res.status(400).json({ error: 'Invalid id' });

        if (!Number.isFinite(parsedHeight)) {
            return res.status(400).json({ error: 'height must be a numeric value' });
        }

        if (!Number.isInteger(parsedHeight) || parsedHeight < 0) {
            return res.status(400).json({ error: 'height must be a non-negative integer' });
        }

        const updated = await updateDeskHeight(deskId, parsedHeight);
        if (!updated) return res.status(404).json({ error: 'Desk not found' });
        res.json(updated);
    } catch (err) {
        console.error('Failed to update desk', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST /desks/records - create a new desk status record (standing/sitting change)
router.post('/desks/records', async (req, res) => {
    try {
        const { deskId, userId, status } = req.body;

        if (!deskId || typeof deskId !== 'string') {
            return res.status(400).json({ error: 'deskId must be a non-empty string' });
        }

        const parsedUserId = Number(userId);
        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            return res.status(400).json({ error: 'userId must be a positive integer' });
        }

        if (!status || !['standing', 'sitting'].includes(status)) {
            return res.status(400).json({ error: 'status must be "standing" or "sitting"' });
        }

        const record = await createDeskRecord(deskId.trim(), parsedUserId, status);
        res.status(201).json(record);
    } catch (err) {
        console.error('Failed to create desk record', err);

        if (err.code === '23503') {
            return res.status(404).json({ error: 'Desk or user not found' });
        }

        res.status(500).json({ error: 'Database error' });
    }
});

// GET /desks/records/stats - get weekly standing stats for a user
router.get('/desks/records/stats', async (req, res) => {
    try {
        const { userId } = req.query;
        const parsedUserId = Number(userId);

        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            return res.status(400).json({ error: 'userId must be a positive integer' });
        }

        const stats = await getWeeklyStandingStats(parsedUserId);
        res.json(stats);
    } catch (err) {
        console.error('Failed to get standing stats', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET /desks/records/latest - get the latest desk record for a user
router.get('/desks/records/latest', async (req, res) => {
    try {
        const { userId } = req.query;
        const parsedUserId = Number(userId);

        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            return res.status(400).json({ error: 'userId must be a positive integer' });
        }

        const record = await getLatestDeskRecord(parsedUserId);
        if (!record) {
            return res.json({ status: null, message: 'No desk records found' });
        }
        res.json(record);
    } catch (err) {
        console.error('Failed to get latest desk record', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
