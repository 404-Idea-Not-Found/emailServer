require("dotenv").config();
if (process.env.NODE_ENV !== "test") {
  require("./config/mongoose");
}

const path = require("path");

const cookieParser = require("cookie-parser");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");

const mailJobRouter = require("./routes/mailJob");

const app = express();

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/mail-job", mailJobRouter);

app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.json({
    result: error.result,
    errorMessage: error.message,
  });
});

module.exports = app;
