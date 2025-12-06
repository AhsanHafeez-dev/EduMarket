import { Worker } from "bullmq";
import { transporter } from "./email.js";

import { connection } from "./notification.js";

export const highPriorityWorker = new Worker("high-priority", async (job) => {
    
  console.log("processing high priority  email notifications ......");
  // if you have more mails add here
    const all = [job.data.to];    
    const mailOptions = {
      from: "ahsanhafeez883@gmail.com",
      bcc: all.join(",")
      
      ,
      subject: job.data.subject,
      html: job.data.html,
      headers: {
        "X-Priority": "3", // normal priority
        "X-Mailer": "NodeMailer", // custom mailer header
      },
    };


  await transporter.sendMail(mailOptions);
  console.log(`sended ${job?.name}  to ${job.data.to}`);
},
    {connection}
);
