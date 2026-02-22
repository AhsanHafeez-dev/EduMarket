-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_moduleId_fkey";

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
