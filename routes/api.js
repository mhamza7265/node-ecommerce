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
} = require("../controllers/productController");

const {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUser,
} = require("../controllers/userController");

const {
  createCart,
  getAllProductsFromCart,
  deleteProductFromCart,
  deleteCart,
} = require("../controllers/cartController");

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

app.post("/register", userValidation, handleUserValidationErrors, registerUser);
app.post("/login", loginUser);

app.use(upload.any(), authMiddleware); //auth middleware
app.get("/users", getAllUsers);
app.get("/user", getCurrentUser);

app.post("/cart", createCart);
app.get("/cart", getAllProductsFromCart);
app.delete("/cart", deleteProductFromCart);
app.delete("/cart/:cartId", deleteCart);

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
