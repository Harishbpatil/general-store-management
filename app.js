
const express = require("express");
const bodyParser = require("body-parser");
const generalRouter = require("./routes/general");

const sequelize = require("./util/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src *; font-src * data:;");
  next();
});

app.use(bodyParser.json());
app.use(express.static("views"));

app.use("/generalstore", generalRouter);

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });
