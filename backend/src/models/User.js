import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    department: { type: String, default: 'Computer Science' },
    profilePic: { type: String, default: '' },
    bio: { type: String, default: '' },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
    bookmarkedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    rsvpEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    interests: [String],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
