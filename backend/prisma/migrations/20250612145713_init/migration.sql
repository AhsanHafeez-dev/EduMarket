-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "noOfReplies" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "noOfComments" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "noOfComments" INTEGER NOT NULL DEFAULT 0;
