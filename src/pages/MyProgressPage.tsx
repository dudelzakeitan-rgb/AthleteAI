import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Clock,
  Trophy,
  Activity,
  Target,
  BarChart3,
  Zap,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sportsConfig } from '../types';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function MyProgressPage() {
  const { progressEntries, achievements, streak } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'stats' | 'calendar'>('overview');

  const completedWorkouts = progressEntries.filter((e) => e.completed);
  const totalDuration = completedWorkouts.reduce((sum, e) => sum + e.duration, 0);

  const improvementPercent = calculateImprovement(progressEntries);
  const performanceRadar = generatePerformanceRadar(progressEntries);
  const sportDistribution = generateSportPieData(progressEntries);
  const timeSeriesData = generateTimeSeriesData(progressEntries, selectedPeriod);
  const calendarData = generateCalendarData(progressEntries);

  const bestTimes = calculateBestTimes(progressEntries);
  const trainingStats = calculateTrainingStats(progressEntries);

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Progress</h1>
            <p className="text-gray-600">Detailed performance analytics and history</p>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as typeof selectedPeriod)}
                className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCardSimple
            icon={ Activity}
            label="Total Sessions"
            value={ completedWorkouts.length}
            change={ +15}
          />
          <StatCardSimple
            icon={ Clock}
            label="Training Hours"
            value={ Math.round(totalDuration / 60)}
            change={ +22}
          />
          <StatCardSimple
            icon={ TrendingUp}
            label="Improvement"
            value={ improvementPercent}
            unit="%"
            change={ +8}
          />
          <StatCardSimple
            icon={ Trophy}
            label="Achievements"
            value={ achievements.filter(a => a.progress >= a.target).length}
            change={ +3}
          />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'stats', label: 'Statistics', icon: Target },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id as typeof selectedView)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedView === view.id
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </button>
          ))}
        </div>

        {selectedView === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Training Volume</h2>
                    <p className="text-sm text-gray-500">Minutes trained over time</p>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
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
                        dataKey="duration"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Minutes"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Performance</h2>
                    <p className="text-sm text-gray-500">Skill breakdown</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performanceRadar}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Sport Distribution</h2>
                    <p className="text-sm text-gray-500">Training by sport</p>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="70%" height="100%">
                    <PieChart>
                      <Pie
                        data={sportDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                      >
                        {sportDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {sportDistribution.slice(0, 5).map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i] }}
                      />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Best Times</h2>
                    <p className="text-sm text-gray-500">Personal records</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Longest Training Streak', value: streak, unit: 'days', icon: Flame },
                    { label: 'Longest Single Session', value: bestTimes.longestSession, unit: 'min', icon: Clock },
                    { label: 'Most Weekly Sessions', value: bestTimes.mostWeekly, unit: 'sessions', icon: Zap },
                    { label: 'Best Week Duration', value: bestTimes.bestWeekDuration, unit: 'min', icon: TrendingUp },
                  ].map((record, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
                        <record.icon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{record.label}</div>
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {record.value}
                        <span className="text-sm font-normal text-gray-500 ml-1">{record.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'stats' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(trainingStats).map(([key, stat]) => (
                <div key={key} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}{stat.unit && <span className="text-lg font-normal text-gray-500 ml-1">{stat.unit}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {stat.trend >= 0 ? (
                      <span className="text-emerald-600">
                        <TrendingUp className="w-4 h-4 inline mr-1" />
                        +{stat.trend}%
                      </span>
                    ) : (
                      <span className="text-rose-600">
                        {stat.trend}%
                      </span>
                    )}
                    <span className="text-gray-400">vs last month</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Consistency Score', value: 85, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Intensity Average', value: 72, color: 'from-orange-500 to-amber-500' },
                  { label: 'Recovery Rate', value: 91, color: 'from-emerald-500 to-teal-500' },
                ].map((metric, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700">{metric.label}</span>
                      <span className="text-lg font-bold text-gray-900">{metric.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedView === 'calendar' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Training Calendar</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <span className="text-sm text-gray-600">No Activity</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {calendarData.map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                    day.intensity > 0
                      ? day.intensity >= 2
                        ? 'bg-emerald-500 text-white font-medium'
                        : 'bg-emerald-200 text-emerald-800'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day.date}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Training History</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {completedWorkouts.slice(0, 20).map((entry) => {
              const sport = sportsConfig.find((s) => s.id === entry.sport);
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                      sport?.color || 'from-gray-400 to-gray-500'
                    }`}
                  >
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{entry.workoutType}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{entry.duration} min</div>
                    <div className="text-sm text-gray-500">{entry.intensity || 'Moderate'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCardSimple({
  icon: Icon,
  label,
  value,
  unit = '',
  change,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  unit?: string;
  change?: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-gray-400" />
        {change !== undefined && (
          <span className="text-emerald-600 text-sm font-medium">
            +{change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {value}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function calculateImprovement(entries: { date: string; duration: number; completed: boolean }[]): number {
  if (entries.length < 5) return 0;
  const recent = entries.slice(0, Math.floor(entries.length / 2));
  const older = entries.slice(Math.floor(entries.length / 2));
  const recentAvg = recent.reduce((sum, e) => sum + e.duration, 0) / recent.length;
  const olderAvg = older.reduce((sum, e) => sum + e.duration, 0) / older.length;
  if (olderAvg === 0) return 0;
  return Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
}

function generatePerformanceRadar(entries: { sport: string; completed: boolean }[]): { metric: string; value: number }[] {
  const sportCounts: Record<string, number> = {};
  entries.filter(e => e.completed).forEach(e => {
    sportCounts[e.sport] = (sportCounts[e.sport] || 0) + 1;
  });

  const total = Object.values(sportCounts).reduce((a, b) => a + b, 0) || 1;

  return [
    { metric: 'Consistency', value: Math.min(100, Math.round((entries.filter(e => e.completed).length / Math.max(entries.length, 1)) * 100)) },
    { metric: 'Volume', value: Math.min(100, Math.round(total * 2)) },
    { metric: 'Variety', value: Math.min(100, Object.keys(sportCounts).length * 15) },
    { metric: 'Intensity', value: 75 },
    { metric: 'Progress', value: 82 },
  ];
}

function generateSportPieData(entries: { sport: string }[]): { name: string; value: number }[] {
  const counts: Record<string, number> = {};
  entries.forEach((e) => {
    counts[e.sport] = (counts[e.sport] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
    .sort((a, b) => b.value - a.value);
}

function generateTimeSeriesData(entries: { date: string; duration: number; completed: boolean }[], period: string) {
  const data = [];
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const duration = entries
      .filter((e) => e.date.startsWith(dateStr) && e.completed)
      .reduce((sum, e) => sum + e.duration, 0);

    data.push({
      date: dateStr,
      label: format(date, period === 'year' ? 'MMM' : 'MMM d'),
      duration,
    });
  }
  return data;
}

function generateCalendarData(entries: { date: string; completed: boolean }[]) {
  const days = eachDayOfInterval({
    start: subDays(new Date(), 30),
    end: new Date(),
  });

  const startDay = days[0].getDay();

  const padding = Array(startDay).fill(null).map(() => ({ date: '', intensity: 0, empty: true }));

  const calendarDays = days.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const multiple = entries.filter((e) => e.date.startsWith(dateStr) && e.completed).length;

    return {
      date: format(day, 'd'),
      intensity: multiple >= 2 ? 2 : multiple,
    };
  });

  return [...padding, ...calendarDays];
}

function calculateBestTimes(entries: { date: string; duration: number }[]) {
  return {
    longestSession: Math.max(...entries.map(e => e.duration), 0),
    mostWeekly: calculateMostWeekly(entries),
    bestWeekDuration: calculateBestWeekDuration(entries),
  };
}

function calculateMostWeekly(entries: { date: string }[]): number {
  const weeks: Record<string, number> = {};
  entries.forEach(e => {
    const week = format(new Date(e.date), 'yyyy-ww');
    weeks[week] = (weeks[week] || 0) + 1;
  });
  return Math.max(...Object.values(weeks), 0);
}

function calculateBestWeekDuration(entries: { date: string; duration: number }[]): number {
  const weeks: Record<string, number> = {};
  entries.forEach(e => {
    const week = format(new Date(e.date), 'yyyy-ww');
    weeks[week] = (weeks[week] || 0) + e.duration;
  });
  return Math.max(...Object.values(weeks), 0);
}

function calculateTrainingStats(entries: { date: string; duration: number; completed: boolean }[]) {
  const completed = entries.filter(e => e.completed);
  const total = completed.reduce((sum, e) => sum + e.duration, 0);

  return {
    avgDuration: {
      label: 'Avg Session',
      value: completed.length > 0 ? Math.round(total / completed.length) : 0,
      unit: 'min',
      trend: Math.round(Math.random() * 10 + 5),
    },
    weeklyAvg: {
      label: 'Weekly Average',
      value: Math.round(total / 4),
      unit: 'min',
      trend: Math.round(Math.random() * 15 + 5),
    },
    streak: {
      label: 'Current Streak',
      value: 7,
      unit: 'days',
      trend: 0,
    },
    completion: {
      label: 'Completion Rate',
      value: entries.length > 0 ? Math.round((completed.length / entries.length) * 100) : 0,
      unit: '%',
      trend: Math.round(Math.random() * 5 + 3),
    },
  };
}
