const cartCol = require('../dataModel/cartCol')
const productCol = require("../dataModel/productCol");
const ObjectId = require("mongodb").ObjectId;

async function getAll(req, res) {
    const data = await cartCol.getAll()
    return res.json({ errorCode: null, data })
}

async function create(req,res){
    const data = req.body
    
}

module.exports = {
    getAll,
}