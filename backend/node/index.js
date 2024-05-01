const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const plaid_service = require('./plaid_service');
const db_service = require('./db_service');
const db = require('./core/dbLib/db.connect');

db.connect(true);

require('dotenv').config();
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(
  ',',
);

let ACCESS_TOKEN = null;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

app.post('/api/info', function (request, response, next) {
  response.json({
    products: PLAID_PRODUCTS,
  });
});

app.post('/api/create_link_token', async function (request, response, next) {
  try {
    plaid_service.createLinkToken().then((res) => {
      // prettyPrintResponse(res);
      return response.json(res.data);
    });
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/set_access_token', function (request, response, next) {
  try {
    PUBLIC_TOKEN = request.body.public_token;
    plaid_service.setAccessToken(PUBLIC_TOKEN).then((res) => {
      // prettyPrintResponse(res.data);

      ACCESS_TOKEN = res.data.access_token;

      // Inserting account details
      // db_service.InsertNewItemDetails(res.data.item_id, res.data.access_token);

      // inserting transaction details
      // db_service.InsertTransactionDetails(res.data.access_token);

      return response.json(res.data);
    });
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/transactions', function (request, response, next) {
  try {
    console.log(ACCESS_TOKEN);
    plaid_service.getTransactions(ACCESS_TOKEN).then((res) => {
      // prettyPrintResponse(res.data);
      console.log(res);
      return response.json(res);
    });
  } catch (err) {
    console.log(err);
  }
});
