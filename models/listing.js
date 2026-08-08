const mongoose = require("mongoose");
const { min } = require("../schema");
const { required } = require("joi");

const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
         
    },
    description: {
        type: String,
         
    },
    image: {
        type: String,
        default: "https://plus.unsplash.com/premium_photo-1687710306899-10a3bfcacf9b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => 
            v===""?"https://plus.unsplash.com/premium_photo-1687710306899-10a3bfcacf9b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            :v,
    },
    price: {
        type: Number,
        min: 0,
         
    },
    location: {
        type: String,
         
    },
    country: {
        type: String,
         
    },
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;