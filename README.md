# 🌟 SCatch – An Online E-Commerce Platform

**SCatch** is a full-featured e-commerce web application built with **Node.js**, **Express**, **MongoDB**, and **EJS**. It allows users to browse products, manage carts and wishlists, and place orders via **Razorpay payment gateway** with signature verification and secure order storage. It also supports light/dark theme toggle, order history, and profile editing.

---

## 📸 Screenshots

| Login Page | Shop Page | Cart Page |
|------------|-----------|-----------|
| ![Login]

  <img width="955" alt="image" src="https://github.com/user-attachments/assets/e9a93dea-bdb7-4c02-a58e-987e80311015" />

| ![Shop]

  <img width="957" alt="image" src="https://github.com/user-attachments/assets/b5c8607d-433c-479f-8de6-a5f3879b5ef9" />

| ![Cart]

  <img width="945" alt="image" src="https://github.com/user-attachments/assets/d97257f7-9438-4297-8959-c191f96921d8" />


| Order History Page | Payment Page | Payment Success Page |
|--------------------|--------------|----------------------|
| ![Order History]

   <img width="957" alt="image" src="https://github.com/user-attachments/assets/ed861de4-10df-4da7-abc1-bb10680345e5" />

  ![Payment Page]

   <img width="956" alt="image" src="https://github.com/user-attachments/assets/7c01112f-f42b-43c9-be9d-7170373c2821" />


  ![Payment Success ]

   <img width="948" alt="image" src="https://github.com/user-attachments/assets/0cf24a8f-5bf3-499a-a306-edfa2f398c02" />


---

## 🚀 Features

- 🛍️ Product browsing with filters: **New**, **Discounted**, **In Stock**
- ❤️ Add/remove products from Wishlist
- 🛒 Cart with dynamic quantity management (+/-)
- 👤 Secure User authentication and session support
- 🔐 Protected routes for logged-in users
- 📦 Order placement with complete **Razorpay** payment flow
- 🧾 Order history with timestamps
- 🌗 Light/Dark theme toggle for better accessibility
- 🖼️ Image upload and serving for product images
- 🔧 Admin-only product management (manually extendable)

---

## 🧰 Tech Stack

| Layer       | Tech Stack                        |
|-------------|-----------------------------------|
| Backend     | Node.js, Express.js               |
| Frontend    | EJS Templating, Tailwind CSS      |
| Database    | MongoDB + Mongoose ODM            |
| Authentication | Passport.js, express-session   |
| Payment     | Razorpay API Integration          |
| Uploads     | Multer                            |
| UI Styling  | Tailwind CSS                      |

---

## 📁 Project Structure

SCatch/
├── config/ # Mongoose connection config
├── controllers/ # Passport auth logic
├── middlewares/ # isLoggedIn, isAdmin checks
├── models/ # Mongoose models (User, Product, Order)
├── public/ # Static assets (CSS, JS, product images)
├── routes/ # All Express routes
├── utils/ # Razorpay helpers, encryption
├── views/ # EJS templates
│ ├── partials/ # head.ejs, header, footer
│ └── *.ejs # cart, wishlist, shop, etc.
├── .env # Environment variables
├── .gitignore # Ignored files (node_modules, .env)
├── app.js # Entry point
└── package.json # Project metadata

markdown
Copy
Edit

---

## 🔐 Razorpay Payment Integration

This app uses **Razorpay** for secure checkout and order handling.

### 🔧 Setup Steps

1. **Create Razorpay Account**  
   Sign up at [https://razorpay.com](https://razorpay.com) and go to **API Keys** under Dashboard.

2. **Generate API Keys**  
   - `RAZORPAY_KEY_ID` (public key for frontend)
   - `RAZORPAY_SECRET` (secret key for backend)

3. **Add to `.env` File**:
   ```env
   RAZORPAY_KEY_ID=rzp_test_your_key
   RAZORPAY_SECRET=your_secret_key
💳 Payment Flow (Secure)
User clicks "Pay Now" in the Cart page.

Frontend calls /create-order (POST) — this route:

Instantiates Razorpay with key_id and key_secret

Creates a Razorpay order and sends the ID to frontend

Razorpay Popup Opens:

Pre-fills user details

Accepts payment

Frontend receives response (with payment_id, order_id, signature) and calls /verify-payment (POST) to backend.

Backend verifies signature:

js
Copy
Edit
const expected = crypto.createHmac("sha256", RAZORPAY_SECRET)
  .update(`${order_id}|${payment_id}`)
  .digest("hex");
If valid:

Saves the order in MongoDB (orderModel)

Clears the cart

Redirects user to /order-history

✅ This makes the payment flow secure, verified, and fully persistent.

🧪 How to Run the Project
✅ Prerequisites
Node.js & npm installed

MongoDB (local or hosted via MongoDB Atlas)

Razorpay developer account

⚙ Installation
bash
Copy
Edit
git clone https://github.com/roni2668/SCatch.git

cd SCatch
npm install
🌐 Environment Setup
Create a .env file:

env
Copy
Edit
PORT=3000
MONGODB_URI=mongodb://localhost:27017/scatch
SESSION_SECRET=my_secret_session_key
RAZORPAY_KEY_ID=rzp_test_yourkey
RAZORPAY_SECRET=your_secret_key
🚀 Start the Server
bash
Copy
Edit
npm run dev
Open http://localhost:3000 in your browser

🛡 Security Best Practices
✅ Passwords hashed via passport-local-mongoose

✅ Razorpay secret never exposed on frontend

✅ Cart/order operations fully authenticated

🔒 Protect admin product routes (future upgrade)

⚠ Never commit .env file or real keys to GitHub

🙌 Author
Roni Mandal
Full Stack Developer | Java | Node.js | Spring Boot | MongoDB
📍 Kolkata, West Bengal
🎯 Passionate about solving real-world problems
⚽ Football lover | 🎵 Music enthusiast

📃 License
MIT License – feel free to use or modify for personal and learning purposes.

📌 Future Enhancements
✅ Admin dashboard UI for managing products

🎟️ Coupon codes / promotions

📦 Real-time order tracking

🔍 Product search with fuzzy logic

🐳 Dockerization for deployment
