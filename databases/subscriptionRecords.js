const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.createConnection(process.env["sub_records_pass"], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to \"Subscription Records\" database.");
};