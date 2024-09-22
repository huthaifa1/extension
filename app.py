from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory list to store URLs (for now)
saved_urls = []

# Route to handle POST requests from the Chrome extension
@app.route('/api/receive-urls', methods=['POST'])
def receive_urls():
    data = request.get_json()
    urls = data.get('urls', [])

    # Append only unique URLs to the saved_urls list
    for url in urls:
        if not any(saved_url['url'] == url['url'] for saved_url in saved_urls):
            saved_urls.append(url)

    print("Current saved URLs:", saved_urls)  # Debugging purposes

    # Return a success message
    return jsonify({
        'message': 'URLs received and saved successfully',
        'urls': urls
    })

# Route to retrieve the saved URLs (for the frontend)
@app.route('/api/get-urls', methods=['GET'])
def get_urls():
    return jsonify(saved_urls)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)
