require("./config/config");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const { log } = require("./utils/helpers/logger");

const app = express();
const PORT = process.env.PORT || 3000;

//connection from db here
db.connect(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//  adding routes
require("./routes")(app);

app.on("ready", () => {
  app.listen(PORT, () => {
    log.info(`Server is running on port ${PORT}`);
  });
});

module.exports = app;
