const database = require("../utils/database")
const {dataPagination} = require("../helperFunction/helper")
async function getAll(page, limit, sort, match={}){
    let pipline = null
    pipline = dataPagination(match, sort, page, limit)
    const result = await database.productModel().aggregate(pipline).toArray()
    return result[0].data
}

module.exports={
    getAll,
}