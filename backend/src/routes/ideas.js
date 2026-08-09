import express from 'express';
import Idea from '../models/Idea.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const idea = await Idea.create({
      title,
      description,
      category,
      submittedBy: req.user.id,
    });
    res.status(201).json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', auth, adminOnly, async (_req, res) => {
  try {
    const ideas = await Idea.find({ status: 'pending' })
      .populate('submittedBy', 'fullName email department')
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const idea = await Idea.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
