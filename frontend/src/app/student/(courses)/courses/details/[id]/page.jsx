"use client";

// import VideoPlayer from "@/components/shared/VideoPlayer";
// import Wrapper from "@/components/shared/wrapper";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Skeleton } from '@/components/ui/skeleton';
// import { useAuthContext } from '@/context/auth-context';
// import { useStudentContext } from '@/context/student-context';
// import {
//   checkCoursePurchaseInfoService,
//   createPaymentService,
//   fetchStudentViewCourseDetailsService,
// } from "@/services";
// import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
// import { useParams, usePathname, useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// export default function Page() {
//   const { id } = useParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   const {
//     studentViewCourseDetails,
//     setStudentViewCourseDetails,
//     currentCourseDetailsId,
//     setCurrentCourseDetailsId,
//     loadingState,
//     setLoadingState,
//     setCoursePurchseId,
//   } = useStudentContext();

//   const { auth } = useAuthContext();
//   const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
//   const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
//   const [approvalUrl, setApprovalUrl] = useState("");

//   useEffect(() => {
//     if (id) {
//       setCurrentCourseDetailsId(Number(id));
//     }
//   }, [id]);

//   async function fetchStudentViewCourseDetails() {
//     try {
//       const courseId = Number(currentCourseDetailsId);

//       if (isNaN(courseId) || courseId <= 0) {
//         console.error("Invalid course ID:", currentCourseDetailsId);
//         setStudentViewCourseDetails(null);
//         setLoadingState(false);
//         return;
//       }

//       const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId);
//       if (response?.success) {
//         setStudentViewCourseDetails(response?.data);
//       } else {
//         console.error("Failed to fetch course details:", response?.message);
//         setStudentViewCourseDetails(null);
//       }
//     } catch (error) {
//       console.error("Error in fetchStudentViewCourseDetails:", error);
//       setStudentViewCourseDetails(null);
//     } finally {
//       setLoadingState(false);
//     }
//   }

//   function handleSetFreePreview(getCurrentVideoInfo) {
//     console.log(getCurrentVideoInfo);
//     setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
//   }

//   async function handleCreatePayment() {
//     const paymentPayload = {
//       userId: auth?.user?.id,
//       userName: auth?.user?.userName,
//       userEmail: auth?.user?.userEmail,
//       orderStatus: "pending",
//       paymentMethod: "paypal",
//       paymentStatus: "initiated",
//       orderDate: new Date(),
//       paymentId: "",
//       payerId: "",
//       instructorId: studentViewCourseDetails?.instructorId,
//       instructorName: studentViewCourseDetails?.instructorName,
//       courseImage: studentViewCourseDetails?.image,
//       courseTitle: studentViewCourseDetails?.title,
//       courseId: studentViewCourseDetails?.id,
//       coursePricing: studentViewCourseDetails?.pricing,
//     };

//     const response = await createPaymentService(paymentPayload);

//     if (response.success) {
//       sessionStorage.setItem(
//         "currentOrderId",
//         JSON.stringify(response?.data?.orderId)
//       );
//       setApprovalUrl(response?.data?.approveUrl);
//     }
//   }

//   useEffect(() => {
//     if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
//   }, [displayCurrentVideoFreePreview]);

//   useEffect(() => {
//     if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
//   }, [currentCourseDetailsId]);

//   useEffect(() => {
//     if (!pathname.includes('courses/details')) {
//       setStudentViewCourseDetails(null);
//       setCurrentCourseDetailsId(null);
//       setCoursePurchseId(null);
//     }
//   }, [pathname, setStudentViewCourseDetails, setCurrentCourseDetailsId, setCoursePurchseId]);

//   useEffect(() => {
//     if (approvalUrl) {
//       router.push(approvalUrl);
//     }
//   }, [approvalUrl, router]);

//   const getIndexOfFreePreviewUrl =
//     studentViewCourseDetails !== null
//       ? studentViewCourseDetails?.curriculum?.findIndex(
//           (item) => item.freePreview
//         )
//       : -1;

//   if (loadingState) return <Skeleton className="w-full h-screen" />;

//   return (
//     <>
//       <Wrapper className="px-4 py-8">
//         <div className="bg-[#122449] text-white p-8 rounded-t-lg">
//           <h1 className="text-3xl font-bold mb-4">
//             {studentViewCourseDetails?.title}
//           </h1>
//           <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
//           <div className="flex items-center space-x-4 mt-2 text-sm">
//             <span>Created By {studentViewCourseDetails?.instructorName}</span>
//             <span>Created On {studentViewCourseDetails?.date?.split("T")[0]}</span>
//             <span className="flex items-center">
//               <Globe className="mr-1 h-4 w-4" />
//               {studentViewCourseDetails?.primaryLanguage}
//             </span>
//             <span>
//               {studentViewCourseDetails?.students?.length || 0}{" "}
//               {(studentViewCourseDetails?.students?.length || 0) <= 1
//                 ? "Student"
//                 : "Students"}
//             </span>
//           </div>
//         </div>
//         <div className="flex flex-col md:flex-row gap-8 mt-8">
//           <main className="flex-grow">
//             <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
//               <CardHeader>
//                 <CardTitle className="font-bold text-xl">What you'll learn</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {studentViewCourseDetails?.objectives
//                     ?.split(",")
//                     .map((objective, index) => (
//                       <li key={`objective-${index}`} className="flex items-start">
//                         <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
//                         <span>{objective.trim()}</span>
//                       </li>
//                     ))}
//                 </ul>
//               </CardContent>
//             </Card>
//             <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
//               <CardHeader>
//                 <CardTitle className="font-bold text-xl">Course Description</CardTitle>
//               </CardHeader>
//               <CardContent>{studentViewCourseDetails?.description}</CardContent>
//             </Card>
//             <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
//               <CardHeader>
//                 <CardTitle className="font-bold text-2xl">Course Curriculum</CardTitle>
//               </CardHeader>
//               <CardContent className="text-[16px]">
//                 <ul>
//                   {studentViewCourseDetails?.curriculum?.map(
//                     (curriculumItem, index) => (
//                       <li
//                         key={`curriculum-${curriculumItem?.id || index}`}
//                         className={`${
//                           curriculumItem?.freePreview
//                             ? "cursor-pointer"
//                             : "cursor-not-allowed"
//                         } flex items-center mb-4`}
//                         onClick={
//                           curriculumItem?.freePreview
//                             ? () => handleSetFreePreview(curriculumItem)
//                             : null
//                         }
//                       >
//                         {curriculumItem?.freePreview ? (
//                           <PlayCircle className="mr-2 h-4 w-4" />
//                         ) : (
//                           <Lock className="mr-2 h-4 w-4" />
//                         )}
//                         <span>{curriculumItem?.title}</span>
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>
//           </main>
//           <aside className="w-full md:w-[500px]">
//             <Card className="sticky top-4 bg-[#3a4e76] text-white border-gray-500">
//               <CardContent className="p-6">
//                 <div className="aspect-video mb-4 rounded-lg flex items-center justify-center bg-[#0d1f43]">
//                   <VideoPlayer
//                     url={
//                       getIndexOfFreePreviewUrl !== -1
//                         ? studentViewCourseDetails?.curriculum[
//                             getIndexOfFreePreviewUrl
//                           ]?.videoUrl
//                         : ""
//                     }
//                     width="450px"
//                     height="200px"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <span className="text-3xl font-bold">
//                     ${studentViewCourseDetails?.pricing}
//                   </span>
//                 </div>
//                 <Button onClick={handleCreatePayment} className="w-full">
//                   Buy Now
//                 </Button>
//               </CardContent>
//             </Card>
//           </aside>
//         </div>
//         <Dialog
//           open={showFreePreviewDialog}
//           onOpenChange={() => {
//             setShowFreePreviewDialog(false);
//             setDisplayCurrentVideoFreePreview(null);
//           }}
//         >
//           <DialogContent className="w-[800px] bg-[#1a305b] text-white border-gray-500">
//             <DialogHeader>
//               <DialogTitle>Course Preview</DialogTitle>
//             </DialogHeader>
//             <div className="aspect-video rounded-lg flex items-center justify-center bg-[#0d1f43]">
//               <VideoPlayer
//                 url={displayCurrentVideoFreePreview}
//                 width="450px"
//                 height="200px"
//               />
//             </div>
//             <div className="flex flex-col gap-2">
//               {studentViewCourseDetails?.curriculum
//                 ?.filter((item) => item.freePreview)
//                 .map((filteredItem, index) => (
//                   <p
//                     key={`preview-${filteredItem?.id || index}`}
//                     onClick={() => handleSetFreePreview(filteredItem)}
//                     className="cursor-pointer text-[16px] font-medium"
//                   >
//                     {filteredItem?.title}
//                   </p>
//                 ))}
//             </div>
//             <DialogFooter className="sm:justify-start">
//               <DialogClose asChild>
//                 <Button type="button" variant="secondary">
//                   Close
//                 </Button>
//               </DialogClose>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </Wrapper>
//     </>
//   );
// }

import VideoPlayer from "@/components/shared/VideoPlayer";
import Wrapper from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/auth-context";
import { useStudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
    setCoursePurchseId,
  } = useStudentContext();

  const { auth } = useAuthContext();
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const [localCourseId, setLocalCourseId] = useState(null);


  useEffect(() => {
    if (id) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        setLocalCourseId(numericId);
        setCurrentCourseDetailsId(numericId);
        setStudentViewCourseDetails(null);
        setLoadingState(true);
      }
    }
  }, [
    id,
    setCurrentCourseDetailsId,
    setStudentViewCourseDetails,
    setLoadingState,
  ]);


  async function fetchStudentViewCourseDetails() {
    try {
      const courseId = localCourseId;

      if (isNaN(courseId) || courseId <= 0) {
        console.error("Invalid course ID:", courseId);
        setStudentViewCourseDetails(null);
        setLoadingState(false);
        return;
      }

      console.log("Fetching course details for ID:", courseId);
      const response = await fetchStudentViewCourseDetailsService(courseId);

      if (response?.success) {
        setStudentViewCourseDetails(response?.data);
      } else {
        console.error("Failed to fetch course details:", response?.message);
        setStudentViewCourseDetails(null);
      }
    } catch (error) {
      console.error("Error in fetchStudentViewCourseDetails:", error);
      setStudentViewCourseDetails(null);
    } finally {
      setLoadingState(false);
    }
  }



  useEffect(() => {
    if (localCourseId !== null) {
      fetchStudentViewCourseDetails();
    }
  }, [localCourseId]);

  function handleSetFreePreview(getCurrentVideoInfo) {
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    if (!auth) {
      console.log("auth : ",auth)
      console.error("User is not authenticated");
      return;
    }
    console.log("auth : ",auth)
    const paymentPayload = {
      userId: auth?.id,
      userName: auth?.userName,
      userEmail: auth?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: auth?.user?.id || "15",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?.id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log("paymenr payload : ",paymentPayload)
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);


  useEffect(() => {
    if (!pathname.includes("courses/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
      setCoursePurchseId(null);
      setLocalCourseId(null);
    }
  }, [
    pathname,
    setStudentViewCourseDetails,
    setCurrentCourseDetailsId,
    setCoursePurchseId,
  ]);

  useEffect(() => {
    if (approvalUrl) {
      router.push(approvalUrl);
    }
  }, [approvalUrl, router]);

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;


  if (loadingState || !studentViewCourseDetails) {
    return (
      <Wrapper className="px-4 py-8">
        <div className="bg-[#122449] text-white p-8 rounded-t-lg">
          <Skeleton className="h-8 w-3/4 bg-gray-500 mb-4" />
          <Skeleton className="h-6 w-1/2 bg-gray-500 mb-4" />
          <div className="flex items-center space-x-4 mt-2">
            <Skeleton className="h-4 w-32 bg-gray-500" />
            <Skeleton className="h-4 w-40 bg-gray-500" />
            <Skeleton className="h-4 w-24 bg-gray-500" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <main className="flex-grow">
            <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
              <CardHeader>
                <CardTitle className="font-bold text-xl">
                  What you'll learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-6 w-full bg-gray-500 mb-2" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Skeleton className="h-56 w-full bg-gray-500 mb-8" />
            <Skeleton className="h-64 w-full bg-gray-500" />
          </main>
          <aside className="w-full md:w-[500px]">
            <Card className="sticky top-4 bg-[#3a4e76] text-white border-gray-500">
              <CardContent className="p-6">
                <Skeleton className="aspect-video mb-4 bg-gray-500" />
                <Skeleton className="h-8 w-24 bg-gray-500 mb-4" />
                <Skeleton className="h-10 w-full bg-gray-500" />
              </CardContent>
            </Card>
          </aside>
        </div>
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper className="px-4 py-8">
        <div className="bg-[#122449] text-white p-8 rounded-t-lg">
          <h1 className="text-3xl font-bold mb-4">
            {studentViewCourseDetails?.title}
          </h1>
          <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
            <span>Created By {studentViewCourseDetails?.instructorName}</span>
            <span>
              Created On {studentViewCourseDetails?.date?.split("T")[0]}
            </span>
            <span className="flex items-center capitalize">
              <Globe className="mr-1 h-4 w-4" />
              {studentViewCourseDetails?.primaryLanguage}
            </span>
            <span>
              {studentViewCourseDetails?.students?.length || 0}{" "}
              {(studentViewCourseDetails?.students?.length || 0) <= 1
                ? "Student"
                : "Students"}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <main className="flex-grow">
            <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
              <CardHeader>
                <CardTitle className="font-bold text-xl">
                  What you'll learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {studentViewCourseDetails?.objectives
                    ?.split(",")
                    .map((objective, index) => (
                      <li
                        key={`objective-${index}`}
                        className="flex items-start"
                      >
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{objective.trim()}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
              <CardHeader>
                <CardTitle className="font-bold text-xl">
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>{studentViewCourseDetails?.description}</CardContent>
            </Card>
            <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  Course Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[16px]">
                {studentViewCourseDetails?.curriculum?.length > 0 ? (
                  <ul>
                    {studentViewCourseDetails?.curriculum?.map(
                      (curriculumItem, index) => (
                        <li
                          key={`curriculum-${curriculumItem?.id || index}`}
                          className={`${
                            curriculumItem?.freePreview
                              ? "cursor-pointer"
                              : "cursor-not-allowed"
                          } flex items-center mb-4`}
                          onClick={
                            curriculumItem?.freePreview
                              ? () => handleSetFreePreview(curriculumItem)
                              : null
                          }
                        >
                          {curriculumItem?.freePreview ? (
                            <PlayCircle className="mr-2 h-4 w-4" />
                          ) : (
                            <Lock className="mr-2 h-4 w-4" />
                          )}
                          <span>{curriculumItem?.title}</span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>No curriculum items available for this course.</p>
                )}
              </CardContent>
            </Card>
          </main>
          <aside className="w-full md:w-[500px]">
            <Card className="sticky top-4 bg-[#3a4e76] text-white border-gray-500">
              <CardContent className="p-6">
                <div className="aspect-video mb-4 rounded-lg flex items-center justify-center bg-[#0d1f43]">
                  <VideoPlayer
                    url={
                      getIndexOfFreePreviewUrl !== -1
                        ? studentViewCourseDetails?.curriculum[
                            getIndexOfFreePreviewUrl
                          ]?.videoUrl || ""
                        : ""
                    }
                    width="450px"
                    height="200px"
                  />
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold">
                    ${studentViewCourseDetails?.pricing}
                  </span>
                </div>
                <Button onClick={handleCreatePayment} className="w-full">
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
        <Dialog
          open={showFreePreviewDialog}
          onOpenChange={() => {
            setShowFreePreviewDialog(false);
            setDisplayCurrentVideoFreePreview(null);
          }}
        >
          <DialogContent className="w-[800px] bg-[#1a305b] text-white border-gray-500">
            <DialogHeader>
              <DialogTitle>Course Preview</DialogTitle>
            </DialogHeader>
            <div className="aspect-video rounded-lg flex items-center justify-center bg-[#0d1f43]">
              <VideoPlayer
                url={displayCurrentVideoFreePreview}
                width="450px"
                height="200px"
              />
            </div>
            <div className="flex flex-col gap-2">
              {studentViewCourseDetails?.curriculum
                ?.filter((item) => item.freePreview)
                .map((filteredItem, index) => (
                  <p
                    key={`preview-${filteredItem?.id || index}`}
                    onClick={() => handleSetFreePreview(filteredItem)}
                    className="cursor-pointer text-[16px] font-medium"
                  >
                    {filteredItem?.title}
                  </p>
                ))}
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Wrapper>
    </>
  );
}
