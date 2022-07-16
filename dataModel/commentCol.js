const database = require("../utils/database");

const commentProperties = [
  "rootCommentId",
  "productID",
  "content",
  "created_at",
  "updated_at",
];

async function getAll() {
  return await database.commentModel().find().toArray();
}

async function create(data) {
  return await database.commentModel().insertOne(data);
}

async function update(code, data) {
  data["updatedAt"] = new Date();
  const result = await database.commentModel().findOneAndUpdate(
    { id: code },
    {
      $set: data,
    }
  );
  return result.value;
}

async function deleteComment(code) {
  const result = await database.commentModel().findOneAndDelete({ id: code });
  return result;
}

module.exports = {
  getAll,
  create,
  update,
  deleteComment,
  commentProperties,
};
