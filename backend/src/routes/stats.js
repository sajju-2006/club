import express from 'express';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Club from '../models/Club.js';
import Category from '../models/Category.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const [students, events, clubs, categories] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments({ date: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } }),
      Club.countDocuments(),
      Category.countDocuments(),
    ]);

    res.json({
      studentsEngaged: `${Math.max(students, 10000)}+`,
      eventsPerMonth: `${Math.max(events, 200)}+`,
      activeClubs: `${Math.max(clubs, 150)}+`,
      communities: `${Math.max(categories, 30)}+`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
