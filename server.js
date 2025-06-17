const express = require("express");
const cors = require("cors");
const { faker } = require("@faker-js/faker");

faker.locale = "ro"; // limba română (parțial suportată)

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let currentSalesId = 100000;
let currentPurchasesId = 100000;

const generateOrder = (id) => ({
  orderNumber: `${id}`,
  client: faker.company.name(),
  agent: faker.person.fullName(),
  data: faker.date.recent().toLocaleDateString("ro-RO"),
  zone: faker.location.city(),
  status: faker.helpers.arrayElement(["Blocat", "În așteptare", "Livrat"]),
  reason: faker.helpers.arrayElement([
    "Credit expirat",
    "Depășire termen plată",
    "Stoc insuficient",
  ]),
  responsive: faker.person.fullName(),
  lockDuration: `${faker.number.int({ min: 5, max: 45 })} min`,
  partialDelivery: faker.helpers.arrayElement(["Da", "Nu"]),
  totalBlockage: `${faker.number.int({ min: 10, max: 60 })} min`,
  orderDetails: [
    {
      positionNumber: "1",
      materialCode: `MAT-${faker.number.int({ min: 100, max: 999 })}`,
      materialName: faker.commerce.productName(),
      quantity: faker.number.int({ min: 10, max: 100 }).toString(),
      um: faker.helpers.arrayElement(["kg", "l", "buc"]),
      logisticUnity: faker.helpers.arrayElement(["Pallet", "Box", "Bag"]),
      stock: faker.number.int({ min: 0, max: 200 }).toString(),
      warning: faker.datatype.boolean(),
    },
    {
      positionNumber: "2",
      materialCode: `MAT-${faker.number.int({ min: 100, max: 999 })}`,
      materialName: faker.commerce.productName(),
      quantity: faker.number.int({ min: 10, max: 100 }).toString(),
      um: faker.helpers.arrayElement(["kg", "l", "buc"]),
      logisticUnity: faker.helpers.arrayElement(["Pallet", "Box", "Bag"]),
      stock: faker.number.int({ min: 0, max: 200 }).toString(),
      warning: faker.datatype.boolean(),
    },
  ],
});

const generateSales = generateOrder;
const generatePurchases = generateOrder;

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

  if (salesData.length >= 50) {
    salesData = [];
    for (let i = 0; i < 5; i++) {
      currentSalesId++;
      salesData.unshift(generateSales(currentSalesId));
    }
  } else {
    const newSale = generateSales(currentSalesId);
    salesData.unshift(newSale);
  }

  res.json(salesData);
});

app.get("/purchases", (req, res) => {
  currentPurchasesId++;

  if (purchasesData.length >= 50) {
    purchasesData = [];
    for (let i = 0; i < 5; i++) {
      currentPurchasesId++;
      purchasesData.unshift(generatePurchases(currentPurchasesId));
    }
  } else {
    const newPurchase = generatePurchases(currentPurchasesId);
    purchasesData.unshift(newPurchase);
  }

  res.json(purchasesData);
});

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
