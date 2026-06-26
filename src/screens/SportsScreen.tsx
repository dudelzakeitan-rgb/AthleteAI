import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Waves, CircleDot, Activity, Bike } from 'lucide-react-native';
import { sportsConfig } from '../types';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const sportGradients: Record<string, [string, string]> = {
  swimming: ['#3b82f6', '#06b6d4'],
  football: ['#10b981', '#059669'],
  tennis: ['#f59e0b', '#f97316'],
  basketball: ['#f97316', '#ef4444'],
  running: ['#64748b', '#475569'],
  cycling: ['#14b8a6', '#10b981'],
  volleyball: ['#ec4899', '#f43f5e'],
};

const sportIcons: Record<string, typeof Waves> = {
  swimming: Waves,
  football: CircleDot,
  tennis: CircleDot,
  basketball: CircleDot,
  running: Activity,
  cycling: Bike,
  volleyball: CircleDot,
};

export function SportsScreen() {
  const navigation = useNavigation<Nav>();
  const { setCurrentSport } = useApp();

  const handleSportSelect = (sportId: string) => {
    setCurrentSport(sportId as any);
    navigation.navigate('SportDetail', { sportId });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-6 pb-4">
        <Text className="text-3xl font-bold text-gray-900">Choose Your Sport</Text>
        <Text className="text-gray-500 mt-1 text-base">Select to get a personalized training plan</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <View className="flex-row flex-wrap gap-4">
          {sportsConfig.map((sport) => {
            const Icon = sportIcons[sport.id] || CircleDot;
            const [colorA, colorB] = sportGradients[sport.id] || ['#3b82f6', '#06b6d4'];

            return (
              <TouchableOpacity
                key={sport.id}
                onPress={() => handleSportSelect(sport.id)}
                style={{ width: '47%' }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[colorA, colorB]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-3xl p-5 aspect-square items-center justify-center"
                >
                  <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center mb-3">
                    <Icon size={28} color="#ffffff" />
                  </View>
                  <Text className="text-white text-lg font-bold">{sport.name}</Text>
                  <Text className="text-white/70 text-xs mt-1">
                    {sport.improvements.length} focus areas
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
