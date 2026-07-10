const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function ConnectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoDB is connected Successfully ");
  } catch (err) {
    console.log(err);
  }
}


module.exports = ConnectDB;