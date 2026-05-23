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
    // Initial check
    if (isMobile === undefined) {
      // setTimeout to avoid synchronous setState warning
      const timer = setTimeout(() => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT), 0)

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

      return () => {
        clearTimeout(timer)
        mql.removeEventListener("change", onChange)
      }
    }
    return () => mql.removeEventListener("change", onChange)
  }, [isMobile])

  return !!isMobile
}
