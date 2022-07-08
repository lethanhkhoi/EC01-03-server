const { MongoClient } = require("mongodb");
const config = require('../config/database.json');

let _userModel = null
let _productModel = null
async function connectDatabase(cb) {
  const client = new MongoClient(config.uri);
  try {
    await client.connect();
    let db = await client.db('Ecommerce');
    console.log("connect to DB Success", config.uri);

    // Authentication
    _userModel = db.collection("User");
    _productModel = db.collection("Product")

    dbClient = client;

    cb();
  } catch (e) {
    console.error(e);
  }
}
// Authentication

const userModel = function () {
  if (_userModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _userModel;
  }
};

const productModel = function () {
  if (_productModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _productModel;
  }
};
module.exports = {
  userModel,
  productModel,
  connectDatabase
}