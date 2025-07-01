"use client";

import AuthProvider from "@/context/auth-context";
import InstructorContext from "@/context/instructor-context";
import StudentProvider from "@/context/student-context";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RouteGuard from "../components/common-form/Route-guard";
import { useAuthContext } from "../context/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function ProtectedLayout({ children }) {
  const { auth } = useAuthContext();

  return (
    <RouteGuard 
      authenticated={auth?.authenticate} 
      user={auth?.role}
    >
      {children}
    </RouteGuard>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <AuthProvider>
          <InstructorContext>
            <StudentProvider>
              <ProtectedLayout>
                {children}
              </ProtectedLayout>
            </StudentProvider>
          </InstructorContext>
        </AuthProvider>
      </body>
    </html>
  );
}