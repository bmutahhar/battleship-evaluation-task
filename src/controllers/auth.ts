import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Users, { UserInterface } from "../models/users";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  // If validation errors exists, do not proceed further
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation faild.", error: errors.array()[0] });
  }
  const {
    fullName,
    username,
    email,
    password,
  }: { fullName: string; username: string; email: string; password: string } =
    req.body!;

  // Check existing email in database
  const userExists = await Users.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (userExists) {
    res
      .status(422)
      .json({ error: "Account with this username or email already exists" });
    return;
  } else {
    //Else create a new user
    hash(password, 12)
      .then((hashPw: string) => {
        const user = new Users({
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
      .catch((err: Error) => {
        res.status(500).json({ error: err.message });
      });
  }
};

export const login = (req: Request, res: Response) => {
  const errors = validationResult(req);
  // If validation errors exists, do not proceed further
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation faild.", error: errors.array()[0] });
  }
  const { username, password }: { username: string; password: string } =
    req.body;

  const secretKey: string =
    process.env.JWT_SECRET_KEY || "BattleshipEvaluationTask";
  let loadedUser: UserInterface;
  Users.findOne({ username: username })
    .then((user: UserInterface) => {
      if (!user) {
        return res
          .status(404)
          .json({ error: "Username not found. Please check your username" });
      }
      loadedUser = user;
      return compare(password, user.password);
    })
    .then((matches: boolean) => {
      if (!matches) {
        return res
          .status(401)
          .json({ message: "Incorrect password", error: "Incorrect password" });
      } else {
        if (loadedUser.status?.trim().toLowerCase() === "pending") {
          return res.status(401).json({
            error:
              "An admin has not authorized your sign up request yet. Please wait.",
          });
        } else if (loadedUser.status?.trim().toLowerCase() === "rejected") {
          return res.status(401).json({
            error:
              "Admin has rejected your sign up request. Please sign up again.",
          });
        } else {
          const token = sign(
            {
              username: loadedUser.username,
              id: loadedUser._id!.toString(),
            },
            secretKey,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Login successful!",
            token: token,
            userId: loadedUser._id!.toString(),
            isAdmin: loadedUser.isAdmin,
          });
        }
      }
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: err.message, error: err.message });
    });
};
