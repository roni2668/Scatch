const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owner-model");


 if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
   let owners = await ownerModel.find();
   if(owners.length > 0) {
    return res
    .status(504)
    .send("You dont have permissions to create an new owner");
   }

   
let {fullname, email, password} = req.body;

let createdOwner = await ownerModel.create({
    fullname,
    email,
    password,
});
  res.status(201).send(createdOwner);
});
}

// router.get("/admin", function(req, res){
//   let success = req.flash("success");
//    res.render("createproducts", { success: "" });

// });

router.get("/admin", function (req, res) {
  res.render("createproducts", {
    success: req.flash("success") || ""
  });
});


router.post("/products/create", function(req, res){
    res.render("createproducts"); // or some value
});


// router.get("owners/products/create", function(req, res){
//    res.render("createproducts");

// });
module.exports = router;
