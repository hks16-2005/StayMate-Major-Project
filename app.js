const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//set fuctions changes the setting of this application.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

//middleware
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

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


//Index Route
app.get("/listings",async (req,res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
});


//New Route (Brings the form for entering new listing)
app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
})

//Show Route(Particular Listing Details)
app.get("/listings/:id",async (req,res) => {
    let {id} = req.params;

    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//Create Route
app.post("/listings",async (req,res) => {

    let newListing = new Listing(req.body.listing);
    await newListing.save();


    // can use this method(Model.insertOne())
    // let newListing = req.body.listing;
    // console.log(newListing);
    // await Listing.insertOne(newListing);


    res.redirect("/listings");
})

//edit Route(opens the form to edit listing)
app.get("/listings/:id/edit",async (req,res) => {
    const {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//update route (to make changes in the listing)
app.put("/listings/:id",async (req,res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
})

//delete route
app.delete("/listings/:id",async (req,res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

// app.get("/testListing",async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "Behind is the beach",
//         price: 15000,
//         location: "Mysuru, Banglore",
//         country: "India"
//     });

//     await sampleListing.save();
//     res.send("Working Properly");
// })

app.get("/",(req,res) => {
    res.send("Root is Working.");
})

app.listen(8080, () => {
    console.log("listening to port 8080");
})