// "use client";

// import {
//   ChevronLeft,
//   ChevronRight,
//   Play
// } from "lucide-react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import Confetti from 'react-confetti';
// import { Button } from "../ui/button";
// import { Tabs, TabsContent, TabsList } from "@radix-ui/react-tabs";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Label } from "@radix-ui/react-label";
// import { Slider } from "@radix-ui/react-slider";


// export default function VideoPlayer({
//   width = "100%",
//   height = "100%",
//   url,
//   onProgressUpdate,
//   progressData,
// }) {
//   const [playing, setPlaying] = useState(false);
//   const [volume, setVolume] = useState(0.5);
//   const [muted, setMuted] = useState(false);
//   const [played, setPlayed] = useState(0);
//   const [seeking, setSeeking] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [showControls, setShowControls] = useState(true);

//   const playerRef = useRef(null);
//   const playerContainerRef = useRef(null);
//   const controlsTimeoutRef = useRef(null);

//   function handlePlayAndPause() {
//     setPlaying(!playing);
//   }

//   function handleProgress(state) {
//     if (!seeking) {
//       setPlayed(state.played);
//     }
//   }

//   function handleRewind() {
//     playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5);
//   }

//   function handleForward() {
//     playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5);
//   }

//   function handleToggleMute() {
//     setMuted(!muted);
//   }

//   function handleSeekChange(newValue) {
//     setPlayed(newValue[0]);
//     setSeeking(true);
//   }

//   function handleSeekMouseUp() {
//     setSeeking(false);
//     playerRef.current?.seekTo(played);
//   }

//   function handleVolumeChange(newValue) {
//     setVolume(newValue[0]);
//   }

//   function pad(string) {
//     return ("0" + string).slice(-2);
//   }

//   function formatTime(seconds) {
//     const date = new Date(seconds * 1000);
//     const hh = date.getUTCHours();
//     const mm = date.getUTCMinutes();
//     const ss = pad(date.getUTCSeconds());

//     if (hh) {
//       return `${hh}:${pad(mm)}:${ss}`;
//     }

//     return `${mm}:${ss}`;
//   }

//   const handleFullScreen = useCallback(() => {
//     if (!isFullScreen) {
//       if (playerContainerRef?.current.requestFullscreen) {
//         playerContainerRef?.current?.requestFullscreen();
//       }
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       }
//     }
//   }, [isFullScreen]);

//   function handleMouseMove() {
//     setShowControls(true);
//     clearTimeout(controlsTimeoutRef.current);
//     controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
//   }

//   useEffect(() => {
//     const handleFullScreenChange = () => {
//       setIsFullScreen(document.fullscreenElement);
//     };

//     document.addEventListener("fullscreenchange", handleFullScreenChange);

//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullScreenChange);
//     };
//   }, []);

//   useEffect(() => {
//     if (played === 1) {
//       onProgressUpdate({
//         ...progressData,
//         progressValue: played,
//       });
//     }
//   }, [played]);

//   return (
//     <>
//      <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
//       {}
//       <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
//         <div className="flex items-center space-x-4">
//           <Button
//             onClick={() => navigate("/student-courses")}
//             className="text-black"
//             variant="ghost"
//             size="sm"
//           >
//             <ChevronLeft className="h-4 w-4 mr-2" />
//             Back to My Courses Page
//           </Button>
//           <h1 className="text-lg font-bold hidden md:block">
//             {studentCurrentCourseProgress?.courseDetails?.title}
//           </h1>
//         </div>
//         <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
//           {isSideBarOpen ? (
//             <ChevronRight className="h-5 w-5" />
//           ) : (
//             <ChevronLeft className="h-5 w-5" />
//           )}
//         </Button>
//       </div>
//       <div className="flex flex-1 overflow-hidden">
//         <div
//           className={`flex-1 ${
//             isSideBarOpen ? "mr-[400px]" : ""
//           } transition-all duration-300`}
//         >
//           <VideoPlayer
//             width="100%"
//             height="500px"
//             url={currentLecture?.videoUrl}
//             onProgressUpdate={setCurrentLecture}
//             progressData={currentLecture}
//           />
//           <div className="p-6 bg-[#1c1d1f]">
//             <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
//           </div>
//         </div>
//         <div
//           className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
//             isSideBarOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           <Tabs defaultValue="content" className="h-full flex flex-col">
//             <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
//               <TabsTrigger
//                 value="content"
//                 className=" text-black rounded-none h-full"
//               >
//                 Course Content
//               </TabsTrigger>
//               <TabsTrigger
//                 value="overview"
//                 className=" text-black rounded-none h-full"
//               >
//                 Overview
//               </TabsTrigger>
//             </TabsList>
//             <TabsContent value="content">
//               <ScrollArea className="h-full">
//                 <div className="p-4 space-y-4">
//                   {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
//                     (item) => (
//                       <div
//                         className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
//                         key={item._id}
//                       >
//                         {studentCurrentCourseProgress?.progress?.find(
//                           (progressItem) => progressItem.lectureId === item._id
//                         )?.viewed ? (
//                           <Check className="h-4 w-4 text-green-500" />
//                         ) : (
//                           <Play className="h-4 w-4 " />
//                         )}
//                         <span>{item?.title}</span>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </ScrollArea>
//             </TabsContent>
//             <TabsContent value="overview" className="flex-1 overflow-hidden">
//               <ScrollArea className="h-full">
//                 <div className="p-4">
//                   <h2 className="text-xl font-bold mb-4">About this course</h2>
//                   <p className="text-gray-400">
//                     {studentCurrentCourseProgress?.courseDetails?.description}
//                   </p>
//                 </div>
//               </ScrollArea>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//       <Dialog open={lockCourse}>
//         <DialogContent className="sm:w-[425px]">
//           <DialogHeader>
//             <DialogTitle>You can't view this page</DialogTitle>
//             <DialogDescription>
//               Please purchase this course to get access
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//       <Dialog open={showCourseCompleteDialog}>
//         <DialogContent showOverlay={false} className="sm:w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Congratulations!</DialogTitle>
//             <DialogDescription className="flex flex-col gap-3">
//               <Label>You have completed the course</Label>
//               <div className="flex flex-row gap-3">
//                 <Button onClick={() => navigate("/student-courses")}>
//                   My Courses Page
//                 </Button>
//                 <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
//               </div>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//     </>
//   );
// }




"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  function handlePlayAndPause() {
    setPlaying(!playing);
  }

  function handleProgress(state) {
    if (!seeking) {
      setPlayed(state.played);
    }
  }

  function handleRewind() {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5);
  }

  function handleForward() {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5);
  }

  function handleToggleMute() {
    setMuted(!muted);
  }

  function handleSeekChange(newValue) {
    setPlayed(newValue[0]);
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  }

  function handleVolumeChange(newValue) {
    setVolume(newValue[0]);
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }

    return `${mm}:${ss}`;
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current.requestFullscreen) {
        playerContainerRef?.current?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  function handleMouseMove() {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (played === 1) {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played]);

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
      ${isFullScreen ? "w-screen h-screen" : ""}
      `}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />
      {showControls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className="w-full mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAndPause}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                onClick={handleRewind}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleForward}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleToggleMute}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                {muted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                className="w-24 "
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-white">
                {formatTime(played * (playerRef?.current?.getDuration() || 0))}/{" "}
                {formatTime(playerRef?.current?.getDuration() || 0)}
              </div>
              <Button
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;