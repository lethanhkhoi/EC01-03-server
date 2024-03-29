commands = [
  {
    name: "getOne",
    controller: "order",
    method: "get",
    api: "/order/:code",
    middleware: ["authentication"],
  },
  {
    name: "update",
    controller: "order",
    method: "put",
    api: "/order/:code",
    middleware: [],
  },
  {
    name: "history",
    controller: "order",
    method: "get",
    api: "/history",
    middleware: ["authentication"],
  },
  {
    name: "getAll",
    controller: "order",
    method: "get",
    api: "/order",
    middleware: ["authentication"],
  },
  {
    name: "notifyMomo",
    controller: "order",
    method: "post",
    api: "/checkout/notifyMomo",
    middleware: [],
  },
  {
    name: "create",
    controller: "order",
    method: "post",
    api: "/checkout",
    middleware: ["authentication"],
  },
];
module.exports = commands;
