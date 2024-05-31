import express from "express";
const router = express.Router();
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/user.js";

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
