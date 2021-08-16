import express, { Request, Router, Response } from "express";
import { body } from "express-validator";

import { signup, login } from "../controllers/auth";

const validPasswordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const router = Router();

// POST => /auth/signup
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("username")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters long"),
    body("username").trim().not().isEmpty(),
    body("password")
      .matches(validPasswordRegex)
      .withMessage(
        "Password must be minimum eight characters, at least one letter, one number and one special character"
      ),
  ],
  signup
);

// POST => /auth/login
router.post(
  "/login",
  [
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Username cannot be empty"),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password cannot be empty"),
  ],
  login
);

export default router;
