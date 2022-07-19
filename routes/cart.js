commands = [
    {
        name: "update",
        controller: "cart",
        method: "patch",
        api: "/cart/:code",
        middleware: []
    },
    {
        name: "getOne",
        controller: "cart",
        method: "get",
        api: "/cart",
        middleware: ['authentication']
    },
]
module.exports = commands