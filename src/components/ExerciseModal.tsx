import { useEffect } from 'react';
import { X, Dumbbell, Target, Zap, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { DrylandExercise } from '../types';

const exerciseInstructions: Record<string, string[]> = {
  'Pull-ups': [
    'Grip the bar slightly wider than shoulder-width, palms facing away.',
    'Hang with arms fully extended, core engaged.',
    'Pull your chest toward the bar by driving elbows down and back.',
    'Pause at the top with chin above the bar.',
    'Lower yourself slowly back to the starting position.',
  ],
  'Push-ups': [
    'Start in a high plank with hands shoulder-width apart.',
    'Keep your body in a straight line from head to heels.',
    'Lower your chest toward the floor, elbows at 45°.',
    'Push back up to the starting position explosively.',
    'Keep core tight throughout the movement.',
  ],
  'Squats': [
    'Stand with feet shoulder-width apart, toes slightly out.',
    'Brace your core and chest up.',
    'Push hips back and bend knees as if sitting into a chair.',
    'Lower until thighs are parallel to the floor.',
    'Drive through heels to return to standing.',
  ],
  'Plank': [
    'Start in a forearm plank, elbows directly under shoulders.',
    'Keep your body in a straight line from head to heels.',
    'Engage your core and glutes throughout.',
    'Avoid letting hips sag or rise.',
    'Breathe steadily and hold the position for the target time.',
  ],
  'Hip Flexor Stretch': [
    'Kneel on one knee with the other foot forward.',
    'Keep your torso upright and core engaged.',
    'Gently shift your hips forward until you feel a stretch.',
    'Hold for the prescribed time, breathing deeply.',
    'Switch legs and repeat.',
  ],
  'Shoulder Rotations': [
    'Stand tall with arms relaxed at your sides.',
    'Slowly roll both shoulders forward in large circles.',
    'Perform the prescribed number of rotations.',
    'Reverse direction and repeat.',
    'Keep movements smooth and controlled.',
  ],
  'Lat Pull-downs': [
    'Sit at a lat pulldown machine, knees secured under pads.',
    'Grip the bar slightly wider than shoulder-width.',
    'Lean back slightly and pull the bar to your upper chest.',
    'Squeeze your lats at the bottom of the movement.',
    'Slowly return the bar to the starting position.',
  ],
  'Russian Twists': [
    'Sit on the floor with knees bent, feet slightly elevated.',
    'Lean back at a 45° angle, core engaged.',
    'Hold hands together in front of your chest.',
    'Rotate your torso to touch the floor on each side.',
    'Keep movements controlled and breathing steady.',
  ],
  'Band Pull-Aparts': [
    'Hold a resistance band at shoulder width, arms straight in front.',
    'Keep arms parallel to the floor.',
    'Pull the band apart by squeezing your shoulder blades.',
    'Bring the band to your chest level.',
    'Slowly return to the starting position.',
  ],
  'Dead Bugs': [
    'Lie on your back with arms pointing straight up.',
    'Raise legs to a 90° angle at hips and knees.',
    'Slowly lower your right arm and left leg toward the floor.',
    'Return to the starting position, then switch sides.',
    'Keep your lower back pressed into the floor throughout.',
  ],
};

const exerciseTips: Record<string, string[]> = {
  'Pull-ups': [
    'Avoid kipping — controlled reps build more strength.',
    'Use a band for assistance if needed.',
    'Focus on full range of motion.',
  ],
  'Push-ups': [
    'Keep elbows close to avoid shoulder strain.',
    'Elevate feet for more chest activation.',
    'Slow the eccentric (lowering) phase for more strength gains.',
  ],
  'Squats': [
    'Keep knees tracking over your toes.',
    'Depth matters — aim for parallel or below.',
    'Add weight gradually as form improves.',
  ],
  'Plank': [
    'Quality over quantity — stop before form breaks.',
    'Try variations like side planks to build obliques.',
    'Breathe — don\'t hold your breath.',
  ],
  'Hip Flexor Stretch': [
    'Great before and after swimming to release tight hip flexors.',
    'Don\'t force the stretch — ease into it.',
    'Hold for at least 30 seconds per side for best results.',
  ],
  'Shoulder Rotations': [
    'Perform before every swim session as part of warm-up.',
    'Keep circles large and smooth.',
    'Add light resistance as mobility improves.',
  ],
};

const defaultInstructions = [
  'Set up in the starting position with proper posture.',
  'Engage your core throughout the entire movement.',
  'Perform the movement through full range of motion.',
  'Control both the concentric and eccentric phases.',
  'Rest for the prescribed time between sets.',
];

const defaultTips = [
  'Focus on quality over quantity.',
  'Stop if you feel sharp pain.',
  'Breathe consistently throughout the exercise.',
];

interface ExerciseModalProps {
  exercise: DrylandExercise | null;
  onClose: () => void;
}

export function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!exercise) return null;

  const instructions = exerciseInstructions[exercise.name] || defaultInstructions;
  const tips = exerciseTips[exercise.name] || defaultTips;

  const difficultyColor =
    exercise.difficulty === 'easy'
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : exercise.difficulty === 'medium'
      ? 'bg-amber-100 text-amber-700 border-amber-200'
      : 'bg-red-100 text-red-700 border-red-200';

  const typeColor =
    exercise.type === 'strength'
      ? 'from-rose-500 to-pink-500'
      : exercise.type === 'mobility'
      ? 'from-purple-500 to-violet-500'
      : 'from-amber-500 to-orange-500';

  const typeIcon =
    exercise.type === 'strength' ? Dumbbell : exercise.type === 'mobility' ? Zap : Target;

  const TypeIcon = typeIcon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${typeColor} p-6 rounded-t-3xl text-white relative overflow-hidden`}>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-3 relative">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <TypeIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-white/70 uppercase tracking-wide capitalize">
                {exercise.type}
              </div>
              <h2 className="text-xl font-bold">{exercise.name}</h2>
            </div>
          </div>
          <p className="text-sm text-white/90 relative">{exercise.description}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          <div className="p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Sets & Reps</div>
            <div className="font-bold text-gray-900">
              {exercise.sets} × {exercise.reps}
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Difficulty</div>
            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${difficultyColor}`}>
              {exercise.difficulty}
            </span>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Muscle Groups</div>
            <div className="text-xs font-semibold text-gray-700 truncate">
              {exercise.muscleGroups?.slice(0, 2).join(', ') || exercise.type}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* How to perform */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-blue-600" />
              </div>
              How to Perform
            </h3>
            <ol className="space-y-2">
              {instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Muscle groups */}
          {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                  <Dumbbell className="w-3.5 h-3.5 text-rose-600" />
                </div>
                Muscle Groups
              </h3>
              <div className="flex flex-wrap gap-2">
                {exercise.muscleGroups.map((m) => (
                  <span
                    key={m}
                    className="px-3 py-1 bg-rose-50 text-rose-700 text-sm rounded-full border border-rose-100 capitalize"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              </div>
              Tips
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
