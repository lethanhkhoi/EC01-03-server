const productCol = require("../dataModel/productCol");
const ObjectID = require("mongodb").ObjectId;
const recordPerPage = 10;
const defaultPage = 1;

async function getAll(req, res) {
  const page = req.query.page ?? defaultPage;
  const limit = req.query.limit ?? recordPerPage;
  const sortBy = {
    createdAt: -1,
  };
  const match = {
    deletedAt: null,
  };
  const data = await productCol.getAll(page, limit, sortBy, match);
  if (!data) {
    return res.json({ errorCode: true, data: "System error" });
  }
  return res.json({ errorCode: null, data });
}

async function create(req, res) {
  let data = req.body;
  data.id = ObjectID().toString()
  const user = req.user;
  for (property of productCol.creatValidation) {
    if (!data[property]) {
      return res.json({ errorCode: true, data: `Please input ${property}` });
    }
  }
  data.rate = null;
  data.createdAt = new Date();
  data.image = req.body.image ?? [];
  const product = await productCol.create(data);
  if (!product) {
    return res.json({ errorCode: true, data: "System error" });
  }
  return res.json({ errorCode: null, data: data });
}
async function update(req, res) {
  const code = req.params.code;
  const data = req.body;
  const update = await productCol.update(code, data);
  if (!update) {
    return res.json({ errorCode: true, data: "System error" });
  }
  for (property of productCol.productProperties) {
    if (req.body[property]) {
      update[property] = req.body[property];
    }
  }
  return res.json({ errorCode: false, data: update });
}

async function rating(req, res) {
  const code = req.params.code;
  const data = req.body;
  const product = await productCol.getOne(code);
  if (!product) {
    return res.json({ errorCode: true, data: "Cannot found this product" });
  }
  let rating = data.rating + (parseFloat(product.rating) ?? 0)
  rating = (rating / 2).toFixed(2)
  const update = await productCol.update(code,{rating: rating})
  update.rating = rating
  return res.json({ errorCode: false, data: update });
}

async function deleteProduct(req, res) {
  const code = req.params.code;
  if (code.includes(":")) {
    return res.json({ errorCode: true, data: "Input product code" });
  }
  let data = req.body;
  data.deletedAt = new Date();
  const update = await productCol.update(code, data);
  if (!update) {
    return res.json({ errorCode: true, data: "System error" });
  }
  for (property of productCol.productProperties) {
    if (req.body[property]) {
      update[property] = req.body[property];
    }
  }
  update.deletedAt = data.deletedAt;
  return res.json({ errorCode: false, data: update });
}

module.exports = {
  getAll,
  create,
  update,
  deleteProduct,
  rating
};
