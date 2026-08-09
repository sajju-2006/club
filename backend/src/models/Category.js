import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  iconName: { type: String, required: true },
  colorTheme: { type: String, default: '#7c3aed' },
  eventCount: { type: Number, default: 0 },
});

export default mongoose.model('Category', categorySchema);
