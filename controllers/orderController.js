const { default: mongoose } = require("mongoose");
const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
  try {
    const { user, cartItems, totalAmount, paymentMethod, orderId } = req.body;

    const newOrder = new Order({
      user,
      cartItems,
      totalAmount,
      paymentMethod,
      orderId,
    });

    await newOrder.save();

    res.send({
      status: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ "cartItems.userId": userId });

    if (orders.length === 0) {
      return res.status(404).send({
        status: false,
        message: "No orders found for this user.",
      });
    }

    // Send back the orders
    res.send({
      status: true,
      data: orders,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    if (orders.length === 0) {
      return res.status(404).send({
        status: false,
        message: "No orders found ",
      });
    }

    // Send back the orders
    res.send({
      status: true,
      data: orders,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { getUserOrders };

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find and delete the order
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).send({
        status: false,
        message: "Order not found",
      });
    }

    res.send({
      status: true,
      message: "Order deleted successfully",
      deletedOrder,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  deleteOrder,
  getAllOrders,
};
