const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productModel");

const configureWishlist = async (req, res) => {
  const userId = req.headers.id;
  try {
    const product = await Product.findOne({ _id: req.body.prodId });
    const wishListItem = await Wishlist.findOne({ productId: req.body.prodId });
    if (wishListItem == null && product !== null) {
      const wishlist = await Wishlist.create({
        userId,
        productId: req.body.prodId,
        product: [product],
      });
      return res.status(200).json({
        status: true,
        wishlist,
        message: "Product added into wishlist!",
      });
    } else if (wishListItem !== null && product !== null) {
      const wishListUpdated = await Wishlist.deleteOne({
        productId: req.body.prodId,
      });
      if (wishListUpdated.acknowledged)
        return res
          .status(200)
          .json({ status: true, message: "Product removed from wishlist" });
    }
  } catch (err) {
    return res.status(500).json({ status: false, error: err });
  }
};

const getWishlist = async (req, res) => {
  const userId = req.headers.id;
  try {
    const wishlist = await Wishlist.find({ userId });
    return res.status(200).json({ status: true, wishlist });
  } catch (err) {
    return res.status(500).json({ status: false, error: err });
  }
};

const wishlistQuantity = async (req, res) => {
  const userId = req.headers.id;
  try {
    const wishlist = await Wishlist.find({ userId });
    return res
      .status(200)
      .json({ status: true, wishlistQuantity: wishlist.length });
  } catch (err) {
    return res.status(500).json({ status: false, error: err });
  }
};

module.exports = { configureWishlist, getWishlist, wishlistQuantity };
