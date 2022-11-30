const mongoose = require("mongoose")

const {MONGO_URI} = process.env;

exports.connect = () => {
    // connecting to the database 

    mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("successfully connected to the database");
    })
    .catch((error) => {
        console.log("database connection failed. existing now...");
        console.log(error);
        process.exit(1)
    })
}