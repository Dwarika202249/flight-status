# Flight Dashboard Notification System

## Overview
The Flight Dashboard Notification System is a web application designed to help administrators manage flight statuses and notify subscribed users via SMS and email about updates. The project aims to streamline communication between the airline and passengers, ensuring they are informed about changes to their flight statuses and gate numbers in real-time.

## Technologies Used
- **Frontend:** React, CSS
- **Backend:** Flask, pymongo, smtplib, Twilio API
- **Database:** MongoDB
- **Notifications:** Twilio (SMS), smtplib (Email)

## Features
1. **Flight Dashboard:**
   - Displays a list of flights with their statuses.
   - Users can subscribe to specific flights to receive status updates.

2. **Admin Panel:**
   - Allows admins to update flight statuses and gate numbers.
   - Triggers notifications to subscribed users upon status change.
   - Admin Credentials: admin password

3. **Notifications:**
   - SMS notifications using Twilio API.
   - Email notifications using smtplib and Gmail SMTP server.

## Challenges Faced
1. **Integration with Twilio for SMS Notifications:**
   - Initial issues with invalid phone numbers and country code formatting.
   - Resolved by ensuring correct formatting and using Twilio’s verification system.

2. **Sending Emails via Gmail:**
   - Faced authentication errors due to Google’s security settings.
   - Implemented app-specific passwords and ensured proper SMTP configuration.

3. **Frontend and Backend Coordination:**
   - Ensuring seamless communication between React frontend and Flask backend.
   - Managed CORS issues and proper API endpoint handling.

4. **Dynamic UI Enhancements:**
   - Made the UI responsive and visually appealing.
   - Implemented color-coded flight status and popup forms for subscription.

## Improvements and Enhancements
- Enhanced notification messages to include gate numbers and formatted them for better readability.
- Made the admin panel more user-friendly with dropdowns and input fields.
- Updated the flight list to be scrollable within the viewport and color-coded based on status.

## Future Enhancements
- Implement user authentication for added security.
- Add more detailed flight information such as departure and arrival times.
- Include more notification options like push notifications.

## Conclusion
The Flight Dashboard Notification System effectively bridges the communication gap between airlines and passengers by providing real-time updates on flight statuses and gate numbers. The project showcases the integration of modern web technologies to create a functional and user-friendly application.

## Author
Dwarika (Aspiring Full-Stack Developer)

## Date
July 2024
