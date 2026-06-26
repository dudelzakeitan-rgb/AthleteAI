import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft, Zap, Target, Heart, Play, RotateCcw, Wind,
  Activity, ArrowRight, ArrowUpCircle, Shield, TrendingUp, Flame, MapPin,
} from 'lucide-react-native';
import { sportsConfig } from '../types';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'SportDetail'>;

const iconMap: Record<string, any> = {
  Zap, Target, Heart, Play, RotateCcw, Wind, Activity, ArrowRight,
  ArrowUpCircle, Shield, TrendingUp, Flame, MapPin,
};

const sportGradients: Record<string, [string, string]> = {
  swimming: ['#1d4ed8', '#06b6d4'],
  football: ['#065f46', '#10b981'],
  tennis: ['#b45309', '#f97316'],
  basketball: ['#c2410c', '#ef4444'],
  running: ['#334155', '#64748b'],
  cycling: ['#0f766e', '#14b8a6'],
  volleyball: ['#9d174d', '#ec4899'],
};

export function SportDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { setSelectedImprovement } = useApp();
  const { sportId } = route.params;

  const sport = sportsConfig.find(s => s.id === sportId);
  const [colorA, colorB] = sportGradients[sportId] || ['#1d4ed8', '#3b82f6'];

  if (!sport) return null;

  const handleSelect = (improvementId: string) => {
    setSelectedImprovement(improvementId);
    navigation.navigate('Questionnaire', { sportId, improvementId });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={[colorA, colorB]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity
          className="flex-row items-center px-5 pt-4 pb-2"
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={20} color="#ffffff" />
          <Text className="text-white ml-1 font-medium">Back</Text>
        </TouchableOpacity>
        <View className="px-5 pb-8 pt-2">
          <Text className="text-white text-3xl font-bold">{sport.name}</Text>
          <Text className="text-white/80 mt-1">What would you like to improve?</Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <View className="flex-row flex-wrap gap-3">
          {sport.improvements.map((improvement) => {
            const Icon = iconMap[improvement.icon] || Activity;
            return (
              <TouchableOpacity
                key={improvement.id}
                onPress={() => handleSelect(improvement.id)}
                style={{ width: '47%' }}
                activeOpacity={0.85}
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <View className="w-12 h-12 rounded-xl bg-blue-50 items-center justify-center mb-3">
                  <Icon size={22} color="#3b82f6" />
                </View>
                <Text className="font-semibold text-gray-900 text-base">{improvement.label}</Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-blue-500 text-xs font-medium">Select</Text>
                  <ArrowRight size={12} color="#3b82f6" style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
