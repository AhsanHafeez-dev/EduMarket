import React from 'react'
import Navbar from "@/components/layout/Navbar"
function layout({children}) {
  return (
    <>
    <Navbar/>
    {children}
    </>
  )
}

export default layout