"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const router = express_1.Router();
router.get("/requests", admin_1.pendingRequests);
exports.default = router;
