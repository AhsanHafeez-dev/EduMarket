"use client";

import React from "react";
import { Button } from "../ui/button";
import { MdVideoLibrary } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth-context";

function Navbar() {
  const router = useRouter();
  const { resetCredentials } = useAuthContext();

  function handleLogout() {
    resetCredentials();
    localStorage.clear();
  }


  return (
    <>
      <header className="flex shadow-md py-4 px-4 sm:px-10 h-[70px] tracking-wide relative z-50 border-b border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-5 w-full">
          <div className="flex gap-x-8 items-center justify-between">
            <h2
              onClick={() => router.push("/")}
              className="font-semibold text-xl text-slate-100 cursor-pointer"
            >
              DUET LEARN
            </h2>
            <Button
              onClick={() => router.push("/student/courses")}
              className="bg-slate-300 rounded-full text-black hover:bg-blue-200 cursor-pointer"
            >
              Explore Courses
            </Button>
          </div>

          <div className="flex max-lg:ml-auto space-x-4 items-center justify-between">
            <h2
              onClick={() => router.push("/student/my-courses")}
              className="text-xl font-semibold text-slate-100 cursor-pointer"
            >
              My Courses
            </h2>
            <MdVideoLibrary className="text-slate-100" size={28} />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-full font-medium tracking-wide text-white border bg-[#03346E] hover:bg-blue-700 transition-all"
              >
                Sign out 
              </button>
            <button id="toggleOpen" className="lg:hidden"></button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
