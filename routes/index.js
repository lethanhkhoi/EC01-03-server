const userCommand = require("./user.js")
const productCommand = require("./product.js")
const categoryCommand = require("./category.js")

const event = [
    userCommand,
    productCommand,
    categoryCommand
]
const controllers = {
    user: require("../controller/user.js"),
    product: require("../controller/product"),
    category: require("../controller/category")
}

const middlewares = {
    authentication: controllers.user.userAuthentication,
    admin: controllers.user.adminAuthentication,
}
const bindRouter = (app) => {
    for (let i = 0; i < event.length; i++) {
        for (let j = 0; j < event[i].length; j++) {
            let { name, controller, method, api, middleware } = event[i][j]
            if (!name) {
                throw new NotImplementedException();
              }
            let _middlewares = [];
            middleware.map(e=>{
                _middlewares.push(middlewares[e])
            })
            if (typeof (controllers[controller] == "function")) {
                app[method](api, ..._middlewares, controllers[controller][name])
            }
        }
    }
}

module.exports = {
    bindRouter,
}
