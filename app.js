const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

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


const validateListing = (req,res) => {//function is created using joi validation, This function is passed as middleware to the post and put req routes.
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg = error.details[0].message;
        console.log(errMsg);
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
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
app.post("/listings", validateListing, async (req,res) => {
    // if(!req.body.listing){//This Condition is because if someone tries to make 'put' req through hopscotch/postman which skips the frontend validations.
    //     throw new ExpressError(400 , "Please send a valid data for listing");
    // }

    
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
app.put("/listings/:id", validateListing, async (req,res) => {
    if(!req.body.listing){//This Condition is because if someone tries to make 'put' req through hopscotch/postman which skips the frontend validations. 
        throw new ExpressError(400 , "Please send a valid data for listing");
    }
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

//This middleware runs when the above route does not match with any request.
app.use((req,res) => {
    throw new ExpressError(404,"Page Not Found");
})

app.use((err, req, res, next) => {
    let {status = 500 , message = "Something went wrong"} = err;
    res.status(status).render("./listings/error.ejs",{message});
})





app.listen(8080, () => {
    console.log("listening to port 8080");
})