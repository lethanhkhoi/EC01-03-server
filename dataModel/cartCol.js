const database = require("../utils/database");

const cartProperties = ["product"];

function joinProduct(aggregate = []) {
  aggregate.push(
    {
      $addFields: {
        product: { $ifNull: ["$product", []] },
      },
    },
    {
      $lookup: {
        from: "Product",
        localField: "product.code",
        foreignField: "id",
        as: "products",
      },
    },
    {
      $addFields: {
        product: {
          $map: {
            input: "$product",
            in: {
              $mergeObjects: [
                "$$this",
                {
                  product: {
                    $arrayElemAt: [
                      "$products",
                      {
                        $indexOfArray: ["$products.id", "$$this.code"],
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },
    { $project: { products: 0 } }
  );
  return aggregate;
}

async function getAll() {
  return await database.cartModel().aggregate(joinProduct()).toArray();
}

async function create(data) {
  return await database.cartModel().insertOne(data);
}
async function update(code, data) {
  const result = await database.cartModel().findOneAndUpdate(
    { id: code },
    {
      $set: data,
    }
  );
  return result.value;
}
async function getOne(code) {
  const result = await database
    .cartModel()
    .aggregate([
      ...joinProduct(),
      {
        $match: {
          userId: code,
        },
      },
    ])
    .toArray();
  return result[0];
}

module.exports = {
  getAll,
  create,
  getOne,
  update,
  cartProperties,
  joinProduct
};
