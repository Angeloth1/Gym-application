# 🏋️ Gym Tracker App (Name Placeholder)

A modern, frictionless fitness tracking application built with React Native (Expo) and Supabase. Designed to help users log their workouts seamlessly, track their progress, and participate in fitness challenges.

## ✨ Key Features

- **Frictionless Logging:** Start a session, input your metrics (sets, reps, weight), and transition smoothly to the next exercise with minimal taps.
- **Smart Auto-Titles:** Automatically generates workout session titles (e.g., "Chest & Triceps" or "Full Body") by analyzing the `target_muscle` of the completed exercises.
- **Rich Exercise Catalog:** Comes pre-loaded with a comprehensive list of exercises, while allowing users to create custom ones.
- **Progress & Social:** Includes dedicated tabs for tracking statistical milestones, managing user profiles, and participating in challenges (solo or with friends).
- **Secure by Design:** Built with a strict privacy-first approach. Utilizes Supabase Authentication and PostgreSQL Row Level Security (RLS) to ensure users can only access their own data.

## 🏗️ Tech Stack

- **Frontend:** React Native, Expo, Expo Router (File-based routing)
- **UI Components:** React Native Paper
- **Backend & Database:** Supabase (PostgreSQL)

## 🗄️ Database Architecture

The application relies on a robust relational database model to group individual exercises under unified workout sessions:

- `profiles`: User information, securely linked to the authentication system.
- `workouts`: The umbrella session entity (stores the auto-generated title, date, and owner).
- `exercises`: The catalog of available exercises and their targeted muscle groups.
- `workout_exercises`: The junction table recording the exact metrics (sets, reps, weight) for every exercise performed during a specific workout.

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites
Make sure you have Node.js and npm installed on your machine. You will also need the Expo Go app on your mobile device (or an iOS/Android emulator).

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/gym-app.git](https://github.com/your-username/gym-app.git)**
