"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/auth-context";
import { useStudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import ReactPlayer from "react-player";

function page() {
  const { auth } = useAuthContext();
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useStudentContext();
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();
  const router = useRouter();
  const [attendance , setAttendance] = useState(0)

  async function fetchCurrentCourseProgress() {
  

    if (!auth.id || !id) return;

    try {
      const response = await getCurrentCourseProgressService(auth.id, id);
      console.log("response of course progress: ", response);
          
      setAttendance(response?.data.attendance);

      if (response?.success) {
        if (!response?.data?.isPurchased) {
          setLockCourse(true);
        } else {
          if (response?.data?.courseDetails) {
            setStudentCurrentCourseProgress({
              courseDetails: response.data.courseDetails,
              progress: response.data.progress || [],
            });

            if (response.data.completed) {
              if (
                response.data.courseDetails?.curriculum &&
                response.data.courseDetails.curriculum.length > 0
              ) {
                setCurrentLecture(response.data.courseDetails.curriculum[0]);
                setShowCourseCompleteDialog(true);
                setShowConfetti(true);
                return;
              }
            }

            if (
              response.data.courseDetails?.curriculum &&
              response.data.courseDetails.curriculum.length > 0
            ) {
              if (
                !response.data.progress ||
                response.data.progress.length === 0
              ) {
                console.log("No progress, setting first lecture");
                setCurrentLecture(response.data.courseDetails.curriculum[0]);
              } else {
                console.log("Finding last viewed lecture");
                const lastIndexOfViewedAsTrue =
                  response.data.progress.reduceRight((acc, obj, index) => {
                    return acc === -1 && obj.viewed ? index : acc;
                  }, -1);

                const nextLectureIndex = Math.min(
                  lastIndexOfViewedAsTrue + 1,
                  response.data.courseDetails.curriculum.length - 1
                );

                setCurrentLecture(
                  response.data.courseDetails.curriculum[nextLectureIndex]
                );
              }
            } else {
              console.error("No curriculum found in the response");
            }
          } else {
            console.error("courseDetails not found in response");
          }
        }
      } else {
        console.error("Error fetching course progress:", response);
      }
    } catch (error) {
      console.error("Exception fetching course progress:", error);
    }
  }

  async function updateCourseProgress(lectureId = null) {
    console.log("updating progress");
    const lectureToUpdate = lectureId || currentLecture?.id;

    if (lectureToUpdate && studentCurrentCourseProgress?.courseDetails?.id) {
      try {
        const response = await markLectureAsViewedService(
          auth?.id,
          studentCurrentCourseProgress.courseDetails.id,
          lectureToUpdate
        );

        if (response?.success) {
          fetchCurrentCourseProgress();
        }
      } catch (error) {
        console.error("Error updating course progress:", error);
      }
    }
  }

  async function handleRewatchCourse() {
    console.log("handling rewatch");
    if (!studentCurrentCourseProgress?.courseDetails?.id) {
      console.error("Course details ID not available");
      return;
    }

    try {
      const response = await resetCourseProgressService(
        auth?.id,
        studentCurrentCourseProgress.courseDetails.id
      );

      if (response?.success) {
        setCurrentLecture(null);
        setShowConfetti(false);
        setShowCourseCompleteDialog(false);
        fetchCurrentCourseProgress();
      }
    } catch (error) {
      console.error("Error resetting course progress:", error);
    }
  }

  useEffect(() => {
    if (!auth?.id || !id) return;
    console.log("calling student for:", auth.id, id);
    fetchCurrentCourseProgress();
  }, [auth?.id, id]);

  useEffect(() => {
    console.log("course progress updated:", studentCurrentCourseProgress);
  }, [studentCurrentCourseProgress]);

  const handleVideoEnd = () => {
    if (
      !currentLecture ||
      !studentCurrentCourseProgress?.courseDetails?.curriculum
    )
      return;

    updateCourseProgress(currentLecture.id);

    const currentIndex =
      studentCurrentCourseProgress.courseDetails.curriculum.findIndex(
        (lecture) => lecture.id === currentLecture.id
      );

    if (
      currentIndex <
      studentCurrentCourseProgress.courseDetails.curriculum.length - 1
    ) {
      const nextLecture =
        studentCurrentCourseProgress.courseDetails.curriculum[currentIndex + 1];
      setCurrentLecture(nextLecture);
    } else {
      setShowCourseCompleteDialog(true);
      setShowConfetti(true);
    }
  };

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  if (!studentCurrentCourseProgress?.courseDetails?.curriculum) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1c1d1f] text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Loading course content...</h2>
          <div className="animate-pulse w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full mx-auto mt-4">
            <div className="w-16 h-16 border-4 border-gray-300 border-opacity-20 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const completedLectures =
    studentCurrentCourseProgress.progress?.filter((p) => p.viewed)?.length || 0;
  const totalLectures =
    studentCurrentCourseProgress.courseDetails.curriculum.length;
  const progressPercentage =
    totalLectures > 0
      ? Math.round((completedLectures / totalLectures) * 100)
      : 0;

  return (
    <>
      <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
        {showConfetti && <Confetti />}
        <div className="flex flex-col bg-[#1c1d1f] border-b border-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/student/my-courses")}
                className="bg-white text-black hover:bg-slate-400"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to My Courses Page
              </Button>
              <h1 className="text-lg font-bold hidden md:block">
                {studentCurrentCourseProgress?.courseDetails?.title ||
                  "Loading course..."}
              </h1>
            </div>
        
           <div className="flex gap-x-24 item-center pt-1">

           <span className="px-2.5 py-2  text-black rounded-full text-[14px] font-semibold bg-white">Attendance : {attendance.toFixed(2)}%</span>

            <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
              {isSideBarOpen ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-xl font-bold text-white">Course progress</span>
              <span>{progressPercentage}% complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div
            className={`flex-1 ${
              isSideBarOpen ? "mr-[400px]" : ""
            } transition-all duration-300`}
          >
            <div className="w-full h-[500px] bg-black flex items-center justify-center">
              {currentLecture?.videoUrl ? (
                <ReactPlayer
                  url={currentLecture.videoUrl}
                  controls
                  playing
                  width="100%"
                  height="500px"
                  onEnded={handleVideoEnd}
                />
              ) : (
                <div className="text-center">
                  <p>No video selected</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-[#1c1d1f]">
              <h2 className="text-2xl font-bold mb-2">
                {currentLecture?.title || "Select a lecture"}
              </h2>
            </div>
          </div>
          <div
            className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
              isSideBarOpen ? "translate-x-0" : "translate-x-full text-white"
            }`}
          >
            <Tabs defaultValue="content" className="h-full flex flex-col">
              <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
                <TabsTrigger
                  value="content"
                  className="text-black rounded-none h-full"
                >
                  Course Content
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="text-black rounded-none h-full"
                >
                  Overview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="h-full">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {studentCurrentCourseProgress?.courseDetails?.curriculum?.map(
                      (item) => {
                        const isActive = currentLecture?.id === item.id;
                        const isViewed =
                          studentCurrentCourseProgress.progress?.find(
                            (p) => p.lectureId === item.id
                          )?.viewed;

                        return (
                          <div
                            key={item.id}
                            onClick={() => setCurrentLecture(item)}
                            className={
                              `flex items-center space-x-2 p-2 rounded hover:bg-gray-800 text-sm font-bold cursor-pointer ` +
                              (isActive
                                ? "text-blue-400 bg-gray-800"
                                : "text-white")
                            }
                          >
                            <div className="flex-shrink-0">
                              {isViewed ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : isActive ? (
                                <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Play className="h-3 w-3 text-white" />
                                </div>
                              ) : (
                                <div className="h-5 w-5 bg-gray-700 rounded-full flex items-center justify-center">
                                  <Play className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <span
                              className={
                                isViewed
                                  ? "line-through decoration-green-500"
                                  : ""
                              }
                            >
                              {item.title}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="overview" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">
                      About this course
                    </h2>
                    <p className="text-gray-400">
                      {studentCurrentCourseProgress?.courseDetails
                        ?.description || "No description available"}
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Dialog open={lockCourse}>
          <DialogContent className="sm:w-[425px]">
            <DialogHeader>
              <DialogTitle>You can't view this page</DialogTitle>
              <DialogDescription>
                Please purchase this course to get access
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={showCourseCompleteDialog}>
          <DialogContent className="sm:w-[425px] bg-gray-900 border-green-500">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center text-green-500">
                🎉 Congratulations! 🎉
              </DialogTitle>
              <div className="py-4 flex justify-center">
                <div className="rounded-full bg-green-500 bg-opacity-20 p-4">
                  <Check className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <DialogDescription className="flex flex-col gap-4 items-center">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-1">
                    You have completed the course
                  </p>
                  <p className="text-gray-400">
                    {studentCurrentCourseProgress?.courseDetails?.title}
                  </p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                <div className="flex flex-row gap-3 w-full mt-2">
                  <Button
                    onClick={() => router.push("/student/my-courses")}
                    className="flex-1 bg-gray-700 hover:bg-gray-600"
                  >
                    My Courses
                  </Button>
                  <Button
                    onClick={handleRewatchCourse}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Rewatch Course
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default page;
