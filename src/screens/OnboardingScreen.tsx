import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ClipboardList,
  Minus,
  Plus,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import {
  useOnboardingState,
  TOTAL_STEPS,
  preferencesToAnswers,
  answersToPreferences,
  OnboardingAnswers,
  OnboardingErrors,
  SPORT_OPTIONS,
  SKILL_LEVELS,
  EQUIPMENT_OPTIONS,
  GOAL_OPTIONS,
  TRAINING_DAY_OPTIONS,
} from '../lib/onboarding';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const BLUE = '#3b82f6';
const CYAN = '#06b6d4';

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full border-2 mr-2 mb-2 ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
    >
      <Text className={`text-sm font-medium ${selected ? 'text-blue-700' : 'text-gray-600'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function NumberStepper({
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  suffix: string;
}) {
  return (
    <View className="flex-row items-center justify-between mb-5">
      <TouchableOpacity
        onPress={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white"
      >
        <Minus size={16} color="#4b5563" />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-gray-900">
        {value} <Text className="text-sm font-medium text-gray-500">{suffix}</Text>
      </Text>
      <TouchableOpacity
        onPress={() => onChange(Math.min(max, value + 1))}
        className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white"
      >
        <Plus size={16} color="#4b5563" />
      </TouchableOpacity>
    </View>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="mb-4">
      <Text className="text-lg font-bold text-gray-900">{title}</Text>
      <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
    </View>
  );
}

function OnboardingStepContent({
  step,
  answers,
  onChange,
  errors,
}: {
  step: number;
  answers: OnboardingAnswers;
  onChange: (changes: Partial<OnboardingAnswers>) => void;
  errors: OnboardingErrors;
}) {
  const toggle = (field: 'sports' | 'trainingDays' | 'equipment' | 'goals', value: string) => {
    const list = answers[field];
    onChange({ [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  const inputClass =
    'bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm';

  switch (step) {
    case 1:
      return (
        <View>
          <StepTitle title="About you" subtitle="Basic details so plans fit your body." />
          <Text className="text-sm font-medium text-gray-700 mb-2">Age *</Text>
          <TextInput
            className={inputClass}
            value={answers.age}
            onChangeText={(t) => onChange({ age: t })}
            placeholder="25"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
          />
          {errors.age ? <Text className="text-sm text-red-600 mt-1">{errors.age}</Text> : null}
          <Text className="text-sm font-medium text-gray-700 mb-2 mt-4">Height (cm)</Text>
          <TextInput
            className={inputClass}
            value={answers.heightCm}
            onChangeText={(t) => onChange({ heightCm: t })}
            placeholder="175"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
          />
          {errors.heightCm ? (
            <Text className="text-sm text-red-600 mt-1">{errors.heightCm}</Text>
          ) : null}
          <Text className="text-sm font-medium text-gray-700 mb-2 mt-4">Weight (kg, optional)</Text>
          <TextInput
            className={inputClass}
            value={answers.weightKg}
            onChangeText={(t) => onChange({ weightKg: t })}
            placeholder="70"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
          />
          {errors.weightKg ? (
            <Text className="text-sm text-red-600 mt-1">{errors.weightKg}</Text>
          ) : null}
        </View>
      );

    case 2:
      return (
        <View>
          <StepTitle title="Your sports" subtitle="Pick every sport you train." />
          <View className="flex-row flex-wrap">
            {SPORT_OPTIONS.map((sport) => (
              <Chip
                key={sport}
                label={sport}
                selected={answers.sports.includes(sport)}
                onPress={() => toggle('sports', sport)}
              />
            ))}
          </View>
          {errors.sports ? <Text className="text-sm text-red-600 mt-1">{errors.sports}</Text> : null}
          <Text className="text-sm font-medium text-gray-700 mb-2 mt-4">Skill level</Text>
          <View className="flex-row gap-2">
            {SKILL_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => onChange({ skillLevel: level })}
                className={`flex-1 py-3 rounded-xl border-2 ${
                  answers.skillLevel === level ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <Text
                  className={`text-sm font-medium text-center capitalize ${
                    answers.skillLevel === level ? 'text-blue-700' : 'text-gray-600'
                  }`}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );

    case 3:
      return (
        <View>
          <StepTitle
            title="Training frequency"
            subtitle="How often and how long are your sessions?"
          />
          <NumberStepper
            value={answers.sessionsPerWeek}
            onChange={(v) => onChange({ sessionsPerWeek: v })}
            min={1}
            max={14}
            suffix="x / week"
          />
          <NumberStepper
            value={answers.sessionMinutes}
            onChange={(v) => onChange({ sessionMinutes: v })}
            min={15}
            max={180}
            suffix="min / session"
          />
        </View>
      );

    case 4:
      return (
        <View>
          <StepTitle title="Available days" subtitle="Which days can you train?" />
          <View className="flex-row flex-wrap">
            {TRAINING_DAY_OPTIONS.map((day) => (
              <Chip
                key={day}
                label={day}
                selected={answers.trainingDays.includes(day)}
                onPress={() => toggle('trainingDays', day)}
              />
            ))}
          </View>
          {errors.trainingDays ? (
            <Text className="text-sm text-red-600 mt-1">{errors.trainingDays}</Text>
          ) : null}
        </View>
      );

    case 5:
      return (
        <View>
          <StepTitle title="Equipment" subtitle="What do you have access to?" />
          <View className="flex-row flex-wrap">
            {EQUIPMENT_OPTIONS.map((eq) => (
              <Chip
                key={eq.id}
                label={eq.label}
                selected={answers.equipment.includes(eq.id)}
                onPress={() => toggle('equipment', eq.id)}
              />
            ))}
          </View>
          {errors.equipment ? (
            <Text className="text-sm text-red-600 mt-1">{errors.equipment}</Text>
          ) : null}
        </View>
      );

    case 6:
      return (
        <View>
          <StepTitle title="Goals & weaknesses" subtitle="What are you working toward?" />
          <View className="flex-row flex-wrap">
            {GOAL_OPTIONS.map((goal) => (
              <Chip
                key={goal}
                label={goal}
                selected={answers.goals.includes(goal)}
                onPress={() => toggle('goals', goal)}
              />
            ))}
          </View>
          {errors.goals ? <Text className="text-sm text-red-600 mt-1">{errors.goals}</Text> : null}
          <Text className="text-sm font-medium text-gray-700 mb-2 mt-4">
            Weaknesses to improve (optional)
          </Text>
          <TextInput
            className={inputClass}
            value={answers.weaknesses}
            onChangeText={(t) => onChange({ weaknesses: t })}
            placeholder="e.g. sprint starts, weaker left foot"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      );

    case 7:
      return (
        <View>
          <StepTitle
            title="Injuries & schedule"
            subtitle="Anything the coach should work around."
          />
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Injuries or limitations (optional)
          </Text>
          <TextInput
            className={inputClass}
            value={answers.injuries}
            onChangeText={(t) => onChange({ injuries: t })}
            placeholder="e.g. knee pain when running"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Text className="text-sm font-medium text-gray-700 mb-2 mt-4">
            Current training schedule (optional)
          </Text>
          <TextInput
            className={inputClass}
            value={answers.currentSchedule}
            onChangeText={(t) => onChange({ currentSchedule: t })}
            placeholder="e.g. Team practice Tue/Thu"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      );

    case 8:
    default:
      return (
        <View>
          <StepTitle
            title="Dietary preferences"
            subtitle="Allergies and preferences for meal suggestions."
          />
          <TextInput
            className={inputClass}
            value={answers.dietNotes}
            onChangeText={(t) => onChange({ dietNotes: t })}
            placeholder="e.g. vegetarian, allergic to peanuts"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      );
  }
}

export function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const { preferences, preferencesLoaded, savePreferences } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const state = useOnboardingState(preferencesToAnswers(preferences));
  const editing = Boolean(preferences);

  if (!preferencesLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color={BLUE} />
      </SafeAreaView>
    );
  }

  const handleFinish = async (answersOverride?: OnboardingAnswers) => {
    const answers = answersOverride ?? state.answers;
    setIsSaving(true);
    setError(null);
    const ok = await savePreferences(answersToPreferences(answers));
    setIsSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => navigation.navigate('MainTabs' as never), 900);
    } else {
      setError('Could not save your answers. Check your connection and try again.');
    }
  };

  const handleNext = () => {
    if (state.step < TOTAL_STEPS) {
      state.next();
      return;
    }
    handleFinish();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <LinearGradient colors={['#1d4ed8', '#3b82f6', '#06b6d4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View className="px-5 pt-4 pb-5">
          <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center mb-3">
            <ClipboardList size={22} color="#ffffff" />
          </View>
          <Text className="text-white text-2xl font-bold">
            {editing ? 'Edit Training Profile' : 'Set Up Training Profile'}
          </Text>
          <Text className="text-white/80 text-sm mt-1">
            {editing
              ? 'Update any answer — the AI Coach and workouts use it immediately.'
              : 'One short questionnaire. The coach and every workout use these answers.'}
          </Text>
        </View>
      </LinearGradient>

      <View className="px-5 pt-4 pb-2 bg-white border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium text-gray-500">
            Step {state.step} of {TOTAL_STEPS}
          </Text>
          <Text className="text-sm font-medium text-blue-600">
            {Math.round((state.step / TOTAL_STEPS) * 100)}%
          </Text>
        </View>
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${(state.step / TOTAL_STEPS) * 100}%` }}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white rounded-2xl p-5">
          <OnboardingStepContent
            step={state.step}
            answers={state.answers}
            onChange={state.setAnswers}
            errors={state.errors}
          />
        </View>

        {error ? <Text className="text-sm text-red-600 text-center mt-3">{error}</Text> : null}
        {saved && (
          <View className="flex-row items-center justify-center mt-3">
            <CheckCircle size={16} color="#10b981" />
            <Text className="text-sm text-emerald-600 ml-1.5">Saved — taking you back…</Text>
          </View>
        )}
      </ScrollView>

      <View className="px-5 pb-6 pt-3 bg-white border-t border-gray-100 flex-row gap-3">
        <TouchableOpacity
          onPress={state.back}
          disabled={state.step === 1 || isSaving}
          className="py-4 px-5 rounded-2xl bg-gray-100 items-center justify-center disabled:opacity-40"
        >
          <View className="flex-row items-center">
            <ChevronLeft size={18} color="#374151" />
            <Text className="text-gray-700 font-semibold">Back</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={isSaving || saved}
          className="flex-1"
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[BLUE, CYAN]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl py-4 flex-row items-center justify-center"
          >
            {isSaving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text className="text-white font-bold text-base mr-2">
                  {state.step === TOTAL_STEPS ? 'Finish' : 'Continue'}
                </Text>
                {state.step === TOTAL_STEPS ? (
                  <CheckCircle size={18} color="#ffffff" />
                ) : (
                  <ChevronRight size={18} color="#ffffff" />
                )}
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
