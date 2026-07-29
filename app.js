const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

let DB_URL = 'mongodb://127.0.0.1:27017/staymate';
main()
.then(() => {
    console.log("Connected to Db");
})
.catch(err => {
    console.log(err);
})


async function main(){
    await mongoose.connect(DB_URL);
}

app.get("/testListing",async (req,res) => {
    let sampleListing = new Listing({
        title: "My new Villa",
        description: "Behind is the beach",
        price: 15000,
        location: "Mysuru, Banglore",
        country: "India"
    });

    await sampleListing.save();
    res.send("Working Properly");
})

app.get("/",(req,res) => {
    res.send("Root is Working.");
})

app.listen(8080, () => {
    console.log("listening to port 8080");
})