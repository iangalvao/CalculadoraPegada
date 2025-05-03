from flask import Flask
from flask_socketio import SocketIO, emit
import requests

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def home():
    return "Flask-SocketIO server running!"

# send this from barcode handler
@app.route("/scan/<code>")
def simulate_scan(code):
    print(f"Simulating scan with code: {code}")
    socketio.emit("barcode_scanned", {"code": code})
    return {"status": "sent"}
    

@app.post("/footprint")
def proxy_footprint():
    data = request.json
    try:
        r = requests.post("http://localhost:8080/footprint", json=data, timeout=10)
        return jsonify(r.json()), r.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5174)
