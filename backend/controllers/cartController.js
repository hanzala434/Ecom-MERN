const Cart = require("../models/Cart");
const Products = require("../models/Products");

const addToCart = async (req, res) => {
  try {
    const { userId, name, color, size, productId, quantity } = req.body;

    if (!userId || !productId || !name || !color || !size || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size &&
        item.name
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, name, color, size, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    // Fetch the cart and populate the product details
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "images name price", // Ensure these fields exist in the Product model
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Validate items to ensure only items with a valid productId are retained
    const validItems = cart.items.filter((item) => item.productId);

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save(); // Save the updated cart
    }

    // Map the cart items to include necessary fields
    const populateCartItems = validItems.map((item) => ({
      _id: item._id, // Include the item ID from the Cart schema
      productId: item.productId._id, // Product ID from the populated Product model
      name: item.productId.name, // Product name from the Product model
      color: item.color, // Color from the Cart schema
      size: item.size, // Size from the Cart schema
      image: item.productId.images, // Images from the Product model
      price: item.productId.price, // Price from the Product model
      quantity: item.quantity, // Quantity from the Cart schema
    }));

    // Respond with the updated cart data
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems, // Replace items with the populated cart items
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart items.",
    });
  }
};


const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, color, size, quantity } = req.body;

    if (!userId || !productId || !color || !size || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images name price",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.name,
      color: item.color,
      size: item.size,
      image: item.productId.images,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId} = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "images name price",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item._id.toString() !== productId 
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images name price",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.name,
      color: item.productId.color,
      size: item.productId.size,
      image: item.productId.images,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
