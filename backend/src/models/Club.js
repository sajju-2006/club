import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slogan: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, required: true },
    logoUrl: { type: String, default: '' },
    memberCount: { type: Number, default: 0 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    president: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Club', clubSchema);
