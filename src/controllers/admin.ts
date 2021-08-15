import { Request, Response } from "express";
import Users, { UserInterface } from "../models/users";

export const pendingRequests = (req: Request, res: Response) => {
  Users.find({ status: "pending" }).then((result: UserInterface[]) => {
    console.log(result);
    res.status(200).json({ result: result });
  });
};
