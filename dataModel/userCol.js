const database = require("../utils/database");
const ObjectID = require("mongodb").ObjectId;
const userProperties = [
  "email",
  "name",
  "password",
  "phone",
  "address",
  "gender",
  "birthday",
  "voucher",
  "role",
];
const validation = [
  "email",
  "password"
];
async function getAllAdmin() {
  return await database.userModel().find({ role: "admin" }).toArray();
}
async function getAll() {
  return await database.userModel().find({ role: "user" }).toArray();
}
async function create(data) {
  return await database.userModel().insertOne(data);
}
async function getDetailByCode(code) {
  const result = await database.userModel().find({ id: code }).toArray();
  return result[0];
}

async function getDetailByEmail(email) {
  const result = await database.userModel().find({ email }).toArray();
  return result[0];
}
async function destroy(id) {
  return await database
    .userModel()
    .updateOne({ id }, { $set: { deletedAt: new Date() } });
}
async function unban(id) {
  return await database
    .userModel()
    .updateOne({ id }, { $set: { deletedAt: null } });
}
async function update(code, data) {
  data["updatedAt"] = new Date();
  const result = await database.userModel().findOneAndUpdate(
    { email: code },
    {
      $set: data,
    }
  );
  return result.value;
}
module.exports = {
  getAllAdmin,
  getAll,
  create,
  update,
  getDetailByCode,
  getDetailByEmail,
  userProperties,
  destroy,
  getAllAdmin,
  unban,
  validation
};
