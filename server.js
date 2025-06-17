const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let currentSalesId = 100000;
let currentPurchasesId = 100000;

const generateSales = (id) => ({
  orderNumber: `${id}`,
  client: "AgroFirm SRL",
  agent: "Ion Popescu",
  data: "17 Iunie 2025",
  zone: "Buzău",
  status: "Blocat",
  reason: "Credit expirat",
  responsive: "Elena Ionescu",
  lockDuration: "20 min",
  partialDelivery: "Da",
  totalBlockage: "40 min",
  orderDetails: [
    {
      positionNumber: "1",
      materialCode: "MAT-001",
      materialName: "Îngrășământ NP",
      quantity: "50",
      um: "kg",
      logisticUnity: "Pallet",
      stock: "120",
      warning: false,
    },
    {
      positionNumber: "2",
      materialCode: "MAT-002",
      materialName: "Semințe porumb",
      quantity: "30",
      um: "kg",
      logisticUnity: "Box",
      stock: "0",
      warning: true,
    },
  ],
});

const generatePurchases = (id) => ({
  orderNumber: `${id}`,
  client: "AgroFirm SRL",
  agent: "Ion Popescu",
  data: "17 Iunie 2025",
  zone: "Buzău",
  status: "Blocat",
  reason: "Credit expirat",
  responsive: "Elena Ionescu",
  lockDuration: "20 min",
  partialDelivery: "Da",
  totalBlockage: "40 min",
  orderDetails: [
    {
      positionNumber: "1",
      materialCode: "MAT-001",
      materialName: "Îngrășământ NP",
      quantity: "50",
      um: "kg",
      logisticUnity: "Pallet",
      stock: "120",
      warning: false,
    },
    {
      positionNumber: "2",
      materialCode: "MAT-002",
      materialName: "Semințe porumb",
      quantity: "30",
      um: "kg",
      logisticUnity: "Box",
      stock: "0",
      warning: true,
    },
  ],
});

let salesData = [];
let purchasesData = [];

for (let i = 0; i < 5; i++) {
  currentSalesId++;
  salesData.unshift(generateSales(currentSalesId));
}

for (let i = 0; i < 5; i++) {
  currentPurchasesId++;
  purchasesData.unshift(generatePurchases(currentPurchasesId));
}

app.get("/sales", (req, res) => {
  currentSalesId++;
  const newSale = generateSales(currentSalesId);
  salesData.unshift(newSale);
  res.json(salesData);
});

app.get("/purchases", (req, res) => {
  currentPurchasesId++;
  const newPurchase = generatePurchases(currentPurchasesId);
  purchasesData.unshift(newPurchase);
  res.json(purchasesData);
});

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
