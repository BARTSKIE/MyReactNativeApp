// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ⚠️ Use your PayMongo Test Secret Key here
const PAYMONGO_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// API endpoint for creating GCash source
app.post("/create-gcash", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/sources",
      {
        data: {
          attributes: {
            amount: req.body.amount, // must be in centavos
            currency: "PHP",
            type: "gcash",
            redirect: {
              success: "https://example.com/payment-success",
              failed: "https://example.com/payment-failed"
            }
          }
        }
      },
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(PAYMONGO_SECRET_KEY + ":").toString("base64"),
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("GCash Error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || "Error creating GCash source"
    });
  }
});

// Start backend
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
// To test, run: node server.js