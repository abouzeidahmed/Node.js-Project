// src/app.ts
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import itemRoutes from './routes/item.routes';  
import orderRoutes from './routes/order.routes';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import adminRoutes from './routes/admin.routes';
import cartRoutes from './routes/cart.routes';
import paymentRoutes from './routes/payment.routes';
import reviewRoutes from './routes/review.routes'; 
import customerProfileRoutes from './routes/customerProfile.routes';
import addressRoutes from './routes/address.routes';
import notificationRoutes from './routes/notification.routes';
import reportRoutes from './routes/report.routes';
dotenv.config();

const app = express();

// ─── GLOBAL MIDDLEWARES ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── ROUTES ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use('/api/items', itemRoutes);           
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);


app.use('/api/customer', customerProfileRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/reports', reportRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Food Delivery App");
});

// ─── ERROR HANDLER ──────────────────────────────────────────────────────────────
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong" });
});

export default app;
