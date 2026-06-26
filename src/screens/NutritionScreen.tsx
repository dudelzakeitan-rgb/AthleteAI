import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Apple, Droplets, Calculator, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { HydrationEntry } from '../types';

type TabType = 'meals' | 'hydration' | 'calculator';

const mealPlan = {
  breakfast: [
    { name: 'Oatmeal with Banana', calories: 380, protein: 12, carbs: 68, fat: 6 },
    { name: 'Greek Yogurt & Berries', calories: 220, protein: 20, carbs: 28, fat: 3 },
  ],
  lunch: [
    { name: 'Chicken & Rice Bowl', calories: 520, protein: 42, carbs: 55, fat: 10 },
    { name: 'Quinoa Salad', calories: 380, protein: 18, carbs: 48, fat: 12 },
  ],
  dinner: [
    { name: 'Salmon & Sweet Potato', calories: 480, protein: 38, carbs: 42, fat: 14 },
    { name: 'Turkey Stir Fry', calories: 420, protein: 36, carbs: 38, fat: 10 },
  ],
  snacks: [
    { name: 'Protein Shake', calories: 180, protein: 30, carbs: 10, fat: 3 },
    { name: 'Almonds & Apple', calories: 240, protein: 6, carbs: 28, fat: 14 },
  ],
};

const WATER_AMOUNTS = [250, 500, 750, 1000];

export function NutritionScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('meals');
  const [expandedMeal, setExpandedMeal] = useState<string>('breakfast');
  const { hydrationEntries, addHydrationEntry } = useApp();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<'light' | 'moderate' | 'active'>('moderate');

  const todayEntries = hydrationEntries.filter(e => e.date === new Date().toISOString().split('T')[0]);
  const waterTotal = todayEntries.reduce((s, e) => s + e.amount, 0);
  const waterGoal = 2500;
  const waterPct = Math.min((waterTotal / waterGoal) * 100, 100);

  const handleAddWater = async (amount: number) => {
    const entry: HydrationEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount,
      unit: 'ml',
      timestamp: new Date().toISOString(),
    };
    await addHydrationEntry(entry);
  };

  const calcBMR = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h) return null;
    const bmr = 10 * w + 6.25 * h - 5 * 25 + 5;
    const mult = activityLevel === 'light' ? 1.375 : activityLevel === 'moderate' ? 1.55 : 1.725;
    return Math.round(bmr * mult);
  };

  const tdee = calcBMR();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={['#065f46', '#10b981']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-5 pt-6 pb-8">
        <Text className="text-white text-2xl font-bold">Nutrition</Text>
        <Text className="text-white/70 text-sm mt-1">Fuel your performance</Text>
      </LinearGradient>

      {/* Tabs */}
      <View className="flex-row mx-4 -mt-4 bg-white rounded-2xl shadow-sm p-1 mb-4">
        {([['meals', 'Meal Plan'], ['hydration', 'Hydration'], ['calculator', 'Calculator']] as [TabType, string][]).map(([id, label]) => (
          <TouchableOpacity
            key={id}
            onPress={() => setActiveTab(id)}
            className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === id ? 'bg-emerald-500' : ''}`}
          >
            <Text className={`text-sm font-semibold ${activeTab === id ? 'text-white' : 'text-gray-500'}`}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {/* Meal Plan */}
        {activeTab === 'meals' && (
          <View className="gap-3">
            {(Object.entries(mealPlan) as [string, typeof mealPlan.breakfast][]).map(([meal, items]) => (
              <View key={meal} className="bg-white rounded-2xl overflow-hidden">
                <TouchableOpacity
                  onPress={() => setExpandedMeal(expandedMeal === meal ? '' : meal)}
                  className="flex-row items-center justify-between p-4"
                >
                  <View className="flex-row items-center">
                    <Apple size={18} color="#10b981" />
                    <Text className="font-semibold text-gray-900 ml-2 capitalize">{meal}</Text>
                  </View>
                  {expandedMeal === meal ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                </TouchableOpacity>
                {expandedMeal === meal && (
                  <View className="px-4 pb-4 gap-2">
                    {items.map((item, i) => (
                      <View key={i} className="bg-gray-50 rounded-xl p-3">
                        <Text className="font-semibold text-gray-900 text-sm">{item.name}</Text>
                        <View className="flex-row gap-3 mt-2">
                          <Text className="text-xs text-gray-500">{item.calories} kcal</Text>
                          <Text className="text-xs text-blue-500">{item.protein}g protein</Text>
                          <Text className="text-xs text-amber-500">{item.carbs}g carbs</Text>
                          <Text className="text-xs text-rose-500">{item.fat}g fat</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Hydration */}
        {activeTab === 'hydration' && (
          <View className="gap-4">
            <View className="bg-white rounded-2xl p-5 items-center">
              <View className="relative items-center justify-center mb-4">
                <View className="w-32 h-32 rounded-full border-8 border-gray-100 items-center justify-center">
                  <View
                    className="absolute inset-0 rounded-full border-8 border-blue-500"
                    style={{
                      borderColor: '#3b82f6',
                      transform: [{ rotate: `${(waterPct / 100) * 360}deg` }],
                    }}
                  />
                  <Droplets size={28} color="#3b82f6" />
                  <Text className="text-xl font-bold text-gray-900 mt-1">{waterTotal}ml</Text>
                  <Text className="text-xs text-gray-400">of {waterGoal}ml</Text>
                </View>
              </View>
              <View className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <View className="h-full bg-blue-500 rounded-full" style={{ width: `${waterPct}%` }} />
              </View>
              <Text className="text-blue-600 font-semibold">{Math.round(waterPct)}% of daily goal</Text>
            </View>

            <View className="bg-white rounded-2xl p-5">
              <Text className="font-semibold text-gray-900 mb-3">Quick Add</Text>
              <View className="flex-row flex-wrap gap-2">
                {WATER_AMOUNTS.map(amount => (
                  <TouchableOpacity
                    key={amount}
                    onPress={() => handleAddWater(amount)}
                    className="bg-blue-50 rounded-xl px-4 py-3 flex-row items-center"
                  >
                    <Plus size={14} color="#3b82f6" />
                    <Text className="text-blue-700 font-semibold ml-1 text-sm">{amount}ml</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="bg-blue-50 rounded-2xl p-4">
              <Text className="text-blue-900 font-semibold mb-1">Hydration Tips</Text>
              <Text className="text-blue-700 text-sm">Drink 500ml 2 hours before training, sip regularly during exercise, and rehydrate with 1.5x the fluid lost through sweat after sessions.</Text>
            </View>
          </View>
        )}

        {/* Calculator */}
        {activeTab === 'calculator' && (
          <View className="gap-4">
            <View className="bg-white rounded-2xl p-5">
              <Text className="font-semibold text-gray-900 mb-4">Calorie Calculator</Text>

              <Text className="text-gray-600 text-sm mb-1">Weight (kg)</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 mb-3 border border-gray-100"
                value={weight}
                onChangeText={setWeight}
                placeholder="75"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
              />

              <Text className="text-gray-600 text-sm mb-1">Height (cm)</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 mb-3 border border-gray-100"
                value={height}
                onChangeText={setHeight}
                placeholder="175"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
              />

              <Text className="text-gray-600 text-sm mb-2">Activity Level</Text>
              <View className="flex-row gap-2">
                {(['light', 'moderate', 'active'] as const).map(level => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setActivityLevel(level)}
                    className={`flex-1 py-2 rounded-xl items-center ${activityLevel === level ? 'bg-emerald-500' : 'bg-gray-100'}`}
                  >
                    <Text className={`text-xs font-semibold capitalize ${activityLevel === level ? 'text-white' : 'text-gray-600'}`}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {tdee && (
              <LinearGradient colors={['#065f46', '#10b981']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-2xl p-5">
                <Text className="text-white/70 text-sm mb-1">Daily Calorie Target</Text>
                <Text className="text-white text-4xl font-bold">{tdee}</Text>
                <Text className="text-white/70 text-sm mt-1">kcal / day</Text>
                <View className="flex-row gap-4 mt-4">
                  <View className="bg-white/20 rounded-xl px-3 py-2">
                    <Text className="text-white font-bold">{Math.round(tdee * 0.25 / 4)}g</Text>
                    <Text className="text-white/70 text-xs">Protein</Text>
                  </View>
                  <View className="bg-white/20 rounded-xl px-3 py-2">
                    <Text className="text-white font-bold">{Math.round(tdee * 0.50 / 4)}g</Text>
                    <Text className="text-white/70 text-xs">Carbs</Text>
                  </View>
                  <View className="bg-white/20 rounded-xl px-3 py-2">
                    <Text className="text-white font-bold">{Math.round(tdee * 0.25 / 9)}g</Text>
                    <Text className="text-white/70 text-xs">Fat</Text>
                  </View>
                </View>
              </LinearGradient>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
