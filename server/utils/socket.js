const socket = require("socket.io");
const LayerService = require("../services/layerService");
const SchemeService = require("../services/schemeService");

class SocketServer {
  constructor(server) {
    this.io = socket(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.shapes = [];
    this.io.on("connection", this.onConnection.bind(this));
    global.io = this.io;
  }
  initClient(socket) {
    console.log("New client connected");
  }
  onConnection(socket) {
    this.initClient(socket);
    socket.on("room", (room) => {
      socket.room = room;
      socket.join(room);
    });
    socket.on("client-create-layer", (data) =>
      this.onClientCreateLayer.bind(this)(socket, data)
    );
    socket.on("client-update-layer", (data) =>
      this.onClientUpdateLayer.bind(this)(socket, data)
    );
    socket.on("client-delete-layer", (data) =>
      this.onClientDeleteLayer.bind(this)(socket, data)
    );
    socket.on("client-update-scheme", (data) =>
      this.onClientUpdateScheme.bind(this)(socket, data)
    );
    socket.on("client-delete-scheme", (data) =>
      this.onClientDeleteScheme.bind(this)(socket, data)
    );
  }

  async onClientUpdateLayer(socket, requestData) {
    socket.broadcast.to(socket.room).emit("client-update-layer", requestData);
    await LayerService.updateById(requestData.data.id, requestData.data);
    const schemeUpdatePayload = {
      date_modified: Math.round(new Date().getTime() / 1000),
      last_modified_by: requestData.userID,
      thumbnail_updated: 0,
      race_updated: 0,
    };
    await SchemeService.updateById(socket.room, schemeUpdatePayload);
    this.io.sockets.in(socket.room).emit("client-update-scheme", {
      ...requestData,
      data: { id: socket.room, ...schemeUpdatePayload },
    });
  }

  async onClientCreateLayer(socket, requestData) {
    socket.broadcast.to(socket.room).emit("client-create-layer", requestData);
    const schemeUpdatePayload = {
      date_modified: Math.round(new Date().getTime() / 1000),
      last_modified_by: requestData.userID,
      thumbnail_updated: 0,
      race_updated: 0,
    };
    await SchemeService.updateById(socket.room, schemeUpdatePayload);
    this.io.sockets.in(socket.room).emit("client-update-scheme", {
      ...requestData,
      data: { id: socket.room, ...schemeUpdatePayload },
    });
  }

  async onClientDeleteLayer(socket, requestData) {
    socket.broadcast.to(socket.room).emit("client-delete-layer", requestData);
    await LayerService.deleteById(requestData.data.id);
    const schemeUpdatePayload = {
      date_modified: Math.round(new Date().getTime() / 1000),
      last_modified_by: requestData.userID,
      thumbnail_updated: 0,
      race_updated: 0,
    };
    await SchemeService.updateById(socket.room, schemeUpdatePayload);
    this.io.sockets.in(socket.room).emit("client-update-scheme", {
      ...requestData,
      data: { id: socket.room, ...schemeUpdatePayload },
    });
  }

  async onClientUpdateScheme(socket, requestData) {
    try {
      socket.broadcast
        .to(socket.room)
        .emit("client-update-scheme", requestData);
      socket.broadcast.to("general").emit("client-update-scheme", requestData); // Broadcast to General room
      await SchemeService.updateById(requestData.data.id, {
        ...requestData.data,
        last_modified_by: requestData.userID,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async onClientDeleteScheme(socket, requestData) {
    socket.broadcast.to(socket.room).emit("client-delete-scheme");
    socket.broadcast
      .to("general")
      .emit("client-delete-scheme", { data: { id: socket.room } }); // Broadcast to General room
    await SchemeService.deleteById(requestData.data.id);
  }
}

module.exports = SocketServer;
