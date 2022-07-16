commands = [
  {
    name: "getAll",
    controller: "voucher",
    method: "get",
    api: "/voucher",
    middleware: [],
  },
  {
    name: "create",
    controller: "voucher",
    method: "post",
    api: "/voucher/:code",
    middleware: ["authentication"],
  },
  {
    name: "update",
    controller: "voucher",
    method: "put",
    api: "/voucher/:code",
    middleware: [],
  },
];
module.exports = commands;
