import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Save, Bookmark, Calendar, Building2, X, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const INTEREST_OPTIONS = ['Technology', 'Music', 'Arts', 'Sports', 'Social', 'Entrepreneurship', 'Photography'];

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: '', department: '', bio: '', interests: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        department: user.department || '',
        bio: user.bio || '',
        interests: user.interests || [],
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', form);
      await refreshUser();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName: user.fullName || '',
      department: user.department || '',
      bio: user.bio || '',
      interests: user.interests || [],
    });
    setEditing(false);
  };

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-500" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-4 mb-4">
            <img
              src={user?.profilePic || 'https://i.pravatar.cc/150?u=default'}
              alt=""
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800"
            />
            <div className="flex-1 pb-1">
              <h1 className="text-2xl font-bold">{user?.fullName}</h1>
              <p className="text-slate-500">@{user?.username} · {user?.department}</p>
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={handleCancel} className="btn-outline text-sm flex items-center gap-2">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-outline text-sm">Edit Profile</button>
              )}
              <button onClick={logout} className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Full Name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Department</label>
                <input
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        form.interests.includes(interest)
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-sm">{user?.bio || 'No bio yet. Click Edit Profile to add one.'}</p>
              {user?.interests?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <Building2 className="w-6 h-6 mx-auto mb-2 text-primary-500" />
          <p className="text-2xl font-bold">{user?.joinedClubs?.length || 0}</p>
          <p className="text-xs text-slate-400">Clubs Joined</p>
        </div>
        <div className="card p-4 text-center">
          <Bookmark className="w-6 h-6 mx-auto mb-2 text-primary-500" />
          <p className="text-2xl font-bold">{user?.bookmarkedEvents?.length || 0}</p>
          <p className="text-xs text-slate-400">Saved Events</p>
        </div>
        <div className="card p-4 text-center col-span-2 md:col-span-1">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-primary-500" />
          <p className="text-2xl font-bold">{user?.rsvpEvents?.length || 0}</p>
          <p className="text-xs text-slate-400">Events RSVP'd</p>
        </div>
      </div>

      {/* Joined Clubs */}
      {user?.joinedClubs?.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="font-bold mb-4">My Clubs</h3>
          <div className="space-y-3">
            {user.joinedClubs.map((club) => (
              <Link
                key={club._id || club}
                to={`/clubs/${club._id || club}`}
                className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 rounded-xl transition-all"
              >
                <img
                  src={club.logoUrl || 'https://via.placeholder.com/40'}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <p className="font-medium text-sm">{club.name || 'Club'}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Saved Events */}
      {user?.bookmarkedEvents?.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="font-bold mb-4">Saved Events</h3>
          <div className="space-y-3">
            {user.bookmarkedEvents.map((event) => (
              <Link
                key={event._id || event}
                to={`/events/${event._id || event}`}
                className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 rounded-xl transition-all"
              >
                <img
                  src={event.imageUrl || 'https://via.placeholder.com/40'}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{event.title || 'Event'}</p>
                  {event.location && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{event.location}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* RSVP'd Events */}
      {user?.rsvpEvents?.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold mb-4">Events I'm Attending</h3>
          <div className="space-y-3">
            {user.rsvpEvents.map((event) => (
              <Link
                key={event._id || event}
                to={`/events/${event._id || event}`}
                className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 rounded-xl transition-all"
              >
                <img
                  src={event.imageUrl || 'https://via.placeholder.com/40'}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{event.title || 'Event'}</p>
                  {event.date && (
                    <p className="text-xs text-slate-400">
                      {new Date(event.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      {event.time && ` · ${event.time}`}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
