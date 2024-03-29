const database = require("../utils/database");
const { dataPagination } = require("../helperFunction/helper");
const ObjectID = require("mongodb").ObjectId;
const creatValidation = [
  "name",
  "categoryId",
  "price",
  "sale",
  "dimension",
  "warranty",
  "description",
  "stock",
  "supplierId",
];

const productProperties = [
  "name",
  "supplierId",
  "categoryId",
  "price",
  "sale",
  "dimension",
  "warranty",
  "description",
  "stock",
  "sold",
  "rate",
  "image",
  "weight",
];
async function getAll(page, limit, sort, match = {}) {
  let pipline = null;
  pipline = dataPagination(match, sort, page, limit);
  const result = await database.productModel().aggregate(pipline).toArray();
  const newResult = {
    metadata: result[0].metadata,
    data: result[0].data,
  };
  return newResult;
}

async function getOne(code) {
  const result = await database.productModel().findOne({ id: code });
  return result;
}

async function create(data) {
  return await database.productModel().insertOne(data);
}
async function update(code, data) {
  data["updateAt"] = new Date();
  const result = await database.productModel().findOneAndUpdate(
    { id: code },
    {
      $set: data,
    }
  );
  return result.value;
}
async function findByProductId(code) {
  const aggregate = [
    {
      $match: {
        id: {
          $in: code,
        },
        stock: {
          $gte: 1,
        },
        deleteAt: null,
      },
    },
  ];
  const result = await database.productModel().aggregate(aggregate).toArray();
  return result;
}

async function updateMultipleProduct(products) {
  try {
    let data = await database.productModel().update(
      { id: { $in: products.map((item) => item.id) } },
      [
        {
          $set: {
            stock: {
              $let: {
                vars: {
                  obj: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: products,
                          as: "product",
                          cond: { $eq: ["$$product.id", "$id"] },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: "$$obj.quantity",
              },
            },
            sold: {
              $let: {
                vars: {
                  obj: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: products,
                          as: "product",
                          cond: { $eq: ["$$product.id", "$id"] },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: "$$obj.sold",
              },
            },
          },
        },
      ],
      { runValidators: true, multi: true }
    );
    return true;
  } catch (error) {
    return false;
  }
}
module.exports = {
  creatValidation,
  getAll,
  getOne,
  create,
  update,
  findByProductId,
  updateMultipleProduct,
  productProperties,
};
