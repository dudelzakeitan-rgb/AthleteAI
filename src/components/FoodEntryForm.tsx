import { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { FoodEntry } from '../types';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export interface FoodFormValues {
  name: string;
  calories: string;
  mealType: MealType;
  isEstimate: boolean;
}

export interface FoodFormResult {
  name: string;
  calories: number;
  mealType: MealType;
  isEstimate: boolean;
}

export function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function entryDateKey(entry: any): string {
  const raw = entry?.date ?? entry?.entry_date;
  return typeof raw === 'string' ? raw.slice(0, 10) : todayKey();
}

export function entryMealType(entry: any): MealType {
  const raw = entry?.mealType ?? entry?.meal_type;
  return MEAL_TYPES.includes(raw) ? (raw as MealType) : 'snacks';
}

export function entryIsEstimate(entry: any): boolean {
  return Boolean(entry?.isEstimate ?? entry?.is_estimate);
}

/** Parses the `[MEAL: <name> | <kcal> kcal]` marker emitted by the coach edge function. */
export function parseMealMarker(text: string): { name: string; calories: number } | null {
  const match = text.match(/\[MEAL:\s*(.+?)\s*\|\s*(\d+(?:\.\d+)?)\s*kcal\s*\]/i);
  if (!match) return null;
  const calories = Number(match[2]);
  if (!match[1].trim() || !Number.isFinite(calories)) return null;
  return { name: match[1].trim(), calories: Math.round(calories) };
}

export function stripMealMarker(text: string): string {
  return text.replace(/\s*\[MEAL:\s*.+?\s*\|\s*\d+(?:\.\d+)?\s*kcal\s*\]\s*/i, '');
}

export function FoodEntryModal({
  visible,
  onClose,
  initial,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  initial?: Partial<FoodFormResult>;
  onSubmit: (result: FoodFormResult) => Promise<boolean>;
}) {
  const { session } = useApp();
  const [name, setName] = useState(initial?.name ?? '');
  const [calories, setCalories] = useState(
    initial?.calories !== undefined ? String(initial.calories) : ''
  );
  const [mealType, setMealType] = useState<MealType>(initial?.mealType ?? 'breakfast');
  const [isEstimate, setIsEstimate] = useState(initial?.isEstimate ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const parsedCalories = Number(calories);
    if (!trimmedName || !Number.isFinite(parsedCalories) || parsedCalories <= 0) {
      setError('Enter a food name and a calorie amount above zero.');
      return;
    }
    if (!session) {
      setError('Sign in first so your food log is saved to your account.');
      return;
    }
    setIsSaving(true);
    setError(null);
    const ok = await onSubmit({
      name: trimmedName,
      calories: Math.round(parsedCalories),
      mealType,
      isEstimate,
    });
    setIsSaving(false);
    if (ok) {
      onClose();
    } else {
      setError('Could not save. Check your connection and try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={onClose}>
            <X size={22} color="#6b7280" />
          </TouchableOpacity>
          <Text className="font-bold text-gray-900 text-base">
            {initial?.name !== undefined ? 'Edit Food' : 'Add Food'}
          </Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <Text className="text-sm text-gray-600 mb-1">Food</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-4"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Grilled chicken salad"
            placeholderTextColor="#9ca3af"
          />

          <Text className="text-sm text-gray-600 mb-1">Calories</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-4"
            value={calories}
            onChangeText={setCalories}
            placeholder="e.g., 420"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
          />

          <Text className="text-sm text-gray-600 mb-2">Meal</Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {MEAL_TYPES.map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setMealType(m)}
                className={`px-4 py-2 rounded-full border ${mealType === m ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-200'}`}
              >
                <Text className={`text-sm font-medium capitalize ${mealType === m ? 'text-white' : 'text-gray-700'}`}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setIsEstimate(!isEstimate)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-2 flex-row items-center"
          >
            <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${isEstimate ? 'bg-amber-400 border-amber-400' : 'border-gray-300'}`} />
            <View className="flex-1">
              <Text className="text-gray-900 text-sm font-medium">Estimated amount</Text>
              <Text className="text-gray-400 text-xs">Mark this if the calories are an estimate</Text>
            </View>
          </TouchableOpacity>

          {error && <Text className="text-sm text-red-600 mt-3">{error}</Text>}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSaving}
            className="bg-emerald-500 rounded-2xl py-4 items-center mt-5"
          >
            {isSaving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-base">Save Food</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export function EditableFoodRow({ entry, onEdit }: { entry: FoodEntry; onEdit: () => void }) {
  return (
    <View className="bg-gray-50 rounded-xl p-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-2">
          <Text className="font-semibold text-gray-900 text-sm">{entry.name}</Text>
          <Text className="text-xs text-gray-500 mt-1">
            {entry.calories} kcal
            {entryIsEstimate(entry) ? ' · estimate' : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={onEdit} className="px-3 py-1.5 rounded-full bg-white border border-gray-200">
          <Text className="text-blue-600 text-xs font-semibold">Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
