# Cricket Injury Prediction

## About

This project focuses on predicting the **probability** of injury in cricket players based on recent match workload, physical attributes, recovery patterns, and contextual factors. The goal is to help **teams**, **analysts**, and **support staff** identify high-risk players early and make informed decisions around rest, rotation, and training intensity.

The model uses a combination of player **characteristics**, **short-term** and **long-term workload metrics**, **injury history**, and **match-related factors** to estimate injury risk as a percentage. These predictions are designed to be displayed through an interactive dashboard, making the results easy to interpret and actionable.

## Demonstration
https://github.com/user-attachments/assets/723bc8f0-cc5c-4926-b8f6-5ecb22217bee

## Core Features Used
- **🧍 Player Characteristics**
-     Age, BMI, player role, and playing style
- **🏏 Workload & Match Load**
-     Matches played (weekly and monthly)
- **💪🏻 Workload Change & Fatigue**
-     Balls faced and workload metrics
- **🩺 Injury History**
-     Injury count and rest days
- **🌎 External / Contextual**
-     Travel load and match format


## Setup

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/anodicpassion/cricket-injury-predictor.git

# Step 2: Navigate to the project directory.
cd cricket-injury-predictor

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


## Use Cases
- Player workload management
- Injury prevention and squad rotation
- Performance and sports analytics research
