import React from 'react'


function Wrapper({children, className}:{children:React.ReactNode ,className?:string}) {
  return (
  <>
  <section className={`max-w-7xl mx-auto ${className}`}>
  {children}
  </section>
  </>
  )
}

export default Wrapper