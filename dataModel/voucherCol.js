const database = require("../utils/database");
const ObjectID = require("mongodb").ObjectId;
const { dataPagination } = require("../helperFunction/helper");
const voucherProperties = ["name", "price", "status"];

async function getAll(page, limit, sortBy, match) {
  let pipline = null;
  pipline = dataPagination(match, sortBy, page, limit);
  return await database.voucherModel().aggregate(pipline).toArray();
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

async function claim(code, data) {
  data["updatedAt"] = new Date();
  const result = await database.voucherModel().findOneAndUpdate(
    { id: code },
    {
      $set: data,
    }
  );
  return result.value;
}

async function checkAvailable(match){
  return await database.voucherModel().aggregate([match]).toArray();
}

module.exports = {
  getAll,
  create,
  checkAvailable,
  update,
  claim,
  voucherProperties,
};
