function test (req,res){
    console.log("HELLO")
    return res.json({
        data: "Data from server"
    })
}

module.exports={
    test
}