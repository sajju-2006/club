import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Event from './models/Event.js';
import Club from './models/Club.js';
import Category from './models/Category.js';
import Notification from './models/Notification.js';
import Message from './models/Message.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding...');

  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Club.deleteMany({}),
    Category.deleteMany({}),
    Notification.deleteMany({}),
    Message.deleteMany({}),
  ]);

  const password = await bcrypt.hash('password123', 12);

  const admin = await User.create({
    username: 'admin',
    email: 'admin@campus.edu',
    password,
    fullName: 'Campus Admin',
    department: 'Administration',
    role: 'admin',
    profilePic: 'https://i.pravatar.cc/150?u=admin',
  });

  const aarav = await User.create({
    username: 'aaravsharma',
    email: 'aarav@campus.edu',
    password,
    fullName: 'Aarav Sharma',
    department: 'Computer Science',
    profilePic: 'https://i.pravatar.cc/150?u=aarav',
    interests: ['Technology', 'Photography', 'Sports'],
  });

  const priya = await User.create({
    username: 'priyapatel',
    email: 'priya@campus.edu',
    password,
    fullName: 'Priya Patel',
    department: 'Business',
    profilePic: 'https://i.pravatar.cc/150?u=priya',
  });

  const categories = await Category.insertMany([
    { name: 'Technology', iconName: 'Cpu', colorTheme: '#6366f1', eventCount: 45 },
    { name: 'Music', iconName: 'Music', colorTheme: '#ec4899', eventCount: 32 },
    { name: 'Arts', iconName: 'Palette', colorTheme: '#f59e0b', eventCount: 28 },
    { name: 'Sports', iconName: 'Trophy', colorTheme: '#10b981', eventCount: 56 },
    { name: 'Social', iconName: 'Users', colorTheme: '#8b5cf6', eventCount: 40 },
    { name: 'Entrepreneurship', iconName: 'Rocket', colorTheme: '#ef4444', eventCount: 18 },
    { name: 'Photography', iconName: 'Camera', colorTheme: '#06b6d4', eventCount: 22 },
    { name: 'More', iconName: 'Grid3x3', colorTheme: '#64748b', eventCount: 15 },
  ]);

  const clubs = await Club.insertMany([
    {
      name: 'Code Club',
      slogan: 'Build. Learn. Innovate.',
      description: 'A community of passionate developers building the future.',
      category: 'Technology',
      logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop',
      memberCount: 1240,
      members: [aarav._id],
      president: aarav._id,
      featured: true,
    },
    {
      name: 'Photography Club',
      slogan: 'Capture Every Moment',
      description: 'Explore the art of visual storytelling through photography.',
      category: 'Photography',
      logoUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e57ee70?w=100&h=100&fit=crop',
      memberCount: 856,
      featured: true,
    },
    {
      name: 'Environmental Club',
      slogan: 'Green Campus Initiative',
      description: 'Making our campus sustainable, one project at a time.',
      category: 'Social',
      logoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop',
      memberCount: 620,
      featured: true,
    },
    {
      name: 'Debate Society',
      slogan: 'Voice Your Opinion',
      description: 'Sharpen your argumentation and public speaking skills.',
      category: 'Social',
      logoUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=100&h=100&fit=crop',
      memberCount: 430,
      featured: true,
    },
    {
      name: 'Music Ensemble',
      slogan: 'Harmony in Diversity',
      description: 'Join musicians of all skill levels for performances and jam sessions.',
      category: 'Music',
      logoUrl: 'https://images.unsplash.com/photo-1511379938545-c1f69419868d?w=100&h=100&fit=crop',
      memberCount: 780,
    },
    {
      name: 'Startup Hub',
      slogan: 'From Idea to Impact',
      description: 'Entrepreneurship community for aspiring founders.',
      category: 'Entrepreneurship',
      logoUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop',
      memberCount: 950,
    },
  ]);

  aarav.joinedClubs = [clubs[0]._id];
  await aarav.save();

  const now = new Date();
  await Event.insertMany([
    {
      title: 'Tech Fest 2025',
      description: 'Annual technology festival featuring hackathons, workshops, and keynote speakers.',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
      time: '10:00 AM',
      location: 'Main Auditorium',
      category: 'Technology',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=120&fit=crop',
      attendeeCount: 342,
      featured: true,
      organizer: aarav._id,
    },
    {
      title: 'Open Mic Night',
      description: 'Showcase your talent on stage — music, poetry, comedy, and more!',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8),
      time: '7:00 PM',
      location: 'Student Center',
      category: 'Music',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=120&fit=crop',
      attendeeCount: 128,
      featured: true,
    },
    {
      title: 'Inter-College Football',
      description: 'Cheer for our team in the championship finals!',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 12),
      time: '3:00 PM',
      location: 'Sports Complex',
      category: 'Sports',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=120&fit=crop',
      attendeeCount: 520,
      featured: true,
    },
    {
      title: 'Art Exhibition',
      description: 'Student artwork showcase featuring paintings, sculptures, and digital art.',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15),
      time: '11:00 AM',
      location: 'Gallery Hall',
      category: 'Arts',
      imageUrl: 'https://images.unsplash.com/photo-1460661414731-228af0f85b37?w=200&h=120&fit=crop',
      attendeeCount: 89,
    },
    {
      title: 'Startup Pitch Day',
      description: 'Present your startup idea to investors and mentors.',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20),
      time: '2:00 PM',
      location: 'Innovation Lab',
      category: 'Entrepreneurship',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=200&h=120&fit=crop',
      attendeeCount: 156,
    },
  ]);

  await Notification.insertMany([
    {
      userId: aarav._id,
      title: 'New Event',
      message: 'Tech Fest 2025 registration is now open!',
      type: 'event',
      link: '/events',
    },
    {
      userId: aarav._id,
      title: 'Club Update',
      message: 'Code Club has a new workshop this Friday.',
      type: 'club',
      link: '/clubs',
    },
    {
      userId: aarav._id,
      title: 'Welcome!',
      message: 'Welcome to Campus Hub! Explore events and clubs.',
      type: 'system',
    },
  ]);

  await Message.insertMany([
    {
      sender: priya._id,
      receiver: aarav._id,
      content: 'Hey Aarav! Are you going to Tech Fest this week?',
      read: false,
    },
    {
      sender: aarav._id,
      receiver: priya._id,
      content: 'Yes! I registered yesterday. You should come too!',
      read: true,
    },
    {
      sender: priya._id,
      receiver: aarav._id,
      content: 'Awesome, see you there!',
      read: false,
    },
  ]);

  console.log('Database seeded successfully!');
  console.log('Demo login: aarav@campus.edu / password123');
  console.log('Admin login: admin@campus.edu / password123');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
