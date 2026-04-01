-- 1. ΚΑΘΑΡΙΣΜΟΣ ΤΟΥ ΠΑΛΙΟΥ SCHEMA (Προσοχή: Διαγράφει τα πάντα)
DROP TABLE IF EXISTS workout_exercises CASCADE; -- Αντίο στο παλιό λάθος
DROP TABLE IF EXISTS workout_sets CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  sex TEXT CHECK (sex IN ('m', 'f', 'other')),
  age INTEGER,
  avatar_url TEXT, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. EXERCISES (Ο Κατάλογος Ασκήσεων)
CREATE TABLE exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  "nameNonEng" TEXT,
  target_muscle TEXT NOT NULL,
  equipment_type TEXT CHECK (equipment_type IN ('barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'none', 'other')) DEFAULT 'barbell',
  has_weights BOOLEAN DEFAULT TRUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL σημαίνει Global άσκηση
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. WORKOUTS (Το Session)
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE -- NULL σημαίνει ότι η προπόνηση είναι Active
);

-- 5. WORKOUT_SETS (Το Granular Tracking - Η Καρδιά του App)
CREATE TABLE workout_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. RLS & ΑΣΦΑΛΕΙΑ (Ενεργοποίηση του "Πορτιέρη")
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;

-- 7. POLICIES (Οι Κανόνες Πρόσβασης)
-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can u.workout.created_at own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Exercises
CREATE POLICY "Users can read global and own exercises" ON exercises FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Users can insert own exercises" ON exercises FOR INSERT WITH CHECK (user_id = auth.uid());
-- (Κανείς δεν μπορεί να κάνει UPDATE/DELETE τα έτοιμα exercises)

-- Workouts
CREATE POLICY "Users manage own workouts" ON workouts FOR ALL USING (user_id = auth.uid());

-- Sets
CREATE POLICY "Users manage own sets" ON workout_sets FOR ALL USING (
  workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
);
