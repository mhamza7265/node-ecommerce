const multer = require("multer");
const express = require("express");

const authMiddleware = require("../middlewares/auth");
const checkRoleMiddleware = require("../middlewares/checkRole");

const {
  createCategoryValidation,
  handleValidationErrors,
} = require("../validations/categoryValidation");
const {
  userValidation,
  handleUserValidationErrors,
} = require("../validations/userValidation");
const {
  createProductValidation,
  handleProductValidationErrors,
} = require("../validations/productValidation");

const {
  cartValidation,
  handleCartValidationErrors,
} = require("../validations/cartValidation");

const {
  addressValidation,
  handleAddressValidationErrors,
} = require("../validations/addressValidation");

const {
  wishlistValidation,
  handleWishlistValidationErrors,
} = require("../validations/wishlistValidation");

const {
  checkoutValidation,
  handleCheckoutValidationErrors,
} = require("../validations/checkoutValidation");

const {
  addCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  addProduct,
  getAllProducts,
  getProductsByCategory,
  deleteSingleProduct,
  getSingleProduct,
  updateProduct,
  filterProducts,
} = require("../controllers/productController");

const {
  registerUser,
  loginUser,
  editUser,
  getAllUsers,
  getCurrentUser,
} = require("../controllers/userController");

const {
  createCart,
  getAllProductsFromCart,
  getCartLength,
  deleteProductFromCart,
  deleteCart,
  checkout,
  getOrderedCart,
  getTotals,
} = require("../controllers/cartController");

const {
  addAddress,
  getAddress,
  editAddress,
} = require("../controllers/addressController");
const {
  createCheckout,
  orderDetails,
  singleOrderDetails,
  orderStatus,
  createPayment,
  paymentIntent,
} = require("../controllers/checkoutController");

const {
  configureWishlist,
  wishlistQuantity,
  getWishlist,
} = require("../controllers/wishlistController");

/**********************************************************************************************************/

const app = express();
const storageEngine = multer.diskStorage({
  destination: "./files/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({ storage: storageEngine });

//routes
app.get("/", async (req, res) => {
  return res.json("Hello World!");
});

app.get("/category", getAllCategories);
app.get("/category/:id", getSingleCategory);

app.get("/product", getAllProducts);
app.get("/product/single/:id", getSingleProduct);
app.get("/product/:id", getProductsByCategory);
app.post("/products/filter", filterProducts);

app.post("/register", userValidation, handleUserValidationErrors, registerUser);
app.post("/login", loginUser);

app.use(upload.any(), authMiddleware); //auth middleware
app.get("/users", getAllUsers);
app.get("/user", getCurrentUser);
app.put("/user", editUser);

app.post("/cart", cartValidation, handleCartValidationErrors, createCart);
app.get("/cart", getAllProductsFromCart);
app.get("/cart/qty", getCartLength);
app.delete("/cart", deleteProductFromCart);
app.delete("/cart/:cartId", deleteCart);
app.put("/checkout", checkout);
app.get("/ordered", getOrderedCart);
app.get("/cart/total", getTotals);

app.post(
  "/checkout",
  checkoutValidation,
  handleCheckoutValidationErrors,
  createCheckout
);
app.get("/orders", orderDetails);
app.get("/order/:orderId", singleOrderDetails);
app.get("/order/status/:orderId", orderStatus);
app.post("/checkout/session", createPayment);
app.post("/create-confirm-intent", paymentIntent);

app.post(
  "/address",
  addressValidation,
  handleAddressValidationErrors,
  addAddress
);
app.get("/address", getAddress);
app.put("/address", editAddress);

app.post(
  "/wishlist",
  wishlistValidation,
  handleWishlistValidationErrors,
  configureWishlist
);
app.get("/wishlist", getWishlist);
app.get("/wishlist/qty", wishlistQuantity);

app.use(upload.any(), checkRoleMiddleware); //checkrole middleware

app.post(
  "/category/add",
  upload.any(),
  createCategoryValidation,
  handleValidationErrors,
  addCategory
);
app.put("/category/:id", upload.any(), updateCategory);
app.delete("/category/:id", deleteCategory);

app.post(
  "/product/add",
  upload.any(),
  createProductValidation,
  handleProductValidationErrors,
  addProduct
);
app.delete("/product/:id", deleteSingleProduct);
app.put("/product/:id", upload.any(), updateProduct);
module.exports = app;
