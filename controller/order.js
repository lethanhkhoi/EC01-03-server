const orderCol = require("../dataModel/orderCol");
const productCol = require("../dataModel/productCol");
const ObjectID = require("mongodb").ObjectId;
const defaultPage = 1;
const defaultLimit = 10;

async function getAll(req, res) {
  const limit = req.query.limit ?? defaultLimit;
  const page = req.query.limit ?? defaultPage;
  const sortBy = {
    createdAt: -1,
  };
  const match = {
    deletedAt: null,
  };
  const data = await orderCol.getAll(page, limit, sortBy, match);
  if (!data) {
    return res.json({ errorCode: true, data: "System error" });
  }
  return res.json({ errorCode: null, data });
}
async function create(req, res) {
  const data = req.body;
  for (property of orderCol.creatValidation) {
    if (!data[property]) {
      return res.json({ errorCode: true, data: `Please input ${property}` });
    }
  }
  const products = data.product.map((item) => ObjectID(item.id));
  const checkInStock = await productCol.findByProductId(products);
  if (
    !checkInStock ||
    checkInStock.length == 0 ||
    checkInStock.length !== products.length
  ) {
    return res.json({ errorCode: true, data: `Cannot found products` });
  }
  checkInStock.map((item, index)=>{
    if(item._id.toString() === data.product[index].id && item.stock < data.product[index].quantity){
        return res.json({errorCode: true, data: `OUT OF STOCK`})
    }
  })

  data.createdAt = new Date();
  const order = await orderCol.create(data);
  if (!order) {
    return res.json({ errorCode: true, data: "System error" });
  }
  let newProducts = []
  data.product.map((item, index)=>{
    const newObject = {
        id: item.id,
        quantity:  checkInStock[index].stock- item.quantity
    }
    newProducts.push(newObject)
  })
  const updateProduct = await productCol.updateMultipleProduct(newProducts)
  console.log(updateProduct)
  return res.json({ errorCode: null, data: data });
}

module.exports = {
  getAll,
  create,
};
