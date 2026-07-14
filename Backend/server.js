require("dotenv").config();
const app = require("./src/app");
const ConnectDB = require("./src/DataBase/DB")

ConnectDB();

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port : ${process.env.PORT}`);
});
