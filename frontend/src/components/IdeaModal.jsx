import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

export default function IdeaModal({ onClose }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'General' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/ideas', form);
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch {
      alert('Failed to submit idea. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Idea Submitted!</h3>
            <p className="text-sm text-slate-500">We'll review your proposal and get back to you soon.</p>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg mb-1">Submit Your Idea</h3>
            <p className="text-sm text-slate-500 mb-6">Propose a new club or event for campus</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. Robotics Club"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Tell us about your idea..."
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  {['General', 'Technology', 'Music', 'Arts', 'Sports', 'Social', 'Entrepreneurship', 'Photography'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Submitting...' : 'Submit Idea'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
