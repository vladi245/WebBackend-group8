import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password, type } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'name, email and password are required' });
            }

            const existing = await UserModel.findByEmail(email);
            if (existing) return res.status(409).json({ error: 'Email already in use' });

            const password_hash = await bcrypt.hash(password, 10);
            const created = await UserModel.create({ name, email, password_hash, type });

            const token = jwt.sign({ id: created.id, email: created.email, type: created.type }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            res.json({ user: created, token });
        } catch (err) {
            console.error('Register error:', err);
            res.status(500).json({ error: 'Server error during register' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'email and password required' });

            const user = await UserModel.findByEmail(email);
            if (!user) return res.status(401).json({ error: 'Invalid credentials' });

            const ok = await bcrypt.compare(password, user.password_hash);
            if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, email: user.email, type: user.type }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            // return safe user object (omit password_hash)
            const safeUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                type: user.type,
                current_desk_id: user.current_desk_id,
                standing_height: user.standing_height,
                sitting_height: user.sitting_height,
                created_at: user.created_at
            };

            res.json({ user: safeUser, token });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: 'Server error during login' });
        }
    }
    ,

    me: async (req, res) => {
        try {
            const userId = req.user && req.user.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });
            const user = await (await import('../models/User.js')).UserModel.getById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json({ user });
        } catch (err) {
            console.error('Me error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
};
