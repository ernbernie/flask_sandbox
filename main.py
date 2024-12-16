from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
import os

# Initialize Flask app
app = Flask(__name__)

# Load environment variables securely from .env file
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# ------------------------ ROUTES ------------------------

@app.route('/')
def home():
    """
    Renders the home page of the application.

    This route returns the 'home.html' template which includes the 
    UI for the slideshow and prayer submission form.
    """
    return render_template('home.html')


@app.route('/submit-prayer', methods=['POST'])
def submit_prayer():
    try:
        # Log the request for debugging
        print(f"Request method: {request.method}")
        print(f"Request JSON: {request.json}")

        data = request.json
        prayer = data.get('prayer', '')

        if not prayer:
            return jsonify({'error': 'No prayer provided'}), 400

        # API call to OpenAI ChatCompletion with additional parameters
        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Ensure the model name matches your access
            messages=[
                {
                    "role": "system", 
                    "content": (
                        "Speak with a gentle, pastoral voice that reveals a fitting Bible verse first. "
                        "Then, identify the user's deeper spiritual yearning and address it with empathy. "
                        "Next, craft a brief spiritual analogy or narrative inspired by the verse, illustrating divine wisdom at work. "
                        "Finally, offer a set of actionable spiritual habits or practices that naturally emerge from the narrative, "
                        "guiding the user closer to God. Never label or number these parts—simply weave them seamlessly into one cohesive, uplifting response."
                    )
                },
                {"role": "user", "content": prayer}
            ],
            temperature=0.4,  # Controls randomness of response
            max_tokens=250    # Sets the max response length
        )

        print(f"Full API Response: {chat_completion}")


        # Extract response content
        output = chat_completion.choices[0].message.content.strip()
        return jsonify({'response': output})

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log any exceptions
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500


# ------------------------ MAIN ------------------------

if __name__ == '__main__':
    """
    Runs the Flask development server.

    - debug=True enables live reload during development.
    """
    app.run(debug=True)
