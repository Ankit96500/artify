import e from "express";
import { registerUser, loginUser, userCredit, paymentRazorpay, verifyRazorPayment } from "../controllers/user-controller.js"
import { userAuth } from "../middleware/auth.js";

const routes = e.Router();



routes.post('/register', registerUser);
routes.post('/login', loginUser);
routes.get('/credit', userAuth, userCredit);
routes.post('/pay-razorpay', userAuth, paymentRazorpay);
routes.post('/verify', userAuth, verifyRazorPayment);

export default routes



