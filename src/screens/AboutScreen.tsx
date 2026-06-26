import { ScrollView, View, Text, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Activity, Heart, Shield, Code } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function AboutScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#0f172a', '#1e3a8a', '#1d4ed8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-5 pt-4 pb-12">
          <TouchableOpacity className="flex-row items-center mb-6" onPress={() => navigation.goBack()}>
            <ChevronLeft size={20} color="#ffffff" />
            <Text className="text-white ml-1">Back</Text>
          </TouchableOpacity>
          <View className="items-center">
            <View className="w-20 h-20 rounded-3xl bg-white/20 items-center justify-center mb-4">
              <Activity size={36} color="#ffffff" />
            </View>
            <Text className="text-white text-3xl font-bold">AthleteAI</Text>
            <Text className="text-white/70 mt-1">Your Personal AI Sports Coach</Text>
            <Text className="text-white/50 text-sm mt-1">Version 1.0.0</Text>
          </View>
        </LinearGradient>

        <View className="px-4 -mt-5 gap-4 pb-8">
          <View className="bg-white rounded-2xl p-5">
            <Text className="font-bold text-gray-900 text-base mb-3">About AthleteAI</Text>
            <Text className="text-gray-600 leading-relaxed">
              AthleteAI combines artificial intelligence with sports science to deliver
              personalized training plans for athletes of all levels. Whether you're a
              beginner swimmer or a competitive footballer, our AI adapts to your goals,
              equipment, and schedule.
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-5">
            <Text className="font-bold text-gray-900 text-base mb-4">Features</Text>
            {[
              { icon: Activity, title: 'AI Training Plans', desc: 'Generated based on your sport, level, and goals', color: '#3b82f6' },
              { icon: Heart, title: 'Progress Tracking', desc: 'Log workouts and monitor your improvement', color: '#f43f5e' },
              { icon: Shield, title: 'Nutrition Plans', desc: 'Personalized meal plans and hydration tracking', color: '#f59e0b' },
              { icon: Code, title: 'Powered by Supabase', desc: 'Your data, securely stored and synced', color: '#10b981' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <View key={i} className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: color + '20' }}>
                  <Icon size={18} color={color} />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 text-sm">{title}</Text>
                  <Text className="text-gray-500 text-xs mt-0.5">{desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="bg-blue-50 rounded-2xl p-5">
            <Text className="font-bold text-blue-900 mb-2">Supported Sports</Text>
            <View className="flex-row flex-wrap gap-2">
              {['Swimming', 'Football', 'Tennis', 'Basketball', 'Running', 'Cycling', 'Volleyball'].map(sport => (
                <View key={sport} className="bg-white rounded-full px-3 py-1">
                  <Text className="text-blue-700 text-sm">{sport}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="bg-gray-100 rounded-2xl p-4 items-center">
            <Text className="text-gray-500 text-sm">Made with ❤️ for athletes everywhere</Text>
            <Text className="text-gray-400 text-xs mt-1">© 2026 AthleteAI. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
