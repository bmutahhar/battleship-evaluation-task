import express, { Request, Router, Response } from "express";
import { pendingRequests } from "../controllers/admin";

const router = Router();

router.get("/requests", pendingRequests);

export default router;
