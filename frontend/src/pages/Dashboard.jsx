import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Clock, Bookmark, Plus, Lightbulb, ArrowRight,
  Cpu, Music, Palette, Trophy, Users, Rocket, Camera, Grid3x3,
  GraduationCap, Calendar, Building2, Globe,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import IdeaModal from '../components/IdeaModal';

const iconMap = {
  Cpu, Music, Palette, Trophy, Users, Rocket, Camera, Grid3x3,
};

const categoryColors = {
  Technology: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  Music: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  Arts: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Sports: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Social: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Entrepreneurship: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Photography: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
};

function formatMemberCount(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K+ Members`;
  return `${count}+ Members`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleString('en', { month: 'short' }),
    day: d.getDate(),
  };
}

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [showIdeaModal, setShowIdeaModal] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/events/upcoming'),
      api.get('/clubs?featured=true&limit=4'),
      api.get('/categories'),
      api.get('/stats'),
    ]).then(([ev, cl, cat, st]) => {
      setEvents(ev.data);
      setClubs(cl.data);
      setCategories(cat.data);
      setStats(st.data);
    });
  }, []);

  const toggleBookmark = async (eventId) => {
    await api.post(`/events/${eventId}/bookmark`);
    refreshUser();
  };

  const toggleJoinClub = async (clubId) => {
    await api.post(`/clubs/${clubId}/join`);
    const { data } = await api.get('/clubs?featured=true&limit=4');
    setClubs(data);
    refreshUser();
  };

  const statItems = [
    { icon: GraduationCap, label: 'Students Engaged', value: stats.studentsEngaged || '10K+' },
    { icon: Calendar, label: 'Events Every Month', value: stats.eventsPerMonth || '200+' },
    { icon: Building2, label: 'Active Clubs', value: stats.activeClubs || '150+' },
    { icon: Globe, label: 'Communities Across Campus', value: stats.communities || '30+' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Hero */}
        <div className="xl:col-span-5 card p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 leading-tight">
              Campus Events &<br />Club Discovery
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed max-w-sm">
              Discover exciting events, join vibrant clubs, and connect with your campus community. Your next adventure starts here.
            </p>
            <div className="flex gap-3">
              <Link to="/events" className="btn-primary text-sm">Explore Events</Link>
              <Link to="/clubs" className="btn-outline text-sm">Discover Clubs</Link>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-48 h-48 opacity-90">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=300&fit=crop"
              alt="Students"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="xl:col-span-4 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Upcoming Events</h3>
            <Link to="/events" className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {events.map((event) => {
              const { month, day } = formatDate(event.date);
              const isBookmarked = user?.bookmarkedEvents?.some(
                (e) => (e._id || e) === event._id
              );
              return (
                <div key={event._id} className="flex gap-3 group">
                  <Link to={`/events/${event._id}`} className="text-center min-w-[48px] hover:opacity-80">
                    <p className="text-xs text-slate-400 uppercase">{month}</p>
                    <p className="text-xl font-bold text-primary-600">{day}</p>
                  </Link>
                  <Link to={`/events/${event._id}`}>
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-16 h-16 rounded-xl object-cover hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <Link to={`/events/${event._id}`} className="font-semibold text-sm truncate hover:text-primary-600">
                        {event.title}
                      </Link>
                      <button
                        onClick={() => toggleBookmark(event._id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${isBookmarked ? 'fill-primary-500 text-primary-500' : 'text-slate-400'}`}
                        />
                      </button>
                    </div>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${categoryColors[event.category] || 'bg-slate-100 text-slate-600'}`}>
                      {event.category}
                    </span>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Find Your Community */}
        <div className="xl:col-span-3 card overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop"
            alt="Community"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="relative z-10 p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent h-full flex flex-col justify-end min-h-[280px]">
            <h3 className="text-white font-bold text-lg mb-2">Find Your Community</h3>
            <p className="text-white/80 text-sm mb-4">
              Connect with like-minded students and build lasting friendships.
            </p>
            <Link to="/communities" className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 px-4 rounded-xl text-center transition-all">
              Explore Clubs
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Categories */}
        <div className="lg:col-span-4 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Popular Categories</h3>
            <Link to="/events" className="text-primary-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat) => {
              const Icon = iconMap[cat.iconName] || Grid3x3;
              return (
                <Link
                  key={cat._id}
                  to={`/events?category=${cat.name}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.colorTheme}15`, color: cat.colorTheme }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-center">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Discover Clubs */}
        <div className="lg:col-span-4 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Discover Clubs</h3>
            <Link to="/clubs" className="text-primary-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {clubs.map((club) => {
              const isJoined = user?.joinedClubs?.some(
                (c) => (c._id || c) === club._id
              );
              return (
                <Link key={club._id} to={`/clubs/${club._id}`} className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded-xl transition-all">
                  <img src={club.logoUrl} alt={club.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{club.name}</h4>
                    <p className="text-xs text-slate-400 truncate">{club.slogan}</p>
                    <p className="text-xs text-primary-600 font-medium mt-0.5">
                      {formatMemberCount(club.memberCount)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleJoinClub(club._id); }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isJoined
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30'
                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-primary-100 hover:text-primary-600'
                    }`}
                  >
                    <Plus className={`w-4 h-4 ${isJoined ? 'rotate-45' : ''} transition-transform`} />
                  </button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Start Something New */}
          <div className="card p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Start Something New!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Have an idea for a new club or event? Submit your proposal and bring your vision to life.
            </p>
            <button onClick={() => setShowIdeaModal(true)} className="btn-primary w-full text-sm">
              Submit Your Idea
            </button>
          </div>

          {/* Stats */}
          <div className="card p-6">
            <div className="grid grid-cols-2 gap-4">
              {statItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center p-3">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                  <p className="text-lg font-bold">{value}</p>
                  <p className="text-xs text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="card overflow-hidden relative h-48">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=300&fit=crop"
          alt="Campus"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="relative z-10 h-full flex items-center justify-center bg-black/40 px-8">
          <blockquote className="text-center text-white max-w-2xl">
            <p className="text-xl md:text-2xl font-medium italic leading-relaxed">
              "Be the change you wish to see in the world."
            </p>
            <footer className="mt-3 text-white/70 text-sm">— Mahatma Gandhi</footer>
          </blockquote>
        </div>
      </div>

      {showIdeaModal && <IdeaModal onClose={() => setShowIdeaModal(false)} />}
    </div>
  );
}
