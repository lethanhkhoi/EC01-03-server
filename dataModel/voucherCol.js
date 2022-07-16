const database = require("../utils/database");
const ObjectID = require("mongodb").ObjectId;

const voucherProperties = ["name", "price", "status"];

async function getAll() {
  return await database.voucherModel().find().toArray();
}

async function create(data) {
  return await database.voucherModel().insertOne(data);
}

async function update(code, data) {
  data["updatedAt"] = new Date();
  const result = await database.voucherModel().findOneAndUpdate(
    { id: code },
    {
      $set: data,
    }
  );
  return result.value;
}

module.exports = {
  getAll,
  create,
  update,
  voucherProperties,
};
