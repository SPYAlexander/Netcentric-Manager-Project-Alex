const mongoose = require("mongoose");

const connectionString = 
"mongodb+srv://Team4:1234@cluster0.glhvt.mongodb.net/TM-T4?retryWrites=true&w=majority";

const connectDB = () => {
  return mongoose.connect(connectionString);
};

module.exports = connectDB;
