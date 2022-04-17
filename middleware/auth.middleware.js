require("dotenv").config();
const jwt = require("jsonwebtoken");

// verify-token domain
function verifyToken(req, res, next) {
  const token = req.header("x-access-token");
  const key = process.env.ACCESS_TOKEN_SECRET || 12345;
  if (!token)
    return res.status(401).send("Access Denied. Please Login again!!!");

  try {
    // gettting token secret from env file
    const decoded = jwt.verify(token, key, {
      algorithm: "HS256",
    });

    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Opps!! Token Expired");
  }
}

module.exports = verifyToken;
