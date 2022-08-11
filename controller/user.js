const userCol = require("../dataModel/userCol");
const database = require("../utils/database");
const jwt = require("../utils/token");
const bcrypt = require("bcrypt");
const moment = require("moment");
const ObjectID = require("mongodb").ObjectId;
const { sendPass } = require("../helperFunction/helper");
const cartCol = require("../dataModel/cartCol");
const saltRounds = 10;

async function getAll(req, res) {
  const data = await userCol.getAll();
  if (!data) {
    return res.json({ errorCode: true, data: "system error" });
  }
  return res.json({ errorCode: true, data });
}
async function login(req, res) {
  try {
    const user = await database.userModel().findOne({ email: req.body.email });
    if (!user) {
      return res.json({ errorCode: true, data: "Tai khoan khong ton tai" });
    }
    const checkPass = await bcrypt.compare(req.body.password, user.password);
    if (!checkPass) {
      return res.json({ errorCode: true, data: "Pass sai" });
    }
    if (!user.token) {
      user.token = await jwt.createSecretKey(req.body.email);
    }
    return res.json({ errorCode: null, data: user });
  } catch (error) {
    return res.json({ errorCode: true, data: error });
  }
}
async function register(req, res) {
  const user = await database.userModel().findOne({ email: req.body.email });
  if (user) {
    return res.json({ errorCode: true, data: "Tai khoan da ton tai" });
  }
  const checkPass = req.body.password == req.body.confirmPassword;
  if (!checkPass) {
    return res.json({ errorCode: true, data: "Confirm password sai" });
  }
  const password = await bcrypt.hash(req.body.password, saltRounds);
  const data = {
    id: ObjectID().toString(),
    email: req.body.email,
    prevPassword: null,
    password: password,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    gender: req.body.gender,
    birthday: req.body.birthday
      ? moment(req.body.birthday, "DD/MM/YYYY").utc().toDate()
      : null,
    voucher: [],
    role: req.body.role ?? "user",
    createdAt: new Date(),
  };
  await userCol.create(data);
  await cartCol.create({
    id: ObjectID().toString(),
    userId: data.id,
    product: [],
  });
  if (!data.token) {
    data.token = await jwt.createSecretKey(req.body.email);
  }
  return res.json({ errorCode: null, data: data });
}
async function update(req, res) {
  const code = req.params.code;
  let data = req.body;
  const user = await userCol.getDetailByEmail(code);
  if (!user) {
    return res.json({ errorCode: true, data: "Cannot found this account" });
  }
  if (req.body.password) {
    const checkPass = await bcrypt.compare(data.password, user.password);
    if (!checkPass) {
      return res.json({ errorCode: true, data: "Wrong password" });
    }
    data.password = await bcrypt.hash(req.body.password, saltRounds);
  }

  const update = await userCol.update(code, data);
  if (!update) {
    return res.json({ errorCode: true, data: "System error" });
  }
  for (property of userCol.userProperties) {
    if (req.body[property]) {
      update[property] = req.body[property];
    }
  }
  return res.json({ errorCode: null, data: update });
}

async function forgotPassword(req, res) {
  let data = req.body;
  if (!data.email) {
    return res.json({
      errorCode: true,
      data: "Please input your account's email",
    });
  }
  const user = await userCol.getDetailByEmail(data.email);
  if (!user) {
    return res.json({ errorCode: true, data: "This account is not exist" });
  }
  const newpass = Math.floor(Math.random() * 10000) + 1000;
  data.password = bcrypt.hash(newpass, saltRounds);
  const update = await userCol.update(user.code, data);
  if (!update) {
    return res.json({ errorCode: true, data: "System error" });
  }
  for (property of userCol.userProperties) {
    if (req.body[property]) {
      update[property] = req.body[property];
    }
  }
  sendPass(data.email, newpass);
  return res.json({ errorCode: false, data: update });
}

async function userAuthentication(req, res, next) {
  try {
    let token = req.headers["token"];

    if (!token) {
      return res.json({
        errCode: true,
        data: "authentication fail",
      });
    }

    try {
      var payload = await jwt.decodeToken(token);
    } catch (e) {
      res.status(401);
      return res.json({
        errCode: true,
        data: "jwt malformed",
      });
    }

    if (!payload) {
      return res.json({
        errCode: true,
        data: "authentication fail",
      });
    }

    let account = [];
    account = await database.userModel().find({ email: payload }).toArray();

    if (account.length == 0 || account.length > 1) {
      return res.json({
        errCode: true,
        data: "account not found",
      });
    }

    req.user = (({ id, email, name }) => ({
      id,
      email,
      name,
    }))(account[0]);

    return next();
  } catch (error) {
    return res.json({ errorCode: true, data: "system error" });
  }
}

async function adminAuthentication(req, res, next) {
  let token = req.headers["token"];

  if (!token) {
    return res.json({
      errCode: true,
      data: "authentication fail",
    });
  }

  try {
    var payload = await jwt.decodeToken(token);
  } catch (e) {
    return res.json({
      errCode: true,
      data: "jwt malformed",
    });
  }

  if (!payload) {
    return res.json({
      errCode: true,
      data: "authentication fail",
    });
  }

  let account = [];
  account = await database
    .userModel()
    .find({ email: payload, role: "admin" })
    .toArray();

  if (account.length == 0 || account.length > 1) {
    return res.json({
      errCode: true,
      data: "account not found",
    });
  }

  req.user = (({ id, email, name }) => ({
    id,
    email,
    name,
  }))(account[0]);

  return next();
}

async function verify(req, res, next) {
  try {
    let token = req.headers["token"];
    if (!token) {
      return res.json({
        errCode: true,
        data: "authentication fail",
      });
    }

    try {
      var payload = await jwt.decodeToken(token);
    } catch (e) {
      return res.json({
        errCode: true,
        data: "jwt malformed",
      });
    }

    if (!payload) {
      return res.json({
        errCode: true,
        data: "authentication fail",
      });
    }

    let account = [];
    account = await database.userModel().find({ email: payload }).toArray();

    if (account.length == 0 || account.length > 1) {
      return res.json({
        errCode: true,
        data: "account not found",
      });
    }
    account[0].token = token;

    return res.json({
      errCode: null,
      data: account[0],
    });
  } catch (error) {
    return res.json({
      errCode: true,
      data: "System error",
    });
  }
}

module.exports = {
  getAll,
  login,
  update,
  register,
  forgotPassword,
  userAuthentication,
  adminAuthentication,
  verify,
};
