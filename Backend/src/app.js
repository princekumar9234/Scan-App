const express = require("express"); //use kar rahe hai express
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");
const historyRouter = require("./routes/history.route");
const favoriteRouter = require("./routes/favorite.route");

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://scan-app-ebon.vercel.app/", // Vercel URL env mein set kiya  ("http://localhost:5173/" )
    credentials: true, // cookies allow karega
  }),
);
app.use(cookieParser());
app.use("/", userRouter);
app.use("/api/products", productRouter);
app.use("/api/history", historyRouter);
app.use("/api/favorites", favoriteRouter);

module.exports = app;
