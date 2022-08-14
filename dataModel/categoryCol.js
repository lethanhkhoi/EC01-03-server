const database = require("../utils/database");

async function getAll(match = {}) {
  const result =  await database.categoryModel().aggregate([{ $match: match }]).toArray();
  return result
}
async function getOne(name) {
  return await database.categoryModel().findOne({ name: name });
}

module.exports = {
  getAll,
  getOne,
};
