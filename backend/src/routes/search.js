import express from 'express';
import Event from '../models/Event.js';
import Club from '../models/Club.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ events: [], clubs: [], people: [] });
    }

    const regex = { $regex: q, $options: 'i' };

    const [events, clubs, people] = await Promise.all([
      Event.find({ $or: [{ title: regex }, { description: regex }] }).limit(5),
      Club.find({ $or: [{ name: regex }, { slogan: regex }] }).limit(5),
      User.find({ $or: [{ fullName: regex }, { username: regex }] })
        .select('fullName department profilePic username')
        .limit(5),
    ]);

    res.json({ events, clubs, people });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
