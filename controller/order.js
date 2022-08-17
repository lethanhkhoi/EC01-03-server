const orderCol = require("../dataModel/orderCol");
const productCol = require("../dataModel/productCol");
const cartModel = require("../dataModel/cartCol");
const ObjectID = require("mongodb").ObjectId;
const { createLink } = require("../utils/payment");
const defaultPage = 1;
const defaultLimit = 10;

async function getAll(req, res) {
  const limit = req.query.limit ?? defaultLimit;
  const page = req.query.limit ?? defaultPage;
  const sortBy = {
    createdAt: -1,
  };
  let match = {};
  if (req.query.filters) {
    const filters = req.query.filters;
    match["userId"] = filters["userId"];
  }
  match["deletedAt"] = null;
  const data = await orderCol.getAll(page, limit, sortBy, match);
  if (!data) {
    return res.json({ errorCode: true, data: "System error" });
  }
  return res.json({ errorCode: null, data });
}

async function create(req, res) {
  try {
    const data = req.body;
    const user = req.user;
    data.id = ObjectID().toString();
    data.userId = user.id;
    for (property of orderCol.creatValidation) {
      if (!data[property]) {
        return res.json({ errorCode: true, data: `Please input ${property}` });
      }
    }
    const cart = await cartModel.getOne(user.id);
    const products = cart.product.map((item) => item.code);
    const checkInStock = await productCol.findByProductId(products);
    if (
      !checkInStock ||
      checkInStock.length == 0 ||
      checkInStock.length !== products.length
    ) {
      return res.json({ errorCode: true, data: `Cannot found products` });
    }
    checkInStock.map((item, index) => {
      if (
        item._id.toString() === cart.product[index].id &&
        item.stock < cart.product[index].quantity
      ) {
        return res.json({ errorCode: true, data: `OUT OF STOCK` });
      }
    });

    const userInfo = {
      email: user.email,
      phoneNumber: req.body.phone,
      id: user.id,
    };
    let responseData = {
      orderId: data.id,
      redirectUrl: null,
    };
    if (req.body.payment === "momo") {
      const [orderId, redirectUrl] = await createLink(
        data.id,
        req.body.totalPrice * 23000,
        userInfo,
        `http://localhost:3000`,
        `${req.protocol}://${req.get("host")}`
      );
      responseData = {
        orderId: orderId,
        redirectUrl: redirectUrl,
      };
    } else if (req.body.payment === "cash") {
      let newProducts = [];
      cart.product.map((item, index) => {
        const newObject = {
          id: item.id,
          quantity: checkInStock[index].stock - item.quantity,
        };
        newProducts.push(newObject);
      });
      const updateProduct = await productCol.updateMultipleProduct(newProducts);
      if (!updateProduct) {
        return res.json({
          errorCode: true,
          data: "Cannot update products' quantity",
        });
      }
    }

    data.createdAt = new Date();
    data.status = "Pending";
    data.product = cart.product.map((item) => {
      return {
        code: item.code,
        quantity: item.quantity,
      };
    });
    const order = await orderCol.create(data);
    if (!order) {
      return res.json({ errorCode: true, data: "System error" });
    }

    return res.json({ errorCode: null, data: data, paymentData: responseData });
  } catch (error) {
    return res.json({ errorCode: true, data: "System error" });
  }
}
async function notifyMomo(req, res) {
  try {
    console.log("TEST")
    const { orderId, resultCode, amount } = req.body;
    console.log(orderId);
    console.log(resultCode);
    console.log(amount);
    // Verify for price
    const order = await orderCol.getOne(orderId);
    if (+order.final_price !== amount) {
      return res.json({ errorCode: true, data: "Transaction fail" });
    }

    // Check for transaction success
    if (resultCode === 0) {
      const result = await orderCol.update(orderId, { status: "Pending" });
      console.log(result);
      // let newProducts = [];
      // cart.product.map((item, index) => {
      //   const newObject = {
      //     id: item.id,
      //     quantity: checkInStock[index].stock - item.quantity,
      //   };
      //   newProducts.push(newObject);
      // });
      //const updateProduct = await productCol.updateMultipleProduct(newProducts);
      if (!updateProduct) {
        return res.json({
          errorCode: true,
          data: "Cannot update products' quantity",
        });
      }
    } else {
      await orderCol.update(orderId, { status: "Cancel" });
    }

    // Response for acknowledge
  } catch (err) {
    return res.json({ errorCode: true, data: "System error" });
  }
}

module.exports = {
  getAll,
  create,
  notifyMomo,
};
