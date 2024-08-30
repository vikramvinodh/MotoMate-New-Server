const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

mongoose.set('strictQuery', false);
const connectToMongo = () => {
  mongoose.connect(
    process.env.MONGODB_URL,
    (err) => {
      if (err) console.log(err, "Error connecting to database")
      else console.log("mongodb is connected");
    } 
  );
}

module.exports = connectToMongo;