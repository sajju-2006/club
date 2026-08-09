import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, ArrowLeft, Plus } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function formatMemberCount(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K+ Members`;
  return `${count}+ Members`;
}

export default function ClubDetail() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/clubs/${id}`)
      .then((r) => setClub(r.data))
      .catch(() => setClub(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isJoined = user?.joinedClubs?.some((c) => (c._id || c) === id);

  const toggleJoin = async () => {
    const { data } = await api.post(`/clubs/${id}/join`);
    setClub((prev) => ({ ...prev, memberCount: data.memberCount }));
    refreshUser();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-slate-400">Club not found</p>
        <Link to="/clubs" className="text-primary-600 text-sm mt-2 inline-block hover:underline">Back to Clubs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/clubs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Clubs
      </Link>

      <div className="card overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-6 mb-6">
            <img src={club.logoUrl} alt={club.name} className="w-24 h-24 rounded-2xl object-cover" />
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{club.name}</h1>
              <p className="text-slate-500 mb-2">{club.slogan}</p>
              <span className="inline-block text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                {club.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              {formatMemberCount(club.memberCount)}
            </span>
            {club.president && (
              <span>President: {club.president.fullName}</span>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">{club.description}</p>

          <button
            onClick={toggleJoin}
            className={`flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-xl transition-all ${
              isJoined
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30'
                : 'btn-primary'
            }`}
          >
            <Plus className={`w-4 h-4 ${isJoined ? 'rotate-45' : ''} transition-transform`} />
            {isJoined ? 'Leave Club' : 'Join Club'}
          </button>
        </div>
      </div>
    </div>
  );
}
