import express from 'express';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'fullName profilePic')
      .populate('receiver', 'fullName profilePic');

    const conversations = new Map();
    for (const msg of messages) {
      const otherId =
        msg.sender._id.toString() === req.user.id
          ? msg.receiver._id.toString()
          : msg.sender._id.toString();
      if (!conversations.has(otherId)) {
        conversations.set(otherId, {
          user: msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender,
          lastMessage: msg,
          unread: msg.receiver._id.toString() === req.user.id && !msg.read ? 1 : 0,
        });
      }
    }

    res.json(Array.from(conversations.values()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({ receiver: req.user.id, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'fullName profilePic')
      .populate('receiver', 'fullName profilePic');

    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    const populated = await message.populate([
      { path: 'sender', select: 'fullName profilePic' },
      { path: 'receiver', select: 'fullName profilePic' },
    ]);

    const io = req.app.get('io');
    io.to(receiverId).emit('newMessage', populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
