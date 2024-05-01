const datamodel = require('../../core/dbLib/data.service');
const Transaction = require('./transaction.model');
const utils = require('../../core/utils/utils');
const ItemModel = require('../Items/Item.model');

module.exports.getAll = () => {
  datamodel.getDataByQuery({ user: user._id }, Product);
};

module.exports.InsertTransaction = async (newTransaction) => {
  try {
    const tTransaction = new Transaction(newTransaction);
    tTransaction.save((err) => {
      if (err)
        console.log(`ERROR Inserting transaction details in mongo db ${err}`);
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateTransaction = async (transaction) => {
  try {
    await Transaction.updateOne(
      { transaction_id: transaction.transaction_id },
      transaction,
      (err, res) => {
        if (err)
          console.log(`ERROR updating transaction details in mongo db ${err}`);
      },
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.deleteTransaction = async (transaction_id, cb) => {
  try {
    await Transaction.deleteOne(
      { transaction_id: transaction_id },
      (err, res) => {
        if (err)
          console.log(`ERROR deleting transaction details in mongo db ${err}`);
      },
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.getCursor = async () => {
  try {
    const cursor_values = await ItemModel.find(
      {},
      { [fieldName]: 1, _id: 0 },
    ).exec();
    return cursor_values;
  } catch (err) {
    console.log(err);
  }
};
