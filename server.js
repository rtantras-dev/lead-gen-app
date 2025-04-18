const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const uuid = require('uuid');
const cors = require('cors');

const app = express();

// Use dynamic port for Heroku or fallback to 3000 for local development
const PORT = process.env.PORT || 3000;

app.use(cors());  // Enable CORS to allow frontend to communicate with the server
app.use(bodyParser.json());  // To parse JSON bodies

// GA4 Measurement Protocol details
const MEASUREMENT_ID = 'G-8LT2WWTHY6';  // Replace with your GA4 Measurement ID
const API_SECRET = 'h8xBnaQqSQOmed3VaQwScg';    // Replace with your API Secret from GA4

// Endpoint to handle form submission
app.post('/submit', async (req, res) => {
    const { name, email } = req.body;

    // Generate a unique client ID (this can be a real user ID in production)
    const client_id = uuid.v4();

    // Prepare event data to send to GA4
    const eventData = {
        client_id: client_id,
        events: [
            {
                name: 'lead_submission',  // Event name
                params: {
                    user_name: name,  // User's name
                    user_email: email, // User's email
                },
            },
        ],
    };

    try {
        // Send the event data to GA4 using Measurement Protocol
        await axios.post(
            `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
            eventData
        );

        // Respond to the frontend with a success message
        res.json({ message: 'Lead submitted successfully and sent to GA4!' });
    } catch (error) {
        console.error('Error sending data to GA4:', error);
        res.status(500).json({ message: 'Error sending data to GA4' });
    }
});

// Start the Node.js server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
