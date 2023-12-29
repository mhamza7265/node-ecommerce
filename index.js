const express = require("express");
const connectToDB = require("./config/connectToDB");
const multer = require("multer");
const cors = require("cors");
const storageEngine = multer.diskStorage({
  destination: "./files/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const upload = multer({ storage: storageEngine });

const {
  addCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("./controllers/categoryController");

const {
  addProduct,
  getAllProducts,
  getProductsByCategory,
  deleteSingleProduct,
  getSingleProduct,
  updateProduct,
} = require("./controllers/productController");

const {
  createCategoryValidation,
  handleValidationErrors,
} = require("./validations/categoryValidation");

const {
  createProductValidation,
  handleProductValidationErrors,
} = require("./validations/productValidation");

/*************************************************************************************************************/

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("files"));

connectToDB();

//route
app.get("/", async(req, res) => {
  return res.json("Hello World!");
});

app.post(
  "/category/add",
  upload.any(),
  createCategoryValidation,
  handleValidationErrors,
  addCategory
);
app.get("/category", getAllCategories);
app.get("/category/:id", getSingleCategory);
app.put("/category/:id", upload.any(), updateCategory);
app.delete("/category/:id", deleteCategory);

app.post(
  "/product/add",
  upload.any(),
  createProductValidation,
  handleProductValidationErrors,
  addProduct
);
app.get("/product", getAllProducts);
app.get("/product/single/:id", getSingleProduct);
app.get("/product/:id", getProductsByCategory);
app.delete("/product/:id", deleteSingleProduct);
app.put("/product/:id", upload.any(), updateProduct);

app.listen("3000", () => console.log("Server started on port 3000"));
