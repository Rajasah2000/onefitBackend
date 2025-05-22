const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const CartItem = require("../models/cartModel");
// Admin Register function

const UserRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      msg: "Registered successfully",
      status: true,
      //   token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
      status: false,
    });
  }
};

const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found", status: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password", status: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      msg: "Login Successfully",
      status: true,
      token: token,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", status: false });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the User model.
    res.status(200).json({
      status: true,
      message: "Fetched all users successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const addCartItem = async (req, res) => {
  const { productName, color, size, quantity, price, image } = req.body;
  const userId = req.user.id;

  try {
    const existingItem = await CartItem.findOne({
      userId,
      productName,
      color,
      size,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json({
        status: true,
        message: "Cart item updated",
        cartItem: existingItem,
      });
    }

    const newCartItem = new CartItem({
      userId,
      productName,
      color,
      size,
      quantity,
      price,
      image,
    });
    await newCartItem.save();

    res.status(201).json({
      status: true,
      message: "Cart item added",
      cartItem: newCartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding item to cart", error });
  }
};
const viewCartItems = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await CartItem.find({ userId });
    res
      .status(200)
      .json({ status: true, message: "Get All Cart Items", data: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart items", error });
  }
};

const deleteAllCartItems = async (req, res) => {
  const userId = req.user.id; // Assuming `req.user.id` contains the authenticated user's ID.

  try {
    // Delete all cart items for the user
    const deletedItems = await CartItem.deleteMany({ userId });

    if (deletedItems.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No cart items found to delete" });
    }

    res.status(200).json({
      status: true,
      message: "All cart items deleted successfully",
      deletedCount: deletedItems.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting cart items", error });
  }
};

const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  try {
    const cartItem = await CartItem.findOne({ _id: id, userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart item", error });
  }
};
const deleteCartItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const cartItem = await CartItem.findOneAndDelete({ _id: id, userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({
      status: true,
      message: "Cart item removed",
      cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting cart item", error });
  }
};

module.exports = {
  UserLogin,
  UserRegister,
  getAllUsers,
  deleteCartItem,
  updateCartItem,
  viewCartItems,
  addCartItem,
  deleteAllCartItems,
};
