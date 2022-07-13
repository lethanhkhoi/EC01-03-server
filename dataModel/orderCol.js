const database = require("../utils/database");
const { dataPagination } = require("../helperFunction/helper");
const ObjectID = require("mongodb").ObjectId;

const creatValidation = [
  "product",
  "shipId",
  "userId",
  "name",
  "address",
  "phone",
  "productPrice",
  "shipPrice",
  "totalPrice",
];

async function getAll(page, limit, sort, match = {}) {
  let pipline = null;
  pipline = dataPagination(match, sort, page, limit);
  const result = await database.orderModel().aggregate(pipline).toArray();
  return result[0].data;
}
async function create(data){
    return await database.orderModel().insertOne(data)
}

module.exports = {
  getAll,
  create,
  creatValidation
};
