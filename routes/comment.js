commands = [
    {
      name: "getAll",
      controller: "comment",
      method: "get",
      api: "/comment",
      middleware: [],
    },
    {
      name: "create",
      controller: "comment",
      method: "post",
      api: "/comment",
      middleware: [],
    },
    {
      name: "update",
      controller: "comment",
      method: "put",
      api: "/comment/:code",
      middleware: [],
    },

    {
        name: "deleteComment",
        controller: "comment",
        method: "patch",
        api: "/comment/:code/deleteComment",
        middleware: []
    },
    
  ];
  module.exports = commands;
  