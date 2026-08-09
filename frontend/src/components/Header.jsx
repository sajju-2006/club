import { useState, useEffect, useRef } from 'react';

import { Search, Bell, CalendarDays, Sun, Moon, Menu } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

import { useAuth } from '../context/AuthContext';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import api from '../services/api';



export default function Header({ onMenuClick }) {

  const { darkMode, toggleTheme } = useTheme();

  const { user } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [query, setQuery] = useState('');

  const [results, setResults] = useState(null);

  const [showResults, setShowResults] = useState(false);

  const [notifCount, setNotifCount] = useState(0);

  const searchRef = useRef(null);



  useEffect(() => {

    api.get('/notifications/unread-count').then((r) => setNotifCount(r.data.count)).catch(() => {});

  }, [location.pathname]);



  useEffect(() => {

    if (query.length < 2) {

      setResults(null);

      return;

    }

    const timer = setTimeout(() => {

      api.get(`/search?q=${encodeURIComponent(query)}`).then((r) => {

        setResults(r.data);

        setShowResults(true);

      });

    }, 300);

    return () => clearTimeout(timer);

  }, [query]);



  useEffect(() => {

    const handler = (e) => {

      if (searchRef.current && !searchRef.current.contains(e.target)) {

        setShowResults(false);

      }

    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);

  }, []);



  const startChat = (person) => {

    setShowResults(false);

    setQuery('');

    navigate('/messages', { state: { startChat: person } });

  };



  return (

    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 lg:px-6 py-3">

      <div className="flex items-center gap-4">

        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">

          <Menu className="w-5 h-5" />

        </button>



        <div ref={searchRef} className="flex-1 max-w-2xl relative">

          <div className="relative">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <input

              type="text"

              placeholder="Search events, clubs, people..."

              value={query}

              onChange={(e) => setQuery(e.target.value)}

              onFocus={() => results && setShowResults(true)}

              className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-700/50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"

            />

          </div>



          {showResults && results && (

            <div className="absolute top-full mt-2 w-full card p-4 shadow-xl z-50 max-h-80 overflow-y-auto">

              {results.events?.length > 0 && (

                <div className="mb-3">

                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Events</p>

                  {results.events.map((e) => (

                    <Link

                      key={e._id}

                      to={`/events/${e._id}`}

                      onClick={() => { setShowResults(false); setQuery(''); }}

                      className="block px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"

                    >

                      {e.title}

                    </Link>

                  ))}

                </div>

              )}

              {results.clubs?.length > 0 && (

                <div className="mb-3">

                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Clubs</p>

                  {results.clubs.map((c) => (

                    <Link

                      key={c._id}

                      to={`/clubs/${c._id}`}

                      onClick={() => { setShowResults(false); setQuery(''); }}

                      className="block px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"

                    >

                      {c.name}

                    </Link>

                  ))}

                </div>

              )}

              {results.people?.length > 0 && (

                <div>

                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">People</p>

                  {results.people.map((p) => (

                    <button

                      key={p._id}

                      onClick={() => startChat(p)}

                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-left"

                    >

                      <img src={p.profilePic || `https://i.pravatar.cc/40?u=${p.username}`} className="w-6 h-6 rounded-full" alt="" />

                      {p.fullName}

                    </button>

                  ))}

                </div>

              )}

              {!results.events?.length && !results.clubs?.length && !results.people?.length && (

                <p className="text-sm text-slate-400 text-center py-4">No results found</p>

              )}

            </div>

          )}

        </div>



        <div className="flex items-center gap-2">

          <Link to="/notifications" className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">

            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />

            {notifCount > 0 && (

              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />

            )}

          </Link>

          <Link to="/calendar" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">

            <CalendarDays className="w-5 h-5 text-slate-600 dark:text-slate-300" />

          </Link>

          <button

            onClick={toggleTheme}

            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"

          >

            {darkMode ? (

              <Sun className="w-5 h-5 text-amber-400" />

            ) : (

              <Moon className="w-5 h-5 text-slate-600" />

            )}

          </button>

          <Link to="/profile">

            <img

              src={user?.profilePic || 'https://i.pravatar.cc/150?u=default'}

              alt=""

              className="w-9 h-9 rounded-full ring-2 ring-primary-200 object-cover"

            />

          </Link>

        </div>

      </div>

    </header>

  );

}

