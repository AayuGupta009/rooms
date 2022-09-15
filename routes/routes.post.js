const router = require("express").Router();
const controller = require("../controller/controller.post");
const middleware = require("../middlewares/middleware.auth");

//  Get Request
router.get("/posts", middleware.verifyToken, controller.getAllPosts);
router.get("/posts/:id", middleware.verifyToken, controller.getByID);

// Post Request
router.post("/posts", middleware.verifyToken, controller.createPost);
router.put("/posts/:id", middleware.verifyToken, controller.updatePost);
router.delete("/posts/:id", middleware.verifyToken, controller.deletePost);
router.put(
  "/posts/archive/:id",
  middleware.verifyToken,
  controller.archivePost
);
router.put(
  "/posts/unarchive/:id",
  middleware.verifyToken,
  controller.unarchivePost
);
router.put("/posts/admin/:id", middleware.verifyToken, controller.approvedPost);

router.all("*", (req, res) => res.status(404).send("404 | Page Not Found..."));

module.exports = router;
