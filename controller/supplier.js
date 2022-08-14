const database = require("../utils/database");
const supplierCol = require("../dataModel/supplierCol");
const productCol = require("../dataModel/productCol");
const { productProperties } = require("../dataModel/productCol");
const ObjectID = require("mongodb").ObjectId;

async function getAll(req, res) {
  const data = await supplierCol.getAll();
  if (!data) {
    return res.json({ errorCode: true, data: "system error" });
  }
  return res.json({ errorCode: false, data });
}

async function create(req, res) {
  let data = req.body;
  data.id = ObjectID().toString();
  for (property in supplierCol.supplierProperties) {
    if (!data[property]) {
      return res.json({ errorCode: true, data: `Lack of ${property}` });
    }
  }
  data.createdAt = new Date();
  const supplier = await supplierCol.create(data);
  if (!supplier) {
    return res.json({ errorCode: true, data: "System error" });
  }
  return res.json({ errorCode: false, data: data });
}

async function update(req, res) {
  const code = req.params.code;
  const data = req.body;
  const update = await productCol.update(code, data);
  if (!update) {
    return res.json({ errorCode: true, data: "System error" });
  }
  for (property of supplierCol.supplierProperties) {
    if (req.body[property]) {
      update[property] = req.body[property];
    }
  }
  return res.json({ errorCode: false, data: update });
}

module.exports = { getAll, create, update };
