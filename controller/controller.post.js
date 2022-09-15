const Post = require("../models/models.post");
const { db } = require("../models/models.post");
const ObjectID = require("mongodb").ObjectID;

const post = {};

// Create a POST
post.createPost = async (req, res) => {
  try {
    delete req.body.Email;
    const data = new Post(req.body);
    //  Insert in the DB
    await db.collection("Post").insertOne(data);
    res.status(200).send(`Post successfully created!!!`);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Update a POST contents
post.updatePost = async (req, res) => {
  try {
    //   Changing params ID in form of ObjectID
    const _id = new ObjectID(req.params.id);
    //   Check whether Post exists OR not
    const data = await db.collection("Post").findOne({ _id });
    if (data && data.status === "Verified") {
      await db.collection("Post").updateOne({ _id }, { $set: req.body });
      return res.status(200).send("Post was Changed...");
    }
    return res.status(404).send("Post not found!!!!");
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};

// Update a POST status to Archive
post.archivePost = async (req, res) => {
  try {
    //   Changing params ID in form of ObjectID
    const _id = new ObjectID(req.params.id);
    //   Check whether Post exists OR not
    const data = await db.collection("Post").findOne({ _id });
    if (data && data.status === "Verified") {
      await db
        .collection("Post")
        .updateOne({ _id }, { $set: { status: "Archived" } });
      return res.status(200).send("Post was Archived...");
    }
    return res.status(404).send("Post not found!!!!");
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};

// Update a POST status to Unarchive
post.unarchivePost = async (req, res) => {
  try {
    //   Changing params ID in form of ObjectID
    const _id = new ObjectID(req.params.id);
    //   Check whether Post exists OR not
    const data = await db.collection("Post").findOne({ _id });
    if (data && data.status === "Archived") {
      await db
        .collection("Post")
        .updateOne({ _id }, { $set: { status: "Verified" } });
      return res.status(200).send("Post was Unarchived...");
    }
    return res.status(404).send("Post not found!!!!");
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};

// Update a POST Status --> Admin
post.approvedPost = async (req, res) => {
  try {
    //   Changing params ID in form of ObjectID
    const _id = new ObjectID(req.params.id);
    // Checking for Post
    const data = await db.collection("Post").findOne({ _id });
    if (data) {
      if (data.status === "Not Verified") {
        await db
          .collection("Post")
          .updateOne({ _id: data._id }, { $set: { status: req.body.status } });

        return res.status(200).send(`Post was ${req.body.status}`);
      } else return res.status(200).send(data.status);
    }
    return res.status(404).send("Post not found!!!!");
  } catch (e) {
    res.status(500).send(e.message);
  }
};
// Delete a POST
// Update a POST status to Archive
post.deletePost = async (req, res) => {
  try {
    //   Changing params ID in form of ObjectID
    const _id = new ObjectID(req.params.id);
    //   Check whether Post exists OR not
    const data = await db.collection("Post").findOne({ _id });
    if (data && data.status === "Verified") {
      await db
        .collection("Post")
        .updateOne({ _id }, { $set: { status: "Deleted" } });
      return res.status(200).send("Post successfully Deleted...");
    }
    return res.status(404).send("Post not found!!!!");
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};

// Retrieve all POSTS (USER : by ID) --> Aprroved only
post.getByID = async (req, res) => {
  try {
    //   Changing params ID in form of ObjectID
    const data = await db
      .collection("Post")
      .find({ UserID: req.params.id, status: "Verified" })
      .toArray();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// Retrieve all POSTS (USER : feed) --> Aprroved only
post.getAllPosts = async (req, res) => {
  try {
    const data = await db
      .collection("Post")
      .find({ status: "Verified" })
      .toArray();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// Retrieve all POSTS (ADMIN : feed)

// Retrieve all POSTS (ADMIN : by ID)
module.exports = post;
