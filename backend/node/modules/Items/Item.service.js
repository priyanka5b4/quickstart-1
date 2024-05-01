const datamodel = require('../../core/dbLib/data.service');
const Item = require('./Item.model');


module.exports.createItem = (newItem) => {
  if (!newItem) {
    throw new Error('Empty Item Sent for Creation');
    
  }
  const tItem = new Item(newItem);
   tItem.save((err) => {
    if (err) console.log(`Error creating Item in mongodb ${err}`);
    
  });
};


module.exports.updateCursor = async (item_id , cursor) => {
  try {
    await Item.updateOne({ item_id: item_id }, cursor, (err, res) => {
      if (err) console.log(`ERROR updating cursor details in mongo db ${err}`);
      
    });
  } catch (err) {
    console.log(err);
  }
};


module.exports.getAllItems = () => {
  datamodel.getAllData(Item);
};
