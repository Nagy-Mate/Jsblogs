import { Router } from "express";
import * as User from "../util/user.js";
import * as Post from "../util/post.js";
import bcrypt from "bcrypt";

const router = Router();

router.get("/", (req, res) => {
  const users = User.getUsers();
  if (users.length == 0) {
    return res.status(404).send("Users not found! ");
  }
  res.send(users);
});

router.get("/:id", (req, res) => {
  const user = User.getUsersById(req.params.id);
  if (!user) {
    return res.status(404).send("User not found!");
  }
  res.send(user);
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("Missing data! ");
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPwd = await bcrypt.hash(password, salt);

  const savedUser = User.saveUser(name, email, hashedPwd);
  if (savedUser.changes != 1) {
    return res.status(501).send("User save failed! ");
  }
  res.status(200).send({ id: savedUser.lastInsertRowid });
});

router.put("/:id", async (req, res) => {
  const { name, email, password } = req.body;
  const id = req.params.id;

  if (!name || !email || !password || !id) {
    return res.status(400).send("Missing data! ");
  }

  const user = User.getUsersById(id);
  if (!user) {
    return res.status(404).send("User not found!");
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPwd = await bcrypt.hash(password, salt);

  const updatedUser = User.updateUser(id, name, email, hashedPwd);

  if (updatedUser.changes != 1) {
    return res.status(501).send("User update failed! ");
  }
  res.status(201).send("Updated");
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const user = User.getUsersById(id);
  if (!user) {
    return res.status(404).send("User not found!");
  }
  const posts = Post.getPostsByUser(user.id);
  posts.forEach((p) => {
    Post.deletePost(p.id);
  });

  const deletedUser = User.deleteUser(id);
  if (deletedUser.changes != 1) {
    return res.status(501).send("User delete failed! ");
  }
  res.status(201).send("Deleted");
});

export default router;
