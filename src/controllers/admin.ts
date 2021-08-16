import { Request, Response } from "express";
import Users, { UserInterface } from "../models/users";
import authenticator from "../util/authentication";
import { validationResult } from "express-validator";
import { hash } from "bcryptjs";

// GET => /admin/requests
export const pendingRequests = (req: Request, res: Response) => {
  // Check if token is present
  const token: string | undefined = req.get("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not Authenticated" });
  }
  const authenticationResult = authenticator(token);
  // Reject if not authenticated
  if (authenticationResult.error) {
    return res.status(401).json({ error: authenticationResult.error });
  } else {
    // If authenticated, proceed.
    Users.find({ status: "pending" })
      .select("_id username email")
      .then((result: UserInterface[]) => {
        if (result.length > 0) {
          res.status(200).json({
            message: `${result.length} results returned`,
            data: result,
          });
        } else {
          return res
            .status(200)
            .json({ message: "No Pending Requests", data: [] });
        }
      })
      .catch((err: Error) => {
        return res
          .status(500)
          .json({ message: err.message, error: err.message });
      });
  }
};

export const approveRequest = (req: Request, res: Response) => {
  // Check if token is present
  const token: string | undefined = req.get("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not Authenticated" });
  }
  const authenticationResult = authenticator(token);
  // Reject if not authenticated
  if (authenticationResult.error) {
    return res.status(401).json({ error: authenticationResult.error });
  } else {
    // If authenticated, proceed
    const userId = req.params.userId;
    Users.findByIdAndUpdate(
      userId,
      { status: "approved" },
      { useFindAndModify: false }
    )
      .then((result: UserInterface) => {
        if (result) {
          return res
            .status(200)
            .send({ message: "Request approved successfully" });
        } else {
          return res
            .status(500)
            .send({ error: "There was an error while parsing this request" });
        }
      })
      .catch((err: Error) => {
        return res
          .status(500)
          .json({ message: err.message, error: err.message });
      });
  }
};

export const rejectRequest = (req: Request, res: Response) => {
  // Check if token is present
  const token: string | undefined = req.get("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not Authenticated" });
  }
  const authenticationResult = authenticator(token);
  // Reject if not authenticated
  if (authenticationResult.error) {
    return res.status(401).json({ error: authenticationResult.error });
  } else {
    // If authenticated, proceed
    const userId = req.params.userId;
    Users.findByIdAndUpdate(
      userId,
      { status: "rejected" },
      { useFindAndModify: false }
    )
      .then((result: UserInterface) => {
        if (result) {
          return res
            .status(200)
            .send({ message: "Request rejected successfully" });
        } else {
          return res
            .status(500)
            .send({ error: "There was an error while parsing this request" });
        }
      })
      .catch((err: Error) => {
        return res
          .status(500)
          .json({ message: err.message, error: err.message });
      });
  }
};

export const getAllUsers = (req: Request, res: Response) => {
  // Check if token is present
  const token: string | undefined = req.get("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not Authenticated" });
  }
  const authenticationResult = authenticator(token);
  // Reject if not authenticated
  if (authenticationResult.error) {
    return res.status(401).json({ error: authenticationResult.error });
  } else {
    // if admin is authenticated, proceed
    Users.find()
      .select("_id username fullName email isAdmin")
      .then((result: UserInterface[]) => {
        if (!result) {
          return res.status(200).json({ data: [] });
        } else {
          return res.status(200).json({ data: result });
        }
      })
      .catch((err: Error) => {
        return res
          .status(500)
          .json({ message: err.message, error: err.message });
      });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  // Check if token is present
  const token: string | undefined = req.get("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not Authenticated" });
  }
  const authenticationResult = authenticator(token);
  // Reject if not authenticated
  if (authenticationResult.error) {
    return res.status(401).json({ error: authenticationResult.error });
  } else {
    // If authenticated, proceed
    const userId = req.params.userId;
    Users.findByIdAndRemove(userId, { useFindAndModify: false })
      .then((result: UserInterface) => {
        if (result) {
          console.log(result);
          return res.status(200).send({ message: "User removed successfully" });
        } else {
          return res
            .status(500)
            .send({ error: "There was an error while parsing this request" });
        }
      })
      .catch((err: Error) => {
        return res
          .status(500)
          .json({ message: err.message, error: err.message });
      });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  // Check if token is present
  const token: string | undefined = req.get("Authorization")?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Not Authenticated" });
  }
  const authenticationResult = authenticator(token);
  // Reject if not authenticated
  if (authenticationResult.error) {
    return res.status(401).json({ error: authenticationResult.error });
  }
  const errors = validationResult(req);
  // If validation errors exists, do not proceed further
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed.", error: errors.array()[0] });
  }
  console.log("No validation errors occurred!");
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
          isAdmin: true,
          status: "approved",
        });
        return user.save();
      })
      .then((result) => {
        res
          .status(201)
          .json({ message: "User created successfully!", userId: result._id });
      })
      .catch((err: Error) => {
        res.status(500).json({ error: err.message });
      });
  }
};
