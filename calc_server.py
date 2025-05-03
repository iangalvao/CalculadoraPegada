from flask import Flask, request, jsonify
from seeg_calc_lo import calculate

app = Flask(__name__)

@app.post("/footprint")
def footprint():
    data = request.json
    try:
        result = calculate(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)