const Category = require("../models/categoryModel");

const addCategory = async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const image = req.files[0].path.replaceAll("\\", "/").replace("files/", "");
  try {
    const created = await Category.create({
      isActive: true,
      products: [],
      name,
      description,
      image,
      created: Date(),
      slug: req.body.name.toLowerCase(),
    });
    return res.json({ status: true, data: created });
  } catch (err) {
    return res.json({ status: false, Error: err });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const resp = await Category.find();
    return res.json({ status: true, categories: resp });
  } catch (err) {
    await res.json({ status: false, Error: err });
  }
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const image = {
    image: req.files[0]?.path.replaceAll("\\", "/").replace("files/", ""),
  };
  const bodyData = req.body;
  Object.assign(bodyData, image);
  try {
    const updated = await Category.updateOne({ _id: id }, bodyData);
    return res.json({ status: true, updated });
  } catch (err) {
    return res.json({ status: false, Error: err });
  }
};

const getSingleCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const curProduct = await Category.findOne({ _id: id });
    return res.json({ status: true, curProduct });
  } catch (err) {
    return res.json({ status: false, Error: err });
  }
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Category.deleteOne({ _id: id });
    return res.json({ status: true, data: deleted });
  } catch (err) {
    return res.json({ status: false, Error: err });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  updateCategory,
  getSingleCategory,
  deleteCategory,
};
