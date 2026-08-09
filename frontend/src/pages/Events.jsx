import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Clock, Bookmark, Users, Filter } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const categoryColors = {
  Technology: 'bg-indigo-100 text-indigo-700',
  Music: 'bg-pink-100 text-pink-700',
  Arts: 'bg-amber-100 text-amber-700',
  Sports: 'bg-emerald-100 text-emerald-700',
  Social: 'bg-purple-100 text-purple-700',
  Entrepreneurship: 'bg-red-100 text-red-700',
  Photography: 'bg-cyan-100 text-cyan-700',
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    params.set('upcoming', 'true');
    api.get(`/events?${params}`).then((r) => setEvents(r.data));
    api.get('/categories').then((r) => setCategories(r.data));
  }, [activeCategory]);

  const toggleBookmark = async (id) => {
    await api.post(`/events/${id}/bookmark`);
    refreshUser();
  };

  const toggleRsvp = async (id) => {
    await api.post(`/events/${id}/rsvp`);
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    params.set('upcoming', 'true');
    const { data } = await api.get(`/events?${params}`);
    setEvents(data);
    refreshUser();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-slate-500 text-sm">Discover and RSVP to campus events</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            !activeCategory ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Filter className="w-4 h-4 inline mr-1" />All
        </button>
        {categories.filter((c) => c.name !== 'More').map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.name ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => {
          const isBookmarked = user?.bookmarkedEvents?.some((e) => (e._id || e) === event._id);
          const isRsvpd = user?.rsvpEvents?.some((e) => (e._id || e) === event._id);
          const d = new Date(event.date);

          return (
            <div key={event._id} className="card overflow-hidden group hover:shadow-lg transition-shadow">
              <Link to={`/events/${event._id}`} className="block relative h-44 overflow-hidden">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[event.category] || 'bg-slate-100'}`}>
                  {event.category}
                </span>
                <button
                  onClick={(e) => { e.preventDefault(); toggleBookmark(event._id); }}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-lg hover:bg-white transition-all"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary-500 text-primary-500' : 'text-slate-600'}`} />
                </button>
              </Link>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-center bg-primary-50 dark:bg-primary-900/20 rounded-lg px-3 py-1">
                    <p className="text-xs text-primary-600 uppercase">{d.toLocaleString('en', { month: 'short' })}</p>
                    <p className="text-lg font-bold text-primary-600">{d.getDate()}</p>
                  </div>
                  <div>
                    <Link to={`/events/${event._id}`} className="font-bold hover:text-primary-600 transition-colors">{event.title}</Link>
                    <p className="text-xs text-slate-400 line-clamp-1">{event.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{event.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5" />{event.attendeeCount} attending
                  </span>
                  <button
                    onClick={() => toggleRsvp(event._id)}
                    className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                      isRsvpd ? 'bg-primary-100 text-primary-600' : 'btn-primary !py-2 !px-4'
                    }`}
                  >
                    {isRsvpd ? 'Going ✓' : 'RSVP'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No events found</p>
          <p className="text-sm">Try changing the category filter</p>
        </div>
      )}
    </div>
  );
}
