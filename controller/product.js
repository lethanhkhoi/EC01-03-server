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
    return res.json({ data })
}

module.exports = {
    getAll,
}