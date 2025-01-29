require("dotenv").config();
const axios = require("axios");
const fs = require('fs');
const path = require('path');
const logger = require("./logger"); // Import logger

const createShipmentLabel = async (bookingID) => {
    const token = process.env.DSV_TOKEN;
    const subscriptionKey = process.env.DSV_SUBSCRIPTION_KEY_LABEL;
    const dsvURL = process.env.DSV_URL;
    try {
        const response = await axios.get(dsvURL + 'printing/v1/labels/' + bookingID, {
            responseType: "stream", // Get response as a stream
            headers: {
                'Content-Type': 'application/json',
                'DSV-Service-Auth': token,
                'DSV-Subscription-Key': subscriptionKey
            }
    });
    // Define the file path
        const pdfPath = path.join(__dirname, "shipping-labels", bookingID + "-labels.pdf");

        return new Promise((resolve, reject) => {
            // Create write stream to save file
            const writer = fs.createWriteStream(pdfPath);
            response.data.pipe(writer);

            writer.on("finish", () => {
                resolve({
                    message: "PDF created successfully",
                    downloadUrl: `http://localhost:3002/shipping-labels/${bookingID}-labels.pdf`,
                });
            });

            writer.on("error", (err) => {
                logger.error(`�� Error creating PDF: ${error.response?.data || error.message}`);
                console.error("❌ Error saving PDF:", err);
                reject(err);
            });
        });
    } catch(error) {
        logger.error(`Error creating label with DSV: ${error.response?.data || error.message}`);
        console.error('Error fetching test API response:', error);
    }
}

module.exports = { createShipmentLabel };