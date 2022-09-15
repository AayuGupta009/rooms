const jwt = require("jsonwebtoken");
const { db } = require("../models/models.user");
const User = require("../models/models.user");

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(403).send("Token not passed");

    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (data) {
      const user = await db.collection("User").findOne({ email: data.email });

      const success = () => {
        req.body.Email = user.email;
        req.body.UserID = user._id;
        next();
      };

      user.jwt == token ? success() : res.status(401).send("Invalid Token");
    } else res.status(401).send("Invalid Token");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
