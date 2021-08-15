"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const express_validator_1 = require("express-validator");
const users_1 = __importDefault(require("../models/users"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    // If validation errors exists, do not proceed further
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Validation faild.", error: errors.array()[0] });
    }
    const { fullName, username, email, password, } = req.body;
    // Check existing email in database
    const userExists = yield users_1.default.findOne({
        $or: [{ email: email }, { username: username }],
    });
    if (userExists) {
        res
            .status(422)
            .json({ error: "Account with this username or email already exists" });
        return;
    }
    else {
        //Else create a new user
        bcryptjs_1.hash(password, 12)
            .then((hashPw) => {
            const user = new users_1.default({
                fullName: fullName,
                username: username,
                email: email,
                password: hashPw,
            });
            return user.save();
        })
            .then((result) => {
            console.log(result);
            res
                .status(201)
                .json({ message: "User created successfully!", userId: result._id });
        })
            .catch((err) => {
            res.status(500).json({ error: err.message });
        });
    }
});
exports.signup = signup;
const login = (req, res) => {
    const errors = express_validator_1.validationResult(req);
    // If validation errors exists, do not proceed further
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Validation faild.", error: errors.array()[0] });
    }
    const { username, password } = req.body;
    const secretKey = process.env.JWT_SECRET_KEY || "BattleshipEvaluationTask";
    let loadedUser;
    users_1.default.findOne({ username: username })
        .then((user) => {
        if (!user) {
            return res
                .status(404)
                .json({ error: "Username not found. Please check your username" });
        }
        loadedUser = user;
        return bcryptjs_1.compare(password, user.password);
    })
        .then((matches) => {
        var _a, _b;
        if (!matches) {
            return res
                .status(401)
                .json({ message: "Incorrect password", error: "Incorrect password" });
        }
        else {
            if (((_a = loadedUser.status) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === "pending") {
                return res.status(401).json({
                    error: "An admin has not authorized your sign up request yet. Please wait.",
                });
            }
            else if (((_b = loadedUser.status) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase()) === "rejected") {
                return res.status(401).json({
                    error: "Admin has rejected your sign up request. Please sign up again.",
                });
            }
            else {
                const token = jsonwebtoken_1.sign({
                    username: loadedUser.username,
                    id: loadedUser._id.toString(),
                }, secretKey, {
                    expiresIn: "1h",
                });
                return res.status(200).json({
                    message: "Login successful!",
                    token: token,
                    userId: loadedUser._id.toString(),
                    isAdmin: loadedUser.isAdmin,
                });
            }
        }
    })
        .catch((err) => {
        return res.status(500).json({ message: err.message, error: err.message });
    });
};
exports.login = login;
