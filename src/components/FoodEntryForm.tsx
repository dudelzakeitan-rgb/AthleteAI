import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface FoodFormInitial {
  name?: string;
  calories?: number;
  isEstimate?: boolean;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  date?: string;
}

interface Props {
  initial?: FoodFormInitial;
  editingId?: string;
  initialEditingValues?: { name?: string; calories?: number; mealType?: FoodFormInitial['mealType']; date?: string };
  onClose: () => void;
}

const MEAL_TYPES: FoodFormInitial['mealType'][] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export function FoodEntryForm({ initial, editingId, initialEditingValues, onClose }: Props) {
  const { addFoodEntry, updateFoodEntry } = useApp();
  const source = initial ?? initialEditingValues ?? {};
  const [name, setName] = useState(source.name ?? '');
  const [calories, setCalories] = useState(String(source.calories ?? ''));
  const [mealType, setMealType] = useState<FoodFormInitial['mealType']>(source.mealType ?? 'breakfast');
  const [date, setDate] = useState(source.date ?? new Date().toISOString().slice(0, 10));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEstimate = Boolean(initial?.isEstimate);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Enter what you ate.');
      return;
    }
    const parsedCalories = parseInt(calories, 10);
    if (!Number.isFinite(parsedCalories) || parsedCalories < 0) {
      setError('Enter the calories for that portion.');
      return;
    }

    setIsSaving(true);
    setError(null);

    if (editingId) {
      const ok = await updateFoodEntry(editingId, {
        name: name.trim(),
        calories: parsedCalories,
        mealType: mealType!,
        date,
        isEstimate: false,
      });
      setIsSaving(false);
      if (!ok) setError('Could not save the change. Please try again.');
      else onClose();
      return;
    }

    const saved = await addFoodEntry({
      date,
      mealType: mealType!,
      name: name.trim(),
      calories: parsedCalories,
      isEstimate,
    });
    setIsSaving(false);
    if (!saved) setError('Could not save that. Please try again.');
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            {editingId ? 'Edit Food' : 'Add Food'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {isEstimate && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-800">
              Calories below are the AI Coach's estimate. Correct them if needed.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">What did you eat?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Oatmeal with banana"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Calories for that portion
            </label>
            <input
              type="number"
              min={0}
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g., 350"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meal</label>
            <div className="grid grid-cols-4 gap-2">
              {MEAL_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    mealType === type
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {editingId ? 'Save Changes' : 'Add Food'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
