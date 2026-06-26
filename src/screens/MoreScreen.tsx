import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  TrendingUp, Apple, Settings, Info, ChevronRight,
} from 'lucide-react-native';import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const items = [
  { icon: TrendingUp, label: 'My Progress', screen: 'MyProgress', color: '#3b82f6', desc: 'Training history & stats' },
  { icon: Apple, label: 'Nutrition', screen: 'Nutrition', color: '#10b981', desc: 'Meal plans & hydration' },
  { icon: Settings, label: 'Settings', screen: 'Settings', color: '#64748b', desc: 'Profile & preferences' },
  { icon: Info, label: 'About', screen: 'About', color: '#f59e0b', desc: 'App info & features' },
] as const;

export function MoreScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={['#0f172a', '#1e3a8a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-5 pt-6 pb-8">
        <Text className="text-white text-2xl font-bold">More</Text>
        <Text className="text-white/60 text-sm mt-1">Additional features & settings</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 12 }}>
        <View className="bg-white rounded-2xl overflow-hidden">
          {items.map(({ icon: Icon, label, screen, color, desc }, i) => (
            <TouchableOpacity
              key={label}
              onPress={() => navigation.navigate(screen as any)}
              className={`flex-row items-center px-4 py-4 ${i < items.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: color + '15' }}>
                <Icon size={20} color={color} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">{label}</Text>
                <Text className="text-gray-400 text-xs mt-0.5">{desc}</Text>
              </View>
              <ChevronRight size={16} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
