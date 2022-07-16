const categoryCol = require('../dataModel/categoryCol')


async function getAll(req, res) {
    const data = await categoryCol.getAll()
    if(!data){
        return res.json({ errorCode: true, data: "system error" })
    }
    return res.json({ errorCode: null, data })
}

module.exports = {
    getAll,
}