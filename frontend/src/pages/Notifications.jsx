import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, Building2, Info, CheckCheck } from 'lucide-react';
import api from '../services/api';

const typeIcons = {
  event: CalendarDays,
  club: Building2,
  message: Bell,
  system: Info,
};

const typeColors = {
  event: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30',
  club: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30',
  message: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
  system: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/notifications').then((r) => setNotifications(r.data));
  }, []);

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClick = async (notif) => {
    if (!notif.read) {
      await api.put(`/notifications/${notif._id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
      );
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-slate-500 text-sm">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-outline text-sm flex items-center gap-2">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const Icon = typeIcons[notif.type] || Info;
          return (
            <div
              key={notif._id}
              onClick={() => handleClick(notif)}
              className={`card p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all ${
                !notif.read ? 'border-l-4 border-l-primary-500' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[notif.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{notif.title}</h3>
                  {!notif.read && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{notif.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(notif.createdAt).toLocaleDateString('en', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
