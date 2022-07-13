const cartCol = require('../dataModel/cartCol')


async function getAll(req, res) {
    const data = await categoryCol.getAll()
    return res.json({ errorCode: null, data })
}

module.exports = {
    getAll,
}