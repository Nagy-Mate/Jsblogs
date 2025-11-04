import express from "express";
import cors from "cors";
import postRoutes from "./routers/postRoutes.js";
import userRoutes from "./routers/userRoutes.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.use((err, req, res, next) => {
  if (err) res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`server runs on http://localhost:${PORT}`);
});
