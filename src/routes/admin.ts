import { Router } from "express";
import { body } from "express-validator";
import {
  pendingRequests,
  approveRequest,
  rejectRequest,
  getAllUsers,
  deleteUser,
  createAdmin,
} from "../controllers/admin";

const validPasswordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const router = Router();

// GET Requests
router.get("/users", getAllUsers);
router.get("/requests", pendingRequests);

// PUT Requests
router.put("/requests/approve/:userId", approveRequest);
router.put("/requests/reject/:userId", rejectRequest);

// DELETE Requests
router.delete("/deleteUser/:userId", deleteUser);

router.post(
  "/createAdmin",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("username")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters long"),
    body("username").trim().not().isEmpty(),
    body("password")
      .matches(validPasswordRegex)
      .withMessage(
        "Password must be minimum eight characters, at least one letter, one number and one special character"
      ),
  ],
  createAdmin
);

export default router;
