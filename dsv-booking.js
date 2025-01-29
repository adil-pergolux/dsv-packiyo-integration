require("dotenv").config();
const axios = require("axios");
const logger = require("./logger"); // Import logger

const bookShipmentWithDSV = async (payload) => {
    const dsvURL = process.env.DSV_URL + 'booking/v2/bookings';
    const token = process.env.DSV_TOKEN;
    const subscriptionKey = process.env.DSV_SUBSCRIPTION_KEY_BOOKING;
    
    try {
        const response = await axios.post(dsvURL, payload, {
        headers: {
            'Content-Type': 'application/json',
            'DSV-Service-Auth': token,
            'DSV-Subscription-Key': subscriptionKey
        }
        });
        return response.data; // Return API response
    } catch (error) {
        logger.error(`Error booking shipment with DSV: ${error.response?.data || error.message}`);
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

// Export the function to use in app.js
module.exports = { bookShipmentWithDSV };