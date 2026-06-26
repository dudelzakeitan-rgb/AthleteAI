import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  TrendingUp, Award, Calendar, Flame, Target, CheckCircle, Plus,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { progressEntries, streak, achievements } = useApp();

  const completedWorkouts = progressEntries.filter(e => e.completed).length;
  const totalMinutes = progressEntries.reduce((s, e) => s + (e.duration || 0), 0);
  const totalHours = Math.round(totalMinutes / 60);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const thisWeek = progressEntries.filter(e => new Date(e.date) >= weekStart).length;

  const earnedAchievements = achievements.filter(a => a.progress >= a.target);
  const inProgressAchievements = achievements.filter(a => a.progress > 0 && a.progress < a.target).slice(0, 3);

  const recentEntries = progressEntries.slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#1d4ed8', '#3b82f6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-5 pt-6 pb-8">
          <Text className="text-white/70 text-sm mb-1">Welcome back</Text>
          <Text className="text-white text-2xl font-bold">Your Dashboard</Text>
        </LinearGradient>

        <View className="px-4 -mt-5 mb-4">
          {/* Stats grid */}
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-3xl font-bold text-blue-600">{completedWorkouts}</Text>
              <Text className="text-xs text-gray-500 mt-1">Total Workouts</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center">
                <Text className="text-3xl font-bold text-orange-500">{streak}</Text>
                <Flame size={18} color="#f97316" style={{ marginLeft: 4 }} />
              </View>
              <Text className="text-xs text-gray-500 mt-1">Day Streak</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-3xl font-bold text-teal-500">{totalHours}</Text>
              <Text className="text-xs text-gray-500 mt-1">Total Hours</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-3xl font-bold text-purple-500">{thisWeek}</Text>
              <Text className="text-xs text-gray-500 mt-1">This Week</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-4">
          <Text className="font-bold text-gray-900 mb-3">Quick Actions</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-blue-500 rounded-2xl p-4 items-center"
              onPress={() => navigation.navigate('MainTabs', { screen: 'Sports' } as any)}
            >
              <Plus size={20} color="#ffffff" />
              <Text className="text-white text-sm font-semibold mt-1">New Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-white rounded-2xl p-4 items-center border border-gray-100"
              onPress={() => navigation.navigate('MyProgress')}
            >
              <TrendingUp size={20} color="#3b82f6" />
              <Text className="text-gray-700 text-sm font-semibold mt-1">Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Achievements */}
        {earnedAchievements.length > 0 && (
          <View className="px-4 mb-4">
            <Text className="font-bold text-gray-900 mb-3">Achievements ({earnedAchievements.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {earnedAchievements.map(a => (
                  <View key={a.id} className="bg-white rounded-2xl p-4 items-center w-28 border border-yellow-100">
                    <View className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center mb-2">
                      <Award size={20} color="#f59e0b" />
                    </View>
                    <Text className="text-gray-900 text-xs font-semibold text-center">{a.title}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* In Progress */}
        {inProgressAchievements.length > 0 && (
          <View className="px-4 mb-4">
            <Text className="font-bold text-gray-900 mb-3">In Progress</Text>
            <View className="gap-2">
              {inProgressAchievements.map(a => (
                <View key={a.id} className="bg-white rounded-2xl p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-semibold text-gray-900 text-sm">{a.title}</Text>
                    <Text className="text-gray-500 text-xs">{a.progress}/{a.target}</Text>
                  </View>
                  <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(a.progress / a.target) * 100}%` }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Activity */}
        <View className="px-4 mb-8">
          <Text className="font-bold text-gray-900 mb-3">Recent Activity</Text>
          {recentEntries.length === 0 ? (
            <View className="bg-white rounded-2xl p-6 items-center">
              <Target size={32} color="#d1d5db" />
              <Text className="text-gray-400 text-sm mt-3 text-center">No workouts yet. Start training!</Text>
            </View>
          ) : (
            <View className="gap-2">
              {recentEntries.map((e, i) => (
                <View key={i} className="bg-white rounded-2xl p-4 flex-row items-center">
                  <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${e.completed ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    {e.completed ? <CheckCircle size={18} color="#10b981" /> : <Calendar size={18} color="#94a3b8" />}
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 text-sm">{e.workoutType}</Text>
                    <Text className="text-gray-400 text-xs capitalize">{e.sport} · {e.duration} min</Text>
                  </View>
                  <Text className="text-gray-400 text-xs">{new Date(e.date).toLocaleDateString()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
