const database = require("../utils/database");
const ObjectID = require("mongodb").ObjectId;

const voucherProperties = ["name", "price", "status"];

async function getAll() {
  return await database.voucherMocel().find().toArray();
}

async function create(data) {
  return await database.voucherMocel().insertOne(data);
}

async function update(code, data) {
  data["updatedAt"] = new Date();
  const result = await database.voucherMocel().findOneAndUpdate(
    { _id: ObjectID(code) },
    {
      $set: data,
    }
  );
  return result.value;
}
