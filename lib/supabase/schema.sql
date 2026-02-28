-- 1. Φτιάχνουμε τον πίνακα Profiles σωστά συνδεδεμένο με το Auth του Supabase
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  sex TEXT CHECK (sex IN ('m', 'f', 'other')),
  age INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Προσθέτουμε τη στήλη user_id στις προπονήσεις για να ξέρουμε ποιανού είναι
ALTER TABLE workouts 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL;

-- 3. Ξυπνάμε τον "Πορτιέρη" (Ενεργοποίηση Row Level Security) σε όλους τους πίνακες
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- 4. Οι Κανόνες του Πορτιέρη (Policies)

-- PROFILES: Ο χρήστης βλέπει και αλλάζει ΜΟΝΟ το δικό του προφίλ
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- WORKOUTS: Ο χρήστης βλέπει και φτιάχενι ΜΟΝΟ τις δικές του προπονήσεις
CREATE POLICY "Users manage own workouts" ON workouts FOR ALL USING (auth.uid() = user_id);

-- WORKOUT_EXERCISES: Ο χρήστης πειράζει ασκήσεις ΜΟΝΟ αν η προπόνηση είναι δική του
CREATE POLICY "Users manage own workout exercises" ON workout_exercises 
FOR ALL USING (
  workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
);

-- EXERCISES (Ο Κατάλογος): Όλοι μπορούν να διαβάσουν τις έτοιμες ασκήσεις, κανείς δεν μπορεί να τις σβήσει
CREATE POLICY "Everyone can read exercises" ON exercises FOR SELECT USING (true);

-- 5. Ο Κατάλογος των Ασκήσεων
CREATE TABLE exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  target_muscle TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Η "Ομπρέλα" της Προπόνησης
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Ο Ενδιάμεσος Κρίκος (Οι μετρικές της άσκησης μέσα στην προπόνηση)
CREATE TABLE workout_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);