import express from "express";
import * as Post from "../util/post.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Post");
});

export default router;
