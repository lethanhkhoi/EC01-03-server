commands = [
    {
        name: "getAll",
        controller: "cart",
        method: "get",
        api: "/cart",
        middleware: []
    },

    {
        name: "deleteCart",
        controller: "cart",
        method: "patch",
        api: "/cart/:code/deleteCart",
        middleware: ["authentication"]
    },
    {
        name: "create",
        controller: "cart",
        method: "post",
        api: "/cart",
        middleware: ["authentication"]
    },
    
    {
        name: "update",
        controller: "cart",
        method: "patch",
        api: "/cart/:code",
        middleware: ["authentication"]
    }
]
module.exports = commands