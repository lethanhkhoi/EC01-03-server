const { MongoClient } = require("mongodb");
const config = require("../config/database.json");

let _userModel = null;
let _productModel = null;
let _categoryModel = null;
let _orderModel = null;
let _cartModel = null;
let _supplierModel = null;
let _voucherModel = null;
let _shippingModel = null;

async function connectDatabase(cb) {
  const client = new MongoClient(config.uri);
  try {
    await client.connect();
    let db = await client.db("Ecommerce");
    console.log("connect to DB Success", config.uri);

    // Authentication
    _userModel = db.collection("User");
    _productModel = db.collection("Product");
    _categoryModel = db.collection("Category");
    _orderModel = db.collection("Order");
    _cartModel = db.collection("Cart");
    _supplierModel = db.collection("Supplier");
    _voucherModel = db.collection("Voucher");
    _shippingModel = db.collection("Shipping");
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

const categoryModel = function () {
  if (_categoryModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _categoryModel;
  }
};

const orderModel = function () {
  if (_orderModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _orderModel;
  }
};
const cartModel = function () {
  if (_cartModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _cartModel;
  }
};

const supplierModel = function () {
  if (_supplierModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _supplierModel;
  }
};

const voucherModel = function () {
  if (_voucherModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _voucherModel;
  }
};
const shippingModel = function () {
  if (_shippingModel == null) {
    console.log("Instance is null or undefined");
  } else {
    return _shippingModel;
  }
};

module.exports = {
  shippingModel,
  userModel,
  productModel,
  categoryModel,
  orderModel,
  cartModel,
  supplierModel,
  voucherModel,
  connectDatabase,
};
