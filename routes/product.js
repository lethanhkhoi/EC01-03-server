commands = [
    {
        name: "getAll",
        controller: "product",
        method: "get",
        api: "/product",
        middleware: []
    },
    {
        name: "deleteProduct",
        controller: "product",
        method: "patch",
        api: "/product/:code/deleteProduct",
        middleware: ["authentication"]
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
    },
    {
        name: "rating",
        controller: "product",
        method: "patch",
        api: "/productRating/:code",
        middleware: ["authentication"]
    }

]
module.exports = commands