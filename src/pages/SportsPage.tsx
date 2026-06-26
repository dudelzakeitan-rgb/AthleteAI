import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, CircleDot, Circle, Activity, Bike } from 'lucide-react';
import { sportsConfig, Sport } from '../types';
import { useApp } from '../context/AppContext';

const iconMap: Record<string, React.ElementType> = {
  Waves,
  CircleDot,
  Circle,
  Activity,
  Bike,
};

export function SportsPage() {
  const navigate = useNavigate();
  const { setCurrentSport } = useApp();

  const handleSportSelect = (sportId: Sport) => {
    setCurrentSport(sportId);
    navigate(`/sports/${sportId}`);
  };

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Sport
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the sport you want to train for. Each sport offers specialized training programs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sportsConfig.map((sport, index) => {
            const IconComponent = iconMap[sport.icon] || Activity;

            return (
              <button
                key={sport.id}
                onClick={() => handleSportSelect(sport.id)}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${sport.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {sport.name}
                </h3>

                <p className="text-gray-600 text-sm sm:text-base">
                  {sport.improvements.length} improvement areas
                </p>

                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
