'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RouteGuard({ authenticated, user, children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const handleRouting = () => {
      if (pathname === '/auth') {
        if (authenticated) {
          if (user === 'instructor') {
            router.replace('/instructor')
          } else {
            router.replace('/')
          }
          return false
        }
        return true
      }

      if (!authenticated) {
        router.replace('/auth')
        return false
      }

      if (pathname.includes('/instructor')) {
        if (user !== 'instructor') {
          router.replace('/')
          return false
        }
        return true
      }


      if (user === 'instructor' && !pathname.includes('/instructor')) {
        router.replace('/instructor')
        return false
      }

      return true
    }

    const canProceed = handleRouting()
    setIsChecking(false)
    
  }, [authenticated, user, pathname, router])

  if (isChecking) {
    return <Skeleton className="w-full h-screen" />
  }

  return <>{children}</>
}