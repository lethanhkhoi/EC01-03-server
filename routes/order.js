commands =[
    {
        name: "getAll",
        controller: "order",
        method: "get",
        api: "/order",
        middleware: []
    },
    {
        name: "create",
        controller: "order",
        method: "post",
        api: "/checkout",
        middleware: []
    },
]
module.exports = commands