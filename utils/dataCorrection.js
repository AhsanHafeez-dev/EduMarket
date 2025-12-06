import {prisma} from "../prisma/index.js"
const addTags = async () => {
    let courses = await prisma.course.findMany({
      where: { isPublished: true },
    });
    for (let i = 0; i < courses.length; i++) {
      let tags =
        courses[i].objectives +
        " " +
        courses[i].title +
        " " +
        courses[i].category +
        " " +
        courses[i].description +
        " " +
        courses[i].date +
        " " +
        courses[i].welcomeMessage +
        " " +
        courses[i].instructorName +
        " " +
        courses[i].level +
        " ";
      tags = tags.toLowerCase();

      await prisma.course.update({
        where: { id: courses[i].id },
        data: { tags },
      });
    }
}