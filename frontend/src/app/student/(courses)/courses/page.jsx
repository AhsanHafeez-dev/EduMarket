"use client"

import Wrapper from '@/components/shared/wrapper';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { filterOptions, sortOptions } from '@/config';
import { useAuthContext } from "@/context/auth-context";
import { useStudentContext } from '@/context/student-context';
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/services";
import CourseLoader from "@/components/shared/Course-loader"
import { FilterIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function page() {
const [sort , setSort] = useState("price-lowtohigh")
const [filters, setFilters] = useState({});
const [loading,setLoading] = useState(true)
const router = useRouter()

const { auth } = useAuthContext()

const {
  studentViewCoursesList,
  setStudentViewCoursesList,
  loadingState,
  setLoadingState,
} = useStudentContext();

function handleFilterOnChange(getSectionId, getCurrentOption) {
  let cpyFilters = { ...filters };
  const indexOfCurrentSeection =
    Object.keys(cpyFilters).indexOf(getSectionId);

  console.log(indexOfCurrentSeection, getSectionId);
  if (indexOfCurrentSeection === -1) {
    cpyFilters = {
      ...cpyFilters,
      [getSectionId]: [getCurrentOption.id],
    };

    console.log(cpyFilters);
  } else {
    const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
      getCurrentOption.id
    );

    if (indexOfCurrentOption === -1)
      cpyFilters[getSectionId].push(getCurrentOption.id);
    else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
  }

  setFilters(cpyFilters);
  sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
}

async function fetchAllStudentViewCourses(filters, sort) {
  const query = new URLSearchParams({
    ...filters,
    sortBy: sort,
  });
  const response = await fetchStudentViewCourseListService(query);
  if (response?.success) {
    setStudentViewCoursesList(response?.data);
    setLoadingState(false);
  }
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
  setSort("price-lowtohigh");
  setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
}, []);

useEffect(() => {
  if (filters !== null && sort !== null)
    fetchAllStudentViewCourses(filters, sort);
}, [filters, sort]);

useEffect(() => {
  return () => {
    sessionStorage.removeItem("filters");
  };
}, []);





  return (
    <Wrapper>
       <div className="container p-4 px-8">
      <h1 className="text-4xl text-mainheading font-bold mb-8 mt-3">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div className="space-y-9 p-3">
            {
             Object.keys(filterOptions).map(KeyItem=>
              <div key={KeyItem} className='flex flex-col'>
              <h2 className='text-xl font-semibold text-text mb-4'>{KeyItem.toUpperCase()}</h2>
              <div className='grid cols-1 space-y-4'>
               {
                filterOptions[KeyItem].map(option=>
                <Label key={option.id} className='flex gap-x-2 gap-y-3 item-center'>
                  <Checkbox
                   checked={
                     filters && 
                     Object.keys(filters).length > 0 && 
                     filters[KeyItem] &&
                     filters[KeyItem].indexOf(option.id) > -1
                   }
                   key={option.id}
                   onCheckedChange={(value)=>handleFilterOnChange(KeyItem,option)}
                  />
                  <span className='text-text text-[14px]'>{option.label}</span>
                </Label>  
               )}
              </div>
       </div>
            )}
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <FilterIcon className="h-4 w-4" />
                  <span className="text-[16px] font-semibold">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] bg-neutral-200 text-black font-semibold">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="hover:bg-blue-500"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-black bg-white p-3 rounded-md font-bold">
              {studentViewCoursesList.length} Results
            </span>
            </div>

            <div className="space-y-4">
            {studentViewCoursesList.length > 0 ? 
              studentViewCoursesList.map((courseItem) => (
               <Card
                  onClick={() => handleCourseNavigate(courseItem?.id)}
                  className="cursor-pointer border border-slate-700 bg-[#09203c]"
               key={courseItem?.id}
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        alt={courseItem?.title}
                        src={courseItem?.image}
                        className="w-ful h-full object-cover"
                      ></img>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-mainheading font-semibold text-xl mb-2">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-[14px] text-gray-300  mb-1">
                        Created By{" "}
                        <span className="font-semibold text-mainheading text-[15px]">
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <p className="text-[16px] text-gray-600 mt-3 mb-2">
                        {`${courseItem?.curriculum?.length} ${
                          courseItem?.curriculum?.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        } - ${courseItem?.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-lg text-red-900">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )): loading ? (
                <CourseLoader/>  
            ):(
              <h1 className="font-extrabold text-4xl text-mainheading text-center mr-10">No Courses Found</h1>
            )}
            </div>
            </main>
            </div>
            </div>
    </Wrapper>
  )
}

export default page