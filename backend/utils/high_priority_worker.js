import { Worker } from "bullmq";
import { transporter } from "./email.js";


import IORedis from "ioredis";


const connection = new IORedis({ maxRetriesPerRequest: null});

const highPriorityWorker = new Worker("high-priority", async (job) => {
    
    console.log("processing high priority  email notifications ......");
    
    const mailOptions = {
      from: "mahadsiddiqui21@gmail.com",
      to: job.data.userEmail,
      subject: job.data.subject,
      html: job.data.html,
    };


    transporter.sendMail(mailOptions);
},
    {connection}
);
