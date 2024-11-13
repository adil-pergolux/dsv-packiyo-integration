const express = require("express");
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
          "id": 1,
          "name": "DSV",
          "carrier_account": "DSV Logistcs",
          "methods": [
              { "name": "Road" },
              { "name": "Rail" },
              { "name": "Air" },
              { "name": "Sea" }
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
