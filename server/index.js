const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const requestLogger = require("./middlewares/requestLogger");

const config = require("./config");
const routes = require("./routes");

app.use(cors());
app.use(bodyParser.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/", express.static(path.join(__dirname, "../build")));
app.use("/api", requestLogger, routes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const port = config.port;
app.listen(port, () => console.log(`server is running on port ${port}`));
