const express = require("express");
const router = express.Router();
const crypto = require("crypto");





// Models & Middleware
const isloggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const orderModel = require("../models/order-model");

// Home Page
router.get("/", (req, res) => {
  res.render("index", { error: req.flash("error"), loggedin: false });
});

// Shop Page with Filters & Sorting

router.get("/shop", isloggedin, async (req, res) => {
  const { category, discount, available, sortby } = req.query;
  let filter = {};
  let sort = {};

  if (category === "new") filter.new = true;
  if (category === "discounted" || discount === "true") filter.discount = { $gt: 0 };
  if (available === "true") filter.stock = { $gt: 0 };

  if (sortby === "price-asc") sort.price = 1;
  else if (sortby === "price-desc") sort.price = -1;
  else if (sortby === "popular") sort.createdAt = -1;

  try {
    const user = await userModel.findById(req.user._id); // ✅ must be defined
    const products = await productModel.find(filter).sort(sort);

    res.render("shop", {
      products,
      success: req.flash("success"),
      query: req.query,
      user, // ✅ this must not be undefined
    });
  } catch (err) {
    console.error("Error loading shop page:", err);
    res.status(500).send("Something went wrong loading the shop.");
  }
});

router.get("/deleteproduct/:id", isloggedin, async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted successfully");
    res.redirect("/shop");
  } catch (err) {
    console.error("Error deleting product:", err);
    req.flash("error", "Failed to delete product");
    res.redirect("/shop");
  }
});

// Wishlist Page
router.get("/wishlist", isloggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate("wishlist");
    res.render("wishlist", {
      wishlistItems: user.wishlist,
      success: req.flash("success"),
    });
  } catch (err) {
    console.error("Error loading wishlist:", err);
    res.redirect("/shop");
  }
});

// Add to Wishlist
router.get("/wishlist/add/:id", isloggedin, async (req, res) => {
  const user = await userModel.findById(req.user._id);
  const productId = req.params.id;

  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }

  req.flash("success", "Added to wishlist!");
  res.redirect("/shop");
});

// Remove from Wishlist
router.get("/wishlist/remove/:id", isloggedin, async (req, res) => {
  const user = await userModel.findById(req.user._id);
  user.wishlist = user.wishlist.filter(p => p.toString() !== req.params.id);
  await user.save();

  req.flash("success", "Removed from wishlist.");
  res.redirect("/wishlist");
});





// Product Image
router.get("/product-image/:id", async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (!product || !product.image) return res.status(404).send("Image not found");
  res.set("Content-Type", "image/png");
  res.send(product.image);
});

// Cart Page
router.get("/cart", isloggedin, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email }).populate("cart");

  const quantityMap = {};
  user.cart.forEach(p => {
    const id = p._id.toString();
    quantityMap[id] = (quantityMap[id] || 0) + 1;
  });

  const uniqueItems = Object.keys(quantityMap).map(id => {
    const product = user.cart.find(p => p._id.toString() === id);
    const quantity = quantityMap[id];
    const net = (product.price - product.discount + 20) * quantity;
    return { ...product._doc, quantity, net };
  });

  const cartTotal = uniqueItems.reduce((sum, item) => sum + item.net, 0);

  res.render("cart", {
    cartItems: uniqueItems,
    cartTotal,
    razorpayKey: "rzp_test_OZrFAcL6k5KA07",
  });
});

// Add to Cart
router.get("/addtocart/:productid", isloggedin, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added to Cart");
  res.redirect("/shop");
});

// Increase/Decrease/Remove
router.get("/cart/increase/:productid", isloggedin, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  res.redirect("/cart");
});

router.get("/cart/decrease/:productid", isloggedin, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  const index = user.cart.findIndex(id => id.toString() === req.params.productid);
  if (index !== -1) user.cart.splice(index, 1);
  await user.save();
  res.redirect("/cart");
});

router.get("/cart/remove/:productid", isloggedin, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  user.cart = user.cart.filter(p => p.toString() !== req.params.productid);
  await user.save();
  req.flash("success", "Item removed from cart.");
  res.redirect("/cart");
});

router.get('/removefromcart/:id', isloggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const productId = req.params.id;

    // Remove only one occurrence of the product from cart
    const index = user.cart.indexOf(productId);
    if (index > -1) {
      user.cart.splice(index, 1);
      await user.save();
    }

    res.redirect('/shop');
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.redirect('/shop');
  }
});


// Razorpay Payment Verification
// Razorpay Payment Verification
router.post("/verify-payment", isloggedin, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", "6E1IAVhpq83uRoIy4nWnH3cY") // ✅ Replace this with your actual secret
    //.createHmac("sha256", process.env.RAZORPAY_SECRET)  // ✅ safer if you use dotenv
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const user = await userModel.findOne({ email: req.user.email }).populate("cart");

    // Calculate quantities
    const quantityMap = {};
    user.cart.forEach(p => {
      const id = p._id.toString();
      quantityMap[id] = (quantityMap[id] || 0) + 1;
    });

    // Generate items list for order
    const orderItems = Object.keys(quantityMap).map(id => {
      const product = user.cart.find(p => p._id.toString() === id);
      return {
        productId: product._id,
        name: product.name,
        price: product.price - product.discount + 20,
        quantity: quantityMap[id],
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await orderModel.create({
      user: user._id,
      items: orderItems,
      amount: totalAmount,
      status: "Paid",
      paymentId: razorpay_payment_id,
    });

    user.cart = [];
    await user.save();

    return res.redirect("/order-history");
  }

  res.redirect("/order-failure");
});


// Manual Order (optional)
router.get("/order-success", isloggedin, async (req, res) => {
  res.render("order-success");
});

// My Account Pages
router.get("/myaccount", isloggedin, async (req, res) => {
  const fullUser = await userModel.findById(req.user._id); // Must include timestamps
  console.log("User createdAt:", fullUser.createdAt); // ✅ Check this
  res.render("myaccount", { user: fullUser });
});




router.get("/edit-profile", isloggedin, (req, res) => {
  res.render("edit-profile", { user: req.user });
});

router.post("/edit-profile", isloggedin, async (req, res) => {
  const user = await userModel.findById(req.user._id);
  user.fullname = req.body.name; // ✅ Use fullname
  await user.save();
  res.redirect("/myaccount");
});




router.get("/change-password", isloggedin, (req, res) => {
  res.render("change-password");
});

router.post("/change-password", isloggedin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!(await req.user.comparePassword(currentPassword))) {
    return res.send("Incorrect current password");
  }
  req.user.password = newPassword;
  await req.user.save();
  res.redirect("/myaccount");
});

// Order History Page
router.get("/order-history", isloggedin, async (req, res) => {
  const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  res.render("order-history", { orders });
});


// Logout
router.get("/logout", isloggedin, (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect("/");
  });
});

module.exports = router;


const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_OZrFAcL6k5KA07", // ✅ Use your actual Razorpay Key ID
  key_secret: "6E1IAVhpq83uRoIy4nWnH3cY", // ✅ Use your actual Razorpay Secret (you've hardcoded it, so keep it here)
});

// Create Order API (used by cart.ejs)
router.post("/create-order", isloggedin, async (req, res) => {
  const amount = req.body.amount * 100; // Razorpay needs amount in paise

  const options = {
    amount,
    currency: "INR",
    receipt: "rcpt_" + Math.floor(Math.random() * 1000000),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).send("Failed to create Razorpay order.");
  }
});