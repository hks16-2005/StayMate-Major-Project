const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


let DB_URL = 'mongodb://127.0.0.1:27017/staymate';
async function main(){
    await mongoose.connect(DB_URL);
}

main()
.then(() => {
    console.log("Connection made successful");
})
.catch((err) => {
    console.log(err);
})

async function dbInit(){
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Success! db was initialized");
}

dbInit()