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
  "sold",
  "supplierId",
  "color",
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
  "color",
  "rate",
  "image",
];
async function getAll(page, limit, sort, match = {}) {
  let pipline = null;
  pipline = dataPagination(match, sort, page, limit);
  const result = await database.productModel().aggregate(pipline).toArray();
  return result[0].data;
}

async function getOne(code) {
  const result = await database.productModel().find({id: code});
  return result;
}

async function create(data) {
  data["createdAt"] = new Date();
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
    console.log(products)
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
                          cond: { $eq: ["$$product.id", '$id'] },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: "$$obj.quantity",
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
