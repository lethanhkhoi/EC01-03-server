const cartCol = require("../dataModel/cartCol");
const productCol = require("../dataModel/productCol");
const ObjectId = require("mongodb").ObjectId;

async function getAll(req, res) {
  const data = await cartCol.getAll();
  return res.json({ errorCode: null, data });
}

async function update(req, res) {
  //   const user = req.user.id;
  const code = req.params.code;
  let data = req.body;
  data.isIncreased = req.body.isIncreased ?? false;
  data.isDeleted = req.body.isDeleted ?? false;
  const cart = await cartCol.getOne(code);
  if (!cart) {
    return res.json({ errorCode: true, data: "Cannot found cart" });
  }
  let newProducts = [];
  const products = cart.product;
  let productsCode = products.map((item) => item.code);
  if (!productsCode.includes(data.product.code)) {
    if (data.isDeleted === true) {
      return res.json({ errorCode: true, data: "Cannot delete this product" });
    }
    newProducts = products.length !== 0 ? [...products, data.product] : [data.product];
  } else {
    if(data.isDeleted === true) {
        newProducts = products.filter((item) =>item.code !== data.product.code);
    }
    if (data.isIncreased === true && !data.isDeleted) {
      if (productsCode.includes(data.product.code)) {
        newProducts = products.map((item) =>
          item.code === data.product.code
            ? {
                code: item.code,
                quantity: item.quantity + data.product.quantity,
              }
            : item
        );
      }
    } else if (data.isIncreased === false && !data.isDeleted) {
      if (productsCode.includes(data.product.code)) {
        newProducts = products.map((item) =>
          item.code === data.product.code
            ? {
                code: item.code,
                quantity: data.product.quantity,
              }
            : item
        );
      }
    }
  }
  let update = await cartCol.update(code, { product: newProducts, updatedAt: new Date() });
  update.product = newProducts;
  return res.json({ errorCode: null, data: update });
}

module.exports = {
  getAll,
  update,
};
