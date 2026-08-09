import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Users, Bookmark, ArrowLeft, Calendar } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const categoryColors = {
  Technology: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  Music: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  Arts: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Sports: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Social: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Entrepreneurship: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Photography: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
};

export default function EventDetail() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((r) => setEvent(r.data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isBookmarked = user?.bookmarkedEvents?.some((e) => (e._id || e) === id);
  const isRsvpd = user?.rsvpEvents?.some((e) => (e._id || e) === id);

  const toggleBookmark = async () => {
    await api.post(`/events/${id}/bookmark`);
    refreshUser();
  };

  const toggleRsvp = async () => {
    const { data } = await api.post(`/events/${id}/rsvp`);
    setEvent((prev) => ({ ...prev, attendeeCount: data.attendeeCount }));
    refreshUser();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-slate-400">Event not found</p>
        <Link to="/events" className="text-primary-600 text-sm mt-2 inline-block hover:underline">Back to Events</Link>
      </div>
    );
  }

  const d = new Date(event.date);

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/events" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      <div className="card overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <span className={`absolute top-4 left-4 text-xs px-3 py-1 rounded-full font-medium ${categoryColors[event.category] || 'bg-slate-100'}`}>
            {event.category}
          </span>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h1>
              {event.organizer && (
                <p className="text-sm text-slate-500">
                  Organized by {event.organizer.fullName}
                </p>
              )}
            </div>
            <button
              onClick={toggleBookmark}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-primary-500 text-primary-500' : 'text-slate-400'}`} />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              {d.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-500" />{event.time}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" />{event.location}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />{event.attendeeCount} attending
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">{event.description}</p>

          <button
            onClick={toggleRsvp}
            className={`text-sm font-medium px-6 py-3 rounded-xl transition-all ${
              isRsvpd ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30' : 'btn-primary'
            }`}
          >
            {isRsvpd ? 'Going ✓ — Cancel RSVP' : 'RSVP to this Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
