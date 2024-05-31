import User from "../models/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Signup function
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(409).json({ message: "Something went wrong" });
  }
};

// Login function
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: oldUser._id, username: oldUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    return res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Forgot Password function
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abdullah.dev160@gmail.com",
        pass: "rkti ywjt megl ynjw",
      },
    });

    const mailOptions = {
      from: "abdullah.dev160@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `http://localhost:5173/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to send email" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: "Password reset link sent" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Reset Password function
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ message: "Incorrect or expired link" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      await User.findByIdAndUpdate(decodedToken.id, {
        password: hashedPassword,
      });
      res.status(200).json({ message: "Password updated successfully" });
    });
  } else {
    return res.status(401).json({ message: "Authentication error" });
  }
};

// Logout function
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
