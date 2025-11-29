const express = require('express');
const router = express.Router();
const { getAllDesks, getDeskById, createDesk, updateDeskHeight } = require('../models/Desk');

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
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

        const desk = await getDeskById(id);
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
        const parsedId = Number(id);

        if (!Number.isFinite(parsedHeight)) {
            return res.status(400).json({ error: 'height must be a numeric value' });
        }

        if (!Number.isInteger(parsedHeight) || parsedHeight < 0) {
            return res.status(400).json({ error: 'height must be a non-negative integer' });
        }

        if (!Number.isFinite(parsedId)) {
            return res.status(400).json({ error: 'id must be a numeric value' });
        }

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({ error: 'id must be a positive integer' });
        }

        const createdDesk = await createDesk({ id: parsedId, height: parsedHeight });
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
        const id = parseInt(req.params.id, 10);
        const { height } = req.body;

        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
        if (typeof height !== 'number') return res.status(400).json({ error: 'height must be a number' });

        const updated = await updateDeskHeight(id, height);
        if (!updated) return res.status(404).json({ error: 'Desk not found' });
        res.json(updated);
    } catch (err) {
        console.error('Failed to update desk', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
