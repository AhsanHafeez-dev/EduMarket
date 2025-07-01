"use client"

import { useAuthContext } from '@/context/auth-context';
import { useStudentContext } from '@/context/student-context';
import { useRouter } from 'next/navigation';
import { fetchStudentBoughtCoursesService } from "@/services"
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React, { useEffect, useState } from 'react'
import { Watch } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import CourseLoader from "@/components/shared/Course-loader"

function StudentCoursesPage() {
  const { auth } = useAuthContext();
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useStudentContext();
  const router = useRouter();
  const [loading, setIsLoading] = useState(true)

  async function fetchStudentBoughtCourses() {
    if (!auth?.id) return;
    
    try {
      const response = await fetchStudentBoughtCoursesService(auth.id);
      if (response?.success) {
        console.log(response);
        setStudentBoughtCoursesList(response?.data);
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);


  if(loading){
     return <><CourseLoader/></>
  }


  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-mainheading">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card key={course.courseId} className="flex flex-col w-full items-center justify-center p-1 pb-4 bg-[#1d3c61] border-[#384B70]">
              <CardContent className="p-2 flex-grow self-start">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-52  w-full object-cover rounded-md mb-5"
                />
                <h3 className="font-bold text-lg mb-2 text-text">{course?.title}</h3>

                <p className="text-[15px] text-gray-200 mb-2">
                  {course?.instructorName}
                </p>
               <p className={`text-[15px] ${course?.attendance === 0 ? "text-red-500":"text-white"}`}>Attendance: {course.attendance === 0 ? 0 : course?.attendance.toFixed(2)}%</p>
        
              </CardContent>
              <CardFooter>
                <Link href={`/student/course-progress/${course?.courseId}`}>
                  <Button variant={"secondary"} className="w-64 text-[15px] font-bold p-2">
                    <Watch className="mr-2 h-4 w-4" />
                    Start Watching
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h1 className="text-3xl font-bold text-text">No Courses found</h1>
            <p className="text-gray-400 mt-2">You haven't purchased any courses yet</p>
          </div>
        )}
      </div>
    </div>
  );
  }

export default StudentCoursesPage;