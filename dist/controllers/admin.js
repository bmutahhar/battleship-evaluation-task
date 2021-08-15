"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pendingRequests = void 0;
const users_1 = __importDefault(require("../models/users"));
const pendingRequests = (req, res) => {
    users_1.default.find({ status: "pending" }).then((result) => {
        console.log(result);
        res.status(200).json({ result: result });
    });
};
exports.pendingRequests = pendingRequests;
