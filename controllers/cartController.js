const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const {
  configureCart,
  calculate,
  calculateGrands,
} = require("../config/utility");

const createCart = async (req, res) => {
  const userId = req.headers.id;
  const prodId = req.body.id;
  let requestedQuantity = req.body.quantity;
  try {
    const product = await Product.findOne({ _id: prodId });
    if (!product)
      return res.send({ status: false, message: "Cannot find product." });
    console.log("prodid", prodId);
    console.log("prod", product);
    let productQuantity = product.quantity;

    let cartStatusPending = await Cart.findOne({ userId, status: 1 });

    if (productQuantity < requestedQuantity) {
      return res.json({
        status: false,
        error: "This quantity is not available is stocks!",
      });
    }

    if (!cartStatusPending) {
      const cartItem = configureCart(prodId, product, requestedQuantity);

      console.log("cartItem", cartItem);

      try {
        // await Product.updateOne(
        //   { _id: prodId },
        //   { quantity: productQuantity - quantity }
        // );

        const cart = await Cart.create({
          userId,
          status: 1,
          cartItems: [{ [prodId]: cartItem }],
          subTotal: calculate(
            "subTotal",
            requestedQuantity,
            product.price,
            product.discount.discountValue
          ),
          discount: product.discount.discountValue,
          grandTotal: calculate(
            "total",
            requestedQuantity,
            product.price,
            product.discount.discountValue
          ),
        });

        return res.json({ status: true, cart });
      } catch (err) {
        return res.json({ status: false, error: err });
      }
    } else {
      productAlreadyAvailable = false;
      if (cartStatusPending.cartItems[0][prodId] != undefined)
        requestedQuantity += cartStatusPending.cartItems[0][prodId].quantity;
      const updatedCartItem = configureCart(prodId, product, requestedQuantity);
      cartStatusPending.cartItems[0][prodId] = updatedCartItem;
      let calculatedGrands = calculateGrands(cartStatusPending.cartItems[0]);
      try {
        let updatedCart = await Cart.updateOne(
          { _id: cartStatusPending },
          {
            cartItems: cartStatusPending.cartItems,
            subTotal: calculatedGrands.subTotal,
            discount: cartStatusPending.discount,
            grandTotal: calculatedGrands.grandTotal,
          }
        );
        return res.status(200).json({ status: true, cart: cartStatusPending });
      } catch (error) {
        console.error("Error saving cart:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  } catch (err) {
    return res.status(500).json({ status: false, error: err });
  }
};

/******************************************************************************************/

const getAllProductsFromCart = async (req, res) => {
  try {
    const cart = await Cart.find({});
    return res.json({ status: true, cart });
  } catch (err) {
    return res.json({ status: false, error: err });
  }
};

const deleteProductFromCart = async (req, res) => {
  const id = req.headers.id;
  const prodId = req.body.product;
  console.log("id", id);
  try {
    const cart = await Cart.findOne({ userId: id, status: 1 });
    const cartItems = cart.cartItems[0];
    delete cartItems[prodId];
    let calculatedGrands = calculateGrands(cartItems);
    let updated = await Cart.updateOne(
      { userId: id, status: 1 },
      {
        cartItems: cartItems,
        subTotal: calculatedGrands.subTotal,
        discount: cart.discount,
        grandTotal: calculatedGrands.grandTotal,
      }
    );
    const updatedCart = await Cart.findOne({ userId: id, status: 1 });

    return res.status(200).json({ status: true, cartUpdated: updatedCart });
  } catch (err) {
    return res.status(500).json({ status: false, error: err });
  }
};

const deleteCart = async (req, res) => {
  const cartId = req.params.cartId;
  try {
    await Cart.deleteOne({ _id: cartId });
    const dltCartItems = await Cart.deleteMany({ cartId });
    return res.json({ status: true, deleted: dltCartItems });
  } catch (err) {
    return res.json({ status: true, error: err });
  }
};

module.exports = {
  createCart,
  getAllProductsFromCart,
  deleteProductFromCart,
  deleteCart,
};
