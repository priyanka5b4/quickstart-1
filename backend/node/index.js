const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const plaid_service = require("./plaid_service");
const db_service = require("./db_service");
const db = require("./core/dbLib/db.connect");
const Item = require("./modules/Items/Item.model");
const Account = require("./modules/Accounts/account.model");
const transactionRoutes = require("./modules/Transactions/transaction.routes");

db.connect(true);

require("dotenv").config();
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions").split(
  ","
);

let ACCESS_TOKEN = null;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

app.use("/api/transactions", transactionRoutes);

app.post("/api/info", function (request, response, next) {
  response.json({
    products: PLAID_PRODUCTS,
  });
});

app.post("/api/create_link_token", async function (request, response, next) {
  try {
    plaid_service.createLinkToken().then((res) => {
      // prettyPrintResponse(res);
      return response.json(res.data);
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/set_access_token", async function (request, response, next) {
  try {
    PUBLIC_TOKEN = request.body.public_token;
    plaid_service.setAccessToken(PUBLIC_TOKEN).then(async (res) => {
      // prettyPrintResponse(res.data);
      console.log(res.data);
      ACCESS_TOKEN = res.data.access_token;

      // Inserting account details
      await db_service.InsertNewItemDetails(
        res.data.item_id,
        res.data.access_token
      );

      // inserting transaction details
      await db_service.InsertTransactionDetails(res.data.access_token);

      return response.json(res.data);
    });
  } catch (err) {
    console.log(err);
  }
});

// app.get('/api/transactions', function (request, response, next) {
//   try {
//     console.log(ACCESS_TOKEN);
//     plaid_service.getTransactions(ACCESS_TOKEN).then((res) => {
//       // prettyPrintResponse(res.data);
//       //console.log(res);
//       return response.json(res);
//     });
//   } catch (err) {
//     // console.log(err);
//   }
// });

app.get("/api/institutions", async (req, res) => {
  try {
    const items = await Item.find({});
    const itemIds = items.map((item) => item.item_id);

    const accounts = await Account.find({ item_id: { $in: itemIds } });
    const institutionsWithAccounts = items.map((item) => ({
      ...item._doc,
      accounts: accounts.filter(
        (acc) => acc.item_id.toString() === item.item_id.toString()
      ),
    }));

    res.json(institutionsWithAccounts);
  } catch (error) {
    res.status(500).send(error);
  }
});
