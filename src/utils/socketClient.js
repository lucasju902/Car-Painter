import socketIOClient from "socket.io-client";
import config from "config";

class SocketClient {
  static connect = () => {
    this.socket = socketIOClient(config.backendURL);
    console.log("Connecting Socket: ", this.socket, config.backendURL);
  };

  static disconnect = () => {
    this.socket.disconnect();
  };

  static emit = (event, data) => {
    console.log("Emitting: ", event, data);
    this.socket.emit(event, data);
  };

  static on = (event, handler) => {
    this.socket.on(event, handler);
  };
}

export default SocketClient;
