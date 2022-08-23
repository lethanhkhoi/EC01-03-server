const database = require("../utils/database");
const userCol = require("../dataModel/userCol");
const voucherCol = require("../dataModel/voucherCol");
const moment = require("moment");
const ObjectID = require("mongodb").ObjectId;
const recordPerPage = 10;
const defaultPage = 1;

async function getAll(req, res) {
  try {
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 1000;
    const user = req.user;
    const checkUser = await userCol.getDetailByCode(user.id);
    const sortBy = {
      createdAt: -1,
    };
    let match = {
      user: {
        $ne: user.id,
      },
      $or: [
        {
          endDate: {
            $gte: moment.utc(new Date(), "DD/MM/YYYY").toDate(),
          },
        },
        {
          endDate: null,
        },
      ],
    };
    match["id"] = {
      $nin: checkUser.voucher,
    };
    if (req.query.filters) {
      match["user"] = req.query.filters["userId"];
    }
    console.log(match);
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
    for (property of voucherCol.createValidation) {
      if (!data[property]) {
        return res.json({ errorCode: true, data: `Lack of ${property}` });
      }
    }
    data.id = ObjectID().toString();
    data.createdAt = new Date();
    if (req.body.endDate) {
      data.endDate = data.endDate
        ? moment.utc(data.endDate, "DD/MM/YYYY").toDate()
        : null;
    }
    data.user = [];
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
    let data = req.body;
    if (req.body.endDate) {
      data.endDate = data.endDate
        ? moment.utc(data.endDate, "DD/MM/YYYY").toDate()
        : null;
    }
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
    let checkUser = await userCol.getDetailByCode(user.id);
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
    if (checkValid.length === 0) {
      return res.json({ errorCode: true, data: "Cannot claim this voucher" });
    }
    if (checkUser.voucher.includes(checkValid[0].id)) {
      return res.json({
        errorCode: true,
        data: "Cannot claim this voucher again",
      });
    }
    let userArray = checkValid[0].user;
    userArray.push(user.id);
    const data = {
      user: userArray,
      stock: checkValid[0].stock - 1,
    };
    checkUser.voucher.push(code);
    const result = await voucherCol.claim(code, data);
    await userCol.update(user.email, checkUser);
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
