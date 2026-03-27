# 🏋️ Gym Tracker App

A modern, high-performance fitness tracking application built with **React Native (Expo)** and **Supabase**. Designed for zero-friction logging, allowing you to focus on your sets, not your screen.

---

## 📱 App Preview

| 1. Active (Collapsed) | 2. Active (Expanded) | 3. Workout Details |
| :---: | :---: | :---: |
| <img width="230" height="512" alt="image" src="https://github.com/user-attachments/assets/d2d9e26a-50d3-4d4e-8833-294179c3dccc" /> | <img width="230" height="512" alt="image" src="https://github.com/user-attachments/assets/d1663fe4-f163-4e1d-bff3-55db7580c6ff" /> | <img width="230" height="512" alt="image" src="https://github.com/user-attachments/assets/05c3fc46-dc98-4d38-948d-157b3c6aeefe" /> |
| *Clean dashboard* | *Interactive session* | *Full set breakdown* |

---

## ✨ Key Features

### ⚡ Frictionless Logging
* **Interactive Active Session:** A smart accordion panel that stays at the top of your screen. Expand it to see your current progress or collapse it to focus on your history.
* **Progressive Disclosure:** Deep details (like weight and reps per set) are hidden behind modals and accordions to keep the UI clean and fast.
* **Quick Resume:** Tap any active exercise to jump straight back into input mode.

### 🧠 Intelligence
* **Smart Auto-Titles:** Analyzes your session's muscle groups and automatically names your workout (e.g., *"Chest & Back"* or *"Leg Day"*).
* **Auto-Archive System:** Never worry about forgetting to end a workout. The app automatically saves your session after 1 hour of inactivity.

### 📊 Performance History
* **Detailed Logs:** Every workout is stored with a full breakdown. Tap any past session to see exactly what you lifted, down to the last rep.

---

## 🏗️ Tech Stack

* **Frontend:** React Native (Expo) with TypeScript
* **State Management:** **Zustand** (utilizing `useShallow` for optimized renders and `persist` for local storage)
* **Navigation:** Expo Router (File-based)
* **Backend:** Supabase (PostgreSQL + Auth + Row Level Security)
* **Icons:** Material Community Icons

---

## 🗄️ Database Architecture

The application relies on a robust relational model:

* `profiles`: Secure user metadata linked to Supabase Auth.
* `workouts`: Unified session entity (stores the auto-generated title, date, and owner).
* `exercises`: Global catalog of exercises and target muscle groups.
* `workout_exercises`: Junction table recording exact metrics (sets, reps, weight) for every exercise performed.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Expo Go app on your mobile device.
