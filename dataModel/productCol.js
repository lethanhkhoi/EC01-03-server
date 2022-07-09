const database = require("../utils/database")
const {dataPagination} = require("../helperFunction/helper")
const creatValidation =[
    "name",
    "categoryId",
    "price",
    "sale",
    "dimension",
    "warranty",
    "description",
    "stock",
    "sold",
    "color"
]
async function getAll(page, limit, sort, match={}){
    let pipline = null
    pipline = dataPagination(match, sort, page, limit)
    const result = await database.productModel().aggregate(pipline).toArray()
    return result[0].data
}
async function create (data) {
    data["createdAt"] = new Date()
    return await database.productModel().insertOne(data)
}

module.exports={
    creatValidation,
    getAll,
    create
}