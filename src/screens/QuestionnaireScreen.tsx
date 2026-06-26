import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SkillLevel } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Questionnaire'>;

const TOTAL_STEPS = 6;

const gymEquipmentOptions = [
  { id: 'barbell', label: 'Barbell' },
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'cables', label: 'Cable Machine' },
  { id: 'resistance_bands', label: 'Bands' },
  { id: 'pull_up_bar', label: 'Pull-up Bar' },
  { id: 'machines', label: 'Machines' },
  { id: 'cardio_equipment', label: 'Cardio Equipment' },
  { id: 'bodyweight', label: 'Bodyweight Only' },
];

const defaultEquipmentOptions = [
  { id: 'pool', label: 'Pool' },
  { id: 'fins', label: 'Fins' },
  { id: 'paddles', label: 'Paddles' },
  { id: 'kickboard', label: 'Kickboard' },
  { id: 'pull_buoy', label: 'Pull Buoy' },
  { id: 'resistance_bands', label: 'Bands' },
  { id: 'weights', label: 'Weights' },
  { id: 'gym', label: 'Gym Access' },
];

export function QuestionnaireScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { setQuestionnaire } = useApp();
  const { sportId, improvementId } = route.params;

  const isGym = sportId === 'gym';
  const equipmentOptions = isGym ? gymEquipmentOptions : defaultEquipmentOptions;
  const defaultEquipment = isGym ? ['bodyweight'] : ['pool'];

  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('intermediate');
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [trainingDuration, setTrainingDuration] = useState(60);
  const [equipment, setEquipment] = useState<string[]>(defaultEquipment);
  const [weakness, setWeakness] = useState('');
  const [goal, setGoal] = useState('');

  const toggleEquipment = (id: string) => {
    setEquipment(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1 && (!age || isNaN(Number(age)) || Number(age) < 8 || Number(age) > 80)) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 8 and 80.');
      return;
    }
    if (step < 5) {
      setStep(s => s + 1);
      return;
    }
    if (step === 5) {
      if (!weakness.trim() || !goal.trim()) {
        Alert.alert('Required', 'Please fill in your weakness and goal.');
        return;
      }
      setQuestionnaire({
        age: Number(age),
        skillLevel,
        sessionsPerWeek,
        trainingDuration,
        equipment,
        weakness,
        goal,
      });
      navigation.navigate('PlanPreview', { sportId, improvementId });
    }
  };

  const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  const weaknessPlaceholder = isGym
    ? 'e.g., My squat form needs work, or I lack upper body strength'
    : 'e.g., My turns need improvement';

  const goalPlaceholder = isGym
    ? 'e.g., Gain 5kg of muscle in 6 months, or lose 10kg'
    : 'e.g., Qualify for regional championship';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          className="flex-row items-center mb-3"
          onPress={() => (step > 1 ? setStep(s => s - 1) : navigation.goBack())}
        >
          <ChevronLeft size={20} color="#6b7280" />
          <Text className="text-gray-500 ml-1">Back</Text>
        </TouchableOpacity>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium text-gray-500">Step {step} of {TOTAL_STEPS}</Text>
          <Text className="text-sm font-medium text-blue-600">{Math.round(progressPct)}%</Text>
        </View>
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 1: Age */}
        {step === 1 && (
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">How old are you?</Text>
            <Text className="text-gray-500 mb-6">We'll tailor your plan to your age group.</Text>
            <View className="bg-white rounded-2xl p-4 border border-gray-200">
              <TextInput
                className="text-4xl font-bold text-gray-900 text-center py-4"
                value={age}
                onChangeText={setAge}
                placeholder="25"
                placeholderTextColor="#d1d5db"
                keyboardType="number-pad"
                maxLength={3}
              />
              <Text className="text-center text-gray-400 text-sm">years old</Text>
            </View>
          </View>
        )}

        {/* Step 2: Skill Level */}
        {step === 2 && (
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {isGym ? 'Gym experience' : 'Your skill level'}
            </Text>
            <Text className="text-gray-500 mb-6">Be honest — we'll calibrate your plan.</Text>
            <View className="gap-3">
              {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setSkillLevel(level)}
                  className={`bg-white rounded-2xl p-5 border-2 flex-row items-center ${
                    skillLevel === level ? 'border-blue-500' : 'border-gray-100'
                  }`}
                >
                  <View
                    className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                      skillLevel === level ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}
                  >
                    {skillLevel === level && <Check size={12} color="#ffffff" />}
                  </View>
                  <View>
                    <Text className={`font-semibold text-base capitalize ${skillLevel === level ? 'text-blue-600' : 'text-gray-900'}`}>
                      {level}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {isGym
                        ? (level === 'beginner' ? 'New to the gym, learning basic movements' :
                           level === 'intermediate' ? 'Training 6+ months, comfortable with lifts' :
                           'Training 2+ years, know the compounds well')
                        : (level === 'beginner' ? 'New to training, learning basics' :
                           level === 'intermediate' ? 'Regular training, solid foundation' :
                           'Competing or training intensively')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Sessions/week */}
        {step === 3 && (
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">Sessions per week</Text>
            <Text className="text-gray-500 mb-6">How many days can you train?</Text>
            <View className="flex-row flex-wrap gap-3 justify-center">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setSessionsPerWeek(n)}
                  className={`w-16 h-16 rounded-2xl items-center justify-center ${
                    sessionsPerWeek === n ? 'bg-blue-500' : 'bg-white border border-gray-200'
                  }`}
                >
                  <Text className={`text-2xl font-bold ${sessionsPerWeek === n ? 'text-white' : 'text-gray-900'}`}>
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-center text-gray-400 mt-4">
              {sessionsPerWeek} session{sessionsPerWeek !== 1 ? 's' : ''} per week
            </Text>
          </View>
        )}

        {/* Step 4: Duration */}
        {step === 4 && (
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">Session duration</Text>
            <Text className="text-gray-500 mb-6">How long is each training session?</Text>
            <View className="gap-3">
              {[30, 45, 60, 75, 90, 120].map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setTrainingDuration(d)}
                  className={`bg-white rounded-2xl p-4 border-2 flex-row items-center justify-between ${
                    trainingDuration === d ? 'border-blue-500' : 'border-gray-100'
                  }`}
                >
                  <Text className={`font-semibold text-base ${trainingDuration === d ? 'text-blue-600' : 'text-gray-900'}`}>
                    {d} minutes
                  </Text>
                  {trainingDuration === d && <Check size={18} color="#3b82f6" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 5: Equipment, Weakness, Goal */}
        {step === 5 && (
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-6">Final details</Text>

            <Text className="font-semibold text-gray-900 mb-3">
              {isGym ? 'Available Equipment' : 'Available Equipment'}
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {equipmentOptions.map((eq) => (
                <TouchableOpacity
                  key={eq.id}
                  onPress={() => toggleEquipment(eq.id)}
                  className={`px-4 py-2 rounded-full border ${
                    equipment.includes(eq.id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text className={`text-sm font-medium ${equipment.includes(eq.id) ? 'text-white' : 'text-gray-700'}`}>
                    {eq.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="font-semibold text-gray-900 mb-2">
              {isGym ? 'Main Weakness' : 'Main Weakness'}
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-2xl p-4 text-gray-900 text-base mb-4"
              value={weakness}
              onChangeText={setWeakness}
              placeholder={weaknessPlaceholder}
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />

            <Text className="font-semibold text-gray-900 mb-2">Primary Goal</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-2xl p-4 text-gray-900 text-base"
              value={goal}
              onChangeText={setGoal}
              placeholder={goalPlaceholder}
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />
          </View>
        )}
      </ScrollView>

      {/* Next Button */}
      <View className="px-5 pb-6 bg-white border-t border-gray-100 pt-4">
        <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
          <LinearGradient
            colors={['#3b82f6', '#06b6d4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl py-4 flex-row items-center justify-center"
          >
            <Text className="text-white font-bold text-base mr-2">
              {step === 5 ? 'Generate My Plan' : 'Continue'}
            </Text>
            <ChevronRight size={18} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
