import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import Customer from '../models/customer.model';
import Admin from '../models/admin.model';
import Item from '../models/item.model';
import Category from '../models/category.model';
import Cart from '../models/cart.model';
import Order from '../models/order.model';
import Review from '../models/review.model';
import Address from '../models/address.model';
import Notification from '../models/notification.model';
import Payment from '../models/payment.model';

const JWT_SECRET = 'yourSuperSecretKey123';
const JWT_EXPIRES = '7d';

// ===== USER SERVICES =====
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}) => {
  const exists = await Customer.findOne({ email: data.email });
  if (exists) throw new Error('Email already registered');
  const hash = await bcrypt.hash(data.password, 10);
  const user = await Customer.create({ ...data, password: hash });
  const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await Customer.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { user, token };
};

export const getUserById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid user ID');
  const user = await Customer.findById(id).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUser = async (id: string, data: Partial<{
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
}>) => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid user ID');
  const user = await Customer.findById(id);
  if (!user) throw new Error('User not found');
  if (data.password) user.password = await bcrypt.hash(data.password, 10);
  Object.assign(user, data);
  await user.save();
  return user;
};

export const deleteUser = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid user ID');
  const user = await Customer.findByIdAndDelete(id);
  if (!user) throw new Error('User not found');
  return user;
};

export const getAllUsers = async () => {
  return await Customer.find().select('-password');
};

// ===== ADMIN SERVICES =====
export const registerAdmin = async (data: {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
}) => {
  const exists = await Admin.findOne({ email: data.email });
  if (exists) throw new Error('Email already registered');
  const hash = await bcrypt.hash(data.password, 10);
  const admin = await Admin.create({ ...data, password: hash });
  const token = jwt.sign({ id: admin._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { admin, token };
};

export const loginAdmin = async (email: string, password: string) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: admin._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { admin, token };
};

export const getAllOrdersAdmin = async () => {
  return await Order.find()
    .populate('customer', 'name email')
    .populate('orderItems.item', 'name price')
    .sort({ createdAt: -1 });
};

export const getDashboardData = async () => {
  const totalOrders = await Order.countDocuments();
  const revenueAgg = await Payment.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;
  return { totalOrders, totalRevenue };
};

// ===== ITEM SERVICES =====
export const createItem = async (data: {
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  category?: string;
}) => {
  const item = await Item.create({ ...data });
  return item;
};

export const getAllItems = async () => {
  return await Item.find().sort({ name: 1 });
};

export const getItemById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid item ID');
  const item = await Item.findById(id);
  if (!item) throw new Error('Item not found');
  return item;
};

export const updateItem = async (id: string, data: Partial<{
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
}>) => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid item ID');
  const item = await Item.findByIdAndUpdate(id, data, { new: true });
  if (!item) throw new Error('Item not found');
  return item;
};

export const deleteItem = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid item ID');
  const item = await Item.findByIdAndDelete(id);
  if (!item) throw new Error('Item not found');
  return item;
};

export const getItemsByCategory = async (categoryId: string) => {
  if (!Types.ObjectId.isValid(categoryId)) throw new Error('Invalid category ID');
  return await Item.find({ category: categoryId });
};

export const searchItemsByName = async (keyword: string) => {
  return await Item.find({ name: { $regex: keyword, $options: 'i' } });
};

// ===== CATEGORY SERVICES =====
export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {
  return await Category.create(data);
};

export const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

export const getCategoryById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid category ID');
  const cat = await Category.findById(id);
  if (!cat) throw new Error('Category not found');
  return cat;
};

export const updateCategory = async (id: string, data: Partial<{
  name: string;
  description: string;
}>) => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid category ID');
  const cat = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!cat) throw new Error('Category not found');
  return cat;
};

export const deleteCategory = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid category ID');
  const cat = await Category.findByIdAndDelete(id);
  if (!cat) throw new Error('Category not found');
  return cat;
};

// ===== FAVORITE SERVICES =====
export const addFavorite = async (userId: string, itemId: string) => {
  if (!Types.ObjectId.isValid(itemId)) throw new Error('Invalid item ID');
  if (await Favorite.findOne({ user: userId, item: itemId }))
    throw new Error('Already favorited');
  return await Favorite.create({ user: new Types.ObjectId(userId), item: new Types.ObjectId(itemId) });
};

export const removeFavorite = async (userId: string, itemId: string) => {
  const fav = await Favorite.findOneAndDelete({ user: userId, item: itemId });
  if (!fav) throw new Error('Favorite not found');
  return fav;
};

export const getFavoritesByUser = async (userId: string) => {
  return await Favorite.find({ user: userId }).populate('item', 'name price');
};

export const isItemFavorited = async (userId: string, itemId: string) => {
  return !!(await Favorite.findOne({ user: userId, item: itemId }));
};

// ===== CART SERVICES =====
export const getCartByUser = async (userId: string) => {
  let cart = await Cart.findOne({ customer: userId }).populate('cartItems.item', 'name price');
  if (!cart) {
    cart = new Cart({ customer: userId, cartItems: [] });
    await cart.save();
  }
  return cart;
};

export const addItemToCart = async (userId: string, itemId: string, quantity: number) => {
  const cart = await getCartByUser(userId);
  const idx = cart.cartItems.findIndex(ci => ci.item.toString() === itemId);
  if (idx >= 0) cart.cartItems[idx].quantity = quantity;
  else cart.cartItems.push({ item: new Types.ObjectId(itemId), quantity });
  await cart.save();
  return cart.populate('cartItems.item', 'name price');
};

export const removeItemFromCart = async (userId: string, itemId: string) => {
  const cart = await getCartByUser(userId);
  cart.cartItems = cart.cartItems.filter(ci => ci.item.toString() !== itemId);
  await cart.save();
  return cart.populate('cartItems.item', 'name price');
};

export const clearCart = async (userId: string) => {
  const cart = await getCartByUser(userId);
  cart.cartItems = [];
  await cart.save();
  return cart;
};

export const updateCartItemQuantity = async (userId: string, itemId: string, quantity: number) => {
  return addItemToCart(userId, itemId, quantity);
};

// ===== ORDER SERVICES =====
export const createOrder = async (userId: string, orderItems: { itemId: string; quantity: number }[]) => {
  let total = 0;
  const itemsArr = await Promise.all(orderItems.map(async oi => {
    const it = await Item.findById(oi.itemId);
    if (!it) throw new Error(`Item not found: ${oi.itemId}`);
    total += it.price * oi.quantity;
    return { item: it._id, quantity: oi.quantity, unitPrice: it.price };
  }));
  const order = await Order.create({ customer: new Types.ObjectId(userId), orderItems: itemsArr, totalPrice: total });
  return order;
};

export const getOrderById = async (orderId: string) => {
  if (!Types.ObjectId.isValid(orderId)) throw new Error('Invalid order ID');
  const order = await Order.findById(orderId)
    .populate('orderItems.item', 'name price')
    .populate('customer', 'name email');
  if (!order) throw new Error('Order not found');
  return order;
};

export const getOrdersByUser = async (userId: string) => {
  return await Order.find({ customer: userId })
    .populate('orderItems.item', 'name price')
    .sort({ createdAt: -1 });
};

export const getAllOrders = async () => {
  return await Order.find()
    .populate('orderItems.item', 'name price')
    .populate('customer', 'name email')
    .sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');
  order.status = status as any;
  await order.save();
  return order;
};

// ===== REVIEW SERVICES =====
export const addReview = async (userId: string, itemId: string, rating: number, comment: string) => {
  if (!Types.ObjectId.isValid(itemId)) throw new Error('Invalid item ID');
  return await Review.create({ user: new Types.ObjectId(userId), item: new Types.ObjectId(itemId), rating, comment });
};

export const getReviewsByItem = async (itemId: string) => {
  if (!Types.ObjectId.isValid(itemId)) throw new Error('Invalid item ID');
  return await Review.find({ item: itemId }).populate('user', 'name').sort({ createdAt: -1 });
};

export const getReviewsByUser = async (userId: string) => {
  return await Review.find({ user: userId }).populate('item', 'name price').sort({ createdAt: -1 });
};

export const deleteReview = async (reviewId: string) => {
  if (!Types.ObjectId.isValid(reviewId)) throw new Error('Invalid review ID');
  const rev = await Review.findByIdAndDelete(reviewId);
  if (!rev) throw new Error('Review not found');
  return rev;
};

// ===== ADDRESS SERVICES =====
export const addAddress = async (userId: string, data: { line1: string; city: string; postalCode: string; country: string }) => {
  return await Address.create({ user: new Types.ObjectId(userId), ...data });
};

export const getAddressesByUser = async (userId: string) => {
  return await Address.find({ user: userId }).sort({ createdAt: -1 });
};

export const updateAddress = async (userId: string, addressId: string, data: Partial<{ line1: string; city: string; postalCode: string; country: string }>) => {
  const addr = await Address.findOne({ _id: addressId, user: userId });
  if (!addr) throw new Error('Address not found');
  Object.assign(addr, data);
  await addr.save();
  return addr;
};

export const deleteAddress = async (userId: string, addressId: string) => {
  const addr = await Address.findOneAndDelete({ _id: addressId, user: userId });
  if (!addr) throw new Error('Address not found');
  return addr;
};

// ===== NOTIFICATION SERVICES =====
export const createNotification = async (userId: string, message: string) => {
  return await Notification.create({ user: new Types.ObjectId(userId), message });
};

export const getNotificationsByUser = async (userId: string) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

export const markNotificationRead = async (userId: string, notificationId: string) => {
  const note = await Notification.findOne({ _id: notificationId, user: userId });
  if (!note) throw new Error('Notification not found');
  note.read = true;
  await note.save();
  return note;
};

// ===== PAYMENT SERVICES =====
export const createPayment = async (userId: string, orderId: string, paymentMethod: string, transactionId: string) => {
  if (!Types.ObjectId.isValid(orderId)) throw new Error('Invalid order ID');
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');
  if (order.customer.toString() !== userId) throw new Error('Not authorized for this order');
  if (order.status !== 'Pending') throw new Error('Order already processed');
  const amount = order.totalPrice;
  const pay = await Payment.create({
    order: order._id,
    customer: new Types.ObjectId(userId),
    amount,
    paymentMethod,
    transactionId,
    status: 'Completed',
  });
  order.status = 'Accepted';
  await order.save();
  return pay;
};

export const getPaymentsByUser = async (userId: string) => {
  return await Payment.find({ customer: userId }).sort({ createdAt: -1 });
};

export const getPaymentById = async (userId: string, paymentId: string) => {
  if (!Types.ObjectId.isValid(paymentId)) throw new Error('Invalid payment ID');
  const pay = await Payment.findById(paymentId).populate('order').populate('customer', 'name email');
  if (!pay) throw new Error('Payment not found');
  if (pay.customer.toString() !== userId) throw new Error('Not authorized');
  return pay;
};
