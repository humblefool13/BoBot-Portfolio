const mongoose = require("mongoose");

module.exports = async () => {
    await mongoose.createConnection(process.env["configs_pass"], {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to \"Wallet Configurations\" database.");
};