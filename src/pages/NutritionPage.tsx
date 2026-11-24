import { useState } from 'react';
import {
  Apple,
  Droplets,
  Flame,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Calendar,
  Target,
  Coffee,
  Utensils,
  Cookie,
  Calculator,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HydrationEntry, FoodEntry } from '../types';
import { FoodEntryForm } from '../components/FoodEntryForm';

interface LocalMeal {
  name: string;
  calories: number;
  description?: string;
  nutrients?: string[];
  protein?: number;
  carbs?: number;
  fat?: number;
}
import { format, subDays } from 'date-fns';

const mealTemplates: Record<string, LocalMeal[]> = {
  breakfast: [
    { name: 'Oatmeal with Berries', calories: 380, protein: 12, carbs: 65, fat: 8, description: 'Complex carbs with antioxidant boost', nutrients: ['Fiber', 'Vitamin C', 'Potassium'] },
    { name: 'Avocado Toast & Eggs', calories: 420, protein: 18, carbs: 35, fat: 22, description: 'High protein, healthy fats', nutrients: ['Omega-3', 'Vitamin D', 'Protein'] },
    { name: 'Greek Yogurt Bowl', calories: 280, protein: 22, carbs: 30, fat: 6, description: 'Protein-rich with probiotics', nutrients: ['Probiotics', 'Calcium', 'Protein'] },
    { name: 'Smoothie Bowl', calories: 350, protein: 15, carbs: 55, fat: 8, description: 'Quick, nutrient-dense option', nutrients: ['Antioxidants', 'Fiber', 'Energy'] },
  ],
  lunch: [
    { name: 'Grilled Chicken Salad', calories: 450, protein: 35, carbs: 25, fat: 22, description: 'Lean protein with fresh greens', nutrients: ['Protein', 'Vitamin A', 'Iron'] },
    { name: 'Quinoa Buddha Bowl', calories: 480, protein: 18, carbs: 55, fat: 20, description: 'Complete plant-based protein', nutrients: ['Fiber', 'Iron', 'Magnesium'] },
    { name: 'Turkey Wrap', calories: 380, protein: 28, carbs: 42, fat: 12, description: 'Portable, balanced meal', nutrients: ['Protein', 'B Vitamins', 'Zinc'] },
    { name: 'Salmon Poke Bowl', calories: 520, protein: 32, carbs: 48, fat: 18, description: 'Omega-3 rich, delicious', nutrients: ['Omega-3', 'Vitamin D', 'Selenium'] },
  ],
  dinner: [
    { name: 'Grilled Salmon & Veggies', calories: 480, protein: 35, carbs: 20, fat: 24, description: 'Heart-healthy omega-3 meal', nutrients: ['Omega-3', 'Vitamin D', 'Protein'] },
    { name: 'Lean Beef Stir Fry', calories: 450, protein: 38, carbs: 35, fat: 16, description: 'High protein, iron-rich', nutrients: ['Iron', 'B12', 'Zinc'] },
    { name: 'Chicken & Vegetable Curry', calories: 420, protein: 30, carbs: 38, fat: 15, description: 'Anti-inflammatory spices', nutrients: ['Curcumin', 'Protein', 'Fiber'] },
    { name: 'Pasta Primavera', calories: 480, protein: 18, carbs: 75, fat: 12, description: 'Carb-loading for performance', nutrients: ['Carbs', 'Vitamin C', 'Fiber'] },
  ],
  snacks: [
    { name: 'Protein Bar', calories: 220, protein: 20, carbs: 22, fat: 8, description: 'Quick post-workout fuel', nutrients: ['Protein', 'Energy'] },
    { name: 'Mixed Nuts', calories: 180, protein: 6, carbs: 8, fat: 16, description: 'Healthy fats, sustained energy', nutrients: ['Omega-3', 'Vitamin E', 'Magnesium'] },
    { name: 'Greek Yogurt', calories: 120, protein: 15, carbs: 8, fat: 2, description: 'High protein snack', nutrients: ['Protein', 'Calcium', 'Probiotics'] },
    { name: 'Banana & Peanut Butter', calories: 280, protein: 8, carbs: 35, fat: 14, description: 'Pre-workout energy boost', nutrients: ['Potassium', 'Protein', 'Energy'] },
  ],
};

export function NutritionPage() {
  const { hydrationEntries, addHydrationEntry, foodEntries, deleteFoodEntry } = useApp();
  const [selectedTab, setSelectedTab] = useState<'planner' | 'hydration' | 'calculator'>('planner');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal] = useState(64);
  const [expandedMeal, setExpandedMeal] = useState<string>('breakfast');
  const [foodForm, setFoodForm] = useState<{ mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks' } | null>(null);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [dailyPlan, setDailyPlan] = useState<Record<string, LocalMeal | null>>({
    breakfast: null,
    lunch: null,
    dinner: null,
    snacks: null,
  });

  const todayHydration = hydrationEntries.filter(
    (e) => format(new Date(e.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );
  const totalWater = todayHydration.reduce((sum, e) => sum + e.amount, 0) + waterIntake;

  const handleAddWater = (amount: number) => {
    const entry: HydrationEntry = {
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
      amount,
      unit: 'oz',
      timestamp: new Date().toISOString(),
    };
    addHydrationEntry(entry);
    setWaterIntake((prev) => prev + amount);
  };

  const handleSelectMeal = (mealType: string, meal: LocalMeal) => {
    setDailyPlan((prev) => ({
      ...prev,
      [mealType]: prev[mealType]?.name === meal.name ? null : meal,
    }));
  };

  const todayFood = foodEntries.filter(
    (e) => e.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const calculateTotals = () => {
    return {
      calories: todayFood.reduce((sum, m) => sum + m.calories, 0),
      protein: todayFood.reduce((sum, m) => sum + (m.protein ?? 0), 0),
      carbs: todayFood.reduce((sum, m) => sum + (m.carbs ?? 0), 0),
      fat: todayFood.reduce((sum, m) => sum + (m.fat ?? 0), 0),
    };
  };

  const totals = calculateTotals();

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Nutrition</h1>
          <p className="text-gray-600">Plan your meals, track hydration, and optimize your diet</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'planner', label: 'Meal Planner', icon: Utensils },
            { id: 'hydration', label: 'Hydration Tracker', icon: Droplets },
            { id: 'calculator', label: 'Calorie Calculator', icon: Calculator },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedTab === tab.id
                  ? 'bg-white text-emerald-600 shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {selectedTab === 'planner' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Daily Meal Plan</h2>
                    <p className="text-sm text-gray-500">{format(selectedDate, 'EEEE, MMMM d')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['Yesterday', 'Today', 'Tomorrow'].map((day, i) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(subDays(new Date(), 1 - i))}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        format(selectedDate, 'EEE') === day.substring(0, 3)
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Calories', value: totals.calories, target: 2200, unit: 'cal', color: 'bg-blue-500' },
                  { label: 'Protein', value: totals.protein, target: 150, unit: 'g', color: 'bg-rose-500' },
                  { label: 'Carbs', value: totals.carbs, target: 250, unit: 'g', color: 'bg-amber-500' },
                  { label: 'Fat', value: totals.fat, target: 70, unit: 'g', color: 'bg-purple-500' },
                ].map((macro) => (
                  <div key={macro.label} className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">{macro.label}</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {macro.value}
                      <span className="text-sm font-normal text-gray-400">/{macro.target}{macro.unit}</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${macro.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, (macro.value / macro.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {Object.entries(mealTemplates).map(([mealType, meals]) => (
              <FoodSection
                key={mealType}
                mealType={mealType}
                meals={meals}
                todayFood={todayFood.filter((e) => e.mealType === mealType)}
                dailyPlan={dailyPlan}
                expandedMeal={expandedMeal}
                setExpandedMeal={setExpandedMeal}
                setFoodForm={setFoodForm}
                setEditingEntry={setEditingEntry}
                deleteFoodEntry={deleteFoodEntry}
                handleSelectMeal={handleSelectMeal}
              />
            ))}

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-2">Recovery Nutrition Tips</h3>
                  <ul className="space-y-2 text-emerald-800 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Consume protein within 30 minutes of training for optimal recovery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Include complex carbs to replenish glycogen stores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Stay hydrated throughout the day, not just during training</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'hydration' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Today's Hydration</h2>
                  <p className="text-gray-500">Track your daily water intake</p>
                </div>
              </div>

              <div className="flex justify-center mb-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(totalWater / waterGoal) * 553} 553`}
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Droplets className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-4xl font-bold text-gray-900">{totalWater}</span>
                    <span className="text-sm text-gray-500">of {waterGoal} oz</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {[4, 8, 12, 16, 20].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAddWater(amount)}
                    className="flex flex-col items-center gap-1 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-600">{amount}</span>
                    <span className="text-xs text-gray-500">oz</span>
                  </button>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Today's Log</h3>
                {todayHydration.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {todayHydration.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{entry.amount} {entry.unit}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(entry.timestamp), 'h:mm a')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No water logged yet today</p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">Hydration Guidelines</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Before Training', amount: '16-20 oz', timing: '2 hours before' },
                  { label: 'During Training', amount: '8 oz', timing: 'Every 20 min' },
                  { label: 'After Training', amount: '16-24 oz', timing: 'Per pound lost' },
                ].map((tip) => (
                  <div key={tip.label} className="bg-white/10 rounded-xl p-4">
                    <div className="text-sm opacity-90 mb-1">{tip.label}</div>
                    <div className="text-xl font-bold">{tip.amount}</div>
                    <div className="text-xs opacity-75 mt-1">{tip.timing}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'calculator' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Calorie & Macro Calculator</h2>
                  <p className="text-gray-500">Estimate your daily nutritional needs</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Calories', value: 2400, unit: 'cal/day', color: 'from-blue-500 to-cyan-500' },
                  { label: 'Protein', value: 160, unit: 'g/day', color: 'from-rose-500 to-pink-500' },
                  { label: 'Carbs', value: 280, unit: 'g/day', color: 'from-amber-500 to-orange-500' },
                  { label: 'Fat', value: 75, unit: 'g/day', color: 'from-purple-500 to-indigo-500' },
                ].map((macro) => (
                  <div
                    key={macro.label}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${macro.color} text-white text-center`}
                  >
                    <div className="text-sm opacity-90 mb-2">{macro.label}</div>
                    <div className="text-3xl font-bold">{macro.value}</div>
                    <div className="text-sm opacity-75">{macro.unit}</div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Your Daily Targets
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Basal Metabolic Rate (BMR)</div>
                    <div className="text-2xl font-bold text-gray-900">1,850 cal/day</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Total Daily Energy Expenditure</div>
                    <div className="text-2xl font-bold text-gray-900">2,850 cal/day</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Protein', tip: '1.6-2.2g per kg of body weight for athletes', amount: '160g' },
                  { label: 'Carbohydrates', tip: '6-10g per kg for training fuel', amount: '280g' },
                  { label: 'Fat', tip: '0.8-1g per kg for hormone health', amount: '75g' },
                ].map((macro) => (
                  <div key={macro.label} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-900">{macro.label}</div>
                      <div className="text-sm text-gray-500">{macro.tip}</div>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{macro.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Important Note</h3>
                  <p className="text-amber-800 text-sm">
                    These calculations are estimates based on general formulas. Individual needs vary
                    based on metabolism, training intensity, and goals. Consult with a sports
                    nutritionist for personalized guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {foodForm && (
        <FoodEntryForm
          initial={{ mealType: foodForm.mealType, date: format(selectedDate, 'yyyy-MM-dd') }}
          onClose={() => setFoodForm(null)}
        />
      )}

      {editingEntry && (
        <FoodEntryForm
          editingId={editingEntry}
          initialEditingValues={{
            name: foodEntries.find((e) => e.id === editingEntry)?.name,
            calories: foodEntries.find((e) => e.id === editingEntry)?.calories,
            mealType: foodEntries.find((e) => e.id === editingEntry)?.mealType,
            date: foodEntries.find((e) => e.id === editingEntry)?.date,
          }}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
}

function FoodSection({
  mealType,
  meals,
  todayFood,
  dailyPlan,
  expandedMeal,
  setExpandedMeal,
  setFoodForm,
  setEditingEntry,
  deleteFoodEntry,
  handleSelectMeal,
}: {
  mealType: string;
  meals: LocalMeal[];
  todayFood: FoodEntry[];
  dailyPlan: Record<string, LocalMeal | null>;
  expandedMeal: string;
  setExpandedMeal: (v: string) => void;
  setFoodForm: (v: { mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks' }) => void;
  setEditingEntry: (id: string) => void;
  deleteFoodEntry: (id: string) => void;
  handleSelectMeal: (mealType: string, meal: LocalMeal) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <button
        onClick={() => setExpandedMeal(expandedMeal === mealType ? '' : mealType)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            {mealType === 'breakfast' && <Coffee className="w-5 h-5 text-white" />}
            {mealType === 'lunch' && <Utensils className="w-5 h-5 text-white" />}
            {mealType === 'dinner' && <Apple className="w-5 h-5 text-white" />}
            {mealType === 'snacks' && <Cookie className="w-5 h-5 text-white" />}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900 capitalize">{mealType}</h3>
            {todayFood.length > 0 && (
              <p className="text-sm text-emerald-600">
                {todayFood.reduce((s, e) => s + e.calories, 0)} cal logged
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFoodForm({ mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snacks' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Food
          </button>
          {expandedMeal === mealType ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {expandedMeal === mealType && (
        <div className="px-6 pb-6 grid sm:grid-cols-2 gap-3 animate-fade-in">
          {todayFood.map((entry) => (
            <div key={entry.id} className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300">
              <div className="flex items-start justify-between mb-1.5">
                <span className="font-semibold text-gray-900">{entry.name}</span>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{entry.calories} cal</span>
              </div>
              {entry.isEstimate && (
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 mb-2">
                  AI estimate
                </span>
              )}
              <div className="flex gap-3 text-xs">
                <button
                  onClick={() => setEditingEntry(entry.id)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteFoodEntry(entry.id)}
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {meals.map((meal, i) => (
            <button
              key={i}
              onClick={() => handleSelectMeal(mealType, meal)}
              className={`p-4 rounded-xl text-left transition-all ${
                dailyPlan[mealType]?.name === meal.name
                  ? 'bg-emerald-100 border-2 border-emerald-500'
                  : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-gray-900">{meal.name}</span>
                {dailyPlan[mealType]?.name === meal.name && (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                )}
              </div>
              <div className="text-sm text-gray-600 mb-2">{meal.description}</div>
              <div className="flex gap-3 text-xs text-gray-500">
                <span>{meal.calories} cal</span>
                {meal.protein !== undefined && <span>{meal.protein}g protein</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
