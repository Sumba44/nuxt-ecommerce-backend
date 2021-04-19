const express = require("express");
const app = express();
const Cors = require("cors");
const rateLimit = require("express-rate-limit");

// Import routes
const hello = require("./routes/hello");
const apiRouter = require("./routes/public");
const privateRouter = require("./routes/private");
const port = 5050;

app.use(express.json());
app.use(Cors());

app.set("view engine", "ejs");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

app.use("/", hello);
app.use("/api/public", apiRouter);
app.use("/api/private", privateRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
