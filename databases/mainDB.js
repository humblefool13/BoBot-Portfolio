const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect(process.env["free_trials_pass"], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to database.");
};