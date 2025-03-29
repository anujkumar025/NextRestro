import { Router } from 'express';
import { handleRegister, handleVerifyEmail, handleSendOTP, handleResetPassword, handleLogin } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post("/register", handleRegister);            // to register a restaurant
authRouter.post("/verify-email", handleVerifyEmail);        // verify registered email by sending email
authRouter.post("/send-otp", handleSendOTP);            // when restaurant forgets passowrd, this will send email with otp for authentication
authRouter.post("/reset-password", handleResetPassword);      // client send otp with new password
authRouter.post("/login", handleLogin);               // helps login the restaurant

export default authRouter;