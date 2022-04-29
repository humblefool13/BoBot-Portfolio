const mongoose = require("mongoose");

module.exports = async () => {
  mongoose.createConnection(process.env["sub_records_pass"], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to \"Subscription Records\" database.");
};