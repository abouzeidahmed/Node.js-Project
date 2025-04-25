import dotenv from "dotenv";

dotenv.config();  

import connectDB from "./config/db";
import app from "./app";

console.log("→ PORT =", process.env.PORT);
console.log("→ MONGO_URI =", process.env.MONGO_URI);


const PORT = process.env.PORT || 5000;


connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(" Unhandled Rejection at:", promise, "reason:", reason);
});
