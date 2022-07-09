const database = require("../utils/database")

async function getAll(){
    return await database.categoryModel().find().toArray()
}

module.exports={
    getAll,
}