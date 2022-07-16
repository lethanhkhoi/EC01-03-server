commands = [
    {
        name: "update",
        controller: "cart",
        method: "patch",
        api: "/cart/:code",
        middleware: []
    },
    {
        name: "getAll",
        controller: "cart",
        method: "get",
        api: "/cart",
        middleware: []
    },
]
module.exports = commands