commands = [
    {
        name: "getAll",
        controller: "cart",
        method: "get",
        api: "/cart",
        middleware: []
    },
    {
        name: "create",
        controller: "cart",
        method: "post",
        api: "/cart",
        middleware: []
    },
    {
        name: "update",
        controller: "cart",
        method: "patch",
        api: "/cart/:code",
        middleware: []
    }
]
module.exports = commands