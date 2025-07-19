import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Performance optimization hook for mobile devices
export function usePerformanceMode() {
  const [isPerformanceMode, setIsPerformanceMode] = React.useState(false)

  React.useEffect(() => {
    // Check if device is mobile or has reduced motion preference
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isLowEndDevice = navigator.hardwareConcurrency <= 4 // 4 cores or less
    
    setIsPerformanceMode(isMobile || prefersReducedMotion || isLowEndDevice)
  }, [])

  return isPerformanceMode
}
