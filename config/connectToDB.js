const mongoose = require("mongoose");
const {MongoClient, ServerApiVersion} = require("mongodb");

const connectToDB = async() => {
    try{
        await mongoose.connect("mongodb+srv://mhamza7265:42mongo68@cluster0.5nu3crx.mongodb.net/node-ecommerce?retryWrites=true&w=majority", { family: 4});
        console.log("Connected to DB")
    }catch(err){
        console.log(err)
    }
}

module.exports = connectToDB;