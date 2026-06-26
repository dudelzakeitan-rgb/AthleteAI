import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Flame, Star, Award, Target, Calendar, Clock, TrendingUp, ChevronRight, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sportsConfig } from '../types';

const achievementIcons: Record<string, React.ElementType> = {
  Trophy,
  Flame,
  Star,
  Medal: Award,
  Award,
  Target,
};

export function ProgressPage() {
  const navigate = useNavigate();
  const { progressEntries, achievements } = useApp();

  const completedWorkouts = progressEntries.filter((e) => e.completed).length;
  const totalDuration = progressEntries
    .filter((e) => e.completed)
    .reduce((sum, e) => sum + e.duration, 0);

  const weeklyWorkouts = progressEntries.filter((e) => {
    const entryDate = new Date(e.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo && e.completed;
  }).length;

  const uniqueSports = new Set(progressEntries.map((e) => e.sport)).size;

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Your Progress</h1>
          <p className="text-gray-600">Track your training journey and achievements</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Trophy}
            label="Completed Workouts"
            value={completedWorkouts}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={Clock}
            label="Total Hours"
            value={Math.round(totalDuration / 60)}
            color="from-emerald-500 to-teal-500"
          />
          <StatCard
            icon={Calendar}
            label="This Week"
            value={weeklyWorkouts}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Sports Trained"
            value={uniqueSports}
            color="from-amber-500 to-orange-500"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievementIcons[achievement.icon] || Award;
              const isEarned = achievement.progress >= achievement.target;
              const progressPercent = Math.min(100, (achievement.progress / achievement.target) * 100);

              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    isEarned
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isEarned
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                          : 'bg-gray-200'
                      }`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${isEarned ? 'text-white' : 'text-gray-400'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{achievement.progress}/{achievement.target}</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isEarned
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {isEarned && achievement.earnedAt && (
                    <div className="text-xs text-amber-600 mt-2">
                      Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All
            </button>
          </div>

          {progressEntries.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No training sessions yet</p>
              <button
                onClick={() => navigate('/sports')}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Start Training
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {progressEntries.slice(0, 10).map((entry) => {
                const sport = sportsConfig.find((s) => s.id === entry.sport);

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                          sport?.color || 'from-gray-400 to-gray-500'
                        }`}
                      >
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{entry.workoutType}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{entry.duration} min</div>
                        {entry.completed && (
                          <span className="text-xs text-emerald-600">Completed</span>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
