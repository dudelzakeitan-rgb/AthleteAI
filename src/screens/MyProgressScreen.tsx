import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  TrendingUp, Calendar, CheckCircle, Clock, Flame, Target,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MyProgressScreen() {
  const navigation = useNavigation<Nav>();
  const { progressEntries, streak } = useApp();

  const completedWorkouts = progressEntries.filter(e => e.completed).length;
  const totalMinutes = progressEntries.reduce((s, e) => s + (e.duration || 0), 0);
  const totalHours = Math.round(totalMinutes / 60);
  const totalCalories = progressEntries.reduce((s, e) => s + (e.caloriesBurned || 0), 0);

  const sportCounts: Record<string, number> = {};
  progressEntries.forEach(e => {
    sportCounts[e.sport] = (sportCounts[e.sport] || 0) + 1;
  });
  const topSport = Object.entries(sportCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1e3a8a', '#1d4ed8', '#3b82f6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-5 pt-6 pb-8">
          <TouchableOpacity className="mb-4" onPress={() => navigation.goBack()}>
            <Text className="text-white/70 text-sm">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">My Progress</Text>
          <Text className="text-white/70 text-sm mt-1">Your training history & stats</Text>
        </LinearGradient>

        <View className="px-4 -mt-5 gap-3">
          {/* Stats grid */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center">
              <CheckCircle size={20} color="#10b981" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">{completedWorkouts}</Text>
              <Text className="text-xs text-gray-500">Completed</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center">
              <Flame size={20} color="#f97316" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">{streak}</Text>
              <Text className="text-xs text-gray-500">Day Streak</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center">
              <Clock size={20} color="#3b82f6" />
              <Text className="text-2xl font-bold text-gray-900 mt-2">{totalHours}</Text>
              <Text className="text-xs text-gray-500">Hours</Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-xs text-gray-500 mb-1">Calories Burned</Text>
              <Text className="text-2xl font-bold text-rose-500">{totalCalories.toLocaleString()}</Text>
              <Text className="text-xs text-gray-400">kcal total</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-xs text-gray-500 mb-1">Favourite Sport</Text>
              <Text className="text-xl font-bold text-blue-600 capitalize">{topSport || '—'}</Text>
              <Text className="text-xs text-gray-400">{topSport ? `${sportCounts[topSport]} sessions` : 'No data yet'}</Text>
            </View>
          </View>

          {/* Sport breakdown */}
          {Object.keys(sportCounts).length > 0 && (
            <View className="bg-white rounded-2xl p-5">
              <Text className="font-bold text-gray-900 mb-4">Sport Breakdown</Text>
              {Object.entries(sportCounts).sort((a, b) => b[1] - a[1]).map(([sport, count]) => {
                const pct = (count / progressEntries.length) * 100;
                return (
                  <View key={sport} className="mb-3">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-sm font-medium text-gray-700 capitalize">{sport}</Text>
                      <Text className="text-sm text-gray-500">{count} sessions</Text>
                    </View>
                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <View className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* History */}
          <View className="bg-white rounded-2xl p-5 mb-6">
            <Text className="font-bold text-gray-900 mb-4">Training History</Text>
            {progressEntries.length === 0 ? (
              <View className="items-center py-8">
                <Target size={36} color="#d1d5db" />
                <Text className="text-gray-400 mt-3 text-center">No workouts yet. Start your first session!</Text>
              </View>
            ) : (
              <View className="gap-2">
                {progressEntries.slice(0, 20).map((entry, i) => (
                  <View key={i} className="flex-row items-center py-3 border-b border-gray-50">
                    <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${entry.completed ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      {entry.completed ? <CheckCircle size={18} color="#10b981" /> : <Calendar size={18} color="#94a3b8" />}
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900 text-sm">{entry.workoutType}</Text>
                      <Text className="text-gray-400 text-xs capitalize">{entry.sport} · {entry.duration} min</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-400 text-xs">{new Date(entry.date).toLocaleDateString()}</Text>
                      {entry.caloriesBurned && (
                        <Text className="text-rose-400 text-xs">{entry.caloriesBurned} kcal</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
