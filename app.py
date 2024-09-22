from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS to allow cross-origin requests from your Chrome extension
CORS(app)

# Home route (for testing purposes)
@app.route('/')
def home():
    return "Welcome to the Flask Backend!"

# Create an endpoint to receive the URLs from the Chrome extension
@app.route('/api/receive-urls', methods=['POST'])
def receive_urls():
    data = request.get_json()
    urls = data.get('urls', [])

    # Log the received URLs for debugging
    print("Received URLs:", urls)

    # Return a success message with the received URLs
    return jsonify({
        'message': 'URLs received successfully',
        'urls': urls
    })

# Start the Flask server
if __name__ == '__main__':
    app.run(host='localhost', port=3000, debug=True)
