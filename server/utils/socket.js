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

  async onClientUpdateLayer(socket, requestData) {
    socket.broadcast.to(socket.room).emit("client-update-layer", requestData);
    await LayerService.updateById(requestData.data.id, requestData.data);
  }

  async onClientCreateLayer(socket, requestData) {
    socket.broadcast.to(socket.room).emit("client-create-layer", requestData);
  }

  async onClientDeleteLayer(socket, requestData) {
    socket.broadcast.to(socket.room).emit("client-delete-layer", requestData);
    await LayerService.deleteById(requestData.data.id);
  }

  async onClientUpdateScheme(socket, requestData) {
    socket.broadcast.to(socket.room).emit("client-update-scheme", requestData);
    await SchemeService.updateById(requestData.data.id, requestData.data);
  }
}

module.exports = SocketServer;
