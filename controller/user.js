function test (req,res){
    return res.json({
        data: "Data from server"
    })
}

module.exports={
    test
}