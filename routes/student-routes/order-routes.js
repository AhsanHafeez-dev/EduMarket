import express from "express";
import {
  createOrder,
  capturePaymentAndFinalizeOrder,
  confirmPayment,
} from "../../controllers/student-controller/order-controller.js";
import { authenticate } from "../../middleware/auth-middleware.js";
import bodyParser from "body-parser";

const studentViewOrderRoutes = express.Router();

// studentViewOrderRoutes.use(authenticate)
studentViewOrderRoutes.post("/create",authenticate, createOrder);
// studentViewOrderRoutes.post("/capture", capturePaymentAndFinalizeOrder);

// studentViewOrderRoutes.post("/confirm",  bodyParser.raw({ type: "application/json" }), confirmPayment);

export { studentViewOrderRoutes };
