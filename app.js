const express = require("express");
const axios = require('axios');
const { Pool } = require('pg');
const app = express();
app.use(express.json()); // Middleware to parse JSON payloads
const port = process.env.PORT || 3001;

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'root',
  host: 'dpg-csqch6bqf0us73c1tnmg-a',
  database: 'dsvpackiyo',
  password: 'BBDHYHUAXOcEtTjRQ6cfwLrQwLKuLQ3V',
  port: 5432,
});

app.get("/", (req, res) => res.type('html').send(html));


// List carriers in Packiyo
app.get('/api/pgx-carriers', (req, res) => {
  const carriers = [
      {
          "id": 20,
          "name": "DSV",
          "carrier_account": "DSV Logistcs",
          "methods": [
              { "name": "Road" }
          ]
      }
  ];
  // Send response as JSON
  res.json(carriers);
});

// Create Shipment Label, receive payload from Packiyo
app.post('/api/pgx-create-booking-lable', async (req, res) => {
  const requestBody = req.body;
  const requestHeaders = req.headers;

  sendBookingRequest();

  try {
    // Insert data into PostgreSQL
    const queryText = `
      INSERT INTO requests (request_body, request_headers)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const values = [requestBody, requestHeaders];

    const result = await pool.query(queryText, values);
    res.status(200).send(`Request saved with ID: ${result.rows[0].id}`);
  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).send('Error saving request data');
  }

  const shipmentLabel = [
    {
      "id": "1234",
      "total_cost": 0,
      "labels": [
          {
              "package_number": 1,
              "label_url": "http://shipping-label-1-url.pdf",
              "cost": 0,
              "tracking_links": {
                  "number": "1234--172807432632",
                  "link": ""
              }
          }
      ]
    }
  ];
  res.json(shipmentLabel);
});

async function sendBookingRequest() {
  const url = 'https://api.dsv.com/my/booking/v2/bookings';
  const token = 'Basic YWRpbC5hbGlAcGVyZ29sdXguZGU6UGVyZ29sdXhAMzQyMDI=';
  const subscriptionKey = 'b0c3e5ebcc694871a8c3c610006b9d30';
  
  const payload = {
    "autobook": true,
    "templateName": "",
    "parties": {
      "sender": {
        "address": {
          "companyName": "New Test Company Name Inc.",
          "addressId": "AddressID123",
          "addressLine1": "Test Address Line 1",
          "city": "Test Address City",
          "countryCode": "DK",
          "zipCode": "1234"
        },
        "contact": {
          "name": "Test Name",
          "email": "testemail@testcompany.com",
          "telephone": "+4512345678"
        }
      },
      "receiver": {
        "address": {
          "companyName": "Receiver Company Inc.",
          "addressLine1": "Receiver Address Line 1",
          "city": "Receiver City",
          "countryCode": "US",
          "zipCode": "5678"
        },
        "contact": {
          "name": "Receiver Contact",
          "email": "receiver@testcompany.com",
          "telephone": "+11234567890"
        }
      },
      "bookingParty": {
        "address": {
          "mdm": "7759231562"
        }
      }
    },
    "product": {
      "name": "Road"
    },
    "incoterms": {
      "code": "EXW",
      "location": "TestCityPickup1"
    },
    "packages": [
      {
        "quantity": 2,
        "packageType": "EUR",
        "totalWeight": 1900,
        "description": "NEw Goods 1",
        "shippingMarks": "Test Shipping Marks 1"
      }
    ],
    "references": [
      {
        "value": "Test Reference",
        "type": "SHIPPER_REFERENCE"
      }
    ]
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'DSV-Service-Auth': token,
        'DSV-Subscription-Key': subscriptionKey
      }
    });

    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render Test!
    </section>
  </body>
</html>
`
