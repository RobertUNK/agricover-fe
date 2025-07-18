const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ordersPath = path.join(__dirname, "orders.json");
let ordersData = {};

const loadOrdersData = () => {
  try {
    const rawData = fs.readFileSync(ordersPath, "utf-8");
    ordersData = JSON.parse(rawData);
    console.log("orders.json a fost încărcat cu succes.");
  } catch (err) {
    console.error("Eroare la citirea orders.json:", err);
    ordersData = {};
  }
};

loadOrdersData();

app.get("/DASH_GET_ORDERS", (req, res) => {
  const { "sap-client": sapClient } = req.query;

  if (sapClient !== "220") {
    return res.status(400).json({ error: "Client SAP invalid" });
  }

  if (!ordersData.vanzari || !ordersData.achizitii) {
    return res.status(500).json({ error: "Datele nu sunt disponibile" });
  }

  res.json({
    vanzari: ordersData.vanzari,
    achizitii: ordersData.achizitii,
  });
});

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
