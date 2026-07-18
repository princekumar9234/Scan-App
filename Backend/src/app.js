const express = require("express"); //use kar rahe hai express
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");
const historyRouter = require("./routes/history.route");
const favoriteRouter = require("./routes/favorite.route");

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use("/", userRouter);
app.use("/api/products", productRouter);
app.use("/api/history", historyRouter);
app.use("/api/favorites", favoriteRouter);

module.exports = app;
