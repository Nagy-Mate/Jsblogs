import { Router } from "express";
import * as User from "../util/user.js";
import bcrypt from "bcrypt";

const router = Router();

router.get("/", (req, res) => {
  res.send(User.getUsers());
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
    return res.status(501).json({ message: "User save failed! " });
  }
  res.status(200).json({ id: savedUser.lastInsertRowid });
});
export default router;
