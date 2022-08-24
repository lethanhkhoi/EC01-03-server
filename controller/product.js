const productCol = require("../dataModel/productCol");
const categoryCol = require("../dataModel/categoryCol");
const supplierCol = require("../dataModel/supplierCol");
const ObjectID = require("mongodb").ObjectId;
const recordPerPage = 10;
const defaultPage = 1;

async function getAll(req, res) {
  try {
    const page = req.query.page ?? defaultPage;
    const limit = req.query.limit ?? recordPerPage;
    const sortBy = {
      createdAt: -1,
    };
    let match = {};
    if (req.query.filters) {
      const filters = req.query.filters;
      if (filters["name"]) {
        match["name"] = new RegExp([filters["name"]].join(""), "i");
      }
      if (filters["category"]) {
        const filterCategory = filters["category"].split(",");
        const category = await categoryCol.getAll({
          name: { $in: filterCategory },
        });
        if (!category) {
          return res.json({
            errorCode: true,
            data: "Cannot find this category",
            metadata: null,
          });
        }
        match["categoryId"] = {
          $in: category.map((item) => item.id),
        };
      }
      if (filters["brand"]) {
        const filterSupplier = filters["brand"].split(",");
        const supplier = await supplierCol.getAll({
          companyName: { $in: filterSupplier },
        });
        if (!supplier) {
          return res.json({
            errorCode: true,
            data: "Cannot find this supplier",
            metadata: null,
          });
        }
        match["supplierId"] = {
          $in: supplier.map((item) => item.id),
        };
      }
      if (filters["price"]) {
        const priceFilter = filters["price"];
        switch (priceFilter) {
          case "0":
            match["price"] = {
              $gte: 0,
              $lte: 50,
            };
            break;
          case "1":
            match["price"] = {
              $gte: 50,
              $lte: 100,
            };
            break;
          case "2":
            match["price"] = {
              $gte: 100,
              $lte: 200,
            };
            break;
          case "3":
            match["price"] = {
              $gte: 200,
            };
            break;
          default:
            match["price"] = {
              $gte: 0,
            };
        }
      }
    }
    match["deletedAt"] = null;
    const data = await productCol.getAll(page, limit, sortBy, match);
    if (!data) {
      return res.json({
        errorCode: true,
        data: "System error",
        metadata: { recordTotal: 0, pageCurrent: page, recordPerPage: limit },
      });
    }
    return res.json({
      errorCode: null,
      data: data.data,
      metadata: data.metadata[0] ?? { recordTotal: 0, pageCurrent: page, recordPerPage: limit },
    });
  } catch (error) {
    return res.json({ errorCode: true, data: "System error" });
  }
}

async function getDetail(req, res) {
  try {
    const code = req.params.code;
    let data = await productCol.getOne(code);
    if (!data) {
      return res.json({ errorCode: true, data: "System error" });
    }
    const category = data.categoryId;
    const match = {
      categoryId: category,
      id: {
        $ne: data.id,
      },
      deletedAt: null
    };
    const relatedProducts = await productCol.getAll(
      1,
      4,
      { createdAt: -1 },
      match
    );
    data.relatedProducts = relatedProducts;
    return res.json({ errorCode: null, data });
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

async function create(req, res) {
  try {
    let data = req.body;
    data.id = ObjectID().toString();
    const user = req.user;
    for (property of productCol.creatValidation) {
      if (!data[property]) {
        return res.json({ errorCode: true, data: `Please input ${property}` });
      }
    }
    data.rate = null;
    data.createdAt = new Date();
    data.image = req.body.image ?? [];
    data.price = parseFloat(req.body.price);
    data.sold = 0;
    data.weight = req.body.weight ?? 0;
    const product = await productCol.create(data);
    if (!product) {
      return res.json({ errorCode: true, data: "System error" });
    }
    return res.json({ errorCode: null, data: data });
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}
async function update(req, res) {
  try {
    const code = req.params.code;
    let data = req.body;
    if(data.price){
      data.price = parseFloat(data.price);
    }
    const update = await productCol.update(code, data);
    if (!update) {
      return res.json({ errorCode: true, data: "System error" });
    }
    for (property of productCol.productProperties) {
      if (req.body[property]) {
        update[property] = req.body[property];
      }
    }
    return res.json({ errorCode: null, data: update });
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

async function rating(req, res) {
  try {
    const code = req.params.code;
    const data = req.body;
    const product = await productCol.getOne(code);
    if (!product) {
      return res.json({ errorCode: true, data: "Cannot found this product" });
    }
    let rating = data.rating + (parseFloat(product.rating) ?? 0);
    rating = (rating / 2).toFixed(2);
    const update = await productCol.update(code, { rating: rating });
    update.rating = rating;
    return res.json({ errorCode: false, data: update });
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

async function deleteProduct(req, res) {
  try {
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
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

module.exports = {
  getAll,
  create,
  update,
  deleteProduct,
  rating,
  getDetail,
};
