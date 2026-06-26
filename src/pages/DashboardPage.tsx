import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import {
  Trophy,
  Flame,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  Target,
  Award,
  Zap,
  ChevronRight,
  Star,
  Dumbbell,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export function DashboardPage() {
  const navigate = useNavigate();
  const { progressEntries, achievements, streak } = useApp();

  const completedWorkouts = progressEntries.filter((e) => e.completed).length;
  const totalDuration = progressEntries.filter((e) => e.completed).reduce((sum, e) => sum + e.duration, 0);
  const weeklyWorkouts = progressEntries.filter((e) => {
    const entryDate = new Date(e.date);
    return entryDate >= subDays(new Date(), 7) && e.completed;
  }).length;

  const weeklyActivity = generateWeeklyActivity(progressEntries);
  const monthlyProgress = generateMonthlyProgress(progressEntries);
  const sportDistribution = generateSportDistribution(progressEntries);

  const recentAchievements = achievements
    .filter((a) => a.progress >= a.target)
    .slice(0, 3);

  const nearCompletionAchievements = achievements
    .filter((a) => a.progress < a.target && a.progress > 0)
    .sort((a, b) => (b.progress / b.target) - (a.progress / a.target))
    .slice(0, 3);

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your training journey and achievements</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={ Trophy}
            label="Total Workouts"
            value={completedWorkouts}
            trend={ +8}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={ Flame}
            label="Current Streak"
            value={streak}
            unit="days"
            trend={streak > 0 ? +1 : 0}
            color="from-orange-500 to-amber-500"
          />
          <StatCard
            icon={ Clock}
            label="Total Hours"
            value={Math.round(totalDuration / 60)}
            trend={ +12}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={ Calendar}
            label="This Week"
            value={weeklyWorkouts}
            unit="sessions"
            trend={ weeklyWorkouts > 3 ? +2 : -1}
            color="from-emerald-500 to-teal-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Weekly Activity</h2>
                  <p className="text-sm text-gray-500">Training sessions this week</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/progress')}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                View All
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivity}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="duration"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorVolume)"
                    name="Minutes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Sport Mix</h2>
                <p className="text-sm text-gray-500">Training distribution</p>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sportDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Monthly Progress</h2>
                  <p className="text-sm text-gray-500">Training volume over time</p>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                    name="Sessions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Quick Actions</h2>
                <p className="text-sm text-blue-100">Start your training</p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/sports')}
                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <span className="font-medium">Start New Workout</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/coach')}
                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <span className="font-medium">Ask AI Coach</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
                  <p className="text-sm text-gray-500">{ achievements.filter(a => a.progress >= a.target).length} earned</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/progress')}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                View All
              </button>
            </div>

            {recentAchievements.length > 0 ? (
              <div className="grid gap-3">
                {recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{achievement.title}</div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                    </div>
                    <Award className="w-6 h-6 text-amber-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Complete workouts to earn achievements!</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">In Progress</h2>
              </div>
            </div>

            {nearCompletionAchievements.length > 0 ? (
              <div className="space-y-4">
                {nearCompletionAchievements.map((achievement) => {
                  const progressPercent = Math.round(
                    (achievement.progress / achievement.target) * 100
                  );
                  return (
                    <div key={achievement.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{achievement.title}</span>
                        <span className="text-sm text-gray-500">
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>All goals completed! Set new challenges.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Personal Records</h2>
                <p className="text-sm text-gray-500">Your best performances</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Longest Streak', value: streak, unit: 'days', icon: Flame },
              { label: 'Longest Session', value: Math.max(...progressEntries.map(e => e.duration), 0), unit: 'min', icon: Clock },
              { label: 'Weekly Best', value: weeklyWorkouts, unit: 'sessions', icon: Trophy },
              { label: 'Total Distance', value: Math.round(totalDuration * 2.5), unit: 'm', icon: TrendingUp },
            ].map((record, i) => (
              <div key={i} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <record.icon className="w-5 h-5 text-purple-500 mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {record.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">{record.unit}</span>
                </div>
                <div className="text-sm text-gray-600">{record.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit = '',
  trend,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {Math.abs(trend)}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value}
        {unit && <span className="text-lg font-normal text-gray-500 ml-1">{unit}</span>}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function generateWeeklyActivity(entries: { date: string; duration: number; completed: boolean }[]) {
  const days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  return days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const totalDuration = entries
      .filter((e) => e.date.startsWith(dayStr) && e.completed)
      .reduce((sum, e) => sum + e.duration, 0);

    return {
      day: format(day, 'EEE'),
      duration: totalDuration,
    };
  });
}

function generateMonthlyProgress(entries: { date: string; completed: boolean }[]) {
  const weeks = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = subDays(new Date(), i * 7 + 6);
    const weekEnd = subDays(new Date(), i * 7);
    const sessions = entries.filter((e) => {
      const date = new Date(e.date);
      return date >= weekStart && date <= weekEnd && e.completed;
    }).length;

    weeks.push({
      week: i === 0 ? 'This Week' : `${i + 1} week${i > 1 ? 's' : ''} ago`,
      sessions,
    });
  }
  return weeks.reverse();
}

function generateSportDistribution(entries: { sport: string }[]) {
  const sportCounts: Record<string, number> = {};
  entries.forEach((e) => {
    sportCounts[e.sport] = (sportCounts[e.sport] || 0) + 1;
  });

  return Object.entries(sportCounts)
    .map(([sport, count]) => ({
      name: sport.charAt(0).toUpperCase() + sport.slice(1),
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}
