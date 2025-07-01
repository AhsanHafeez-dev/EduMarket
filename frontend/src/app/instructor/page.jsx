"use client"

import Courses from '@/components/instructor-view/Courses';
import Dashboard from '@/components/instructor-view/Dashboard';
import Wrapper from '@/components/shared/wrapper';
import { Button } from '@/components/ui/button';
import { useAuthContext } from "@/context/auth-context";
import { Tabs, TabsContent } from '@radix-ui/react-tabs';
import { BarChart, Book, LogOut } from 'lucide-react';
import React, { useState } from 'react';

function page() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const { resetCredentials } = useAuthContext()

  
  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component:<Dashboard/>,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component:<Courses/>,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
   localStorage.clear();
  }

  return (
    <>
    <Wrapper className='w-full'>
    <div className="flex h-full min-h-screen relative">
      <aside className="max-w-64 border-r border-slate-500 bg-[#152647] shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4 mt-3 text-mainheading">Instructor View</h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
              className="w-full justify-start mb-4 bg-amber-50"
              key={menuItem.value}
              variant={activeTab === menuItem.value ? "ghost" : "secondary"}
              onClick={
                menuItem.value === "logout"
                  ? handleLogout
                  : () => setActiveTab(menuItem.value)
              }
            >
              <menuItem.icon className="mr-2 h-4 w-4" />
              {menuItem.label}
            </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-mainheading">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent key={menuItem.value} value={menuItem.value}>
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      </div>
    </Wrapper>
    </>
  )
}

export default page;