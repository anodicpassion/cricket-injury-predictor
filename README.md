# Cricket Injury Prediction

## About

This project focuses on predicting the **probability** of injury in cricket players based on recent match workload, physical attributes, recovery patterns, and contextual factors. The goal is to help **teams**, **analysts**, and **support staff** identify high-risk players early and make informed decisions around rest, rotation, and training intensity.

The model uses a combination of player **characteristics**, **short-term** and **long-term workload metrics**, **injury history**, and **match-related factors** to estimate injury risk as a percentage. These predictions are displayed through an interactive dashboard with real-time ML predictions.

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Flask + Python with ML model integration
- **ML Model**: Random Forest Regressor trained on cricket injury data
- **Authentication**: JWT-based user authentication
- **Database**: SQLite for user management

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

### Prerequisites
- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Python 3.8+ with pip

### Installation Steps

```sh
# Step 1: Clone the repository
git clone https://github.com/anodicpassion/cricket-injury-predictor.git
cd cricket-injury-predictor

# Step 2: Set up Python virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Step 3: Install Python dependencies
pip install -r requirements.txt

# Step 4: Train the ML model (required for first-time setup)
python train_model.py

# Step 5: Install Node.js dependencies
npm install
```

### Running the Application

#### Option 1: Run both servers with one command
```sh
# Start both Flask backend and React frontend
./start.sh
```

#### Option 2: Run servers individually

**Terminal 1 - Flask Backend:**
```sh
source .venv/bin/activate
python app.py
# Backend runs on http://localhost:5500
```

**Terminal 2 - React Frontend:**
```sh
npm run dev
# Frontend runs on http://localhost:5173
```

### ML Model Training

The `train_model.py` script:
- Loads the cricket injury dataset from `dataset/cricket_injury_risk_dataset.csv`
- Preprocesses categorical variables using label encoders
- Trains a Random Forest Regressor model
- Evaluates model performance (achieves ~98.9% accuracy)
- Saves the trained model and encoders to `models/` directory

**Model Performance:**
- MSE: 4.60
- R²: 0.989
- RMSE: 2.15

**Model Files Generated:**
- `injury_predictor.pkl` - Trained Random Forest model
- `role_encoder.pkl` - Player Role encoder
- `type_encoder.pkl` - Player Type encoder
- `travel_encoder.pkl` - Travel Load encoder
- `format_encoder.pkl` - Match Format encoder

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login (returns JWT token)

### Prediction
- `POST /predict` - Get injury risk prediction (requires authentication)

### Request Format for Prediction
```json
{
  "age": 25,
  "playerRole": "Batsman",
  "playerType": "Aggressive",
  "bmi": 23.5,
  "matchesLastWeek": 2,
  "matchesLastMonth": 8,
  "ballsFacedLastMatch": 45,
  "acuteWorkload": 120.5,
  "chronicWorkload": 280.3,
  "injuriesLast30d": 0,
  "restDays": 5,
  "travelLoad": "Medium",
  "matchFormat": "T20"
}
```

## What technologies are used for this project?

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Backend
- Flask (Python web framework)
- scikit-learn (ML model)
- pandas & numpy (data processing)
- SQLite (user database)
- JWT (authentication)

## Use Cases
- Real-time injury risk assessment for cricket players
- Player workload management and optimization
- Data-driven injury prevention and squad rotation decisions
- Performance and sports analytics research
- Team management and coaching support tools

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Support
⭐ If you found this project helpful, please consider giving it a star!
