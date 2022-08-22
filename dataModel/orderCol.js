const database = require("../utils/database");
const { dataPagination } = require("../helperFunction/helper");
const ObjectID = require("mongodb").ObjectId;
const {joinProduct}= require("./cartCol");
const creatValidation = [
  "name",
  "address",
  "phone",
  "productPrice",
  "shipPrice",
  "totalPrice",
  "payment",
  "shippingMethod",
];

async function getAll(page, limit, sort, match = {}) {
  let pipline = null;
  pipline = dataPagination(match, sort, page, limit, joinProduct());
  const result = await database.orderModel().aggregate(pipline).toArray();
  return result[0].data;
}
async function create(data) {
  return await database.orderModel().insertOne(data);
}
async function getOne(code) {
  return await database.orderModel().findOne({ id: code });
}
async function getOneByUserEmail(code) {
  return await database.orderModel().findOne({ id: code });
}
async function history(match, sort) {
  const result = await database.orderModel().aggregate([...joinProduct(),{$match: match},{$sort: sort}]).toArray();
  return result
}
async function update(code, data) {
  data["updatedAt"] = new Date();
  const result = await database.orderModel().findOneAndUpdate(
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
  creatValidation,
  getOne,
  update,
  history,
  getOneByUserEmail
};
