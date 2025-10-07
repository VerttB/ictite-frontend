import { useState, useEffect } from "react"
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
export function useViewPort() {
  const [width, setWidth] = useState<number | null>(null)

 useEffect(() => {
      const updateWidth= () => setWidth(window.innerWidth)
    

    updateWidth() 
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])


   if (width === null) {
    return {
      isReady: false,
      isMobile: false,
      isTablet: false,
      isDesktop: false,
    }
  }
  return {
    isMobile: width < MOBILE_BREAKPOINT,
    isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
    isDesktop: width >= TABLET_BREAKPOINT,
    isReady: true,
  }
}
