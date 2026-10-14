// The user's own split, seeded once per device (see db.js). Every item names a LIBRARY exercise
// or one in CUSTOM. Sets/reps/weight start at 3×10 @ 0 kg — edit them in the Schedules tab.
export const CUSTOM = {
  'Iso-Lateral Bench Press': 'Chest',
  'Close-Grip Row': 'Back',
  'Single-Arm DB Pull': 'Back',
  'Muscle-Up': 'Back',
  'Bench-Supported Shrug': 'Shoulders',
  'Isolated DB Curl': 'Biceps',
  'Sup/Pro EZ-Bar Curl': 'Biceps',
  'Cross-Body Tricep Extension': 'Triceps',
  'Overhead Tricep Extension': 'Triceps',
  'Leg Curl': 'Hamstrings & Glutes',
};

export const SCHEDULES = [
  {
    name: 'Push 1 (Chest + Shoulder)',
    items: ['Barbell Bench Press', 'Iso-Lateral Bench Press', 'Dumbbell Fly', 'Dumbbell Lateral Raise', 'Face Pull', 'Hanging Leg Raise'],
  },
  {
    name: 'Pull 1 (Back + Triceps)',
    items: ['Deadlift', 'Close-Grip Row', 'Single-Arm DB Pull', 'Tricep Pushdown', 'Cross-Body Tricep Extension'],
  },
  {
    name: 'Arms (Bicep + Core + Tri)',
    // Hanging Leg Raise + Russian Twist are done combined (superset).
    items: ['Barbell Curl', 'Isolated DB Curl', 'Sup/Pro EZ-Bar Curl', 'Dragon Flag', 'Hanging Leg Raise', 'Russian Twist', 'Overhead Tricep Extension'],
  },
  {
    name: 'Leg (Quads + Calves)',
    items: ['Back Squat', 'Hack Squat', 'Leg Curl', 'Standing Calf Raise'],
  },
  {
    name: 'Push + Pull (Shelf + Thiccc)',
    // Chest Dip + leg raises are done combined (superset).
    items: ['Incline Dumbbell Press', 'Dumbbell Row', 'Chest Dip', "Captain's Chair Leg Raise", 'Bench-Supported Shrug', 'Overhead Press'],
  },
  {
    name: 'Posterior Chain (Hams + Abs)',
    items: ['Romanian Deadlift', 'Leg Press', 'Goblet Squat', 'Muscle-Up', 'Cable Crunch'],
  },
];
