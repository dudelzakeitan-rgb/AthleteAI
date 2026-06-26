import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Calendar, Clock, Dumbbell, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { sportsConfig, Questionnaire, SkillLevel } from '../types';
import { useApp } from '../context/AppContext';

const skillLevels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

const defaultEquipmentOptions = [
  { id: 'pool', label: 'Access to Pool' },
  { id: 'gym', label: 'Gym Membership' },
  { id: 'weights', label: 'Free Weights' },
  { id: 'resistance_bands', label: 'Resistance Bands' },
  { id: 'foam_roller', label: 'Foam Roller' },
  { id: 'pull_buoy', label: 'Pull Buoy' },
  { id: 'kickboard', label: 'Kickboard' },
  { id: 'paddles', label: 'Hand Paddles' },
  { id: 'fins', label: 'Swim Fins' },
  { id: 'stairs', label: 'Stairs/Bleachers' },
  { id: 'ball', label: 'Sports Ball' },
  { id: 'net', label: 'Net/Goal' },
];

const gymEquipmentOptions = [
  { id: 'barbell', label: 'Barbell' },
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'cables', label: 'Cable Machine' },
  { id: 'resistance_bands', label: 'Resistance Bands' },
  { id: 'pull_up_bar', label: 'Pull-Up Bar' },
  { id: 'machines', label: 'Gym Machines' },
  { id: 'cardio_equipment', label: 'Cardio Equipment' },
  { id: 'bodyweight', label: 'Bodyweight Only' },
  { id: 'kettlebells', label: 'Kettlebells' },
  { id: 'foam_roller', label: 'Foam Roller' },
  { id: 'bench', label: 'Bench' },
  { id: 'squat_rack', label: 'Squat Rack' },
];

export function QuestionnairePage() {
  const { sportId, improvementId } = useParams<{ sportId: string; improvementId: string }>();
  const navigate = useNavigate();
  const { setQuestionnaire } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Questionnaire>>({
    age: 25,
    skillLevel: 'intermediate',
    sessionsPerWeek: 3,
    trainingDuration: 60,
    equipment: [],
    weakness: '',
    goal: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sport = sportsConfig.find((s) => s.id === sportId);
  const improvement = sport?.improvements.find((i) => i.id === improvementId);
  const isGym = sportId === 'gym';
  const equipmentOptions = isGym ? gymEquipmentOptions : defaultEquipmentOptions;

  if (!sport || !improvement) {
    return (
      <div className="pt-20 text-center">
        <p>Training configuration not found</p>
        <button onClick={() => navigate('/sports')} className="text-blue-500 hover:underline">
          Back to Sports
        </button>
      </div>
    );
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.age || formData.age < 8 || formData.age > 100) {
        newErrors.age = 'Please enter a valid age (8-100)';
      }
    }

    if (step === 5) {
      if (!formData.weakness?.trim()) {
        newErrors.weakness = 'Please describe your main weakness';
      }
      if (!formData.goal?.trim()) {
        newErrors.goal = 'Please describe your main goal';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 5) {
        setStep(step + 1);
      } else {
        const fullQuestionnaire: Questionnaire = {
          age: formData.age!,
          skillLevel: formData.skillLevel!,
          sessionsPerWeek: formData.sessionsPerWeek!,
          trainingDuration: formData.trainingDuration!,
          equipment: formData.equipment!,
          weakness: formData.weakness!,
          goal: formData.goal!,
        };

        setQuestionnaire(fullQuestionnaire);
        navigate(`/training/${sportId}/${improvementId}/plan-preview`);
      }
    }
  };

  const handleEquipmentToggle = (equipId: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment?.includes(equipId)
        ? prev.equipment.filter((e) => e !== equipId)
        : [...(prev.equipment || []), equipId],
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">How old are you?</h3>
            <p className="text-gray-600 text-center mb-8">This helps us tailor training intensity</p>

            <div className="max-w-xs mx-auto">
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className={`w-full text-center text-4xl font-bold py-4 rounded-xl border-2 ${
                  errors.age ? 'border-red-500' : 'border-gray-200'
                } focus:border-blue-500 focus:outline-none`}
                min={8}
                max={100}
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.age}</p>
              )}
              <input
                type="range"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                min={8}
                max={100}
                className="w-full mt-4"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">What's your skill level?</h3>
            <p className="text-gray-600 text-center mb-8">This helps us adjust drill complexity</p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              {skillLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setFormData({ ...formData, skillLevel: level })}
                  className={`flex-1 py-5 px-6 rounded-xl border-2 transition-all duration-200 ${
                    formData.skillLevel === level
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="block text-xl font-semibold capitalize">{level}</span>
                  <span className="text-sm text-gray-500 mt-1">
                    {level === 'beginner' && 'Less than 1 year experience'}
                    {level === 'intermediate' && '1-3 years experience'}
                    {level === 'advanced' && '4+ years of training'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              How many training sessions per week?
            </h3>
            <p className="text-gray-600 text-center mb-8">We'll schedule your training accordingly</p>

            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setFormData({ ...formData, sessionsPerWeek: num })}
                  className={`w-14 h-14 rounded-xl text-xl font-bold transition-all duration-200 ${
                    formData.sessionsPerWeek === num
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Training duration per session?
            </h3>
            <p className="text-gray-600 text-center mb-8">Average time you can dedicate per session</p>

            <div className="flex flex-wrap justify-center gap-4">
              {[30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setFormData({ ...formData, trainingDuration: mins })}
                  className={`px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
                    formData.trainingDuration === mins
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center mx-auto mb-6">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              What equipment do you have?
            </h3>
            <p className="text-gray-600 text-center mb-6">Select all that apply</p>

            <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {equipmentOptions.map((equip) => (
                <button
                  key={equip.id}
                  onClick={() => handleEquipmentToggle(equip.id)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    formData.equipment?.includes(equip.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {formData.equipment?.includes(equip.id) && <CheckCircle className="w-4 h-4" />}
                  {equip.label}
                </button>
              ))}
            </div>

            <div className="border-t pt-8 mt-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                What's your main weakness in {improvement.label.toLowerCase()}?
              </h3>
              <p className="text-gray-600 text-center mb-4">Be specific for better recommendations</p>

              <div className="max-w-xl mx-auto mb-6">
                <textarea
                  value={formData.weakness}
                  onChange={(e) => setFormData({ ...formData, weakness: e.target.value })}
                  className={`w-full p-4 rounded-xl border-2 resize-none h-24 ${
                    errors.weakness ? 'border-red-500' : 'border-gray-200'
                  } focus:border-blue-500 focus:outline-none`}
                  placeholder={isGym ? 'e.g., My squat form needs work, or I lack upper body strength' : 'e.g., I struggle with maintaining pace...'}
                />
                {errors.weakness && (
                  <p className="text-red-500 text-sm mt-1">{errors.weakness}</p>
                )}
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                What's your main goal?
              </h3>
              <p className="text-gray-600 text-center mb-4">Where do you want to be in 3 months?</p>

              <div className="max-w-xl mx-auto">
                <textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className={`w-full p-4 rounded-xl border-2 resize-none h-24 ${
                    errors.goal ? 'border-red-500' : 'border-gray-200'
                  } focus:border-blue-500 focus:outline-none`}
                  placeholder={isGym ? 'e.g., I want to gain 5kg of muscle in 6 months, or lose 10kg' : 'e.g., I want to improve my time by 5 seconds...'}
                />
                {errors.goal && (
                  <p className="text-red-500 text-sm mt-1">{errors.goal}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate(`/sports/${sportId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{step > 1 ? 'Previous' : 'Back'}</span>
        </button>

        <div className="mb-8">
          <div className="flex justify-between max-w-md mx-auto">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className={`w-full h-1 mx-1 rounded-full ${
                  i < step ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-200'
                } transition-all duration-300`}
              />
            ))}
          </div>
          <p className="text-center text-gray-500 mt-3 text-sm">Step {step} of 6</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          {renderStep()}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleNext}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
          >
            {step === 5 ? 'Generate My Plan' : 'Continue'}
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
