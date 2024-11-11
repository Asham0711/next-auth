/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import User from '@/models/user.model';

export const sendEmail = async ({email, emailType, userId}:any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,{
                $set: {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000}
            })
        } else if (emailType === "RESET"){
            await User.findByIdAndUpdate(userId,{
                $set: {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}
            })
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 2525,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from: 'ash@nextauth.com', // sender address
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }

        const mailresponse = await transporter.sendMail(mailOptions);
        return mailresponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}