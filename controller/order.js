const orderCol = require("../dataModel/orderCol");
const voucherCol = require("../dataModel/voucherCol");
const productCol = require("../dataModel/productCol");
const userCol = require("../dataModel/userCol");
const cartCol = require("../dataModel/cartCol");
const ObjectID = require("mongodb").ObjectId;
const { createLink } = require("../utils/payment");
const defaultPage = 1;
const defaultLimit = 10;

async function getAll(req, res) {
  try {
    const limit = req.query.limit ?? defaultLimit;
    const page = req.query.limit ?? defaultPage;
    const sortBy = {
      createdAt: -1,
    };
    let match = {};
    if (req.query.filters) {
      const filters = req.query.filters;
      match["email"] = filters["email"];
    }
    match["deletedAt"] = null;
    const data = await orderCol.getAll(page, limit, sortBy, match);
    if (!data) {
      return res.json({ errorCode: true, data: "System error" });
    }
    return res.json({ errorCode: null, data });
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

async function history(req, res) {
  try {
    const user = req.user;
    const sortBy = {
      createdAt: -1,
    };
    let match = {};
    match["email"] = user.email;
    match["status"] = {
      $ne: "New",
    };
    match["deletedAt"] = null;
    const data = await orderCol.history(match, sortBy);
    if (!data) {
      return res.json({ errorCode: true, data: "System error" });
    }
    return res.json({ errorCode: null, data });
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

async function create(req, res) {
  try {
    const data = req.body;

    const user = req.user;
    data.id = ObjectID().toString();
    data.userId = user.id;
    for (property of orderCol.creatValidation) {
      if (data[property] === null) {
        return res.json({ errorCode: true, data: `Please input ${property}` });
      }
    }
    const cart = await cartCol.getOne(user.id);
    const products = cart.product.map((item) => item.code);
    const checkInStock = await productCol.findByProductId(products);
    if (
      !checkInStock ||
      checkInStock.length == 0 ||
      checkInStock.length !== products.length
    ) {
      return res.json({ errorCode: true, data: `Cannot found products` });
    }
    let check = -1;
    console.log(checkInStock);
    console.log(cart);
    checkInStock.map((item, index) => {
      return cart.product.map((item2, index2) => {
        console.log(item);
        console.log(item2);
        if (item.id === item2.code && item.stock < item2.quantity) {
          console.log("123");
          return check = index;
        }
      });
    });
    if (check !== -1) {
      console.log(check);

      return res.json({
        errorCode: true,
        data: `Out of stock ${checkInStock[check].name} only has ${checkInStock[check].stock}`,
      });
    }

    const userInfo = {
      email: user.email,
      phoneNumber: req.body.phone,
      id: user.id,
    };
    let responseData = {
      orderId: data.id,
      redirectUrl: `https://smartsup.vercel.app/`,
    };
    let status = "Pending";
    if (req.body.payment === "momo") {
      const [orderId, redirectUrl] = await createLink(
        data.id,
        req.body.totalPrice * 23000,
        userInfo,
        `https://smartsup.vercel.app/`,
        `${req.protocol}://${req.get("host")}`
      );
      responseData = {
        orderId: orderId,
        redirectUrl: redirectUrl,
      };
      status = "New";
    } else if (req.body.payment === "cash") {
      let cart = await cartCol.getOne(user.id);
      const products = cart.product.map((item) => item.code);
      const checkInStock = await productCol.findByProductId(products);
      let newProducts = [];
      cart.product.map((item, index) => {
        const newObject = {
          id: item.code,
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
      cart.product = [];
      await cartCol.update(cart.id, cart);
      if (data.voucherId !== "none") {
        let voucher = await voucherCol.getOne(data.voucherId);
        voucher.user = voucher.user.filter((item) => item !== data.userId);
        await voucherCol.update(data.voucherId, voucher);
      }
    }

    data.createdAt = new Date();
    data.status = status;
    data.product = cart.product.map((item) => {
      return {
        code: item.code,
        quantity: item.quantity,
        price:
          ((item.product.price * (100 - parseFloat(item.product.sale))) / 100) *
          item.quantity,
      };
    });
    data.email = user.email;
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
    const { orderId, resultCode, amount } = req.body;
    // Verify for price

    let order = await orderCol.getOne(orderId);
    if (order.totalPrice * 23000 !== amount) {
      return res.json({ errorCode: true, data: "Transaction fail" });
    }

    // Check for transaction success
    if (resultCode === 0) {
      order.status = "Pending";
      const result = await orderCol.update(orderId, order);
      let cart = await cartCol.getOne(result.userId);
      const products = cart.product.map((item) => item.code);
      const checkInStock = await productCol.findByProductId(products);
      let newProducts = [];
      cart.product.map((item, index) => {
        const newObject = {
          id: item.code,
          quantity: checkInStock[index].stock - item.quantity,
          sold: checkInStock[index].sold + item.quantity,
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
      cart.product = [];
      await cartCol.update(cart.id, cart);
      if (result.voucherId !== "none") {
        let voucher = await voucherCol.getOne(result.voucherId);
        voucher.user = voucher.user.filter((item) => item !== result.userId);
        await voucherCol.update(result.voucherId, voucher);
      }
      return res.json({ errorCode: null, data: result });
    } else {
      await orderCol.update(orderId, { status: "Cancel" });
    }
    // Response for acknowledge
  } catch (err) {
    return res.json({ errorCode: true, data: "System error" });
  }
}
async function getOne(req, res) {
  try {
    const code = req.params.code;
    const user = await userCol.getDetailByCode(code);
    const order = await orderCol.getOneByUserEmail(user.email);
    if (!order) {
      return res.json({
        errorCode: true,
        data: "Cannot find order of this account",
      });
    }
    return res.json({ errorCode: null, data: filterOrder });
  } catch (error) {
    return res.json({ errorCode: true, data: "System error" });
  }
}

async function update(req, res) {
  try {
    const id = req.params.code;
    const data = req.body;
    const result = await orderCol.update(id, data);
    if (!result) {
      return res.json({ errorCode: true, data: "Update fail" });
    }
    return res.json({ errorCode: null, data: data });
  } catch (error) {
    return res.json({ errorCode: true, data: "System error" });
  }
}

module.exports = {
  getAll,
  create,
  notifyMomo,
  getOne,
  update,
  history,
};
