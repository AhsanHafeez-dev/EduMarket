"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CgAdd } from "react-icons/cg";
import { Button } from "../ui/button";

function Courses() {
  const { instructorCoursesList } = useInstructorContext();
  console.log(instructorCoursesList);

  return (
    <Card className="bg-[#152647]">
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold text-mainheading">
          All Courses
        </CardTitle>
        <Link href={"/instructor/add-new-course"}>
          <Button variant={"secondary"} className="font-bold text-md">
            <span>
              <CgAdd size={20} className="font-bold" />
            </span>
            Create new Course
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="text-text no-hover-effect">
            <TableHeader className="no-hover-effect">
              <TableRow>
                <TableHead className="text-text text-lg font-bold">
                  Course
                </TableHead>
                <TableHead className="text-text  text-lg font-bold">
                  Students
                </TableHead>
                <TableHead className="text-text  text-lg font-bold">
                  Revenue
                </TableHead>
                <TableHead className="text-text text-lg font-bold">
                  Amount
                </TableHead>
                <TableHead className="text-text text-lg font-bold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.isArray(instructorCoursesList) &&
              instructorCoursesList.length > 0 ? (
                instructorCoursesList.map((course) => (
                  <TableRow key={course.id} className="no-hover-effect">
                    <TableCell className="font-medium">
                      {course?.title}
                    </TableCell>
                    <TableCell>{course?.students?.length || 0}</TableCell>
                    <TableCell>
                      ${course?.students?.length * course?.pricing || 0}
                    </TableCell>
                    <TableCell>
                      ${course?.pricing || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/instructor/add-new-course/${course?.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-6 w-6" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Delete className="h-6 w-6" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-lg">
                    No courses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default Courses;
