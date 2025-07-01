// "use client";

// import { useRouter } from "next/navigation";
// import CourseCurriculum from "@/components/instructor-view/addNewCourses/CourseCurriculum";
// import CourseLanding from "@/components/instructor-view/addNewCourses/CourseLanding";
// import CourseSettings from "@/components/instructor-view/addNewCourses/CourseSettings";
// import Wrapper from "@/components/shared/wrapper";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useAuthContext } from "@/context/auth-context";
// import { useInstructorContext } from "@/context/instructor-context";
// import {
//   fetchInstructorCourseDetailsService,
//   updateCourseByIdService,
// } from "@/services";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import {
//   courseCurriculumInitialFormData,
//   courseLandingInitialFormData,
// } from "@/config";
// import toast from "react-hot-toast";

// export default function AddEditCoursePage() {
//   const params = useParams();
//   const courseId = params?.courseId;
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (courseId) {
//       setCurrentEditedCourseId(courseId);
//     } else {
//       setCurrentEditedCourseId(null);
//     }
//   }, [courseId]);

//   const {
//     courseLandingFormData,
//    courseCurriculumFormData,
//     setCourseLandingFormData,
//     setCourseCurriculumFormData,
//     currentEditedCourseId,
//     setCurrentEditedCourseId,
//   } = useInstructorContext();

//   const { auth } = useAuthContext();

//   // function isEmpty(value) {
//   //   if (Array.isArray(value)) {
//   //     return value.length === 0;
//   //   }
//   //   return value === "" || value === null || value === undefined;
//   // }

//   // function validateFormData() {
//   //   for (const key in courseLandingFormData) {
//   //     if (isEmpty(courseLandingFormData[key])) {
//   //       return false;
//   //     }
//   //   }
//   //   let hasFreePreview = false;
//   //   for (const item of courseCurriculumFormData) {
//   //     if (
//   //       isEmpty(item.title) ||
//   //       isEmpty(item.videoUrl) ||
//   //       isEmpty(item.public_id)
//   //     ) {
//   //       return false;
//   //     }

//   //     if (item.freePreview) {
//   //       hasFreePreview = true;
//   //     }
//   //   }
//   //   return hasFreePreview;
//   // }

//   async function handleCreateCourse() {
//     if (isSubmitting) return;

//     try {
//       setIsSubmitting(true);

//       const { pricing, ...restOfData } = courseLandingFormData;
//       const priceValue = parseFloat(pricing) || 0;

//       const courseFinalFormData = {
//         instructorId: String(auth.id),
//         instructorName: auth.userName,
//         date: new Date(),
//         ...restOfData,
//         pricing: priceValue,
//         students: {
//           create: [],
//         },
//         curriculum: {
//           create: courseCurriculumFormData.map((item) => ({
//             title: item.title,
//             videoUrl: item.videoUrl,
//             freePreview: item.freePreview,
//             publicId: item.publicId,
//           })),
//         },
//         isPublished: true,
//       };

//       console.log("final form data",courseCurriculumFormData);

//       const response = await updateCourseByIdService(
//         currentEditedCourseId,
//         courseFinalFormData
//       );

//       if (response?.success) {
//         setCourseLandingFormData(courseLandingInitialFormData);
//         setCourseCurriculumFormData(courseCurriculumInitialFormData);
//         setCurrentEditedCourseId(null);
//         toast.success("Course Edit Succesfully")
//         router.back();
//       }
//     } catch (error) {
//       console.error("Error submitting course:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   async function fetchCurrentCourseDetails() {
//     const response = await fetchInstructorCourseDetailsService(
//       currentEditedCourseId
//     );

//     if (response?.success) {
//       const setCourseFormData = Object.keys(
//         courseLandingInitialFormData
//       ).reduce((acc, key) => {
//         acc[key] = response?.data[key] || courseLandingInitialFormData[key];

//         return acc;
//       }, {});

//       setCourseLandingFormData(setCourseFormData);
//       setCourseCurriculumFormData(response?.data?.curriculum);
//     }
//   }

//   useEffect(() => {
//     if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
//   }, [currentEditedCourseId]);

//   useEffect(() => {
//     if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
//   }, [params?.courseId]);

//   return (
//     <>
//       <Wrapper className="py-5 px-8">
//         <div className="flex justify-between mb-5">
//           <h1 className="text-mainheading text-3xl font-bold">
//             Edit Course
//           </h1>
//           <Button
//             size={"default"}
//             variant={"secondary"}
//             className="text-lg font-bold tracking-wide"
//             onClick={handleCreateCourse}
//           >
//             {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
//           </Button>
//         </div>
//         <Card className="rounded-md bg-[#384B70] border-none">
//           <CardContent>
//             <div className="container mx-auto p-4">
//               <Tabs defaultValue="curriculum" className="space-y-4">
//                 <TabsList className="flex items-center justify-center">
//                   <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
//                   <TabsTrigger value="course-landing-page">
//                     Course Landing Page
//                   </TabsTrigger>
//                   <TabsTrigger value="settings">Settings</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="curriculum">
//                   <CourseCurriculum />
//                 </TabsContent>
//                 <TabsContent value="course-landing-page">
//                   <CourseLanding />
//                 </TabsContent>
//                 <TabsContent value="settings">
//                   <CourseSettings />
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </CardContent>
//         </Card>
//       </Wrapper>
//     </>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import CourseCurriculum from "@/components/instructor-view/addNewCourses/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/addNewCourses/CourseLanding";
import CourseSettings from "@/components/instructor-view/addNewCourses/CourseSettings";
import Wrapper from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/auth-context";
import { useInstructorContext } from "@/context/instructor-context";
import {
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import toast from "react-hot-toast";

export default function AddEditCoursePage() {
  const params = useParams();
  const [courseId, setCourseId] = useState(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useInstructorContext();

  const { auth } = useAuthContext();

  useEffect(() => {
    if (params.courseId) {
      const id = params.courseId;
      console.log("Initial courseId from params:", id);
      setCourseId(id);
      setCurrentEditedCourseId(id);
    }
  }, [params.courseId, setCurrentEditedCourseId]);

  async function handleCreateCourse() {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const effectiveCourseId = courseId;

      if (!effectiveCourseId) {
        console.error("Missing courseId when trying to update course");
        return;
      }

      const { pricing, ...restOfData } = courseLandingFormData;
      const priceValue = parseFloat(pricing) || 0;

      const courseFinalFormData = {
        instructorId: String(auth.id),
        instructorName: auth.userName,
        date: new Date(),
        ...restOfData,
        pricing: priceValue,
        students: {
          update: [],
        },
        curriculum: {
          update: courseCurriculumFormData.map((item) => ({
            where: { id: item.id },
            data: {
              title: item.title,
              videoUrl: item.videoUrl,
              freePreview: item.freePreview,
              publicId: item.publicId,
            },
          })),
        },
        isPublished: true,
      };

      console.log("Final form data being sent:", {
        courseId: effectiveCourseId,
        formData: courseFinalFormData,
      });

      const response = await updateCourseByIdService(
        effectiveCourseId,
        courseFinalFormData
      );

      if (response?.success) {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        setCurrentEditedCourseId(null);
        toast.success("Course Edited Successfully");
        router.back();
      } else {
        toast.error(response?.message || "Failed to update course");
      }
    } catch (error) {
      console.error("Error submitting course:", error);
      toast.error(
        "Error updating course: " + (error.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function fetchCurrentCourseDetails() {
    try {
      setIsLoading(true);

      const effectiveCourseId = courseId;

      if (!effectiveCourseId) {
        console.error("No course ID available for fetching details");
        setIsLoading(false);
        return;
      }

      console.log("Fetching course details for ID:", effectiveCourseId);

      const response = await fetchInstructorCourseDetailsService(
        effectiveCourseId
      );

      if (response?.success) {
        const setCourseFormData = Object.keys(
          courseLandingInitialFormData
        ).reduce((acc, key) => {
          acc[key] = response?.data[key] || courseLandingInitialFormData[key];
          return acc;
        }, {});

        setCourseLandingFormData(setCourseFormData);
        setCourseCurriculumFormData(response?.data?.curriculum || []);
        console.log("Course details loaded successfully");
      } else {
        console.error("Failed to fetch course details:", response?.message);
        toast.error("Failed to load course details");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Error loading course data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (courseId) {
      fetchCurrentCourseDetails();
    }
  }, [courseId]);

  if (isLoading) {
    return (
      <Wrapper className="py-5 px-8">
        <div className="flex justify-center items-center h-96">
          <p className="text-xl text-white">Loading course data...</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper className="py-5 px-8">
        <div className="flex justify-between mb-5">
          <h1 className="text-mainheading text-3xl font-bold">
            Edit Course
          </h1>
          <Button
            size={"default"}
            variant={"secondary"}
            className="text-lg font-bold tracking-wide"
            onClick={handleCreateCourse}
            disabled={isSubmitting || !courseId}
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
          </Button>
        </div>
        <Card className="rounded-md bg-[#384B70] border-none">
          <CardContent>
            <div className="container mx-auto p-4">
              <Tabs defaultValue="curriculum" className="space-y-4">
                <TabsList className="flex items-center justify-center">
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="course-landing-page">
                    Course Landing Page
                  </TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="curriculum">
                  <CourseCurriculum />
                </TabsContent>
                <TabsContent value="course-landing-page">
                  <CourseLanding />
                </TabsContent>
                <TabsContent value="settings">
                  <CourseSettings />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </Wrapper>
    </>
  );
}
