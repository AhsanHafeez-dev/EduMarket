"use client";

import { courseCategories } from "@/config";
import { useAuthContext } from "@/context/auth-context";
import { useStudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Wrapper from "../shared/wrapper";
import { Button } from "../ui/button";
import CourseLoader from "@/components/shared/Course-loader"

export default function Hero() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useStudentContext();
  const {auth} = useAuthContext()
  const router = useRouter()
  const [loading,setLoading] = useState(true)


  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) {
      console.log(response);
      setStudentViewCoursesList(response?.data);
      setLoading(false)
    }
  }

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    router.push("/student/courses");
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    console.log("checking course purchase info");
  const response = await checkCoursePurchaseInfoService(
    getCurrentCourseId,
    auth?.id,
    );
  

  if (response?.success) {
    if (response?.data) {
    router.push(`/student/course-progress/${getCurrentCourseId}`);
    } else {
  router.push(`/student/courses/details/${getCurrentCourseId}`);
    }
  }
}
  

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);


  return(
    <Wrapper>
      <div className="relative isolate overflow-hidden h-[85vh]">
        <div className="mx-auto py-12 lg:flex lg:items-center lg:gap-x-8 lg:px-8">
          <div className="lg:mx-0 lg:max-w-xl lg:flex-shrink-0 pl-2">
            <h1 className="mt-14 text-4xl leading-[62px] font-semibold tracking-tight text-foreground sm:text-6xl">
              <span className="text-mainheading text-pretty">
                Empower Your Learning Journey
              </span>
            </h1>
            <p className="mt-6 text-bodytext text-lg leading-8">
              Take control of your education with our all-in-one LMS platform.
              Seamlessly access courses, track progress, and achieve your goals
              anytime, anywhere.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href={"/student/courses"}>
                <Button className="bg-[#03346E] border border-amber-50 text-white w-44 font-semibold text-lg py-6 hover:bg-blue-200 hover:text-black">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto lg:mt-0">
            <div className="relative">
              <img
                src="/images/3966070-removebg-preview.png"
                alt="Flowers & Saints design concept"
                width={600}
                height={600}
                className="w-[640px] rounded-2xl shadow-xs ring-1 ring-gray-900/10 -mt-10"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="bg-[linear-gradient(1deg,_rgba(6,15,29,1)_57%,_rgba(25,51,71,1)_98%)] rounded-md py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-4xl font-semibold text-mainheading">
            Course Categories
          </h2>
          <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
            {courseCategories.map((categoryItem) => (
              <Button
                className="justify-start rounded-full hover:bg-gray-800 bg- hover:scale-[1.2] border border-gray-500"
                variant="outline"
                key={categoryItem.id}
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              >
                <span className="text-text text-[15px]">
                  {categoryItem.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-4xl font-semibold mb-10 text-mainheading">
          Featured Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {setStudentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                key={courseItem.id}
                onClick={() => handleCourseNavigate(courseItem?.id)}
                className="border border-[#384B70] bg-[#1d3c61] max-w-sm rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <img
                 src={courseItem?.image}
                  className="w-full h-40"
                  alt={courseItem.title}
                ></img>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-3 text-mainheading">
                    {courseItem?.title}
                  </h3>
                  <p className="text-[15px] text-text mb-3">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-[16px] text-text">
                    ${courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : loading ? (
            <CourseLoader/>
          ):(
         <h1 className="font-bold text-2xl text-mainheading text-center">No Courses Found</h1>
          )
          }
        </div>
      </section>
    </Wrapper>
  );
}
