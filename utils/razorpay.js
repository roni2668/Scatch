const Razorpay = require('razorpay');

// DIRECTLY provide your Razorpay key and secret here
const instance = new Razorpay({
  key_id: 'rzp_test_ECzWmVPxnp5Cgu', // 👈 Replace with your actual test key ID
  key_secret: '7USd8wtiXayYdN1bgESBNuNo', // 👈 Replace with your actual test key secret
});

module.exports = instance;
