commands = [
  {
    name: "create",
    controller: "voucher",
    method: "post",
    api: "/voucher",
    middleware: [],
  },

  {
    name: "update",
    controller: "voucher",
    method: "put",
    api: "/voucher/:code",
    middleware: [],
  },
  {
    name: "getAll",
    controller: "voucher",
    method: "get",
    api: "/voucher",
    middleware: ["authentication"],
  },
  {
    name: "claim",
    controller: "voucher",
    method: "post",
    api: "/claim/:code",
    middleware: ["authentication"],
  },
];
module.exports = commands;
