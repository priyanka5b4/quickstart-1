const datamodel = require('../../core/dbLib/data.service');
const Account = require('./account.model');
const utils = require('../../core/utils/utils');

module.exports.createAccount = async (newAccount) => {
  try {
    const tAccount = new Account(newAccount);
    await tAccount.save((err) => {
      if (err)
        console.log(`ERROR Inserting account details in mongo db ${err}`);
      else {
        console.log(
          `Account details inserted in mongo db for account ID: ${newAccount.account_id}`,
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getAllAccountsData = () => {
  return datamodel.getAllData({}, Account);
};
