import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, limit = 20, upcoming } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (upcoming === 'true') filter.date = { $gte: new Date() };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .limit(Number(limit))
      .populate('organizer', 'fullName profilePic');

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'fullName profilePic');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user.id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const user = await User.findById(req.user.id);
    const alreadyRsvp = user.rsvpEvents.includes(event._id);

    if (alreadyRsvp) {
      user.rsvpEvents = user.rsvpEvents.filter((id) => id.toString() !== event._id.toString());
      event.attendees = event.attendees.filter((id) => id.toString() !== req.user.id);
      event.attendeeCount = Math.max(0, event.attendeeCount - 1);
    } else {
      user.rsvpEvents.push(event._id);
      event.attendees.push(req.user.id);
      event.attendeeCount += 1;
    }

    await user.save();
    await event.save();
    res.json({ rsvp: !alreadyRsvp, attendeeCount: event.attendeeCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const eventId = req.params.id;
    const idx = user.bookmarkedEvents.findIndex((id) => id.toString() === eventId);

    if (idx >= 0) {
      user.bookmarkedEvents.splice(idx, 1);
    } else {
      user.bookmarkedEvents.push(eventId);
    }

    await user.save();
    res.json({ bookmarked: idx < 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
