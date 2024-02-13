const Address = require("../models/addressModel");
const Cart = require("../models/cartModel");

const addAddress = async (req, res) => {
  const { address, city, state, country, email } = req.body;
  const userId = req.headers.id;
  try {
    const cart = await Cart.findOne({ userId, status: 1 });
    const userAddress = await Address.create({
      cartId: cart._id,
      userId,
      address,
      city,
      state,
      country,
      email,
    });
    return res.status(200).json({ status: true, userAddress });
  } catch (err) {
    return res.status(500).json({ status: false, error: err });
  }
};

const getAddress = async (req, res) => {
  const userId = req.headers.id;
  console.log("user", userId);
  try {
    const address = await Address.findOne({ userId });
    return res.status(200).json({ status: true, address });
  } catch (err) {
    return res.status(500).json({ status: false, error: err });
  }
};

const editAddress = async (req, res) => {
  const userId = req.headers.id;
  console.log("body", req.body);
  try {
    const updated = await Address.updateOne(
      { userId },
      {
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
      }
    );
    return res
      .status(200)
      .json({ status: true, message: "Address updated!", updated });
  } catch (err) {
    return res.status(500).json({ status: true, error: err });
  }
};

module.exports = { addAddress, getAddress, editAddress };
