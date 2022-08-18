const database = require("../utils/database");

async function getAll(match = {}) {
  const result = await database
    .shippingModel()
    .aggregate([{ $match: match }])
    .toArray();
  return result;
}
async function create(data) {
  try {
    data["createdAt"] = new Date();
    const result = await database.shippingModel().insertOne(data);
    return result;
  } catch (error) {
    return null;
  }
}

module.exports = {
  getAll,
  create,
};
