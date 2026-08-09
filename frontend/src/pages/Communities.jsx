import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import {

  Cpu, Music, Palette, Trophy, Users, Rocket, Camera, Grid3x3, ArrowRight,

} from 'lucide-react';

import api from '../services/api';



const iconMap = { Cpu, Music, Palette, Trophy, Users, Rocket, Camera, Grid3x3 };



export default function Communities() {

  const [categories, setCategories] = useState([]);

  const [clubs, setClubs] = useState([]);



  useEffect(() => {

    Promise.all([api.get('/categories'), api.get('/clubs?limit=50')]).then(([cat, cl]) => {

      setCategories(cat.data);

      setClubs(cl.data);

    });

  }, []);



  return (

    <div>

      <div className="mb-8">

        <h1 className="text-2xl font-bold mb-2">Communities</h1>

        <p className="text-slate-500 text-sm">Explore communities across campus grouped by interest</p>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {categories.filter((c) => c.name !== 'More').map((cat) => {

          const Icon = iconMap[cat.iconName] || Grid3x3;

          const catClubs = clubs.filter((c) => c.category === cat.name);

          return (

            <div key={cat._id} className="card p-6">

              <div className="flex items-center gap-3 mb-4">

                <div

                  className="w-12 h-12 rounded-xl flex items-center justify-center"

                  style={{ backgroundColor: `${cat.colorTheme}15`, color: cat.colorTheme }}

                >

                  <Icon className="w-6 h-6" />

                </div>

                <div>

                  <h3 className="font-bold">{cat.name}</h3>

                  <p className="text-xs text-slate-400">{cat.eventCount} events · {catClubs.length} clubs</p>

                </div>

              </div>

              <div className="space-y-2">

                {catClubs.slice(0, 3).map((club) => (

                  <Link

                    key={club._id}

                    to={`/clubs/${club._id}`}

                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"

                  >

                    <img src={club.logoUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />

                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-medium truncate">{club.name}</p>

                      <p className="text-xs text-slate-400">{club.memberCount} members</p>

                    </div>

                  </Link>

                ))}

                {catClubs.length === 0 && (

                  <p className="text-sm text-slate-400 py-2">No clubs in this category yet</p>

                )}

              </div>

              <Link

                to={`/clubs?category=${cat.name}`}

                className="mt-4 text-primary-600 text-sm font-medium flex items-center gap-1 hover:underline"

              >

                Explore {cat.name} <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

          );

        })}

      </div>

    </div>

  );

}

