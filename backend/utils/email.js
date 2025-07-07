import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "824b51001@smtp-brevo.com",
    pass: "4XmcEptzKDWkbqy0",
  },
});

// const transporter = {
//   sendMail: (mailOtions) => {
//     return;
//   }
// }

export { transporter };
