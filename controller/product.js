const productCol = require('../dataModel/productCol')
const recordPerPage = 10
const defaultPage = 1

async function getAll(req, res) {
    const page = req.query.page ?? defaultPage
    const limit = req.query.limit ?? recordPerPage
    const sortBy = {
        createdAt: -1
    }
    const data = await productCol.getAll(page, limit, sortBy)
    if(!data){
        return res.json({errorCode: true, data: "System error"})
    }
    return res.json({ errorCode:null, data })
}

async function create(req,res) {
    let data = req.body
    const user = req.user
    for (property of productCol.creatValidation){
        if(!data[property]){
            return res.json({errorCode: true, data: `Please input ${property}`})
        }
    }
    data.rate = null
    data.seller = user.email
    data.createdAt = new Date()
    data.image = req.body.image ?? []
    const product = await productCol.create(data)
    if (!product){
        return res.json({errorCode: true, data: "System error"})
    }
    return res.json({errorCode: null, data: data})
}

module.exports = {
    getAll,
    create
}