from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import sqlite3
import hashlib
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'cricket-injury-secret-key'
CORS(app)

# Load ML model and encoders
model = joblib.load('models/injury_predictor.pkl')
role_encoder = joblib.load('models/role_encoder.pkl')
type_encoder = joblib.load('models/type_encoder.pkl')
travel_encoder = joblib.load('models/travel_encoder.pkl')
format_encoder = joblib.load('models/format_encoder.pkl')

# Initialize database
def init_db():
    conn = sqlite3.connect('users.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS users 
                    (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)''')
    conn.commit()
    conn.close()

init_db()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token missing'}), 401
        try:
            token = token.split(' ')[1]  # Remove 'Bearer '
            jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        except:
            return jsonify({'error': 'Token invalid'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = hashlib.sha256(data.get('password').encode()).hexdigest()
    
    conn = sqlite3.connect('users.db')
    try:
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
        return jsonify({'message': 'User registered successfully'})
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 400
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = hashlib.sha256(data.get('password').encode()).hexdigest()
    
    conn = sqlite3.connect('users.db')
    user = conn.execute('SELECT * FROM users WHERE username=? AND password=?', (username, password)).fetchone()
    conn.close()
    
    if user:
        token = jwt.encode({
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        return jsonify({'token': token, 'username': username})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/predict', methods=['POST'])
@token_required
def predict():
    data = request.json
    
    # Prepare input data
    input_data = pd.DataFrame([{
        'Age': data['age'],
        'Player Role': role_encoder.transform([data['playerRole']])[0],
        'Player Type': type_encoder.transform([data['playerType']])[0],
        'BMI': data['bmi'],
        'Matches Last Week': data['matchesLastWeek'],
        'Matches Last Month': data['matchesLastMonth'],
        'Balls Faced Last Match': data['ballsFacedLastMatch'],
        'Acute Workload (7d)': data['acuteWorkload'],
        'Chronic Workload (30d)': data['chronicWorkload'],
        'Injuries Last 30d': data['injuriesLast30d'],
        'Rest Days': data['restDays'],
        'Travel Load': travel_encoder.transform([data['travelLoad']])[0],
        'Match Format': format_encoder.transform([data['matchFormat']])[0]
    }])
    
    prediction = model.predict(input_data)[0]
    return jsonify({'injuryRisk': round(prediction, 1)})

if __name__ == '__main__':
    app.run(debug=True, port=5500)