import * as User from "../util/user.js";

function auth(req, res, next) {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).send("Unauthorized");
    }
    const token = jwt.verify(accessToken.split(" ")[1], "secret_key");
    const now = Math.floor(Date.now() / 1000);
    if (!token || token?.exp < now) {
      return res.status(403).send("Access forbidden");
    }
    const user = User.getUsersById(token.id);
    if (!user) {
      return res.status(403).send("Access denied");
    }
    req.userId = user.id;
    req.userEmail = user.email;
    next();
  } catch (err) {
    req.status(500).send(err.message);
  }
}

export default auth;
