import { Router } from "express";
import { httpCodes } from "../../constants.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  sendPasswordResetOtp,
  sendVeirfyOtp,
  verifyEmail,
  resetPassword
} from "../../controllers/auth-controller/index.js";

import { authenticate } from "../../middleware/auth-middleware.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
const authRoutes = Router();

authRoutes.route("/register").post(registerUser);
authRoutes.route("/login").post(loginUser);
authRoutes.route("/check-auth")
  .get(authenticate, (req, res) => { res.status(200).json(new ApiResponse(httpCodes.ok, req.user, "authenticated user")); });
authRoutes.route("/logout").post(authenticate, logoutUser);


authRoutes.route("/send-verify-email").post(sendVeirfyOtp);
authRoutes.route("/verify-email").post(verifyEmail);
authRoutes.route("/send-reset-otp").post(sendPasswordResetOtp);
authRoutes.route("/reset-password").post(resetPassword);

export { authRoutes };
 