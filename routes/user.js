commands = [
  {
    name: "getAllAdmin",
    controller: "user",
    method: "get",
    api: "/admin",
    middleware: [],
  },
  {
    name: "getAll",
    controller: "user",
    method: "get",
    api: "/user",
    middleware: [],
  },
  {
    name: "update",
    controller: "user",
    method: "patch",
    api: "/user/:code",
    middleware: [],
  },
  {
    name: "login",
    controller: "user",
    method: "post",
    api: "/login",
    middleware: [],
  },
  {
    name: "register",
    controller: "user",
    method: "post",
    api: "/register",
    middleware: [],
  },
  {
    name: "verify",
    controller: "user",
    method: "get",
    api: "/verify",
    middleware: [],
  },
  {
    name: "deleteAccount",
    controller: "user",
    method: "patch",
    api: "/deleteAccount/:code",
    middleware: ["admin"],
  },
  {
    name: "unban",
    controller: "user",
    method: "patch",
    api: "/unban/:code",
    middleware: ["admin"],
  },
];
module.exports = commands;
