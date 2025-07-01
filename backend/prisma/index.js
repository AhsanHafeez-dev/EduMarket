import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

// let l;
// l =await  prisma.courseProgress.findMany({include:{lectureProgress:true}});

// l.map(
//     async (courseProgress) => {
//         let count = 0;
//         console.log(courseProgress.lectureProgress);
//         courseProgress.lectureProgress.map((lp) => { if (lp.viewed) { count += 1; }; });
//         // console.log("count after map",count);
//         courseProgress.noOfLecturesViews = count;
//         courseProgress.lectureProgress = undefined;
//         await prisma.courseProgress.update({ where: { id: courseProgress.id }, data: courseProgress });
        
//      }
// );
// l = await prisma.courseProgress.findMany({  });
// console.log(l);
export { prisma };