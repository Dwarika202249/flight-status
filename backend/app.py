from flask import Flask, jsonify, request
from pymongo import MongoClient
# from flightdata import flights
from flask_cors import CORS
from twilio.rest import Client
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client.flight_dashboard
flights_collection = db.flights
subscriptions_collection = db.subscriptions

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# flights_collection.insert_many(flights)

@app.route('/flights', methods=['GET'])
def get_flights():
    flights = flights_collection.find()
    flight_list = []
    for flight in flights:
        flight['_id'] = str(flight['_id'])  # Convert ObjectId to string
        flight_list.append(flight)
    return jsonify(flight_list)

@app.route('/subscribe', methods=['POST'])
def subscribe():
    data = request.json
    user_id = data.get('user_id')
    flight_number = data.get('flight_number')
    email = data.get('email')
    phone = data.get('phone', '')  # Default to empty string if phone not provided

    if not email:
        return jsonify({"error": "Email is required!"}), 400

    subscription = {
        "user_id": user_id,
        "flight_number": flight_number,
        "email": email,
        "phone": phone
    }

    result = subscriptions_collection.insert_one(subscription)

    return jsonify({"message": "Subscription added successfully", "id": str(result.inserted_id)})

def format_phone_number(phone):
    if not phone.startswith('+'):
        # Add default country code, for example +91 for India
        phone = '+91' + phone
    return phone

def send_sms(to, message):
    # Ensure credentials are loaded
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_PHONE_NUMBER:
        print("Twilio credentials are missing.")
        return
    to = format_phone_number(to)
    try:
        print(f"SMS sent to {to}")
        twilio_client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to
        )
        print(f"SMS sent to {to}")
    except Exception as e:
        print(f"Failed to send SMS: {e}")

@app.route('/update_flight_status', methods=['POST'])
def update_flight_status():
    data = request.json
    flight_number = data.get('flight_number')
    new_status = data.get('status')

    flights_collection.update_one(
        {"flight_number": flight_number},
        {"$set": {"status": new_status}}
    )

    subscriptions = subscriptions_collection.find({"flight_number": flight_number})
    for subscription in subscriptions:
        message = f"Flight {flight_number} status has changed to {new_status}."
        if subscription['phone']:
            send_sms(subscription['phone'], message)

    return jsonify({"message": "Flight status updated and notifications sent."})

if __name__ == '__main__':
    app.run(debug=True)
