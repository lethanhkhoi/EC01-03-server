const database = require("../utils/database");
const commentCol = require("../dataModel/commentCol");
const ObjectID = require("mongodb").ObjectId;

async function getAll(req, res) {
  const data = await commentCol.getAll();
  if (!data) {
    return res.json({ errorCode: true, data: "system error" });
  }
  return res.json({ errorCode: null, data });
}

async function create(req, res) {
  let data = req.body;
  data.id = ObjectID().toString();
  for (property of commentCol.commentProperties) {
    if (data[property] === null) {
      return res.json({ errorCode: true, data: `Lack of ${property}` });
    }
  }
  data.createdAt = new Date();
  const voucher = await commentCol.create(data);
  if (!voucher) {
    return res.json({ errorCode: true, data: "System error" });
  }
  return res.json({ errorCode: null, data: data });
}

async function update(req, res) {
  const code = req.params.code;
  const data = req.body;
  const update = await commentCol.update(code, data);
  
  if (!update) {
    return res.json({ errorCode: true, data: "System error" });
  }
  for (property of commentCol.commentProperties) {
    if (req.body[property]) {
      update[property] = req.body[property];
    }
  }
  return res.json({ errorCode: null, data: update });
}

async function deleteComment(req, res) {
  const code = req.params.code;
  const deleteComment = await commentCol.deleteComment(code);
  if (!deleteComment) {
    return res.json({ errorCode: true, data: "System error" });
  }

  return res.json({ errorCode: null, data: "Successfully deleted" });
}

module.exports = { getAll, create, update, deleteComment };
