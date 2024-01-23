const configureCart = (prodId, product, requestedQuantity) => {
  const cartItem = {
    sku: product.sku,
    productId: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: [product.images],
    category: { id: product.category.id, name: product.category.name },
    discount: {
      discountType: product.discount.discountType,
      discountValue: product.discount.discountValue,
    },
    quantity: requestedQuantity,
    calculations: {
      total: calculate(
        "subTotal",
        requestedQuantity,
        product.price,
        product.discount.discountValue
      ),
      discount: product.discount.discountValue,
      subTotal: calculate(
        "total",
        requestedQuantity,
        product.price,
        product.discount.discountValue
      ),
    },
  };
  return cartItem;
};

const calculate = (type, quantity, price, discount) => {
  switch (type) {
    case "subTotal":
      return price * quantity;
    case "total":
      return price * quantity - (price / 100) * discount;
  }
};

const calculateGrands = (cartItems) => {
  let subTotal = 0;
  let grandTotal = 0;
  Object.values(cartItems).forEach((element) => {
    subTotal += element.calculations.total;
    grandTotal += element.calculations.subTotal;
  });
  return { subTotal, grandTotal };
};

module.exports = { configureCart, calculate, calculateGrands };
