const express = require("express");
const router = express.Router();
//const { registerUser } = require("../controllers/authController");
const isloggedin = require("../middlewares/isLoggedin");
const {
    registerUser,
    loginUser,
    logout,
 } = require("../controllers/authController");



router.get("/", function(req, res){
    res.send("hey its working");
});

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/logout", logout);

module.exports = router;


// router.post("/register", registerUser);
// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { registerUser } = require("../controllers/authController");

// router.get("/", function(req, res) {
//     res.send("hey it's working");
// });

// router.post("/register", registerUser);

// module.exports = router;
