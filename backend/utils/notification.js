import { Queue } from "bullmq";
import IORedis from "ioredis";
const connection = new IORedis();

const highPriorityQueue = new Queue('high-priority',{connection});
const lowPriorityQueue = new Queue('low-priority',{connection});

const addToLowPriorityNotificationQueue = async (name, data) => {
    
    const res = await lowPriorityQueue.add(name, data);
    console.log(`added job to low priority queue ${res.id}`);
    
 }

const addBulkToLowPriorityNotificationQueue = async (name,data) =>
{
    console.log("adding bulkd");
    console.log(data);
    console.log("Data ended");
    const jobs = data.map(item => ({ name, data:item }));
    console.log("jobs");
    console.log(jobs);
    const res=await lowPriorityQueue.addBulk(jobs);
    console.log("added bulk jobs to low priority queue");
 };


const addToHighPriorityNotificationQueue = async (name, data) => {
    
    const res = await highPriorityQueue.add(name, data);
    console.log(`added job to high priority queue ${res.id}`);
};


export {
    addBulkToLowPriorityNotificationQueue,
    addToHighPriorityNotificationQueue,
    addToLowPriorityNotificationQueue,
    highPriorityQueue,
    lowPriorityQueue
}