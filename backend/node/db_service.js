const account_service = require('./modules/Accounts/account.service');
const Account = require('./modules/Accounts/account.model');
const Item = require('./modules/Items/Item.model');
const ItemService = require('./modules/Items/item.service');
const Transaction = require('./modules/Transactions/transaction.model');
const TransactionService = require('./modules/Transactions/transaction.service');
const plaidService = require('./plaid_service');

module.exports.InsertNewItemDetails = async (itemId, access_token) => {
  try {
    // Simulate async call to getAccountDetails with await
    const response = await plaidService.getAccountDetails(access_token);
    const accounts = response.data.accounts;

    // Inserting account details
    for (const account of accounts) {
      const newAccount = new Account({
        item_id: itemId,
        account_id: account.account_id,
        persistent_account_id: account.account_id,
        mask: account.mask,
        name: account.name,
        official_name: account.official_name,
        type: account.type,
        subtype: account.subtype,
        balances: account.balances,
      });

      try {
        await account_service.createAccount(newAccount);
        console.log(
          `Account details inserted in mongo db for account ID: ${account.account_id}`,
        );
      } catch (err) {
        console.error(
          `ERROR inserting account details for account ID: ${account.account_id} in mongo db: ${err}`,
        );
      }
    }

    // Inserting item details
    const item = response.data.item;
    const newItem = new Item({
      access_token: access_token,
      item_id: item.item_id,
      institution_id: item.institution_id,
      available_products: item.available_products,
      billed_products: item.billed_products,
      consent_expiration_time: item.consent_expiration_time,
    });

    try {
      await item_service.createItem(newItem);
      console.log(
        `Item details inserted in mongo db for item ID: ${item.item_id}`,
      );
    } catch (err) {
      console.error(
        `ERROR inserting item details for item ID: ${item.item_id} in mongo db: ${err}`,
      );
    }
  } catch (err) {
    console.error(
      `Error during InsertNewItemDetails function execution: ${err}`,
    );
  }
};

const addTransaction = async (transaction) => {
  try {
    await TransactionService.InsertTransaction(transaction);
    console.log(
      `Transaction details inserted in mongo db for transaction ID: ${transaction.transaction_id}`,
    );
  } catch (err) {
    console.error(
      `ERROR inserting transaction details for transaction ID: ${transaction.transaction_id} in mongo db: ${err}`,
    );
  }
};

const updateTransaction = async (transaction) => {
  try {
    await TransactionService.updateTransaction(transaction);
    console.log(
      `Transaction details updated in mongo db for transaction ID: ${transaction.transaction_id}`,
    );
  } catch (err) {
    console.error(
      `ERROR updating transaction details for transaction ID: ${transaction.transaction_id} in mongo db: ${err}`,
    );
  }
};

const removeTransaction = async (transaction_id) => {
  try {
    await TransactionService.deleteTransaction(transaction_id);
    console.log(
      `Transaction details deleted from mongo db for transaction ID: ${transaction_id}`,
    );
  } catch (err) {
    console.error(
      `ERROR deleting transaction details for transaction ID: ${transaction_id} in mongo db: ${err}`,
    );
  }
};

module.exports.InsertTransactionDetails = async (access_token) => {
  Promise.resolve().then(async function () {
    // Set cursor to empty to receive all historical updates
    let cursors = await TransactionService.getCursor();

    for (const cursor of cursors) {
      // New transaction updates since "cursor"
      let added = [];
      let modified = [];
      // Removed transaction ids
      let removed = [];
      let hasMore = true;
      // Iterate through each page of new transaction updates for item
      while (hasMore) {
        const request = {
          access_token: access_token,
          cursor: cursor,
        };
        const transactionResponse = await client.transactionsSync(request);
        const data = transactionResponse.data;
        // Add this page of results
        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;

        // add new transactions in db
        for (const transaction of added) {
          await addTransaction(transaction);
        }

        // update new transactions in db
        for (const transaction of modified) {
          await updateTransaction(transaction);
        }

        // remove transactions from db
        for (const transaction_id of removed) {
          await removeTransaction(transaction_id);
        }

        // Update cursor to the next cursor
        cursor = data.next_cursor;
        //prettyPrintResponse(response);
      }

      // Update cursor in db
      ItemService.updateCursor(cursor);
    }
  });
};
