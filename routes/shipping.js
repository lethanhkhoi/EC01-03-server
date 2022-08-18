commands = [
  {
    name: "create",
    controller: "shipping",
    method: "post",
    api: "/shipping",
    middleware: [],
  },
  {
    name: "getAll",
    controller: "shipping",
    method: "get",
    api: "/shipping",
    middleware: [],
  },
];
module.exports = commands;
