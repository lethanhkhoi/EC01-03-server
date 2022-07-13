const database = require("../utils/database")
const  ObjectID = require('mongodb').ObjectId;

const cartPropoties = [
    "userId",
    "product"
]

async function getAll(){
    return await database.cartModel().find().toArray()
}

async function create(data){
    return await database.cartModel().insertOne(data)
}

module.exports={
    getAll,
}