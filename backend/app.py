from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from twilio.rest import Client
from dotenv import load_dotenv
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
# from flightdata import flights

load_dotenv()

app = Flask(__name__)
CORS(app)

mongo_uri = os.getenv("MONGO_URI")

# MongoDB connection
# client = MongoClient("mongodb://localhost:27017/")
client = MongoClient(mongo_uri)
db = client.flight_dashboard
flights_collection = db.flights
subscriptions_collection = db.subscriptions

# flights_collection.insert_many(flights)

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Email configuration
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = os.getenv('SMTP_PORT')
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

@app.route('/flights', methods=['GET'])
def get_flights():
    flights = flights_collection.find()
    flight_list = []
    for flight in flights:
        flight['_id'] = str(flight['_id'])  # Convert ObjectId to string
        flight_list.append(flight)
    return jsonify(flight_list)

@app.route('/addflight', methods=['POST'])
def addflights():
    data = request.json
    flight_number = data.get('flight_number')
    status = data.get('status')
    departure_time = data.get('departure_time')
    arrival_time = data.get('arrival_time')
    gate = data.get('gate')
    
    if not flight_number:
        return jsonify({"error": "Flight no. is required!"}), 400
    
    if not status:
        return jsonify({"error": "Status is required!"}), 400
    
    if not gate:
        return jsonify({"error": "Gate is required!"}), 400
    
    flight = {
        "flight_number": flight_number,
        "status": status,
        "departure_time": departure_time,
        "arrival_time": arrival_time,
        "gate": gate,
    }
    
    result = flights_collection.insert_one(flight)
    
    return jsonify({"message": "New Flight added successfully", "id": str(result.inserted_id)})
    

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
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_PHONE_NUMBER:
        print("Twilio credentials are missing.")
        return
    to = format_phone_number(to)
    try:
        gate_info = f"Gate: {message['gate']}" if message['gate'] else ""
        formatted_message = f"🚨 Flight Update 🚨\n\nFlight {message['flight_number']} status has changed to {message['status']}.\n{gate_info}\n\nSafe travels!\n- Indigo Airlines"
        twilio_client.messages.create(
            body=formatted_message,
            from_=TWILIO_PHONE_NUMBER,
            to=to
        )
        print(f"SMS sent to {to}")
    except Exception as e:
        print(f"Failed to send SMS: {e}")

def send_email(to_email, flight_number, new_status, new_gate):
    try:
        gate_info = f"<p>Gate: <strong>{new_gate}</strong></p>" if new_gate else ""
        email_body = f"""
        <html>
        <body>
            <h2>Flight Status Update</h2>
            <p>Dear Customer,</p>
            <p>We wanted to inform you that the status of your flight <strong>{flight_number}</strong> has changed to <strong>{new_status}</strong>.</p>
            {gate_info}
            <p>We hope you have a pleasant journey!</p>
            <br>
            <p>Best Regards,</p>
            <p><strong>Indigo Airlines</strong></p>
        </body>
        </html>
        """
        msg = MIMEText(email_body, 'html')
        msg['Subject'] = f"Update: Flight {flight_number} Status Changed to {new_status}"
        msg['From'] = EMAIL_USER
        msg['To'] = to_email

        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_USER, to_email, msg.as_string())
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
        
@app.route('/gate_numbers', methods=['GET'])
def get_gate_numbers():
    gate_numbers = flights_collection.distinct('gate')  # Fetch unique gate numbers
    return jsonify(gate_numbers)



@app.route('/update_flight_status', methods=['POST'])
def update_flight_status():
    data = request.json
    flight_number = data.get('flight_number')
    new_status = data.get('status')
    new_gate = data.get('gate', '')  

    # Update flight details
    flights_collection.update_one(
        {"flight_number": flight_number},
        {"$set": {"status": new_status, "gate": new_gate}}
    )

    subscriptions = subscriptions_collection.find({"flight_number": flight_number})
    for subscription in subscriptions:
        if subscription['phone']:
            send_sms(subscription['phone'], {
                'flight_number': flight_number,
                'status': new_status,
                'gate': new_gate
            })
        if subscription['email']:
            send_email(subscription['email'], flight_number, new_status, new_gate)

    return jsonify({"message": "Flight status and gate updated, notifications sent."})


if __name__ == '__main__':
    app.run(debug=True)
