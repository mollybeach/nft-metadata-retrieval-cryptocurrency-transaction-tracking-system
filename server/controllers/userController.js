/**
 * UserController
 * @path server/controllers/userController.mjs
 * @description Defines the controller functions for user-related operations.
 */

import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import process from "process";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// create a new user
export const createUser = async (req, res) => {
  const { email, password } = req.body;

  let emptyFields = [];

  if (!email) {
    emptyFields.push("email");
  }
  if (!password) {
    emptyFields.push("password");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    const user = new userModel({ email, password });

    await user.valid(email, password);

    user.password = await user.createHash(password);

    const token = createToken(user._id);

    await user.save();

    res.status(200).json({ email: email, token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let emptyFields = [];

  if (!email) {
    emptyFields.push("email");
  }
  if (!password) {
    emptyFields.push("password");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      const passwordIsValid = await user.verifyPassword(password);
      if (!passwordIsValid) {
        return res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = createToken(user._id);
    res.status(200).json({
      message: "Logged in successfully",
      id: user._id,
      email: user.email,
      user: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all users
export const getUsers = async (req, res) => {
  const users = await userModel.find({}).sort({ createdAt: -1 });

  res.status(200).json(users);
};

// get a single user
export const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json({ error: "User found" });
};

// delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await userModel.findOneAndDelete({ _id: id });

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

// update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};
