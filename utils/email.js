import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   auth: {
//     user: "824b51001@smtp-brevo.com",
//     pass: "4XmcEptzKDWkbqy0",
//   },
// });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahsanhafeez883@gmail.com", // your email
    pass: "teyv sauc trwe txam", // app password
  },
  tls: {
    rejectUnauthorized: false, // avoids self-signed cert issues
  },
});

// const transporter = {
//   sendMail: (mailOtions) => {
//     return;
//   }
// }
// "mehw250@gmail.com"
export { transporter };
