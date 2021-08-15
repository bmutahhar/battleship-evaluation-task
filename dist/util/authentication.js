"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const authenticator = (token) => {
    try {
        const secretKey = process.env.JWT_SECRET_KEY || "BattleshipEvaluationTask";
        let decodedToken = jsonwebtoken_1.verify(token, secretKey);
        if (!decodedToken) {
            return { token: null, error: "Not Authenticated" };
        }
        return { token: decodedToken };
    }
    catch (err) {
        console.log(err);
        return { token: null, error: "Not Authenticated" };
    }
};
exports.default = authenticator;
