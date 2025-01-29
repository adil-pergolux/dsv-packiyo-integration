require("dotenv").config();
const express = require("express");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json()); // Middleware to parse JSON payloads

const transformPackiyoToDSV = require('./transform-data');
const packiyoPayload = require('./temp');
const { bookShipmentWithDSV } = require("./dsv-booking");
const { createShipmentLabel } = require("./dsv-label");
const sendEmail = require('./email-label'); // Import the sendEmail function
const logger = require("./logger"); // Import logger

const port = process.env.PORT || 3001;
const packiyoURL = 'https://api.packiyo.com/v1/';

// Serve static files from the 'shipping-labels' directory
app.use("/shipping-labels", express.static(path.join(__dirname, "shipping-labels")));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, 'frontend', 'index.html')));

// List external carriers from Packiyo
app.get('/api/pgx-external-carriers', (req, res) => {
// call to Packiyo's API to get list of existing external carriers
  axios.get('https://api.packiyo.com/v1/carriers')
  .then(response => {
    res.json(response.data.carriers);
  })
  .catch(error => {
    console.error('Error fetching carriers:', error);
    res.status(500).send('Error fetching carriers');
  });
});

// List carriers in Packiyo
app.get('/api/pgx-create-carriers', (req, res) => {
  const carriers = [
      {
          "id": 100,
          "name": "DSV",
          "carrier_account": "DSV Logistics",
          "methods": [
              { "name": "Road" }
          ]
      }
  ];
  // Send response as JSON
  res.json(carriers);
});


// Create Shipment Label, receive payload from Packiyo
app.post('/api/pgx-create-booking-label', async (req, res) => {
  const requestBody = req.body;
  const requestHeaders = req.headers;

  // Transform Packiyo payload to DSV payload
  const dsvPayload = transformPackiyoToDSV(requestBody);

  // Call DSV API to create label
  const bookingResponse = await bookShipmentWithDSV(dsvPayload);
  if (!bookingResponse.bookingId) {
    logger.error("Booking failed: No booking ID returned from DSV");
    throw new Error("Booking failed: No booking ID returned from DSV");
  }

  const labelResponse = await createShipmentLabel(bookingResponse.bookingId);

  const shipmentLabel = [
    {
        "id": requestBody.order_number,  
        "total_cost": 0,
        "labels": [
            {
                "package_number": 1,
                "label_url": labelResponse.downloadUrl || "N/A",
                "cost": 0,
                "tracking_links": {
                    "number": "N/A",
                    "link": ""
                }
            }
        ]
    }
  ];

  // Call function to send email after downloading PDF
  sendEmail(bookingResponse.bookingId);
  res.json({ success: true, data: shipmentLabel });
});

// call test api to download pdf file from DSV
app.get('/api/dsv-pdf-api-test', async(req, res) => {
  const token = process.env.DSV_TOKEN;
  const subscriptionKey = process.env.DSV_SUBSCRIPTION_KEY_LABEL;
  try {
    const response = await axios.get(process.env.DSV_URL + 'printing/v1/labels/40288888880000805175', {
      responseType: "stream", // Get response as a stream
      headers: {
        'Content-Type': 'application/json',
        'DSV-Service-Auth': token,
        'DSV-Subscription-Key': subscriptionKey
      }
    });
    // Define the file path
      const pdfPath = path.join(__dirname, "shipping-labels", "file.pdf");

      // Create write stream to save file
      const writer = fs.createWriteStream(pdfPath);
      response.data.pipe(writer);

      writer.on("finish", () => {
          console.log("PDF saved successfully.");
          res.send({
              message: "PDF downloaded successfully",
              downloadUrl: `http://localhost:${port}/files/file.pdf`
          });
      });

      writer.on("error", (err) => {
          console.error("Error saving PDF:", err);
          res.status(500).send("Error saving PDF.");
      });
  } catch(error) {
    console.error('Error fetching test API response:', error);
    res.status(500).send('Error fetching test API response');
  }
});



// Transform Data from Packiyo to DSV format
// const transformedData = transformPackiyoToDSV(packiyoPayload);
// console.log(transformedData);


const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;