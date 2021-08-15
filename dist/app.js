"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dbURl = "mongodb://localhost:27017/battleship";
const PORT = process.env.PORT || 8080;
const app = express_1.default();
dotenv_1.config();
const connection = mongoose_1.connect(dbURl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use(cors_1.default());
app.use(morgan_1.default("dev"));
app.use(body_parser_1.default.json());
app.use("/auth", auth_1.default);
app.use("/admin", admin_1.default);
connection
    .then(() => {
    console.log("Database Connected Successfully!");
    app.listen(PORT, () => {
        console.log("Server successfully started on PORT ", PORT);
    });
})
    .catch((err) => {
    console.log(err);
});
