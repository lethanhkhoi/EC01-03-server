const database = require("../utils/database")
const  ObjectID = require('mongodb').ObjectId;
const userProperties = [
    "name",
    "password",
    "phone",
    "address",
    "gender",
    "birthday",
    "voucher"
]
async function getAll(){
    return await database.userModel().find().toArray()
}
async function create(data){
    return await database.userModel().insertOne(data)
}
async function update (code, data){
    data["updatedAt"] = new Date()
    console.log(code)
    const result= await database.userModel().findOneAndUpdate({_id: ObjectID(code)},
    {
        $set: data
    })
    return result.value
}
module.exports={
    getAll,
    create,
    update,
    userProperties
}