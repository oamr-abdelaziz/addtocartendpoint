const mongoose = require("mongoose");


const MONGOURI = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.sijra.mongodb.net/shopping_sample?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
  
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;