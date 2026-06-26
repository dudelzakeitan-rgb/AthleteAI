import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, TrendingUp, Target, Award, ChevronRight, Activity } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const features = [
  { icon: Zap, title: 'AI Training Plans', desc: 'Custom plans built for your sport and goals', color: '#3b82f6' },
  { icon: TrendingUp, title: 'Track Progress', desc: 'Monitor every workout and improvement', color: '#10b981' },
  { icon: Target, title: 'Nutrition Plans', desc: 'Fuel your training with smart meal plans', color: '#f59e0b' },
  { icon: Award, title: 'Achievements', desc: 'Earn badges and hit milestones', color: '#8b5cf6' },
];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { progressEntries, streak, achievements } = useApp();
  const completedAchievements = achievements.filter(a => a.progress >= a.target).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={['#1d4ed8', '#3b82f6', '#06b6d4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pt-8 pb-12"
        >
          <View className="flex-row items-center mb-6">
            <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center mr-3">
              <Activity size={22} color="#ffffff" />
            </View>
            <Text className="text-white text-xl font-bold">AthleteAI</Text>
          </View>

          <Text className="text-white/80 text-sm font-medium mb-2 uppercase tracking-widest">
            Your Personal
          </Text>
          <Text className="text-white text-4xl font-bold mb-3 leading-tight">
            AI Sports{'\n'}Coach
          </Text>
          <Text className="text-white/80 text-base mb-8 leading-relaxed">
            Generate custom training plans, track progress, and analyze your technique.
          </Text>

          <TouchableOpacity
            className="bg-white rounded-2xl px-8 py-4 flex-row items-center justify-center self-start"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Sports' } as any)}
          >
            <Text className="text-blue-600 font-bold text-base mr-2">Get Started</Text>
            <ChevronRight size={18} color="#2563eb" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats row */}
        <View className="flex-row mx-4 -mt-6 mb-6 gap-3">
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center">
            <Text className="text-2xl font-bold text-blue-600">{progressEntries.length}</Text>
            <Text className="text-xs text-gray-500 mt-1">Workouts</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center">
            <Text className="text-2xl font-bold text-orange-500">{streak}</Text>
            <Text className="text-xs text-gray-500 mt-1">Day Streak</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center">
            <Text className="text-2xl font-bold text-purple-500">{completedAchievements}</Text>
            <Text className="text-xs text-gray-500 mt-1">Achievements</Text>
          </View>
        </View>

        {/* Features */}
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">What AthleteAI Offers</Text>
          <View className="gap-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <View key={i} className="bg-white rounded-2xl p-4 flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: f.color + '20' }}
                  >
                    <Icon size={22} color={f.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 text-base">{f.title}</Text>
                    <Text className="text-gray-500 text-sm mt-0.5">{f.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* CTA */}
        <View className="px-4 mb-8">
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'Sports' } as any)}
          >
            <LinearGradient
              colors={['#3b82f6', '#06b6d4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl p-5 flex-row items-center justify-between"
            >
              <View>
                <Text className="text-white font-bold text-lg">Start Training</Text>
                <Text className="text-white/80 text-sm mt-1">Choose your sport now</Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <ChevronRight size={20} color="#ffffff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
