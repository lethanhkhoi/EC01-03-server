const shippingCol = require("../dataModel/shippingCol");
const ObjectID = require("mongodb").ObjectId;
async function getAll(req, res) {
  const data = await shippingCol.getAll();
  if (!data) {
    return res.json({ errorCode: true, data: "system error" });
  }
  return res.json({ errorCode: null, data });
}

async function create(req, res) {
  try {
    let data = req.body;
    data.id = ObjectID().toString();
    const result = await shippingCol.create(data);
    if (!result) {
      return res.json({ errorCode: true, data: "system error" });
    }
    return res.json({ errorCode: null, data });
  } catch (error) {
    return req.json({ errorCode: true, data: "system error" });
  }
}

module.exports = {
  getAll,
  create,
};
