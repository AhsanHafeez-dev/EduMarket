import { Worker } from "bullmq";
import { transporter } from "./email.js";


import IORedis from "ioredis";
import {highPriorityQueue,lowPriorityQueue} from "./notification.js"

const connection = new IORedis({ maxRetriesPerRequest: null });

const lowPriorityWorker = new Worker("low-priority", async (job) => {
    
    console.log("processing email notifications ......");
    
    const mailOptions = {
      from: "mahadsiddiqui21@gmail.com",
      to: job.data.userEmail,
      subject: job.data.subject,
      html: job.data.html,
    };
    console.log(job.data);    

    transporter.sendMail(mailOptions);
},
    {connection,autorun:false}
);


const isHighPriorityEmpty = async () => {
    const counts = await highPriorityQueue.getJobCounts("waiting", "active", "delayed", "paused");
    return (counts.waiting + counts.active + counts.delayed + counts.paused) === 0;
    
}

const manage = async () => {
    console.log("managed called");
    if (!await isHighPriorityEmpty) {
        if (!lowPriorityWorker.isPaused) {
            lowPriorityWorker.pause();
            console.log("🔄 high priority jobs available pausing low priority jobs");
        }
     }
    
    else {
        if (lowPriorityWorker.isPaused) {
            lowPriorityWorker.resume();
            console.log(" ⏸️ high priority queue empty resuming low priority");
    }    
    }
}

lowPriorityWorker.on('completed', job => {
    console.log(`email successfully of job id :  ${job.id}`);
});

lowPriorityWorker.on("failed", job => {
    console.log(`email job ${job.id} failed `);
})

lowPriorityWorker.on("error", (job) => {
  console.log(`error in email job ${job.id}  `);
});


manage()