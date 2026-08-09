import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import api from '../services/api';

function dateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    api.get('/events?limit=100').then((r) => setEvents(r.data));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventDates = events.reduce((acc, ev) => {
    const key = dateKey(ev.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const selectedKey = selectedDay ? `${year}-${month}-${selectedDay}` : null;
  const selectedEvents = selectedKey ? eventDates[selectedKey] || [] : [];

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const today = new Date();
  const isToday = (day) =>
    day && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-slate-500 text-sm">View campus events by date</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">
              {currentDate.toLocaleString('en', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setCurrentDate(new Date()); setSelectedDay(today.getDate()); }}
                className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Today
              </button>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const key = day ? `${year}-${month}-${day}` : null;
              const hasEvents = key && eventDates[key];
              return (
                <button
                  key={i}
                  disabled={!day}
                  onClick={() => day && setSelectedDay(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                    !day ? '' :
                    selectedDay === day ? 'bg-primary-600 text-white' :
                    isToday(day) ? 'ring-2 ring-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-semibold' :
                    hasEvents ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-semibold hover:bg-primary-100' :
                    'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {day}
                  {hasEvents && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${selectedDay === day ? 'bg-white' : 'bg-primary-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold mb-4">
            {selectedDay
              ? `Events on ${currentDate.toLocaleString('en', { month: 'short' })} ${selectedDay}`
              : 'Select a date'}
          </h3>
          <div className="space-y-3">
            {selectedEvents.map((ev) => (
              <Link
                key={ev._id}
                to={`/events/${ev._id}`}
                className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                <h4 className="font-semibold text-sm">{ev.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                </div>
              </Link>
            ))}
            {selectedDay && selectedEvents.length === 0 && (
              <p className="text-sm text-slate-400">No events on this day</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
