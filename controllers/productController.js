const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

const addProduct = async (req, res) => {
  // console.log("body", req.body);
  const category = req.body.category;
  const sku = req.body.sku;
  const discount = req.body.discount;
  const imagesPaths = req.files.map((item) => {
    return item.path.replaceAll("\\", "/").replace("files/", "");
  });
  try {
    const skuExists = await Product.find({ sku: sku });
    if (skuExists.length > 0) {
      return res.json({ status: false, Error: "sku already exists!" });
    }

    const findCategory = await Category.find({ _id: category });

    const added = await Product.create({
      ...req.body,
      category: {
        name: findCategory[0].name.toLowerCase(),
        id: findCategory[0]._id,
      },
      discount: {
        discount,
      },
      images: imagesPaths,
    });
    return res.json({ status: true, data: added });
  } catch (err) {
    return res.json({ status: false, Error: err });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const resp = await Product.find();
    return res.json({ status: true, data: resp });
  } catch (err) {
    return res.json({ status: false, Error: err });
  }
};

const getSingleProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const resp = await Product.find({ _id: id });
    return res.json({ status: true, data: resp });
  } catch (err) {
    return res.json({ status: false, Error: err });
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const images = {
    images: req.files?.map((item) => {
      return item.path.replaceAll("\\", "/").replace("files/", "");
    }),
  };
  const imagePath = images.images.length > 0 ? images : { images: undefined };
  const bodyData = req.body;
  Object.assign(bodyData, imagePath);
  try {
    const edited = await Product.updateOne({ _id: id }, bodyData);
    return res.json({ status: true, edited });
  } catch (err) {
    return res.json({ status: false, err });
  }
};

const getProductsByCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const products = await Product.find({
      "category.id": id,
    });
    return res.json({ status: true, data: products });
  } catch (err) {
    return res.json({ status: false, Error: err });
  }
};

const deleteSingleProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.deleteOne({ _id: id });
    return res.json({ status: true, product });
  } catch (err) {
    return res.json({ status: false, Error: err });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  getProductsByCategory,
  deleteSingleProduct,
};
