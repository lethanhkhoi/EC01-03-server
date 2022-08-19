const database = require("../utils/database");
const voucherCol = require("../dataModel/voucherCol");
const ObjectID = require("mongodb").ObjectId;
const recordPerPage = 10;
const defaultPage = 1;

async function getAll(req, res) {
  try {
    const page = req.query.page ?? defaultPage;
    const limit = req.query.limit ?? recordPerPage;
    const user = req.user;
    const sortBy = {
      createdAt: -1,
    };
    let match = {
      user: {
        $ne: user.id,
      },
    };
    if (req.query.filters) {
      match["user"] = req.query.filters["userId"];
    }
    const data = await voucherCol.getAll(page, limit, sortBy, match);
    if (!data) {
      return res.json({ errorCode: true, data: "system error" });
    }
    return res.json({ errorCode: null, data: data[0].data });
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

async function getAllByAdmin(req, res) {
  const data = await database.voucherModel().find().toArray();
  if (!data) {
    return res.json({ errorCode: true, data: "system error" });
  }
  return res.json({ errorCode: null, data: data });
}

async function create(req, res) {
  try {
    let data = req.body;
    data.id = ObjectID().toString();
    for (property of voucherCol.createValidation) {
      if (data[property] === null) {
        return res.json({ errorCode: true, data: `Lack of ${property}` });
      }
    }
    data.createdAt = new Date();
    const voucher = await voucherCol.create(data);
    if (!voucher) {
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
    const data = req.body;
    const update = await voucherCol.update(code, data);

    if (!update) {
      return res.json({ errorCode: true, data: "System error" });
    }
    for (property of voucherCol.voucherProperties) {
      if (req.body[property]) {
        update[property] = req.body[property];
      }
    }
    return res.json({ errorCode: false, data: update });
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}
async function claim(req, res) {
  try {
    const code = req.params.code;
    const user = req.user;
    let match = {
      $match: {
        id: code,
        stock: {
          $gte: 1,
        },
        user: { $ne: user.id },
      },
    };
    const checkValid = await voucherCol.checkAvailable(match);
    if (!checkValid) {
      return res.json({ errorCode: true, data: "Cannot claim this voucher" });
    }
    let userArray = checkValid[0].user;
    userArray.push(user.id);
    const data = {
      user: userArray,
      stock: checkValid[0].stock - 1,
    };
    const result = await voucherCol.claim(code, data);
    if (!result) {
      return res.json({ errorCode: true, data: "Claim voucher failed" });
    } else {
      return res.json({ errorCode: null, data: "Claim voucher success" });
    }
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

module.exports = { getAll, create, update, claim, getAllByAdmin };
