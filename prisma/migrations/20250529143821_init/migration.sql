-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "noOfLectures" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "CourseStudent" ADD COLUMN     "attendance" DOUBLE PRECISION DEFAULT 0;
