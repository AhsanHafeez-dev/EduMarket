import { httpCodes,secureCookieOptions } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/ApiError.js";
import { prisma } from "../../prisma/index.js";
import {asyncHandler} from "../../utils/asyncHandler.js"
import {validateUserDetails} from "../../utils/validate.js"
import jwt from "jsonwebtoken"
import {EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE, WELCOME_TEMPLATE} from "../../utils/EmailTemplate.js"
import { transporter } from "../../utils/email.js";
import { addBulkToLowPriorityNotificationQueue,addToHighPriorityNotificationQueue,addToLowPriorityNotificationQueue } from "../../utils/notification.js";

const registerUser = async (req, res) => {
    
    console.log("revieved data ", req.body);
    
    let { userName, userEmail, password, role } = req.body;
    
    let registrationText ="Thank you for registering with us. We're excited to have you onboard! You can now explore our courses, track your     progress, and grow your skills.If you have any questions, feel free to reach out to our support team. Happy learning";
    
    if (!validateUserDetails(userName, userEmail, password, role)) {
      console.log("invalid data");
      res
        .status(httpCodes.badRequest)
        .json(new ApiError(httpCodes.badRequest, "Invalid data "));
      return;
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        userName,
        userEmail,
      },
    });

    if (existingUser) {
      console.log("user already exist returning error");
      res
        .status(httpCodes.badRequest)
        .json(
          new ApiError(
            httpCodes.badRequest,
            "user with this email already exists"
          )
        );
      return;
    }


    if (userEmail.endsWith("students.duet.edu.pk")) {
      console.log("registering student");
    
        role = "student";
    } else {
      console.log("registering teacher");
      role = "instructor";
    }
    

    
        console.log("going to send email functions")
  const mailOptions = {
    
     userEmail,
    subject: "Welcome to Duet Learning",
    
    html:WELCOME_TEMPLATE.replaceAll("{{name}}",userName)
  };
  addToLowPriorityNotificationQueue("registration email", mailOptions);
    
    
    
    password = await bcrypt.hash(password, 10);
    console.log("encryoted password");
    
    

    const createdUser = await prisma.user.create({
        data: {
            userName,
            userEmail,
            password,
            role
        }
        
    });
    console.log("user created successfully");
    res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, createdUser, "user created succesfully"));
    console.log("sending response")
    return;

};
const loginUser = async (req, res) => {
    console.log("handing requestt in auth-controller/login controller")
    console.log("data got ",req.body);
    const { userEmail, password } = req.body;
    
    if (!(userEmail && password)) {
        console.log("invalid user credentials sending error");
        throw new ApiError(httpCodes.badRequest, "user credential cannot be null");
        return;
    }
    console.log("quering db");
    const user = await prisma.user.findUnique({
        where: {
            userEmail
        }
    });
    console.log("got db response")
    
    if (!user) { console.log("userNotFound"); throw new ApiError(httpCodes.notFound, "User with this email doesnot exist"); return; }
    console.log("user founded");
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("password not correct");
    if (!isPasswordCorrect) {  return res.status(httpCodes.badRequest).json(new ApiResponse(httpCodes.badRequest,{},"wrong password")); }
    console.log("password is correct");
    const accessToken = jwt.sign({
        id: user.id,
        userEmail: user.userEmail,
        userName: user.userName,
        role:user.role
        
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    console.log("generated token");
    res
      .status(httpCodes.ok)
      .cookie("accessToken", accessToken,secureCookieOptions)
      .json(
        new ApiResponse(
          httpCodes.ok,
          {
            id: user.id,
            userEmail: user.userEmail,
            userName: user.userName,
            role: user.role,
            accessToken,
          },
          "successfully logged in user"
        )
      );

    console.log("sending response")
    return;



}

const logoutUser = async (req, res) => {
    console.log("logging out user");
    res.status(httpCodes.noContent).clearCookie("accessToken",secureCookieOptions).json(new ApiResponse(httpCodes.noContent, {}, "logout successfully"));
    return;

}

const sendVeirfyOtp = asyncHandler(
  async (req, res) => {
    const { userId } = req.body;

    const user = await prisma.user.findFirst({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      return res
        .status(httpCodes.notFound)
        .json(httpCodes.notFound, {}, "user with this id does not exist");
    }

    if (user.isAccountVerified) {
      return res
        .status(httpCodes.badRequest)
        .json(
          new ApiResponse(
            httpCodes.badRequest,
            {},
            "account is already verified"
          )
        );
    }

    const Otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifiyOtp = Otp;
    user.verifiyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await prisma.user.update({
      where: { id: userId },
      data: {
        verifiyOtp: user.verifiyOtp,
        verifiyOtpExpiresAt: user.verifiyOtpExpiresAt,
      },
    });
    // TODO: send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.userEmail,
      subject: "Email Verification",
      html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.userEmail)
    };
    
    addToHighPriorityNotificationQueue("send otp",mailOptions)

    res
      .status(httpCodes.ok)
      .json(new ApiResponse(httpCodes.ok, {}, "otp send successfully"));
  }
);

const verifyEmail = asyncHandler(
  async (req, res) => {
    const { userId, otp } = req.body;
    if (!(userId.trim() && otp.trim())) { return res.status(httpCodes.badRequest).json(new ApiResponse(httpCodes.badRequest, {}, "Empty UserId or otp")); }

    let user = await prisma.user.findUnique({ id: parseInt(userId) });
    
    if (!user) { return res.status(httpCodes.notFound).json(new ApiResponse(httpCodes.notFound, {}, "user with this id doesnot exist")); }

    if (!(user.verifiyOtp.trim()  && user.verifiyOtpExpiresAt < Date.now && user.verifiyOtp === otp ))
    { return res.status(httpCodes.unauthorized).json(httpCodes.unauthorized, {}, "Invalid otp"); }

    user = prisma.user.update({ where: { id: userId }, data: { isAccountVerified: true, verifiyOtp: "", verifiyOtpExpiresAt: 0 } })
    user.password = undefined;

    return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok,user,"email verified"))
    
  }
)


const sendPasswordResetOtp = asyncHandler(
  async (req, res) => {
    const { userId } = req.body;

    const user = await prisma.user.findFirst({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      return res
        .status(httpCodes.notFound)
        .json(httpCodes.notFound, {}, "user with this id does not exist");
    }

    if (user.isAccountVerified) {
      return res
        .status(httpCodes.badRequest)
        .json(
          new ApiResponse(
            httpCodes.badRequest,
            {},
            "account is already verified"
          )
        );
    }

    const Otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = Otp;
    user.resetOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await prisma.user.update({
      where: { id: userId },
      data: {
        resetOtp: user.resetOtp,
        resetOtpExpiresAt: user.resetOtpExpiresAt,
      },
    });

    // TODO: send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.userEmail,
      subject: "Password Reset Otp",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.userEmail),
    };
    addToHighPriorityNotificationQueue("password reset", mailOptions);
    

    res
      .status(httpCodes.ok)
      .json(new ApiResponse(httpCodes.ok, {}, "reset otp send successfully"));
  }
);

const resetPassword = asyncHandler(
  async (req, res) => {
    let { userId, otp,newPassword } = req.body;
    if (!(userId.trim() && otp.trim() && newPassword.trim()))
    { return res.status(httpCodes.badRequest).json(new ApiResponse(httpCodes.badRequest, {}, "Empty UserId,password or otp")); }

    let user = await prisma.user.findUnique({ id: parseInt(userId) });
    
    if (!user) { return res.status(httpCodes.notFound).json(new ApiResponse(httpCodes.notFound, {}, "user with this id doesnot exist")); }

    if (!(user.resetOtp.trim()  && user.resetOtpExpiresAt < Date.now && user.resetOtp === otp ))
    { return res.status(httpCodes.unauthorized).json(httpCodes.unauthorized, {}, "Invalid reset otp"); }
    
    newPassword = await bcrypt.hash(newPassword, process.env.HASH_ROUNDS);
    
    user = prisma.user.update({ where: { id: userId }, data: { password: newPassword, resetOtp: "", resetOtpExpiresAt: 0 } })
    user.password = undefined;

    return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok,user,"email verified"))
    
  }
)



export {
    registerUser,
    loginUser,
    logoutUser,
  sendVeirfyOtp,
  verifyEmail,
  sendPasswordResetOtp,
    resetPassword
}