from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from calculo_medias import (
    calculate_watts,
    calculate_meat,
)
import requests

app = Flask(__name__)
CORS(app, cors_allowed_origins="*")  # Enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def home():
    return "Flask-SocketIO server running!"

# send this from barcode handler
@app.route("/scan/<code>")
def simulate_scan(code):
    print(f"!!!Read some code: {code}")
    socketio.emit("barcode_scanned", {"code": code})
    return {"status": "sent"}
    

@app.post("/footprint")
def proxy_footprint():

    print("!!!Footprint endpoint called")
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON received"}), 400

    estate = data.get("estate", "DF")
    transport = data.get("transport", "ONIBUS")
    secondary_transport = data.get("secondary_transport",   [])
    food = data.get("food", "SOJA")
    secondary_food = data.get("secondary_food", [])
    appliances = data.get("appliances", [])


    print(f"Received data: {data}")
    print(f"Appliances: {appliances}")
    print(f"Transport: {transport}")
    print(f"Secondary Transport: {secondary_transport}")
    print(f"Food: {food}")
    print(f"Secondary Food: {secondary_food}")


    if not appliances:
        appliances = []
    if not secondary_food:
        secondary_food = []
    if not secondary_transport:
        secondary_transport = []
    if not food:
        food = "SOJA"
    if not transport:
        transport = "ONIBUS"
    if not estate:
        estate = "DF"


    watts = calculate_watts(appliances)
    #calcuate_fuel(transport, secondary_transport)
    foods = calculate_meat(food, secondary_food)

    data = {
        "estado": estate,
        "kwh_mes": 250,
        "gas": 10,
        "boi": foods["CARNE DE BOI"],
        "porco": foods["CARNE DE PORCO"],
        "frango": foods["FRANGO"],
    }
    try:
        r = requests.post("http://localhost:8080/footprint", json=data, timeout=10)
        return jsonify(r.json()), r.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5174, debug=True)
