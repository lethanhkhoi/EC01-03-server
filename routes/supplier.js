commands = [
  {
    name: "getAll",
    controller: "supplier",
    method: "get",
    api: "/supplier",
    middleware: [],
  },
  {
    name: "update",
    controller: "supplier",
    method: "put",
    api: "/supplier/:code",
    middleware: [],
  },
  {
    name: "create",
    controller: "supplier",
    method: "post",
    api: "/supplier",
    middleware: ["authentication"],
  },
];
module.exports = commands;
