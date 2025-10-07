import express from "express";

const PORT = 3000;

const app = express();
app.use(express.json());


app.use((err, req, res, next) => {
  if (err) res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`server runs on http://localhost:${PORT}`);
});
