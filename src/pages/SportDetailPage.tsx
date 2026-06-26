import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, Target, Heart, Play, RotateCcw, Wind, Activity, Move, ArrowRight, ArrowUpCircle, MoveRight, MoveLeft, Shield, TrendingUp, Flame, MapPin, Hand } from 'lucide-react';
import { sportsConfig } from '../types';
import { useApp } from '../context/AppContext';

const improvementIcons: Record<string, React.ElementType> = {
  Zap, Target, Heart, Play, RotateCcw, Wind, Activity, Move, ArrowRight, ArrowUpCircle, MoveRight, MoveLeft, Shield, TrendingUp, Flame, MapPin, Hand,
};

export function SportDetailPage() {
  const { sportId } = useParams<{ sportId: string }>();
  const navigate = useNavigate();
  const { setSelectedImprovement, setCurrentSport } = useApp();

  const sport = sportsConfig.find((s) => s.id === sportId);

  React.useEffect(() => {
    if (sport) {
      setCurrentSport(sport.id);
    }
  }, [sport, setCurrentSport]);

  if (!sport) {
    return (
      <div className="pt-20 text-center">
        <p>Sport not found</p>
        <button onClick={() => navigate('/sports')} className="text-blue-500 hover:underline">
          Back to Sports
        </button>
      </div>
    );
  }

  const handleImprovementSelect = (improvementId: string) => {
    setSelectedImprovement(improvementId);
    navigate(`/training/${sport.id}/${improvementId}/questionnaire`);
  };

  return (
    <div className={`min-h-screen pt-20 bg-gradient-to-br ${sport.bgGradient} bg-fixed`}>
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <button
          onClick={() => navigate('/sports')}
          className="flex items-center text-white/90 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Sports</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            {sport.name}
          </h1>
          <p className="text-xl text-white/90">
            What would you like to improve?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {sport.improvements.map((improvement, index) => {
            const IconComponent = improvementIcons[improvement.icon] || Activity;

            return (
              <button
                key={improvement.id}
                onClick={() => handleImprovementSelect(improvement.id)}
                className="group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {improvement.label}
                </h3>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-blue-500" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
