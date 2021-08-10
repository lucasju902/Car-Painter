const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const http = require("http");
const requestLogger = require("./middlewares/requestLogger");

const config = require("./config");
const routes = require("./routes");
const SocketServer = require("./utils/socket");

app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/", express.static(path.join(__dirname, "../build")));
app.use("/api", requestLogger, routes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const server = http.createServer(app);
new SocketServer(server);

const port = config.port;
server.listen(port, () => console.log(`server is running on port ${port}`));
