import express from "express";
import * as Post from "../util/post.js";
import * as User from "../util/user.js";

const router = express.Router();

router.get("/", (req, res) => {
  const posts = Post.getPosts();
  if (posts.length == 0) {
    return res.status(404).send("Posts not found! ");
  }
  const user = User.getUsers(posts.userId);
  const postsWithUsers = [];
  posts.forEach((post) => {
    postsWithUsers.push({
      id: post.id,
      title: post.title,
      content: post.content,
      userName: User.getUsersById(post.userId).name,
    });
  });
  res.send(postsWithUsers);
});

router.get("/:id", (req, res) => {
  const post = Post.getPostsById(req.params.id);
  if (!post) {
    return res.status(404).send("Post not found!");
  }
  res.send({
    id: post.id,
    title: post.title,
    content: post.content,
    userName: User.getUsersById(post.userId).name,
  });
});

router.post("/", async (req, res) => {
  const { userId, title, content } = req.body;
  if (!title || !userId || !content) {
    return res.status(400).send("Missing data! ");
  }

  const user = User.getUsersById(userId);
  if (!user) {
    return res.status(404).send("User not found!");
  }

  const savedPost = Post.savePost(title, content, userId);
  if (savedPost.changes != 1) {
    return res.status(501).send("Post save failed! ");
  }
  res.status(200).send({ id: savedPost.lastInsertRowid });
});

router.put("/:id", async (req, res) => {
  const { userId, title, content } = req.body;
  const post = Post.getPostsById(req.params.id);
  if (!post) {
    return res.status(404).send("Post not found! ");
  }

  if (!title || !userId || !content) {
    return res.status(400).send("Missing data! ");
  }

  const user = User.getUsersById(userId);
  if (!user) {
    return res.status(404).send("User not found!");
  }

  const updatedPost = Post.updatePost(post.id, user.id, title, content);

  if (updatedPost.changes != 1) {
    return res.status(501).send("Post update failed! ");
  }
  res.status(201).send("Updated");
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const post = Post.getPostsById(id);
  if (!post) {
    return res.status(404).send("Post not found!");
  }

  const deletedPost = Post.deletePost(post.id);
  if (deletedPost.changes != 1) {
    return res.status(501).send("Post delete failed! ");
  }
  res.status(201).send("Deleted");
});

export default router;
