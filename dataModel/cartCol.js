const database = require("../utils/database");
const ObjectID = require("mongodb").ObjectId;

const cartProperties = ["userId", "product"];

async function getAll() {
  return await database.cartModel().find().toArray();
}

async function create(data) {
  return await database.cartModel().insertOne(data);
}
async function update(code, data) {
  const result = await database.cartModel().findOneAndUpdate(
    { id: code },
    {
      $set: data,
    }
  );
  return result.value;
}
async function getOne(code) {
  const result = await database.cartModel().findOne({
    id: code,
  });
  return result;
}

module.exports = {
  getAll,
  create,
  getOne,
  update,
  cartProperties,
};
