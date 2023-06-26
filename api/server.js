const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const morgan = require("morgan");
const db = require("./db/dbConn");
const cors = require("cors")

require("dotenv").config();

const app = express();
app.use(cors({
  origin: '*'
})); 

const logStream = fs.createWriteStream("./db/access.log", { flags: "a" });

// making sure the db connection stays open till we dont terminate it or server connection gets closed

app.use((req, res, next) => {
  req.db = db; // attaching db to request object
  next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// for loggin requests
app.use(
  morgan(":method :status :remote-addr", {
    stream: {
      write: (message) => {
        console.log(message);
        logStream.write(message);
      }
    }
  })
);
app.use(routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Wandered a little too far 😸'
  })
})

const PORT = process.env.PORT || 3001;

// on interrupt signal close db
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing db conn", err);
    } else {
      console.log("db connection closed");
    }
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});
