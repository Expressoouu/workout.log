// 200 common gym exercises, seeded into the database once per device (see db.js).
export const LIBRARY = {
  Chest: [
    'Barbell Bench Press', 'Incline Barbell Bench Press', 'Decline Barbell Bench Press', 'Dumbbell Bench Press',
    'Incline Dumbbell Press', 'Decline Dumbbell Press', 'Dumbbell Fly', 'Incline Dumbbell Fly', 'Cable Crossover',
    'Low-to-High Cable Fly', 'Pec Deck', 'Machine Chest Press', 'Incline Machine Press', 'Smith Machine Bench Press',
    'Push-Up', 'Weighted Push-Up', 'Chest Dip', 'Dumbbell Pullover', 'Floor Press', 'Svend Press',
  ],
  Back: [
    'Deadlift', 'Pull-Up', 'Chin-Up', 'Weighted Pull-Up', 'Assisted Pull-Up', 'Lat Pulldown', 'Close-Grip Lat Pulldown',
    'Straight-Arm Pulldown', 'Barbell Row', 'Pendlay Row', 'Dumbbell Row', 'Seated Cable Row', 'Single-Arm Cable Row',
    'T-Bar Row', 'Chest-Supported Row', 'Machine Row', 'Inverted Row', 'Meadows Row', 'Seal Row', 'Rack Pull',
    'Snatch-Grip Deadlift', 'Good Morning', 'Back Extension', 'Reverse Hyperextension',
  ],
  Shoulders: [
    'Overhead Press', 'Seated Dumbbell Shoulder Press', 'Arnold Press', 'Push Press', 'Machine Shoulder Press',
    'Smith Machine Overhead Press', 'Behind-the-Neck Press', 'Landmine Press', 'Dumbbell Lateral Raise',
    'Cable Lateral Raise', 'Machine Lateral Raise', 'Lu Raise', 'Front Raise', 'Plate Front Raise', 'Rear Delt Fly',
    'Reverse Pec Deck', 'Face Pull', 'Upright Row', 'Barbell Shrug', 'Dumbbell Shrug',
  ],
  Biceps: [
    'Barbell Curl', 'EZ-Bar Curl', 'Dumbbell Curl', 'Hammer Curl', 'Cross-Body Hammer Curl', 'Incline Dumbbell Curl',
    'Preacher Curl', 'Machine Preacher Curl', 'Concentration Curl', 'Cable Curl', 'Bayesian Cable Curl',
    'Rope Hammer Curl', 'Spider Curl', 'Drag Curl', 'Reverse Curl', 'Zottman Curl',
  ],
  Triceps: [
    'Close-Grip Bench Press', 'Tricep Pushdown', 'Rope Pushdown', 'Reverse-Grip Pushdown', 'Single-Arm Cable Pushdown',
    'Overhead Cable Extension', 'Skull Crusher', 'Dumbbell Overhead Extension', 'EZ-Bar Overhead Extension',
    'Machine Tricep Extension', 'Tricep Dip', 'Bench Dip', 'Tricep Kickback', 'JM Press', 'Tate Press', 'Diamond Push-Up',
  ],
  Forearms: ['Wrist Curl', 'Reverse Wrist Curl', "Farmer's Carry", 'Dead Hang', 'Plate Pinch', 'Wrist Roller'],
  Quads: [
    'Back Squat', 'Front Squat', 'Goblet Squat', 'Box Squat', 'Pause Squat', 'Zercher Squat', 'Overhead Squat',
    'Hack Squat', 'Pendulum Squat', 'Belt Squat', 'Smith Machine Squat', 'Leg Press', 'Single-Leg Leg Press',
    'Bulgarian Split Squat', 'Split Squat', 'Walking Lunge', 'Forward Lunge', 'Reverse Lunge', 'Lateral Lunge', 'Step-Up',
    'Leg Extension', 'Sissy Squat', 'Pistol Squat', 'Wall Sit',
  ],
  'Hamstrings & Glutes': [
    'Romanian Deadlift', 'Dumbbell Romanian Deadlift', 'Single-Leg Romanian Deadlift', 'Stiff-Leg Deadlift',
    'Sumo Deadlift', 'Trap Bar Deadlift', 'Lying Leg Curl', 'Seated Leg Curl', 'Standing Leg Curl',
    'Nordic Hamstring Curl', 'Glute-Ham Raise', 'Barbell Hip Thrust', 'Machine Hip Thrust', 'Single-Leg Hip Thrust',
    'Glute Bridge', 'Frog Pump', 'Cable Pull-Through', 'Cable Glute Kickback', 'Hip Abduction Machine',
    'Hip Adduction Machine', 'Kettlebell Swing', 'Curtsy Lunge',
  ],
  Calves: [
    'Standing Calf Raise', 'Seated Calf Raise', 'Leg Press Calf Raise', 'Smith Machine Calf Raise',
    'Single-Leg Calf Raise', 'Donkey Calf Raise',
  ],
  Core: [
    'Plank', 'Side Plank', 'Crunch', 'Cable Crunch', 'Bicycle Crunch', 'Sit-Up', 'Decline Sit-Up', 'Hanging Leg Raise',
    'Hanging Knee Raise', "Captain's Chair Leg Raise", 'Lying Leg Raise', 'Toes-to-Bar', 'Ab Wheel Rollout',
    'Russian Twist', 'Mountain Climber', 'Dead Bug', 'Bird Dog', 'Pallof Press', 'Cable Woodchopper', 'V-Up',
    'Hollow Body Hold', 'Dragon Flag',
  ],
  'Olympic & Full Body': [
    'Power Clean', 'Hang Clean', 'Clean and Jerk', 'Snatch', 'Hang Snatch', 'Thruster', 'Burpee', 'Turkish Get-Up',
    'Sled Push', 'Sled Pull', 'Wall Ball', 'Box Jump', 'Medicine Ball Slam',
  ],
  Cardio: [
    'Treadmill Run', 'Incline Treadmill Walk', 'Stationary Bike', 'Assault Bike', 'Rowing Machine', 'Ski Erg',
    'Elliptical', 'Stair Climber', 'Jump Rope', 'Battle Ropes', 'Jumping Jacks',
  ],
};
