const database = require("../utils/database");

const cartProperties = ["userId", "product"];

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
                  code: {
                    $arrayElemAt: [
                      "$Product",
                      {
                        $indexOfArray: ["$drugs._id", "$$this.drug"],
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
    { $project: { drugs: 0 } }
  );
  aggregate.push({
    $unwind: { path: "$request", preserveNullAndEmptyArrays: true },
  });
  return aggregate;
}

async function getAll() {
  return await database.cartModel().find().toArray();
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
  const result = await database.cartModel().findOne({
    userId: code,
  });
  return result;
}

async function deleteByCheckOut(code) {}

module.exports = {
  getAll,
  create,
  getOne,
  update,
  cartProperties,
};
