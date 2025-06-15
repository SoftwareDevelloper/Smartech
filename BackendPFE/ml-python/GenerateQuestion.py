import sys
import json
import os
import openai
import logging
import datetime
import pandas as pd
import numpy as np
from time import perf_counter
from typing import Dict, List
# Configure OpenAI


openai.api_key = os.getenv("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")
QUESTION_GENERATION_MODEL = "gpt-4o-mini"

if not openai.api_key:
    logging.error("OPENAI_API_KEY environment variable not set.")
    sys.exit(1)
# Question configuration
QUESTION_CONFIG = {
    "Beginner": {
        "num_questions": 5,
        "complexity": "basic concepts with simple wording",
        "depth": "surface-level understanding"
    },
    "Intermediate": {
        "num_questions": 7,
        "complexity": "applied knowledge with moderate complexity",
        "depth": "practical application"
    },
    "Advanced": {
        "num_questions": 10,
        "complexity": "complex problem-solving scenarios",
        "depth": "deep conceptual understanding"
    }
}

def generate_ai_questions(level: str, subject: str, school_level: str) -> List[Dict]:
    """Generate AI-powered questions based on predicted level and subject"""
    try:
        start_time = perf_counter()
        
        prompt = f"""Generate {QUESTION_CONFIG[level]['num_questions']} {subject} questions for {school_level} students.
        Level: {level} ({QUESTION_CONFIG[level]['complexity']})
        Format: JSON array with fields: question_text, options (array), correct_answer, explanation
        Include {QUESTION_CONFIG[level]['depth']} depth.
        """
        
        response = openai.chat.completions.create(
            model=QUESTION_GENERATION_MODEL,
            messages=[{
                "role": "system",
                "content": "You are an expert educational content creator. Generate valid JSON output."
            }, {
                "role": "user",
                "content": prompt
            }],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        gen_time = perf_counter() - start_time
        logging.info(f"Generated {QUESTION_CONFIG[level]['num_questions']} questions in {gen_time:.2f}s")
        
        return json.loads(response.choices[0].message.content)['questions']
        
    except Exception as e:
        logging.error(f"Question generation failed: {str(e)}")
        return []

def predict(input_data):
    try:
        # Validate and process input data
        data = {
            'numCorrect': max(0, float(input_data['numCorrect'])),
            'accuracy': min(max(0, float(input_data['accuracy'])), 1.0),
            'timeTaken': max(1, float(input_data['timeTaken'])),
            'schoolLevel': input_data['schoolLevel'],
            'subject': input_data['subject'],
            'consecutiveCorrect': max(0, float(input_data['consecutiveCorrect']))
        }

        # Feature engineering
        df = pd.DataFrame([data])
        df['timePerQuestion'] = df['timeTaken'] / df['numCorrect'].replace(0, 1)
        df['speedScore'] = np.where(df['timePerQuestion'] < 5, 0.5, 1.0)
        df['efficiency'] = (df['numCorrect'] / (df['timeTaken'] / 60)) * df['speedScore']
        df['consistency'] = df['consecutiveCorrect'] / df['numCorrect'].replace(0, 1)

        # Generate AI questions
        ai_questions = generate_ai_questions(
            "Intermediate",  # Replace with actual level detection logic
            data['subject'],
            data['schoolLevel']
        )

        # Prepare and print result
        result = {
            "metadata": {
                "timestamp": datetime.datetime.now().isoformat(),
                "model_version": "1.2",
                "script": os.path.basename(__file__)
            },
            "input_parameters": data,
            "questions": ai_questions
        }
        print(json.dumps(result, indent=2))

    except Exception as e:
        error_msg = {"error": f"Invalid input: {str(e)}"}
        logging.error(error_msg["error"])
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    try:
        if len(sys.argv) != 7:
            raise ValueError("Usage: python GenerateQuestion.py <numCorrect> <accuracy> <timeTaken> <schoolLevel> <subject> <consecutiveCorrect>")
            
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