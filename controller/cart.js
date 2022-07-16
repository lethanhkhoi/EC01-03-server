const cartCol = require("../dataModel/cartCol");
const productCol = require("../dataModel/productCol");
const ObjectId = require("mongodb").ObjectId;

async function getAll(req, res) {
  const data = await cartCol.getAll();
  return res.json({ errorCode: null, data });
}

async function update(req, res) {
  const user = req.user.id;
  const code = req.params.code;
  const data = req.body;
  let update = await cartCol.update(code, data);
  for (property of cartCol.cartProperties) {
    if (req.body[property]) {
      update[property] = req.body[property];
    }
  }
  return res.json({ errorCode: null, data: update });
}

module.exports = {
  getAll,
  update
};
