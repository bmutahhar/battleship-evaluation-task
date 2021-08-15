"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const router = express_1.Router();
// POST => /auth/signup
router.post("/signup", [
    express_validator_1.body("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),
    express_validator_1.body("username")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Username must be at least 5 characters long"),
    express_validator_1.body("username").trim().not().isEmpty(),
    express_validator_1.body("password")
        .matches(validPasswordRegex)
        .withMessage("Password must be minimum eight characters, at least one letter, one number and one special character"),
], auth_1.signup);
// POST => /auth/login
router.post("/login", [
    express_validator_1.body("username")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Username cannot be empty"),
    express_validator_1.body("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password cannot be empty"),
], auth_1.login);
exports.default = router;
