import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.EMAIL as string;
const password = process.env.PASSWORD as string;
const clientUrl = process.env.CLIENT_URL as string;

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email,
        pass: password,
    },
});

export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationLink = `${clientUrl}/verify-email?token=${token}`;

    const mailOptions = {
        from: email,
        to,
        subject: "Verify Your Email",
        text: `Click on the link to verify your email: ${verificationLink}`,
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent to:", to);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
