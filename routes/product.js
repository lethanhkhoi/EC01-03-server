commands = [
    {
        name: "getAll",
        controller: "product",
        method: "get",
        api: "/product",
        middleware: []
    },
    {
        name: "create",
        controller: "product",
        method: "post",
        api: "/product",
        middleware: ["authentication"]
    }
]
module.exports = commands