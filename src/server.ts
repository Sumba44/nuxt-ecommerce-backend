const express = require("express");
const app = express();
import { createConnection } from "typeorm";

const Cors = require("cors");
const rateLimit = require("express-rate-limit");

app.use(express.json());
app.use(Cors());

app.set("view engine", "ejs");

const limiter = rateLimit({
  windowMs: 60 * 1000 * 15, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});



createConnection()
  .then(async () => {
    // Import routes
    const hello = require("./routes/hello");
    const publicRouter = require("./routes/public");

    const privateRouter = require("./routes/private");
    const port = 5050;

    //  apply to all requests
    app.use(limiter);

    app.use("/", hello);
    app.use("/api/public", publicRouter);
    app.use("/api/private", privateRouter);

    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
  })
  .catch(error => console.log(error));

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
