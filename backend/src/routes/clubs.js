import express from 'express';
import Club from '../models/Club.js';
import User from '../models/User.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, limit = 20, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slogan: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const clubs = await Club.find(filter)
      .sort({ memberCount: -1 })
      .limit(Number(limit))
      .populate('president', 'fullName profilePic');

    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('president', 'fullName profilePic');
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/join', auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const user = await User.findById(req.user.id);
    const alreadyJoined = user.joinedClubs.includes(club._id);

    if (alreadyJoined) {
      user.joinedClubs = user.joinedClubs.filter((id) => id.toString() !== club._id.toString());
      club.members = club.members.filter((id) => id.toString() !== req.user.id);
      club.memberCount = Math.max(0, club.memberCount - 1);
    } else {
      user.joinedClubs.push(club._id);
      club.members.push(req.user.id);
      club.memberCount += 1;
    }

    await user.save();
    await club.save();
    res.json({ joined: !alreadyJoined, memberCount: club.memberCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
