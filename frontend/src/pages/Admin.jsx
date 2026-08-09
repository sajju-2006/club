import { useState, useEffect } from 'react';
import { Lightbulb, Check, X, Clock } from 'lucide-react';
import api from '../services/api';

export default function Admin() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIdeas = () => {
    api.get('/ideas')
      .then((r) => setIdeas(r.data))
      .catch((err) => setError(err.response?.data?.message || 'Access denied'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/ideas/${id}/status`, { status });
    setIdeas((prev) => prev.filter((i) => i._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-slate-400">{error}</p>
        <p className="text-sm text-slate-400 mt-2">Admin access required. Login as admin@campus.edu</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Idea Review</h1>
        <p className="text-slate-500 text-sm">Review and approve club/event proposals</p>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-16 text-slate-400 card">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No pending ideas to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <div key={idea._id} className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-lg">{idea.title}</h3>
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 mt-1">
                    {idea.category}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {new Date(idea.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{idea.description}</p>

              {idea.submittedBy && (
                <p className="text-xs text-slate-400 mb-4">
                  Submitted by {idea.submittedBy.fullName} ({idea.submittedBy.email}) · {idea.submittedBy.department}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(idea._id, 'approved')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => updateStatus(idea._id, 'rejected')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm font-medium transition-all"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
