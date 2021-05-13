var fs = require("fs");
const helper = require("./helpers");

exports.log = (type, log, err) => {
  const logFile = fs.createWriteStream("X:/backend-" + helper.yyyymmdd() + ".log", {
    flags: "a"
  });

  logFile.write(new Date().toLocaleString() + " | " + type + " | " + log + " | " + err + "\r\n");
};
