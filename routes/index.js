const userCommand = require("./user.js")
const productCommand = require("./product.js")

const event = [
    userCommand,
    productCommand
]
const controllers = {
    user: require("../controller/user.js"),
    product: require("../controller/product")
}

const middlewares = {

}
const bindRouter = (app) => {
    for (let i = 0; i < event.length; i++) {
        for (let j = 0; j < event[i].length; j++) {
            let { name, controller, method, api, middleware } = event[i][j]
            if (typeof (controllers[controller] == "function")) {
                app[method](api, ...middleware, controllers[controller][name])
            }
        }
    }
}

module.exports = {
    bindRouter,
}
