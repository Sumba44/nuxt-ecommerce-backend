const express = require("express");
const app = express();
const Cors = require("cors");

// Import routes
const hello = require("./routes/hello");
const apiRouter = require("./routes/public");
const privateRouter = require("./routes/private");
const port = 5050;

app.use(express.json());
app.use(Cors());

app.set("view engine", "ejs");

app.use("/", hello);
app.use("/api/public", apiRouter);
app.use("/api/private", privateRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
