const database = require("../utils/database")
const  ObjectID = require('mongodb').ObjectId;

const supplierProperties =
[
    "companyName",
    "country",
    "address"
]

async function getAll(){
    return await database.supplierModel().find().toArray()
}

async function create(data){
    return await database.supplierModel().insertOne(data)
}

async function update(code,data){
    data["updatedAt"] = new Date()
    const result= await database.supplierModel().findOneAndUpdate({_id: ObjectID(code)},
    {
        $set: data
    })
    return result.value
}

module.exports={
    getAll,
    create,
    update,
    supplierProperties
}