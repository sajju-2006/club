import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';

import {

  Home, CalendarDays, Users, MessageCircle, Bell, User,

  Shield, Rocket, LayoutGrid, Building2, Lightbulb,

} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

import Header from './Header';

import { useState, useEffect } from 'react';

import api from '../services/api';



const navItems = [

  { to: '/', icon: Home, label: 'Home' },

  { to: '/events', icon: CalendarDays, label: 'Events' },

  { to: '/clubs', icon: Building2, label: 'Clubs' },

  { to: '/communities', icon: Users, label: 'Communities' },

  { to: '/calendar', icon: LayoutGrid, label: 'Calendar' },

  { to: '/messages', icon: MessageCircle, label: 'Messages', badge: true },

  { to: '/notifications', icon: Bell, label: 'Notifications' },

  { to: '/profile', icon: User, label: 'Profile' },

];



export default function Layout() {

  const { user } = useAuth();

  const location = useLocation();

  const [msgCount, setMsgCount] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(false);



  const isAdmin = user?.role === 'admin';



  useEffect(() => {

    api.get('/messages/unread-count').then((r) => setMsgCount(r.data.count)).catch(() => {});

  }, [location.pathname]);



  return (

    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">

      <aside

        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-transform duration-300 ${

          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'

        }`}

      >

        <div className="p-6 flex items-center gap-3">

          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 dark:shadow-none">

            <Shield className="w-5 h-5 text-white" />

          </div>

          <div>

            <h1 className="font-bold text-lg tracking-tight">CAMPUS</h1>

            <p className="text-xs text-primary-600 font-semibold tracking-widest">HUB</p>

          </div>

        </div>



        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">

          {navItems.map(({ to, icon: Icon, label, badge }) => (

            <NavLink

              key={to}

              to={to}

              end={to === '/'}

              onClick={() => setSidebarOpen(false)}

              className={({ isActive }) =>

                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`

              }

            >

              <Icon className="w-5 h-5" />

              <span className="flex-1">{label}</span>

              {badge && msgCount > 0 && (

                <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">

                  {msgCount}

                </span>

              )}

            </NavLink>

          ))}

          {isAdmin && (

            <NavLink

              to="/admin"

              onClick={() => setSidebarOpen(false)}

              className={({ isActive }) =>

                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`

              }

            >

              <Lightbulb className="w-5 h-5" />

              <span className="flex-1">Idea Review</span>

            </NavLink>

          )}

        </nav>



        <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl text-white">

          <Rocket className="w-8 h-8 mb-2 opacity-80" />

          <h3 className="font-semibold text-sm mb-1">Be Part of Something Bigger</h3>

          <p className="text-xs text-primary-200 mb-3">Join clubs and events today</p>

          <Link

            to="/clubs"

            onClick={() => setSidebarOpen(false)}

            className="block w-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 rounded-lg transition-all text-center"

          >

            Join Now

          </Link>

        </div>



        <Link to="/profile" className="p-4 border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">

          <div className="flex items-center gap-3">

            <img

              src={user?.profilePic || 'https://i.pravatar.cc/150?u=default'}

              alt={user?.fullName}

              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-200"

            />

            <div className="flex-1 min-w-0">

              <p className="font-semibold text-sm truncate">{user?.fullName || 'Student'}</p>

              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">

                {user?.department || 'Department'}

              </p>

            </div>

          </div>

        </Link>

      </aside>



      {sidebarOpen && (

        <div

          className="fixed inset-0 bg-black/30 z-30 lg:hidden"

          onClick={() => setSidebarOpen(false)}

        />

      )}



      <div className="flex-1 flex flex-col min-w-0">

        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">

          <Outlet />

        </main>

      </div>

    </div>

  );

}

