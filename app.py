import os
import warnings
import joblib
import pandas as pd
from flask import Flask, render_template, request, redirect, url_for, session

# Suppress scikit-learn unpickling version warnings (model 1.6.1 on sklearn 1.9.0)
try:
    from sklearn.exceptions import InconsistentVersionWarning
    warnings.filterwarnings("ignore", category=InconsistentVersionWarning)
except ImportError:
    warnings.filterwarnings("ignore", category=UserWarning)


app = Flask(__name__)
app.secret_key = os.urandom(24)

# ===============================
# Load Model & Encoders
# ===============================
model = joblib.load("water_usage_model.pkl")
le_usage = joblib.load("label_encoder.pkl")
le_source = joblib.load("source_encoder.pkl")
le_season = joblib.load("season_encoder.pkl")

@app.route('/')
def home():
    # Home routing - renders the landing page (index.html), showing hero section and navigation
    return render_template('index.html', show_form=False)

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        try:
            # 1. Extract inputs from submission
            ph = float(request.form.get('ph', 7.0))
            tds = float(request.form.get('tds', 500.0))
            turbidity = float(request.form.get('turbidity', 5.0))
            do = float(request.form.get('do', 7.0))
            bod = float(request.form.get('bod', 2.0))
            cod = float(request.form.get('cod', 20.0))
            nitrate = float(request.form.get('nitrate', 20.0))
            fluoride = float(request.form.get('fluoride', 1.0))
            hardness = float(request.form.get('hardness', 200.0))
            ec = float(request.form.get('ec', 800.0))
            temp = float(request.form.get('temp', 28.0))
            rainfall = float(request.form.get('rainfall', 100.0))
            source = request.form.get('source', 'River')
            season = request.form.get('season', 'Summer')

            # 2. Encode source and season
            source_encoded = le_source.transform([source])[0]
            season_encoded = le_season.transform([season])[0]

            # 3. Create DataFrame (note key 'Temp' matches training data schema)
            data = pd.DataFrame({
                "pH": [ph],
                "TDS": [tds],
                "Turbidity": [turbidity],
                "DO": [do],
                "BOD": [bod],
                "COD": [cod],
                "Nitrate": [nitrate],
                "Fluoride": [fluoride],
                "Hardness": [hardness],
                "EC": [ec],
                "Temp": [temp],
                "Rainfall": [rainfall],
                "Source": [source_encoded],
                "Season": [season_encoded]
            })

            # 4. Make Machine Learning prediction & confidence levels
            prediction = model.predict(data)
            probabilities = model.predict_proba(data)
            
            result_decoded = le_usage.inverse_transform(prediction)[0]
            classes = le_usage.classes_.tolist()
            probs_list = probabilities[0].tolist()
            
            # Match each class with its predicted probability percentage
            confidence_map = []
            for cls, prob in zip(classes, probs_list):
                confidence_map.append({
                    "class": cls,
                    "prob": round(prob * 100, 2),
                    "prob_decimal": float(prob)
                })
            
            # Sort confidence descending
            confidence_map = sorted(confidence_map, key=lambda x: x['prob'], reverse=True)

            # 5. Water Quality Index (WQI) Score Calculation (retaining exact limits logic from app.py)
            score = 100.0
            if ph < 6.5 or ph > 8.5:
                score -= 10
            if tds > 500:
                score -= min((tds - 500) / 50.0, 20.0)
            if turbidity > 5:
                score -= min((turbidity - 5.0) * 2.0, 15.0)
            if do < 6:
                score -= min((6.0 - do) * 5.0, 20.0)
            if bod > 2:
                score -= min((bod - 2.0) * 3.0, 15.0)
            if cod > 10:
                score -= min((cod - 10.0) / 2.0, 10.0)
            if nitrate > 45:
                score -= 10
            if fluoride > 1.5:
                score -= min((fluoride - 1.5) * 10.0, 20.0)
            if hardness > 300:
                score -= 10
            if ec > 750:
                score -= min((ec - 750) / 50.0, 10.0)
                
            score = max(0.0, min(score, 100.0))
            score = round(score, 1)

            # WQI Category matching & recommendation
            if score >= 90:
                recommendation = "Drinking"
                quality_status = "Excellent"
                status_class = "wqi-excellent"
            elif score >= 70:
                recommendation = "Domestic"
                quality_status = "Good"
                status_class = "wqi-good"
            elif score >= 50:
                recommendation = "Irrigation"
                quality_status = "Moderate"
                status_class = "wqi-moderate"
            elif score >= 30:
                recommendation = "Industrial"
                quality_status = "Poor"
                status_class = "wqi-poor"
            else:
                recommendation = "No Use"
                quality_status = "Very Poor"
                status_class = "wqi-unsuitable"

            # 6. Generate detailed feedback messages for the recommendation card
            reasons = []
            suggestions = []

            if 6.5 <= ph <= 8.5:
                reasons.append(f"Safe pH level ({ph})")
            else:
                suggestions.append(f"Unsafe pH level of {ph} (Ideal: 6.5 - 8.5)")

            if tds <= 500:
                reasons.append(f"Moderate TDS ({tds} mg/L)")
            else:
                suggestions.append(f"High TDS of {tds} mg/L (Ideal: < 500 mg/L)")

            if turbidity <= 5:
                reasons.append(f"Acceptable Turbidity ({turbidity} NTU)")
            else:
                suggestions.append(f"High turbidity of {turbidity} NTU (Ideal: < 5 NTU)")

            if do >= 6:
                reasons.append(f"Acceptable DO ({do} mg/L)")
            else:
                suggestions.append(f"Low DO level of {do} mg/L (Ideal: > 6 mg/L)")

            if bod <= 2:
                reasons.append(f"Low organic pollution (BOD: {bod} mg/L)")
            else:
                suggestions.append(f"High BOD level of {bod} mg/L (Ideal: < 2 mg/L)")

            if cod <= 10:
                reasons.append(f"Safe COD levels ({cod} mg/L)")
            else:
                suggestions.append(f"High COD of {cod} mg/L (Ideal: < 10 mg/L)")

            if nitrate <= 45:
                reasons.append(f"Safe Nitrate concentration ({nitrate} mg/L)")
            else:
                suggestions.append(f"Dangerous Nitrate levels ({nitrate} mg/L) exceeded")

            if fluoride <= 1.5:
                reasons.append(f"Safe fluoride levels ({fluoride} mg/L)")
            else:
                suggestions.append(f"Fluoride at {fluoride} mg/L (Ideal: < 1.5 mg/L)")

            if hardness <= 300:
                reasons.append(f"Soft to moderate water hardness ({hardness} mg/L)")
            else:
                suggestions.append(f"Excessive water hardness ({hardness} mg/L)")

            if ec <= 750:
                reasons.append(f"Normal electrical conductivity ({ec} µS/cm)")
            else:
                suggestions.append(f"High conductivity ({ec} µS/cm) indicates saline content")

            # Collate data structure
            result_data = {
                'inputs': {
                    'ph': ph, 'tds': tds, 'turbidity': turbidity, 'do': do, 'bod': bod, 'cod': cod,
                    'nitrate': nitrate, 'fluoride': fluoride, 'hardness': hardness, 'ec': ec,
                    'temp': temp, 'rainfall': rainfall, 'source': source, 'season': season
                },
                'prediction': result_decoded,
                'confidence': confidence_map,
                'wqi': {
                    'score': score,
                    'status': quality_status,
                    'status_class': status_class,
                    'recommendation': recommendation,
                    'reasons': reasons[:4],         # Cap reports to keep layout clean
                    'suggestions': suggestions[:4]  # Cap reports to keep layout clean
                }
            }

            # Save in session for persistence
            session['last_result'] = result_data
            session.modified = True

            return render_template('result.html', data=result_data, source_classes=le_source.classes_.tolist(), season_classes=le_season.classes_.tolist())

        except Exception as e:
            return f"An error occurred: {str(e)}", 400

    # GET request routing
    # Force new state if ?new=true
    if request.args.get('new') == 'true':
        session.pop('last_result', None)

    # Route request.args.get('view') == 'dashboard' 
    if request.args.get('view') == 'dashboard':
        if 'last_result' in session:
            return render_template('result.html', data=session['last_result'], source_classes=le_source.classes_.tolist(), season_classes=le_season.classes_.tolist())
        else:
            return render_template('index.html', show_form=True, notification="Please run a water usage prediction first to view the dashboard.")

    # Show prediction form page (part of index template)
    return render_template('index.html', show_form=True, source_classes=le_source.classes_.tolist(), season_classes=le_season.classes_.tolist())

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    # Run Flask app, binding to PORT environment variable for easy hosting compatibility (Render, railway, Heroku, etc.)
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False)