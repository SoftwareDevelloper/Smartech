import sys
import pandas as pd
import numpy as np
import joblib
import json
import os
import datetime
import matplotlib.pyplot as plt
import logging

# Define level names mapping
LEVEL_NAMES = {
    "0": "Beginner",
    "1": "Intermediate",
    "2": "Advanced"
}

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Performance thresholds for perfect scores
PERFORMANCE_THRESHOLDS = {
    'time_per_question': {  # seconds per question
        'Advanced': 3,
        'Intermediate': 6
    },
    'consecutive_correct': {  # ratio of longest streak to total questions
        'Advanced': 0.8,
        'Intermediate': 0.5
    }
}

def load_model_assets():
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        pipeline_path = os.path.join(base_dir, 'level_classifier_pipeline_new.pkl')
        le_path = os.path.join(base_dir, 'label_encoder_new.pkl')
        features_path = os.path.join(base_dir, 'feature_columns_new.pkl')

        logging.info(f"Loading models from: {base_dir}")

        pipeline = joblib.load(pipeline_path)
        le = joblib.load(le_path)
        feature_columns = joblib.load(features_path)
        return pipeline, le, feature_columns
    except Exception as e:
        logging.error(f"Model loading failed: {str(e)}")
        print(json.dumps({"error": f"Model loading failed: {str(e)}"}), file=sys.stderr)
        sys.exit(1)

def get_interpretation(level, confidence):
    if confidence > 0.7:
        return {
            "certainty": "high",
            "color": "green"
        }
    elif confidence > 0.5:
        return {
            "certainty": "moderate",
            "color": "orange"
        }
    else:
        return {
            "certainty": "low",
            "color": "red"
        }

def plot_probabilities(prob_dict, output_dir):
    try:
        plt.figure(figsize=(8, 4))
        bars = plt.bar(prob_dict.keys(), prob_dict.values(),
                      color=['#4CAF50', '#FFC107', '#F44336'])

        plt.title('Level Probability Distribution', pad=20)
        plt.ylabel('Probability')
        plt.ylim(0, 1)

        for bar in bars:
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width() / 2., height,
                    f'{height:.2f}', ha='center', va='bottom')

        plot_path = os.path.join(output_dir, 'level_prediction.png')
        plt.savefig(plot_path, bbox_inches='tight', dpi=100)
        plt.close()
        return plot_path
    except Exception as e:
        logging.warning(f"Could not generate plot: {str(e)}")
        return None

def adjust_prediction_for_perfect_scores(data, predicted_level, probabilities):
    """Adjust prediction when user gets perfect score but is classified too low"""
    if data['accuracy'] == 1.0:  # Only adjust for perfect scores
        time_per_question = data['timeTaken'] / data['numCorrect']
        consec_ratio = data['consecutiveCorrect'] / data['numCorrect']
        
        # Check for Advanced performance
        if (time_per_question <= PERFORMANCE_THRESHOLDS['time_per_question']['Advanced'] and
            consec_ratio >= PERFORMANCE_THRESHOLDS['consecutive_correct']['Advanced']):
            return "2", 0.9  # Override to Advanced with high confidence
        
        # Check for Intermediate performance
        elif (time_per_question <= PERFORMANCE_THRESHOLDS['time_per_question']['Intermediate'] and
              consec_ratio >= PERFORMANCE_THRESHOLDS['consecutive_correct']['Intermediate']):
            return "1", 0.75  # Override to Intermediate with moderate confidence
    
    return predicted_level, max(probabilities)

def predict(input_data):
    try:
        pipeline, le, feature_columns = load_model_assets()

        # Validate input data
        if not all(k in input_data for k in ['numCorrect', 'accuracy', 'timeTaken', 'schoolLevel', 'subject', 'consecutiveCorrect']):
            error_msg = {"error": "Missing required input data fields"}
            logging.error(error_msg["error"])
            print(json.dumps(error_msg), file=sys.stderr)
            sys.exit(1)

        try:
            data = {
                'numCorrect': max(0, float(input_data['numCorrect'])),
                'accuracy': min(max(0, float(input_data['accuracy'])), 1.0),
                'timeTaken': max(1, float(input_data['timeTaken'])),
                'schoolLevel': input_data['schoolLevel'],
                'subject': input_data['subject'],
                'consecutiveCorrect': max(0, float(input_data['consecutiveCorrect']))
            }
        except ValueError as e:
            error_msg = {"error": f"Invalid numeric input: {str(e)}"}
            logging.error(error_msg["error"])
            print(json.dumps(error_msg), file=sys.stderr)
            sys.exit(1)

        # Feature engineering
        df = pd.DataFrame([data])
        df['timePerQuestion'] = df['timeTaken'] / df['numCorrect'].replace(0, 1)
        df['speedScore'] = np.where(df['timePerQuestion'] < 5, 0.5, 1.0)
        df['efficiency'] = (df['numCorrect'] / (df['timeTaken'] / 60)) * df['speedScore']
        df['consistency'] = df['consecutiveCorrect'] / df['numCorrect'].replace(0, 1)

        # Prepare features for model
        df = pd.get_dummies(df)
        for col in feature_columns:
            if col not in df.columns:
                df[col] = 0
        df = df[feature_columns]

        # Get model prediction
        prediction = pipeline.predict(df)
        probabilities = pipeline.predict_proba(df)
        numeric_level = str(le.inverse_transform(prediction)[0])
        
        # Adjust prediction if needed for perfect scores
        numeric_level, confidence = adjust_prediction_for_perfect_scores(
            data, numeric_level, probabilities[0]
        )
        
        level_name = LEVEL_NAMES.get(numeric_level, "Unknown")
        status = "final" if confidence > 0.5 else "tentative"

        # Prepare probability distribution
        prob_dict = {
            LEVEL_NAMES.get(str(cls), "Unknown"): float(prob)
            for cls, prob in zip(le.classes_, probabilities[0])
        }
        # Ensure our adjusted level shows as most probable
        prob_dict[level_name] = max(prob_dict.values(), default=confidence)

        # Generate visualization
        output_dir = os.path.dirname(os.path.abspath(__file__))
        plot_path = plot_probabilities(prob_dict, output_dir)

        # Prepare final result
        result = {
            "metadata": {
                "timestamp": datetime.datetime.now().isoformat(),
                "model_version": "1.2",  # Updated version
                "script": os.path.basename(__file__)
            },
            "input_parameters": data,
            "prediction": {
                "numeric_level": numeric_level,
                "level": level_name,
                "confidence_score": confidence,
                "status": status,
                "probability_distribution": prob_dict
            },
            "interpretation": get_interpretation(level_name, confidence),
            "visualization": plot_path if plot_path else "Not available",
            "notes": "Perfect score adjustment applied" if data['accuracy'] == 1.0 else None
        }

        print(json.dumps(result, indent=2))

    except Exception as e:
        logging.error(f"Prediction failed: {str(e)}")
        print(json.dumps({
            "error": "Prediction failed",
            "details": str(e),
            "timestamp": datetime.datetime.now().isoformat()
        }), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    try:
        input_data = {
            'numCorrect': float(sys.argv[1]),
            'accuracy': float(sys.argv[2]),
            'timeTaken': float(sys.argv[3]),
            'schoolLevel': sys.argv[4],
            'subject': sys.argv[5],
            'consecutiveCorrect': float(sys.argv[6])
        }
        predict(input_data)
    except Exception as e:
        logging.error(f"Unhandled error: {str(e)}")
        print(json.dumps({"error": f"Unhandled error: {str(e)}"}), file=sys.stderr)
        sys.exit(1)