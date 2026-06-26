import {
  Questionnaire,
  TrainingPlan,
  Sport,
  PerformanceAnalysis,
  WeeklyGoals,
  DailyTask,
  WeeklyTarget,
  Milestone,
  DrylandExercise,
} from '../types';

interface GenerationConfig {
  sport: Sport;
  improvement: string;
  questionnaire: Questionnaire;
}

const swimmingPlans: Record<string, Partial<TrainingPlan>> = {
  speed: {
    waterTraining: {
      warmup: [
        { name: 'Easy freestyle', distance: '200m', repetitions: 1, rest: '30s', technique: 'Focus on relaxed, smooth strokes, keep head neutral', difficulty: 'easy' },
        { name: 'Kick with board', distance: '100m', repetitions: 1, rest: '30s', technique: 'Keep legs straight, kick from hips, small fast kicks', difficulty: 'easy' },
        { name: 'Build swim', distance: '50m', repetitions: 4, rest: '15s', technique: 'Start easy, build to race pace by the end', difficulty: 'medium' },
      ],
      mainSet: [
        { name: 'Sprint intervals', distance: '25m', repetitions: 8, rest: '45s', technique: 'Maximum effort, powerful strokes, explosive breakouts', difficulty: 'hard' },
        { name: 'Build swims', distance: '50m', repetitions: 6, rest: '30s', technique: 'Start moderate, build to sprint by end, focus on stroke rate', difficulty: 'medium' },
        { name: 'Pace 100s', distance: '100m', repetitions: 4, rest: '60s', technique: 'Hold target race pace, maintain technique under fatigue', difficulty: 'hard' },
      ],
      drillSet: [
        { name: 'Stroke count drill', distance: '25m', repetitions: 4, rest: '20s', technique: 'Count strokes per length, try to reduce while maintaining speed', difficulty: 'medium' },
        { name: 'Power pulls', distance: '25m', repetitions: 4, rest: '25s', technique: 'Use paddles, focus on powerful catch and push phase', difficulty: 'medium' },
      ],
      cooldown: [
        { name: 'Easy swim', distance: '200m', repetitions: 1, rest: '0s', technique: 'Focus on technique, stretch out strokes, relax', difficulty: 'easy' },
      ],
    },
  },
  technique: {
    waterTraining: {
      warmup: [
        { name: 'Balance drill', distance: '100m', repetitions: 1, rest: '20s', technique: 'Keep head neutral, press chest down, find your balance point', difficulty: 'easy' },
        { name: 'One-arm drill', distance: '25m', repetitions: 4, rest: '15s', technique: 'One arm extended, focus on high elbow catch and rotation', difficulty: 'easy' },
      ],
      mainSet: [
        { name: 'Catch-up drill', distance: '50m', repetitions: 6, rest: '20s', technique: 'Wait for full stroke completion before next arm, maintain body rotation', difficulty: 'medium' },
        { name: 'Fist drill', distance: '25m', repetitions: 4, rest: '15s', technique: 'Swim with fists closed to feel forearm catch, engage lats', difficulty: 'medium' },
        { name: 'Finger trail', distance: '50m', repetitions: 4, rest: '20s', technique: 'Trail fingertips along surface during recovery, high elbow', difficulty: 'medium' },
      ],
      drillSet: [
        { name: 'Scull drill', distance: '25m', repetitions: 4, rest: '20s', technique: 'Feel the water pressure, practice catch at different depths', difficulty: 'easy' },
        { name: 'Rotation drill', distance: '25m', repetitions: 4, rest: '15s', technique: 'Exaggerate hip rotation, connect core to pull', difficulty: 'medium' },
      ],
      cooldown: [
        { name: 'Full stroke focus', distance: '200m', repetitions: 1, rest: '0s', technique: 'Apply all cues from session, swim with intention', difficulty: 'easy' },
      ],
    },
  },
  endurance: {
    waterTraining: {
      warmup: [
        { name: 'Easy swim', distance: '400m', repetitions: 1, rest: '30s', technique: 'Establish comfortable rhythm, focus on breathing pattern', difficulty: 'easy' },
        { name: 'Progressive swim', distance: '200m', repetitions: 1, rest: '30s', technique: 'Gradually increase effort each 50m', difficulty: 'easy' },
      ],
      mainSet: [
        { name: 'Aerobic set', distance: '200m', repetitions: 8, rest: '20s', technique: 'Maintain consistent pace, focus on efficiency', difficulty: 'medium' },
        { name: 'Pull set', distance: '300m', repetitions: 4, rest: '30s', technique: 'Use pull buoy, focus on strong pull pattern', difficulty: 'medium' },
        { name: 'Negative split 400s', distance: '400m', repetitions: 3, rest: '60s', technique: 'Second 200m faster than first, build effort', difficulty: 'hard' },
      ],
      drillSet: [
        { name: 'Tempo trainer', distance: '100m', repetitions: 4, rest: '25s', technique: 'Use tempo trainer at race pace, maintain rhythm', difficulty: 'medium' },
        { name: 'Technique swim', distance: '100m', repetitions: 2, rest: '20s', technique: 'Perfect form, 70% effort', difficulty: 'easy' },
      ],
      cooldown: [
        { name: 'Easy swim choice', distance: '200m', repetitions: 1, rest: '0s', technique: 'Any stroke, focus on relaxation', difficulty: 'easy' },
      ],
    },
  },
  starts: {
    waterTraining: {
      warmup: [
        { name: 'Easy swim', distance: '200m', repetitions: 1, rest: '30s', technique: 'Loosen up shoulders and legs, prepare for explosive work', difficulty: 'easy' },
        { name: 'Streamline kicks', distance: '15m', repetitions: 4, rest: '15s', technique: 'Tight streamline off wall, dolphin kicks underwater', difficulty: 'easy' },
      ],
      mainSet: [
        { name: 'Dive progressions', distance: '15m', repetitions: 8, rest: '45s', technique: 'Start crouched, progress to standing, focus on entry angle', difficulty: 'medium' },
        { name: 'Reaction starts', distance: '25m', repetitions: 6, rest: '60s', technique: 'React to visual cue, explosive entry, breakout ready', difficulty: 'hard' },
        { name: 'Start + breakout', distance: '25m', repetitions: 6, rest: '60s', technique: 'Focus on clean breakout strokes, no dolphin kicks too early', difficulty: 'hard' },
      ],
      drillSet: [
        { name: 'Platform starts', distance: '12.5m', repetitions: 4, rest: '30s', technique: 'Focus on explosive drive, arms back, hips forward', difficulty: 'medium' },
        { name: 'Backstroke starts', distance: '15m', repetitions: 4, rest: '30s', technique: 'Powerful arch off wall, streamline entry', difficulty: 'medium' },
      ],
      cooldown: [
        { name: 'Easy swim', distance: '200m', repetitions: 1, rest: '0s', technique: 'Focus on technique after high-intensity work', difficulty: 'easy' },
      ],
    },
  },
  turns: {
    waterTraining: {
      warmup: [
        { name: 'Easy swim', distance: '200m', repetitions: 1, rest: '30s', technique: 'Focus on identifying turn markings, visualize turns', difficulty: 'easy' },
        { name: 'Streamline practice', distance: '10m', repetitions: 6, rest: '15s', technique: 'Tight streamline, strong dolphin kicks off wall', difficulty: 'easy' },
      ],
      mainSet: [
        { name: 'Approach drills', distance: '15m', repetitions: 8, rest: '30s', technique: 'No actual turn, just approach and glide, perfect positioning', difficulty: 'medium' },
        { name: 'Flip turns', distance: '25m', repetitions: 10, rest: '30s', technique: 'Focus on compact tuck, foot placement, drive off wall', difficulty: 'medium' },
        { name: 'Turn race pace', distance: '50m', repetitions: 6, rest: '45s', technique: 'Full speed turn with perfect streamline exit', difficulty: 'hard' },
      ],
      drillSet: [
        { name: 'Flip turn breakdown', distance: '10m', repetitions: 6, rest: '20s', technique: 'Practice somersault at wall, no push-off', difficulty: 'easy' },
        { name: 'Open turns', distance: '25m', repetitions: 4, rest: '25s', technique: 'Touch, pivot, drive sequence for breaststroke/butterfly', difficulty: 'medium' },
      ],
      cooldown: [
        { name: 'Practice turns', distance: '100m', repetitions: 2, rest: '0s', technique: 'Focus on one element each length', difficulty: 'easy' },
      ],
    },
  },
  breathing: {
    waterTraining: {
      warmup: [
        { name: 'Bilateral breathing', distance: '200m', repetitions: 1, rest: '30s', technique: 'Alternate breathing sides every 3 strokes', difficulty: 'easy' },
        { name: 'Hypoxic swim', distance: '50m', repetitions: 4, rest: '30s', technique: '3-5-7 stroke breathing pattern, stay calm', difficulty: 'medium' },
      ],
      mainSet: [
        { name: 'Breath control drills', distance: '25m', repetitions: 8, rest: '30s', technique: 'Reduce breaths per length gradually, 5-3-1-0', difficulty: 'hard' },
        { name: 'Timing practice', distance: '50m', repetitions: 6, rest: '20s', technique: 'Focus on early breath timing, quick return', difficulty: 'medium' },
        { name: 'Hypoxic pyramid', distance: '100m', repetitions: 4, rest: '45s', technique: 'Progress from every 3 to every 7 strokes per 25m', difficulty: 'hard' },
      ],
      drillSet: [
        { name: 'No breath 15s', distance: '15m', repetitions: 8, rest: '20s', technique: 'Swim 15m without breath, focus on relaxation', difficulty: 'medium' },
        { name: 'Triple breath drill', distance: '25m', repetitions: 4, rest: '25s', technique: 'Take three quick breaths at wall, continue', difficulty: 'medium' },
      ],
      cooldown: [
        { name: 'Easy bilateral', distance: '200m', repetitions: 1, rest: '0s', technique: 'Comfortable bilateral breathing, enjoy the water', difficulty: 'easy' },
      ],
    },
  },
  kick: {
    waterTraining: {
      warmup: [
        { name: 'Easy kick', distance: '200m', repetitions: 1, rest: '30s', technique: 'Kick from hips, not knees, slight knee bend', difficulty: 'easy' },
        { name: 'Vertical kicking', distance: '30s', repetitions: 4, rest: '15s', technique: 'Upright position, maintain rhythm, hands above water', difficulty: 'medium' },
      ],
      mainSet: [
        { name: 'Speed kicks', distance: '25m', repetitions: 8, rest: '25s', technique: 'Fast, small kicks with board, high turnover', difficulty: 'medium' },
        { name: 'Kick endurance', distance: '100m', repetitions: 6, rest: '30s', technique: 'Consistent pace throughout, strong rhythm', difficulty: 'hard' },
        { name: 'Underwater kicks', distance: '15m', repetitions: 8, rest: '30s', technique: 'Dolphin kicks off wall, maintain streamline', difficulty: 'hard' },
      ],
      drillSet: [
        { name: 'Side kicks', distance: '25m', repetitions: 4, rest: '20s', technique: 'Kick on side, bottom arm extended, rotate positions', difficulty: 'medium' },
        { name: 'Kick variations', distance: '25m', repetitions: 4, rest: '25s', technique: 'Switch between flutter, dolphin, breaststroke kick', difficulty: 'medium' },
      ],
      cooldown: [
        { name: 'Easy kick choice', distance: '200m', repetitions: 1, rest: '0s', technique: 'Focus on relaxation, nice smooth kick', difficulty: 'easy' },
      ],
    },
  },
  pull: {
    waterTraining: {
      warmup: [
        { name: 'Easy swim', distance: '200m', repetitions: 1, rest: '30s', technique: 'Focus on catch and pull pattern, feel the water', difficulty: 'easy' },
        { name: 'Single arm drill', distance: '25m', repetitions: 4, rest: '15s', technique: 'High elbow, powerful finish, full extension', difficulty: 'easy' },
      ],
      mainSet: [
        { name: 'Pull with buoy', distance: '100m', repetitions: 6, rest: '25s', technique: 'Focus on catch, pull, and push phases equally', difficulty: 'medium' },
        { name: 'Paddle swim', distance: '50m', repetitions: 8, rest: '25s', technique: 'Feel the water on forearm, maintain high elbow', difficulty: 'medium' },
        { name: 'Power pull', distance: '25m', repetitions: 8, rest: '35s', technique: 'Maximum power per stroke, count strokes', difficulty: 'hard' },
      ],
      drillSet: [
        { name: 'Ankle band', distance: '25m', repetitions: 4, rest: '25s', technique: 'Band around ankles, forces pull efficiency', difficulty: 'hard' },
        { name: 'Swim golf', distance: '50m', repetitions: 4, rest: '30s', technique: 'Count strokes + time, try to lower score', difficulty: 'medium' },
      ],
      cooldown: [
        { name: 'Easy full stroke', distance: '200m', repetitions: 1, rest: '0s', technique: 'Integrate pull improvements, smooth strokes', difficulty: 'easy' },
      ],
    },
  },
};

const defaultDrylandExercises = {
  strength: [
    { name: 'Push-ups', type: 'strength' as const, sets: 3, reps: '10-15', description: 'Full range of motion, core engaged throughout', difficulty: 'medium' as const, muscleGroups: ['chest', 'shoulders', 'triceps'] },
    { name: 'Squats', type: 'strength' as const, sets: 3, reps: '15-20', description: 'Weight through heels, knees track over toes', difficulty: 'medium' as const, muscleGroups: ['quadriceps', 'glutes', 'core'] },
    { name: 'Pull-ups/Assisted', type: 'strength' as const, sets: 3, reps: '5-10', description: 'Full extension at bottom, chin over bar', difficulty: 'hard' as const, muscleGroups: ['back', 'biceps', 'shoulders'] },
    { name: 'Deadlifts', type: 'strength' as const, sets: 3, reps: '8-12', description: 'Flat back, hinge at hips, drive through heels', difficulty: 'hard' as const, muscleGroups: ['hamstrings', 'glutes', 'back'] },
    { name: 'Lunges', type: 'strength' as const, sets: 3, reps: '10 each leg', description: 'Front knee at 90 degrees, upright torso', difficulty: 'medium' as const, muscleGroups: ['quadriceps', 'glutes', 'balance'] },
  ],
  mobility: [
    { name: 'Shoulder circles', type: 'mobility' as const, sets: 2, reps: '10 each direction', description: 'Slow controlled circles, full range', difficulty: 'easy' as const },
    { name: 'Thoracic rotation', type: 'mobility' as const, sets: 2, reps: '10 each side', description: 'Open chest, rotate from spine, breathe', difficulty: 'easy' as const },
    { name: 'Hip flexor stretch', type: 'mobility' as const, sets: 2, reps: '30s each side', description: 'Deep lunge, press hip forward gently', difficulty: 'easy' as const },
    { name: 'Ankle mobility', type: 'mobility' as const, sets: 2, reps: '15 each direction', description: 'Full ankle circles, explore range', difficulty: 'easy' as const },
    { name: 'Cat-cow stretch', type: 'mobility' as const, sets: 2, reps: '10 cycles', description: 'Flow between positions, segment-by-segment', difficulty: 'easy' as const },
  ],
  core: [
    { name: 'Dead bug', type: 'core' as const, sets: 3, reps: '10 each side', description: 'Keep back flat on ground, slow movements', difficulty: 'medium' as const },
    { name: 'Bird dog', type: 'core' as const, sets: 3, reps: '10 each side', description: 'Opposite arm and leg, stable hips', difficulty: 'medium' as const },
    { name: 'Side plank', type: 'core' as const, sets: 3, reps: '30s each side', description: 'Stack hips, lift waist, breathe normally', difficulty: 'medium' as const },
    { name: 'Bicycle crunches', type: 'core' as const, sets: 3, reps: '20 total', description: 'Slow and controlled, elbow to opposite knee', difficulty: 'medium' as const },
    { name: 'Plank hold', type: 'core' as const, sets: 3, reps: '45-60s', description: 'Body straight, engage glutes, breathe', difficulty: 'medium' as const },
  ],
};

const defaultNutrition = {
  preTraining: [
    { name: 'Oatmeal with banana', timing: '2-3 hours before', description: 'Complex carbs for sustained energy', nutrients: ['Carbohydrates', 'Potassium', 'Fiber'], calories: 380, protein: 12, carbs: 65, fat: 8 },
    { name: 'Toast with honey', timing: '1 hour before', description: 'Quick energy boost', nutrients: ['Simple carbs', 'Natural sugar'], calories: 200, protein: 4, carbs: 40, fat: 3 },
    { name: 'Energy bar', timing: '30 min before', description: 'Light, easily digestible fuel', nutrients: ['Carbs', 'Protein'], calories: 250, protein: 10, carbs: 35, fat: 8 },
  ],
  postTraining: [
    { name: 'Chocolate milk', timing: 'Within 30 min', description: 'Optimal carb-to-protein ratio for recovery', nutrients: ['Protein', 'Carbs', 'Calcium'], calories: 320, protein: 16, carbs: 52, fat: 8 },
    { name: 'Grilled chicken with rice', timing: '1-2 hours after', description: 'Complete recovery meal', nutrients: ['Protein', 'Complex carbs', 'B vitamins'], calories: 450, protein: 40, carbs: 45, fat: 12 },
    { name: 'Greek yogurt with berries', timing: 'Snack option', description: 'High protein, antioxidants for repair', nutrients: ['Protein', 'Antioxidants', 'Probiotics'], calories: 220, protein: 20, carbs: 25, fat: 4 },
  ],
  hydration: 'Drink 16-20 oz water 2 hours before training, 8 oz every 20 min during, and 16-24 oz per pound lost after training',
  proteinRecommendation: 'Consume 1.6-2.2g of protein per kg of body weight daily, distributed across 4-5 meals for optimal muscle repair',
  recoveryTips: [
    'Prioritize sleep: aim for 7-9 hours per night for optimal recovery',
    'Include protein in every meal to support continuous muscle repair',
    'Use foam rolling or light stretching on rest days to improve mobility',
    'Stay hydrated throughout the day, not just during training'
  ],
};

function generatePerformanceAnalysis(config: GenerationConfig): PerformanceAnalysis {
  const { questionnaire, sport: _sport, improvement } = config;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const priorityAreas: string[] = [];

  if (questionnaire.skillLevel === 'beginner') {
    strengths.push('Fresh perspective with no bad habits to unlearn');
    strengths.push('Enthusiastic and motivated to learn');
    weaknesses.push('Limited muscle memory for sport-specific movements');
    weaknesses.push('Underdeveloped endurance base');
    priorityAreas.push('Build foundational technique', 'Develop sport-specific fitness', 'Establish consistent training habits');
  } else if (questionnaire.skillLevel === 'intermediate') {
    strengths.push('Established training routine');
    strengths.push('Good understanding of fundamentals');
    weaknesses.push('Inconsistent technique under fatigue');
    weaknesses.push('Room for optimization in efficiency');
    priorityAreas.push('Refine technique details', 'Build race-specific endurance', 'Improve pacing strategies');
  } else {
    strengths.push('Strong technical foundation');
    strengths.push('Well-developed fitness base');
    weaknesses.push('Small improvements require more focused work');
    weaknesses.push('Plateau risk without varied stimuli');
    priorityAreas.push('Fine-tune specific weaknesses', 'Add advanced training methods', 'Optimize recovery between sessions');
  }

  if (questionnaire.sessionsPerWeek >= 4) {
    strengths.push('High training frequency allows faster adaptation');
  } else if (questionnaire.sessionsPerWeek <= 2) {
    priorityAreas.push('Consider increasing training frequency if possible');
  }

  const improvementPotential = questionnaire.skillLevel === 'beginner' ? 85 : questionnaire.skillLevel === 'intermediate' ? 65 : 40;

  let timeline = '12-16 weeks for noticeable improvement';
  if (improvement === 'speed') timeline = '6-8 weeks for initial gains, 16-20 for significant improvement';
  if (improvement === 'technique') timeline = '4-8 weeks for habit formation, 12+ for automatic movement';
  if (improvement === 'endurance') timeline = '8-12 weeks for aerobic base development';

  return {
    strengths,
    weaknesses,
    priorityAreas,
    estimatedTimeline: timeline,
    improvementPotential,
  };
}

function generateWeeklyGoals(config: GenerationConfig): WeeklyGoals {
  const { questionnaire, improvement } = config;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const trainingDays = questionnaire.sessionsPerWeek;
  const dailyTasks: DailyTask[] = [];

  const restDays = Math.floor(7 / (trainingDays + 1));
  const restIndices = new Set<number>();
  let idx = 0;
  while (restIndices.size < restDays && idx < 7) {
    if (idx > 0 && !restIndices.has(idx - 1)) {
      restIndices.add(idx);
    }
    idx += Math.floor(7 / restDays);
  }

  days.forEach((day, i) => {
    const isRestDay = restIndices.has(i);
    let tasks: string[] = [];
    let type: 'rest' | 'light' | 'moderate' | 'intense' = 'moderate';

    if (isRestDay) {
      type = 'rest';
      tasks = ['Active recovery: light walk or stretch', 'Focus on hydration and nutrition', 'Review training notes', 'Get 8+ hours of sleep'];
    } else {
      const intensity = i % 2 === 0 ? 'intense' : 'moderate';
      type = intensity;
      tasks = [
        `${intensity === 'intense' ? 'High-intensity' : 'Moderate'} ${improvement} training session`,
        'Complete 10 min warm-up routine',
        'Focus on one technique cue from plan',
        'Track metrics in progress log',
      ];
    }

    dailyTasks.push({ day, tasks, type });
  });

  const weeklyTargets: WeeklyTarget[] = [
    { metric: 'Training Sessions', target: trainingDays, unit: 'sessions' },
    { metric: 'Total Training Time', target: questionnaire.sessionsPerWeek * questionnaire.trainingDuration, unit: 'minutes' },
    { metric: 'Water Intake', target: 56, unit: 'oz' },
    { metric: 'Sleep Quality', target: 7, unit: 'hours/night' },
  ];

  const milestones: Milestone[] = [
    { week: 1, description: 'Complete all planned training sessions', completed: false },
    { week: 2, description: 'Master basic technique cues', completed: false },
    { week: 3, description: 'Increase intensity while maintaining form', completed: false },
    { week: 4, description: 'Show measurable improvement in key metric', completed: false },
  ];

  return { dailyTasks, weeklyTargets, milestones };
}

function adjustPlanBySkillLevel(base: Partial<TrainingPlan>, level: string): Partial<TrainingPlan> {
  const multiplier = level === 'beginner' ? 0.7 : level === 'advanced' ? 1.3 : 1;

  if (base.waterTraining?.mainSet) {
    base.waterTraining.mainSet = base.waterTraining.mainSet.map((drill) => ({
      ...drill,
      repetitions: Math.round(drill.repetitions * multiplier),
      rest: level === 'beginner' ? incrementRest(drill.rest) : level === 'advanced' ? decrementRest(drill.rest) : drill.rest,
    }));
  }

  if (base.waterTraining?.drillSet) {
    base.waterTraining.drillSet = base.waterTraining.drillSet.map((drill) => ({
      ...drill,
      repetitions: Math.max(2, Math.round(drill.repetitions * multiplier)),
    }));
  }

  return base;
}

function incrementRest(rest: string): string {
  const base = parseInt(rest) || 30;
  return `${base + 15}s`;
}

function decrementRest(rest: string): string {
  const base = parseInt(rest) || 30;
  return `${Math.max(10, base - 10)}s`;
}

function adjustByDuration(base: Partial<TrainingPlan>, duration: number): Partial<TrainingPlan> {
  const ratio = duration / 60;

  if (base.waterTraining?.mainSet) {
    base.waterTraining.mainSet = base.waterTraining.mainSet.map((drill) => ({
      ...drill,
      repetitions: Math.max(1, Math.round(drill.repetitions * ratio)),
    }));
  }

  return base;
}

const gymPlans: Record<string, Partial<TrainingPlan>> = {
  build_muscle: {
    waterTraining: {
      warmup: [
        { name: 'Treadmill / bike warm-up', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Low intensity to raise heart rate and body temperature', difficulty: 'easy' },
        { name: 'Dynamic joint circles', distance: '3 min', repetitions: 1, rest: '0s', technique: 'Shoulder, hip and ankle circles — full range of motion', difficulty: 'easy' },
        { name: 'Empty-bar activation', distance: '2 sets', repetitions: 2, rest: '30s', technique: 'Squat, RDL and press with just the bar to groove patterns', difficulty: 'easy' },
      ],
      mainSet: [
        { name: 'Barbell Bench Press', distance: '8-12 reps', repetitions: 4, rest: '90s', technique: 'Retract scapula, bar to lower chest, press up and slightly back', difficulty: 'hard' },
        { name: 'Barbell Back Squat', distance: '10 reps', repetitions: 4, rest: '2 min', technique: 'Brace core, break at hips and knees together, drive through heels', difficulty: 'hard' },
        { name: 'Barbell Bent-Over Row', distance: '8-12 reps', repetitions: 4, rest: '90s', technique: 'Hinge at hips, pull bar to lower ribcage, squeeze shoulder blades', difficulty: 'hard' },
        { name: 'Dumbbell Overhead Press', distance: '10-12 reps', repetitions: 3, rest: '75s', technique: 'Neutral spine, press overhead, lock out elbows at top', difficulty: 'medium' },
      ],
      drillSet: [
        { name: 'Dumbbell Flyes', distance: '12-15 reps', repetitions: 3, rest: '60s', technique: 'Slight bend in elbows, arc motion, feel the chest stretch at bottom', difficulty: 'medium' },
        { name: 'Lat Pulldown', distance: '12 reps', repetitions: 3, rest: '60s', technique: 'Pull bar to upper chest, elbows drive down, arch slightly back', difficulty: 'medium' },
        { name: 'Dumbbell Bicep Curls', distance: '12-15 reps', repetitions: 3, rest: '45s', technique: 'Supinate at top, slow eccentric, no swinging', difficulty: 'easy' },
        { name: 'Tricep Rope Pushdown', distance: '12-15 reps', repetitions: 3, rest: '45s', technique: 'Keep elbows pinned, extend fully, squeeze at bottom', difficulty: 'easy' },
      ],
      cooldown: [
        { name: 'Full-body static stretch', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Hold each stretch 30 s: chest, lats, quads, hamstrings, hip flexors', difficulty: 'easy' },
      ],
    },
  },
  lose_weight: {
    waterTraining: {
      warmup: [
        { name: 'Jump rope / jog in place', distance: '3 min', repetitions: 1, rest: '0s', technique: 'Moderate pace, get heart rate to 60-65% max', difficulty: 'easy' },
        { name: 'Bodyweight squat + arm swing', distance: '10 reps', repetitions: 2, rest: '20s', technique: 'Full squat depth, swing arms overhead to open chest', difficulty: 'easy' },
      ],
      mainSet: [
        { name: 'Goblet Squat to Press Circuit', distance: '15 reps', repetitions: 4, rest: '45s', technique: 'Squat deep, stand and press overhead, keep core engaged', difficulty: 'medium' },
        { name: 'Dumbbell Thrusters', distance: '12 reps', repetitions: 4, rest: '60s', technique: 'Front squat into overhead press in one fluid movement', difficulty: 'hard' },
        { name: 'Kettlebell / DB Swings', distance: '20 reps', repetitions: 4, rest: '45s', technique: 'Hip hinge drive, not a squat, snap hips at top, float arms', difficulty: 'hard' },
        { name: 'Burpees', distance: '10 reps', repetitions: 3, rest: '60s', technique: 'Chest to floor, explosive jump, land softly', difficulty: 'hard' },
      ],
      drillSet: [
        { name: 'HIIT Cardio Intervals', distance: '30s on / 30s off', repetitions: 8, rest: '0s', technique: 'Max effort on / active rest off — rowing, bike or sprints', difficulty: 'hard' },
        { name: 'Mountain Climbers', distance: '20 reps', repetitions: 3, rest: '30s', technique: 'Flat back, drive knees fast, shoulders over wrists', difficulty: 'medium' },
        { name: 'Jump Lunges', distance: '10 each leg', repetitions: 3, rest: '45s', technique: 'Explode off back foot, land softly with front knee at 90°', difficulty: 'medium' },
      ],
      cooldown: [
        { name: 'Low-intensity walk / bike', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Bring heart rate below 100 bpm before stretching', difficulty: 'easy' },
        { name: 'Full-body stretch', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Hip flexors, quads, hamstrings, shoulders — hold 30 s each', difficulty: 'easy' },
      ],
    },
  },
  strength: {
    waterTraining: {
      warmup: [
        { name: 'Bike warm-up', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Easy effort, loosen hips and ankles for heavy squatting and pulling', difficulty: 'easy' },
        { name: 'Progressive bar warm-up sets', distance: '5 reps', repetitions: 4, rest: '60s', technique: 'Increase weight each set: bar → 40% → 60% → 80% of working weight', difficulty: 'easy' },
      ],
      mainSet: [
        { name: 'Barbell Back Squat', distance: '3-5 reps', repetitions: 5, rest: '3 min', technique: 'High bar or low bar, brace hard, knees track toes, full depth', difficulty: 'hard' },
        { name: 'Conventional Deadlift', distance: '3-5 reps', repetitions: 4, rest: '3 min', technique: 'Bar over mid-foot, flat back, leg press the floor, lockout glutes', difficulty: 'hard' },
        { name: 'Barbell Bench Press', distance: '3-5 reps', repetitions: 5, rest: '3 min', technique: 'Tight arch, bar to lower chest, leg drive, lockout elbows fully', difficulty: 'hard' },
        { name: 'Barbell Overhead Press', distance: '5 reps', repetitions: 4, rest: '2 min', technique: 'Bar from clavicle, push head through at top, full lockout', difficulty: 'hard' },
      ],
      drillSet: [
        { name: 'Paused Box Squat', distance: '3 reps', repetitions: 3, rest: '2 min', technique: '2 s pause on box, maintain tension, explode up', difficulty: 'medium' },
        { name: 'Romanian Deadlift', distance: '8 reps', repetitions: 3, rest: '90s', technique: 'Hip hinge, slight knee bend, feel hamstring stretch, squeeze glutes up', difficulty: 'medium' },
        { name: 'Close-Grip Bench Press', distance: '6-8 reps', repetitions: 3, rest: '90s', technique: 'Hands shoulder-width, elbows tucked, tricep-dominant pressing', difficulty: 'medium' },
      ],
      cooldown: [
        { name: 'Mobility & foam rolling', distance: '12 min', repetitions: 1, rest: '0s', technique: 'Thoracic spine, hip flexors, glutes — key areas for heavy compound lifts', difficulty: 'easy' },
      ],
    },
  },
  fitness: {
    waterTraining: {
      warmup: [
        { name: 'Full-body dynamic warm-up', distance: '7 min', repetitions: 1, rest: '0s', technique: 'Leg swings, arm circles, hip circles, thoracic twists, inchworms', difficulty: 'easy' },
        { name: 'Bodyweight activation circuit', distance: '10 reps each', repetitions: 1, rest: '0s', technique: 'Squat, push-up, glute bridge, row — one round, steady pace', difficulty: 'easy' },
      ],
      mainSet: [
        { name: 'Full-Body Compound Circuit', distance: '12 reps', repetitions: 4, rest: '60s', technique: 'Squat → Row → Push Press → Hinge — minimal rest between moves', difficulty: 'medium' },
        { name: 'Dumbbell Lunges + Curl', distance: '10 each leg', repetitions: 3, rest: '75s', technique: 'Reverse lunge, curl at bottom, step back up — compound movement', difficulty: 'medium' },
        { name: 'Cable or Band Row', distance: '12-15 reps', repetitions: 3, rest: '60s', technique: 'Seated or standing, full retraction, controlled release', difficulty: 'medium' },
        { name: 'Dumbbell Bench or Floor Press', distance: '12 reps', repetitions: 3, rest: '60s', technique: 'Full range, control the descent, press through chest', difficulty: 'medium' },
      ],
      drillSet: [
        { name: 'Step-ups + Balance hold', distance: '10 each leg', repetitions: 3, rest: '45s', technique: 'Drive knee up at top, 1 s balance hold, controlled step down', difficulty: 'medium' },
        { name: 'Plank to Push-up', distance: '8 reps', repetitions: 3, rest: '45s', technique: 'From forearm plank, press up one hand at a time, stay level hips', difficulty: 'medium' },
        { name: 'Farmer Carry', distance: '30m', repetitions: 3, rest: '60s', technique: 'Heavy dumbbells, tall spine, big steps, core rigid', difficulty: 'medium' },
      ],
      cooldown: [
        { name: 'Full-body stretch + breathing', distance: '10 min', repetitions: 1, rest: '0s', technique: 'All major muscle groups, slow diaphragmatic breaths, relax fully', difficulty: 'easy' },
      ],
    },
  },
};

const gymDrylandExercises: Record<string, { strength: DrylandExercise[]; mobility: DrylandExercise[]; core: DrylandExercise[] }> = {
  build_muscle: {
    strength: [
      { name: 'Leg Press', type: 'strength', sets: 3, reps: '12-15', description: 'Foot plate at shoulder width, full range, drive through heels', difficulty: 'medium', muscleGroups: ['quadriceps', 'glutes'] },
      { name: 'Incline Dumbbell Press', type: 'strength', sets: 3, reps: '10-12', description: '30° incline, arc motion, feel upper chest stretch', difficulty: 'medium', muscleGroups: ['upper chest', 'shoulders'] },
      { name: 'Cable Face Pulls', type: 'strength', sets: 3, reps: '15', description: 'Pull to forehead, elbows high, external rotation at end', difficulty: 'easy', muscleGroups: ['rear delts', 'traps'] },
    ],
    mobility: [
      { name: 'Lat stretch on rack', type: 'mobility', sets: 2, reps: '30s each side', description: 'Grab rack, sit back, let lat stretch fully', difficulty: 'easy' },
      { name: 'Chest doorway stretch', type: 'mobility', sets: 2, reps: '30s', description: 'Arms at 90°, step forward, open chest', difficulty: 'easy' },
      { name: 'Hip flexor lunge stretch', type: 'mobility', sets: 2, reps: '45s each', description: 'Deep lunge, press hip forward, reach overhead', difficulty: 'easy' },
    ],
    core: [
      { name: 'Cable Crunch', type: 'core', sets: 3, reps: '15-20', description: 'Pull elbow to knees, round spine, feel abs contract', difficulty: 'medium' },
      { name: 'Hanging Knee Raises', type: 'core', sets: 3, reps: '12-15', description: 'Hang from bar, curl knees to chest, control the descent', difficulty: 'medium' },
      { name: 'Plank Hold', type: 'core', sets: 3, reps: '45-60s', description: 'Body straight, engage glutes, breathe normally', difficulty: 'medium' },
    ],
  },
  lose_weight: {
    strength: [
      { name: 'Bodyweight Squat Jumps', type: 'strength', sets: 3, reps: '15', description: 'Squat then explode up, land softly, absorb with legs', difficulty: 'hard', muscleGroups: ['quadriceps', 'glutes', 'calves'] },
      { name: 'Push-up Variations', type: 'strength', sets: 3, reps: '12-15', description: 'Standard, wide, or narrow — full range each rep', difficulty: 'medium', muscleGroups: ['chest', 'triceps', 'core'] },
      { name: 'Inverted Row', type: 'strength', sets: 3, reps: '12', description: 'Horizontal pull, body rigid, pull chest to bar', difficulty: 'medium', muscleGroups: ['back', 'biceps'] },
    ],
    mobility: [
      { name: 'World\'s Greatest Stretch', type: 'mobility', sets: 2, reps: '5 each side', description: 'Lunge + rotation + overhead reach — opens hips and thoracic', difficulty: 'easy' },
      { name: 'Hip circle + hip flexor', type: 'mobility', sets: 2, reps: '30s each', description: 'Standing hip circles then deep lunge hold each side', difficulty: 'easy' },
      { name: 'Seated hamstring stretch', type: 'mobility', sets: 2, reps: '30s each', description: 'Reach forward, flat back, feel hamstrings lengthen', difficulty: 'easy' },
    ],
    core: [
      { name: 'Mountain Climbers', type: 'core', sets: 3, reps: '30s', description: 'Shoulders over wrists, drive knees fast alternating', difficulty: 'hard' },
      { name: 'V-ups', type: 'core', sets: 3, reps: '12-15', description: 'Lift legs and torso simultaneously, reach hands to feet', difficulty: 'medium' },
      { name: 'Side Plank', type: 'core', sets: 3, reps: '30s each side', description: 'Stack feet, raise hips, keep body in line', difficulty: 'medium' },
    ],
  },
  strength: {
    strength: [
      { name: 'Deficit Deadlift', type: 'strength', sets: 3, reps: '3-4', description: 'Stand on 2-3 cm plate, increases range to build power off floor', difficulty: 'hard', muscleGroups: ['hamstrings', 'glutes', 'back'] },
      { name: 'Front Squat', type: 'strength', sets: 3, reps: '4-5', description: 'Rack position, upright torso, quad dominant, builds squat strength', difficulty: 'hard', muscleGroups: ['quadriceps', 'core'] },
      { name: 'Push Press', type: 'strength', sets: 3, reps: '5', description: 'Slight dip, drive through legs, lock out overhead', difficulty: 'hard', muscleGroups: ['shoulders', 'triceps', 'legs'] },
    ],
    mobility: [
      { name: 'Hip 90/90 stretch', type: 'mobility', sets: 2, reps: '60s each side', description: 'Internal and external rotation, key for squat depth', difficulty: 'easy' },
      { name: 'Thoracic extension on foam roller', type: 'mobility', sets: 2, reps: '10 reps', description: 'Roller mid-back, hands behind head, arch over roller', difficulty: 'easy' },
      { name: 'Ankle mobility wall drill', type: 'mobility', sets: 2, reps: '10 each', description: 'Knee over toe to wall, improves squat depth and knee tracking', difficulty: 'easy' },
    ],
    core: [
      { name: 'Ab Wheel Rollouts', type: 'core', sets: 3, reps: '8-10', description: 'Kneel, roll out slowly, maintain flat back, pull back with lats', difficulty: 'hard' },
      { name: 'Weighted Plank', type: 'core', sets: 3, reps: '30-45s', description: 'Plate on back, body rigid, breathe without losing bracing', difficulty: 'medium' },
      { name: 'Pallof Press', type: 'core', sets: 3, reps: '10 each side', description: 'Anti-rotation core press, resist twisting, control throughout', difficulty: 'medium' },
    ],
  },
  fitness: {
    strength: [
      { name: 'Single-Leg Deadlift', type: 'strength', sets: 3, reps: '10 each', description: 'Balance and posterior chain — hinge on one leg, keep back flat', difficulty: 'medium', muscleGroups: ['hamstrings', 'glutes', 'balance'] },
      { name: 'Dumbbell Complex', type: 'strength', sets: 3, reps: '6 each move', description: 'Curl → Press → Row without putting weights down — full body', difficulty: 'medium', muscleGroups: ['full body'] },
      { name: 'Resistance Band Pull-apart', type: 'strength', sets: 3, reps: '20', description: 'Arms extended, pull band apart, squeeze shoulder blades', difficulty: 'easy', muscleGroups: ['rear delts', 'traps', 'posture'] },
    ],
    mobility: [
      { name: 'Cat-cow + Thread the needle', type: 'mobility', sets: 2, reps: '8 each', description: 'Spinal mobility and rotation — flow between positions', difficulty: 'easy' },
      { name: 'Standing hip hinge drill', type: 'mobility', sets: 2, reps: '10', description: 'Dowel on back, hinge only at hips, practise the movement pattern', difficulty: 'easy' },
      { name: 'Overhead side bend', type: 'mobility', sets: 2, reps: '8 each side', description: 'Arms overhead, side bend slowly, feel lateral stretch', difficulty: 'easy' },
    ],
    core: [
      { name: 'Dead Bug', type: 'core', sets: 3, reps: '10 each side', description: 'Lower back pressed to floor, extend opposite arm and leg slowly', difficulty: 'medium' },
      { name: 'Bird Dog', type: 'core', sets: 3, reps: '10 each side', description: 'Extend arm and opposite leg, hold 2 s, stable hips throughout', difficulty: 'medium' },
      { name: 'Bicycle Crunches', type: 'core', sets: 3, reps: '20 total', description: 'Slow and controlled, elbow to opposite knee, full rotation', difficulty: 'medium' },
    ],
  },
};

const genericSportPlan: Partial<TrainingPlan> = {
  waterTraining: {
    warmup: [
      { name: 'Dynamic warm-up', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Jogging, arm circles, high knees, leg swings', difficulty: 'easy' },
      { name: 'Movement preparation', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Sport-specific mobility movements to activate muscles', difficulty: 'easy' },
    ],
    mainSet: [
      { name: 'Skill development block', distance: '20 min', repetitions: 3, rest: '90s', technique: 'Focus on fundamental sport skills at moderate intensity', difficulty: 'medium' },
      { name: 'Conditioning intervals', distance: '30s', repetitions: 8, rest: '30s', technique: 'High effort bursts, maintain good form throughout', difficulty: 'hard' },
    ],
    drillSet: [
      { name: 'Technique practice', distance: '10 min', repetitions: 1, rest: '30s', technique: 'Slow down the movement, focus on perfect form', difficulty: 'easy' },
    ],
    cooldown: [
      { name: 'Static stretching', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Hold each stretch 30-45 s, breathe deeply', difficulty: 'easy' },
    ],
  },
};

const sportSpecificPlans: Record<string, Record<string, Partial<TrainingPlan>>> = {
  football: {
    speed: {
      waterTraining: {
        warmup: [
          { name: 'Jog & dynamic stretches', distance: '400m', repetitions: 1, rest: '0s', technique: 'Gradual pace build, high knees and butt kicks', difficulty: 'easy' },
          { name: 'Acceleration drills', distance: '20m', repetitions: 4, rest: '30s', technique: 'Drive phase focus, arms pumping, forward lean', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Sprint intervals', distance: '30m', repetitions: 8, rest: '60s', technique: 'Max effort, explosive start, full recovery', difficulty: 'hard' },
          { name: 'Cone acceleration', distance: '20m', repetitions: 6, rest: '45s', technique: 'Sprint to cone, decelerate, change direction', difficulty: 'hard' },
          { name: 'Flying sprints', distance: '40m', repetitions: 4, rest: '90s', technique: '10m build-up then sprint, maintain top-end speed', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Ladder footwork', distance: '10m', repetitions: 6, rest: '30s', technique: 'Quick feet through ladder, stay on balls of feet', difficulty: 'medium' },
          { name: '5-10-5 shuttle', distance: '25m', repetitions: 4, rest: '60s', technique: 'Short cuts, low centre of gravity, sharp direction change', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Easy jog & stretch', distance: '200m', repetitions: 1, rest: '0s', technique: 'Drop heart rate, stretch hip flexors and quads', difficulty: 'easy' },
        ],
      },
    },
    shooting: {
      waterTraining: {
        warmup: [
          { name: 'Ball touch warm-up', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Light passing, juggling, short range shots to warm up', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Dribble & shoot', distance: '18m', repetitions: 10, rest: '30s', technique: 'Approach at pace, set up body shape, strike through ball', difficulty: 'medium' },
          { name: 'One-touch finish', distance: '12m', repetitions: 12, rest: '20s', technique: 'Quick set of hips, clean contact, low across goal', difficulty: 'hard' },
          { name: 'Long-range efforts', distance: '25m', repetitions: 6, rest: '45s', technique: 'Strike through centre of ball, follow-through toward target', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Weak-foot shooting', distance: '15m', repetitions: 8, rest: '30s', technique: 'Plant foot beside ball, strike with laces', difficulty: 'medium' },
          { name: 'Chip & volley', distance: '15m', repetitions: 4, rest: '45s', technique: 'Watch ball onto foot, get under it, snap ankle', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Passing & cool-down', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Easy passing pairs, light stretching', difficulty: 'easy' },
        ],
      },
    },
    passing: {
      waterTraining: {
        warmup: [
          { name: 'Short passing rondo', distance: '10 min', repetitions: 1, rest: '0s', technique: '3-4 touch max, weight and angle of pass', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Driven pass over 30m', distance: '30m', repetitions: 10, rest: '20s', technique: 'Locked ankle, strike through ball, land on kicking foot', difficulty: 'medium' },
          { name: 'Switch play drill', distance: '40m', repetitions: 8, rest: '30s', technique: 'Open body, weight of pass, spin on ball for receiver', difficulty: 'hard' },
          { name: 'Through-ball timing', distance: '25m', repetitions: 8, rest: '30s', technique: 'Play ball into space ahead of runner, not at feet', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Wall passing', distance: '10m', repetitions: 20, rest: '0s', technique: 'First touch out of feet, quick return pass', difficulty: 'medium' },
          { name: 'Triangle passing', distance: '15m', repetitions: 12, rest: '15s', technique: 'Move after pass, receive on back foot', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Easy passing & stretch', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Wind down, focus on technique not power', difficulty: 'easy' },
        ],
      },
    },
    stamina: {
      waterTraining: {
        warmup: [
          { name: 'Progressive run', distance: '800m', repetitions: 1, rest: '0s', technique: 'Start easy, build each 200m, arrive ready to work', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Interval run', distance: '400m', repetitions: 6, rest: '90s', technique: 'Maintain steady pace, controlled breathing throughout', difficulty: 'hard' },
          { name: 'Beep test intervals', distance: '20m', repetitions: 10, rest: '10s', technique: 'Turn efficiently, maintain pace to level', difficulty: 'hard' },
          { name: 'Tempo run', distance: '1km', repetitions: 3, rest: '120s', technique: 'Comfortably hard pace, controlled, not sprinting', difficulty: 'medium' },
        ],
        drillSet: [
          { name: 'Agility circuit', distance: '5 min', repetitions: 2, rest: '60s', technique: 'Cone weaves, hurdle steps, direction changes', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Walk & jog', distance: '400m', repetitions: 1, rest: '0s', technique: 'Drop heart rate slowly, finish with full-body stretch', difficulty: 'easy' },
        ],
      },
    },
    default: {
      waterTraining: {
        warmup: [
          { name: 'Ball activation warm-up', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Light dribbling, passing and movement to prepare body', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Technical drill block', distance: '15 min', repetitions: 3, rest: '60s', technique: 'Focused repetition on target skill, quality over speed', difficulty: 'medium' },
          { name: 'Game-situation practice', distance: '10 min', repetitions: 2, rest: '90s', technique: 'Apply skill under match-like pressure', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Skill isolation', distance: '8 min', repetitions: 1, rest: '30s', technique: 'Break the skill into parts, perfect each segment', difficulty: 'easy' },
        ],
        cooldown: [
          { name: 'Jog & stretch', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Easy movement, full-body static stretches', difficulty: 'easy' },
        ],
      },
    },
  },

  tennis: {
    serve: {
      waterTraining: {
        warmup: [
          { name: 'Shoulder warm-up', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Arm circles, band rotations, light toss practice', difficulty: 'easy' },
          { name: 'Toss consistency drill', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Toss in front at 1 o\'clock, consistent height and placement', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Flat serve targets', distance: '20 serves', repetitions: 3, rest: '60s', technique: 'Trophy position, snap wrist down, aim at T or body', difficulty: 'medium' },
          { name: 'Kick serve practice', distance: '15 serves', repetitions: 3, rest: '60s', technique: 'Toss slightly left, brush up on ball, high kick', difficulty: 'hard' },
          { name: 'Serve + one rally', distance: '10 points', repetitions: 2, rest: '90s', technique: 'Serve and move to net or back corner, play out point', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Slow-motion serve', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Break into phases: toss, coil, trophy, snap', difficulty: 'easy' },
          { name: 'Second-serve pressure', distance: '20 serves', repetitions: 1, rest: '30s', technique: 'Only hit second serves, aim for deep kick', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Arm & shoulder stretch', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Cross-body stretch, wrist flexion, doorway chest stretch', difficulty: 'easy' },
        ],
      },
    },
    forehand: {
      waterTraining: {
        warmup: [
          { name: 'Shadow swings', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Full swing motion with unit turn, low to high contact zone', difficulty: 'easy' },
          { name: 'Mini-tennis rallies', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Inside service line, focus on contact and spin', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Cross-court forehand', distance: '20 min', repetitions: 3, rest: '60s', technique: 'Open stance, full unit turn, brush up on ball', difficulty: 'medium' },
          { name: 'Inside-out forehand', distance: '15 balls', repetitions: 4, rest: '45s', technique: 'Run around backhand, hit to deuce corner', difficulty: 'hard' },
          { name: 'Heavy topspin drive', distance: '15 balls', repetitions: 3, rest: '45s', technique: 'Low contact, steep brush, aim for depth', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Forehand consistency', distance: '50 balls', repetitions: 2, rest: '60s', technique: 'Aim for 40+ in a row cross-court', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Easy rally & wrist stretch', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Light hitting, finish with forearm and wrist stretches', difficulty: 'easy' },
        ],
      },
    },
    footwork: {
      waterTraining: {
        warmup: [
          { name: 'Split step practice', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Jump and land on balls of feet as partner strikes', difficulty: 'easy' },
          { name: 'Lateral shuffle', distance: '10m', repetitions: 6, rest: '20s', technique: 'Low hips, crossover first step, recover to centre', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Spider drill', distance: '5 cones', repetitions: 6, rest: '45s', technique: 'Sprint to cone, collect ball, return centre, repeat', difficulty: 'hard' },
          { name: 'Baseline corner drill', distance: '4 corners', repetitions: 8, rest: '30s', technique: 'Recover to centre after each shot, stay ready', difficulty: 'hard' },
          { name: 'Approach shot footwork', distance: '10m', repetitions: 8, rest: '30s', technique: 'Diagonal approach steps, split step at net', difficulty: 'medium' },
        ],
        drillSet: [
          { name: 'Ladder agility', distance: '10m', repetitions: 6, rest: '20s', technique: 'In-in-out, lateral, Icky shuffle patterns', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Light movement & stretch', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Calf stretch, hip flexor, hamstring, ankle rolls', difficulty: 'easy' },
        ],
      },
    },
    default: {
      waterTraining: {
        warmup: [
          { name: 'Rally warm-up', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Light groundstrokes from service line, build up to baseline', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Drill repetitions', distance: '20 balls', repetitions: 4, rest: '60s', technique: 'Focused practice of target skill, consistent execution', difficulty: 'medium' },
          { name: 'Match-play simulation', distance: '15 min', repetitions: 2, rest: '90s', technique: 'Apply skill under pressure, play out points', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Slow-motion technique', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Break down movement, focus on body segments', difficulty: 'easy' },
        ],
        cooldown: [
          { name: 'Easy hitting & stretch', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Relax swing, full-body stretches targeting shoulders and hips', difficulty: 'easy' },
        ],
      },
    },
  },

  basketball: {
    shooting: {
      waterTraining: {
        warmup: [
          { name: 'Form shooting', distance: '3m', repetitions: 20, rest: '0s', technique: 'One hand only, focus on arc, release, and follow-through', difficulty: 'easy' },
          { name: 'Elbow mid-range', distance: '4m', repetitions: 15, rest: '15s', technique: 'Catch, set feet, rise straight up, guide hand soft', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Catch & shoot spot work', distance: '6m', repetitions: 10, rest: '20s', technique: 'Five spots, two makes each, reset footwork every shot', difficulty: 'medium' },
          { name: 'Off-dribble jumper', distance: '5m', repetitions: 8, rest: '25s', technique: 'One dribble pull-up, gather step, balanced landing', difficulty: 'hard' },
          { name: 'Three-point volume', distance: '7m', repetitions: 15, rest: '30s', technique: 'Quick catch, feet already set, consistent arc', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Free throw pairs', distance: '4.5m', repetitions: 20, rest: '10s', technique: 'Routine before each shot, bounce twice, sight, release', difficulty: 'easy' },
          { name: 'Moving off screens', distance: '6m', repetitions: 6, rest: '30s', technique: 'Curl or fade, catch ready to shoot, jump stop', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Cool-down dribbling & stretch', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Easy ball handling, wrist and finger stretches', difficulty: 'easy' },
        ],
      },
    },
    ball_handling: {
      waterTraining: {
        warmup: [
          { name: 'Stationary dribble series', distance: '3 min', repetitions: 1, rest: '0s', technique: 'Low hard dribble, alternating, crossover, between legs', difficulty: 'easy' },
          { name: 'Figure-8 dribble', distance: '3 min', repetitions: 1, rest: '0s', technique: 'Low and tight, keep eyes up', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Two-ball dribbling', distance: '3 min', repetitions: 3, rest: '45s', technique: 'Alternating rhythm, simultaneous, walk forward', difficulty: 'medium' },
          { name: 'Crossover series on move', distance: '15m', repetitions: 6, rest: '30s', technique: 'Crossover, through-legs, behind-back in sequence', difficulty: 'hard' },
          { name: 'Change-of-pace drive', distance: '5m', repetitions: 8, rest: '20s', technique: 'Slow, explosive burst, protect ball with body', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'One-hand dribble', distance: '2 min', repetitions: 2, rest: '20s', technique: 'Weak hand only, vary height and speed', difficulty: 'medium' },
          { name: 'Cone dribble slalom', distance: '15m', repetitions: 4, rest: '30s', technique: 'Eyes up, tight dribble around each cone', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Easy passing & finger stretches', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Wall passes and wrist / finger flexibility', difficulty: 'easy' },
        ],
      },
    },
    defense: {
      waterTraining: {
        warmup: [
          { name: 'Defensive stance', distance: '3 min', repetitions: 1, rest: '0s', technique: 'Low hips, wide base, active hands, weight on balls of feet', difficulty: 'easy' },
          { name: 'Lateral slides', distance: '10m', repetitions: 6, rest: '20s', technique: 'No crossover, stay low, push off outside foot', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Closeout drill', distance: '6m', repetitions: 10, rest: '15s', technique: 'Sprint out, chop steps to control, hands up contest', difficulty: 'medium' },
          { name: 'Shell drill', distance: '5 min', repetitions: 3, rest: '60s', technique: 'Help & recover, communicate with teammates, contest every shot', difficulty: 'hard' },
          { name: '1-on-1 on-ball defense', distance: '5 min', repetitions: 3, rest: '60s', technique: 'Force baseline, stay between man and basket', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Box-out drill', distance: '3 min', repetitions: 2, rest: '30s', technique: 'Contact first, wide base, turn to seal, secure rebound', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Light jogging & hip stretches', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Cool down, hip flexor and glute stretches', difficulty: 'easy' },
        ],
      },
    },
    default: {
      waterTraining: {
        warmup: [
          { name: 'Ball warm-up', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Light dribbling, passes and layups to activate', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Skill drill block', distance: '15 min', repetitions: 3, rest: '60s', technique: 'Focused repetitions on target area, quality movement', difficulty: 'medium' },
          { name: 'Live situation', distance: '10 min', repetitions: 2, rest: '90s', technique: 'Apply skill under game-like conditions', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Breakdown drill', distance: '8 min', repetitions: 1, rest: '30s', technique: 'Isolate one movement pattern, perfect it slowly', difficulty: 'easy' },
        ],
        cooldown: [
          { name: 'Easy shooting & stretch', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Free throws, then full-body stretch', difficulty: 'easy' },
        ],
      },
    },
  },

  running: {
    speed: {
      waterTraining: {
        warmup: [
          { name: 'Easy jog', distance: '1.5km', repetitions: 1, rest: '0s', technique: 'Relaxed, 60% effort, nasal breathing if possible', difficulty: 'easy' },
          { name: 'Strides', distance: '100m', repetitions: 4, rest: '60s', technique: 'Accelerate to 90% over 60m, decelerate last 40m', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Speed intervals', distance: '200m', repetitions: 8, rest: '90s', technique: 'Race pace effort, tall posture, arm drive, full recovery', difficulty: 'hard' },
          { name: 'Flying sprints', distance: '60m', repetitions: 6, rest: '120s', technique: '30m build then sprint, relax jaw and shoulders', difficulty: 'hard' },
          { name: 'Pace 400s', distance: '400m', repetitions: 4, rest: '3 min', technique: 'Goal race pace, even splits, stay relaxed', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'High knees', distance: '30m', repetitions: 4, rest: '30s', technique: 'Quick ground contact, drive knee to hip height', difficulty: 'medium' },
          { name: 'Bounding', distance: '30m', repetitions: 4, rest: '45s', technique: 'Powerful push-off, cover as much ground per stride as possible', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Easy jog & stretch', distance: '1km', repetitions: 1, rest: '0s', technique: 'Very easy, lower heart rate, finish with 10 min stretching', difficulty: 'easy' },
        ],
      },
    },
    endurance: {
      waterTraining: {
        warmup: [
          { name: 'Easy jog', distance: '2km', repetitions: 1, rest: '0s', technique: 'Conversational pace, establish breathing rhythm', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Tempo run', distance: '5km', repetitions: 1, rest: '0s', technique: 'Comfortably hard, 5-7 out of 10 effort, steady pace', difficulty: 'medium' },
          { name: 'Aerobic long intervals', distance: '1km', repetitions: 5, rest: '2 min', technique: 'Marathon effort, consistent splits, relax upper body', difficulty: 'hard' },
          { name: 'Easy steady run', distance: '3km', repetitions: 1, rest: '0s', technique: 'Recovery effort, 50-60%, focus on form', difficulty: 'easy' },
        ],
        drillSet: [
          { name: 'Cadence focus', distance: '400m', repetitions: 3, rest: '60s', technique: 'Target 180 steps/min, quick light turnover', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Walk & full-body stretch', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Hip flexors, hamstrings, calves, IT band', difficulty: 'easy' },
        ],
      },
    },
    sprint: {
      waterTraining: {
        warmup: [
          { name: 'Progressive warm-up jog', distance: '1.5km', repetitions: 1, rest: '0s', technique: 'Start easy, progressively pick up pace last 400m', difficulty: 'easy' },
          { name: 'Sprint drills A/B/C', distance: '30m', repetitions: 3, rest: '30s', technique: 'A-skip, B-skip, C-run for neuromuscular activation', difficulty: 'easy' },
        ],
        mainSet: [
          { name: '100m race pace repeats', distance: '100m', repetitions: 6, rest: '3 min', technique: 'Max effort, drive phase first 30m, maintain top speed', difficulty: 'hard' },
          { name: 'Hill sprints', distance: '80m', repetitions: 5, rest: '3 min', technique: 'Sprint up, high knees, walk down for full recovery', difficulty: 'hard' },
          { name: 'Block starts', distance: '40m', repetitions: 6, rest: '2 min', technique: 'Explosive push, stay low for 15m, gradual rise', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Sled push', distance: '20m', repetitions: 4, rest: '2 min', technique: 'Low angle, powerful drive, full push through', difficulty: 'hard' },
        ],
        cooldown: [
          { name: 'Walk & stretch', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Slow heart rate, target quads, hamstrings and hip flexors', difficulty: 'easy' },
        ],
      },
    },
    default: {
      waterTraining: {
        warmup: [
          { name: 'Easy jog', distance: '2km', repetitions: 1, rest: '0s', technique: 'Conversational pace, relax shoulders and arms', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Interval training', distance: '1km', repetitions: 4, rest: '2 min', technique: 'Hard effort, focus on maintaining form under fatigue', difficulty: 'hard' },
          { name: 'Steady-state run', distance: '3km', repetitions: 1, rest: '0s', technique: 'Moderate effort, consistent pace, breathe rhythmically', difficulty: 'medium' },
        ],
        drillSet: [
          { name: 'Running drills', distance: '30m', repetitions: 4, rest: '30s', technique: 'High knees, butt kicks, ankling for neuromuscular activation', difficulty: 'easy' },
        ],
        cooldown: [
          { name: 'Walk & stretch', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Lower heart rate, full-body static stretch', difficulty: 'easy' },
        ],
      },
    },
  },

  cycling: {
    speed: {
      waterTraining: {
        warmup: [
          { name: 'Easy spin', distance: '10 min', repetitions: 1, rest: '0s', technique: 'High cadence (90+ rpm), very low resistance, loosen legs', difficulty: 'easy' },
          { name: 'Build efforts', distance: '1 min', repetitions: 4, rest: '90s', technique: 'Each rep slightly harder, reaching 80% effort at last', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Sprint intervals', distance: '15s', repetitions: 10, rest: '3 min', technique: 'Max power output, keep cadence high (100+), seated', difficulty: 'hard' },
          { name: 'Micro-bursts', distance: '15s on/15s off', repetitions: 12, rest: '5 min', technique: 'Alternate all-out and near-rest every 15 seconds', difficulty: 'hard' },
          { name: 'Over-under intervals', distance: '5 min', repetitions: 3, rest: '5 min', technique: 'Alternate 1 min below threshold, 1 min above threshold', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'High-cadence drill', distance: '5 min', repetitions: 2, rest: '2 min', technique: 'Spin at 100-110 rpm, low resistance, smooth circles', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Easy spin & stretch', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Very easy spin, then off-bike hip, quad and calf stretches', difficulty: 'easy' },
        ],
      },
    },
    endurance: {
      waterTraining: {
        warmup: [
          { name: 'Easy endurance spin', distance: '20 min', repetitions: 1, rest: '0s', technique: 'Zone 2 effort, conversational pace, 85-90 rpm', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Steady-state base ride', distance: '60 min', repetitions: 1, rest: '0s', technique: 'Maintain zone 2-3, consistent power, eat every 30 min', difficulty: 'medium' },
          { name: 'Sweet spot intervals', distance: '10 min', repetitions: 3, rest: '5 min', technique: '88-93% FTP, sustained effort, controlled breathing', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Cadence pyramid', distance: '10 min', repetitions: 1, rest: '0s', technique: '80-90-100-110 rpm in 2-min blocks, same power output', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Cool-down spin', distance: '15 min', repetitions: 1, rest: '0s', technique: 'Very easy, recover, then off-bike stretches', difficulty: 'easy' },
        ],
      },
    },
    climbing: {
      waterTraining: {
        warmup: [
          { name: 'Flat warm-up spin', distance: '15 min', repetitions: 1, rest: '0s', technique: 'Gentle to moderate effort, prepare legs for climbing load', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Hill repeat climbs', distance: '5 min', repetitions: 5, rest: '3 min', technique: 'Seated, steady power, 70-80 rpm, breathe from belly', difficulty: 'hard' },
          { name: 'Out-of-saddle climbing', distance: '2 min', repetitions: 5, rest: '2 min', technique: 'Rock bike, push through pedal stroke, controlled effort', difficulty: 'hard' },
          { name: 'Strength endurance climb', distance: '15 min', repetitions: 1, rest: '0s', technique: 'Low cadence 60-65 rpm, heavy gear, build power', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Surges on climb', distance: '30s', repetitions: 6, rest: '90s', technique: 'Mid-climb 10s burst then return to steady pace', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Easy descent & spin', distance: '15 min', repetitions: 1, rest: '0s', technique: 'Cool down gradually, spin easy after hard climbing work', difficulty: 'easy' },
        ],
      },
    },
    default: {
      waterTraining: {
        warmup: [
          { name: 'Easy warm-up spin', distance: '15 min', repetitions: 1, rest: '0s', technique: 'Build gradually from easy to moderate effort', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Interval training', distance: '5 min', repetitions: 4, rest: '3 min', technique: 'Threshold effort, maintain form and cadence under load', difficulty: 'hard' },
          { name: 'Steady tempo ride', distance: '20 min', repetitions: 1, rest: '0s', technique: 'Sweet spot effort, consistent power, controlled breathing', difficulty: 'medium' },
        ],
        drillSet: [
          { name: 'Single-leg drill', distance: '2 min', repetitions: 4, rest: '60s', technique: 'One leg clipped in, smooth circles, no dead spots', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Cool-down spin & stretch', distance: '10 min', repetitions: 1, rest: '0s', technique: 'Very easy, then hip, quad and glute stretches off bike', difficulty: 'easy' },
        ],
      },
    },
  },

  volleyball: {
    spike: {
      waterTraining: {
        warmup: [
          { name: 'Shoulder activation', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Band pull-aparts, arm circles, light serving motion', difficulty: 'easy' },
          { name: 'Approach footwork', distance: '10m', repetitions: 8, rest: '20s', technique: '4-step approach: right-left-right-left (for right handers)', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Approach & spike', distance: '10 spikes', repetitions: 4, rest: '60s', technique: 'Full approach, high jump, arm swing from shoulder, snap wrist', difficulty: 'medium' },
          { name: 'Line spike', distance: '8 spikes', repetitions: 4, rest: '45s', technique: 'Open up shoulder to line, contact out front, follow through', difficulty: 'hard' },
          { name: 'Cross-court cut shot', distance: '8 spikes', repetitions: 3, rest: '45s', technique: 'Approach straight, cut angle at contact, tight to antenna', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Jump reach practice', distance: '5 min', repetitions: 2, rest: '45s', technique: 'Two-foot take-off, reach full extension, land balanced', difficulty: 'medium' },
          { name: 'Spike off toss', distance: '10 spikes', repetitions: 2, rest: '30s', technique: 'Consistent toss, meet the ball at highest point', difficulty: 'easy' },
        ],
        cooldown: [
          { name: 'Shoulder & wrist stretch', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Cross-body, overhead, wrist circles and flexion', difficulty: 'easy' },
        ],
      },
    },
    serve: {
      waterTraining: {
        warmup: [
          { name: 'Float serve targets', distance: '10 serves', repetitions: 2, rest: '30s', technique: 'No spin, contact centre, firm wrist, aim at zones', difficulty: 'easy' },
          { name: 'Topspin serve drill', distance: '10 serves', repetitions: 2, rest: '30s', technique: 'Toss high, full arm swing, brush top of ball', difficulty: 'medium' },
        ],
        mainSet: [
          { name: 'Jump serve practice', distance: '15 serves', repetitions: 3, rest: '60s', technique: 'Toss ahead, approach, jump and swing aggressively', difficulty: 'hard' },
          { name: 'Serve to zones', distance: '5 serves/zone', repetitions: 2, rest: '60s', technique: 'Target zones 1, 5, 6 systematically, vary speed', difficulty: 'medium' },
          { name: 'Pressure serving', distance: '10 serves', repetitions: 2, rest: '30s', technique: 'Count streak, reset routine after each miss', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Weak-zone serve', distance: '20 serves', repetitions: 1, rest: '30s', technique: 'Hit to seams between receivers, disrupt passing platform', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Arm stretch & cool-down', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Wrist, forearm, shoulder capsule stretches', difficulty: 'easy' },
        ],
      },
    },
    passing: {
      waterTraining: {
        warmup: [
          { name: 'Platform warm-up', distance: '5 min', repetitions: 1, rest: '0s', technique: 'Self-toss and pass to target, flat platform, no wrist', difficulty: 'easy' },
          { name: 'Partner pepper', distance: '5 min', repetitions: 2, rest: '20s', technique: 'Pass-set-hit cycle, control every contact', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Serve receive drill', distance: '20 serves', repetitions: 3, rest: '60s', technique: 'Get behind ball, pass to target zone, move feet early', difficulty: 'medium' },
          { name: 'Angle passing', distance: '10 min', repetitions: 2, rest: '45s', technique: 'Pass sharp angle serves, rotate hips to target', difficulty: 'hard' },
          { name: 'Quick reaction pass', distance: '10 balls', repetitions: 3, rest: '30s', technique: 'Coach hits fast, read spin, react quickly', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Consecutive passes', distance: '50 passes', repetitions: 2, rest: '45s', technique: 'Aim for 45+ in a row, minimal platform movement', difficulty: 'medium' },
        ],
        cooldown: [
          { name: 'Forearm stretch & cool-down', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Wrist and forearm stretches, walk to lower heart rate', difficulty: 'easy' },
        ],
      },
    },
    default: {
      waterTraining: {
        warmup: [
          { name: 'Ball handling warm-up', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Light passing, setting and serving to get touch on ball', difficulty: 'easy' },
        ],
        mainSet: [
          { name: 'Skill drill repetitions', distance: '15 min', repetitions: 3, rest: '60s', technique: 'Focused technique work, correct movement patterns', difficulty: 'medium' },
          { name: 'Game situation', distance: '10 min', repetitions: 2, rest: '90s', technique: 'Apply skill in scrimmage or pressure drill', difficulty: 'hard' },
        ],
        drillSet: [
          { name: 'Breakdown practice', distance: '8 min', repetitions: 1, rest: '30s', technique: 'Isolate key movement, build slowly to full speed', difficulty: 'easy' },
        ],
        cooldown: [
          { name: 'Light jogging & stretch', distance: '8 min', repetitions: 1, rest: '0s', technique: 'Easy movement, shoulder and hip stretches', difficulty: 'easy' },
        ],
      },
    },
  },
};

export function generateTrainingPlan(config: GenerationConfig): TrainingPlan {
  let basePlan: Partial<TrainingPlan> = {};

  if (config.sport === 'swimming') {
    const swimmingPlan = swimmingPlans[config.improvement] || swimmingPlans.technique;
    basePlan = JSON.parse(JSON.stringify(swimmingPlan));
  } else if (config.sport === 'gym') {
    const gymPlan = gymPlans[config.improvement] || gymPlans.fitness;
    basePlan = JSON.parse(JSON.stringify(gymPlan));
  } else {
    const sportPlan = sportSpecificPlans[config.sport]?.[config.improvement]
      || sportSpecificPlans[config.sport]?.default
      || genericSportPlan;
    basePlan = JSON.parse(JSON.stringify(sportPlan));
  }

  basePlan = adjustPlanBySkillLevel(basePlan, config.questionnaire.skillLevel);
  basePlan = adjustByDuration(basePlan, config.questionnaire.trainingDuration);

  const performanceAnalysis = generatePerformanceAnalysis(config);
  const weeklyGoals = generateWeeklyGoals(config);

  const drylandExercises = config.sport === 'gym'
    ? (gymDrylandExercises[config.improvement] || gymDrylandExercises.fitness)
    : defaultDrylandExercises;

  return {
    waterTraining: basePlan.waterTraining || {
      warmup: [],
      mainSet: [],
      drillSet: [],
      cooldown: [],
    },
    drylandTraining: drylandExercises,
    nutrition: defaultNutrition,
    tips: generateTips(config),
    performanceAnalysis,
    weeklyGoals,
  };
}

function generateTips(config: GenerationConfig): string[] {
  const tips: string[] = [];

  tips.push(`Train consistently ${config.questionnaire.sessionsPerWeek} times per week for best results`);

  if (config.sport === 'swimming') {
    tips.push('Focus on technique before intensity—bad habits are harder to break later');
    tips.push('Video analysis every few weeks helps track form improvements');
  } else if (config.sport === 'gym') {
    tips.push('Progressive overload is the #1 driver of results — add weight or reps every week');
    if (config.improvement === 'build_muscle') {
      tips.push('Eat in a slight calorie surplus with 1.6-2.2g protein per kg bodyweight daily');
      tips.push('Prioritize compound lifts — they stimulate the most muscle growth per session');
    } else if (config.improvement === 'lose_weight') {
      tips.push('Nutrition drives fat loss — training preserves muscle while you are in a deficit');
      tips.push('Track your calories for at least 2 weeks to understand your intake');
    } else if (config.improvement === 'strength') {
      tips.push('Rest fully between heavy sets — 2-3 minutes is not wasted time, it is necessary');
      tips.push('Film your lifts from the side to check depth and bar path');
    } else {
      tips.push('Consistency over perfection — showing up regularly beats the perfect plan');
    }
  }

  if (config.questionnaire.skillLevel === 'beginner') {
    tips.push('Take rest days seriously—recovery is when adaptation happens');
    tips.push('Focus on mastering basics before moving to advanced drills');
  }

  if (config.questionnaire.trainingDuration <= 45) {
    tips.push('With limited time, prioritize compound movements and cut isolation work');
  }

  tips.push('Listen to your body—quality over quantity every time');
  tips.push('Keep a training log to track progress and identify patterns');

  return tips;
}
