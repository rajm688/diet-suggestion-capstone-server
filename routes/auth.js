import express from "express";
import bcrypt from "bcrypt";
import { Users } from "../models/users.js";
import Jwt from "jsonwebtoken";
const router = express.Router();
router.post("/signup", async (req, res) => {
  const password = req.body.password;
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new Users({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const hashedPassword = req.body.password;
    const user = await Users.findOne({ email });
    if (user === null) {
      res.status(401).json("username not found");
      return;
    }
    const storedPassword = user.password;
    const password = await bcrypt.compare(hashedPassword, storedPassword);
    if (!password) {
      res.status(401).json("wrong password");
      return;
    }
    const Token = Jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_Key
    );
    res.status(201).json({ user, Token });
  } catch (error) {
    res.status(500).json("error in login");
  }
});
export const userRouter = router;
