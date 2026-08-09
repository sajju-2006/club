import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Users, Search } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function formatMemberCount(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K+ Members`;
  return `${count}+ Members`;
}

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    params.set('limit', '50');
    const qs = params.toString();
    api.get(`/clubs${qs ? `?${qs}` : ''}`).then((r) => setClubs(r.data));
  }, [search, category]);

  const toggleJoin = async (clubId) => {
    await api.post(`/clubs/${clubId}/join`);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    params.set('limit', '50');
    const qs = params.toString();
    const { data } = await api.get(`/clubs${qs ? `?${qs}` : ''}`);
    setClubs(data);
    refreshUser();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clubs</h1>
          <p className="text-slate-500 text-sm">
            {category ? `Showing ${category} clubs` : 'Find and join campus clubs'}
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clubs.map((club) => {
          const isJoined = user?.joinedClubs?.some((c) => (c._id || c) === club._id);
          return (
            <Link key={club._id} to={`/clubs/${club._id}`} className="card p-6 hover:shadow-lg transition-shadow block">
              <div className="flex items-start gap-4 mb-4">
                <img src={club.logoUrl} alt={club.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{club.name}</h3>
                  <p className="text-sm text-slate-400">{club.slogan}</p>
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 mt-1">
                    {club.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{club.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Users className="w-4 h-4" />
                  {formatMemberCount(club.memberCount)}
                </span>
                <button
                  onClick={(e) => { e.preventDefault(); toggleJoin(club._id); }}
                  className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                    isJoined
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30'
                      : 'btn-primary !py-2 !px-4'
                  }`}
                >
                  <Plus className={`w-4 h-4 ${isJoined ? 'rotate-45' : ''} transition-transform`} />
                  {isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            </Link>
          );
        })}
      </div>

      {clubs.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No clubs found</p>
          <p className="text-sm">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
