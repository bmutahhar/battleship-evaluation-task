import express from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import bodyParser from "body-parser";
import authRoute from "./routes/auth";
import adminRoute from "./routes/admin";
import cors from "cors";
import morgan from "morgan";

const dbURl: string = "mongodb://localhost:27017/battleship";
const PORT = process.env.PORT || 8080;
const app = express();
config();
const connection = connect(dbURl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/auth", authRoute);
app.use("/admin", adminRoute);

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
