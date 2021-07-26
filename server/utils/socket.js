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
  }

  async onClientUpdateLayer(socket, data) {
    console.log("client-update-layer", data);
    socket.broadcast.to(socket.room).emit("client-update-layer", data);
    await LayerService.updateById(data.id, data);
  }

  async onClientCreateLayer(socket, data) {
    console.log("client-create-layer", data);
    let layer = await LayerService.create(data);
    socket.broadcast
      .to(socket.room)
      .emit("client-create-layer", layer.toJSON());
  }

  async onClientDeleteLayer(socket, data) {
    console.log("client-delete-layer", data);
    socket.broadcast.to(socket.room).emit("client-delete-layer", data);
    await LayerService.deleteById(data.id);
  }

  async onClientUpdateScheme(socket, data) {
    console.log("client-update-scheme", data);
    socket.broadcast.to(socket.room).emit("client-update-scheme", data);
    await SchemeService.updateById(data.id, data);
  }
}

module.exports = SocketServer;
