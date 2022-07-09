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
    },
    {
        name: "update",
        controller: "product",
        method: "patch",
        api: "/product/:code",
        middleware: ["authentication"]
    }
]
module.exports = commands