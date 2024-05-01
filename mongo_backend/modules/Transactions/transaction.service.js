const datamodel = require('../../core/dbLib/data.service');
const Transaction = require('./transaction.model');
const utils = require('../../core/utils/utils');


module.exports.getAll = (cb) => {
  datamodel.getAllData({ user: user._id }, Product, cb);
};




