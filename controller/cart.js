const cartCol = require("../dataModel/cartCol");
const productCol = require("../dataModel/productCol");
const ObjectId = require("mongodb").ObjectId;

async function getOne(req, res) {
  const user = req.user
  const cart = await cartCol.getOne(user.id);
  if (!cart) {
    return res.json({ errorCode: true, data: "Cannot found cart" });
  }
  return res.json({ errorCode: null, data: cart });
}

async function update(req, res) {
  const user = req.user;
  let data = req.body;
  data.isIncreased = req.body.isIncreased ?? false;
  data.isDeleted = req.body.isDeleted ?? false;
  for(property of cartCol.cartProperties){
    if(!data[property]){
      return res.json({errorCode: true, data:`Please input ${property}`})
    }
  }
  const cart = await cartCol.getOne(user.id);
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
                quantity: data.product.quantity ? item.quantity + data.product.quantity : item.quantity + 1,
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
  let update = await cartCol.update(cart.id, { product: newProducts, updatedAt: new Date() });
  if(!update){
    return res.json({errorCode: true, data:"Update fail"})
  }
  update.product = newProducts;
  return res.json({ errorCode: null, data: update });
}

module.exports = {
  getOne,
  update,
};
