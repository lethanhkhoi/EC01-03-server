commands = [
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
    middleware: ["authentication"],
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
